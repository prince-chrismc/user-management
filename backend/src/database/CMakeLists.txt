find_package(fmt 8.1.1 REQUIRED)

add_subdirectory("encoders")

add_library(users_databse "users.hpp" "users.cpp")
target_include_directories(users_databse PUBLIC "..")
set_target_properties(users_databse PROPERTIES LINKER_LANGUAGE CXX CXX_STANDARD 14 CXX_STANDARD_REQUIRED TRUE)
target_link_libraries(users_databse PUBLIC user_management PRIVATE logger encoders fmt::fmt)

if(RUN_TIDY)
  setup_clang_tidy(users_databse)
  setup_clang_format(users_databse)
  setup_cmake_format(users_databse ${CMAKE_CURRENT_LIST_DIR}/CMakeLists.txt)
endif()
