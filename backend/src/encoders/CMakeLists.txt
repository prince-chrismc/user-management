find_package(OpenSSL REQUIRED)

add_library(encoders "sha256.hpp" "sha256.cpp" "base64.hpp" "base64.cpp")
target_include_directories(encoders PUBLIC "..")
set_target_properties(encoders PROPERTIES LINKER_LANGUAGE CXX)
target_link_libraries(encoders PUBLIC OpenSSL::OpenSSL)

if(${RUN_TIDY})
  include("clang-tidy")
  setup_clang_tidy(encoders)

  include("cmake-format")
  setup_cmake_format(encoders "${CMAKE_CURRENT_LIST_DIR}/CMakeLists.txt")
endif()
