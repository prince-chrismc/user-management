// MIT License

#include "um/user_management.hpp"

#include <catch2/catch.hpp>

#include <algorithm>
#include <vector>

using namespace user_management;

TEST_CASE("User") {
  user user{0, "John Doe", "john@example.com"};
  CHECK(user.id == 0);
  CHECK(user.name == "John Doe");
  CHECK(user.email == "john@example.com");

  CHECK_THAT(nlohmann::json(user).dump(), Catch::StartsWith("{") && Catch::Contains("0") &&
                                              Catch::Contains("John Doe") && Catch::Contains("john@example.com") &&
                                              Catch::EndsWith("}"));
  CHECK(nlohmann::json(user).dump() == R"##({"email":"john@example.com","id":0,"name":"John Doe"})##");
}

TEST_CASE("List") {
  user_list list;
  auto& user = list.add("John Doe", "john@example.com");
  CHECK(user.id == 1);
  CHECK(user.name == "John Doe");
  CHECK(user.email == "john@example.com");

  CHECK_THAT(nlohmann::json(list).dump(), Catch::StartsWith("[{") && Catch::Contains("1") &&
                                              Catch::Contains("John Doe") && Catch::Contains("john@example.com") &&
                                              Catch::EndsWith("}]"));
  CHECK(nlohmann::json(list).dump() == R"##([{"email":"john@example.com","id":1,"name":"John Doe"}])##");
}

TEST_CASE("Edit") {
  user_list list;
  auto& user = list.add("John Doe", "j@example.com");
  user_modifier(user).apply(R"##({"name": "Jane Doe"})##"_json);
  CHECK_THAT(user.name, Catch::Equals("Jane Doe"));

  user_modifier(user).apply(R"##({"email": "jane@example.com"})##"_json);
  CHECK_THAT(user.email, Catch::Equals("jane@example.com"));
}

TEST_CASE("Add") {
  user_list list;
  auto& user = list_modifier(list).add(R"##({"name": "Jane Doe", "email": "jane@example.com"})##"_json);
  CHECK(user.id == 1);
  CHECK(user.name == "Jane Doe");
  CHECK(user.email == "jane@example.com");
}

TEST_CASE("Loader") {
  nlohmann::json json;
  impl::loader(nlohmann::json_uri{"/user.json"}, json);
  CHECK(json == api::user);

  CHECK_THROWS_AS(impl::loader(nlohmann::json_uri{"/unknown.json"}, json), std::logic_error);
}
