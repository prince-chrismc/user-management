cmake_minimum_required(VERSION 3.19) # using interface libraries with sources https://cmake.org/cmake/help/latest/command/add_library.html#interface-libraries

project(user-management)

list(APPEND CMAKE_MODULE_PATH ${CMAKE_SOURCE_DIR}/cmake ${CMAKE_BINARY_DIR})

include("options")

set(CONSOLE "console")
set(SYSLOG "syslog")
set(LOGGING_OPTIONS ${CONSOLE} ${SYSLOG})

options(LOGGING ${SYSLOG} "the desired logging mechanism to use" "${LOGGING_OPTIONS}")
set(SCHEMAS_ROOT ".." CACHE STRING "root directoy where to find the JSON schemas (absolute or relative path)")
option(CONAN_SETUP "use conan to setup all the dependencies" ON)
option(BUILD_WEB_SERVER "build the web server for this application" ON)
option(BUILD_TESTS "build the tests for this application" OFF)
option(RUN_TIDY "run clang-tidy" OFF)
option(COVERAGE "Enable code coverage testing" OFF)

if(COVERAGE)
  cmake_policy(SET CMP0079 NEW)
endif()

if(CONAN_SETUP)
  include("conan-setup")
endif()

find_package(nlohmann_json_schema_validator 2.1.0 REQUIRED)

include("schema-pack")
set(SCHEMA_LIST
    "${SCHEMAS_ROOT}/api/schema/add.json" "${SCHEMAS_ROOT}/api/schema/edit.json"
    "${SCHEMAS_ROOT}/api/schema/error.json" "${SCHEMAS_ROOT}/api/schema/user.json"
    "${SCHEMAS_ROOT}/api/schema/users.json")
pack_schemas("${SCHEMA_LIST}" schemas)

add_library(user_management INTERFACE "include/um/user_management.hpp")
add_library(user_management::user_management ALIAS user_management)
set_target_properties(user_management PROPERTIES LINKER_LANGUAGE CXX)
target_compile_features(user_management INTERFACE cxx_std_14)
target_include_directories(user_management INTERFACE ${CMAKE_CURRENT_SOURCE_DIR}/include)
target_link_libraries(user_management INTERFACE schemas nlohmann_json_schema_validator::nlohmann_json_schema_validator)

if(RUN_TIDY)
  include("clang-tidy")
  setup_clang_tidy(user_management)

  include("clang-format")
  setup_clang_format(user_management)

  include("cmake-format")
  setup_cmake_format(main "${CMAKE_CURRENT_LIST_DIR}/CMakeLists.txt")
endif()

if(BUILD_WEB_SERVER)
  add_subdirectory(src)
endif()

if(BUILD_TESTS)
  add_subdirectory(test)
endif()
