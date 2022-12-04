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
#include "handlers/user_routes.hpp"
#include "handlers/web_app.hpp"
#include "utility/app_args.hpp"
#include "utility/server_logger.hpp"

#ifdef _WIN32
#include <sdkddkver.h>
#endif

#include <restinio/all.hpp>
#include <restinio/tls.hpp>

#include <iostream>
#include <map>

using namespace std::chrono_literals;  // NOLINT(google-build-using-namespace)
using user_database = handler::user::database;

auto server_handler(const std::string &root_dir, user_database &db) {
  std::string server_root_dir;

  if (root_dir.empty()) {
    server_root_dir = "./";
  } else if (root_dir.back() != '/' && root_dir.back() != '\\') {
    server_root_dir = root_dir + '/';
  } else {
    server_root_dir = root_dir;
  }

  auto router = std::make_unique<handler::router>();

  router->http_get("/", &handler::web_app::link);
  router->http_get("/frontend/", &handler::web_app::redirect);
  router->http_get(R"(/:path(.*)\.:ext(.*))", restinio::path2regex::options_t{}.strict(true),
                   handler::serve_files::from_disk{server_root_dir});

  handler::user::fill::list(*router, db);
  handler::user::fill::user(*router, db);

  return router;
}

template <bool enable_tls>
struct server_traits : restinio::traits_t<restinio::asio_timer_manager_t, server_logger, handler::router> {};
template <>
struct server_traits<true> : restinio::tls_traits_t<restinio::asio_timer_manager_t, server_logger, handler::router> {};

template <typename traits>
restinio::run_on_thread_pool_settings_t<traits> make_settings(const app_args_t &args) {
  return restinio::on_thread_pool<traits>(args.pool_size)
      .address(args.address)
      .port(args.port)
      .read_next_http_message_timelimit(10s)
      .write_http_response_timelimit(1s)
      .handle_request_timeout(1s);
}

namespace ssl = restinio::asio_ns::ssl;
int main(int argc, char const *argv[]) {
  const auto args = app_args_t::parse(argc, argv);
  if (!args.has_value()) return static_cast<int>(args.error());

  // Setup the empty database
  user_database db;

  const auto enable_tls = args->certs_dir.has_value();

  try {
    if (enable_tls) {
      ssl::context tls_context{ssl::context::tls};
      tls_context.set_options(ssl::context::default_workarounds | ssl::context::no_sslv2 | ssl::context::no_sslv3 |
                              ssl::context::no_tlsv1 | ssl::context::no_tlsv1_1 | ssl::context::single_dh_use);

      const auto &certs_dir = args->certs_dir.value();
      tls_context.use_certificate_chain_file(certs_dir + "/server.pem");
      tls_context.use_private_key_file(certs_dir + "/key.pem", ssl::context::pem);
      tls_context.use_tmp_dh_file(certs_dir + "/dh2048.pem");

      auto pool_settings = make_settings<server_traits<true>>(args.value());
      pool_settings.tls_context(std::move(tls_context)).request_handler(server_handler(args->root_dir, db));
      restinio::run(std::move(pool_settings));
    } else {
      auto pool_settings = make_settings<server_traits<false>>(args.value());
      pool_settings.request_handler(server_handler(args->root_dir, db));
      restinio::run(std::move(pool_settings));
    }

  } catch (const std::exception &ex) {
    std::cerr << "Error: " << ex.what() << std::endl;
    return 1;
  }

  return 0;
}
