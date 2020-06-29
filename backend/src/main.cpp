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
#include "handlers/user_database.hpp"
#include "handlers/web_app_handler.hpp"
#include "utility/app_args.hpp"

#ifdef _WIN32
#include <sdkddkver.h>
#endif

#include <restinio/all.hpp>
#include <restinio/tls.hpp>

#include <iostream>
#include <map>

using namespace std::chrono_literals;  // NOLINT(google-build-using-namespace)

using router_t = restinio::router::express_router_t<>;

auto server_handler(const std::string &root_dir, user_management::user_list &list) {
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

  router->http_get("/um/v1/users", handler::user::get_list{list});
  router->http_get(R"(/um/v1/users/:id(\d+))", handler::user::get_user{list});

  router->http_post("/um/v1/users", handler::user::add{list});
  router->http_delete(R"(/um/v1/users/:id(\d+))", handler::user::remove{list});
  router->add_handler(restinio::http_method_patch(), R"(/um/v1/users/:id(\d+))", handler::user::edit{list});

  router->add_handler(restinio::http_method_options(), "/um/v1/users", &handler::user::preflight::list);
  router->add_handler(restinio::http_method_options(), R"(/um/v1/users/:id(\d+))", &handler::user::preflight::user);

  return router;
}

int main(int argc, char const *argv[]) {
  try {
    const auto args = app_args_t::parse(argc, argv);

    if (args.help) {
      return 0;
    }

    using traits_t = restinio::tls_traits_t<restinio::asio_timer_manager_t, restinio::null_logger_t, router_t>;

    namespace asio = restinio::asio_ns;

    asio::ssl::context tls_context{asio::ssl::context::tls};
    tls_context.set_options(asio::ssl::context::default_workarounds | asio::ssl::context::no_sslv2 |
                            asio::ssl::context::no_sslv3 | asio::ssl::context::no_tlsv1 |
                            asio::ssl::context::single_dh_use);

    tls_context.use_certificate_chain_file(args.certs_dir + "/server.pem");
    tls_context.use_private_key_file(args.certs_dir + "/key.pem", asio::ssl::context::pem);
    tls_context.use_tmp_dh_file(args.certs_dir + "/dh2048.pem");

    user_management::user_list list;

    restinio::run(restinio::on_thread_pool<traits_t>(args.pool_size)
                      .address(args.address)
                      .port(args.port)
                      .request_handler(server_handler(args.root_dir, list))
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
