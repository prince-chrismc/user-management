// MIT License

#include <catch2/catch.hpp>

#include "encoders/base64.hpp"
#include "encoders/sha256.hpp"

TEST_CASE("base64") {
  const std::string input{"1"};
  CHECK(encode::base64(input) == "MQ==");
}

TEST_CASE("sha256") {
  const std::string input{"abc"};
  CHECK(encode::sha256(input.data(), input.length()) == std::string{"\xba\x78\x16\xbf\x8f\x01\xcf\xea\x41\x41\x40"
                                                                    "\xde\x5d\xae\x22\x23\xb0\x03\x61\xa3\x96\x17"
                                                                    "\x7a\x9c\xb4\x10\xff\x61\xf2\x00\x15\xad",
                                                                    32});
}
