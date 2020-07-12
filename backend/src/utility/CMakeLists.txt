find_package(lyra 1.4.0 REQUIRED)
find_package(string-view-lite 1.3.0 REQUIRED)
find_package(fmt 6.2.1 REQUIRED)

add_library(content_type "content_type_from_ext.hpp" "content_type_from_ext.cpp")
target_include_directories(content_type PUBLIC "..")
set_target_properties(content_type PROPERTIES LINKER_LANGUAGE CXX)
target_link_libraries(content_type PUBLIC string-view-lite::string-view-lite)

add_library(app_args "app_args.hpp" "app_args.cpp")
target_include_directories(app_args PUBLIC "..")
set_target_properties(app_args PROPERTIES LINKER_LANGUAGE CXX)
target_link_libraries(app_args PUBLIC lyra::lyra fmt::fmt)

if(${RUN_TIDY})
  include("clang-tidy")
  setup_clang_tidy(utility_tidy "content_type_from_ext.hpp" "content_type_from_ext.cpp" "app_args.hpp" "app_args.cpp")

  include("cmake-format")
  setup_cmake_format(utility "${CMAKE_CURRENT_LIST_DIR}/CMakeLists.txt")
endif()
