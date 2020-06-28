// MIT License

#include "um/user_management.hpp"

#include <restinio/router/express.hpp>

namespace handler {
namespace user {
using user_management::user_list;

class add {
  user_list &list_;

 public:
  add(user_list &list) : list_(list) {}

  restinio::request_handling_status_t operator()(const restinio::request_handle_t &req,
                                                 restinio::router::route_params_t params);
};

class remove {
  user_list &list_;

 public:
  remove(user_list &list) : list_(list) {}

  restinio::request_handling_status_t operator()(const restinio::request_handle_t &req,
                                                 restinio::router::route_params_t params);
};

class edit {
  user_list &list_;

 public:
  edit(user_list &list) : list_(list) {}

  restinio::request_handling_status_t operator()(const restinio::request_handle_t &req,
                                                 restinio::router::route_params_t params);
};

class get_user {
  user_list &list_;

 public:
  get_user(user_list &list) : list_(list) {}

  restinio::request_handling_status_t operator()(const restinio::request_handle_t &req,
                                                 restinio::router::route_params_t params);
};

class get_list {
  user_list &list_;

 public:
  get_list(user_list &list) : list_(list) {}

  restinio::request_handling_status_t operator()(const restinio::request_handle_t &req,
                                                 restinio::router::route_params_t params);
};

namespace preflight {
restinio::request_handling_status_t list(const restinio::request_handle_t &req,
                                         restinio::router::route_params_t params);
restinio::request_handling_status_t user(const restinio::request_handle_t &req,
                                         restinio::router::route_params_t params);
}  // namespace preflight
}  // namespace user
}  // namespace handler