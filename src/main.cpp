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

#ifdef _WIN32
#include <sdkddkver.h>
#endif

#include <restinio/all.hpp>
#include <restinio/tls.hpp>

#include <iostream>

template <typename RESP> RESP init_resp(RESP resp) {
  resp.append_header(restinio::http_field::server,
                     "RESTinio sample server /v0.6.5");
  resp.append_header_date_field();

  return resp;
}

namespace rr = restinio::router;
using router_t = rr::express_router_t<>;

auto server_handler() {
  auto router = std::make_unique<router_t>();

  router->http_get("/Timer.js", [](auto req, auto) {
    init_resp(req->create_response())
        .append_header(restinio::http_field::content_type,
                       "application/javascript; charset=utf-8")
        .set_body(R"###(import React from 'react';
import ReactDOM from 'react-dom';

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { seconds: 0 };
  }

  tick() {
    this.setState(state => ({
      seconds: state.seconds + 1
    }));
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        Seconds: {this.state.seconds}
      </div>
    );
  }
}

ReactDOM.render(
  <Timer />,
  document.getElementById('timer-example')
);)###")
        .done();

    return restinio::request_accepted();
  });
  router->http_get("/", [](auto req, auto) {
    init_resp(req->create_response())
        .append_header(restinio::http_field::content_type,
                       "text/html; charset=utf-8")
        .set_body(R"###(<body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="timer-example"></div>
    <script src=Timer.js></script>
    </body>
    )###")
        .done();

    return restinio::request_accepted();
  });
  
  return router;
}

int main(int argc, const char *argv[]) {
  using namespace std::chrono;

  std::string certs_dir = ".";

  if (2 == argc) {
    certs_dir = argv[1];
  }

  try {
    using traits_t = restinio::single_thread_tls_traits_t<
        restinio::asio_timer_manager_t,
        restinio::single_threaded_ostream_logger_t, router_t>;

    // Since RESTinio supports both stand-alone ASIO and asio_ns
    // we specify an alias for a concrete asio namesace.
    // That's makes it possible to compile the code in both cases.
    // Typicaly only one of ASIO variants would be used,
    // and so only asio::* or only asio_ns::* would be applied.
    namespace asio_ns = restinio::asio_ns;

    asio_ns::ssl::context tls_context{asio_ns::ssl::context::tls};
    tls_context.set_options(
        asio_ns::ssl::context::default_workarounds |
        asio_ns::ssl::context::no_sslv2 | asio_ns::ssl::context::no_sslv3 |
        asio_ns::ssl::context::no_tlsv1 | asio_ns::ssl::context::single_dh_use);

    tls_context.use_certificate_chain_file(certs_dir + "/server.pem");
    tls_context.use_private_key_file(certs_dir + "/key.pem",
                                     asio_ns::ssl::context::pem);
    tls_context.use_tmp_dh_file(certs_dir + "/dh2048.pem");

    restinio::run(restinio::on_this_thread<traits_t>()
                      .address("0.0.0.0")
                      .port(8443)
                      .request_handler(server_handler())
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
