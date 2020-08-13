// MIT License

#include "database/users.hpp"

#include "routing.hpp"

namespace handler {
namespace user {
namespace route {
using namespace nonstd::string_view_literals;
constexpr restinio::string_view_t db = "/um/v1/users"_sv;
constexpr restinio::string_view_t user = "/um/v1/users/:id(\\d+)"_sv;
}  // namespace route

class add {
  ::user::database &db_;

 public:
  add(::user::database &db) : db_(db) {}

  request_status operator()(const request_handle &req, route_params params);
};

class remove {
  ::user::database &db_;

 public:
  remove(::user::database &db) : db_(db) {}

  request_status operator()(const request_handle &req, route_params params);
};

class edit {
  ::user::database &db_;

 public:
  edit(::user::database &db) : db_(db) {}

  request_status operator()(const request_handle &req, route_params params);
};

class get_user {
  const ::user::database &db_;

 public:
  get_user(const ::user::database &db) : db_(db) {}

  request_status operator()(const request_handle &req, route_params params);
};

class get_list {
  const ::user::database &db_;

 public:
  get_list(const ::user::database &db) : db_(db) {}

  request_status operator()(const request_handle &req, route_params params);
};

namespace preflight {
request_status db(const request_handle &req, route_params params);
request_status user(const request_handle &req, route_params params);
}  // namespace preflight
}  // namespace user
}  // namespace handler