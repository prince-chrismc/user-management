// MIT License

#ifndef HANDLERS_UTILITY_ADD_HEADERS_HPP_
#define HANDLERS_UTILITY_ADD_HEADERS_HPP_

#include <restinio/http_headers.hpp>

#include <chrono>
#include <utility>

namespace handler {
namespace response {
namespace impl {
std::string server_declaration();

template <class response_builder>
response_builder add_generic_headers(response_builder builder) {
  builder.append_header(restinio::http_field::server, server_declaration())
      .append_header_date_field();
  return std::move(builder);
}
}  // namespace impl
}  // namespace response
}  // namespace handler

#endif  // HANDLERS_UTILITY_ADD_HEADERS_HPP_
