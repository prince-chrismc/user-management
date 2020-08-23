// MIT License

#include <stdexcept>
#include <string>
#include <vector>

#include <openssl/evp.h>

namespace encode {
std::string base64(const std::string& input) {
  const auto length = input.length();
  std::vector<uint8_t> buffer(4 * ((length + 2) / 3), 0);
  if (EVP_EncodeBlock(buffer.data(), reinterpret_cast<const unsigned char*>(input.data()), length) != buffer.size())
    throw std::runtime_error("OpenSSL EVP_EncodeBlock unexpected size");  // LCOV_EXCL_LINE
  return {buffer.begin(), buffer.end()};
}
}  // namespace encode
