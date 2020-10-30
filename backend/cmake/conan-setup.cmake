if(CONAN_EXPORTED)
  # Running from conan conan
  include(${CMAKE_BINARY_DIR}/conanbuildinfo.cmake)
  conan_basic_setup()
else()
  set(CONAN_WRAPPER "${CMAKE_CURRENT_BINARY_DIR}/conan.cmake")

  if(NOT EXISTS ${CONAN_WRAPPER})
    file(DOWNLOAD "https://github.com/conan-io/cmake-conan/raw/v0.15/conan.cmake" ${CONAN_WRAPPER})
  endif()

  include(${CONAN_WRAPPER})
  conan_check(VERSION 1.28.0 REQUIRED)

  # Create the complete lockfile
  execute_process(COMMAND conan lock create ${CMAKE_CURRENT_SOURCE_DIR}/conanfile.py
                          --lockfile=${CMAKE_CURRENT_SOURCE_DIR}/conan.lock --lockfile-out=${CMAKE_CURRENT_BINARY_DIR}/conan.lock
                          -s build_type=${CMAKE_BUILD_TYPE} -s compiler.libcxx=libstdc++11 --update)

  # Populate the 'build' folder with the correct file to locate dependencies
  execute_process(COMMAND conan install ${CMAKE_CURRENT_SOURCE_DIR}/conanfile.py --lockfile=${CMAKE_CURRENT_BINARY_DIR}/conan.lock
                  WORKING_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR})
endif()
