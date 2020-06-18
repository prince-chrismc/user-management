// MIT License

#include "program.hpp"

#include <catch2/catch.hpp>

using namespace user_management;

TEST_CASE("User") {
  user user{0, "John Doe", "john@example.com"};
  CHECK(user.id == 0);
  CHECK(user.name == "John Doe");
  CHECK(user.email == "john@example.com");
}

TEST_CASE("List") {
  user_list list;
  auto& user = list.add("John Doe", "john@example.com");
  CHECK(user.id == 1);
  CHECK(user.name == "John Doe");
  CHECK(user.email == "john@example.com");
}

TEST_CASE("Edit") {
  user_list list;
  auto& user = list.add("John Doe", "j@example.com");
  user_modifier(user).apply(R"##({"name": "Jane Doe"})##"_json);
  CHECK_THAT(user.name, Catch::Equals("Jane Doe"));

  user_modifier(user).apply(R"##({"email": "jane@example.com"})##"_json);
  CHECK_THAT(user.email, Catch::Equals("jane@example.com"));
}

TEST_CASE("Add"){
  user_list list;
  auto& user = list_modifier(list).add(R"##({"name": "Jane Doe", "email": "jane@example.com"})##"_json);
  CHECK(user.id == 1);
  CHECK(user.name == "Jane Doe");
  CHECK(user.email == "jane@example.com");
}