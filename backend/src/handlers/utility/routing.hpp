// MIT License

#ifndef HANDLERS_UTILITY_ROUTING_HPP_
#define HANDLERS_UTILITY_ROUTING_HPP_

#include <restinio/router/express.hpp>

namespace handler {
using router = restinio::router::express_router_t<>;
using request_status = restinio::request_handling_status_t;
using request_handle = restinio::request_handle_t;
using route_params = restinio::router::route_params_t;
}  // namespace handler

#endif  // HANDLERS_UTILITY_ROUTING_HPP_
