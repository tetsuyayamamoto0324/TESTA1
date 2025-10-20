import { create } from "zustand";
type Weather = { temp?: number|null; icon?: string|null; pop?: number|null; desc?: string|null; };
export const useWeather = create<{ now: Weather; setNow: (w: Weather)=>void }>((set)=>({
  now: {}, setNow: (w)=>set({ now: w })
}));