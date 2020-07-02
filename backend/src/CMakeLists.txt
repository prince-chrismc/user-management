add_subdirectory("utility")
add_subdirectory("handlers")

add_executable(reactjs-from-cpp "main.cpp")

target_include_directories(reactjs-from-cpp PRIVATE ${CMAKE_CURRENT_SOURCE_DIR})
target_link_libraries(reactjs-from-cpp user_database serve_files web_app
                      app_args)

if(${RUN_TIDY})
  include("clang-tidy")
  get_target_property(APP_SOURCES reactjs-from-cpp SOURCES)
  setup_clang_tidy(app_tidy ${APP_SOURCES})
endif()
