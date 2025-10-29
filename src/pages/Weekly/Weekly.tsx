import { useEffect, useState } from "react";
import { fetchDailyFromForecast } from "@/lib/openweather";
import s from "./Weekly.module.css"; // ← CSSモジュールを読み込み

const enWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const CARD_W = 250;
const PAGE_SHIFT = 730;
const GRID_SHIFT_Y = 50;
const TITLE_SHIFT_X = 855;
const TITLE_SHIFT_Y = 40;

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

  return (
    <div className={s.card}>
      <div className={s.week}>{wk}</div>
      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={desc || "weather"}
        className={s.icon}
      />
      <div className={s.temp}>
        {max}℃ / {min}℃
        <div className={s.pop}>降水 {pop}%</div>
      </div>
    </div>
  );
}

export default function Weekly() {
  const [days, setDays] = useState<Day[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const lat = 35.6895,
      lon = 139.6917;
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

  return (
    <div className={s.wrap}>
      <div
        className={s.title}
        style={
          {
            "--title-shift-x": `${TITLE_SHIFT_X}px`,
            "--title-shift-y": `${TITLE_SHIFT_Y}px`,
          } as React.CSSProperties
        }
      >
        週間予報
      </div>

      <div
        className={s.grid}
        style={
          {
            "--page-shift-x": `${PAGE_SHIFT}px`,
            "--grid-shift-y": `${GRID_SHIFT_Y}px`,
          } as React.CSSProperties
        }
      >
        {days!.map((d) => (
          <DayCard key={d.dt} d={d} />
        ))}
      </div>
    </div>
  );
}
