// src/lib/openweather.ts
const API = 'https://api.openweathermap.org/data/2.5';
const KEY = import.meta.env.VITE_OPENWEATHER_KEY as string;

export async function fetchCurrentByCoords(lat: number, lon: number) {
  const url = `${API}/weather?lat=${lat}&lon=${lon}&appid=${KEY}&units=metric&lang=ja`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// 3時間刻み予報から、今日分の最大POPをざっくり計算
export async function fetchTodayMaxPop(lat: number, lon: number) {
  const url = `${API}/forecast?lat=${lat}&lon=${lon}&appid=${KEY}&units=metric&lang=ja`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  const json = await res.json();
  const today = new Date().getDate();
  const pops: number[] = json.list
    .filter((it: any) => new Date(it.dt * 1000).getDate() === today)
    .map((it: any) => it.pop ?? 0);
  return pops.length ? Math.max(...pops) : undefined;
}
