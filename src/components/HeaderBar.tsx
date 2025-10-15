// src/components/HeaderBar.tsx
import React from "react";

type Props = {
  date?: Date;
  city?: string;
  onMenuClick?: () => void;
  onCityClick?: () => void;
};

const jpWeek = ["日", "月", "火", "水", "木", "金", "土"];

export default function HeaderBar({
  date = new Date(),
  city = "東京都",
  onMenuClick,
  onCityClick,
}: Props) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const dow = jpWeek[date.getDay()];

  return (
    <>
      <header style={styles.header}>
        <div style={styles.inner}>
          {/* 左：日付（普通表記・ボックスなし） */}
          <div style={styles.dateText}>{m}/{d}</div>

          {/* 中央：都市 + 曜日 */}
          <button
            type="button"
            aria-label="都市を変更"
            onClick={onCityClick}
            style={styles.cityBtn}
            title="都市を変更"
          >
            <span style={styles.cityText}>{city}</span>
            <span style={styles.dowText}>（{dow}）</span>
          </button>

          {/* 右：menu */}
          <button type="button" style={styles.menuBtn} onClick={onMenuClick} aria-label="メニュー">
            menu
          </button>
        </div>
      </header>

      {/* fixed のかぶり回避 */}
      <div style={styles.spacer} />
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: "#e6f7ff",
    /* 青→薄い黒の線に変更 */
    borderBottom: "1px solid rgba(0,0,0,.25)",
    boxShadow: "0 2px 10px rgba(0,0,0,.06)",
  },
  inner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "clamp(8px, 1.8vh, 16px) clamp(12px, 2vw, 20px)",
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    gap: 8,
    minHeight: "clamp(64px, 9vh, 96px)",
  },

  /* ← 日付はテキストのみ・大きく */
  dateText: {
    justifySelf: "start",
    fontSize: "clamp(20px, 4.6vw, 32px)",
    fontWeight: 800,
    letterSpacing: ".5px",
    lineHeight: 1,
  },

  cityBtn: {
    justifySelf: "center",
    display: "inline-flex",
    alignItems: "baseline",
    gap: 8,
    background: "transparent",
    border: "none",
    padding: "8px 12px",
    minHeight: 44,
    borderRadius: 12,
    cursor: "pointer",
    maxWidth: "75vw",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  cityText: { fontSize: "clamp(20px, 5.2vw, 28px)", fontWeight: 800, letterSpacing: ".5px" },
  dowText: { fontSize: "clamp(12px, 2.6vw, 16px)", opacity: 0.8, color: "#334" },

  menuBtn: {
    justifySelf: "end",
    background: "#fff",
    border: "1px solid rgba(0,0,0,.4)",
    borderRadius: 10,
    padding: "10px 16px",
    minHeight: 44,
    fontWeight: 800,
    fontSize: "clamp(14px, 3.4vw, 18px)",
    cursor: "pointer",
  },

  spacer: {
    height: "clamp(64px, 9vh, 96px)",
  },
};
