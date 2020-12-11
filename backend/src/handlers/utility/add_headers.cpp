// MIT License

#include "add_headers.hpp"

#include <fmt/compile.h>
#include <restinio/version.hpp>

#include "um/user_management.hpp"

namespace handler {
namespace response {
namespace impl {
std::string server_declaration() {
  return fmt::format(FMT_COMPILE("user-management/{}; restinio/{}.{}.{}"), user_management::version,
                     RESTINIO_VERSION_MAJOR, RESTINIO_VERSION_MINOR, RESTINIO_VERSION_PATCH);
}
}  // namespace impl
}  // namespace response
}  // namespace handler
