"use client";

import { useEffect, useState } from "react";

// ── ZONE 27 · useMounted canonical hook ───────────────
// R162 W1 · Agent N #4 · 10 components 之前 repeat 同 pattern:
//   const [mounted, setMounted] = useState(false);
//   useEffect(() => {
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     setMounted(true);
//   }, []);
//
// 每 site 5 LOC + 1 eslint-disable comment = ~60 LOC duplication
// across HeroLiveCard + AdminTierSwitcher + MemberDashboardPreview +
// MyTeamMatchNote + MemberDailyBrief + TierFeatureMatrix +
// PreviewModeBanner + TierBadge + TeamPickPanel + MyTeamTrackRecord。
//
// SSR-safe render gate pattern:返回 true 表示 client-mounted ·
// false 表示 server-render(用於避免 hydration mismatch on browser-
// only API access · localStorage / Intl.DateTimeFormat / Date.now /
// window.location 等 time-dependent / client-only state)。
//
// 不同於 R155 W1c mountedRef pattern · 後者是 useRef tracking unmount
// 來 guard async setState · 兩者 serve different purposes · canonical
// 分離 hooks。
//
// 用法:
//   const mounted = useMounted();
//   if (!mounted) return null;  OR  return mounted ? <Client /> : <Skeleton />;
//
// 同 axis hook libraries(react-use · usehooks-ts)canonical pattern。
// 0 external dep · pure React 19 + Next 16 compatible。
// ─────────────────────────────────────────────────────

export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  return mounted;
}
