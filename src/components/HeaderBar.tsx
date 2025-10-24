// src/components/HeaderBar.tsx
import React, { useState } from "react";
import Modal from "@/components/Modal";
import { useAuth } from "@/store/auth";

const MODAL_SHIFT_X = 150;
const MODAL_SHIFT_Y = 0;
const TITLE_OFFSET_X = 5;
const TITLE_OFFSET_Y = 0;
const EMAIL_OFFSET_X = 0;
const REFETCH_OFFSET_X = 40;  // ボタン行を左右に（+で右 / −で左）
const REFETCH_OFFSET_Y = 0;
const LOGOUT_OFFSET_X = 33; // ボタン行を左右に（+で右 / −で左）
const LOGOUT_OFFSET_Y = 0;

const REFETCH_ALIGN: "start" | "center" | "end" = "start";
const LOGOUT_ALIGN: "start" | "center" | "end" = "start";

type Props = {
  date?: Date;
  city?: string;
  onMenuClick?: () => void;
  onCityClick?: () => void;
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

  // ▼ ここを m → month に
  const month = date.getMonth() + 1;
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
            {month}/{d}
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

      {/* モーダル */}
      <Modal open={menuOpen} onClose={() => setMenuOpen(false)}>
  <div style={menuStyles.wrap}>
    <div style={menuStyles.title}>ログイン中のユーザー</div>

    <div style={menuStyles.emailRow}>
      <span style={menuStyles.emailText}>
        {user?.email ?? "（未ログイン）"}
      </span>
    </div>

    <div style={menuStyles.refetchRow}>
      <button
        type="button"
        onClick={handleRefetchClick}
        disabled={refetching}
        style={menuStyles.refetchBtn}
      >
        {refetching ? "再取得中…" : "再取得"}
      </button>
      <span style={menuStyles.note}>{refetchMsg}</span>
    </div>

    <hr style={menuStyles.hr} />

    {/* ← ここを “行” で包む */}
    <div style={menuStyles.logoutRow}>
      <button type="button" style={menuStyles.logoutBtn} onClick={handleLogout}>
        ログアウト
      </button>
    </div>
  </div>
</Modal>
    </>
  );
}

// ▼ ここも m → menuStyles に
const menuStyles: Record<string, React.CSSProperties> = {
  wrap: {
    display: "grid",
    gap: 16,
    padding: "6px 4px",
    marginLeft: MODAL_SHIFT_X,
    marginTop: MODAL_SHIFT_Y,
  },
  title: {
    fontWeight: 800,
    fontSize: 18,
    letterSpacing: ".2px",
    marginLeft: TITLE_OFFSET_X,
    marginTop: TITLE_OFFSET_Y,
    // textAlign: "center",
  },
  emailRow: {
    paddingLeft: 2,
    marginLeft: EMAIL_OFFSET_X,
  },
  emailText: { fontSize: 14, opacity: 0.9 },
  row: { display: "flex", alignItems: "center", gap: 10, marginTop: 4 },
  refetchBtn: {
    border: "1px solid rgba(0,0,0,.45)",
    borderRadius: 8,
    padding: "8px 14px",
    background: "#fff",
    cursor: "pointer",
  },
  note: { fontSize: 12, opacity: 0.8 },
  hr: { border: "none", borderTop: "1px solid rgba(0,0,0,.12)", marginTop: 6 },
  logout: {
    background: "transparent",
    border: "none",
    color: "#e03131",
    fontWeight: 800,
    fontSize: 16,
    cursor: "pointer",
    justifySelf: "start",
  },
  refetchRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginLeft: REFETCH_OFFSET_X,  // ← ここで左右微調整
    marginTop: REFETCH_OFFSET_Y,   // ← ここで上下微調整
    justifyContent:
      REFETCH_ALIGN === "end" ? "flex-end" :
      REFETCH_ALIGN === "center" ? "center" : "flex-start",
  },

logoutRow: {
    display: "flex",
    alignItems: "center",
    marginLeft: LOGOUT_OFFSET_X,
    marginTop: LOGOUT_OFFSET_Y,
    justifyContent:
      LOGOUT_ALIGN === "end" ? "flex-end" :
      LOGOUT_ALIGN === "center" ? "center" : "flex-start",
  },

  // ▼ 追加：ログアウトボタン（再取得と同じ形）
  logoutBtn: {
    border: "1px solid rgba(0,0,0,.45)",
    borderRadius: 8,
    padding: "8px 14px",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 800,
    color: "#e03131",
  },
};

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
