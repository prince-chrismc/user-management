// MIT License

#include "app_args.hpp"

#include <fmt/format.h>
#include <fmt/printf.h>
#include <fmt/ostream.h>

#include <iostream>

#define LYRA_CONFIG_OPTIONAL_TYPE nonstd::optional

#include <lyra/lyra.hpp>

nonstd::expected<app_args_t, app_args_t::result> app_args_t::parse(
    int argc, const char *argv[]) {  // NOLINT(hicpp-avoid-c-arrays, modernize-avoid-c-arrays)
  bool help = false;
  app_args_t args;

  auto cli =
      lyra::help(help) |
      lyra::opt(args.address,
                "address")["-a"]["--address"](fmt::format("address to listen (default: {})", args.address)) |
      lyra::opt(args.port, "port")["-p"]["--port"](fmt::format("port to listen (default: {})", args.port)) |
      lyra::opt(args.pool_size, "thread-pool size")["-n"]["--thread-pool-size"](
          fmt::format("The size of a thread pool to run server (default: {})", args.pool_size)) |
      lyra::arg(args.root_dir, "root-dir")("root directory for the server to obtain requested files").required() |
      lyra::arg(args.certs_dir, "certs-dir")("directory containing certificate(s) and key(s) to host the HTTP endpoint");

  const auto parse_args = cli.parse({argc, argv});
  if (!parse_args) {
    fmt::print("Invalid command-line arguments: {}\n", parse_args.message());
    return nonstd::make_unexpected(app_args_t::result::error);
  }

  if (help) {
    fmt::print("{}\n", cli);
    return nonstd::make_unexpected(app_args_t::result::help);
  }

  return args;
}
