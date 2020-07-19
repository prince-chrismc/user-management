find_package(Catch2 2.13.0 REQUIRED)

include("unit-test-helper")
add_executable(user_tests "main.cpp" "user_management.cpp" "user_database.cpp")
target_link_libraries(user_tests PRIVATE user_database unit_test_helper Catch2::Catch2)

if(${COVERAGE})
  include("code-coverage")
  setup_coverage(user_tests)
  setup_coverage(user_database)

  set(COVERAGE_EXCLUDES "/usr/**" "/home/*/.conan/**" "*test*" "*build*")
  setup_target_for_coverage_lcov(NAME coverage EXECUTABLE ${CMAKE_CURRENT_BINARY_DIR}/user_tests)
endif()
