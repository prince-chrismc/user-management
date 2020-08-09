// MIT License

#include "encoders/base64.hpp"
#include "encoders/sha256.hpp"
#include "um/user_management.hpp"

#include <algorithm>
#include <chrono>

namespace user {
class database : public user_management::user_list {
  using key = user_management::user_key;
  using time_point = std::chrono::system_clock::time_point;
  time_point database_last_modified;
  std::map<key, time_point> users_last_modified;

 public:
  time_point last_modified() const {
    return std::max(database_last_modified,
                    std::max_element(users_last_modified.begin(), users_last_modified.end())->second);
  }
  time_point last_modified(key id) const { return users_last_modified.at(id); }

  std::string etag() const {
    const user_management::json data = *this;
    const auto raw = data.dump();
    return encode::base64(encode::sha256(raw.data(), raw.length()));
  }
  std::string etag(key id) const {
    const user_management::json data = get(id);
    const auto raw = data.dump();
    return encode::base64(encode::sha256(raw.data(), raw.length()));
  }

  user_management::list_modifier modify() {
    database_last_modified = std::chrono::system_clock::now();
    return user_management::list_modifier{*this};
  }
  user_management::user_modifier modify(key id) {
    users_last_modified[id] = std::chrono::system_clock::now();
    return user_management::user_modifier{get(id)};
  }
};
}  // namespace user
