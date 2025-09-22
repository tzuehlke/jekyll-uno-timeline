#!/usr/bin/env bash
# images optimization script
# Requires: brew install imagemagick webp libvips
# Usage: ./scripts/optimize-images.sh

set -euo pipefail

dir="$(cd "$(dirname "$0")/.." && pwd)/images"
cd "$dir"

# create output directories
mkdir -p optimized webp avif

for img in *.jpg *.jpeg *.png; do
  [ -f "$img" ] || continue
  echo "Processing $img"
  # lossless optimize (jpegoptim/oxipng can be used if installed)
  # create a resized copy at 1600px wide max
  convert "$img" -strip -interlace Plane -gaussian-blur 0.05 -quality 85 -resize '1600>' "optimized/$img"
  # create webp
  cwebp -q 80 "optimized/$img" -o "webp/${img%.*}.webp" >/dev/null 2>&1 || echo "cwebp failed for $img"
  # create avif using avifenc if available
  if command -v avifenc >/dev/null 2>&1; then
    avifenc -q 40 "optimized/$img" "avif/${img%.*}.avif" >/dev/null 2>&1 || echo "avifenc failed for $img"
  fi
done

echo "Done. Outputs in images/optimized, images/webp, images/avif"
