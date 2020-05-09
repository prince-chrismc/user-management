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

class user_modifier {
public:
  user_modifier(user &user) : user_(user) {}

  void apply(const nlohmann::json &data) {
    nlohmann::json_schema::json_validator validator;
    validator.set_root_schema(api::add);
  }

private:
  user &user_;
};
} // namespace user_management