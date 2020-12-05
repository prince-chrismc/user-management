find_package(lyra 1.5.0 REQUIRED)
find_package(fmt 7.1.2 REQUIRED)

add_library(app_args "app_args.hpp" "app_args.cpp")
target_include_directories(app_args PUBLIC "..")
set_target_properties(app_args PROPERTIES LINKER_LANGUAGE CXX)
target_link_libraries(app_args PUBLIC bfg::lyra fmt::fmt)

if(${RUN_TIDY})
  include("clang-tidy")
  setup_clang_tidy(app_args)

  include("clang-format")
  setup_clang_format(app_args)

  include("cmake-format")
  setup_cmake_format(src-utility "${CMAKE_CURRENT_LIST_DIR}/CMakeLists.txt")
endif()
