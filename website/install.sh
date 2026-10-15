#!/bin/sh
# XailonOrbit daemon installer: curl -fsSL https://xailon-orbit.infinialabs.ai/install.sh | sh
# Options (environment): XAILON_ORBIT_VERSION=v0.4.0  XAILON_ORBIT_INSTALL_DIR=$HOME/.local/bin
set -eu

repo="https://github.com/infinialabs-ai/xailon-orbit"
dir="${XAILON_ORBIT_INSTALL_DIR:-$HOME/.local/bin}"

fail() { printf 'xailon-orbitd install: %s\n' "$1" >&2; exit 1; }

case "$(uname -s):$(uname -m)" in
  Darwin:arm64 | Darwin:aarch64) target=aarch64-apple-darwin ;;
  Darwin:x86_64)
    if [ "$(sysctl -n sysctl.proc_translated 2>/dev/null || true)" = 1 ]; then target=aarch64-apple-darwin
    else target=x86_64-apple-darwin; fi ;;
  Linux:x86_64 | Linux:amd64) target=x86_64-unknown-linux-gnu ;;
  MINGW*:* | MSYS*:* | CYGWIN*:*) fail 'on Windows run: irm https://xailon-orbit.infinialabs.ai/install.ps1 | iex' ;;
  *) fail "unsupported platform $(uname -s) $(uname -m); build from source: $repo" ;;
esac

if [ -n "${XAILON_ORBIT_VERSION:-}" ]; then base="$repo/releases/download/$XAILON_ORBIT_VERSION"
else base="$repo/releases/latest/download"; fi
asset="xailon-orbitd-$target.tar.gz"

if command -v curl >/dev/null 2>&1; then fetch() { curl -fsSL "$1" -o "$2"; }
elif command -v wget >/dev/null 2>&1; then fetch() { wget -qO "$2" "$1"; }
else fail 'curl or wget is required'; fi

tmp=$(mktemp -d "${TMPDIR:-/tmp}/xailon-orbitd.XXXXXXXX")
trap 'rm -rf "$tmp"' EXIT INT TERM

printf 'Downloading %s\n' "$asset"
fetch "$base/$asset" "$tmp/$asset" || fail "download failed: $base/$asset"
fetch "$base/$asset.sha256" "$tmp/checksum" || fail 'checksum missing'
expected=$(awk '{print $1}' "$tmp/checksum")
if command -v sha256sum >/dev/null 2>&1; then actual=$(sha256sum "$tmp/$asset" | awk '{print $1}')
else actual=$(shasum -a 256 "$tmp/$asset" | awk '{print $1}'); fi
[ "$expected" = "$actual" ] || fail 'checksum mismatch'

tar -xzf "$tmp/$asset" -C "$tmp"
mkdir -p "$dir"
if command -v xailon-orbitd >/dev/null 2>&1 && [ "$(command -v xailon-orbitd)" = "$dir/xailon-orbitd" ]; then
  "$dir/xailon-orbitd" stop >/dev/null 2>&1 || true
fi
install -m 755 "$tmp/xailon-orbitd" "$dir/xailon-orbitd"
printf 'Installed %s\n' "$dir/xailon-orbitd"

case ":$PATH:" in
  *":$dir:"*) ;;
  *) printf '\nAdd it to your PATH:\n  export PATH="%s:$PATH"\n' "$dir" ;;
esac
printf '\nNext: run `xailon-orbitd start` and scan the QR code with the XailonOrbit app.\n'
printf 'Guide: https://xailon-orbit.infinialabs.ai/guide/\n'
