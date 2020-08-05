project(user-management)
cmake_minimum_required(VERSION 3.8)

option(BUILD_WEB_SERVER "build the web server for this application" ON)
option(BUILD_TESTS "build the tests for this application" OFF)
option(RUN_TIDY "run clang-tidy" OFF)
option(COVERAGE "Enable code coverage testing" OFF)

if(${COVERAGE})
  cmake_policy(SET CMP0079 NEW)
endif()

set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} ${CMAKE_BINARY_DIR} ${CMAKE_SOURCE_DIR}/cmake)

find_package(nlohmann_json_schema_validator 2.1.0 REQUIRED)

include("schema-pack")
set(SCHEMA_LIST "../api/schema/add.json" "../api/schema/edit.json" "../api/schema/error.json" "../api/schema/user.json"
                "../api/schema/users.json")
pack_schemas("${SCHEMA_LIST}" schemas)

add_library(user_management INTERFACE)
add_library(user_management::user_management ALIAS user_management)

target_compile_features(user_management INTERFACE cxx_std_14)
target_include_directories(user_management INTERFACE $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>
                                                     $<INSTALL_INTERFACE:include>)
target_link_libraries(user_management INTERFACE schemas nlohmann_json_schema_validator::nlohmann_json_schema_validator)

if(${BUILD_WEB_SERVER})
  add_subdirectory(src)
endif()

if(${BUILD_TESTS})
  add_subdirectory(test)
endif()

if(${RUN_TIDY})
  include("clang-tidy")
  setup_clang_tidy(um "include/um/user_management.hpp")

  include("cmake-format")
  setup_cmake_format(main "${CMAKE_CURRENT_LIST_DIR}/CMakeLists.txt")
endif()
