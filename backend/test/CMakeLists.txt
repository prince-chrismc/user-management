find_package(restinio 0.6.8 REQUIRED)
find_package(Catch2 1.12.1 REQUIRED)

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

add_executable(program-test "main.cpp" "program.cpp" "user_database.cpp")
target_include_directories(program-test PRIVATE "../src"
                                                "${CMAKE_BINARY_DIR}/utility")

target_link_libraries(program-test PRIVATE user_database Catch2::Catch2)

if(${COVERAGE})
  function(setup_coverage TARGET)
    target_compile_options(${TARGET} PRIVATE -g -O0 -fprofile-arcs
                                             -ftest-coverage)
    target_link_libraries(${TARGET} PRIVATE gcov)
  endfunction()

  setup_coverage(program-test)
  setup_coverage(user_database)

  set(COVERAGE_EXCLUDES "/usr/**" "/home/*/.conan/**" "*test*" "*build*")
  setup_target_for_coverage_lcov(NAME coverage EXECUTABLE
                                 ${CMAKE_CURRENT_BINARY_DIR}/program-test)
endif()
