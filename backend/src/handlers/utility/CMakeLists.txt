find_package(string-view-lite 1.3.0 REQUIRED)

add_library(content_type "content_type_from_ext.hpp" "content_type_from_ext.cpp")
target_include_directories(content_type PUBLIC "..")
set_target_properties(content_type PROPERTIES LINKER_LANGUAGE CXX)
target_link_libraries(content_type PUBLIC string-view-lite::string-view-lite)

if(${RUN_TIDY})
  include("clang-tidy")
  setup_clang_tidy(content_type)

  include("clang-format")
  setup_clang_format(content_type)

  include("cmake-format")
  setup_cmake_format(utility "${CMAKE_CURRENT_LIST_DIR}/CMakeLists.txt")
endif()
