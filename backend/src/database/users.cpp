// MIT License

#include "users.hpp"

#include <fmt/format.h>

#include <algorithm>

#include "encoders/base64.hpp"
#include "encoders/sha256.hpp"
#include "logging/logger.hpp"

namespace {
std::string make_etag(const database::user::json& json) {
  const auto raw = json.dump();
  return fmt::format("\"{}\"", encode::base64(encode::sha256(raw.data(), raw.length())));
}
}  // namespace

namespace database {
static const logger log{"database"};

using raw = user::json;

user::time_point user::last_modified() const {
  if (count() > 0) {
    const auto last_modified = std::max_element(users_last_modified.begin(), users_last_modified.end());
    if (last_modified != std::end(users_last_modified)) return std::max(database_last_modified, last_modified->second);
  }
  return database_last_modified;
}
user::time_point user::last_modified(key id) const { return users_last_modified.at(id); }

std::string user::etag() const { return make_etag(*this); }
std::string user::etag(key id) const { return make_etag(get(id)); }

user::entry& user::add(const json& json) {
  database_last_modified = clock::now();
  auto& user = user_management::list_modifier{*this}.add(json);
  users_last_modified[user.id] = clock::now();
  log.info("created new user ({:d})", user.id);
  log.trace("{}", raw{user});
  return user;
}
user::entry& user::edit(key id, const json& json) {
  database_last_modified = clock::now();
  auto& user = get(id);
  user_management::user_modifier{user}.apply(json);
  users_last_modified[id] = clock::now();
  log.info("modified user ({:d})", id);
  log.trace("{}", raw{user});
  return user;
}
user::entry user::remove(key id) {
  database_last_modified = clock::now();
  auto user = user_management::user_list::remove(id);
  users_last_modified[id] = clock::now();
  log.info("removed user ({:d})", id);
  log.trace("{}", raw{user});
  return user;
}
}  // namespace database
