set(UNIT_TEST_HELPER "${CMAKE_BINARY_DIR}/utility/unit_test/helpers.hpp")
if(NOT EXISTS ${UNIT_TEST_HELPER})
  set(UNIT_TEST_HELPER_URL
      "https://raw.githubusercontent.com/Stiffstream/restinio/4005036a246a7843c6ef14aa3d1fad3531240f2e/dev/test/common/pub.hpp"
  )
  file(DOWNLOAD ${UNIT_TEST_HELPER_URL} ${UNIT_TEST_HELPER})
endif()

add_library(unit_test_helper INTERFACE)
target_include_directories(unit_test_helper INTERFACE "${CMAKE_BINARY_DIR}/utility")
