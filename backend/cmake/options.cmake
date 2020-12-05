function(OPTIONS NAME VALUE DESC CHOICES)
    set(${NAME} ${VALUE} CACHE STRING "${DESC}")
    set_property(CACHE ${NAME} PROPERTY STRINGS ${CHOICES})

    if(NOT ${NAME} IN_LIST CHOICES)
        message(FATAL_ERROR "${NAME}=${${NAME}} must be one of ${CHOICES}!")
    endif()
endfunction()