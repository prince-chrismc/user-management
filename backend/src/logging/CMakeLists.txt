find_package(spdlog 1.8.1 REQUIRED)

add_library(logger "logger.hpp" "logger.cpp")
target_include_directories(logger PUBLIC "..")
if(${LOGGING} MATCHES ${CONSOLE})
  target_compile_definitions(logger PRIVATE CONSOLE_LOGGING)
endif()

if(${LOGGING} MATCHES ${SYSLOG})
  target_compile_definitions(logger PRIVATE SYSLOG_LOGGING)
endif()
set_target_properties(logger PROPERTIES LINKER_LANGUAGE CXX CXX_STANDARD 14 CXX_STANDARD_REQUIRED TRUE)
target_link_libraries(logger PUBLIC spdlog::spdlog)

if(RUN_TIDY)
  setup_clang_tidy(logger)
  setup_clang_format(logger)
  setup_cmake_format(logger ${CMAKE_CURRENT_LIST_DIR}/CMakeLists.txt)
endif()
