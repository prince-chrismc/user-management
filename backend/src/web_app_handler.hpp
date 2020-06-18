// MIT License

#include <restinio/router/express.hpp>

namespace handler {
namespace web_app {
restinio::request_handling_status_t link(restinio::request_handle_t req, restinio::router::route_params_t params);
restinio::request_handling_status_t redirect(restinio::request_handle_t req, restinio::router::route_params_t params);
}  // namespace web_app
}  // namespace handler