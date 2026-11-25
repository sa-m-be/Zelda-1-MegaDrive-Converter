Zelda Mega Drive Web Preview 0.1

Open index.html in a recent browser (Chrome/Edge/Firefox/Safari). If local file SHA-256 is unavailable, use localhost or GitHub Pages over HTTPS.

Two independent modes: NES PRG0 hash verification and experimental source ZIP generation (Pyodide runtime from jsDelivr; not a playable ROM); exact MD13-to-MD35 updater (offline, no SDK). No full ROM is included. Direct NES-to-MD35 compilation is not implemented.

For GitHub Pages after review: place index.html in docs/ in your repo, then Settings > Pages > Deploy from a branch > main > /docs. Keep private until rights review; public Pages availability depends on plan and repository visibility. Review the embedded engine and overlays before sharing.

Testing: core-test.cjs is a Node test module for the same JS patch logic. It is not needed to host the page.
