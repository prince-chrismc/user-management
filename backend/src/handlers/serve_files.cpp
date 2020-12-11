// MIT License

#include "serve_files.hpp"

#include "logging/logger.hpp"
#include "utility/add_headers.hpp"
#include "utility/content_type_from_ext.hpp"

namespace handler {
namespace serve_files {

static const logger log{"serve_files"};

request_status from_disk::operator()(const request_handle& req, route_params /*params*/) {
  auto path = req->header().path();
  log.trace("attempting to server file '{}' from disk", path);

  if (std::string::npos == path.find("..")) {
    // A nice path.
    const auto file_path = server_root_dir + path.data();
    const auto seperator = file_path.find_last_of('.');
    const nonstd::string_view ext = (seperator == std::string::npos) ? "" : &file_path[seperator + 1];
    const nonstd::string_view content_type = content_type_by_file_extention(ext);
    log.trace("the file extention is '{}' with content type '{}'", ext, content_type);
    try {
      auto sf = restinio::sendfile(file_path);
      auto modified_at = restinio::make_date_field_value(sf.meta().last_modified_at());
      auto expires_at = restinio::make_date_field_value(std::chrono::system_clock::now() + std::chrono::hours(24 * 7));
      log.trace("the file was last modified at '{}' and will expire at '{}'", modified_at, expires_at);

      log.info("ok (200) sending file '{}'", path);
      return response::impl::add_generic_headers(req->create_response())
          .append_header(restinio::http_field::last_modified, std::move(modified_at))
          .append_header(restinio::http_field::expires, std::move(expires_at))
          .append_header(restinio::http_field::content_type, content_type.data())
          .set_body(std::move(sf))
          .done();
    } catch (const std::exception&) {
      log.info("unable to find (404) '{}'", path);
      return response::impl::add_generic_headers(req->create_response(restinio::status_not_found()))
          .connection_close()
          .done();
    }
  } else {
    log.warn("forbiding (403) request for '{}'", path);
    return response::impl::add_generic_headers(req->create_response(restinio::status_forbidden()))
        .connection_close()
        .done();
  }
}
}  // namespace serve_files
}  // namespace handler
