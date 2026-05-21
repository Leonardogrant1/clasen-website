#!/usr/bin/env bash
# Video optimization script for clasen-immos
# Produces optimized .mp4 (H.264) and .webm (VP9) versions.
# Originals are kept as *.original.mp4 – delete them once you've verified the output.

set -euo pipefail

INPUT_DIR="$(dirname "$0")/../public/video"
cd "$INPUT_DIR"

# ── helpers ──────────────────────────────────────────────────────────────────
log()  { echo "[optimize] $*"; }
size() { du -sh "$1" | cut -f1; }

backup_original() {
  local src="$1"
  local bak="${src%.mp4}.original.mp4"
  if [[ ! -f "$bak" ]]; then
    cp "$src" "$bak"
    log "Backup: $bak"
  fi
}

# ── mp4 (H.264 + AAC, faststart) ─────────────────────────────────────────────
encode_mp4() {
  local input="$1"
  local output="$2"
  local scale="$3"    # e.g. "1280:-2" or "1920:-2"
  local crf="$4"      # 24–30 for background video; lower = better quality
  local maxrate="$5"  # hard ceiling, e.g. "800k"

  log "→ MP4  $input  ($scale, CRF $crf, max $maxrate)"
  ffmpeg -y -i "$input" \
    -vf "scale=${scale}:flags=lanczos" \
    -c:v libx264 \
    -preset slow \
    -crf "$crf" \
    -maxrate "$maxrate" -bufsize "$((${maxrate%k} * 2))k" \
    -pix_fmt yuv420p \
    -movflags +faststart \
    -an \
    "$output"
  log "   $(size "$input") → $(size "$output")"
}

# ── webm (VP9, no audio, good for background loops) ──────────────────────────
# VP9 pure CRF mode: -b:v 0 + -crf only (maxrate not compatible with b:v 0)
encode_webm() {
  local input="$1"
  local output="$2"
  local scale="$3"
  local crf="$4"      # VP9 CRF: 33–40 for background video

  log "→ WebM $input  ($scale, CRF $crf)"
  ffmpeg -y -i "$input" \
    -vf "scale=${scale}:flags=lanczos" \
    -c:v libvpx-vp9 \
    -b:v 0 \
    -crf "$crf" \
    -deadline good \
    -cpu-used 2 \
    -row-mt 1 \
    -an \
    "$output"
  log "   $(size "$input") → $(size "$output")"
}

# ─────────────────────────────────────────────────────────────────────────────
# hero.mp4  (720×720, 1.6 Mbps → target ≤300 kbps)
# ─────────────────────────────────────────────────────────────────────────────
backup_original hero.mp4
encode_mp4  hero.original.mp4 hero.mp4        "720:-2"  28  "400k"
encode_webm hero.original.mp4 hero.webm       "720:-2"  36

# ─────────────────────────────────────────────────────────────────────────────
# hero1.mp4  (1280×720, 1.2 Mbps → target ≤500 kbps)
# ─────────────────────────────────────────────────────────────────────────────
backup_original hero1.mp4
encode_mp4  hero1.original.mp4 hero1.mp4      "1280:-2" 27  "600k"
encode_webm hero1.original.mp4 hero1.webm     "1280:-2" 35

# ─────────────────────────────────────────────────────────────────────────────
# hero1_mobile.mp4  (1920×1080 at 6 Mbps → scale to 720p, target ≤400 kbps)
# ─────────────────────────────────────────────────────────────────────────────
backup_original hero1_mobile.mp4
encode_mp4  hero1_mobile.original.mp4 hero1_mobile.mp4  "1280:-2" 28  "500k"
encode_webm hero1_mobile.original.mp4 hero1_mobile.webm "1280:-2" 36

# ─────────────────────────────────────────────────────────────────────────────
# contact.mp4  (1896×1094 at 4 Mbps → 1080p, target ≤600 kbps)
# ─────────────────────────────────────────────────────────────────────────────
backup_original contact.mp4
encode_mp4  contact.original.mp4 contact.mp4  "1920:-2" 26  "700k"
encode_webm contact.original.mp4 contact.webm "1920:-2" 34

# ─────────────────────────────────────────────────────────────────────────────
# sakura.mp4  (1920×1080 at 6.8 Mbps → 1080p, target ≤600 kbps)
# ─────────────────────────────────────────────────────────────────────────────
backup_original sakura.mp4
encode_mp4  sakura.original.mp4 sakura.mp4    "1920:-2" 28  "700k"
encode_webm sakura.original.mp4 sakura.webm   "1920:-2" 36

# ─────────────────────────────────────────────────────────────────────────────
# cherry-blossoms.mp4  (2560×1440 at 215 kbps – already small, just rescale)
# ─────────────────────────────────────────────────────────────────────────────
backup_original cherry-blossoms.mp4
encode_mp4  cherry-blossoms.original.mp4 cherry-blossoms.mp4  "1920:-2" 26  "300k"
encode_webm cherry-blossoms.original.mp4 cherry-blossoms.webm "1920:-2" 33

# ─────────────────────────────────────────────────────────────────────────────
log ""
log "Done. Final sizes:"
ls -lh *.mp4 *.webm 2>/dev/null | awk '{print $5, $9}'
log ""
log "Originals kept as *.original.mp4 — delete after verifying in production."
