// MIT License

#include "routing.hpp"

namespace handler {
namespace web_app {
request_status link(const request_handle& req,
                                         route_params params);
request_status redirect(const request_handle& req,
                                             route_params params);
}  // namespace web_app
}  // namespace handler