import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import ErrorModal from "@/components/ErrorModal";
import NetworkErrorModal from "@/components/NetworkErrorModal";
import { AppError, AppErrorKind, normalizeError, messageFor } from "@/lib/appError";

type ShowError = (err: unknown, opts?: { title?: string; retry?: () => void; fallbackMessage?: string }) => void;

const Ctx = createContext<ShowError | null>(null);

export function ErrorProvider({ children }: { children: ReactNode }) {
  // 共通モーダル用
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("エラーが発生しました");
  const [message, setMessage] = useState("");
  const [retry, setRetry] = useState<null | (() => void)>(null);
  const [kind, setKind] = useState<AppErrorKind>("UNKNOWN");

  // ネットワーク専用モーダル（online/offline 監視）
  const [netOpen, setNetOpen] = useState(false);

  useEffect(() => {
    const onOffline = () => setNetOpen(true);
    const onOnline  = () => setNetOpen(false);

    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    // 初期状態がすでにオフラインなら即表示
    if (typeof navigator !== "undefined" && navigator.onLine === false) setNetOpen(true);

    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  const showError: ShowError = (err, opts) => {
    const appErr = normalizeError(err);
    if (appErr.kind === "NETWORK") {
      // 通信失敗はネットワーク専用モーダルでキャッチ
      setNetOpen(true);
      return;
    }
    setKind(appErr.kind);
    setTitle(opts?.title ?? "エラーが発生しました");
    setMessage(messageFor(appErr.kind, opts?.fallbackMessage ?? appErr.message));
    setRetry(opts?.retry ?? null);
    setOpen(true);
  };

  return (
    <Ctx.Provider value={showError}>
      {children}

      {/* ネットワーク専用（常に最優先） */}
      <NetworkErrorModal open={netOpen} onClose={() => setNetOpen(false)} />

      {/* 通常のエラーモーダル（ネットワーク以外） */}
      <ErrorModal
        open={open}
        title={title}
        message={message}
        onClose={() => setOpen(false)}
        onRetry={retry ?? undefined}
      />
    </Ctx.Provider>
  );
}

export function useError() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useError must be used within <ErrorProvider>");
  return ctx;
}
