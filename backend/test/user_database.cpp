// MIT License

#include <fmt/chrono.h>

#include <catch2/catch.hpp>

#include "database/users.hpp"

namespace Catch {
template <>
struct StringMaker<user::database::time_point> {
  static std::string convert(std::chrono::system_clock::time_point const& value) {
    return fmt::format("{}", value.time_since_epoch());
  }
};
}  // namespace Catch

TEST_CASE("Tracks Last-Modified") {
  user::database user_database;
  CHECK(user_database.last_modified() == std::chrono::system_clock::time_point{std::chrono::system_clock::time_point::duration{0}});

  // Add
  const auto new_id = user_database.add(R"##({"name": "Jane Doe", "email": "jane@example.com"})##"_json).id;
  CHECK(user_database.last_modified() == user_database.last_modified(new_id));

  // Edit
  user_database.edit(new_id, R"##({"name": "Jane Down"})##"_json);
  CHECK(user_database.last_modified() == user_database.last_modified(new_id));

  // Multiple Users
  const auto second_id = user_database.add(R"##({"name": "John Doe", "email": "john@example.com"})##"_json).id;
  CHECK(user_database.last_modified() == user_database.last_modified(second_id));
  CHECK_FALSE(user_database.last_modified() == user_database.last_modified(new_id));

  // Remove
  user_database.remove(new_id);  // Remove is very slow.
  Approx target = Approx(user_database.last_modified(new_id).time_since_epoch().count()).epsilon(0.01);
  CHECK(user_database.last_modified().time_since_epoch().count() == target);
  CHECK_FALSE(user_database.last_modified() == user_database.last_modified(second_id));
}

TEST_CASE("Handles ETAg") {
  user::database user_database;
  const auto db_empty_hash = user_database.etag();

  // Add
  const auto new_id = user_database.add(R"##({"name": "Jane Doe", "email": "jane@example.com"})##"_json).id;
  CHECK(user_database.etag() != db_empty_hash);
  const auto new_user_hash = user_database.etag(new_id);

  // Edit
  user_database.edit(new_id, R"##({"name": "Jane Down"})##"_json);
  CHECK(user_database.etag() != db_empty_hash);
  CHECK(user_database.etag(new_id) != new_user_hash);

  user_database.remove(new_id);
  CHECK(user_database.etag() == db_empty_hash);
}
