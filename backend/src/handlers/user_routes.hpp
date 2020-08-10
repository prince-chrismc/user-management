// MIT License

#include "um/user_management.hpp"

#include <restinio/router/express.hpp>

namespace handler {
namespace user {

namespace route {
using namespace nonstd::string_view_literals;
constexpr restinio::string_view_t list = "/um/v1/users"_sv;
constexpr restinio::string_view_t user = "/um/v1/users/:id(\\d+)"_sv;
}  // namespace route

using user_management::user_list;
using request_status = restinio::request_handling_status_t;
using request_handle = restinio::request_handle_t;
using route_params = restinio::router::route_params_t;

class add {
  user_list &list_;

 public:
  add(user_list &list) : list_(list) {}

  request_status operator()(const request_handle &req, route_params params);
};

class remove {
  user_list &list_;

 public:
  remove(user_list &list) : list_(list) {}

  request_status operator()(const request_handle &req, route_params params);
};

class edit {
  user_list &list_;

 public:
  edit(user_list &list) : list_(list) {}

  request_status operator()(const request_handle &req, route_params params);
};

class get_user {
  user_list &list_;

 public:
  get_user(user_list &list) : list_(list) {}

  request_status operator()(const request_handle &req, route_params params);
};

class get_list {
  user_list &list_;

 public:
  get_list(user_list &list) : list_(list) {}

  request_status operator()(const request_handle &req, route_params params);
};

namespace preflight {
request_status list(const request_handle &req, route_params params);
request_status user(const request_handle &req, route_params params);
}  // namespace preflight
}  // namespace user
}  // namespace handler