// src/components/HeaderBar.tsx
import React, { useState } from "react";
import Modal from "@/components/Modal";
import { useAuth } from "@/store/auth";

type Props = {
  date?: Date;
  city?: string;
  onMenuClick?: () => void;
  onCityClick?: () => void;
  /** 天気の再取得（親コンポーネントが実装して渡す） */
  onRefetchWeather?: () => Promise<void> | void;
};

const jpWeek = ["日", "月", "火", "水", "木", "金", "土"];

export default function HeaderBar({
  date = new Date(),
  city,
  onMenuClick,
  onCityClick,
  onRefetchWeather,
}: Props) {
  const cityLabel = city && city.trim() ? city : "東京都";
  const { user, signOut } = useAuth();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const dow = jpWeek[date.getDay()];

  const [menuOpen, setMenuOpen] = useState(false);
  const [refetching, setRefetching] = useState(false);
  const [refetchMsg, setRefetchMsg] = useState("");

  const handleRefetchClick = async () => {
    try {
      setRefetchMsg("");
      setRefetching(true);
      await onRefetchWeather?.();
      setRefetchMsg("最新の天気を取得しました");
    } catch {
      setRefetchMsg("取得に失敗しました");
    } finally {
      setRefetching(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } finally {
      setMenuOpen(false);
    }
  };

  return (
    <>
      <header style={styles.header}>
        <div style={styles.inner}>
          {/* 左：日付 */}
          <div style={styles.dateText}>
            {m}/{d}
          </div>

          {/* 中央：都市 + 曜日 */}
          <button
            type="button"
            aria-label="都市を変更"
            onClick={onCityClick}
            style={styles.cityBtn}
            title="都市を変更"
          >
            <span style={styles.cityText}>{cityLabel}</span>
            <span style={styles.dowText}>（{dow}）</span>
          </button>

          {/* 右：menu */}
          <button
            type="button"
            style={styles.menuBtn}
            onClick={() => {
              onMenuClick?.();
              setMenuOpen(true);
            }}
            aria-label="メニュー"
          >
            menu
          </button>
        </div>
      </header>

      {/* fixed の被り回避 */}
      <div style={styles.spacer} />

      {/* モーダル（タイトルなし） */}
      <Modal open={menuOpen} onClose={() => setMenuOpen(false)}>
        <div style={{ display: "grid", gap: 14 }}>
          <div><strong>ログイン中のユーザー</strong></div>

          {/* メール表示 */}
          <div style={{ fontSize: 14, opacity: 0.9 }}>
            {user?.email ?? "（未ログイン）"}
          </div>

          {/* 天気再取得 */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              type="button"
              onClick={handleRefetchClick}
              disabled={refetching}
              style={{
                border: "1px solid rgba(0,0,0,.45)",
                borderRadius: 8,
                padding: "8px 14px",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              {refetching ? "再取得中…" : "再取得"}
            </button>
            <span style={{ fontSize: 12, opacity: 0.8 }}>{refetchMsg}</span>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid rgba(0,0,0,.12)" }} />

          {/* ログアウト */}
          <button
            type="button"
            style={{
              background: "transparent",
              border: "none",
              color: "#e03131",
              fontWeight: 800,
              fontSize: 16,
              cursor: "pointer",
              justifySelf: "start",
            }}
            onClick={handleLogout}
          >
            ログアウト
          </button>
        </div>
      </Modal>
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
  cityText: {
    fontSize: "clamp(20px, 5.2vw, 28px)",
    fontWeight: 800,
    letterSpacing: ".5px",
  },
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
  spacer: { height: "clamp(64px, 9vh, 96px)" },
};
