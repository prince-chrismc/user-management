// MIT License

#ifndef HANDLERS_UTILITY_RESPONSE_BUILDER_HPP_
#define HANDLERS_UTILITY_RESPONSE_BUILDER_HPP_

#include "routing.hpp"
#include "um/user_management.hpp"

namespace handler {
namespace response {
using http_field = restinio::http_field;
using http_status_line = restinio::http_status_line_t;

class builder {
  restinio::response_builder_t<restinio::restinio_controlled_output_t> builder_;

 public:
  builder(const request_handle& req, const http_status_line& status);
  explicit builder(const request_handle& req);

  builder& append_header(http_field field_id, std::string field_value);
  builder& append_header(http_field field_id, std::chrono::system_clock::time_point tp);
  builder& set_body(std::string body);

  auto done() { return builder_.done(); }
};

template <class exception = std::exception>
class error_builder : builder {
 public:
  explicit error_builder(const request_handle& req) : builder(req, restinio::status_bad_request()) {}
  using builder::builder;
  using builder::done;

  error_builder& set_body(const exception& e) {
    builder::set_body(user_management::json({{"error", e.what()}}).dump());
    return *this;
  }
};

struct not_found : error_builder<user_management::user_does_not_exist> {
  explicit not_found(const request_handle& req) : error_builder(req, restinio::status_not_found()) {}
};

struct unsupported_media_type : error_builder<std::runtime_error> {
  explicit unsupported_media_type(const request_handle& req)
      : error_builder(req, restinio::status_unsupported_media_type()) {}
};

struct precondition_required : error_builder<std::runtime_error> {
  explicit precondition_required(const request_handle& req)
      : error_builder(req, restinio::status_precondition_required()) {}
};

struct precondition_failed : error_builder<std::runtime_error> {
  explicit precondition_failed(const request_handle& req)
      : error_builder(req, restinio::status_precondition_failed()) {}
};

namespace builders {
struct list : builder {
  list(const request_handle& req, const http_status_line& status);
  explicit list(const request_handle& req);

  static void add_cors_methods_header(builder& builder);
};

struct user : builder {
  user(const request_handle& req, const http_status_line& status);
  explicit user(const request_handle& req);

  static void add_cors_methods_header(builder& builder);
};
}  // namespace builders
}  // namespace response
}  // namespace handler

#endif  // HANDLERS_UTILITY_RESPONSE_BUILDER_HPP_
