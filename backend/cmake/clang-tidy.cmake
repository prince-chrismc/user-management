function(SETUP_CLANG_TIDY TARGET)
  set(CMAKE_EXPORT_COMPILE_COMMANDS ON CACHE BOOL "" FORCE)

  set(TIDY_RUNNER "${CMAKE_BINARY_DIR}/tidy/run-clang-tidy.py")
  if(NOT EXISTS ${TIDY_RUNNER})
    set(RUNNER_URL
        "https://raw.githubusercontent.com/llvm/llvm-project/master/clang-tools-extra/clang-tidy/tool/run-clang-tidy.py"
    )
    file(DOWNLOAD ${RUNNER_URL} ${TIDY_RUNNER})
  endif()

  find_program(PYTHON_EXE NAMES "python3" "python" REQUIRED)

  if(NOT TARGET ${TARGET})
    message(AUTHOR_WARNING "unable to setup clang-tidy for '${TARGET}'")
    return()
  endif()

  get_target_property(TARGET_SOURCES ${TARGET} SOURCES)
  add_custom_target(clang-tidy-${TARGET} COMMAND "${PYTHON_EXE}" "${TIDY_RUNNER}" "-quiet" "-fix" "-format" "-p"
                                                 "${CMAKE_BINARY_DIR}" ${TARGET_SOURCES})
  add_dependencies(${TARGET} clang-tidy-${TARGET})

  if(TARGET clang-tidy)
    add_dependencies(clang-tidy clang-tidy-${TARGET})
  else()
    add_custom_target(clang-tidy DEPENDS clang-tidy-${TARGET})
  endif()
endfunction()
