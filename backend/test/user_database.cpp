// MIT License

#include <fmt/chrono.h>

#include <catch2/catch.hpp>

#include "database/users.hpp"

namespace Catch {
template <>
struct StringMaker<user::database::time_point> {
  static std::string convert(std::chrono::system_clock::time_point const& value) { return fmt::format("{}", value.time_since_epoch()); }
};
}  // namespace Catch

TEST_CASE("Tracks changes") {
  user::database user_database;
  const auto new_id = user_database.add(R"##({"name": "Jane Doe", "email": "jane@example.com"})##"_json).id;
  CHECK(user_database.last_modified() == user_database.last_modified(new_id));
  user_database.edit(new_id, R"##({"name": "Jane Down"})##"_json);
  CHECK(user_database.last_modified() == user_database.last_modified(new_id));
  const auto second_id = user_database.add(R"##({"name": "John Doe", "email": "john@example.com"})##"_json).id;
  CHECK(user_database.last_modified() == user_database.last_modified(second_id));
  CHECK_FALSE(user_database.last_modified() == user_database.last_modified(new_id));
}
