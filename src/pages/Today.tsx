// src/pages/Today.tsx
import { useEffect, useState } from "react";
// import WeatherNow from "@/components/WeatherNow";   // ← 一旦消す
import { fetchCurrentByCoords, fetchTodayMaxPop } from "@/lib/openweather";
import HeaderBar from "@/components/HeaderBar";
import WeatherHero from "@/components/WeatherHero";

export default function Today() {
  const [state, setState] = useState<{
    name?: string;
    temp?: number;
    desc?: string;
    icon?: string;
    pop?: number;
    loading: boolean;
    error?: string;
  }>({ loading: true });

  useEffect(() => {
    const lat = 35.6895, lon = 139.6917;
    (async () => {
      try {
        const [cur, pop] = await Promise.all([
          fetchCurrentByCoords(lat, lon),
          fetchTodayMaxPop(lat, lon),
        ]);
        if (cur?.name) localStorage.setItem("cityName", cur.name);
        setState({
          name: cur.name,
          temp: cur.main.temp,
          desc: cur.weather?.[0]?.description ?? "",
          icon: cur.weather?.[0]?.icon ?? "01d",
          pop,
          loading: false,
        });
      } catch (e: any) {
        setState((s) => ({ ...s, loading: false, error: e.message || String(e) }));
      }
    })();
  }, []);

  if (state.loading) return <div style={{ padding: 16 }}>読み込み中...</div>;
  if (state.error) return <div style={{ padding: 16, color: "#e03131" }}>{state.error}</div>;

  const today = new Date();

  return (
    <>
      {/* ヘッダー（固定） */}
      <HeaderBar
        date={today}
        city={state.name ?? "東京都"}
        onMenuClick={() => {}}
        onCityClick={() => {}}
      />

      {/* ← 画面いっぱいのヒーロー行 */}
       <WeatherHero
      tempC={state.temp ?? null}
      iconCode={state.icon ?? null}
      pop={state.pop ?? null}
      desc={state.desc ?? ""}
    />

      {/* 本文。ここから先は任意で余白をつける */}
     <main style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 16px 80px" }}>
      {/* コンテンツ */}
    </main>
  </>
  );
}
