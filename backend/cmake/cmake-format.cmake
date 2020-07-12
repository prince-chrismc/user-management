function(SETUP_CMAKE_FORMAT TARGET LIST_FILE)
  find_program(CMAKE_FORMAT_EXE NAMES "cmake-format")

  add_custom_target(
    cmake-format-${TARGET} ALL COMMAND "${CMAKE_FORMAT_EXE}" "--config=${PROJECT_SOURCE_DIR}/.cmake-format"
                                       "${LIST_FILE}" "-o" "${LIST_FILE}")
endfunction()
