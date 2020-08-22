// MIT License

#include "user_routes.hpp"

#include <restinio/cast_to.hpp>

#include "utility/response_builder.hpp"

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
    return response::builders::user(req).set_body(json(user).dump()).done();
  } catch (const user_does_not_exist &e) {
    return response::not_found(req).set_body(e).done();
  } catch (const std::exception &e) {
    return response::error_builder<std::exception>(req).set_body(e).done();
  }
}

request_status get_list::operator()(const request_handle &req, route_params /*params*/) {
  return response::builders::list(req).set_body(json(db_).dump()).done();
}

namespace preflight {
request_status list(const request_handle &req, route_params /*params*/) {
  return req->create_response(restinio::status_no_content())
      .append_header(restinio::http_field::access_control_allow_origin, "*")
      .append_header(restinio::http_field::access_control_allow_methods, "GET, PUT")
      .append_header(restinio::http_field::access_control_allow_headers, "Content-Type")
      .append_header(restinio::http_field::access_control_max_age, "86400")
      .done();
}
request_status user(const request_handle &req, route_params /*params*/) {
  return req->create_response(restinio::status_no_content())
      .append_header(restinio::http_field::access_control_allow_origin, "*")
      .append_header(restinio::http_field::access_control_allow_methods, "GET, PATCH, DELETE")
      .append_header(restinio::http_field::access_control_allow_headers, "Content-Type")
      .append_header(restinio::http_field::access_control_max_age, "86400")
      .done();
}
}  // namespace preflight
}  // namespace user
}  // namespace handler
