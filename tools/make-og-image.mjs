#!/usr/bin/env node
/**
 * Generate a proper 1200x630 social-share image (Open Graph / Twitter) from the
 * company logo, centered on a clean white canvas.
 *
 *   node tools/make-og-image.mjs
 *
 * Output: img/theweb/og-image.png
 */
import sharp from 'sharp';

const W = 1200, H = 630;
const SRC = 'COMPLETE LOGO.png';
const OUT = 'img/theweb/og-image.png';

const logo = await sharp(SRC)
  .resize({ height: 480, fit: 'inside', withoutEnlargement: true })
  .toBuffer();

await sharp({
  create: { width: W, height: H, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } }
})
  .composite([{ input: logo, gravity: 'center' }])
  .png()
  .toFile(OUT);

console.log(`Created ${OUT} (${W}x${H})`);
