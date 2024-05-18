#!/bin/bash
CODE_FILE="temp_code.rs"
OUTPUT_FILE="temp_output"

echo "$1" > $CODE_FILE

rustc $CODE_FILE -o $OUTPUT_FILE 2> compile_error.log

# Dcoded < check if the compilation was successful >
if [ -f $OUTPUT_FILE ]; then
    # Dcoded < Run the code and capture the output >
    ./$OUTPUT_FILE
    EXIT_CODE=$?
    if [ $EXIT_CODE -ne 0 ]; then
        echo "Execution error with exit code $EXIT_CODE"
    fi
else
    # Dcoded < output the errors >
    cat compile_error.log
fi

# Dcoded < cleaning temp files >
rm -f $CODE_FILE $OUTPUT_FILE compile_error.log
