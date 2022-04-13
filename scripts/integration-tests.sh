#!/bin/sh

# Run all .hurl files under tests/integration.do
# Make sure hurl is installed, see https://hurl.dev
hurl --test --glob "tests/integration/**/*.hurl"
