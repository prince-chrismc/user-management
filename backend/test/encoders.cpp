// MIT License

#include <catch2/catch.hpp>

#include "encoders/sha256.hpp"

#include <iostream>

TEST_CASE("sha256") {
  const std::string input{"hello world"};
  const auto data = encode::sha256(input.data(), input.length());
  for (char c : data) {
    std::cout << (unsigned int)c << std::endl;
  }
  CHECK(encode::sha256(input.data(), input.length()) == "\x02"); // TODO: Fix check
}