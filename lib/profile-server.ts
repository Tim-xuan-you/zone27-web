import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { UserPredictionsMap } from "@/lib/predictions";
import type { SoccerPickRow } from "@/lib/soccer/predictions";
import { isSoccerPropMarketId } from "@/lib/soccer/props";
import type { MemberTier } from "@/lib/tier";
import type { CalibrationPick } from "@/lib/calibration-master";
import type { TennisPick } from "@/lib/tennis/matches";

// ── ZONE 27 · 公開 Profile 讀取(server · 無 cookie · 用永久碼)──────────
// soul-roadmap P0:/u/[code] 公開含輸戰績頁的資料源。 用 stateless anon client 打
// migration 0019 的兩支 anon-readable SECURITY DEFINER 函式(get_profile_by_code /
// get_predictions_by_code)· 拿任一位會員的公開身分 + 全部押注帳本(含輸 · 刪不掉)。
//
//   ⚠ 不能用 createSupabaseServerClient(它讀 cookies → 把頁面退成 per-request dynamic
//     並把「目前登入者」混進來)· 這支用無 cookie 的 anon client = 讀的是「那個碼的人」
//     的公開資料 · 跟誰在看無關(公開檔案的本質)· 同 lib/creator-posts-server.ts 模式。
//
// GRACEFUL:env 缺 / 0019 未套 / 查無此碼 / 錯 → null 或空 · 頁面退回 404 或空狀態,不 crash。
// 隱私:預設匿名(球迷 #碼)· 顯示名是會員自己 opt-in · 0 email / 0 PII(見 0019 header)。
// ─────────────────────────────────────────────────────

let cached: SupabaseClient | null = null;
function anonClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!cached) {
    cached = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}

export type PublicProfile = {
  /** 永久碼(md5(uid) 前 8 碼)· profile 身分 + 戰績 key */
  authorCode: string;
  /** 會員自填顯示名(opt-in · 沒設 = 空字串) */
  displayName: string;
  /** 顯示 handle(顯示名 or「球迷 #碼」)· 0019 z27_display_handle */
  handle: string;
  /** 付費身分(0023 get_tier_by_code)· 'black'/'founder' = 顯示支持者金環 ·
   *  🔴 這是「贊助開放引擎」的身分標記,不是準度。 0023 未套 / 免費 → 'free'(無環)。 */
  tier: MemberTier;
};

/**
 * 用永久碼查公開身分。 查無此碼 / 未套 0019 / 錯 → null(頁面 notFound)。
 * 這同時是「這個 profile 存不存在」的 gate —— 隨機 8 碼 hex 不會撞到真用戶就 404。
 */
export async function getProfileByCode(
  code: string,
): Promise<PublicProfile | null> {
  try {
    const supabase = anonClient();
    if (!supabase) return null;
    // 公開身分 + 付費 tier 平行讀(同一個碼)· tier 走 0023(get_tier_by_code)·
    // 0023 未套 / 錯 → tier 回 free(graceful · 不顯示金環 · 不擋 profile)。
    const [profileRes, tierRes] = await Promise.all([
      supabase.rpc("get_profile_by_code", { p_code: code }),
      supabase.rpc("get_tier_by_code", { p_code: code }),
    ]);
    const { data, error } = profileRes;
    if (error || !Array.isArray(data) || data.length === 0) return null;
    const row = data[0] as {
      author_code?: unknown;
      display_name?: unknown;
      handle?: unknown;
    };
    const authorCode =
      typeof row.author_code === "string" ? row.author_code : "";
    if (!authorCode) return null;
    const displayName =
      typeof row.display_name === "string" ? row.display_name : "";
    const handle =
      typeof row.handle === "string" && row.handle
        ? row.handle
        : "球迷 #" + authorCode;
    // get_tier_by_code 回純量 text('black'/'founder'/'')· 任何其他值/錯 → free。
    const tStr = typeof tierRes?.data === "string" ? tierRes.data : "";
    const tier: MemberTier =
      tStr === "black" || tStr === "founder" ? tStr : "free";
    return { authorCode, displayName, handle, tier };
  } catch {
    return null;
  }
}

/** 一筆網球押注(兩向 a/b · 公開檔讀那個碼的人)· 給 gradeTennisPicks / 戰功卡。 */
export type CodeTennisPick = { matchId: string; pick: TennisPick; ts: string };

export type CodePredictions = {
  /** 棒球(cpbl-* / mlb-*)· 只 home/away · 給 aggregateIdentity / aggregateStreak */
  baseball: UserPredictionsMap;
  /** 足球(fd-*)· 三向 home/draw/away · 給 gradeSoccerPicks */
  soccer: SoccerPickRow[];
  /** 網球(tn-*)· 兩向 a/b · 跟棒球 / 足球分開算(gradeTennisPicks)· 存表是 home/away → 這裡轉回 a/b */
  tennis: CodeTennisPick[];
  /** 足球玩法(fd-*~ou25 大小分 / fd-*~ah05 讓分)· 只 home/away · 併入「你的足球戰績」同一本帳
   *  (配 soccerPropResults 虛擬賽果 + getSoccerEnginePicksAll)· 跟「誰贏」分開讀避免污染校準曲線。 */
  soccerProps: SoccerPickRow[];
  /** 賽前宣告把握的押注(跨運動 · 含 confidence)· 給公開校準曲線(0027 才有值)·
   *  0027 未套用 → RPC 不回 confidence → 此陣列空 → 公開檔不顯示曲線(graceful build-ahead)。 */
  calibrationPicks: CalibrationPick[];
};

/**
 * 用永久碼查該員所有押注,按 match_id 開頭分成棒球 map + 足球三向陣列。
 * 同 getMyPredictionsMap / getMySoccerPicks 的分流規則(fd-* = 足球)· 只是讀的是
 * 「那個碼的人」而非目前登入者。 錯 / 空 → 兩本空帳(頁面顯示誠實空狀態)。
 *
 * 去重:RPC 已 order by created_at desc · 同一場只取最近一筆(碰撞時兩人押同場 → 取新)。
 */
export async function getPredictionsByCode(
  code: string,
): Promise<CodePredictions> {
  const empty: CodePredictions = {
    baseball: {},
    soccer: [],
    tennis: [],
    soccerProps: [],
    calibrationPicks: [],
  };
  try {
    const supabase = anonClient();
    if (!supabase) return empty;
    const { data, error } = await supabase.rpc("get_predictions_by_code", {
      p_code: code,
    });
    if (error || !Array.isArray(data)) return empty;
    const baseball: UserPredictionsMap = {};
    const soccer: SoccerPickRow[] = [];
    const tennis: CodeTennisPick[] = [];
    const seenTennis = new Set<string>(); // 網球同場只取最近一筆(已 desc → first-seen 最新)
    const soccerProps: SoccerPickRow[] = [];
    const calibrationPicks: CalibrationPick[] = [];
    const seenConf = new Set<string>(); // 校準同場只取最近一筆(已 desc → first-seen 最新)
    for (const row of data as {
      match_id?: unknown;
      pick?: unknown;
      confidence?: unknown;
      created_at?: unknown;
    }[]) {
      const matchId = typeof row.match_id === "string" ? row.match_id : "";
      const ts = typeof row.created_at === "string" ? row.created_at : "";
      if (!matchId || !ts) continue;
      // 玩法併入同一本帳(Tim 2026-06-23 · 反轉舊「絕不混進誰贏」):`~` 玩法押注(大小分 ~bou)
      // 算進「棒球」戰績(下方 else)· 但「校準曲線」與「足球(另一支管線、尚未合)」仍排除 `~` ——
      // 曲線不能把不同玩法的機率混在同一條線(數學)· 足球玩法之後另合。
      const isProp = matchId.includes("~");
      // 賽前宣告的把握(0027 才回 · 1-99 整數)→ 跨運動收進校準曲線(沒值/未套 0027 → 跳過)。
      const conf = row.confidence;
      const validPick =
        row.pick === "home" || row.pick === "draw" || row.pick === "away";
      if (
        validPick &&
        !isProp && // 🔴 校準曲線只算「誰贏」· 不混玩法機率(數學上不能畫同一條線)
        !matchId.startsWith("tn-") && // 網球賽果沒進這頁的 calibrationResults → 收進來只會變永遠 pending 的幽靈(/u 校準曲線目前只算棒球 + 足球)
        typeof conf === "number" &&
        Number.isFinite(conf) &&
        conf >= 1 &&
        conf <= 99 &&
        !seenConf.has(matchId)
      ) {
        seenConf.add(matchId);
        calibrationPicks.push({ matchId, pick: row.pick as string, confidence: conf, ts });
      }
      if (matchId.startsWith("fd-")) {
        if (!isProp && (row.pick === "home" || row.pick === "draw" || row.pick === "away")) {
          // 足球三向(主勝 / 和 / 客勝)
          soccer.push({ matchId, pick: row.pick, ts });
        } else if (
          isSoccerPropMarketId(matchId) &&
          (row.pick === "home" || row.pick === "away")
        ) {
          // 足球玩法(大小分 ~ou25 / 讓分 ~ah05)· 看大=home/看小=away · 讓分隊側 → 併入同一本足球戰績。
          // 🔴 用精確後綴判定(同 client getMySoccerPropPicks)· 不用泛 includes("~") —— 將來若加新玩法
          //   後綴(如 ~btts),自看 vs 公開兩邊要靠同一條規則收/不收,否則 n/pending 會對不上(自打臉)。
          soccerProps.push({ matchId, pick: row.pick, ts });
        }
      } else if (matchId.startsWith("cpbl-") || matchId.startsWith("mlb-")) {
        // 棒球二向(含大小分玩法 cpbl-*~bou / mlb-*~bou = 併入同一本帳)· 同場只記最近一筆。
        // R259:用 allowlist(cpbl-/mlb-)而非「else 全收」—— 否則網球 tn- / 群眾盤 mkt- 會落進棒球
        //   公開帳本,變永遠對不到賽果的幽靈 pending(aggregateIdentity 對認不到的 id 一律 pending++)。
        const pick =
          row.pick === "home" || row.pick === "away" ? row.pick : null;
        if (pick && !(matchId in baseball)) baseball[matchId] = { pick, ts };
      } else if (matchId.startsWith("tn-") && !isProp) {
        // 網球兩向(tn-*)· 跟棒球 / 足球分開算(gradeTennisPicks)· 存表是 home/away → 轉回 a/b
        // (A=home、B=away · 同 client fromStored)· 同場只取最近一筆(已 desc → first-seen 最新)。
        const p: TennisPick | null =
          row.pick === "home" ? "a" : row.pick === "away" ? "b" : null;
        if (p && !seenTennis.has(matchId)) {
          seenTennis.add(matchId);
          tennis.push({ matchId, pick: p, ts });
        }
      }
    }
    return { baseball, soccer, tennis, soccerProps, calibrationPicks };
  } catch {
    return empty;
  }
}
