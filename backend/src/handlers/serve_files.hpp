// MIT License

#ifndef HANDLERS_SERVE_FILES_HPP_
#define HANDLERS_SERVE_FILES_HPP_

#include "utility/routing.hpp"

namespace handler {
namespace serve_files {
struct from_disk {
  const std::string server_root_dir;

  request_status operator()(const request_handle& req, route_params params);
};
}  // namespace serve_files
}  // namespace handler

#endif  // HANDLERS_SERVE_FILES_HPP_
