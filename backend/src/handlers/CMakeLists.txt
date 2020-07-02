find_package(restinio 0.6.8 REQUIRED)

add_library(user_database "user_database.hpp" "user_database.cpp")
target_include_directories(user_database PUBLIC "..")
set_target_properties(user_database PROPERTIES LINKER_LANGUAGE CXX)
target_link_libraries(user_database PUBLIC user_management::user_management
                                           restinio::restinio)

add_library(serve_files "serve_files.hpp" "serve_files.cpp")
target_include_directories(serve_files PUBLIC "..")
set_target_properties(serve_files PROPERTIES LINKER_LANGUAGE CXX)
target_link_libraries(serve_files PUBLIC content_type restinio::restinio)

add_library(web_app "web_app.hpp" "web_app.cpp")
target_include_directories(web_app PUBLIC "..")
set_target_properties(web_app PROPERTIES LINKER_LANGUAGE CXX)
target_link_libraries(web_app PUBLIC content_type restinio::restinio)

if(${RUN_TIDY})
  include("clang-tidy")
  setup_clang_tidy(
    handlers_tidy
    "user_database.hpp"
    "user_database.cpp"
    "serve_files.hpp"
    "serve_files.cpp"
    "web_app.hpp"
    "web_app.cpp")
endif()
