find_package(Catch2 2.13.0 REQUIRED)

include("unit-test-helper")
add_executable(user_tests "main.cpp" "user_management.cpp" "user_routes.cpp" "user_database.cpp" "encoders.cpp")
target_link_libraries(user_tests PRIVATE encoders users_databse user_routes unit_test_helper Catch2::Catch2)

if(${COVERAGE})
  include("code-coverage")
  setup_coverage(user_tests)
  setup_coverage(user_routes)
  setup_coverage(encoders)

  set(COVERAGE_EXCLUDES "/usr/**" "/home/*/.conan/**" "*test*" "*build*")
  setup_target_for_coverage_lcov(NAME coverage EXECUTABLE ${CMAKE_CURRENT_BINARY_DIR}/user_tests)
endif()

if(${RUN_TIDY})
  include("clang-tidy")
  get_target_property(TESTER_SOURCES user_tests SOURCES)
  setup_clang_tidy(tester ${TESTER_SOURCES})

  include("cmake-format")
  setup_cmake_format(tests "${CMAKE_CURRENT_LIST_DIR}/CMakeLists.txt")
endif()
