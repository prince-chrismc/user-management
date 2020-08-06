find_package(restinio 0.6.8 REQUIRED)

add_library(users_databse "users.hpp")
target_include_directories(users_databse PUBLIC "..")
set_target_properties(users_databse PROPERTIES LINKER_LANGUAGE CXX)
target_link_libraries(users_databse PUBLIC user_management::user_management)

if(${RUN_TIDY})
  include("clang-tidy")
  setup_clang_tidy(users_databse "users.hpp")

  include("cmake-format")
  setup_cmake_format(users_databse "${CMAKE_CURRENT_LIST_DIR}/CMakeLists.txt")
endif()
