import { createHash } from "node:crypto";

/** 學習單內容的指紋：產生檔案時記下來，build 後比對，內容改了檔案沒重產就擋 */
export const assetFingerprint = (svgs: string[]): string =>
  createHash("sha1").update(svgs.join("\n---\n")).digest("hex").slice(0, 16);
