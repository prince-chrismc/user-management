// MIT License

#include "user_database.hpp"

#include <restinio/cast_to.hpp>

namespace handler {
namespace user {
restinio::request_handling_status_t add::operator()(const restinio::request_handle_t &req,
                                                    restinio::router::route_params_t /*params*/) {
  try {
    const auto new_user = user_management::list_modifier(list_).add(nlohmann::json::parse(req->body()));

    return req->create_response()
        .append_header(restinio::http_field::access_control_allow_origin, "*")
        .append_header(restinio::http_field::content_type, "application/json")
        .append_header_date_field()
        .set_body(nlohmann::json(new_user).dump())
        .done();
  } catch (const std::exception &e) {
    return req->create_response(restinio::status_bad_request())
        .append_header(restinio::http_field::access_control_allow_origin, "*")
        .append_header(restinio::http_field::content_type, "application/json")
        .append_header_date_field()
        .set_body(nlohmann::json({{"error", e.what()}}).dump())
        .done();
  }
}

restinio::request_handling_status_t remove::operator()(const restinio::request_handle_t &req,
                                                       restinio::router::route_params_t params) {
  list_.remove(restinio::cast_to<int>(params["id"]));
  return req->create_response(restinio::status_no_content())
      .append_header(restinio::http_field::access_control_allow_origin, "*")
      .append_header_date_field()
      .done();
}

restinio::request_handling_status_t edit::operator()(const restinio::request_handle_t &req,
                                                     restinio::router::route_params_t params) {
  auto &user = list_.get(restinio::cast_to<int>(params["id"]));
  user_management::user_modifier(user).apply(nlohmann::json::parse(req->body()));

  return req->create_response()
      .append_header(restinio::http_field::accept_patch, "application/json")
      .append_header(restinio::http_field::access_control_allow_origin, "*")
      .append_header(restinio::http_field::content_type, "application/json")
      .append_header_date_field()
      .set_body(nlohmann::json(user).dump())
      .done();
}

restinio::request_handling_status_t get_user::operator()(const restinio::request_handle_t &req,
                                                         restinio::router::route_params_t params) {
  const auto user = list_.get(restinio::cast_to<int>(params["id"]));
  return req->create_response()
      .append_header(restinio::http_field::accept_patch, "application/json")
      .append_header(restinio::http_field::access_control_allow_origin, "*")
      .append_header(restinio::http_field::content_type, "application/json")
      .append_header_date_field()
      .set_body(nlohmann::json(user).dump())
      .done();
}

restinio::request_handling_status_t get_list::operator()(const restinio::request_handle_t &req,
                                                         restinio::router::route_params_t /*params*/) {
  return req->create_response()
      .append_header(restinio::http_field::access_control_allow_origin, "*")
      .append_header(restinio::http_field::content_type, "application/json")
      .append_header_date_field()
      .set_body(nlohmann::json(list_).dump())
      .done();
}

namespace preflight {
restinio::request_handling_status_t list(const restinio::request_handle_t &req,
                                         restinio::router::route_params_t /*params*/) {
  return req->create_response(restinio::status_no_content())
      .append_header(restinio::http_field::access_control_allow_origin, "*")
      .append_header(restinio::http_field::access_control_allow_methods, "GET, POST")
      .append_header(restinio::http_field::access_control_allow_headers, "Content-Type")
      .append_header(restinio::http_field::access_control_max_age, "86400")
      .done();
}
restinio::request_handling_status_t user(const restinio::request_handle_t &req,
                                         restinio::router::route_params_t /*params*/) {
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