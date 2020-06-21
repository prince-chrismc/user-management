// MIT License

#include "web_app_handler.hpp"

#include "utility/content_type_from_ext.hpp"

namespace handler {
namespace web_app {
restinio::request_handling_status_t link(restinio::request_handle_t req, restinio::router::route_params_t params) {
  static auto modified_at = restinio::make_date_field_value(std::chrono::system_clock::now());
  auto expires_at = restinio::make_date_field_value(std::chrono::system_clock::now() + std::chrono::hours(24 * 7));

  return req->create_response()
      .append_header(restinio::http_field::server, "RESTinio")
      .append_header_date_field()
      .append_header(restinio::http_field::last_modified, std::move(modified_at))
      .append_header(restinio::http_field::expires, std::move(expires_at))
      .append_header(restinio::http_field::content_type, content_type_by_file_extention("html"))
      .set_body(R"###(<html><head><title>React from C++</title></head><body>
          <a href="web-app/">Link to the user front end...</a></body></html>)###")
      .done();
}

restinio::request_handling_status_t redirect(restinio::request_handle_t req, restinio::router::route_params_t params) {
  return req->create_response(restinio::status_found())
      .append_header_date_field()
      .append_header(restinio::http_field::location, "/index.html")
      .done();
}
}  // namespace web_app
}  // namespace handler