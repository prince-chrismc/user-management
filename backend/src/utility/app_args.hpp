// MIT License

#include <nonstd/expected.hpp>
#include <nonstd/optional.hpp>

#include <string>

struct app_args_t {
  std::string address{"localhost"};
  std::uint16_t port{8080};
  std::size_t pool_size{1};
  std::string root_dir;
  nonstd::optional<std::string> certs_dir;

  enum class result { help, error };
  static nonstd::expected<app_args_t, result> parse(int argc, const char *argv[]);
};
