// MIT License

#include "response_builder.hpp"

#include "add_headers.hpp"

namespace handler {
namespace response {
namespace impl {
void add_generic_headers(builder& builder) {
  builder.append_header(http_field::server, server_declaration())
      .append_header(http_field::date, std::chrono::system_clock::now());
}
void add_cors_headers(builder& builder) {
  builder.append_header(http_field::access_control_allow_origin, "*")
      .append_header(http_field::access_control_allow_headers, "Content-Type")
      .append_header(http_field::access_control_max_age, "86400");
}
void add_api_headers(builder& builder) {
  builder.append_header(http_field::content_type, "application/json");
}
}  // namespace impl

builder::builder(const request_handle& req, const http_status_line& status) : builder_{req->create_response(status)} {
  impl::add_generic_headers(*this);
  impl::add_cors_headers(*this);

  // Some responses codes do not require the API Content-Type header
  switch (status.status_code().raw_code()) {
    case restinio::status_code::no_content.raw_code():
    case restinio::status_code::not_modified.raw_code():
      break;
    default:
      impl::add_api_headers(*this);
  }
}

builder::builder(const request_handle& req) : builder(req, restinio::status_ok()) {}

builder& builder::append_header(http_field field_id, std::string field_value) {
  builder_.append_header(field_id, std::move(field_value));
  return *this;
}

builder& builder::append_header(http_field field_id, std::chrono::system_clock::time_point tp) {
  builder_.append_header(field_id, restinio::make_date_field_value(tp));
  return *this;
}

builder& builder::set_body(std::string body) {
  builder_.set_body(std::move(body));
  return *this;
}

namespace builders {
list::list(const request_handle& req, const http_status_line& status) : builder(req, status) {
  add_cors_methods_header(*this);
}

list::list(const request_handle& req) : list(req, restinio::status_ok()) {}

void list::add_cors_methods_header(builder& builder) {
  builder.append_header(http_field::access_control_allow_methods, "GET, PUT");
}

user::user(const request_handle& req, const http_status_line& status) : builder(req, status) {
  add_cors_methods_header(*this);
}

user::user(const request_handle& req) : user(req, restinio::status_ok()) {}

void user::add_cors_methods_header(builder& builder) {
  builder.append_header(http_field::access_control_allow_methods, "GET, PATCH, DELETE");
}
}  // namespace builders
}  // namespace response
}  // namespace handler
