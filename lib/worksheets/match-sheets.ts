import data from "@/data/worksheets/match.json";
import type { MatchSheet, MatchThemeId } from "./match";

/** 連連看上線的學習單（固定編號，scripts/worksheets-match.ts 出的） */
export const MATCH_SHEETS = (data as unknown as { sheets: MatchSheet[] }).sheets;
export const matchSheetById = (id: string): MatchSheet | undefined => MATCH_SHEETS.find((s) => s.id === id);
export const matchSheetsOf = (theme: MatchThemeId): MatchSheet[] => MATCH_SHEETS.filter((s) => s.theme === theme);
