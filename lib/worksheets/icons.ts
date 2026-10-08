/**
 * 注音猜猜看的小圖：全部自己畫，100×100 的格子裡畫，用的時候縮放。
 *
 * 規矩：一眼就要認得出來（認不出來的圖，錯的是圖不是孩子），黑白印也分得清楚。
 * 所以每一張都有粗的深色外框，顏色只是輔助。
 */

const O = "#3E4348"; // 外框
const SW = 3.2;
const st = `stroke="${O}" stroke-width="${SW}" stroke-linejoin="round" stroke-linecap="round"`;
const thin = `stroke="${O}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"`;

export const ICONS: Record<string, string> = {
  cat: `
<path d="M24 40 L27 14 L44 30 Z" fill="#F2B36B" ${st}/><path d="M76 40 L73 14 L56 30 Z" fill="#F2B36B" ${st}/>
<ellipse cx="50" cy="54" rx="31" ry="27" fill="#F2B36B" ${st}/>
<path d="M30 21 L32 32 M70 21 L68 32" stroke="#E08A3C" stroke-width="3" stroke-linecap="round"/>
<circle cx="39" cy="50" r="4" fill="${O}"/><circle cx="61" cy="50" r="4" fill="${O}"/>
<path d="M46 60 L54 60 L50 65 Z" fill="#E86F7E" ${thin}/>
<path d="M50 65 Q46 71 41 68 M50 65 Q54 71 59 68" fill="none" ${thin}/>
<path d="M16 56 L33 58 M16 64 L33 63 M84 56 L67 58 M84 64 L67 63" ${thin}/>`,

  fish: `
<path d="M14 50 C24 30 58 28 74 50 C58 72 24 70 14 50 Z" fill="#6CB4F2" ${st}/>
<path d="M72 50 L90 34 L88 50 L90 66 Z" fill="#4A9BE0" ${st}/>
<circle cx="30" cy="46" r="4" fill="${O}"/>
<path d="M44 38 Q50 50 44 62" fill="none" ${thin}/>`,

  rain: `
<path d="M24 54 C12 54 12 36 26 36 C28 22 48 18 55 30 C62 22 79 26 77 39 C89 39 89 54 76 54 Z" fill="#DDE7F0" ${st}/>
<path d="M32 64 Q28 72 32 76 Q36 72 32 64 Z" fill="#4A9BE0" ${thin}/>
<path d="M52 66 Q48 74 52 78 Q56 74 52 66 Z" fill="#4A9BE0" ${thin}/>
<path d="M70 62 Q66 70 70 74 Q74 70 70 62 Z" fill="#4A9BE0" ${thin}/>
<path d="M42 80 Q38 88 42 92 Q46 88 42 80 Z" fill="#4A9BE0" ${thin}/>
<path d="M62 80 Q58 88 62 92 Q66 88 62 80 Z" fill="#4A9BE0" ${thin}/>`,

  book: `
<path d="M50 28 C40 22 24 22 12 26 L12 78 C24 74 40 74 50 80 C60 74 76 74 88 78 L88 26 C76 22 60 22 50 28 Z" fill="#FFFFFF" ${st}/>
<path d="M50 28 L50 80" ${st}/>
<path d="M12 78 L12 84 C24 80 40 80 50 86 C60 80 76 80 88 84 L88 78" fill="#E8781A" ${st}/>
<path d="M20 36 L42 36 M20 46 L42 46 M20 56 L38 56 M58 36 L80 36 M58 46 L80 46 M58 56 L76 56" stroke="#9AA3AD" stroke-width="2.4" stroke-linecap="round"/>`,

  tree: `
<rect x="43" y="58" width="14" height="32" rx="2" fill="#A0663A" ${st}/>
<path d="M50 10 C64 10 74 20 74 32 C84 36 86 52 76 60 C70 70 30 70 24 60 C14 52 16 36 26 32 C26 20 36 10 50 10 Z" fill="#5DB85F" ${st}/>
<path d="M38 36 Q42 32 46 36 M56 46 Q60 42 64 46 M34 52 Q38 48 42 52" fill="none" stroke="#3E8E46" stroke-width="2.6" stroke-linecap="round"/>`,

  soup: `
<path d="M38 34 Q32 26 38 18 Q44 10 38 4" fill="none" stroke="#9AA3AD" stroke-width="3" stroke-linecap="round"/>
<path d="M54 34 Q48 26 54 18 Q60 10 54 4" fill="none" stroke="#9AA3AD" stroke-width="3" stroke-linecap="round"/>
<path d="M68 34 Q62 26 68 18" fill="none" stroke="#9AA3AD" stroke-width="3" stroke-linecap="round"/>
<path d="M12 46 L88 46 C86 72 70 86 50 86 C30 86 14 72 12 46 Z" fill="#FFFFFF" ${st}/>
<ellipse cx="50" cy="46" rx="38" ry="7" fill="#F2C14E" ${st}/>
<path d="M22 62 L78 62" stroke="#E8781A" stroke-width="4"/>
<path d="M62 44 L86 22" stroke="${O}" stroke-width="5" stroke-linecap="round"/>`,

  candy: `
<path d="M34 50 L12 34 L18 50 L12 66 Z" fill="#F7A8C0" ${st}/>
<path d="M66 50 L88 34 L82 50 L88 66 Z" fill="#F7A8C0" ${st}/>
<circle cx="50" cy="50" r="18" fill="#E85D8A" ${st}/>
<path d="M40 42 Q50 34 58 44 Q62 56 50 60" fill="none" stroke="#FFFFFF" stroke-width="3.4" stroke-linecap="round"/>`,

  duck: `
<path d="M40 52 C40 40 64 38 80 46 C90 52 88 74 70 80 L38 80 C24 80 20 66 30 60 Z" fill="#F6D24A" ${st}/>
<circle cx="34" cy="36" r="16" fill="#F6D24A" ${st}/>
<path d="M18 36 L4 40 L18 44 Z" fill="#F28C28" ${st}/>
<circle cx="32" cy="32" r="3.4" fill="${O}"/>
<path d="M52 58 Q64 54 72 62 Q62 70 52 64 Z" fill="#EBBE2E" ${thin}/>`,

  tooth: `
<path d="M28 26 C28 12 44 12 50 20 C56 12 72 12 72 26 C72 42 68 50 66 62 C64 76 60 86 56 86 C51 86 52 66 50 66 C48 66 49 86 44 86 C40 86 36 76 34 62 C32 50 28 42 28 26 Z" fill="#FFFFFF" ${st}/>
<path d="M36 26 Q38 20 44 20" fill="none" stroke="#BFD9EE" stroke-width="3" stroke-linecap="round"/>
<path d="M80 18 L80 26 M76 22 L84 22 M16 40 L16 46 M13 43 L19 43" stroke="#4A9BE0" stroke-width="2.4" stroke-linecap="round"/>`,

  pig: `
<path d="M24 34 L20 14 L40 24 Z" fill="#F6B3C0" ${st}/><path d="M76 34 L80 14 L60 24 Z" fill="#F6B3C0" ${st}/>
<circle cx="50" cy="52" r="32" fill="#F6B3C0" ${st}/>
<ellipse cx="50" cy="60" rx="14" ry="10" fill="#EE8FA2" ${st}/>
<ellipse cx="45" cy="60" rx="2.6" ry="3.6" fill="${O}"/><ellipse cx="55" cy="60" rx="2.6" ry="3.6" fill="${O}"/>
<circle cx="38" cy="44" r="3.6" fill="${O}"/><circle cx="62" cy="44" r="3.6" fill="${O}"/>`,

  bamboo: `
<rect x="30" y="8" width="14" height="86" rx="4" fill="#7BC47F" ${st}/>
<rect x="56" y="26" width="12" height="68" rx="4" fill="#9AD39D" ${st}/>
<path d="M30 34 L44 34 M30 60 L44 60 M56 50 L68 50 M56 74 L68 74" ${st}/>
<path d="M44 34 C56 26 66 26 76 30 C66 36 56 36 44 34 Z" fill="#5DB85F" ${thin}/>
<path d="M30 60 C20 52 10 52 4 56 C12 62 20 62 30 60 Z" fill="#5DB85F" ${thin}/>
<path d="M68 50 C78 42 88 44 94 48 C86 54 78 54 68 50 Z" fill="#5DB85F" ${thin}/>`,

  flower: `
<path d="M50 56 L50 94" stroke="#3E8E46" stroke-width="4" stroke-linecap="round"/>
<path d="M50 80 C40 70 28 72 24 78 C34 84 44 84 50 80 Z" fill="#5DB85F" ${thin}/>
<circle cx="50" cy="20" r="12" fill="#F28CA6" ${st}/><circle cx="30" cy="34" r="12" fill="#F28CA6" ${st}/>
<circle cx="70" cy="34" r="12" fill="#F28CA6" ${st}/><circle cx="37" cy="54" r="12" fill="#F28CA6" ${st}/>
<circle cx="63" cy="54" r="12" fill="#F28CA6" ${st}/>
<circle cx="50" cy="39" r="11" fill="#F6D24A" ${st}/>`,

  painting: `
<rect x="10" y="16" width="80" height="68" rx="3" fill="#C98A4B" ${st}/>
<rect x="19" y="25" width="62" height="50" fill="#E6F2FB" ${thin}/>
<path d="M19 75 L40 48 L52 62 L62 52 L81 75 Z" fill="#5DB85F" ${thin}/>
<circle cx="66" cy="37" r="7" fill="#F6D24A" ${thin}/>
<path d="M36 16 L50 4 L64 16" fill="none" ${thin}/>`,

  star: `
<path d="M50 8 L61 36 L91 38 L68 57 L76 87 L50 70 L24 87 L32 57 L9 38 L39 36 Z" fill="#F6D24A" ${st}/>`,

  heart: `
<path d="M50 86 C20 64 8 46 14 30 C20 14 42 12 50 30 C58 12 80 14 86 30 C92 46 80 64 50 86 Z" fill="#E8505B" ${st}/>
<path d="M26 30 Q30 24 36 25" fill="none" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round"/>`,

  mountain: `
<path d="M4 86 L36 30 L58 64 L68 48 L96 86 Z" fill="#7BAE7F" ${st}/>
<path d="M28 44 L36 30 L44 43 L39 47 L35 42 L31 47 Z" fill="#FFFFFF" ${thin}/>
<path d="M62 57 L68 48 L74 57 L70 60 Z" fill="#FFFFFF" ${thin}/>`,

  umbrella: `
<path d="M8 48 C10 22 30 10 50 10 C70 10 90 22 92 48 C86 42 78 42 71 48 C64 42 56 42 50 48 C44 42 36 42 29 48 C22 42 14 42 8 48 Z" fill="#E8781A" ${st}/>
<path d="M50 10 L50 6" ${st}/>
<path d="M50 48 L50 82 C50 92 36 92 36 82" fill="none" stroke="${O}" stroke-width="4.4" stroke-linecap="round"/>
<path d="M29 48 C34 30 40 18 50 10 M71 48 C66 30 60 18 50 10" fill="none" ${thin}/>`,

  cow: `
<path d="M26 30 Q14 26 10 14 Q22 16 30 24" fill="#FFFFFF" ${st}/><path d="M74 30 Q86 26 90 14 Q78 16 70 24" fill="#FFFFFF" ${st}/>
<ellipse cx="18" cy="40" rx="10" ry="6" fill="#FFFFFF" ${st}/><ellipse cx="82" cy="40" rx="10" ry="6" fill="#FFFFFF" ${st}/>
<path d="M28 30 C28 18 72 18 72 30 L74 58 C74 80 26 80 26 58 Z" fill="#FFFFFF" ${st}/>
<path d="M30 30 C38 26 44 34 40 42 C34 46 28 40 28 36 Z" fill="${O}"/>
<ellipse cx="50" cy="66" rx="20" ry="13" fill="#F6B3C0" ${st}/>
<ellipse cx="43" cy="66" rx="3" ry="4" fill="${O}"/><ellipse cx="57" cy="66" rx="3" ry="4" fill="${O}"/>
<circle cx="40" cy="44" r="3.6" fill="${O}"/><circle cx="62" cy="44" r="3.6" fill="${O}"/>`,

  bird: `
<path d="M74 52 L94 44 L90 58 Z" fill="#4A9BE0" ${st}/>
<ellipse cx="50" cy="54" rx="28" ry="24" fill="#6CB4F2" ${st}/>
<circle cx="34" cy="36" r="15" fill="#6CB4F2" ${st}/>
<path d="M20 36 L8 40 L20 44 Z" fill="#F28C28" ${st}/>
<circle cx="31" cy="33" r="3.4" fill="${O}"/>
<path d="M44 52 Q60 44 70 56 Q58 66 44 60 Z" fill="#4A9BE0" ${thin}/>
<path d="M44 78 L42 90 M56 78 L58 90 M38 90 L46 90 M54 90 L62 90" stroke="#E8781A" stroke-width="3" stroke-linecap="round"/>`,

  dog: `
<circle cx="50" cy="52" r="28" fill="#E0B07A" ${st}/>
<path d="M26 30 C14 34 12 56 18 66 C26 64 30 50 30 38 Z" fill="#9C6B3E" ${st}/>
<path d="M74 30 C86 34 88 56 82 66 C74 64 70 50 70 38 Z" fill="#9C6B3E" ${st}/>
<ellipse cx="50" cy="66" rx="14" ry="10" fill="#F4DCC0" ${thin}/>
<ellipse cx="50" cy="60" rx="6" ry="4.4" fill="${O}"/>
<path d="M50 64 L50 70 Q44 74 40 70 M50 70 Q56 74 60 70" fill="none" ${thin}/>
<circle cx="39" cy="46" r="3.8" fill="${O}"/><circle cx="61" cy="46" r="3.8" fill="${O}"/>`,

  drum: `
<path d="M16 38 L16 72 C16 84 84 84 84 72 L84 38 Z" fill="#E8505B" ${st}/>
<ellipse cx="50" cy="38" rx="34" ry="11" fill="#F6E7CF" ${st}/>
<path d="M16 46 L30 76 L44 48 L58 78 L72 48 L84 70" fill="none" stroke="#F6D24A" stroke-width="3" stroke-linejoin="round"/>
<path d="M30 30 L8 8 M70 30 L92 8" stroke="#A0663A" stroke-width="5" stroke-linecap="round"/>
<circle cx="8" cy="8" r="5" fill="#F6E7CF" ${thin}/><circle cx="92" cy="8" r="5" fill="#F6E7CF" ${thin}/>`,

  boat: `
<path d="M10 66 L90 66 L78 86 L22 86 Z" fill="#E8781A" ${st}/>
<path d="M50 66 L50 10" ${st}/>
<path d="M50 14 L82 58 L50 58 Z" fill="#FFFFFF" ${st}/>
<path d="M48 22 L24 58 L48 58 Z" fill="#DDE7F0" ${st}/>
<path d="M50 10 L64 16 L50 20" fill="#E8505B" ${thin}/>
<path d="M4 92 Q14 88 24 92 Q34 96 44 92 Q54 88 64 92 Q74 96 84 92 Q92 88 96 92" fill="none" stroke="#4A9BE0" stroke-width="2.6" stroke-linecap="round"/>`,

  bed: `
<rect x="8" y="26" width="14" height="60" rx="3" fill="#A0663A" ${st}/>
<rect x="78" y="48" width="14" height="38" rx="3" fill="#A0663A" ${st}/>
<rect x="18" y="56" width="66" height="16" rx="3" fill="#FFFFFF" ${st}/>
<rect x="24" y="44" width="20" height="14" rx="6" fill="#FFFFFF" ${st}/>
<path d="M44 56 C44 46 84 46 84 56 L84 72 L44 72 Z" fill="#6CB4F2" ${st}/>`,

  shoe: `
<path d="M12 72 L14 50 C22 52 30 50 36 44 L46 36 C52 44 58 50 66 54 C78 58 88 62 90 70 L90 72 Z" fill="#6CB4F2" ${st}/>
<path d="M8 72 L92 72 C94 72 94 84 90 84 L12 84 C8 84 6 72 8 72 Z" fill="#FFFFFF" ${st}/>
<path d="M40 44 L48 50 M46 40 L54 46 M52 47 L60 53" stroke="#FFFFFF" stroke-width="3.4" stroke-linecap="round"/>
<path d="M14 58 C20 60 26 58 30 54" fill="none" ${thin}/>
<path d="M22 72 L22 84 M78 72 L78 84" stroke="#BFD9EE" stroke-width="2.4"/>`,

  shrimp: `
<path d="M76 30 C90 40 90 64 76 74 C66 82 46 82 34 74 L26 66 L30 58 C40 64 56 66 64 60 C72 54 70 42 62 38 Z" fill="#F28C5A" ${st}/>
<path d="M34 74 L16 84 L22 68 L12 58 L28 62" fill="#F28C5A" ${st}/>
<path d="M54 64 L50 76 M66 58 L68 72 M74 48 L82 54" ${thin}/>
<circle cx="70" cy="36" r="3" fill="${O}"/>
<path d="M74 30 Q60 14 40 12 M78 32 Q72 12 56 6" fill="none" ${thin}/>`,

  ball: `
<circle cx="50" cy="50" r="38" fill="#FFFFFF" ${st}/>
<path d="M50 12 C34 26 34 74 50 88 C66 74 66 26 50 12 Z" fill="#E8505B" ${thin}/>
<path d="M14 40 C36 48 64 48 86 40 L88 52 C64 60 36 60 12 52 Z" fill="#4A9BE0" ${thin}/>
<circle cx="50" cy="50" r="38" fill="none" ${st}/>`,

  fire: `
<path d="M50 6 C56 22 74 30 76 54 C78 76 64 90 50 90 C36 90 22 78 24 58 C26 44 34 38 36 26 C42 34 44 40 44 46 C48 34 50 20 50 6 Z" fill="#E8505B" ${st}/>
<path d="M50 44 C54 54 64 60 62 72 C60 82 54 86 50 86 C44 86 38 80 40 70 C42 62 48 58 50 44 Z" fill="#F6D24A" ${thin}/>`,

  door: `
<rect x="24" y="8" width="52" height="84" rx="3" fill="#C98A4B" ${st}/>
<rect x="32" y="16" width="36" height="28" rx="2" fill="none" ${thin}/>
<rect x="32" y="52" width="36" height="32" rx="2" fill="none" ${thin}/>
<circle cx="66" cy="50" r="4" fill="#F6D24A" ${thin}/>
<path d="M14 92 L86 92" ${st}/>`,

  egg: `
<path d="M50 8 C70 8 84 40 84 60 C84 80 70 92 50 92 C30 92 16 80 16 60 C16 40 30 8 50 8 Z" fill="#FBF3E2" ${st}/>
<path d="M34 34 Q38 24 46 22" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>`,

  car: `
<path d="M8 64 L8 52 C8 46 12 44 18 42 L28 26 C30 22 34 20 40 20 L64 20 C70 20 74 22 76 26 L84 42 C90 44 92 48 92 54 L92 64 Z" fill="#E8505B" ${st}/>
<path d="M32 40 L38 28 L50 28 L50 40 Z M56 40 L56 28 L66 28 L74 40 Z" fill="#DDF0FB" ${thin}/>
<circle cx="28" cy="66" r="11" fill="${O}"/><circle cx="72" cy="66" r="11" fill="${O}"/>
<circle cx="28" cy="66" r="4" fill="#DDE7F0"/><circle cx="72" cy="66" r="4" fill="#DDE7F0"/>
<path d="M84 50 L90 50" stroke="#F6D24A" stroke-width="4" stroke-linecap="round"/>`,

  fork: `
<path d="M34 6 L34 30 M44 6 L44 30 M56 6 L56 30 M66 6 L66 30" ${st}/>
<path d="M30 28 L70 28 C70 42 60 48 54 48 L54 88 C54 94 46 94 46 88 L46 48 C40 48 30 42 30 28 Z" fill="#C9D3DD" ${st}/>`,

  cup: `
<path d="M18 26 L70 26 L66 82 C66 88 22 88 22 82 Z" fill="#6CB4F2" ${st}/>
<path d="M68 38 C88 36 90 64 66 66" fill="none" stroke="${O}" stroke-width="${SW}" stroke-linecap="round"/>
<path d="M69 42 C82 42 82 60 67 61" fill="none" stroke="#6CB4F2" stroke-width="4" stroke-linecap="round"/>
<path d="M30 40 L30 70" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>`,

  apple: `
<path d="M50 30 C36 18 12 24 14 52 C16 76 34 92 50 84 C66 92 84 76 86 52 C88 24 64 18 50 30 Z" fill="#E8505B" ${st}/>
<path d="M50 30 C50 20 52 14 58 8" fill="none" stroke="#A0663A" stroke-width="4" stroke-linecap="round"/>
<path d="M54 22 C62 10 76 12 80 16 C72 26 62 26 54 22 Z" fill="#5DB85F" ${thin}/>
<path d="M28 44 Q30 36 38 34" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>`,

  banana: `
<path d="M18 26 C14 56 36 86 74 82 C84 80 88 74 84 70 C56 74 36 56 30 26 C28 18 20 18 18 26 Z" fill="#F6D24A" ${st}/>
<path d="M22 22 L20 12 L28 14 Z" fill="#7A5A2E" ${thin}/>
<path d="M28 36 C34 58 52 70 76 74" fill="none" stroke="#E2B52C" stroke-width="3" stroke-linecap="round"/>`,

  watermelon: `
<path d="M6 34 C6 72 94 72 94 34 Z" fill="#5DB85F" ${st}/>
<path d="M13 34 C14 64 86 64 87 34 Z" fill="#FFFFFF" ${thin}/>
<path d="M18 34 C20 58 80 58 82 34 Z" fill="#F0606E" ${thin}/>
<path d="M34 40 l2 6 M48 44 l0 6 M62 40 l-2 6 M42 38 l1 4 M56 38 l-1 4" stroke="${O}" stroke-width="3.4" stroke-linecap="round"/>`,

  sun: `
<circle cx="50" cy="50" r="22" fill="#F6C343" ${st}/>
<path d="M50 6 L50 18 M50 82 L50 94 M6 50 L18 50 M82 50 L94 50 M19 19 L27 27 M73 73 L81 81 M81 19 L73 27 M27 73 L19 81" stroke="#E8781A" stroke-width="5" stroke-linecap="round"/>
<circle cx="42" cy="46" r="2.8" fill="${O}"/><circle cx="58" cy="46" r="2.8" fill="${O}"/>
<path d="M42 56 Q50 62 58 56" fill="none" ${thin}/>`,

  moon: `
<path d="M62 8 C36 12 22 34 24 56 C26 78 46 94 70 90 C52 84 40 68 40 50 C40 32 48 16 62 8 Z" fill="#F6D24A" ${st}/>
<circle cx="80" cy="22" r="3" fill="#F6D24A" ${thin}/><circle cx="84" cy="50" r="2.4" fill="#F6D24A" ${thin}/>`,

  butterfly: `
<path d="M48 44 C36 18 10 14 10 34 C10 50 30 54 48 50 Z" fill="#F28CA6" ${st}/>
<path d="M52 44 C64 18 90 14 90 34 C90 50 70 54 52 50 Z" fill="#F28CA6" ${st}/>
<path d="M48 52 C30 54 18 66 24 78 C30 88 44 76 48 60 Z" fill="#B48EE0" ${st}/>
<path d="M52 52 C70 54 82 66 76 78 C70 88 56 76 52 60 Z" fill="#B48EE0" ${st}/>
<ellipse cx="50" cy="54" rx="5" ry="22" fill="${O}"/>
<path d="M48 34 Q42 20 36 16 M52 34 Q58 20 64 16" fill="none" ${thin}/>
<circle cx="26" cy="32" r="5" fill="#FFFFFF"/><circle cx="74" cy="32" r="5" fill="#FFFFFF"/>`,

  chair: `
<rect x="26" y="8" width="44" height="40" rx="4" fill="#C98A4B" ${st}/>
<rect x="20" y="48" width="60" height="12" rx="3" fill="#A0663A" ${st}/>
<path d="M26 60 L24 92 M74 60 L76 92 M34 60 L36 84 M66 60 L64 84" ${st}/>
<path d="M36 18 L60 18 M36 28 L60 28 M36 38 L60 38" stroke="#A0663A" stroke-width="2.6" stroke-linecap="round"/>`,

  balloon: `
<path d="M50 6 C28 6 18 24 20 40 C22 58 38 70 50 72 C62 70 78 58 80 40 C82 24 72 6 50 6 Z" fill="#E8505B" ${st}/>
<path d="M44 72 L56 72 L50 80 Z" fill="#E8505B" ${thin}/>
<path d="M50 80 C42 86 58 90 50 96" fill="none" ${thin}/>
<path d="M32 26 Q36 16 46 14" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>`,

  clock: `
<circle cx="50" cy="52" r="38" fill="#FFFFFF" ${st}/>
<circle cx="50" cy="52" r="32" fill="none" stroke="#6CB4F2" stroke-width="3"/>
<path d="M50 24 L50 30 M50 74 L50 80 M22 52 L28 52 M72 52 L78 52" stroke="${O}" stroke-width="3.4" stroke-linecap="round"/>
<path d="M50 52 L50 34 M50 52 L64 60" stroke="${O}" stroke-width="4.2" stroke-linecap="round"/>
<circle cx="50" cy="52" r="3.6" fill="${O}"/>
<path d="M24 16 L16 24 M76 16 L84 24" stroke="${O}" stroke-width="5" stroke-linecap="round"/>`,

  glasses: `
<circle cx="28" cy="52" r="18" fill="#DDF0FB" ${st}/><circle cx="72" cy="52" r="18" fill="#DDF0FB" ${st}/>
<path d="M46 50 Q50 44 54 50" fill="none" ${st}/>
<path d="M10 48 L2 38 M90 48 L98 38" ${st}/>
<path d="M20 44 Q24 40 30 40 M64 44 Q68 40 74 40" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>`,

  toothbrush: `
<path d="M8 70 L60 70" stroke="${O}" stroke-width="14" stroke-linecap="round"/>
<path d="M8 70 L60 70" stroke="#4A9BE0" stroke-width="8.4" stroke-linecap="round"/>
<rect x="58" y="62" width="34" height="14" rx="4" fill="#4A9BE0" ${st}/>
<rect x="62" y="40" width="28" height="22" rx="2" fill="#FFFFFF" ${st}/>
<path d="M69 42 L69 60 M76 42 L76 60 M83 42 L83 60" stroke="#BFD9EE" stroke-width="3" stroke-linecap="round"/>
<path d="M58 36 C62 26 70 34 74 28 C78 22 86 30 92 24" fill="none" stroke="#5DB85F" stroke-width="6" stroke-linecap="round"/>
<path d="M58 36 C62 26 70 34 74 28 C78 22 86 30 92 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/>`,

  rabbit: `
<path d="M36 40 C28 26 28 6 36 4 C44 4 46 24 44 40 Z" fill="#FFFFFF" ${st}/>
<path d="M64 40 C72 26 72 6 64 4 C56 4 54 24 56 40 Z" fill="#FFFFFF" ${st}/>
<path d="M37 34 C34 24 34 14 37 10 M63 34 C66 24 66 14 63 10" stroke="#F6B3C0" stroke-width="4" stroke-linecap="round"/>
<ellipse cx="50" cy="62" rx="28" ry="26" fill="#FFFFFF" ${st}/>
<circle cx="40" cy="58" r="3.6" fill="${O}"/><circle cx="60" cy="58" r="3.6" fill="${O}"/>
<path d="M46 66 L54 66 L50 70 Z" fill="#E86F7E" ${thin}/>
<path d="M50 70 Q46 76 42 74 M50 70 Q54 76 58 74" fill="none" ${thin}/>
<circle cx="32" cy="68" r="4" fill="#F6B3C0"/><circle cx="68" cy="68" r="4" fill="#F6B3C0"/>`,

  // 2026-10-09 第 3、4 關補的：羊／糖、火／鎖只差一個符號，椰子／葉子只差聲調
  sheep: `
<path d="M38 72 L38 90 M52 74 L52 90 M68 74 L68 90 M80 70 L80 88" stroke="${O}" stroke-width="5.5" stroke-linecap="round"/>
<path d="M36 42 C34 30 48 24 56 32 C60 22 76 22 80 32 C90 30 98 42 92 50 C98 58 92 72 82 70 C78 80 62 82 56 76 C48 82 34 80 34 70 C26 66 26 50 36 42 Z" fill="#FFFFFF" ${st}/>
<ellipse cx="13" cy="44" rx="8" ry="4.5" fill="#6B5B53" ${st} transform="rotate(-20 13 44)"/>
<ellipse cx="27" cy="52" rx="13" ry="17" fill="#6B5B53" ${st}/>
<path d="M17 38 C15 30 24 26 28 32 C32 26 41 30 37 38" fill="#FFFFFF" ${st}/>
<circle cx="22" cy="50" r="2.8" fill="#FFFFFF"/><circle cx="32" cy="50" r="2.8" fill="#FFFFFF"/>`,

  lock: `
<path d="M30 46 L30 32 C30 6 70 6 70 32 L70 46" fill="none" stroke="${O}" stroke-width="13" stroke-linecap="round"/>
<path d="M30 46 L30 32 C30 6 70 6 70 32 L70 46" fill="none" stroke="#C9CED4" stroke-width="6.6" stroke-linecap="round"/>
<rect x="16" y="42" width="68" height="48" rx="8" fill="#F6C443" ${st}/>
<circle cx="50" cy="61" r="6.5" fill="${O}"/><path d="M50 62 L50 77" stroke="${O}" stroke-width="5.5" stroke-linecap="round"/>`,

  coconut: `
<circle cx="64" cy="40" r="27" fill="#8B5A3C" ${st}/>
<circle cx="57" cy="30" r="3.4" fill="${O}"/><circle cx="68" cy="28" r="3.4" fill="${O}"/><circle cx="63" cy="38" r="3.4" fill="${O}"/>
<path d="M6 62 C6 96 70 96 70 62 Z" fill="#8B5A3C" ${st}/>
<path d="M18 76 L24 72 M34 84 L40 80 M52 78 L58 74" stroke="#5E3A24" stroke-width="2.6" stroke-linecap="round"/>
<ellipse cx="38" cy="62" rx="32" ry="10" fill="#FFFFFF" ${st}/>
<ellipse cx="38" cy="62" rx="22" ry="5.6" fill="#F1ECE3" stroke="#D2C6B6" stroke-width="2"/>`,

  leaf: `
<path d="M20 82 C12 46 40 14 88 10 C92 56 62 88 20 82 Z" fill="#5DB85F" ${st}/>
<path d="M8 94 L22 80 C42 60 60 40 78 22" fill="none" ${st}/>
<path d="M36 64 L32 46 M48 52 L46 34 M60 40 L60 24 M36 64 L54 68 M48 52 L66 56 M60 40 L76 42" fill="none" stroke="#2F7D3A" stroke-width="2.6" stroke-linecap="round"/>`,
};

/** 畫一個小圖：中心在 (x, y)，邊長 s（公釐） */
export function iconSvg(name: string, x: number, y: number, s: number): string {
  const body = ICONS[name];
  if (!body) throw new Error(`沒有「${name}」這個圖`);
  const k = s / 100;
  return `<g transform="translate(${(x - s / 2).toFixed(2)} ${(y - s / 2).toFixed(2)}) scale(${k.toFixed(4)})">${body}</g>`;
}
