find_package(restinio 0.6.8 REQUIRED)

add_library(routing "routing.hpp")
target_include_directories(routing PUBLIC "..")
set_target_properties(routing PROPERTIES LINKER_LANGUAGE CXX)
target_link_libraries(routing PUBLIC restinio::restinio)

add_library(user_routes "user_routes.hpp" "user_routes.cpp")
target_include_directories(user_routes PUBLIC "..")
set_target_properties(user_routes PROPERTIES LINKER_LANGUAGE CXX)
target_link_libraries(user_routes PUBLIC user_management::user_management routing)

add_library(serve_files "serve_files.hpp" "serve_files.cpp")
target_include_directories(serve_files PUBLIC "..")
set_target_properties(serve_files PROPERTIES LINKER_LANGUAGE CXX)
target_link_libraries(serve_files PUBLIC content_type routing)

add_library(web_app "web_app.hpp" "web_app.cpp")
target_include_directories(web_app PUBLIC "..")
set_target_properties(web_app PROPERTIES LINKER_LANGUAGE CXX)
target_link_libraries(web_app PUBLIC content_type routing)

if(${RUN_TIDY})
  include("clang-tidy")
  setup_clang_tidy(handlers "routing.hpp" "user_routes.hpp" "user_routes.cpp" "serve_files.hpp" "serve_files.cpp"
                   "web_app.hpp" "web_app.cpp")

  include("cmake-format")
  setup_cmake_format(handlers "${CMAKE_CURRENT_LIST_DIR}/CMakeLists.txt")
endif()
