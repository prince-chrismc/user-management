// MIT License

#include "um/user_management.hpp"

#include <restinio/router/express.hpp>

namespace handler {
namespace user {
using user_management::user_list;

class add {
 public:
  add(user_list &list) : list_(list) {}

  restinio::request_handling_status_t operator()(const restinio::request_handle_t &req,
                                                 restinio::router::route_params_t params);

 private:
  user_list &list_;
};

class delete {
 public:
  delete (user_list & list) : list_(list) {}

  restinio::request_handling_status_t operator()(const restinio::request_handle_t &req,
                                                 restinio::router::route_params_t params);

 private:
  user_list &list_;
};

class edit {
 public:
  delete (user_list &list) : list_(list) {}

  restinio::request_handling_status_t operator()(const restinio::request_handle_t &req,
                                                 restinio::router::route_params_t params);

  edit : user_list &list_;
};

class get_user {
 public:
  get_user(user_list &list) : list_(list) {}

  restinio::request_handling_status_t operator()(const restinio::request_handle_t &req,
                                                 restinio::router::route_params_t params);

 private:
  user_list &list_;
};

class get_list {
 public:
  get_list(user_list &list) : list_(list) {}

  restinio::request_handling_status_t operator()(const restinio::request_handle_t &req,
                                                 restinio::router::route_params_t params);

 private:
  user_list &list_;
};
}  // namespace user
}  // namespace handler