find_package(OpenSSL 1.1.1 REQUIRED)

add_library(encoders "sha256.hpp" "sha256.cpp" "base64.hpp" "base64.cpp")
target_include_directories(encoders PUBLIC "..")
set_target_properties(encoders PROPERTIES LINKER_LANGUAGE CXX CXX_STANDARD 14 CXX_STANDARD_REQUIRED TRUE)
target_link_libraries(encoders PRIVATE OpenSSL::Crypto)

if(RUN_TIDY)
  setup_clang_tidy(encoders)
  setup_clang_format(encoders)
  setup_cmake_format(encoders ${CMAKE_CURRENT_LIST_DIR}/CMakeLists.txt)
endif()
