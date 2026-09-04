#!/bin/bash

app="$APP_NAME"
echo "Serving $app"

if [ "$app" = "takeout" ]; then
  cd code/takeout && bun run serve:host
elif [ "$app" = "docs" ]; then
  cd code/one-docs && bun run serve:host
else
  cd apps/gui.hanzo.ai && bun run serve:host
fi
