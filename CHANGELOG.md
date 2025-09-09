## @microdemo/player 0.1.0 (initial release)

- First public build of the Player web component.
- Safe DOM rendering (no innerHTML for dynamic strings).
- Works against Studio public API via `window.__MICRODEMO_STUDIO__` or default.

## @microdemo/player 0.1.1

- Add GitHub Pages deploy workflow for Player CDN.
- README: add CDN embed instructions and badges.

## @microdemo/player 0.1.2

- Pages CDN: add canonical `player.js` (copy of ES module) for simpler embeds.

## @microdemo/player 0.1.3

- Actions/Pages enabled; publish verification tag.

## @microdemo/player 0.1.4

- CI: Install with `--ignore-scripts` to avoid workspace postinstall steps; improves reliability for Releases/Pages.

## @microdemo/player 0.1.5

- Retag to re-run Release + Pages after enabling Actions/Pages; verify CDN publish.
