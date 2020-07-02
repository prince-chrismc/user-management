add_subdirectory("utility")
add_subdirectory("handlers")

add_executable(user_database_app "main.cpp")
target_link_libraries(user_database_app user_database serve_files web_app
                      app_args)

if(${RUN_TIDY})
  include("clang-tidy")
  get_target_property(APP_SOURCES user_database_app SOURCES)
  setup_clang_tidy(app_tidy ${APP_SOURCES})
endif()
