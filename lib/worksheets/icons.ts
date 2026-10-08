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

  /* ---------- 連連看（2026-10-09）：誰吃什麼、長大變成什麼 ---------- */
  panda: `
<circle cx="22" cy="26" r="12" fill="${O}"/><circle cx="78" cy="26" r="12" fill="${O}"/>
<ellipse cx="50" cy="56" rx="37" ry="33" fill="#FFFFFF" ${st}/>
<ellipse cx="34" cy="54" rx="9" ry="13" fill="${O}" transform="rotate(-28 34 54)"/><ellipse cx="66" cy="54" rx="9" ry="13" fill="${O}" transform="rotate(28 66 54)"/>
<circle cx="36" cy="52" r="3.2" fill="#FFFFFF"/><circle cx="64" cy="52" r="3.2" fill="#FFFFFF"/>
<ellipse cx="50" cy="68" rx="6.5" ry="4.5" fill="${O}"/>
<path d="M50 72 Q46 79 41 76 M50 72 Q54 79 59 76" fill="none" ${thin}/>`,

  koala: `
<circle cx="20" cy="38" r="17" fill="#A9B1BA" ${st}/><circle cx="80" cy="38" r="17" fill="#A9B1BA" ${st}/>
<circle cx="20" cy="38" r="9" fill="#F3DDE2"/><circle cx="80" cy="38" r="9" fill="#F3DDE2"/>
<ellipse cx="50" cy="58" rx="30" ry="29" fill="#A9B1BA" ${st}/>
<circle cx="37" cy="51" r="3.8" fill="${O}"/><circle cx="63" cy="51" r="3.8" fill="${O}"/>
<path d="M42 56 C42 50 58 50 58 56 L58 70 C58 78 42 78 42 70 Z" fill="${O}"/>
<ellipse cx="50" cy="82" rx="12" ry="3" fill="#8D96A0"/>`,

  eucalyptus: `
<path d="M48 96 C50 72 50 44 54 8" fill="none" stroke="#8B5A3C" stroke-width="4" stroke-linecap="round"/>
<path d="M50 70 C38 74 22 72 10 62 C24 56 40 60 50 70 Z" fill="#8FBFA9" ${st}/>
<path d="M50 56 C62 60 78 58 90 48 C76 42 60 46 50 56 Z" fill="#8FBFA9" ${st}/>
<path d="M51 40 C40 42 26 38 16 28 C30 22 44 28 51 40 Z" fill="#8FBFA9" ${st}/>
<path d="M52 26 C62 26 74 20 82 10 C68 6 56 14 52 26 Z" fill="#8FBFA9" ${st}/>
<path d="M50 70 C38 70 24 66 14 62 M50 56 C62 56 76 52 86 48 M51 40 C40 38 28 34 20 29 M52 26 C62 24 72 18 79 12" fill="none" stroke="#5E8E78" stroke-width="2" stroke-linecap="round"/>`,

  grass: `
<path d="M10 88 L90 88" ${st}/>
<path d="M16 88 C16 70 10 56 4 46 C18 52 26 68 27 88 Z" fill="#5DB85F" ${st}/>
<path d="M30 88 C30 62 34 40 42 22 C44 44 42 66 42 88 Z" fill="#4FA352" ${st}/>
<path d="M44 88 C46 66 54 50 66 40 C60 58 56 74 56 88 Z" fill="#5DB85F" ${st}/>
<path d="M58 88 C60 64 66 46 74 30 C76 52 72 70 70 88 Z" fill="#4FA352" ${st}/>
<path d="M70 88 C74 72 84 62 96 56 C88 68 84 78 82 88 Z" fill="#5DB85F" ${st}/>`,

  anteater: `
<path d="M66 50 C70 24 96 22 98 44 C99 58 88 66 74 64 Z" fill="#5E5246" ${st}/>
<path d="M72 46 C76 34 86 32 92 40" fill="none" stroke="#857565" stroke-width="2.4" stroke-linecap="round"/>
<path d="M40 66 L38 86 M64 66 L66 86" stroke="${O}" stroke-width="9" stroke-linecap="round"/>
<path d="M40 66 L38 86 M64 66 L66 86" stroke="#A8998A" stroke-width="5" stroke-linecap="round"/>
<path d="M26 56 C30 42 56 38 70 46 C80 52 78 68 68 72 L36 72 C26 72 22 64 26 56 Z" fill="#A8998A" ${st}/>
<path d="M30 50 C22 50 10 58 2 66 C4 70 8 70 12 68 C18 66 26 64 32 64 Z" fill="#A8998A" ${st}/>
<path d="M36 46 C44 52 52 62 56 72" fill="none" stroke="${O}" stroke-width="7"/>
<path d="M42 44 C50 50 57 60 61 70" fill="none" stroke="#FFFFFF" stroke-width="3.4"/>
<circle cx="31" cy="48" r="4" fill="#A8998A" ${st}/>
<circle cx="24" cy="56" r="2.4" fill="${O}"/>
<path d="M2 66 Q-1 72 3 76" fill="none" stroke="#E86F7E" stroke-width="2.6" stroke-linecap="round"/>`,

  ant: `
<path d="M44 58 L32 76 M50 60 L50 82 M56 58 L68 76 M44 54 L30 40 M56 54 L68 40" fill="none" stroke="${O}" stroke-width="3.4" stroke-linecap="round"/>
<path d="M22 44 Q16 30 8 26 M28 42 Q30 28 24 18" fill="none" stroke="${O}" stroke-width="3" stroke-linecap="round"/>
<ellipse cx="74" cy="58" rx="18" ry="14" fill="#B8452F" ${st}/>
<ellipse cx="50" cy="56" rx="9" ry="8" fill="#B8452F" ${st}/>
<circle cx="26" cy="52" r="12" fill="#B8452F" ${st}/>
<circle cx="22" cy="49" r="2.6" fill="#FFFFFF"/>`,

  bee: `
<ellipse cx="40" cy="28" rx="11" ry="18" fill="#DCEBF7" ${st} transform="rotate(-22 40 28)"/>
<ellipse cx="60" cy="28" rx="11" ry="18" fill="#DCEBF7" ${st} transform="rotate(22 60 28)"/>
<path d="M80 60 L94 60 L80 66 Z" fill="${O}"/>
<ellipse cx="52" cy="60" rx="30" ry="21" fill="#F6C443" ${st}/>
<path d="M50 40 C46 52 46 68 50 80 M64 42 C61 52 61 68 64 78" fill="none" stroke="${O}" stroke-width="7"/>
<circle cx="28" cy="56" r="3.4" fill="${O}"/>
<path d="M26 44 Q20 32 12 30 M32 42 Q30 30 24 24" fill="none" stroke="${O}" stroke-width="2.8" stroke-linecap="round"/>`,

  seagull: `
<path d="M6 90 Q16 84 26 90 T46 90 T66 90 T86 90 T96 90" fill="none" stroke="#4A9BE0" stroke-width="3.6" stroke-linecap="round"/>
<path d="M48 50 C38 30 22 22 4 28 C18 32 30 42 40 58 Z" fill="#D5DAE0" ${st}/>
<path d="M52 50 C62 30 78 22 96 28 C82 32 70 42 60 58 Z" fill="#D5DAE0" ${st}/>
<path d="M4 28 C10 25 16 24 22 24 L18 32 C14 30 9 29 4 28 Z" fill="${O}"/><path d="M96 28 C90 25 84 24 78 24 L82 32 C86 30 91 29 96 28 Z" fill="${O}"/>
<ellipse cx="50" cy="62" rx="14" ry="12" fill="#FFFFFF" ${st}/>
<circle cx="50" cy="46" r="10" fill="#FFFFFF" ${st}/>
<path d="M46 50 L54 50 L50 58 Z" fill="#F6C443" ${thin}/>
<circle cx="45.5" cy="44" r="2.2" fill="${O}"/><circle cx="54.5" cy="44" r="2.2" fill="${O}"/>`,

  owl: `
<path d="M22 32 L28 10 L42 26 L58 26 L72 10 L78 32 C90 52 84 88 50 90 C16 88 10 52 22 32 Z" fill="#B07B4F" ${st}/>
<ellipse cx="50" cy="72" rx="19" ry="14" fill="#EAD6BC"/>
<path d="M42 68 L45 72 L48 68 M52 68 L55 72 L58 68 M46 78 L49 82 L52 78" fill="none" stroke="#B07B4F" stroke-width="2.2" stroke-linecap="round"/>
<circle cx="37" cy="42" r="12" fill="#FFFFFF" ${st}/><circle cx="63" cy="42" r="12" fill="#FFFFFF" ${st}/>
<circle cx="38" cy="43" r="5.4" fill="${O}"/><circle cx="62" cy="43" r="5.4" fill="${O}"/>
<path d="M45 52 L55 52 L50 62 Z" fill="#F6C443" ${st}/>`,

  mouse: `
<path d="M80 68 C94 68 98 54 88 46" fill="none" stroke="${O}" stroke-width="3.4" stroke-linecap="round"/>
<path d="M16 64 C18 44 44 34 64 40 C80 46 86 62 80 72 L26 74 C18 74 16 70 16 64 Z" fill="#A9B1BA" ${st}/>
<circle cx="40" cy="36" r="12" fill="#A9B1BA" ${st}/><circle cx="40" cy="36" r="6" fill="#F6B3C0"/>
<circle cx="28" cy="52" r="3" fill="${O}"/>
<circle cx="15" cy="62" r="3.6" fill="#E86F7E" ${thin}/>
<path d="M22 64 L8 68 M22 66 L10 74" fill="none" ${thin}/>`,

  frog: `
<ellipse cx="50" cy="62" rx="38" ry="26" fill="#5DB85F" ${st}/>
<circle cx="29" cy="36" r="14" fill="#5DB85F" ${st}/><circle cx="71" cy="36" r="14" fill="#5DB85F" ${st}/>
<circle cx="29" cy="35" r="8" fill="#FFFFFF"/><circle cx="71" cy="35" r="8" fill="#FFFFFF"/>
<circle cx="30" cy="36" r="4" fill="${O}"/><circle cx="70" cy="36" r="4" fill="${O}"/>
<path d="M26 64 Q50 80 74 64" fill="none" ${st}/>
<circle cx="22" cy="60" r="4" fill="#F6B3C0"/><circle cx="78" cy="60" r="4" fill="#F6B3C0"/>`,

  fly: `
<ellipse cx="32" cy="46" rx="22" ry="12" fill="#E9EEF3" ${st} transform="rotate(30 32 46)"/>
<ellipse cx="68" cy="46" rx="22" ry="12" fill="#E9EEF3" ${st} transform="rotate(-30 68 46)"/>
<path d="M42 62 L28 74 M42 70 L30 86 M58 62 L72 74 M58 70 L70 86" fill="none" stroke="${O}" stroke-width="3" stroke-linecap="round"/>
<ellipse cx="50" cy="64" rx="13" ry="20" fill="#3E4348"/>
<circle cx="50" cy="36" r="11" fill="#3E4348"/>
<circle cx="41" cy="34" r="6" fill="#C8443E" ${thin}/><circle cx="59" cy="34" r="6" fill="#C8443E" ${thin}/>`,

  caterpillar: `
<circle cx="84" cy="62" r="11" fill="#8CCB5E" ${st}/>
<circle cx="68" cy="56" r="12" fill="#8CCB5E" ${st}/>
<circle cx="52" cy="60" r="12" fill="#8CCB5E" ${st}/>
<circle cx="36" cy="56" r="12" fill="#8CCB5E" ${st}/>
<path d="M18 30 Q16 20 10 18 M26 30 Q30 20 36 18" fill="none" stroke="${O}" stroke-width="2.8" stroke-linecap="round"/>
<circle cx="20" cy="46" r="15" fill="#A6D86F" ${st}/>
<circle cx="15" cy="44" r="2.8" fill="${O}"/><circle cx="25" cy="44" r="2.8" fill="${O}"/>
<path d="M15 52 Q20 56 25 52" fill="none" ${thin}/>
<path d="M36 68 L36 76 M52 72 L52 80 M68 68 L68 76 M84 73 L84 80" stroke="${O}" stroke-width="3.4" stroke-linecap="round"/>`,

  tadpole: `
<path d="M50 54 C66 44 80 62 96 46 C88 68 70 66 52 66 Z" fill="#5E6B78" ${st}/>
<ellipse cx="34" cy="56" rx="24" ry="20" fill="#5E6B78" ${st}/>
<circle cx="26" cy="50" r="5" fill="#FFFFFF"/><circle cx="25" cy="50" r="2.4" fill="${O}"/>
<path d="M18 64 Q24 68 30 64" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/>
<circle cx="70" cy="24" r="4" fill="none" stroke="#4A9BE0" stroke-width="2.4"/><circle cx="82" cy="14" r="3" fill="none" stroke="#4A9BE0" stroke-width="2.2"/>`,

  chick: `
<path d="M42 82 L38 92 M58 82 L62 92" stroke="#F28C28" stroke-width="4" stroke-linecap="round"/>
<ellipse cx="50" cy="62" rx="30" ry="24" fill="#F6D24A" ${st}/>
<circle cx="50" cy="36" r="18" fill="#F6D24A" ${st}/>
<path d="M46 18 Q50 8 54 18" fill="#F6D24A" ${thin}/>
<circle cx="43" cy="34" r="3" fill="${O}"/><circle cx="57" cy="34" r="3" fill="${O}"/>
<path d="M45 41 L55 41 L50 48 Z" fill="#F28C28" ${thin}/>
<path d="M70 58 C78 56 82 64 76 70" fill="none" ${thin}/>`,

  hen: `
<path d="M44 82 L42 94 M60 82 L62 94" stroke="#F28C28" stroke-width="4" stroke-linecap="round"/>
<path d="M80 30 C92 30 96 48 88 56" fill="#C8443E" ${st}/>
<path d="M28 44 C30 30 46 30 50 42 C56 52 74 46 84 40 C90 60 80 84 54 84 C32 84 20 66 28 44 Z" fill="#FFFFFF" ${st}/>
<path d="M50 62 C58 56 70 58 74 66 C66 72 56 70 50 62 Z" fill="#E9E3DA" ${thin}/>
<path d="M30 30 Q32 18 38 24 Q42 14 46 26 Q50 22 48 34" fill="#E8505B" ${thin}/>
<path d="M24 44 L12 48 L24 52 Z" fill="#F6C443" ${thin}/>
<path d="M26 54 C24 62 30 64 32 58" fill="#E8505B" ${thin}/>
<circle cx="34" cy="42" r="3" fill="${O}"/>`,

  wriggler: `
<rect x="6" y="14" width="88" height="78" rx="8" fill="#DCEBF7" ${st}/>
<path d="M6 30 Q17 25 28 30 T50 30 T72 30 T94 30" fill="none" stroke="#4A9BE0" stroke-width="3" stroke-linecap="round"/>
<path d="M32 30 L34 44 Q36 56 30 66 Q26 74 30 78" fill="none" stroke="${O}" stroke-width="4" stroke-linecap="round"/>
<ellipse cx="31" cy="81" rx="6" ry="5" fill="${O}"/>
<path d="M68 30 L66 44 Q64 56 70 66 Q74 74 70 78" fill="none" stroke="${O}" stroke-width="4" stroke-linecap="round"/>
<ellipse cx="69" cy="81" rx="6" ry="5" fill="${O}"/>
<path d="M30 50 L24 48 M36 50 L40 48 M30 62 L24 62 M34 62 L38 64 M66 50 L60 48 M70 50 L76 48 M68 62 L62 64 M72 62 L78 62" stroke="${O}" stroke-width="1.8" stroke-linecap="round"/>`,

  mosquito: `
<ellipse cx="36" cy="34" rx="18" ry="8" fill="#E9EEF3" ${st} transform="rotate(-24 36 34)"/>
<ellipse cx="62" cy="30" rx="18" ry="8" fill="#E9EEF3" ${st} transform="rotate(14 62 30)"/>
<path d="M46 50 L30 70 L24 90 M50 52 L48 74 L52 94 M54 50 L70 70 L80 88 M44 46 L22 52 L10 64 M56 46 L76 50 L90 60" fill="none" stroke="${O}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M50 48 C64 52 80 62 88 74" fill="none" stroke="${O}" stroke-width="9" stroke-linecap="round"/>
<path d="M56 52 L58 56 M64 56 L66 60 M72 61 L74 65 M80 67 L82 71" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round"/>
<circle cx="44" cy="44" r="8" fill="${O}"/>
<path d="M38 40 L18 22" stroke="${O}" stroke-width="2.4" stroke-linecap="round"/>`,

  silkworm: `
<path d="M8 82 C20 60 52 56 92 66 C70 86 34 94 8 82 Z" fill="#7FBF5A" ${st}/>
<path d="M14 80 C40 70 66 68 88 68" fill="none" stroke="#4E8F3A" stroke-width="2.2" stroke-linecap="round"/>
<circle cx="80" cy="48" r="10" fill="#FBFAF6" ${st}/>
<circle cx="66" cy="44" r="12" fill="#FBFAF6" ${st}/>
<circle cx="50" cy="42" r="12" fill="#FBFAF6" ${st}/>
<circle cx="34" cy="42" r="12" fill="#FBFAF6" ${st}/>
<circle cx="18" cy="40" r="11" fill="#E9E3DA" ${st}/>
<circle cx="14" cy="38" r="2.4" fill="${O}"/>
<path d="M44 38 Q50 34 56 38" fill="none" stroke="#B9B2A6" stroke-width="2.4" stroke-linecap="round"/>
<path d="M32 54 L32 58 M48 54 L48 58 M64 56 L64 60" stroke="${O}" stroke-width="3" stroke-linecap="round"/>`,

  silkmoth: `
<path d="M50 40 C34 20 10 22 8 40 C6 56 28 62 48 54 Z" fill="#FBFAF6" ${st}/>
<path d="M50 40 C66 20 90 22 92 40 C94 56 72 62 52 54 Z" fill="#FBFAF6" ${st}/>
<path d="M48 54 C34 60 20 72 26 82 C34 88 46 74 50 62 Z" fill="#F1ECE3" ${st}/>
<path d="M52 54 C66 60 80 72 74 82 C66 88 54 74 50 62 Z" fill="#F1ECE3" ${st}/>
<path d="M20 38 Q30 36 40 42 M80 38 Q70 36 60 42" fill="none" stroke="#C9C1B3" stroke-width="2.4" stroke-linecap="round"/>
<ellipse cx="50" cy="56" rx="7" ry="20" fill="#FBFAF6" ${st}/>
<circle cx="50" cy="34" r="7" fill="#FBFAF6" ${st}/>
<path d="M47 28 C42 18 34 12 28 12 M53 28 C58 18 66 12 72 12" fill="none" stroke="${O}" stroke-width="2.6" stroke-linecap="round"/>
<path d="M40 20 L36 24 M36 16 L32 20 M60 20 L64 24 M64 16 L68 20" stroke="${O}" stroke-width="1.8" stroke-linecap="round"/>`,

  nymph: `
<rect x="6" y="14" width="88" height="78" rx="8" fill="#DCEBF7" ${st}/>
<path d="M34 50 L18 40 M34 58 L16 62 M38 64 L24 78 M66 50 L82 40 M66 58 L84 62 M62 64 L76 78" fill="none" stroke="${O}" stroke-width="3" stroke-linecap="round"/>
<path d="M50 44 C62 44 64 70 58 82 C55 88 45 88 42 82 C36 70 38 44 50 44 Z" fill="#8C7A4E" ${st}/>
<path d="M44 66 L56 66 M43 74 L57 74" stroke="#6B5B38" stroke-width="2.2" stroke-linecap="round"/>
<path d="M36 40 C36 28 64 28 64 40 C64 48 36 48 36 40 Z" fill="#8C7A4E" ${st}/>
<circle cx="40" cy="36" r="5" fill="#5E6B78" ${thin}/><circle cx="60" cy="36" r="5" fill="#5E6B78" ${thin}/>`,

  dragonfly: `
<ellipse cx="30" cy="34" rx="24" ry="8" fill="#DCEBF7" ${st} transform="rotate(-12 30 34)"/>
<ellipse cx="70" cy="34" rx="24" ry="8" fill="#DCEBF7" ${st} transform="rotate(12 70 34)"/>
<ellipse cx="32" cy="50" rx="22" ry="7" fill="#DCEBF7" ${st} transform="rotate(10 32 50)"/>
<ellipse cx="68" cy="50" rx="22" ry="7" fill="#DCEBF7" ${st} transform="rotate(-10 68 50)"/>
<path d="M50 44 L50 92" stroke="${O}" stroke-width="10" stroke-linecap="round"/>
<path d="M50 44 L50 92" stroke="#E8505B" stroke-width="5.4" stroke-linecap="round"/>
<ellipse cx="50" cy="40" rx="7" ry="10" fill="#E8505B" ${st}/>
<circle cx="42" cy="22" r="8" fill="#4A9BE0" ${st}/><circle cx="58" cy="22" r="8" fill="#4A9BE0" ${st}/>`,

  seed: `
<g transform="rotate(-24 36 52)"><path d="M36 14 C54 30 56 66 36 90 C16 66 18 30 36 14 Z" fill="${O}" ${st}/>
<path d="M36 22 L36 84 M28 34 C26 50 26 66 31 80 M44 34 C46 50 46 66 41 80" fill="none" stroke="#C9CED4" stroke-width="2.4" stroke-linecap="round"/></g>
<g transform="rotate(22 70 58)"><path d="M70 26 C84 40 86 70 70 88 C54 70 56 40 70 26 Z" fill="${O}" ${st}/>
<path d="M70 34 L70 82 M64 44 C62 56 62 70 66 80 M76 44 C78 56 78 70 74 80" fill="none" stroke="#C9CED4" stroke-width="2.2" stroke-linecap="round"/></g>`,

  sunflower: `
<path d="M50 56 L50 96" stroke="#4FA352" stroke-width="5" stroke-linecap="round"/>
<path d="M50 80 C40 70 26 72 20 78 C30 86 42 86 50 80 Z" fill="#5DB85F" ${st}/>
<path d="M50 74 C60 64 74 66 80 72 C70 80 58 80 50 74 Z" fill="#5DB85F" ${st}/>
<ellipse cx="50" cy="20" rx="6.5" ry="13" fill="#F6C443" stroke="#3E4348" stroke-width="2.2" transform="rotate(0 50 42)"/><ellipse cx="50" cy="20" rx="6.5" ry="13" fill="#F6C443" stroke="#3E4348" stroke-width="2.2" transform="rotate(30 50 42)"/><ellipse cx="50" cy="20" rx="6.5" ry="13" fill="#F6C443" stroke="#3E4348" stroke-width="2.2" transform="rotate(60 50 42)"/><ellipse cx="50" cy="20" rx="6.5" ry="13" fill="#F6C443" stroke="#3E4348" stroke-width="2.2" transform="rotate(90 50 42)"/><ellipse cx="50" cy="20" rx="6.5" ry="13" fill="#F6C443" stroke="#3E4348" stroke-width="2.2" transform="rotate(120 50 42)"/><ellipse cx="50" cy="20" rx="6.5" ry="13" fill="#F6C443" stroke="#3E4348" stroke-width="2.2" transform="rotate(150 50 42)"/><ellipse cx="50" cy="20" rx="6.5" ry="13" fill="#F6C443" stroke="#3E4348" stroke-width="2.2" transform="rotate(180 50 42)"/><ellipse cx="50" cy="20" rx="6.5" ry="13" fill="#F6C443" stroke="#3E4348" stroke-width="2.2" transform="rotate(210 50 42)"/><ellipse cx="50" cy="20" rx="6.5" ry="13" fill="#F6C443" stroke="#3E4348" stroke-width="2.2" transform="rotate(240 50 42)"/><ellipse cx="50" cy="20" rx="6.5" ry="13" fill="#F6C443" stroke="#3E4348" stroke-width="2.2" transform="rotate(270 50 42)"/><ellipse cx="50" cy="20" rx="6.5" ry="13" fill="#F6C443" stroke="#3E4348" stroke-width="2.2" transform="rotate(300 50 42)"/><ellipse cx="50" cy="20" rx="6.5" ry="13" fill="#F6C443" stroke="#3E4348" stroke-width="2.2" transform="rotate(330 50 42)"/>
<circle cx="50" cy="42" r="15" fill="#8B5A3C" ${st}/>
<circle cx="45" cy="38" r="1.8" fill="#5E3A24"/><circle cx="54" cy="37" r="1.8" fill="#5E3A24"/><circle cx="50" cy="45" r="1.8" fill="#5E3A24"/><circle cx="43" cy="47" r="1.8" fill="#5E3A24"/><circle cx="57" cy="46" r="1.8" fill="#5E3A24"/>`,

  grub: `
<path d="M56 24 C84 24 94 60 74 76 C58 88 32 80 28 60" fill="none" stroke="${O}" stroke-width="25" stroke-linecap="round"/>
<path d="M56 24 C84 24 94 60 74 76 C58 88 32 80 28 60" fill="none" stroke="#F4EEDF" stroke-width="18.6" stroke-linecap="round"/>
<path d="M78 36 L86 32 M86 52 L94 52 M82 70 L88 76 M64 82 L64 90 M44 80 L40 88" stroke="${O}" stroke-width="2.2" stroke-linecap="round"/>
<path d="M52 36 L46 44 M58 38 L54 48 M64 40 L62 50" stroke="${O}" stroke-width="2.6" stroke-linecap="round"/>
<circle cx="52" cy="24" r="12" fill="#C2783C" ${st}/>
<circle cx="47" cy="22" r="2" fill="${O}"/>`,

  beetle: `
<path d="M30 50 L14 42 M28 64 L10 66 M30 78 L16 90 M70 50 L86 42 M72 64 L90 66 M70 78 L84 90" fill="none" stroke="${O}" stroke-width="3.4" stroke-linecap="round"/>
<ellipse cx="50" cy="64" rx="24" ry="27" fill="#5A3A22" ${st}/>
<path d="M50 42 L50 90" stroke="#2E1D10" stroke-width="2.4"/>
<path d="M38 54 C36 62 36 72 40 80" fill="none" stroke="#8C5E3A" stroke-width="3" stroke-linecap="round"/>
<ellipse cx="50" cy="38" rx="17" ry="10" fill="#6B4528" ${st}/>
<path d="M45 30 C42 20 44 10 50 4 C56 10 58 20 55 30 Z" fill="#6B4528" ${st}/>
<path d="M50 6 L43 1 M50 6 L57 1" stroke="${O}" stroke-width="3" stroke-linecap="round"/>`,
};

/** 畫一個小圖：中心在 (x, y)，邊長 s（公釐） */
export function iconSvg(name: string, x: number, y: number, s: number): string {
  const body = ICONS[name];
  if (!body) throw new Error(`沒有「${name}」這個圖`);
  const k = s / 100;
  return `<g transform="translate(${(x - s / 2).toFixed(2)} ${(y - s / 2).toFixed(2)}) scale(${k.toFixed(4)})">${body}</g>`;
}
