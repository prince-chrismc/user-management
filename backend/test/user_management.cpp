// MIT License

#include "um/user_management.hpp"

#include <catch2/catch.hpp>

namespace Catch {
template <>
struct StringMaker<user_management::user> {
  static std::string convert(user_management::user const& value) { return nlohmann::json(value).dump(); }
};
}  // namespace Catch

namespace um = user_management;

TEST_CASE("User") {
  um::user user{0, "John Doe", "john@example.com"};
  CHECK(user.id == 0);
  CHECK(user.name == "John Doe");
  CHECK(user.email == "john@example.com");

  CHECK_THAT(nlohmann::json(user).dump(), Catch::StartsWith("{") && Catch::Contains("0") &&
                                              Catch::Contains("John Doe") && Catch::Contains("john@example.com") &&
                                              Catch::EndsWith("}"));
  CHECK(nlohmann::json(user) == R"##({"email":"john@example.com","id":0,"name":"John Doe"})##"_json);
}

TEST_CASE("Comparison") {
  um::user user{0, "John Doe", "john@example.com"};
  CHECK(user == user);
  CHECK_FALSE(user != user);
  CHECK(user <= user);
  CHECK(user >= user);
  CHECK_FALSE(user > user);
  CHECK_FALSE(user < user);

  um::user other{1, "Jane Doe", "jane@example.com"};
  CHECK_FALSE(user == other);
  CHECK(user != other);
  CHECK(user <= other);
  CHECK_FALSE(user >= other);
  CHECK_FALSE(user > other);
  CHECK(user < other);
}

TEST_CASE("List") {
  um::user_list list;
  CHECK_THROWS_AS(list.get(1), um::user_does_not_exist);
  auto& user = list.add("John Doe", "john@example.com");
  CHECK(user.id == 1);
  CHECK(user.name == "John Doe");
  CHECK(user.email == "john@example.com");

  CHECK_THAT(nlohmann::json(list).dump(), Catch::StartsWith("[{") && Catch::Contains("1") &&
                                              Catch::Contains("John Doe") && Catch::Contains("john@example.com") &&
                                              Catch::EndsWith("}]"));
  CHECK(nlohmann::json(list) == R"##([{"email":"john@example.com","id":1,"name":"John Doe"}])##"_json);
}

TEST_CASE("Edit") {
  um::user_list list;
  auto& user = list.add("John Doe", "j@example.com");
  um::user_modifier(user).apply(R"##({"name": "Jane Doe"})##"_json);
  CHECK_THAT(user.name, Catch::Equals("Jane Doe"));

  um::user_modifier(user).apply(R"##({"email": "jane@example.com"})##"_json);
  CHECK_THAT(user.email, Catch::Equals("jane@example.com"));
}

TEST_CASE("Add") {
  um::user_list list;
  auto& user = um::list_modifier(list).add(R"##({"name": "Jane Doe", "email": "jane@example.com"})##"_json);
  CHECK(user.id == 1);
  CHECK(user.name == "Jane Doe");
  CHECK(user.email == "jane@example.com");
  CHECK(list.count() == 1);
}

TEST_CASE("Remove") {
  um::user_list list;
  auto& user = um::list_modifier(list).add(R"##({"name": "Jane Doe", "email": "jane@example.com"})##"_json);
  CHECKED_IF(user.id == 1) {
    CHECK(list.get(1) == user);
    CHECK(list.remove(1) == user_management::user{1, "Jane Doe", "jane@example.com"});
    CHECK_THROWS(list.get(1));
  }
  CHECK(list.count() == 0);
}

TEST_CASE("Loader") {
  nlohmann::json json;
  um::impl::loader(nlohmann::json_uri{"/user.json"}, json);
  CHECK(json == api::user);

  CHECK_THROWS_AS(um::impl::loader(nlohmann::json_uri{"/unknown.json"}, json), um::impl::user_schema_error);
}
