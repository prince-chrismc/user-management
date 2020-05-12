// MIT License

#include "program.hpp"

#include <catch2/catch.hpp>

using namespace user_management;

TEST_CASE("User") { 
    user expected{0, "John Doe", " john@example.com"}; 
}

TEST_CASE("Add")
{
    user_list list;
    auto& user = list.add("John Doe", " john@example.com");
}
