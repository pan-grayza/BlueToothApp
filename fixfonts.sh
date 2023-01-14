#!/bin/bash
# fixfonts.sh

typeset folder="$1"
if [[ -d "$folder" && ! -z "$folder" ]]; then
  pushd "$folder";
  for file in *.otf; do
    typeset normalized="${file//-/_}";
    normalized="${normalized,,}";
    mv "$file" "$normalized"
  done
  popd
fi