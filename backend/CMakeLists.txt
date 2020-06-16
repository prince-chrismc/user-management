project(reactjs-from-cpp)
cmake_minimum_required(VERSION 3.8)

option(BUILD_TESTS "build the tests for this application" OFF)
option(RUN_TIDY "run clang-tidy" OFF)

set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} ${CMAKE_BINARY_DIR}
                      ${CMAKE_SOURCE_DIR}/cmake)
find_package(restinio 0.6.8 REQUIRED)
find_package(lyra 1.4.0 REQUIRED)
find_package(nlohmann_json_schema_validator 2.1.0 REQUIRED)

include("schema-pack")

set(SCHEMA_LIST
    "../api/schema/add.json" "../api/schema/edit.json"
    "../api/schema/error.json" "../api/schema/user.json"
    "../api/schema/users.json")
pack_schemas("${SCHEMA_LIST}" schemas)

add_executable(reactjs-from-cpp "src/main.cpp" "src/program.hpp")

target_link_libraries(
  reactjs-from-cpp schemas restinio::restinio lyra::lyra
  nlohmann_json_schema_validator::nlohmann_json_schema_validator)

if(${BUILD_TESTS})
  add_subdirectory(test)
endif()

if(${RUN_TIDY})
  include("clang-tidy")
  setup_clang_tidy("src/main.cpp" "src/program.hpp")
endif()
