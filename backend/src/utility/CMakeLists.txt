find_package(lyra 1.6.0 REQUIRED)
find_package(fmt 8.1.1 REQUIRED)
find_package(expected-lite 0.5.0 REQUIRED)
find_package(optional-lite 3.4.0 REQUIRED)
find_package(spdlog 1.10.0 REQUIRED)

add_library(app_args "app_args.hpp" "app_args.cpp")
target_include_directories(app_args PUBLIC "..")
set_target_properties(app_args PROPERTIES LINKER_LANGUAGE CXX CXX_STANDARD 14 CXX_STANDARD_REQUIRED TRUE)
target_link_libraries(app_args PUBLIC nonstd::expected-lite nonstd::optional-lite PRIVATE bfg::lyra fmt::fmt)

add_library(server_logger INTERFACE "server_logger.hpp")
target_include_directories(server_logger INTERFACE "..")
set_target_properties(server_logger PROPERTIES LINKER_LANGUAGE CXX CXX_STANDARD 14 CXX_STANDARD_REQUIRED TRUE)
target_link_libraries(server_logger INTERFACE logger)

if(RUN_TIDY)
  setup_clang_tidy(app_args)
  setup_clang_tidy(server_logger)

  setup_clang_format(app_args)
  setup_clang_format(server_logger)

  setup_cmake_format(src-utility ${CMAKE_CURRENT_LIST_DIR}/CMakeLists.txt)
endif()
