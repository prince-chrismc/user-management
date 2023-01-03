// MIT License

#include "web_app.hpp"

#include "utility/content_type_from_ext.hpp"
#include "utility/add_headers.hpp"

namespace handler {
namespace web_app {
request_status link(const request_handle& req, route_params /*params*/) {
  static auto modified_at = restinio::make_date_field_value(std::chrono::system_clock::now());
  auto expires_at = restinio::make_date_field_value(std::chrono::system_clock::now() + std::chrono::hours(24 * 7));

  return response::impl::add_generic_headers(req->create_response())
      .append_header(restinio::http_field::last_modified, std::move(modified_at))
      .append_header(restinio::http_field::expires, std::move(expires_at))
      .append_header(restinio::http_field::content_type, content_type_by_file_extention("html"))
      .set_body(R"###(<html><head><title>User Management</title></head><body>
          <a href="frontend/">Link to the user front end...</a></body></html>)###")
      .done();
}

request_status redirect(const request_handle& req, route_params /*params*/) {
  return response::impl::add_generic_headers(req->create_response(restinio::status_found()))
      .append_header(restinio::http_field::location, "/index.html")
      .done();
}
}  // namespace web_app
}  // namespace handler
