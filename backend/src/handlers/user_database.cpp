// MIT License

#include "user_database.hpp"

namespace handler {
namespace user {
restinio::request_handling_status_t add::operator()(const restinio::request_handle_t &req,
                                                    restinio::router::route_params_t params) {
  const auto new_user = user_management::list_modifier(list_).add(nholmann::json::parse(req->body()));

  return req->create_response().set_body("user content here....").done();
}

restinio::request_handling_status_t delete ::operator()(const restinio::request_handle_t &req,
                                                        restinio::router::route_params_t params) {
  return req->create_response(restinio::status_no_content()).done();
}

restinio::request_handling_status_t edit::operator()(const restinio::request_handle_t &req,
                                                     restinio::router::route_params_t params) {
  const auto new_user =
      user_management::user_modifier(list_.get(param["index"])).apply(nholmann::json::parse(req->body()));

  return req->create_response().set_body("user content here....").done();
}

restinio::request_handling_status_t get_user::operator()(const restinio::request_handle_t &req,
                                                     restinio::router::route_params_t params) {
  const auto user = list_.get(param["index"]);

  return req->create_response().set_body("user content here....").done();
}

restinio::request_handling_status_t get_list::operator()(const restinio::request_handle_t &req,
                                                     restinio::router::route_params_t params) {
  return req->create_response().set_body("user list here....").done();
}
}  // namespace user
}  // namespace handler