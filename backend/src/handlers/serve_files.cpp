// MIT License

#include "serve_files.hpp"

#include "utility/content_type_from_ext.hpp"

namespace handler {
namespace serve_files {

restinio::request_handling_status_t from_disk::operator()(restinio::request_handle_t req,
                                                          restinio::router::route_params_t params) {
  auto path = req->header().path();

  if (std::string::npos == path.find("..")) {
    // A nice path.
    const auto file_path = server_root_dir + std::string{path.data(), path.size()};
    const auto seperator = file_path.find_last_of('.');
    const auto ext = (seperator == std::string::npos) ? "" : file_path.substr(seperator + 1);
    try {
      auto sf = restinio::sendfile(file_path);
      auto modified_at = restinio::make_date_field_value(sf.meta().last_modified_at());

      auto expires_at = restinio::make_date_field_value(std::chrono::system_clock::now() + std::chrono::hours(24 * 7));

      return req->create_response()
          .append_header(restinio::http_field::server, "RESTinio")
          .append_header_date_field()
          .append_header(restinio::http_field::last_modified, std::move(modified_at))
          .append_header(restinio::http_field::expires, std::move(expires_at))
          .append_header(restinio::http_field::content_type, content_type_by_file_extention(ext))
          .set_body(std::move(sf))
          .done();
    } catch (const std::exception &) {
      return req->create_response(restinio::status_not_found()).append_header_date_field().connection_close().done();
    }
  } else {
    return req->create_response(restinio::status_forbidden()).append_header_date_field().connection_close().done();
  }
}
}  // namespace serve_files
}  // namespace handler
