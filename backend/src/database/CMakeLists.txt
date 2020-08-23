find_package(restinio 0.6.8 REQUIRED)

add_subdirectory("encoders")

add_library(users_databse "users.hpp" "users.cpp")
target_include_directories(users_databse PUBLIC "..")
set_target_properties(users_databse PROPERTIES LINKER_LANGUAGE CXX)
target_link_libraries(users_databse PUBLIC user_management encoders)

if(${RUN_TIDY})
  include("clang-tidy")
  setup_clang_tidy(users_databse)

  include("clang-format")
  setup_clang_format(users_databse)

  include("cmake-format")
  setup_cmake_format(users_databse "${CMAKE_CURRENT_LIST_DIR}/CMakeLists.txt")
endif()
