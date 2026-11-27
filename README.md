# Zelda Mega Drive Converter

I maintain this web converter for my unofficial native Mega Drive port of The Legend of Zelda. It accepts an original USA PRG0 iNES dump supplied by the user and generates the exact reference port without a desktop installation, an intermediate Mega Drive ROM, or an external Mega Drive SDK.

[**Open the web converter**](https://sa-m-be.github.io/Zelda-1-MegaDrive-Converter/) · [Port project](https://github.com/sa-m-be/Zelda-1-MegaDrive-Port)

The website is available in English and Brazilian Portuguese (EN / PT-BR).

## How to use

1. Open the [web converter](https://sa-m-be.github.io/Zelda-1-MegaDrive-Converter/).
2. Select an original USA PRG0 `.nes` file (131,088 bytes, including the 16-byte iNES header).
3. Click **Generate Mega Drive ROM**. A recent browser and internet access are required to load the pinned Pyodide WebAssembly runtime from jsDelivr.
4. When validation succeeds, click **Download PORT**. The output is a 2 MiB Mega Drive ROM named `The Legend of Zelda - Mega Drive Port.bin`.

The app processes ROM data in browser memory. It fetches the build bundle from this site and the runtime from jsDelivr; it does not intentionally send your ROM to a server. Unsupported revisions are rejected. The app is specific to this port, not a general-purpose NES converter.

## Game controls

I mapped the NES controls to the standard Mega Drive three-button layout.

| Mega Drive | NES | Function |
| --- | --- | --- |
| D-Pad | D-Pad | Move Link / navigate menus |
| A | A | Sword / attack |
| B | B | Use the equipped secondary item |
| **C** | **SELECT** | Pause / resume gameplay; select where applicable |
| START | START | Open / close inventory; confirm where applicable |

**C is SELECT.** For more help, see the [port documentation](https://github.com/sa-m-be/Zelda-1-MegaDrive-Port).

## Build and verification

I developed this converter to generate my native Mega Drive / Genesis port directly from the original NES ROM.

The conversion process includes:

- Translation of MOS 6502 instructions to Motorola 68000 machine code using a two-pass assembler.
- Conversion of NES graphics to the Mega Drive VDP format.
- Integration of a pre-linked native runtime, including port-specific routines, SDK code, audio and controller support, with the generated code and data.
- Application of port-specific corrections and SHA-256 integrity verification.

All ROM generation runs locally in the browser. Neither the original NES ROM nor a complete Mega Drive ROM is included in the repository.

### Compatibility and testing

- I verified the reconstructed ROM byte for byte against my reference build using the desktop build engine and successfully tested conversion in a web browser.
- I tested the reference port on an original Japanese Sega Mega Drive Model 1 (NTSC-J) using an EverDrive V3 Pro flash cartridge.
- Broader browser and hardware compatibility testing remains ongoing. The browser-generated ROM has not been separately tested on physical hardware.

### ROM checksums

| ROM | SHA-256 |
| --- | --- |
| Original NES (USA PRG0) | `8f72dc2e98572eb4ba7c3a902bca5f69c448fc4391837e5f8f0d4556280440ac` |
| Mega Drive Port | `dc4d6ffdcbca7156333c0b07cdd00a98977e733913a1174e9a636c205bf24a09` |

## Files and deployment

- `index.html`: website and user interface.
- `converter-worker.js`: background browser build, validation and runtime loader.
- `build-bundle.zip`: source translator, assembler, build script, layout metadata, pre-linked runtime segments and port-specific corrections. Keep this ZIP intact on the website.
- `README.md`: documentation.

All files belong in the same directory. GitHub Pages can serve them from the `main` branch root. No server-side ROM processing is required. To test locally using an HTTP server (optional for developers): `python3 -m http.server 8000` and open `http://localhost:8000/`.

To reproduce the verified core build outside a browser, extract `build-bundle.zip`, and from its extracted directory run `python3 -c 'from build import build; from pathlib import Path; Path("The Legend of Zelda - Mega Drive Port.bin").write_bytes(build(Path("/path/to/original.nes").read_bytes()))'`. Python 3.10+ is required only for this optional developer test.

## Rights and distribution

This unofficial project is not affiliated with Nintendo or Sega. The original game belongs to its rights holders. The bundle omits the complete NES and Mega Drive ROMs, but includes compiled port-specific code, SDK material, layout metadata and binary corrections. These may be subject to third-party rights and license obligations. Review the provenance and applicable licenses and obtain any required permission before publishing the build bundle. No new license is granted over third-party material.

Maintainer: [sa-m-be](https://github.com/sa-m-be)
