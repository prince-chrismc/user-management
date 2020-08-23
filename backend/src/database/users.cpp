// MIT License

#include "users.hpp"

#include <algorithm>

#include "encoders/base64.hpp"
#include "encoders/sha256.hpp"

namespace database {
user::time_point user::last_modified() const {
  if (count() > 0)
    return std::max(database_last_modified,
                    std::max_element(users_last_modified.begin(), users_last_modified.end())->second);

  return database_last_modified;
}
user::time_point user::last_modified(key id) const { return users_last_modified.at(id); }

std::string user::etag() const {
  const json data = *this;
  const auto raw = data.dump();
  return encode::base64(encode::sha256(raw.data(), raw.length()));
}
std::string user::etag(key id) const {
  const json data = get(id);
  const auto raw = data.dump();
  return encode::base64(encode::sha256(raw.data(), raw.length()));
}

user::entry& user::add(const json& json) {
  database_last_modified = clock::now();
  auto& user = user_management::list_modifier{*this}.add(json);
  users_last_modified[user.id] = clock::now();
  return user;
}
user::entry& user::edit(key id, const json& json) {
  database_last_modified = clock::now();
  auto& user = get(id);
  user_management::user_modifier{user}.apply(json);
  users_last_modified[id] = clock::now();
  return user;
}
user::entry user::remove(key id) {
  database_last_modified = clock::now();
  auto user = user_management::user_list::remove(id);
  users_last_modified[id] = clock::now();
  return user;
}
}  // namespace database
