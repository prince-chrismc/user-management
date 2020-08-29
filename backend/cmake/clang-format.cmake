function(SETUP_CLANG_FORMAT TARGET)
  find_program(CLANGFORMAT_EXE NAMES "clang-format" "clang-format-10" "clang-format-9" "clang-format-8" REQUIRED)

  if(NOT TARGET ${TARGET})
    message(AUTHOR_WARNING "unable to setup clang-format for '${TARGET}'")
    return()
  endif()

  get_target_property(TARGET_SOURCES ${TARGET} SOURCES)
  add_custom_target(clang-format-${TARGET} COMMAND "${CLANGFORMAT_EXE}" "-style=file" "-i" "${TARGET_SOURCES}"
                    WORKING_DIRECTORY ${CMAKE_CURRENT_LIST_DIR} COMMAND_EXPAND_LISTS)
  add_dependencies(${TARGET} clang-format-${TARGET})

  if(TARGET clang-format)
    add_dependencies(clang-format clang-format-${TARGET})
  else()
    add_custom_target(clang-format DEPENDS clang-format-${TARGET})
  endif()
endfunction()
