import data from "@/data/worksheets/number.json";
import type { NumberSheet } from "./number";

/** 數字松果上線的學習單（固定編號，scripts/worksheets-number.ts 挑的） */
export const NUMBER_SHEETS = (data as unknown as { sheets: NumberSheet[] }).sheets;
export const numberSheetById = (id: string): NumberSheet | undefined => NUMBER_SHEETS.find((s) => s.id === id);
export const numberSheetsOf = (level: number): NumberSheet[] => NUMBER_SHEETS.filter((s) => s.level === level);
