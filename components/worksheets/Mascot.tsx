import { acornIcon, houseIcon, squirrelIcon } from "@/lib/worksheets/draw";

/**
 * 小松鼠：學習單上那一隻，也是網站的 logo。
 * 用跟學習單同一支畫圖程式，紙上、網站上長得一模一樣。
 */
export function Squirrel({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size} height={size} viewBox="-0.58 -0.56 0.98 0.98" aria-hidden
      style={{ flex: "none", display: "block" }}
      dangerouslySetInnerHTML={{ __html: squirrelIcon(0, 0, 1) }}
    />
  );
}

export function Acorn({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size} height={size} viewBox="-0.42 -0.46 0.84 0.9" aria-hidden
      style={{ flex: "none", display: "block" }}
      dangerouslySetInnerHTML={{ __html: acornIcon(0, 0, 1) }}
    />
  );
}

export function House({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size} height={size} viewBox="-0.44 -0.44 0.88 0.84" aria-hidden
      style={{ flex: "none", display: "block" }}
      dangerouslySetInnerHTML={{ __html: houseIcon(0, 0, 1) }}
    />
  );
}
