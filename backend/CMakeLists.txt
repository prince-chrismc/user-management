project(reactjs-from-cpp)
cmake_minimum_required(VERSION 3.8)

option(BUILD_WEB_SERVER "build the web server for this application" ON)
option(BUILD_TESTS "build the tests for this application" ON)
option(RUN_TIDY "run clang-tidy" ON)

set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} ${CMAKE_BINARY_DIR}
                      ${CMAKE_SOURCE_DIR}/cmake)

find_package(nlohmann_json_schema_validator 2.1.0 REQUIRED)

include("schema-pack")
set(SCHEMA_LIST
    "../api/schema/add.json" "../api/schema/edit.json"
    "../api/schema/error.json" "../api/schema/user.json"
    "../api/schema/users.json")
pack_schemas("${SCHEMA_LIST}" schemas)

add_library(user_management INTERFACE)
add_library(user_management::user_management ALIAS user_management)

target_compile_features(user_management INTERFACE cxx_std_11)
target_include_directories(
  user_management
  INTERFACE $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>
            $<INSTALL_INTERFACE:include>)
target_link_libraries(
  user_management
  INTERFACE schemas
            nlohmann_json_schema_validator::nlohmann_json_schema_validator)

if(${BUILD_WEB_SERVER})
  add_subdirectory(src)
endif()

if(${BUILD_TESTS})
  add_subdirectory(test)
endif()

if(${RUN_TIDY})
  include("clang-tidy")
  setup_clang_tidy("include/um/user_management.hpp")
endif()
