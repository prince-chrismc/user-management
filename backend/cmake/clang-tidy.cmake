function(SETUP_CLANG_TIDY TARGET)
  set(CMAKE_EXPORT_COMPILE_COMMANDS ON CACHE BOOL "" FORCE)

  set(TIDY_RUNNER "${CMAKE_BINARY_DIR}/tidy/run-clang-tidy.py")
  if(NOT EXISTS ${TIDY_RUNNER})
    set(RUNNER_URL
        "https://raw.githubusercontent.com/llvm/llvm-project/master/clang-tools-extra/clang-tidy/tool/run-clang-tidy.py"
    )
    file(DOWNLOAD ${RUNNER_URL} ${TIDY_RUNNER})
  endif()

  find_program(PYTHON_EXE NAMES "python3" "python")

  add_custom_target(${target} ALL COMMAND "${PYTHON_EXE}" "${TIDY_RUNNER}" "-fix" "-format" "-p" "${CMAKE_BINARY_DIR}"
                                          ${ARGV})
endfunction()
