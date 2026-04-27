#!/bin/bash

app="$APP_NAME"
echo "Serving $app"

if [ "$app" = "takeout" ]; then
  cd apps/takeout && bun run serve:railway
elif [ "$app" = "docs" ]; then
  cd apps/one-docs && bun run serve:railway
else
  cd apps/gui.hanzo.ai && bun run serve:railway
fi
