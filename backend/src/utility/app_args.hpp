// MIT License

#include <string>

struct app_args_t {
  bool help{false};
  std::string address{"localhost"};
  std::uint16_t port{8080};
  std::size_t pool_size{1};
  std::string root_dir{"."};
  std::string certs_dir{"."};

  static app_args_t parse(int argc, const char *argv[]);
};
