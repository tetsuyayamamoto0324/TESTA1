// src/components/ProtectedLayout.tsx
import { Outlet } from "react-router-dom";
import HeaderBar from "./HeaderBar";
import BottomTabs from "./BottomTabs"; // ← 下部タブ (あなたのコンポ名に合わせて)

export default function ProtectedLayout() {
  const city = localStorage.getItem("cityName") || "東京都";

  return (
    <div style={{ minHeight: "100dvh", background: "#E6F7FF" }}>
      {/* 固定ヘッダー（中央寄せ） */}
      <HeaderBar city={city} onMenuClick={() => { /* 開く処理 */ }} />

      {/* 固定ヘッダーのぶん余白（ヘッダー高さ ≈ 72px） */}
      <div style={{ height: 72 }} />

      {/* 本文は中央寄せ・最大幅 */}
      <main style={styles.pageCenter}>
        <Outlet />
      </main>

      {/* 固定フッター（タブ） */}
      <BottomTabs />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pageCenter: {
    width: "100%",
    maxWidth: 420,     // ここを好みで 360〜480 に
    margin: "0 auto",  // 中央寄せ
    padding: "0 12px 84px", // 下はタブ分の余白
  },
};
