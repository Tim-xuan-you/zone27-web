import qrcode from "qrcode-generator";
import type { AcornPuzzle } from "./acorn";

/**
 * 學習單的圖：全部自己畫（SVG），沒有拿任何現成的圖。放大縮小都不會糊，黑白印也分得清楚。
 * 單位是公釐，跟 A4 一樣。
 *
 * 顏色從 Tim 偏愛的顏色裡挑（memory: tim-preferred-colors）：
 * 主色蔚藍、提示和箭頭用橘、答案用翡翠綠、牆和字用鐵灰、格子底用很淡的天藍。
 */
export const WS = {
  azure: "#1E88E5",
  orange: "#F28C28",
  emerald: "#1E9E6A",
  iron: "#3E4348",
  sky: "#E4F2FC",
  lilac: "#F2EEF9",
  tan: "#C9A66B",
  taupe: "#8C7B6A",
  paper: "#FBF7F0",
};

const r2 = (n: number) => Math.round(n * 100) / 100;

export const acornIcon = (x: number, y: number, s: number): string => `
<g stroke="#4A3220" stroke-width="${r2(0.045 * s)}" stroke-linejoin="round">
<path d="M ${r2(x - 0.25 * s)} ${r2(y - 0.04 * s)} Q ${r2(x - 0.27 * s)} ${r2(y + 0.3 * s)} ${r2(x)} ${r2(y + 0.4 * s)} Q ${r2(x + 0.27 * s)} ${r2(y + 0.3 * s)} ${r2(x + 0.25 * s)} ${r2(y - 0.04 * s)} Z" fill="#D9A062"/>
<path d="M ${r2(x - 0.13 * s)} ${r2(y + 0.05 * s)} Q ${r2(x - 0.14 * s)} ${r2(y + 0.2 * s)} ${r2(x - 0.05 * s)} ${r2(y + 0.27 * s)}" fill="none" stroke="#FFF3E0" stroke-width="${r2(0.05 * s)}" stroke-linecap="round"/>
<path d="M ${r2(x - 0.33 * s)} ${r2(y - 0.02 * s)} A ${r2(0.33 * s)} ${r2(0.22 * s)} 0 0 1 ${r2(x + 0.33 * s)} ${r2(y - 0.02 * s)} Z" fill="#8A5A33"/>
<path d="M ${r2(x - 0.16 * s)} ${r2(y - 0.17 * s)} L ${r2(x - 0.06 * s)} ${r2(y - 0.04 * s)} M ${r2(x + 0.02 * s)} ${r2(y - 0.22 * s)} L ${r2(x + 0.11 * s)} ${r2(y - 0.05 * s)} M ${r2(x + 0.18 * s)} ${r2(y - 0.17 * s)} L ${r2(x + 0.25 * s)} ${r2(y - 0.06 * s)}" stroke="#5E3B1F" stroke-width="${r2(0.035 * s)}" stroke-linecap="round" fill="none"/>
<path d="M ${r2(x)} ${r2(y - 0.24 * s)} Q ${r2(x + 0.02 * s)} ${r2(y - 0.36 * s)} ${r2(x + 0.1 * s)} ${r2(y - 0.4 * s)}" fill="none" stroke-width="${r2(0.06 * s)}" stroke-linecap="round"/>
</g>`;

export const squirrelIcon = (x: number, y: number, s: number): string => `
<g stroke="#4A3220" stroke-width="${r2(0.03 * s)}" stroke-linejoin="round">
<path d="M ${r2(x - 0.02 * s)} ${r2(y + 0.36 * s)} C ${r2(x - 0.62 * s)} ${r2(y + 0.34 * s)} ${r2(x - 0.58 * s)} ${r2(y - 0.5 * s)} ${r2(x - 0.2 * s)} ${r2(y - 0.46 * s)} C ${r2(x + 0.02 * s)} ${r2(y - 0.44 * s)} ${r2(x)} ${r2(y - 0.2 * s)} ${r2(x - 0.16 * s)} ${r2(y - 0.22 * s)} C ${r2(x - 0.34 * s)} ${r2(y - 0.2 * s)} ${r2(x - 0.3 * s)} ${r2(y + 0.12 * s)} ${r2(x - 0.02 * s)} ${r2(y + 0.36 * s)} Z" fill="#B8682F"/>
<ellipse cx="${r2(x + 0.06 * s)}" cy="${r2(y + 0.2 * s)}" rx="${r2(0.2 * s)}" ry="${r2(0.21 * s)}" fill="#D98B4E"/>
<ellipse cx="${r2(x + 0.07 * s)}" cy="${r2(y + 0.24 * s)}" rx="${r2(0.1 * s)}" ry="${r2(0.13 * s)}" fill="#F6DCC0" stroke="none"/>
<ellipse cx="${r2(x)}" cy="${r2(y - 0.31 * s)}" rx="${r2(0.055 * s)}" ry="${r2(0.09 * s)}" fill="#D98B4E"/>
<ellipse cx="${r2(x + 0.22 * s)}" cy="${r2(y - 0.31 * s)}" rx="${r2(0.055 * s)}" ry="${r2(0.09 * s)}" fill="#D98B4E"/>
<circle cx="${r2(x + 0.11 * s)}" cy="${r2(y - 0.12 * s)}" r="${r2(0.2 * s)}" fill="#D98B4E"/>
<circle cx="${r2(x + 0.04 * s)}" cy="${r2(y - 0.15 * s)}" r="${r2(0.028 * s)}" fill="#2B2B2B" stroke="none"/>
<circle cx="${r2(x + 0.18 * s)}" cy="${r2(y - 0.15 * s)}" r="${r2(0.028 * s)}" fill="#2B2B2B" stroke="none"/>
<circle cx="${r2(x + 0.11 * s)}" cy="${r2(y - 0.07 * s)}" r="${r2(0.022 * s)}" fill="#4A3220" stroke="none"/>
<circle cx="${r2(x - 0.01 * s)}" cy="${r2(y - 0.06 * s)}" r="${r2(0.035 * s)}" fill="#F4A9A0" stroke="none"/>
<circle cx="${r2(x + 0.23 * s)}" cy="${r2(y - 0.06 * s)}" r="${r2(0.035 * s)}" fill="#F4A9A0" stroke="none"/>
</g>`;

export const houseIcon = (x: number, y: number, s: number): string => `
<g stroke="${WS.iron}" stroke-width="${r2(0.035 * s)}" stroke-linejoin="round">
<rect x="${r2(x + 0.12 * s)}" y="${r2(y - 0.36 * s)}" width="${r2(0.09 * s)}" height="${r2(0.16 * s)}" fill="#FFFFFF"/>
<rect x="${r2(x - 0.28 * s)}" y="${r2(y - 0.04 * s)}" width="${r2(0.56 * s)}" height="${r2(0.4 * s)}" fill="#FFFFFF"/>
<path d="M ${r2(x - 0.38 * s)} ${r2(y - 0.02 * s)} L ${r2(x)} ${r2(y - 0.38 * s)} L ${r2(x + 0.38 * s)} ${r2(y - 0.02 * s)} Z" fill="${WS.orange}"/>
<rect x="${r2(x - 0.17 * s)}" y="${r2(y + 0.12 * s)}" width="${r2(0.13 * s)}" height="${r2(0.24 * s)}" fill="${WS.tan}"/>
<rect x="${r2(x + 0.06 * s)}" y="${r2(y + 0.06 * s)}" width="${r2(0.12 * s)}" height="${r2(0.12 * s)}" fill="${WS.sky}"/>
</g>`;

/**
 * 小松鼠的腳印。腳趾朝走的方向（deg：0 往上、90 往右、180 往下、270 往左）。
 * 2026-10-01 Tim 家的孩子問「每一格是什麼？」：例子裡每走一格就留一個腳印，一看就懂「一格一格走、踩過了」
 */
export const pawIcon = (x: number, y: number, s: number, deg: number): string => `
<g transform="translate(${r2(x)} ${r2(y)}) rotate(${deg})" fill="#8A5A33">
<ellipse cx="0" cy="${r2(0.09 * s)}" rx="${r2(0.15 * s)}" ry="${r2(0.12 * s)}"/>
<circle cx="${r2(-0.15 * s)}" cy="${r2(-0.09 * s)}" r="${r2(0.055 * s)}"/>
<circle cx="0" cy="${r2(-0.16 * s)}" r="${r2(0.055 * s)}"/>
<circle cx="${r2(0.15 * s)}" cy="${r2(-0.09 * s)}" r="${r2(0.055 * s)}"/>
</g>`;

/** 右向的小三角（入口、出口的箭頭） */
const arrowRight = (x: number, y: number, k: number, fill: string) =>
  `<path d="M ${r2(x)} ${r2(y - k)} L ${r2(x + k * 1.3)} ${r2(y)} L ${r2(x)} ${r2(y + k)} Z" fill="${fill}"/>`;

export interface MazeOpts {
  /** 要畫的路線（提示、答案） */
  path?: number[];
  /** 路線畫成一格一個腳印（「小松鼠這樣走」那個例子） */
  paws?: boolean;
  color?: string;
  /** 左右留給松鼠、房子的空間（格子的倍數） */
  side?: number;
  icon?: number;
  /** 數字松果：每一顆松果上的數字（跟 p.acorns 同順序）、房子上的數字 */
  values?: number[];
  target?: number;
}

const SANS = "'Noto Sans TC', 'Noto Sans TC Fallback', sans-serif";
/** 白底圓圈裡一個數字（松果上的數字） */
const numBadge = (x: number, y: number, r: number, n: number, fill = "#FFFFFF", ink: string = WS.iron) =>
  `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="${fill}" stroke="${WS.iron}" stroke-width="${r2(r * 0.12)}"/>` +
  `<text x="${r2(x)}" y="${r2(y + r * 0.05)}" font-size="${r2(r * (n >= 10 ? 1.15 : 1.35))}" font-family="${SANS}" font-weight="800" fill="${ink}" text-anchor="middle" dominant-baseline="central">${n}</text>`;

/**
 * 一題迷宮。回傳 SVG 片段（放在 translate 裡用）和它的寬高。
 * 左上角是入口（牆不畫），右下角是出口（牆不畫），各有一個箭頭。
 * 2026-10-01 Tim 抓到：第一版右下角也封起來了，走到房子前面進不去。
 */
export function mazeSvg(p: AcornPuzzle, c: number, opts: MazeOpts = {}): { svg: string; w: number; h: number } {
  const { path, paws = false, color = WS.emerald, side = 1.15, icon = 0.95, values, target } = opts;
  const { W, H } = p;
  const open = new Set(p.open);
  const ml = c * side, mr = c * side, mt = c * 0.2, mb = c * 0.35;
  const w = ml + W * c + mr, h = mt + H * c + mb;
  const X = (i: number) => ml + ((i % W) + 0.5) * c;
  const Y = (i: number) => mt + (Math.floor(i / W) + 0.5) * c;
  const x0 = ml, y0 = mt, x1 = ml + W * c, y1 = mt + H * c;
  const walls: string[] = [];
  for (let i = 0; i < W * H; i++) {
    const x = i % W, y = Math.floor(i / W);
    const nbrs: [number, number, number, number, number][] = [];
    if (x < W - 1) nbrs.push([i + 1, x0 + (x + 1) * c, y0 + y * c, x0 + (x + 1) * c, y0 + (y + 1) * c]);
    if (y < H - 1) nbrs.push([i + W, x0 + x * c, y0 + (y + 1) * c, x0 + (x + 1) * c, y0 + (y + 1) * c]);
    for (const [j, ax, ay, bx, by] of nbrs) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!open.has(key)) walls.push(`M ${r2(ax)} ${r2(ay)} L ${r2(bx)} ${r2(by)}`);
    }
  }
  /*
   * 格子畫成一塊一塊的地磚，磚跟磚之間留白縫（2026-10-01）。
   * 第一版只有淡淡的虛線，孩子看到的是一大片藍色空地，問「每一格是什麼？」
   * 地磚黑白印出來是淺灰配白縫，一樣分得出一塊一塊。
   */
  const gap = c * 0.06;
  let g = `<rect x="${r2(x0)}" y="${r2(y0)}" width="${r2(W * c)}" height="${r2(H * c)}" fill="#FFFFFF"/>`;
  for (let i = 0; i < W * H; i++) {
    const tx = x0 + (i % W) * c + gap, ty = y0 + Math.floor(i / W) * c + gap;
    g += `<rect x="${r2(tx)}" y="${r2(ty)}" width="${r2(c - 2 * gap)}" height="${r2(c - 2 * gap)}" rx="${r2(c * 0.14)}" fill="#D7E9F8"/>`;
  }
  // 外框：左邊第一列是入口、右邊最後一列是出口，兩個地方都不畫牆
  g += `<path d="M ${r2(x0)} ${r2(y0 + c)} L ${r2(x0)} ${r2(y1)} L ${r2(x1)} ${r2(y1)} M ${r2(x0)} ${r2(y0)} L ${r2(x1)} ${r2(y0)} L ${r2(x1)} ${r2(y1 - c)}" fill="none" stroke="${WS.iron}" stroke-width="${r2(c * 0.1)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (walls.length) g += `<path d="${walls.join(" ")}" stroke="${WS.iron}" stroke-width="${r2(c * 0.1)}" stroke-linecap="round"/>`;
  // 路線畫在松果下面，才不會把松果蓋掉
  if (path && paws) {
    // 每一格一個腳印，腳趾朝下一格的方向；最後一格朝出口
    path.forEach((cell, k) => {
      const next = path[k + 1];
      const dx = next === undefined ? 1 : Math.sign(X(next) - X(cell));
      const dy = next === undefined ? 0 : Math.sign(Y(next) - Y(cell));
      const deg = dx === 1 ? 90 : dx === -1 ? 270 : dy === 1 ? 180 : 0;
      g += pawIcon(X(cell), Y(cell), c * 0.78, deg);
    });
  } else if (path && path.length > 1) {
    // 走到終點的話，線畫到房子門口：一看就知道回到家了
    const pts = path.map((i) => `${r2(X(i))},${r2(Y(i))}`);
    if (path[path.length - 1] === p.E) pts.push(`${r2(x1 + c * 0.02)},${r2(Y(p.E))}`);
    g += `<polyline points="${pts.join(" ")}" fill="none" stroke="${color}" stroke-width="${r2(c * 0.13)}" stroke-linecap="round" stroke-linejoin="round" opacity="0.92"/>`;
    const last = path[path.length - 1], prev = path[path.length - 2];
    if (last !== p.E) {
      // 提示：路畫到一半，尾巴加箭頭告訴孩子下一步往哪
      const dx = Math.sign(X(last) - X(prev)), dy = Math.sign(Y(last) - Y(prev));
      const ax = X(last) + dx * c * 0.16, ay = Y(last) + dy * c * 0.16, k = c * 0.2;
      g += `<path d="M ${r2(ax + dx * k)} ${r2(ay + dy * k)} L ${r2(ax - dy * k)} ${r2(ay + dx * k)} L ${r2(ax + dy * k)} ${r2(ay - dx * k)} Z" fill="${color}"/>`;
    }
  }
  for (const a of p.acorns) g += acornIcon(X(a), Y(a), c * 0.8);
  // 數字松果：數字放在松果右下角，白底圓圈，黑白印也看得清楚
  if (values) p.acorns.forEach((a, k) => { g += numBadge(X(a) + c * 0.2, Y(a) + c * 0.18, c * 0.21, values[k]); });
  g += squirrelIcon(ml - c * 0.62, mt + c * 0.5, c * icon);
  g += arrowRight(ml - c * 0.16, mt + c * 0.5, c * 0.14, WS.orange);
  g += arrowRight(x1 + c * 0.04, y1 - c * 0.5, c * 0.14, WS.orange);
  g += houseIcon(x1 + c * 0.66, y1 - c * 0.5, c * icon);
  // 數字松果：房子上面的數字（橘色，要湊到的那個數）
  if (target !== undefined) g += numBadge(x1 + c * 0.66, y1 - c * 1.32, c * 0.32, target, WS.orange, "#FFFFFF");
  return { svg: g, w, h };
}

/** QR code 畫成 SVG 路徑。size 是邊長（公釐），四周留兩格白邊 */
export function qrSvg(url: string, x: number, y: number, size: number): string {
  const qr = qrcode(0, "M");
  qr.addData(url);
  qr.make();
  const n = qr.getModuleCount();
  const m = size / (n + 4);
  const d: string[] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.isDark(r, c)) d.push(`M${r2(x + (c + 2) * m)} ${r2(y + (r + 2) * m)}h${r2(m)}v${r2(m)}h${r2(-m)}z`);
    }
  }
  return `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(size)}" height="${r2(size)}" fill="#FFFFFF"/><path d="${d.join("")}" fill="#1C1A17"/>`;
}
