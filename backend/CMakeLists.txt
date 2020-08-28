cmake_minimum_required(VERSION 3.8)

project(user-management)

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

add_library(user_management "include/um/user_management.hpp")
add_library(user_management::user_management ALIAS user_management)

set_target_properties(user_management PROPERTIES LINKER_LANGUAGE CXX)
target_compile_features(user_management PUBLIC cxx_std_14)
target_include_directories(user_management PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/include)
target_link_libraries(user_management PUBLIC schemas nlohmann_json_schema_validator::nlohmann_json_schema_validator)

if(${RUN_TIDY})
  include("clang-tidy")
  setup_clang_tidy(user_management)

  include("clang-format")
  setup_clang_format(user_management)

  include("cmake-format")
  setup_cmake_format(main "${CMAKE_CURRENT_LIST_DIR}/CMakeLists.txt")
endif()

if(${BUILD_WEB_SERVER})
  add_subdirectory(src)
endif()

if(${BUILD_TESTS})
  add_subdirectory(test)
endif()
