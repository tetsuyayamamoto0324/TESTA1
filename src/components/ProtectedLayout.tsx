// src/components/ProtectedLayout.tsx
import { Outlet, useNavigate } from "react-router-dom";
import HeaderBar from "./HeaderBar";
import BottomTabs from "./BottomTabs";
import { useCity } from "@/store/city";

const HEADER_H = "clamp(64px, 9vh, 96px)"; // ヘッダーの見込み高さ

export default function ProtectedLayout() {
  // 共通ストア：未設定なら「東京都」が入っています
  const city = useCity((s) => s.city);
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100dvh", background: "#E6F7FF" }}>
      {/* 固定ヘッダー（中央に都市名を表示） */}
      <HeaderBar
        city={city.name}
        onMenuClick={() => {}}
        onCityClick={() => navigate("/city")} // 都市名タップで設定画面へ
        // onRefetchWeather は必要なら Today 側から Context 等で渡す
      />

      {/* 本文（HeaderBar 内で spacer を出しているのでここでは余白は不要） */}
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
    maxWidth: 420,
    margin: "0 auto",
    padding: "0 12px 84px", // 下はタブ分の余白
  },
};
