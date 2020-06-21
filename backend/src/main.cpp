/*

MIT License

Copyright (c) 2020 Chris Mc prince.chrismc@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

#include "handlers/serve_files.hpp"
#include "handlers/web_app_handler.hpp"
#include "um/user_management.hpp"

#ifdef _WIN32
#include <sdkddkver.h>
#endif

#include <fmt/format.h>
#include <lyra/lyra.hpp>
#include <restinio/all.hpp>
#include <restinio/tls.hpp>

#include <iostream>
#include <map>

using router_t = restinio::router::express_router_t<>;

auto server_handler(const std::string &root_dir) {
  std::string server_root_dir;

  if (root_dir.empty()) {
    server_root_dir = "./";
  } else if (root_dir.back() != '/' && root_dir.back() != '\\') {
    server_root_dir = root_dir + '/';
  } else {
    server_root_dir = root_dir;
  }

  auto router = std::make_unique<router_t>();

  router->http_get("/", &handler::web_app::link);
  router->http_get("/web-app/", &handler::web_app::redirect);

  router->http_get(R"(/:path(.*)\.:ext(.*))", restinio::path2regex::options_t{}.strict(true),
                   handler::serve_files::from_disk{server_root_dir});

  return router;
}

struct app_args_t {
  bool m_help{false};
  std::string m_address{"localhost"};
  std::uint16_t m_port{8080};
  std::size_t m_pool_size{1};
  std::string m_root_dir{"."};
  std::string m_certs_dir{"."};

  static app_args_t parse(int argc, const char *argv[]) {
    using namespace lyra;

    app_args_t result;

    auto cli =
        cli_parser() |
        opt(result.m_address,
            "address")["-a"]["--address"](fmt::format("address to listen (default: {})", result.m_address)) |
        opt(result.m_port, "port")["-p"]["--port"](fmt::format("port to listen (default: {})", result.m_port)) |
        opt(result.m_pool_size, "thread-pool size")["-n"]["--thread-pool-size"](
            fmt::format("The size of a thread pool to run server (default: {})", result.m_pool_size)) |
        arg(result.m_root_dir, "root-dir")(fmt::format("server root dir (default: '{}')", result.m_root_dir)) |
        arg(result.m_certs_dir, "certs-dir")(fmt::format("server certs dir (default: '{}')", result.m_certs_dir)) |
        help(result.m_help);

    auto parse_result = cli.parse({argc, argv});
    if (!parse_result) {
      throw std::runtime_error(fmt::format("Invalid command-line arguments: {}", parse_result.errorMessage()));
    }

    if (result.m_help) {
      std::cout << cli << std::endl;
    }

    return result;
  }
};

int main(int argc, char const *argv[]) {
  using namespace std::chrono;

  try {
    const auto args = app_args_t::parse(argc, argv);

    if (args.m_help) {
      return 0;
    }

    using traits_t = restinio::single_thread_tls_traits_t<restinio::asio_timer_manager_t,
                                                          restinio::single_threaded_ostream_logger_t, router_t>;

    namespace asio_ns = restinio::asio_ns;

    asio_ns::ssl::context tls_context{asio_ns::ssl::context::tls};
    tls_context.set_options(asio_ns::ssl::context::default_workarounds | asio_ns::ssl::context::no_sslv2 |
                            asio_ns::ssl::context::no_sslv3 | asio_ns::ssl::context::no_tlsv1 |
                            asio_ns::ssl::context::single_dh_use);

    tls_context.use_certificate_chain_file(args.m_certs_dir + "/server.pem");
    tls_context.use_private_key_file(args.m_certs_dir + "/key.pem", asio_ns::ssl::context::pem);
    tls_context.use_tmp_dh_file(args.m_certs_dir + "/dh2048.pem");

    restinio::run(restinio::on_thread_pool<traits_t>(args.m_pool_size)
                      .address(args.m_address)
                      .port(args.m_port)
                      .request_handler(server_handler(args.m_root_dir))
                      .read_next_http_message_timelimit(10s)
                      .write_http_response_timelimit(1s)
                      .handle_request_timeout(1s)
                      .tls_context(std::move(tls_context)));
  } catch (const std::exception &ex) {
    std::cerr << "Error: " << ex.what() << std::endl;
    return 1;
  }

  return 0;
}
