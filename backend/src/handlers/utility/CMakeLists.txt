find_package(string-view-lite 1.3.0 REQUIRED)

add_library(routing "routing.hpp")
target_include_directories(routing PUBLIC "..")
set_target_properties(routing PROPERTIES LINKER_LANGUAGE CXX)
target_link_libraries(routing PUBLIC restinio::restinio)

add_library(response_builder "response_builder.hpp")
target_include_directories(response_builder PUBLIC "..")
set_target_properties(response_builder PROPERTIES LINKER_LANGUAGE CXX)
target_link_libraries(response_builder PUBLIC routing user_management)

add_library(content_type "content_type_from_ext.hpp" "content_type_from_ext.cpp")
target_include_directories(content_type PUBLIC "..")
set_target_properties(content_type PROPERTIES LINKER_LANGUAGE CXX)
target_link_libraries(content_type PUBLIC string-view-lite::string-view-lite)

if(${RUN_TIDY})
  include("clang-tidy")
  setup_clang_tidy(routing)
  setup_clang_tidy(response_builder)
  setup_clang_tidy(content_type)

  include("clang-format")
  setup_clang_format(routing)
  setup_clang_format(response_builder)
  setup_clang_format(content_type)

  include("cmake-format")
  setup_cmake_format(handler-utility "${CMAKE_CURRENT_LIST_DIR}/CMakeLists.txt")
endif()
