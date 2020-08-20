// MIT License

#include "database/users.hpp"
#include "routing.hpp"

namespace handler {
namespace user {
namespace route {
using namespace nonstd::string_view_literals;
constexpr restinio::string_view_t list = "/um/v1/users"_sv;
constexpr restinio::string_view_t user = "/um/v1/users/:id(\\d+)"_sv;
}  // namespace route
using database = ::user::database;
class add {
  database &db_;

 public:
  add(database &db) : db_(db) {}

  request_status operator()(const request_handle &req, route_params params);
};

class remove {
  database &db_;

 public:
  remove(database &db) : db_(db) {}

  request_status operator()(const request_handle &req, route_params params);
};

class edit {
  database &db_;

 public:
  edit(database &db) : db_(db) {}

  request_status operator()(const request_handle &req, route_params params);
};

class get_user {
  const database &db_;

 public:
  get_user(const database &db) : db_(db) {}

  request_status operator()(const request_handle &req, route_params params);
};

class get_list {
  const database &db_;

 public:
  get_list(const database &db) : db_(db) {}

  request_status operator()(const request_handle &req, route_params params);
};

namespace preflight {
request_status list(const request_handle &req, route_params params);
request_status user(const request_handle &req, route_params params);
}  // namespace preflight
}  // namespace user
}  // namespace handler