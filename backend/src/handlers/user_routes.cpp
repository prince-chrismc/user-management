// MIT License

#include "user_routes.hpp"
#include "utility/response_builder.hpp"

#include <restinio/cast_to.hpp>

using user_management::user_does_not_exist;

namespace handler {
namespace user {
request_status add::operator()(const request_handle &req, route_params /*params*/) {
  try {
    const auto new_user = db_.add(nlohmann::json::parse(req->body()));

    return response::builder(req).set_body(nlohmann::json(new_user).dump()).done();
  } catch (const user_does_not_exist &e) {
    return response::error_builder<user_does_not_exist>(req).set_body(e).done();

    return req->create_response(restinio::status_not_found())
        .append_header(restinio::http_field::access_control_allow_origin, "*")
        .append_header(restinio::http_field::content_type, "application/json")
        .set_body(nlohmann::json({{"error", e.what()}}).dump())
        .done();
  } catch (const std::exception &e) {
    return req->create_response(restinio::status_bad_request())
        .append_header(restinio::http_field::access_control_allow_origin, "*")
        .append_header(restinio::http_field::content_type, "application/json")
        .set_body(nlohmann::json({{"error", e.what()}}).dump())
        .done();
  }
}

request_status remove::operator()(const request_handle &req, route_params params) {
  try {
    db_.remove(restinio::cast_to<size_t>(params["id"]));
    return req->create_response(restinio::status_no_content())
        .append_header(restinio::http_field::access_control_allow_origin, "*")
        .done();
  } catch (const user_does_not_exist &e) {
    return req->create_response(restinio::status_not_found())
        .append_header(restinio::http_field::access_control_allow_origin, "*")
        .append_header(restinio::http_field::content_type, "application/json")
        .set_body(nlohmann::json({{"error", e.what()}}).dump())
        .done();
  } catch (const std::exception &e) {
    return req->create_response(restinio::status_bad_request())
        .append_header(restinio::http_field::access_control_allow_origin, "*")
        .append_header(restinio::http_field::content_type, "application/json")
        .set_body(nlohmann::json({{"error", e.what()}}).dump())
        .done();
  }
}

request_status edit::operator()(const request_handle &req, route_params params) {
  try {
    const auto user = db_.edit(restinio::cast_to<size_t>(params["id"]), nlohmann::json::parse(req->body()));

    return response::builder(req).set_body(nlohmann::json(user).dump()).done();
  } catch (const user_does_not_exist &e) {
    return req->create_response(restinio::status_not_found())
        .append_header(restinio::http_field::access_control_allow_origin, "*")
        .append_header(restinio::http_field::content_type, "application/json")
        .set_body(nlohmann::json({{"error", e.what()}}).dump())
        .done();
  } catch (const std::exception &e) {
    return req->create_response(restinio::status_bad_request())
        .append_header(restinio::http_field::access_control_allow_origin, "*")
        .append_header(restinio::http_field::content_type, "application/json")
        .set_body(nlohmann::json({{"error", e.what()}}).dump())
        .done();
  }
}

request_status get_user::operator()(const request_handle &req, route_params params) {
  try {
    const auto user = db_.get(restinio::cast_to<size_t>(params["id"]));
    return response::builder(req).set_body(nlohmann::json(user).dump()).done();
  } catch (const user_does_not_exist &e) {
    return req->create_response(restinio::status_not_found())
        .append_header(restinio::http_field::access_control_allow_origin, "*")
        .append_header(restinio::http_field::content_type, "application/json")
        .set_body(nlohmann::json({{"error", e.what()}}).dump())
        .done();
  } catch (const std::exception &e) {
    return req->create_response(restinio::status_not_found())
        .append_header(restinio::http_field::access_control_allow_origin, "*")
        .append_header(restinio::http_field::content_type, "application/json")
        .set_body(nlohmann::json({{"error", e.what()}}).dump())
        .done();
  }
}

request_status get_list::operator()(const request_handle &req, route_params /*params*/) {
  return response::builder(req).set_body(nlohmann::json(db_).dump()).done();
}

namespace preflight {
request_status list(const request_handle &req, route_params /*params*/) {
  return req->create_response(restinio::status_no_content())
      .append_header(restinio::http_field::access_control_allow_origin, "*")
      .append_header(restinio::http_field::access_control_allow_methods, "GET, POST")
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
