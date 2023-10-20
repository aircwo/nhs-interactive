#!/usr/bin/env bash

if [[ "$OSTYPE" =~ ^darwin ]]; then
    echo "***** Checking if pre-commit installed ******"
    if ! [ -x "$(command -v pre-commit)" ]; then
        echo 'Error: pre-commit is not installed. Installing ...' >&2
        brew install pre-commit
        pre-commit --version
        exit 1
    fi
    echo "***** Checking if gitleaks installed ******"
    if ! [ -x "$(command -v gitleaks)" ]; then
        echo 'Error: gitleaks is not installed. Installing ...' >&2
        brew install gitleaks
        exit 1
    fi
    pre-commit install
    pre-commit install --hook-type commit-msg
else
    echo "***** OS not supported ******"
fi
