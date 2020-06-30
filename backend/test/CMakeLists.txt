find_package(restinio 0.6.8 REQUIRED)
find_package(Catch2 1.12.1 REQUIRED)

option(COVERAGE "Enable code coverage testing" OFF)

if(${COVERAGE})
  set(COVERAGE_CMAKE "${CMAKE_BINARY_DIR}/cmake/CodeCoverage.cmake")
  if(NOT EXISTS ${COVERAGE_CMAKE})
    set(COVERAGE_URL
        "https://raw.githubusercontent.com/bilke/cmake-modules/master/CodeCoverage.cmake"
    )
    file(DOWNLOAD ${COVERAGE_URL} ${COVERAGE_CMAKE})
  endif()

  include(${COVERAGE_CMAKE})
endif()

set(UNIT_TEST_HELPER_URL
    "https://raw.githubusercontent.com/Stiffstream/restinio/4005036a246a7843c6ef14aa3d1fad3531240f2e/dev/test/common/pub.hpp"
)
set(UNIT_TEST_HELPER "${CMAKE_BINARY_DIR}/utility/unit_test/helpers.hpp")
file(DOWNLOAD ${UNIT_TEST_HELPER_URL} ${UNIT_TEST_HELPER})

add_executable(program-test "main.cpp" "program.cpp" "user_database.cpp" "../src/handlers/user_database.cpp")
target_include_directories(program-test PRIVATE "../src" "${CMAKE_BINARY_DIR}/utility")

target_link_libraries(
  program-test
  PRIVATE user_management::user_management Catch2::Catch2
          nlohmann_json_schema_validator::nlohmann_json_schema_validator
          restinio::restinio)

if(${COVERAGE})
  target_compile_options(program-test PRIVATE -g -O0 -fprofile-arcs
                                              -ftest-coverage)
  target_link_libraries(program-test PRIVATE gcov)

  set(COVERAGE_EXCLUDES "/usr/**" "/home/*/.conan/**" "*test*" "*build*")
  setup_target_for_coverage_lcov(NAME coverage EXECUTABLE
                                 ${CMAKE_CURRENT_BINARY_DIR}/program-test)
endif()
