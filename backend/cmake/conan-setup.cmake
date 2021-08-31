if(CONAN_EXPORTED)
  # Running from conan create
  include(${CMAKE_BINARY_DIR}/conanbuildinfo.cmake)
  conan_basic_setup()
else()
  set(CONAN_WRAPPER "${CMAKE_CURRENT_BINARY_DIR}/conan.cmake")

  if(NOT EXISTS ${CONAN_WRAPPER})
    file(DOWNLOAD "https://raw.githubusercontent.com/conan-io/cmake-conan/v0.16.1/conan.cmake" ${CONAN_WRAPPER})
  else()
    set(CONAN_WRAPPER_SHA "396e16d0f5eabdc6a14afddbcfff62a54a7ee75c6da23f32f7a31bc85db23484")
    file(SHA256 ${CONAN_WRAPPER} CURRENT_SHA)

    if (NOT ${CONAN_WRAPPER_SHA} STREQUAL ${CURRENT_SHA})
      message(FATAL_ERROR "Conan Setup: it appears the conan-io/cmake wrapper is out of date!")
    endif()
  endif()

  include(${CONAN_WRAPPER})
  conan_check(VERSION 1.33.0 REQUIRED)

  # Create the complete lockfile
  execute_process(
    COMMAND
      conan lock create ${CMAKE_CURRENT_SOURCE_DIR}/conanfile.py -l ${CMAKE_CURRENT_SOURCE_DIR}/conan.lock
      --lockfile-out=${CMAKE_CURRENT_BINARY_DIR}/conan.lock -s build_type=${CMAKE_BUILD_TYPE} -s
      compiler.libcxx=libstdc++11
    RESULT_VARIABLE STATUS)

  if(STATUS AND NOT STATUS EQUAL 0)
    message(FATAL_ERROR "Conan Setup: failed to generate full lockfile!")
  endif()

  # FIXME: Once https://github.com/conan-io/cmake-conan/pull/319 is merged
  # conan_cmake_lock_create(
  #   PATH ${CMAKE_CURRENT_SOURCE_DIR}/conanfile.py
  #   LOCKFILE ${CMAKE_CURRENT_SOURCE_DIR}/conan.lock
  #   LOCKFILE_OUT ${CMAKE_CURRENT_BINARY_DIR}/conan.lock
  #   SETTINGS build_type=${CMAKE_BUILD_TYPE} compiler.libcxx=libstdc++11
  # )

  # Populate the 'build' folder with the correct file to locate dependencies
  conan_cmake_install(
    PATH_OR_REFERENCE ${CMAKE_CURRENT_SOURCE_DIR}/conanfile.py
    LOCKFILE ${CMAKE_CURRENT_BINARY_DIR}/conan.lock
  )
endif()
