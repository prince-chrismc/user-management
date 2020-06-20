
find_package(Catch2 1.12.1 REQUIRED)

option(COVERAGE "Enable code coverage testing" OFF)

if(${COVERAGE})
  set(COVERAGE_CMAKE "${CMAKE_BINARY_DIR}/cmake/CodeCoverage.cmake")
  if(NOT EXISTS ${COVERAGE_CMAKE})
    set(COVERAGE_URL "https://raw.githubusercontent.com/bilke/cmake-modules/master/CodeCoverage.cmake")
    file(DOWNLOAD ${COVERAGE_URL} ${COVERAGE_CMAKE})
  endif()

  include(${COVERAGE_CMAKE})
endif()

add_executable(program-test "main.cpp" "program.cpp")
target_include_directories(program-test PRIVATE "../src")

target_link_libraries(program-test PRIVATE schemas
  Catch2::Catch2
  restinio::restinio
  nlohmann_json_schema_validator::nlohmann_json_schema_validator)

if(${COVERAGE})
  target_compile_options(program-test PRIVATE -g -O0 -fprofile-arcs -ftest-coverage)
  target_link_libraries(program-test PRIVATE gcov)

  set(COVERAGE_EXCLUDES "/usr/**" "/home/*/.conan/**" "*test*")
  setup_target_for_coverage_lcov(NAME coverage EXECUTABLE ${CMAKE_CURRENT_BINARY_DIR}/program-test)
endif()
