// MIT License

#include <map>
#include <stdexcept>
#include <string>

#include <nlohmann/json-schema.hpp>

#include "schemas.hpp"

namespace user_management {
struct user {
  int id;
  std::string name;
  std::string email;
};

inline void to_json(nlohmann::json &json, const user &user) {
  json = nlohmann::json::object({{"id", user.id}, {"name", user.name}, {"email", user.email}});
}

class user_list : std::map<int, user> {
 public:
  using std::map<int, user>::begin;
  using std::map<int, user>::end;

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

inline void to_json(nlohmann::json &json, const user_list &list) {
  json = nlohmann::json::array();
  for (const auto &id_user : list) json.push_back(nlohmann::json(id_user.second));
}

namespace impl {
inline void loader(const nlohmann::json_uri &uri, nlohmann::json &schema) {
  if (uri.path() == "/user.json") {
    schema = api::user;
    return;
  }

  throw std::logic_error("unkown schema");
}
}  // namespace impl

class user_modifier {
  user &user_;

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
};

class list_modifier {
  user_list &list_;

 public:
  list_modifier(user_list &list) : list_(list) {}

  user &add(const nlohmann::json &data) {
    nlohmann::json_schema::json_validator validator(impl::loader, nlohmann::json_schema::default_string_format_check);
    validator.set_root_schema(api::add);
    validator.validate(data);

    return list_.add(data["name"].get<std::string>(), data["email"].get<std::string>());
  }
};
}  // namespace user_management
