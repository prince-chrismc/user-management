// MIT License

#ifndef DATABASE_ENCODERS_SHA256_HPP_
#define DATABASE_ENCODERS_SHA256_HPP_

#include <string>

namespace encode {
std::string sha256(const char* data, size_t length);
}  // namespace encode

#endif  // DATABASE_ENCODERS_SHA256_HPP_
