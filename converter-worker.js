'use strict';
const CDN = 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/';
const INPUT = '8f72dc2e98572eb4ba7c3a902bca5f69c448fc4391837e5f8f0d4556280440ac';
const OUTPUT = 'dc4d6ffdcbca7156333c0b07cdd00a98977e733913a1174e9a636c205bf24a09';
const BUNDLE = '9587bd4949676ef8c92323b87fa6b0f032e1e5657fc59d3fcf18c8d635b02a54';
const log = message => self.postMessage({type:'progress',message});
async function sha(b){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',b)),x=>x.toString(16).padStart(2,'0')).join('');}
async function verify(data,expected,label){if(await sha(data)!==expected)throw new Error(label+' SHA-256 mismatch.');}
let busy=false;
self.onmessage=async ({data})=>{
 if(busy || data?.type!=='convert')return;
 busy=true;
 try{
  const nes=new Uint8Array(data.rom);
  if(nes.length!==131088 || nes[0]!==78 || nes[1]!==69 || nes[2]!==83 || nes[3]!==26)throw new Error('Expected a 131,088-byte USA PRG0 iNES file.');
  await verify(nes,INPUT,'Original NES ROM');log('NES PRG0 verified. Loading local build engine…');
  const res=await fetch('./build-bundle.zip',{cache:'no-cache'});
  if(!res.ok)throw new Error('Build engine could not be loaded (HTTP '+res.status+').');
  const bundle=new Uint8Array(await res.arrayBuffer());await verify(bundle,BUNDLE,'Build bundle');
  log('Starting browser WebAssembly runtime…');
  importScripts(CDN+'pyodide.js');
  const py=await loadPyodide({indexURL:CDN,stdout:log,stderr:log});
  py.FS.writeFile('/bundle.zip',bundle);py.FS.writeFile('/input.nes',nes);
  await py.runPythonAsync(`
import sys, zipfile
from pathlib import Path
root = Path('/zelda_build')
root.mkdir(exist_ok=True)
with zipfile.ZipFile('/bundle.zip') as archive:
    archive.extractall(root)
sys.path.insert(0, str(root))
from build import build
try:
    result = build(Path('/input.nes').read_bytes())
    Path('/output.bin').write_bytes(result)
finally:
    Path('/input.nes').unlink(missing_ok=True)
`);
  const result=py.FS.readFile('/output.bin').slice();py.FS.unlink('/output.bin');
  if(result.length!==2097152)throw new Error('Unexpected output size.');
  await verify(result,OUTPUT,'Final MD35');
  self.postMessage({type:'done',rom:result.buffer,sha256:OUTPUT},[result.buffer]);
 }catch(e){self.postMessage({type:'error',message:String(e?.message||e)});}
 finally{busy=false;}
};
