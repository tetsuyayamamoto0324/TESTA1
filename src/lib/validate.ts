// src/lib/validate.ts
import { ZodSchema, ZodError } from "zod"; // 追記
import { AppError } from "./appError"; // 追記

type ShowErrorFn = (
  err: unknown,
  opts?: { title?: string; retry?: () => void; fallbackMessage?: string }
) => void; // 追記

function zodErrorToLines(err: ZodError) {
  const fe = err.flatten().fieldErrors; // 追記
  const lines = Object.values(fe).flat().filter(Boolean) as string[]; // 追記
  return lines.length > 0 ? lines.join("\n") : "受信データの形式が不正です。"; // 追記
}

/**
 * 任意データのスキーマ検証（フォームなど）
 * 検証NGなら SCHEMA としてグローバル ErrorModal を出す
 */
export function validateOrShow<T>(params: {
  schema: ZodSchema<T>;
  data: unknown;
  showError: ShowErrorFn;
  title?: string;
}) {
  const { schema, data, showError, title } = params; // 追記
  const parsed = schema.safeParse(data); // 追記
  if (parsed.success) return { ok: true as const, data: parsed.data }; // 追記

  const msg = zodErrorToLines(parsed.error); // 追記
  showError(new AppError("SCHEMA", msg), { title: title ?? "入力が正しくありません" }); // 追記
  return { ok: false as const }; // 追記
}

/**
 * APIレスポンス専用のスキーマ検証
 * 検証NGなら SCHEMA としてグローバル ErrorModal を出す
 * 任意の内部コード（code）を末尾に付けて表示可能
 */
export function validateResponseOrShow<T>(params: {
  schema: ZodSchema<T>;
  data: unknown;
  showError: ShowErrorFn;
  title?: string;
  code?: string;
}) {
  const { schema, data, showError, title, code } = params; // 追記
  const parsed = schema.safeParse(data); // 追記
  if (parsed.success) return { ok: true as const, data: parsed.data }; // 追記

  const msg = [zodErrorToLines(parsed.error), code].filter(Boolean).join(" "); // 追記
  showError(new AppError("SCHEMA", msg), { title: title ?? "データ形式エラー" }); // 追記
  return { ok: false as const }; // 追記
}
