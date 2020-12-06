find_package(spdlog 1.8.1 REQUIRED)

add_library(database_logger "database_logger.hpp")
target_include_directories(database_logger PUBLIC "..")
set_target_properties(database_logger PROPERTIES LINKER_LANGUAGE CXX)
target_link_libraries(database_logger PUBLIC spdlog::spdlog)

if(${RUN_TIDY})
  include("clang-tidy")
  setup_clang_tidy(database_logger)

  include("clang-format")
  setup_clang_format(database_logger)

  include("cmake-format")
  setup_cmake_format(database_logger "${CMAKE_CURRENT_LIST_DIR}/CMakeLists.txt")
endif()
