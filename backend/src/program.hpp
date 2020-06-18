// MIT License

#include "schemas.hpp"

#include <nlohmann/json-schema.hpp>

#include <map>
#include <stdexcept>
#include <string>

namespace user_management {
struct user {
  int id;
  std::string name;
  std::string email;
};

class user_list : std::map<int, user> {
 public:
  user &get(int id) { return at(id); }

  user &add(std::string name, std::string email) {
    const auto id = end()->first + 1;
    emplace(std::make_pair(id, user{id, std::move(name), std::move(email)}));
    return get(id);
  }

  user remove(int id) {
    const auto it = find(id);
    const auto copy = it->second;
    erase(it);
    return copy;
  }
};

namespace impl {
void loader(const nlohmann::json_uri &uri, nlohmann::json &schema) {
  if (uri.path() == "/user.json") {
    schema = api::user;
    return;
  }
  if (uri.path() == "/edit.json") {
    schema = api::edit;
    return;
  }
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
}  // namespace user_management