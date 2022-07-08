add_subdirectory("logging") # Needs to be first
add_subdirectory("database")
add_subdirectory("handlers")
add_subdirectory("utility")

add_executable(user_database_app "main.cpp")
target_link_libraries(user_database_app PRIVATE user_routes serve_files web_app app_args server_logger)
set_target_properties(user_database_app PROPERTIES LINKER_LANGUAGE CXX CXX_STANDARD 14 CXX_STANDARD_REQUIRED TRUE)

if(RUN_TIDY)
  setup_clang_tidy(user_database_app)
  setup_clang_format(user_database_app)
  setup_cmake_format(src ${CMAKE_CURRENT_LIST_DIR}/CMakeLists.txt)
endif()
