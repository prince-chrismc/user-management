function(SETUP_CMAKE_FORMAT TARGET LIST_FILE)
  find_program(CMAKE_FORMAT_EXE NAMES "cmake-format" REQUIRED)

  add_custom_target(
    cmake-format-${TARGET} ALL COMMAND "${CMAKE_FORMAT_EXE}" "--config=${PROJECT_SOURCE_DIR}/.cmake-format"
                                       "${LIST_FILE}" "-o" "${LIST_FILE}")

  if(TARGET cmake-format)
    add_dependencies(cmake-format cmake-format-${TARGET})
  else()
    add_custom_target(cmake-format DEPENDS cmake-format-${TARGET})
  endif()
endfunction()
