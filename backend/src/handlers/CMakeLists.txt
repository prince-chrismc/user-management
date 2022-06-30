add_subdirectory("utility")

add_library(user_routes "user_routes.hpp" "user_routes.cpp")
target_include_directories(user_routes PUBLIC "..")
set_target_properties(user_routes PROPERTIES LINKER_LANGUAGE CXX CXX_STANDARD 14 CXX_STANDARD_REQUIRED TRUE)
target_link_libraries(user_routes PUBLIC routing users_databse PRIVATE response_builder logger)

add_library(serve_files "serve_files.hpp" "serve_files.cpp")
target_include_directories(serve_files PUBLIC "..")
set_target_properties(serve_files PROPERTIES LINKER_LANGUAGE CXX CXX_STANDARD 14 CXX_STANDARD_REQUIRED TRUE)
target_link_libraries(serve_files PUBLIC routing PRIVATE content_type add_headers logger)

add_library(web_app "web_app.hpp" "web_app.cpp")
target_include_directories(web_app PUBLIC "..")
set_target_properties(web_app PROPERTIES LINKER_LANGUAGE CXX CXX_STANDARD 14 CXX_STANDARD_REQUIRED TRUE)
target_link_libraries(web_app PUBLIC routing PRIVATE content_type add_headers)

if(RUN_TIDY)
  setup_clang_tidy(user_routes)
  setup_clang_tidy(serve_files)
  setup_clang_tidy(web_app)

  setup_clang_format(user_routes)
  setup_clang_format(serve_files)
  setup_clang_format(web_app)

  setup_cmake_format(handlers ${CMAKE_CURRENT_LIST_DIR}/CMakeLists.txt)
endif()
