// MIT License

#include "app_args.hpp"

#include <fmt/format.h>
#include <lyra/lyra.hpp>

#include <iostream>

using namespace lyra;  // NOLINT(google-build-using-namespace)

app_args_t app_args_t::parse(int argc, const char *argv[]) {
  app_args_t result;

  auto cli = cli_parser() |
             opt(result.address,
                 "address")["-a"]["--address"](fmt::format("address to listen (default: {})", result.address)) |
             opt(result.port, "port")["-p"]["--port"](fmt::format("port to listen (default: {})", result.port)) |
             opt(result.pool_size, "thread-pool size")["-n"]["--thread-pool-size"](
                 fmt::format("The size of a thread pool to run server (default: {})", result.pool_size)) |
             arg(result.root_dir, "root-dir")(fmt::format("server root dir (default: '{}')", result.root_dir)) |
             arg(result.certs_dir, "certs-dir")(fmt::format("server certs dir (default: '{}')", result.certs_dir)) |
             lyra::help(result.help);

  auto parse_result = cli.parse({argc, argv});
  if (!parse_result) {
    throw std::runtime_error(fmt::format("Invalid command-line arguments: {}", parse_result.errorMessage()));
  }

  if (result.help) {
    std::cout << cli << std::endl;
  }

  return result;
}
