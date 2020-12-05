function(OPTIONS NAME VALUE DESC CHOICES)
    set(${NAME} ${VALUE} CACHE STRING "${DESC}")
    set_property(CACHE ${NAME} PROPERTY STRINGS ${CHOICES})
endfunction()