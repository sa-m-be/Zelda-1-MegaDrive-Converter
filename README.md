# Zelda Mega Drive Converter — v0.2

I maintain this web converter for my unofficial native Mega Drive port of The Legend of Zelda. It accepts an original USA PRG0 iNES dump supplied by the user and generates the exact MD35 reference without a desktop installation, an intermediate Mega Drive ROM, or an external Mega Drive SDK.

## How to use

1. Open the [web converter](https://sa-m-be.github.io/Zelda-1-MegaDrive-Converter/).
2. Select an original USA PRG0 `.nes` file (131,088 bytes, including the 16-byte iNES header).
3. Click **Generate Mega Drive ROM**. A recent browser and internet access are required to load the pinned Pyodide WebAssembly runtime from jsDelivr.
4. When validation succeeds, click **Download MD35 (.bin)**. The output is a 2 MiB Mega Drive ROM.

The app processes ROM data in browser memory. It fetches the build bundle from this site and the runtime from jsDelivr; it does not intentionally send your ROM to a server. Unsupported revisions are rejected. The app is specific to this port, not a general-purpose NES converter.

## Build design and verification

- A fixed pre-linked native runtime from MD13, including port-specific routines and SDK code, is supplied as separate sparse segments, not as a complete working ROM.
- The build reads the original PRG from the selected NES image, translates its instructions to 68000 assembly using the verified instruction catalogue, assembles the translated code and dispatch tables using a two-pass assembler, and generates VDP tile data. A fixed symbol-address layout preserves the reference binary layout.
- 1,180,012 bytes of the MD13 image are regenerated, including the full original PRG, generated machine code and graphics. Nine revision overlays then produce MD35.
- Desktop Python end-to-end reconstruction has been verified byte for byte against the reference. The WebAssembly browser integration is experimental: a full browser run could not be completed in the development environment because the CDN was unreachable.
- The reference port was tested on a Japanese Mega Drive Model 1 with EverDrive V3 Pro. No additional physical-console test was performed for this web build.

| Image | SHA-256 |
|---|---|
| NES USA PRG0 | `8f72dc2e98572eb4ba7c3a902bca5f69c448fc4391837e5f8f0d4556280440ac` |
| MD35 | `dc4d6ffdcbca7156333c0b07cdd00a98977e733913a1174e9a636c205bf24a09` |

## Files and deployment

- `index.html`: website and user interface.
- `converter-worker.js`: background browser build, validation and runtime loader.
- `build-bundle.zip`: source translator, assembler, build script, layout metadata, pre-linked runtime segments and revision overlays. Keep this ZIP intact on the website.
- `README.md`: documentation.

All files belong in the same directory. GitHub Pages can serve them from the `main` branch root. No server-side ROM processing is required. To test locally using an HTTP server (optional for developers): `python3 -m http.server 8000` and open `http://localhost:8000/`.

To reproduce the verified core build outside a browser, extract `build-bundle.zip`, and from its extracted directory run `python3 -c 'from build import build; from pathlib import Path; Path("MD35.bin").write_bytes(build(Path("/path/to/original.nes").read_bytes()))'`. Python 3.10+ is required only for this optional developer test.

## Rights and distribution

This unofficial project is not affiliated with Nintendo or Sega. The original game belongs to its rights holders. The bundle omits the complete NES and Mega Drive ROMs, but includes compiled port-specific code, SDK material, layout metadata and binary overlays. These may be subject to third-party rights and license obligations. Review the provenance and applicable licenses and obtain any required permission before publishing the build bundle. No new license is granted over third-party material.

Maintainer: [sa-m-be](https://github.com/sa-m-be)
