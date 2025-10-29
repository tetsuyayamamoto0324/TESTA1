// src/components/Modal.tsx
import React, { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  width?: number; // ダイアログの幅(px)。未指定なら 460
  children: React.ReactNode;
};

export default function Modal({ open, onClose, title, width = 460, children }: Props) {
  const firstFocusRef = useRef<HTMLDivElement>(null);

  // ESC で閉じる / オープン中は背景スクロールを止める
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // ざっくりフォーカスをモーダル内へ
    setTimeout(() => firstFocusRef.current?.focus(), 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const overlay: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.35)",
    backdropFilter: "blur(1px)",
    display: "grid",
    placeItems: "center",
    zIndex: 1000,
  };
  const dialog: React.CSSProperties = {
    width,
    maxWidth: "92vw",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 12px 36px rgba(0,0,0,.25)",
    padding: "18px 18px 16px",
    border: "1px solid rgba(0,0,0,.15)",
  };
  const header: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  };
  const titleStyle: React.CSSProperties = { fontSize: 18, fontWeight: 800 };
  const closeBtn: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,.25)",
    borderRadius: 8,
    padding: "6px 10px",
    background: "#f6f9ff",
    cursor: "pointer",
  };

  return (
    <div style={overlay} role="presentation" onClick={onClose}>
      <div
        style={dialog}
        role="dialog"
        aria-modal="true"
        aria-label={title || "モーダル"}
        onClick={(e) => e.stopPropagation()} // 中身クリックで閉じない
      >
        <div ref={firstFocusRef} tabIndex={-1} />
        <div style={header}>
          {title ? <div style={titleStyle}>{title}</div> : <div />}
          <button type="button" style={closeBtn} onClick={onClose} aria-label="閉じる">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
