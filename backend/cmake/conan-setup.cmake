if(NOT EXISTS "${CMAKE_BINARY_DIR}/conan.lock")
  set(CONAN_WRAPPER "${CMAKE_BINARY_DIR}/conan.cmake")

  if(NOT EXISTS ${CONAN_WRAPPER})
    file(DOWNLOAD "https://github.com/conan-io/cmake-conan/raw/v0.15/conan.cmake" ${CONAN_WRAPPER})
  endif()

  include(${CONAN_WRAPPER})
  conan_cmake_run(CONANFILE "./conanfile.py" BUILD_TYPE ${CMAKE_BUILD_TYPE})
endif()
