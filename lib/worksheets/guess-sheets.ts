import data from "@/data/worksheets/guess.json";
import type { GuessSheet } from "./guess";

/** 注音猜猜看上線的學習單（固定編號，scripts/worksheets-guess.ts 出的） */
export const GUESS_SHEETS = (data as unknown as { sheets: GuessSheet[] }).sheets;
export const guessSheetById = (id: string): GuessSheet | undefined => GUESS_SHEETS.find((s) => s.id === id);
export const guessSheetsOf = (level: number): GuessSheet[] => GUESS_SHEETS.filter((s) => s.level === level);
