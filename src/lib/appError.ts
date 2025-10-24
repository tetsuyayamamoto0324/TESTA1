// src/lib/appError.ts
export type AppErrorKind =
  | "NETWORK" | "SCHEMA" | "CREATE_FAIL" | "AUTH_FAIL" | "EMAIL_EXISTS" | "API_FAIL" | "UNKNOWN";

export class AppError extends Error {
  kind: AppErrorKind;
  detail?: unknown;
  constructor(kind: AppErrorKind, message?: string, detail?: unknown) {
    super(message ?? kind);
    this.name = "AppError";
    this.kind = kind;
    this.detail = detail;
  }
}

export function normalizeError(e: unknown): AppError {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return new AppError("NETWORK", "ネットワークに接続できません。", e);
  }
  if (e instanceof AppError) return e;

  const any = e as any;
  const msg: string | undefined = any?.message ?? any?.error_description;
  const status: number | undefined = any?.status;

  if (any?.name === "TypeError" && /fetch/i.test(any?.message ?? "")) {
    return new AppError("NETWORK", "通信に失敗しました。", e);
  }
  if (typeof status === "number" && status === 0) {
    return new AppError("NETWORK", "通信に失敗しました。", e);
  }
  if (status === 409 || /already registered|email.*exists/i.test(msg ?? "")) {
    return new AppError("EMAIL_EXISTS", "このメールアドレスは既に登録されています。", e);
  }
  if (status === 400 || status === 401) {
    return new AppError("AUTH_FAIL", msg ?? "認証に失敗しました。", e);
  }
  if (typeof status === "number" && status >= 400) {
    return new AppError("API_FAIL", `サーバーエラー（${status}）が発生しました。`, e);
  }
  return new AppError("UNKNOWN", msg ?? "不明なエラーが発生しました。", e);
}

export function messageFor(kind: AppErrorKind, fallback?: string) {
  switch (kind) {
    case "NETWORK":     return "通信できません。接続やブラウザ設定をご確認ください。";
    case "SCHEMA":      return "入力の形式が正しくありません。内容をご確認ください。";
    case "CREATE_FAIL": return "新規登録に失敗しました。時間をおいて再度お試しください。";
    case "AUTH_FAIL":   return "認証に失敗しました。メール/パスワードをご確認ください。";
    case "EMAIL_EXISTS":return "このメールアドレスは既に登録されています。ログインをご利用ください。";
    case "API_FAIL":    return "データの取得に失敗しました。しばらくしてからお試しください。";
    default:            return fallback ?? "エラーが発生しました。";
  }
}
