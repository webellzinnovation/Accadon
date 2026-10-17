#!/usr/bin/env bash
set -u
pass=${1:?pass}; group=${2:?group}; mkdir -p /tmp/accadon-gates
case "$group" in
 1) tests='button-corners visual static-preview home-visual tournaments-visual';;
 2) tests='parent-visual live-visual';;
 3) tests='kit-visual kit-icons kit-qualifiers kit-theme theme-rollout';;
 4) tests='superadmin-visual console-visual site-visual';;
 5) tests='header-alignment live-board-visual';;
 *) exit 2;;
esac
for test in $tests; do
 log=/tmp/accadon-gates/pass-$pass-$test.log
 if npx tsx tests/$test.ts > "$log" 2>&1; then printf 'PASS %s %s\n' "$pass" "$test"; else printf 'FAIL %s %s\n' "$pass" "$test"; tail -30 "$log"; exit 1; fi
done
