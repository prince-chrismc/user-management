find_package(restinio 0.6.8 REQUIRED)
find_package(lyra 1.4.0 REQUIRED)

add_executable(
  reactjs-from-cpp
  "main.cpp"
  "utility/content_type_from_ext.hpp"
  "utility/content_type_from_ext.cpp"
  "handlers/web_app_handler.hpp"
  "handlers/web_app_handler.cpp"
  "handlers/serve_files.hpp"
  "handlers/serve_files.cpp")

target_include_directories(
  reactjs-from-cpp PRIVATE $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}>
                           $<INSTALL_INTERFACE:include>)
target_link_libraries(reactjs-from-cpp user_management::user_management
                      restinio::restinio lyra::lyra)
