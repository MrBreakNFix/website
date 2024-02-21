#!/bin/bash

PRIMARY_DISPLAY=$(xrandr | awk '/ primary/{print $1}')
echo "Primary Display: $PRIMARY_DISPLAY"

# Reset display rotation to normal
xrandr --output "$PRIMARY_DISPLAY" --rotate normal

# Reset display transformation to normal
xrandr --output "$PRIMARY_DISPLAY" --verbose --transform 1.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,1.0

echo "Display reset to normal."
