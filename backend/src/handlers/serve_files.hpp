// MIT License

#include "routing.hpp"

namespace handler {
namespace serve_files {
struct from_disk {
  const std::string server_root_dir;

  request_status operator()(const request_handle& req,
                                                 route_params params);
};
}  // namespace serve_files
}  // namespace handler
