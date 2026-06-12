#!/usr/bin/env node
/**
 * One-off: import the individual product images (one product per image) from the
 * design export, slugify names for clean SEO URLs, resize + optimize, and write
 * PNG + WebP into img/products/. Also prints a name->file map for the redesign.
 *   node tools/process-product-images.mjs
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, parse } from 'node:path';
import sharp from 'sharp';

const SRC = 'C:/tmp/ubaglobal-products/products';
const DST = 'img/products';
const WIDTH = 600; // ~2x of card display size

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

await mkdir(DST, { recursive: true });
const files = (await readdir(SRC)).filter((f) => f.toLowerCase().endsWith('.png'));
let pngTotal = 0, webpTotal = 0;
const map = [];

for (const f of files) {
  const product = parse(f).name;          // human name e.g. "Armoured Cables"
  const s = slug(product);                // "armoured-cables"
  const input = await readFile(join(SRC, f));
  const png = await sharp(input).resize({ width: WIDTH, withoutEnlargement: true })
    .png({ compressionLevel: 9, quality: 85, palette: true }).toBuffer();
  await writeFile(join(DST, `${s}.png`), png);
  const webp = await sharp(input).resize({ width: WIDTH, withoutEnlargement: true })
    .webp({ quality: 82 }).toBuffer();
  await writeFile(join(DST, `${s}.webp`), webp);
  pngTotal += png.length; webpTotal += webp.length;
  map.push(`${product}  ->  img/products/${s}.png`);
}

console.log(map.join('\n'));
console.log(`\n${files.length} products. PNG ${(pngTotal/1024/1024).toFixed(2)}MB, WebP ${(webpTotal/1024/1024).toFixed(2)}MB.`);
