// MIT License

#include <string>

namespace encode {
std::string base64(const char* data, size_t length)
{
     const auto pl = 4*((length+2)/3);
  auto output = reinterpret_cast<char *>(calloc(pl+1, 1)); //+1 for the terminating null that EVP_EncodeBlock adds on
  const auto ol = EVP_EncodeBlock(reinterpret_cast<unsigned char *>(output), data, length);
  if (pl != ol) { std::cerr << "Whoops, encode predicted " << pl << " but we got " << ol << "\n"; }
  return output;
}
}  // namespace encode
