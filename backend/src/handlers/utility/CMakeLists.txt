find_package(restinio 0.6.10 REQUIRED)

add_library(routing INTERFACE "routing.hpp")
target_include_directories(routing INTERFACE "..")
set_target_properties(routing PROPERTIES LINKER_LANGUAGE CXX CXX_STANDARD 14 CXX_STANDARD_REQUIRED TRUE)
target_link_libraries(routing INTERFACE restinio::restinio nonstd::string-view-lite) # Temporary work

add_library(add_headers "add_headers.hpp" "add_headers.cpp")
target_include_directories(add_headers PUBLIC "..")
set_target_properties(add_headers PROPERTIES LINKER_LANGUAGE CXX)
target_link_libraries(add_headers PUBLIC restinio::restinio PRIVATE user_management fmt::fmt)
target_compile_features(add_headers PRIVATE cxx_std_17)

add_library(response_builder "response_builder.hpp" "response_builder.cpp")
target_include_directories(response_builder PUBLIC "..")
set_target_properties(response_builder PROPERTIES LINKER_LANGUAGE CXX CXX_STANDARD 14 CXX_STANDARD_REQUIRED TRUE)
target_link_libraries(response_builder PUBLIC routing add_headers user_management)

add_library(content_type "content_type_from_ext.hpp" "content_type_from_ext.cpp")
target_include_directories(content_type PUBLIC "..")
set_target_properties(content_type PROPERTIES LINKER_LANGUAGE CXX CXX_STANDARD 14 CXX_STANDARD_REQUIRED TRUE)
target_link_libraries(content_type PUBLIC nonstd::string-view-lite)

if(RUN_TIDY)
  setup_clang_tidy(routing)
  setup_clang_tidy(add_headers)
  setup_clang_tidy(response_builder)
  setup_clang_tidy(content_type)

  setup_clang_format(routing)
  setup_clang_format(add_headers)
  setup_clang_format(response_builder)
  setup_clang_format(content_type)

  setup_cmake_format(handlers-utility ${CMAKE_CURRENT_LIST_DIR}/CMakeLists.txt)
endif()
