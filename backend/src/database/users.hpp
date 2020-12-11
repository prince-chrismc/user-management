// MIT License

#ifndef DATABASE_USERS_HPP_
#define DATABASE_USERS_HPP_

#include <chrono>

#include "um/user_management.hpp"

namespace database {
class user : public user_management::user_list {
 public:
  using key = user_management::user_key;
  using entry = user_management::user;
  using json = user_management::json;
  using clock = std::chrono::system_clock;
  using time_point = clock::time_point;

  time_point last_modified() const;
  time_point last_modified(key id) const;

  std::string etag() const;
  std::string etag(key id) const;

  entry& add(const json& json);
  entry& edit(key id, const json& json);
  entry remove(key id);

 private:
  time_point database_last_modified{time_point::duration{0}};
  std::unordered_map<key, time_point> users_last_modified;
};
}  // namespace database

#endif  // DATABASE_USERS_HPP_
