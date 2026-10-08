/**
 * 每一頁的 openGraph 都要帶這兩個。
 *
 * Next.js 的 metadata 不會把 openGraph 合併：頁面只要自己寫了 openGraph（換分享圖），
 * layout 那邊的 locale、siteName 就整個不見（2026-10-09 查線上才發現，首頁和學習單都沒有）。
 * 所以頁面寫 openGraph 的時候一律先放 ...OG_BASE。
 */
export const OG_BASE = { locale: "zh_TW", siteName: "ZONE 27" } as const;
