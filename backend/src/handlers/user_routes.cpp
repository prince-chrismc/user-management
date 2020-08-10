// MIT License

#include "user_routes.hpp"

#include <restinio/cast_to.hpp>

namespace handler {
namespace user {
request_status add::operator()(const request_handle &req, route_params /*params*/) {
  try {
    const auto new_user = user_management::list_modifier(list_).add(nlohmann::json::parse(req->body()));

    return req->create_response()
        .append_header(restinio::http_field::access_control_allow_origin, "*")
        .append_header(restinio::http_field::content_type, "application/json")
        .set_body(nlohmann::json(new_user).dump())
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
  list_.remove(restinio::cast_to<int>(params["id"]));
  return req->create_response(restinio::status_no_content())
      .append_header(restinio::http_field::access_control_allow_origin, "*")
      .done();
}

request_status edit::operator()(const request_handle &req, route_params params) {
  auto &user = list_.get(restinio::cast_to<int>(params["id"]));
  user_management::user_modifier(user).apply(nlohmann::json::parse(req->body()));

  return req->create_response()
      .append_header(restinio::http_field::access_control_allow_origin, "*")
      .append_header(restinio::http_field::content_type, "application/json")
      .set_body(nlohmann::json(user).dump())
      .done();
}

request_status get_user::operator()(const request_handle &req, route_params params) {
  const auto user = list_.get(restinio::cast_to<int>(params["id"]));
  return req->create_response()
      .append_header(restinio::http_field::access_control_allow_origin, "*")
      .append_header(restinio::http_field::content_type, "application/json")
      .set_body(nlohmann::json(user).dump())
      .done();
}

request_status get_list::operator()(const request_handle &req, route_params /*params*/) {
  return req->create_response()
      .append_header(restinio::http_field::access_control_allow_origin, "*")
      .append_header(restinio::http_field::content_type, "application/json")
      .set_body(nlohmann::json(list_).dump())
      .done();
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
