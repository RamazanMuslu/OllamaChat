#!/bin/sh

echo "Build started!"
vsce package
echo "Build Done."
echo "Publishing..."
vsce publish
echo "Done!"

