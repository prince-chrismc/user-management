// MIT License

#include "user_routes.hpp"

#include <restinio/cast_to.hpp>

#include "utility/response_builder.hpp"

using restinio::http_field;
namespace {
bool conditional_matching(const handler::request_handle &req, http_field field, std::string etag) {
  const auto maybeMatch = req->header().opt_value_of(http_field::if_none_match);
  if (maybeMatch.has_value()) {
    auto val = maybeMatch.value();
    // Trim quotes around ETag value
    val.remove_prefix(1);
    val.remove_suffix(1);

    return val == etag;
  }

  return false;
}
}  // namespace

using user_management::json;
using user_management::user_does_not_exist;

namespace handler {
namespace user {
request_status add::operator()(const request_handle &req, route_params /*params*/) {
  try {
    const auto new_user = db_.add(json::parse(req->body()));
    return response::builders::list(req).set_body(json(new_user).dump()).done();
  } catch (const user_does_not_exist &e) {
    return response::not_found(req).set_body(e).done();
  } catch (const std::exception &e) {
    return response::error_builder<std::exception>(req).set_body(e).done();
  }
}

request_status remove::operator()(const request_handle &req, route_params params) {
  try {
    db_.remove(restinio::cast_to<size_t>(params["id"]));
    return response::builders::user(req, restinio::status_no_content()).done();
  } catch (const user_does_not_exist &e) {
    return response::not_found(req).set_body(e).done();
  } catch (const std::exception &e) {
    return response::error_builder<std::exception>(req).set_body(e).done();
  }
}

request_status edit::operator()(const request_handle &req, route_params params) {
  try {
    const auto user = db_.edit(restinio::cast_to<size_t>(params["id"]), json::parse(req->body()));
    return response::builders::user(req).set_body(json(user).dump()).done();
  } catch (const user_does_not_exist &e) {
    return response::not_found(req).set_body(e).done();
  } catch (const std::exception &e) {
    return response::error_builder<std::exception>(req).set_body(e).done();
  }
}

request_status get_user::operator()(const request_handle &req, route_params params) {
  try {
    const auto user = db_.get(restinio::cast_to<size_t>(params["id"]));
    if (conditional_matching(req, http_field::if_none_match, db_.etag(user.id))) {
      return response::builders::list(req, restinio::status_not_modified()).done();
    }
    return response::builders::user(req).set_body(json(user).dump()).done();
  } catch (const user_does_not_exist &e) {
    return response::not_found(req).set_body(e).done();
  } catch (const std::exception &e) {
    return response::error_builder<std::exception>(req).set_body(e).done();
  }
}

request_status get_list::operator()(const request_handle &req, route_params /*params*/) {
  if (conditional_matching(req, http_field::if_none_match, db_.etag())) {
    return response::builders::list(req, restinio::status_not_modified()).done();
  }
  return response::builders::list(req).set_body(json(db_).dump()).done();
}

namespace preflight {
request_status list(const request_handle &req, route_params /*params*/) {
  return req->create_response(restinio::status_no_content())
      .append_header(http_field::access_control_allow_origin, "*")
      .append_header(http_field::access_control_allow_methods, "GET, PUT")
      .append_header(http_field::access_control_allow_headers, "Content-Type")
      .append_header(http_field::access_control_max_age, "86400")
      .done();
}
request_status user(const request_handle &req, route_params /*params*/) {
  return req->create_response(restinio::status_no_content())
      .append_header(http_field::access_control_allow_origin, "*")
      .append_header(http_field::access_control_allow_methods, "GET, PATCH, DELETE")
      .append_header(http_field::access_control_allow_headers, "Content-Type")
      .append_header(http_field::access_control_max_age, "86400")
      .done();
}
}  // namespace preflight
}  // namespace user
}  // namespace handler
