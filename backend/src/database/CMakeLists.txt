find_package(restinio 0.6.8 REQUIRED)

add_library(users "users.hpp")
target_include_directories(users PUBLIC "..")
set_target_properties(users PROPERTIES LINKER_LANGUAGE CXX)
target_link_libraries(users PUBLIC user_management::user_management)

if(${RUN_TIDY})
  include("clang-tidy")
  setup_clang_tidy(users_tidy "users.hpp")

  include("cmake-format")
  setup_cmake_format(users_format "${CMAKE_CURRENT_LIST_DIR}/CMakeLists.txt")
endif()
