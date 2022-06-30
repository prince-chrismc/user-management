// MIT License

#include <openssl/sha.h>

#include <array>
#include <stdexcept>
#include <string>

namespace encode {
std::string sha256(const char* data, size_t length) {
  std::array<unsigned char, SHA256_DIGEST_LENGTH> buffer{};
  SHA256_CTX context;
  if (SHA256_Init(&context) == 0) throw std::runtime_error("OpenSSL SHA256_Init failed");
  if (SHA256_Update(&context, reinterpret_cast<const unsigned char*>(data), length) == 0)
    throw std::runtime_error("OpenSSL SHA256_Update failed");  // LCOV_EXCL_LINE
  if (SHA256_Final(buffer.data(), &context) == 0) throw std::runtime_error("OpenSSL SHA256_Final failed");
  return {buffer.begin(), buffer.end()};
}
}  // namespace encode
