add_subdirectory("database")
add_subdirectory("handlers")
add_subdirectory("utility")

add_executable(user_database_app "main.cpp")
target_link_libraries(user_database_app user_routes serve_files web_app app_args)

if(${RUN_TIDY})
  include("clang-tidy")
  setup_clang_tidy(user_database_app)

  include("clang-format")
  setup_clang_format(user_database_app)

  include("cmake-format")
  setup_cmake_format(src "${CMAKE_CURRENT_LIST_DIR}/CMakeLists.txt")
endif()
