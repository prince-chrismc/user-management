// MIT License

#include "routing.hpp"

namespace handler {
namespace response {

class builder;
namespace impl {
inline void add_cors_headers(builder& builder);
}  // namespace impl

class builder {
  restinio::response_builder_t<restinio::restinio_controlled_output_t> builder_;

 public:
  builder(const request_handle& req) : builder_{req->create_response()} {
    impl::add_cors_headers(*this);
    // add_api_headers(builder_);
    // add_edit_headers(builder_);
  }

  builder& append_header(restinio::http_field_t field_id, std::string field_value) {
    builder_.append_header(field_id, std::move(field_value));
    return *this;
  }

  builder& set_body(std::string body) {
    builder_.set_body(std::move(body));
    return *this;
  }

  auto done() { return builder_.done(); }
};

namespace impl {
inline void add_cors_headers(builder& builder) {
  builder.append_header(restinio::http_field::access_control_allow_origin, "*");
}
}  // namespace impl
}  // namespace response
}  // namespace handler
