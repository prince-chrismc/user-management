// MIT License

#ifndef HANDLERS_USER_ROUTES_HPP_
#define HANDLERS_USER_ROUTES_HPP_

#include "database/users.hpp"
#include "utility/routing.hpp"

namespace handler {
namespace user {
namespace route {
using namespace nonstd::string_view_literals;
constexpr restinio::string_view_t list = "/um/v1/users"_sv;
constexpr restinio::string_view_t user = "/um/v1/users/:id(\\d+)"_sv;
}  // namespace route
using database = database::user;
namespace fill {
void list(router &router, database &db);
void user(router &router, database &db);
}  // namespace fill

class add {
  database &db_;

 public:
  explicit add(database &db) : db_(db) {}

  request_status operator()(const request_handle &req, route_params params);
};

class remove {
  database &db_;

 public:
  explicit remove(database &db) : db_(db) {}

  request_status operator()(const request_handle &req, route_params params);
};

class edit {
  database &db_;

 public:
  explicit edit(database &db) : db_(db) {}

  request_status operator()(const request_handle &req, route_params params);
};

class get_user {
  const database &db_;

 public:
  explicit get_user(const database &db) : db_(db) {}

  request_status operator()(const request_handle &req, route_params params);
};

class get_list {
  const database &db_;

 public:
  explicit get_list(const database &db) : db_(db) {}

  request_status operator()(const request_handle &req, route_params params);
};

namespace preflight {
request_status list(const request_handle &req, route_params params);
request_status user(const request_handle &req, route_params params);
}  // namespace preflight
}  // namespace user
}  // namespace handler

#endif  // HANDLERS_USER_ROUTES_HPP_
