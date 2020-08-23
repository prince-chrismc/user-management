// MIT License

#include "routing.hpp"
#include "um/user_management.hpp"

namespace handler {
namespace response {
using http_field = restinio::http_field;
using http_status_line = restinio::http_status_line_t;

class builder;
namespace impl {
inline void add_generic_headers(builder& builder);
inline void add_cors_headers(builder& builder);
inline void add_api_headers(builder& builder);
}  // namespace impl

class builder {
  restinio::response_builder_t<restinio::restinio_controlled_output_t> builder_;

 public:
  builder(const request_handle& req, const http_status_line& status) : builder_{req->create_response(status)} {
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

  builder(const request_handle& req) : builder(req, restinio::status_ok()) {}

  builder& append_header(http_field field_id, std::string field_value) {
    builder_.append_header(field_id, std::move(field_value));
    return *this;
  }

  builder& append_header(http_field field_id, std::chrono::system_clock::time_point tp) {
    builder_.append_header(field_id, restinio::make_date_field_value(tp));
    return *this;
  }

  builder& set_body(std::string body) {
    builder_.set_body(std::move(body));
    return *this;
  }

  auto done() { return builder_.done(); }
};

template <class exception = std::exception>
class error_builder : builder {
 public:
  using builder::builder;
  using builder::done;

  error_builder& set_body(const exception& e) {
    builder::set_body(user_management::json({{"error", e.what()}}).dump());
    return *this;
  }
};

class not_found : public error_builder<user_management::user_does_not_exist> {
 public:
  not_found(const request_handle& req) : error_builder(req, restinio::status_not_found()){};
};

class unsupported_media_type : public error_builder<> {
 public:
  unsupported_media_type(const request_handle& req) : error_builder(req, restinio::status_unsupported_media_type()){};
};

class precondition_required : public error_builder<> {
 public:
  precondition_required(const request_handle& req) : error_builder(req, restinio::status_precondition_required()) {}
};

class precondition_failed : public error_builder<> {
 public:
  precondition_failed(const request_handle& req) : error_builder(req, restinio::status_precondition_failed()) {}
};

namespace builders {
class list : public builder {
 public:
  static void add_cors_methods_header(builder& builder) {
    builder.append_header(http_field::access_control_allow_methods, "GET, PUT");
  }

  list(const request_handle& req, const http_status_line& status) : builder(req, status) {
    add_cors_methods_header(*this);
  }

  list(const request_handle& req) : list(req, restinio::status_ok()) {}
};

class user : public builder {
 public:
  static void add_cors_methods_header(builder& builder) {
    builder.append_header(http_field::access_control_allow_methods, "GET, PATCH, DELETE");
  }

  user(const request_handle& req, const http_status_line& status) : builder(req, status) {
    add_cors_methods_header(*this);
  }

  user(const request_handle& req) : user(req, restinio::status_ok()) {}
};
}  // namespace builders

namespace impl {
inline void add_generic_headers(builder& builder) {
  builder.append_header(http_field::server, "user-management/1.0.0-dev.0; restinio/0.6.8.1")
      .append_header(http_field::date, std::chrono::system_clock::now());
}
inline void add_cors_headers(builder& builder) {
  builder.append_header(http_field::access_control_allow_origin, "*")
      .append_header(restinio::http_field::access_control_allow_headers, "Content-Type")
      .append_header(restinio::http_field::access_control_max_age, "86400");
}
inline void add_api_headers(builder& builder) { builder.append_header(http_field::content_type, "application/json"); }
}  // namespace impl
}  // namespace response
}  // namespace handler
