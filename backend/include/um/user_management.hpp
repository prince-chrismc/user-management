// MIT License

#include "schemas.hpp"

#include <nlohmann/json-schema.hpp>

#include <set>
#include <stdexcept>
#include <string>

namespace user_management {
struct user {
  int id;
  std::string name;
  std::string email;
};

void to_json(nlohmann::json &json, const user &user) {
  json = nlohmann::json{{"id", user.id}, {"name", user.name}, {"email", user.email}};
}

namespace impl {
struct user_key {
  int id;
};

struct user_sort {
  using is_transparent = user_key;

  bool operator()(const user &lhs, const user &rhs) { return lhs.id < rhs.id; }
  bool operator()(const user &user, const user_key &key) { return user.id < key.id; }
  bool operator()(const user_key &key, const user &user) { return key.id < user.id; }
  bool operator()(const user_key &lhs, const user_key &rhs) { return lhs.id < rhs.id; }
};
}  // namespace impl

class user_list : std::set<user, impl::user_sort> {
 public:
  user &get(int id) {
    for (auto it = this->begin(); it != this->end(); ++it)
      if (it->id == id) return (*it);
  }

  user &add(std::string name, std::string email) {
    const auto id = crbegin()->id + 1;
    emplace(user{id, std::move(name), std::move(email)});
    return get(id);
  }

  user remove(int id) {
    const auto it = find(impl::user_key{id});
    const auto copy = *it;
    erase(it);
    return copy;
  }
};

void to_json(nlohmann::json &json, const user_list &list) {
  json = nlohmann::json::array();
  for (const auto &user : list) json.push_back(nlohmann::json(user));
}

namespace impl {
void loader(const nlohmann::json_uri &uri, nlohmann::json &schema) {
  if (uri.path() == "/user.json") {
    schema = api::user;
    return;
  }

  throw std::logic_error("unkown schema");
}
}  // namespace impl

class user_modifier {
 public:
  user_modifier(user &user) : user_(user) {}

  void apply(const nlohmann::json &data) {
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

 private:
  user &user_;
};

class list_modifier {
 public:
  list_modifier(user_list &list) : list_(list) {}

  user &add(const nlohmann::json &data) {
    nlohmann::json_schema::json_validator validator(impl::loader, nlohmann::json_schema::default_string_format_check);
    validator.set_root_schema(api::add);
    validator.validate(data);

    return list_.add(data["name"].get<std::string>(), data["email"].get<std::string>());
  }

 private:
  user_list &list_;
};
}  // namespace user_management
