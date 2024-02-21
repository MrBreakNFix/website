PRIMARY_DISPLAY=$(xrandr | awk '/ primary/{print $1}')
echo "Primary Display: $PRIMARY_DISPLAY"
xrandr --output "$PRIMARY_DISPLAY" --verbose --rotate normal --transform 0.9994,0.0349,-0.0349,-0.0349,0.9994,-0.0349,0,0,1
