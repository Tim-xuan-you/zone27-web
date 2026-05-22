// ── ZONE 27 · Signature processor ──────────────────────
// One-off script · Round 31 W-H · Tim signature PNG processing。
// Input:  public/tim-signature-raw.png(Tim 紙上簽名手機拍照原稿)
// Output: public/tim-signature.png(白底去透明 + 黑色拉滿 + 自動 crop +
//          resize 600px wide · 用於 Founders 27 PDF cert + email signature)
//
// 處理 logic:
//   1. 白底判定:任何 R/G/B 都 > 200 → alpha 0(透明)
//   2. 灰階區(過渡 anti-alias):依 brightness 線性 alpha · 保留筆觸柔邊
//   3. 黑色保留(brightness < 80)→ 強制 #000000 純黑 · alpha 255
//   4. trim transparent edges(autoCrop)
//   5. resize 600px wide(保留 aspect ratio)
// ─────────────────────────────────────────────────────

import { Jimp } from "jimp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const INPUT = path.join(ROOT, "public", "tim-signature-raw.png");
const OUTPUT = path.join(ROOT, "public", "tim-signature.png");

const WHITE_THRESHOLD = 200;  // anything > this on R/G/B = white paper
const BLACK_THRESHOLD = 80;   // anything < this on R/G/B = pure black ink
const TARGET_WIDTH = 600;

console.log(`📥 Reading ${INPUT}`);
const image = await Jimp.read(INPUT);
console.log(`   Original size: ${image.bitmap.width}×${image.bitmap.height}`);

// Pixel-by-pixel processing
let whiteCount = 0;
let blackCount = 0;
let edgeCount = 0;

image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
  const r = this.bitmap.data[idx + 0];
  const g = this.bitmap.data[idx + 1];
  const b = this.bitmap.data[idx + 2];
  const brightness = (r + g + b) / 3;

  if (r > WHITE_THRESHOLD && g > WHITE_THRESHOLD && b > WHITE_THRESHOLD) {
    // White paper → fully transparent
    this.bitmap.data[idx + 0] = 0;
    this.bitmap.data[idx + 1] = 0;
    this.bitmap.data[idx + 2] = 0;
    this.bitmap.data[idx + 3] = 0;
    whiteCount++;
  } else if (brightness < BLACK_THRESHOLD) {
    // Dark ink → pure black, fully opaque
    this.bitmap.data[idx + 0] = 0;
    this.bitmap.data[idx + 1] = 0;
    this.bitmap.data[idx + 2] = 0;
    this.bitmap.data[idx + 3] = 255;
    blackCount++;
  } else {
    // Anti-alias edge (grey transition zone) → black with proportional alpha
    // brightness 80 = fully opaque, brightness 200 = fully transparent
    const alpha = Math.round(
      255 * (1 - (brightness - BLACK_THRESHOLD) / (WHITE_THRESHOLD - BLACK_THRESHOLD))
    );
    this.bitmap.data[idx + 0] = 0;
    this.bitmap.data[idx + 1] = 0;
    this.bitmap.data[idx + 2] = 0;
    this.bitmap.data[idx + 3] = Math.max(0, Math.min(255, alpha));
    edgeCount++;
  }
});

console.log(`   Pixels: white=${whiteCount} · black=${blackCount} · edge=${edgeCount}`);

// Auto-crop transparent edges
image.autocrop({ cropOnlyFrames: false, cropSymmetric: false });
console.log(`   After autocrop: ${image.bitmap.width}×${image.bitmap.height}`);

// Resize to target width (up or down · Lanczos smoothing for line art)
if (image.bitmap.width !== TARGET_WIDTH) {
  image.resize({ w: TARGET_WIDTH });
  console.log(`   After resize: ${image.bitmap.width}×${image.bitmap.height}`);
}

await image.write(OUTPUT);
console.log(`✅ Wrote ${OUTPUT}`);
console.log(`   Final size: ${image.bitmap.width}×${image.bitmap.height} · transparent background + pure black ink`);
