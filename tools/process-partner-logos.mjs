#!/usr/bin/env node
/**
 * One-off: take the design "crops" partner logos, resize + optimize them,
 * and write both PNG and WebP into img/partner/.
 *   node tools/process-partner-logos.mjs
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, parse } from 'node:path';
import sharp from 'sharp';

const SRC = 'C:/tmp/ubaglobal-design/crops';
const DST = 'img/partner';
const WIDTH = 400; // ~2x of display size for retina

const files = (await readdir(SRC)).filter((f) => f.toLowerCase().endsWith('.png'));
let pngTotal = 0, webpTotal = 0;

for (const f of files) {
  const name = parse(f).name;
  const input = await readFile(join(SRC, f));
  const png = await sharp(input).resize({ width: WIDTH, withoutEnlargement: true })
    .png({ compressionLevel: 9, quality: 85, palette: true }).toBuffer();
  await writeFile(join(DST, `${name}.png`), png);
  const webp = await sharp(input).resize({ width: WIDTH, withoutEnlargement: true })
    .webp({ quality: 82 }).toBuffer();
  await writeFile(join(DST, `${name}.webp`), webp);
  pngTotal += png.length; webpTotal += webp.length;
  console.log(`${name.padEnd(22)} png ${(png.length/1024).toFixed(1)}KB  webp ${(webp.length/1024).toFixed(1)}KB`);
}
console.log(`\n${files.length} logos. PNG ${(pngTotal/1024).toFixed(0)}KB total, WebP ${(webpTotal/1024).toFixed(0)}KB total.`);
