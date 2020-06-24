// MIT License

#include <restinio/router/express.hpp>

namespace handler {
namespace serve_files {
struct from_disk {
  std::string server_root_dir;

  restinio::request_handling_status_t operator()(const restinio::request_handle_t& req,
                                                 restinio::router::route_params_t params);
};
}  // namespace serve_files
}  // namespace handler
