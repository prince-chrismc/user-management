// MIT License

#include "um/user_management.hpp"

#include <chrono>

namespace user {
class database : public user_management::user_list {
  using key = user_management::user_key;
  using time_point = std::chrono::system_clock::time_point;
  time_point last_modified;
  std::map<key, time_point> users_last_modified;

 public:
  time_point last_modified() const { return last_modified; }
  time_point last_modified(key id) const { return users_last_modified.at(id); }

  std::string etag() const { return last_modified; }
  std::string etag(key id) const { return users_last_modified.at(id); }

  user_management::list_modifier& modify() {
    last_modified = std::chrono::system_clock::now();
    return user_management::list_modifier{*this};
  }
  user_management::user_modifier& modify(key id) {
    users_last_modified[id] = std::chrono::system_clock::now();
    return user_management::user_modifier{*this};
  }
};
}  // namespace user
