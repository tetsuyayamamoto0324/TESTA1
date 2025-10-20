// src/pages/Weekly.tsx
import { useEffect, useState } from "react";
import { fetchDailyFromForecast } from "@/lib/openweather";

const enWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const CARD_W = 250;
const PAGE_SHIFT = 730;
const GRID_SHIFT_Y = -24;
const TITLE_SHIFT_X = 855; // 右へ（左へは負の値）
const TITLE_SHIFT_Y = -19;

type Day = {
  dt: number;
  temp: { min: number; max: number };
  pop: number; // 0-1
  weather: { icon: string; description: string }[];
};

function DayCard({ d }: { d: Day }) {
  const date = new Date(d.dt * 1000);
  const wk = enWeek[date.getDay()];
  const max = Math.round(d.temp.max);
  const min = Math.round(d.temp.min);
  const pop = Math.round((d.pop ?? 0) * 100);
  const icon = d.weather?.[0]?.icon ?? "01d";
  const desc = d.weather?.[0]?.description ?? "";

  const styles: Record<string, React.CSSProperties> = {
    card: {
      background: "#fff",
      border: "1px solid #111",
      borderRadius: 6,
      width: CARD_W,
      aspectRatio: "1/1.05",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "18px 14px",                 // ← 少し広めに
      boxShadow: "0 2px 4px rgba(0,0,0,.05)",
    },
    week: {
      fontWeight: 900,
      letterSpacing: ".6px",
      fontSize: "clamp(16px, 2vw, 22px)",  // ← 曜日を大きく
    },
    icon: {
      width: "clamp(72px, 9vw, 96px)",     // ← アイコン拡大（54→72〜96）
      height: "auto",
      imageRendering: "pixelated",
    },
    temp: {
      fontSize: "clamp(20px, 2.8vw, 28px)", // ← 気温を大きく
      fontWeight: 800,
      lineHeight: 1.25,
      textAlign: "center",
    },
    pop: {
      fontSize: "clamp(14px, 2vw, 18px)",   // ← 降水も見やすく
      fontWeight: 700,
      marginTop: 4,
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.week}>{wk}</div>

      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={desc || "weather"}
        style={styles.icon}
      />

      <div style={styles.temp}>
        {max}℃ / {min}℃
        <div style={styles.pop}>降水 {pop}%</div>
      </div>
    </div>
  );
}

export default function Weekly() {
  const [days, setDays] = useState<Day[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const lat = 35.6895, lon = 139.6917; // まずは固定
    (async () => {
      try {
        const daily = await fetchDailyFromForecast(lat, lon);
        setDays(daily as Day[]);
      } catch (e: any) {
        setError(e?.message ?? String(e));
      }
    })();
  }, []);

  if (!days && !error) return <div style={{ padding: 16 }}>読み込み中…</div>;
  if (error) return <div style={{ padding: 16, color: "#e03131" }}>{error}</div>;

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "16px clamp(12px, 2vw, 20px) 80px",
  },
  title: {
    fontSize: "clamp(18px, 3.6vw, 28px)",
    fontWeight: 800,
    margin: "12px 0 16px",
    transform: `translate(${TITLE_SHIFT_X}px, ${TITLE_SHIFT_Y}px)`, // 右へ
  },
  grid: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: `repeat(3, ${CARD_W}px)`, // ← カード幅で3列
    columnGap: 300,   // 横方向の間隔
    rowGap: 15,
    justifyContent: "center",
    justifyItems: "center",
    transform: `translate(${PAGE_SHIFT}px, ${GRID_SHIFT_Y}px)`,
  },
};

  return (
    <div style={styles.wrap}>
      <div style={styles.title}>週間予報</div>
      <div style={styles.grid}>
        {days!.map((d) => (
          <DayCard key={d.dt} d={d} />
        ))}
      </div>
    </div>
  );
}
