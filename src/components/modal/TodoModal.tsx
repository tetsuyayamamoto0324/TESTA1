// src/components/TodoModal.tsx
import React, { useEffect, useRef, useState } from "react";

const TEXTAREA_SHIFT_X = -10;   // px
const TEXTAREA_SHIFT_Y = 24;  // px ← 少し下げる例
const TEXTAREA_HEIGHT = 180;   // ← お好みで。180/200 など
const TEXTAREA_MAX    = 240;   // ユーザーがリサイズしてもここまで
const GAP_BELOW       = 12;
const SAVEBTN_SHIFT_X = -20;   // px
const SAVEBTN_SHIFT_Y = 20;     // px
const DANGERBTN_SHIFT_X = 20;  // px
const DANGERBTN_SHIFT_Y = 20;   // px
const CLOSE_SIZE = 28;



type Props = {
  open: boolean;
  dateText?: string;               // 例: "2025-10-22"
  initialText?: string;            // 改行区切りでToDoを渡す
  onSave: (text: string) => void;  // 改行テキストで返す（空なら削除扱い）
  onClose: () => void;
  showDelete?: boolean;        // ★追加：削除ボタンを出すか
  onDelete?: () => void;       // ★追加：削除押下時
};

export default function TodoModal({
  open,dateText, initialText, onSave, onClose,
  showDelete = false, onDelete,
}: Props) {
  const [text, setText] = useState(initialText ?? "");
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (open) {
      setText(initialText ?? "");
      // 開いたら自動フォーカス
      setTimeout(() => ref.current?.focus(), 0);
    }
  }, [open, initialText]);

  if (!open) return null;

  const styles: Record<string, React.CSSProperties> = {
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.22)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
    },
    modal: {
      position: "relative",
      width: 520,
      minHeight: 300,
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 8px 24px rgba(0,0,0,.18)",
      padding: 16,
      overflow: "hidden",
    },
    closeBtn: {
      position: "absolute",
      top: 10,
      right: 10,
      width: CLOSE_SIZE,
      height: CLOSE_SIZE,
      borderRadius: 8,
      background: "#f8fbff",                        // ← 薄い背景（好みで "#fff" でも）
      border: "1px solid rgba(0,0,0,.35)",
      boxShadow: "0 1px 0 rgba(0,0,0,.06) inset",
      display: "grid",
      placeItems: "center",
      padding: 0,
      boxSizing: "border-box",
      cursor: "pointer",

  // 文字
      fontSize: 14,
      fontWeight: 700,
      lineHeight: 1,

  // ブラウザ既定スタイルOFF（念のため）
      appearance: "none" as any,
      WebkitAppearance: "none" as any,
    },
    hint: {
      color: "rgba(0,0,0,.35)",
      marginBottom: 8,
      fontSize: 14,
      userSelect: "none",
    },
    textarea: {
      width: "100%",
      height: TEXTAREA_HEIGHT,
      minHeight: 0,
      maxHeight: TEXTAREA_MAX,
      resize: "vertical",
      border: "none",
      borderRadius: 8,
      padding: "10px 10px",
      outline: "none",
      fontSize: 14,
      lineHeight: 1.4,
      transform: `translate(${TEXTAREA_SHIFT_X}px, ${TEXTAREA_SHIFT_Y}px)`,
    },
    footer: {
      display: "flex",
      justifyContent: showDelete ? "space-between" : "flex-end",
      marginTop: 12,
    },
    dangerBtn: {                     // ★削除ボタン（見た目は更新と同形）
      background: "#fff",
      border: "1px solid rgba(0,0,0,.85)",
      borderRadius: 8,
      padding: "8px 16px",
      fontWeight: 800,
      cursor: "pointer",
      transform: `translate(${DANGERBTN_SHIFT_X}px, ${DANGERBTN_SHIFT_Y}px)`,
    },
    saveBtn: {
      background: "#fff",
      border: "1px solid rgba(0,0,0,.85)",
      borderRadius: 8,
      padding: "8px 16px",
      fontWeight: 800,
      cursor: "pointer",
      transform: `translate(${SAVEBTN_SHIFT_X}px, ${SAVEBTN_SHIFT_Y}px)`,
    },
    dateBadge: {
      position: "absolute",
      left: 16,
      top: 12,
      fontSize: 12,
      opacity: 0.6,
      display: "none",
    },
  };

  const onBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div style={styles.overlay} onClick={onBackdropClick}>
      <div style={styles.modal} role="dialog" aria-modal="true" aria-label="ToDo編集モーダル">
        <div style={styles.dateBadge}>{dateText}</div>

        <button type="button" style={styles.closeBtn} aria-label="閉じる" onClick={onClose}>
          ×
        </button>

        <textarea
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"タスクを打ち込んでください"}
          style={styles.textarea}
        />

        <div style={styles.footer}>
          {showDelete && (
            <button type="button" style={styles.dangerBtn} onClick={onDelete}>
              削除
            </button>
          )}
          <button
            type="button"
            style={styles.saveBtn}
            onClick={() => onSave(text)}
          >
            更新
          </button>
        </div>
      </div>
    </div>
  );
}
