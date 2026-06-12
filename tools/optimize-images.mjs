#!/usr/bin/env node
/**
 * Image optimizer for the DE-Blessed Uba Global site.
 *
 *   npm run images:webp      Create a .webp next to every JPG/PNG in img/ (non-destructive).
 *   npm run images:compress  Re-encode JPG/PNG in img/ in place, keeping the result only if
 *                            it is actually smaller (safe — never grows a file).
 *
 * Flags:
 *   --force   When creating WebP, overwrite existing .webp files.
 *
 * Originals are never deleted. After generating WebP you can serve them with a
 * <picture> element, e.g.:
 *   <picture>
 *     <source srcset="img/theweb/slider1.webp" type="image/webp">
 *     <img src="img/theweb/slider1.jpg" alt="...">
 *   </picture>
 */
import { readdir, stat, readFile, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const ROOT = 'img';
const args = process.argv.slice(2);
const mode = args.includes('--compress') ? 'compress' : 'webp';
const force = args.includes('--force');
const exts = new Set(['.jpg', '.jpeg', '.png']);

let totalBefore = 0, totalAfter = 0, count = 0;
const fmt = (b) => (b / 1024).toFixed(1) + ' KB';

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p);
    else if (exts.has(extname(e.name).toLowerCase())) await handle(p);
  }
}

async function handle(file) {
  const ext = extname(file).toLowerCase();
  const input = await readFile(file);

  if (mode === 'webp') {
    const out = file.slice(0, -ext.length) + '.webp';
    if (!force) { try { await stat(out); return; } catch { /* not there, continue */ } }
    const buf = await sharp(input).rotate().webp({ quality: 80 }).toBuffer();
    await writeFile(out, buf);
    totalBefore += input.length; totalAfter += buf.length; count++;
    console.log(`webp      ${file}  ${fmt(input.length)} -> ${fmt(buf.length)}`);
    return;
  }

  // compress in place
  let pipeline = sharp(input).rotate();
  pipeline = ext === '.png'
    ? pipeline.png({ compressionLevel: 9, palette: true, quality: 80 })
    : pipeline.jpeg({ quality: 80, mozjpeg: true });
  const buf = await pipeline.toBuffer();
  if (buf.length < input.length) {
    await writeFile(file, buf);
    totalBefore += input.length; totalAfter += buf.length; count++;
    console.log(`compress  ${file}  ${fmt(input.length)} -> ${fmt(buf.length)}`);
  }
}

await walk(ROOT);
console.log(`\nDone (${mode}). ${count} file(s). Saved ${fmt(totalBefore - totalAfter)} (${fmt(totalBefore)} -> ${fmt(totalAfter)}).`);
