project(reactjs-from-cpp)
cmake_minimum_required(VERSION 3.8)

option(BUILD_TESTS "build the tests for this application" OFF)

set(CMAKE_MODULE_PATH ${CMAKE_BINARY_DIR})
find_package(restinio 0.6 REQUIRED)
find_package(clara 1.1.5 REQUIRED)
find_package(nlohmann_json_schema_validator 2.0.0 REQUIRED)

include("cmake/schema-pack.cmake")

set(SCHEMA_LIST
    "../api/schema/add.json" "../api/schema/edit.json" "../api/schema/error.json"
    "../api/schema/user.json" "../api/schema/users.json")
pack_schemas("${SCHEMA_LIST}" schemas)

add_executable(reactjs-from-cpp "src/main.cpp" "src/program.hpp")

target_link_libraries(
  reactjs-from-cpp schemas restinio::restinio clara::clara
  nlohmann_json_schema_validator::nlohmann_json_schema_validator)

if(${BUILD_TESTS})
  add_subdirectory(test)
endif()
