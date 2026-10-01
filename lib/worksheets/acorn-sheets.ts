import data from "@/data/worksheets/acorn.json";
import type { AcornSheet } from "./acorn";

/** 撿松果回家上線的學習單（固定編號，scripts/worksheets-acorn.ts 挑的） */
export const ACORN_SHEETS = (data as unknown as { sheets: AcornSheet[] }).sheets;
export const acornSheetById = (id: string): AcornSheet | undefined => ACORN_SHEETS.find((s) => s.id === id);
export const acornSheetsOf = (level: number): AcornSheet[] => ACORN_SHEETS.filter((s) => s.level === level);
