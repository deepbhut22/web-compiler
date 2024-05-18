#!/bin/bash
CODE_FILE="temp_code.sol"
COMPILE_OUTPUT="compile_output.json"
COMPILE_ERROR_FILE="compile_error.log"

echo "$1" > $CODE_FILE

# Dcoded < compiling code >
solc --optimize --combined-json abi,bin $CODE_FILE > $COMPILE_OUTPUT 2> $COMPILE_ERROR_FILE

# Dcoded < checking for successfull compilation >
if [ -s $COMPILE_OUTPUT ]; then
    # Dcoded < output result >
    cat $COMPILE_OUTPUT
else
    # Dcoded < output error >
    cat $COMPILE_ERROR_FILE
fi

# Dcoded < cleaning temp files >
rm -f $CODE_FILE $COMPILE_OUTPUT $COMPILE_ERROR_FILE
