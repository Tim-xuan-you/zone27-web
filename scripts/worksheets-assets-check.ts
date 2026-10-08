/**
 * 學習單的 PDF、預覽圖是不是最新的（build 後自動跑）。
 *
 * 那些檔案是在本機用 Edge 產生的（scripts/worksheets-assets.ts），Vercel 上產生不了。
 * 學習單的字、版面、題目改了，卻忘了重產，家長下載到的 PDF 就會跟網頁上看到的不一樣。
 * 所以每個檔案都記了產生時那張學習單的指紋，這裡重算一次，對不上就擋 build。
 *
 * 修法：npx tsx scripts/worksheets-assets.ts，再一起提交。
 */
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { ASSET_DIR } from "../lib/worksheets/assets";
import { assetJobs, jobFingerprint } from "./worksheets-asset-list";

const DIR = resolve(import.meta.dirname, "..", "public", ASSET_DIR);
const manifestFile = join(DIR, "manifest.json");
if (!existsSync(manifestFile)) {
  console.error("✗ 找不到學習單的 PDF 和預覽圖（public/worksheets/files/manifest.json）。先跑 npx tsx scripts/worksheets-assets.ts");
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestFile, "utf8")) as Record<string, string>;

const want = assetJobs();

const problems: string[] = [];
for (const j of want) {
  const file = j.file;
  if (!existsSync(join(DIR, file))) { problems.push(`${file}：檔案不見了`); continue; }
  if (manifest[file] !== jobFingerprint(j)) problems.push(`${file}：學習單改過了，檔案還是舊的`);
}
if (problems.length) {
  console.error(`\n✗ 學習單的 PDF／預覽圖有 ${problems.length} 個跟網頁上的不一樣：`);
  problems.slice(0, 12).forEach((p) => console.error("  " + p));
  console.error("\n重產：npx tsx scripts/worksheets-assets.ts，再一起提交。\n");
  process.exit(1);
}
console.log(`✓ 學習單檔案是最新的：${want.length} 個 PDF、預覽圖、分享圖都跟網頁上的一樣`);
