// MIT License
// Copyright (c) 2020 Christopher McArthur
// Version: 1.0.0-dev.1

#ifndef UM_USER_MANAGEMENT_HPP_
#define UM_USER_MANAGEMENT_HPP_

#include <nlohmann/json-schema.hpp>
#include <stdexcept>
#include <string>
#include <unordered_map>
#include <utility>

#include "schemas.hpp"

namespace user_management {
constexpr auto version = "1.0.0-dev.1";

using json = api::json;
using user_key = size_t;
struct user {
  user_key id;
  std::string name;
  std::string email;
};

inline bool operator==(const user &lhs, const user &rhs) {
  return std::tie(lhs.id, lhs.name, lhs.email) == std::tie(rhs.id, rhs.name, rhs.email);
}
inline bool operator!=(const user &lhs, const user &rhs) { return !(lhs == rhs); }
inline bool operator<(const user &lhs, const user &rhs) {
  return std::tie(lhs.id, lhs.name, lhs.email) < std::tie(rhs.id, rhs.name, rhs.email);
}
inline bool operator>(const user &lhs, const user &rhs) {
  return std::tie(lhs.id, lhs.name, lhs.email) > std::tie(rhs.id, rhs.name, rhs.email);
}
inline bool operator<=(const user &lhs, const user &rhs) {
  return std::tie(lhs.id, lhs.name, lhs.email) <= std::tie(rhs.id, rhs.name, rhs.email);
}
inline bool operator>=(const user &lhs, const user &rhs) {
  return std::tie(lhs.id, lhs.name, lhs.email) >= std::tie(rhs.id, rhs.name, rhs.email);
}

inline void to_json(json &json, const user &user) {
  json = json::object({{"id", user.id}, {"name", user.name}, {"email", user.email}});
}
inline void from_json(const json &json, user &user) {
  json.at("id").get_to(user.id);
  json.at("name").get_to(user.name);
  json.at("email").get_to(user.email);
}

class user_does_not_exist : public std::runtime_error {
 public:
  user_does_not_exist(user_key id) : std::runtime_error("user '" + std::to_string(id) + "' does not exists") {}
};

class user_list : std::unordered_map<user_key, user> {
  user_key index = 0;

 public:
  using std::unordered_map<user_key, user>::begin;
  using std::unordered_map<user_key, user>::end;
  size_t count() const { return size(); }

  user &get(user_key id) {
    if (find(id) == end()) throw user_does_not_exist(id);
    return at(id);
  }
  user get(user_key id) const {
    if (find(id) == end()) throw user_does_not_exist(id);
    return at(id);
  }

  user &add(std::string name, std::string email) {
    const auto id = ++index;
    emplace(std::make_pair(id, user{id, std::move(name), std::move(email)}));
    return get(id);
  }

  user remove(user_key id) {
    const auto it = find(id);
    if (it == end()) throw user_does_not_exist(id);
    const auto copy = it->second;
    erase(it);
    return copy;
  }
};

inline void to_json(json &json, const user_list &list) {
  json = json::array();
  for (const auto &id_user : list) json.push_back(user_management::json(id_user.second));
}

namespace impl {
class user_schema_error : public std::runtime_error {
 public:
  using runtime_error::runtime_error;
};

inline void loader(const nlohmann::json_uri &uri, json &schema) {
  if (uri.path() == "/user.json") {
    schema = api::user;
    return;
  }

  throw user_schema_error("unkown schema");
}

class invalid_mutation_error : public std::runtime_error {
 public:
  using runtime_error::runtime_error;
};

class throwing_error_handler : public nlohmann::json_schema::error_handler {
  void error(const json::json_pointer &ptr, const json &instance, const std::string &message) override {
    throw invalid_mutation_error(std::string("At '") + ptr.to_string() + "' of " + instance.dump() + " - " + message);
  }
};
}  // namespace impl

class user_modifier {
  user &user_;

 public:
  explicit user_modifier(user &user) : user_(user) {}

  void edit(const json &data) {
    nlohmann::json_schema::json_validator validator(impl::loader, nlohmann::json_schema::default_string_format_check);
    validator.set_root_schema(api::edit);
    validator.validate(data);

    if (data.find("name") != std::end(data)) {
      user_.name = data["name"].get<std::string>();
    }

    if (data.find("email") != std::end(data)) {
      user_.email = data["email"].get<std::string>();
    }
  }

  void patch(const json &data) {
    const auto id = user_.id;
    const auto result = json(user_).patch(data);

    impl::throwing_error_handler err;
    nlohmann::json_schema::json_validator validator(impl::loader, nlohmann::json_schema::default_string_format_check);
    validator.set_root_schema(api::user);
    validator.validate(result, err);

    if (id != result["id"].get<user_key>()) {
      throw impl::invalid_mutation_error("it is forbiden to mutate the user's ID!");
    }

    result.get_to(user_);
  }
};

class list_modifier {
  user_list &list_;

 public:
  explicit list_modifier(user_list &list) : list_(list) {}

  user &add(const json &data) {
    nlohmann::json_schema::json_validator validator(impl::loader, nlohmann::json_schema::default_string_format_check);
    validator.set_root_schema(api::add);
    validator.validate(data);

    return list_.add(data["name"].get<std::string>(), data["email"].get<std::string>());
  }
};
}  // namespace user_management

#endif  // UM_USER_MANAGEMENT_HPP_
