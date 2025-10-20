import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCity } from "@/store/city";

const GEO_API = "https://api.openweathermap.org/geo/1.0/direct";
const KEY = import.meta.env.VITE_OPENWEATHER_KEY as string;
const DEFAULT_COUNTRY = "JP";
const TITLE_SHIFT_X = 80;  // 右へ + / 左へ −（px）
const TITLE_SHIFT_Y = -10;  // 下へ + / 上へ −（px）

function hasCountry(raw: string) {
  const s = raw.trim();
  return /,\s*[A-Za-z]{2}$/.test(s);
}

// 右寄せなどの見た目微調整（必要に応じて値を変えてください）
const PAGE_SHIFT_X = 710;   // ページ全体を右へ
const PAGE_SHIFT_Y = -6;    // 上下の位置
const BOX_W = 420;          // 入力ボックス領域の見た目幅

// 保存キー
const LS_KEY = "default-city-v1";

type GeoItem = {
  name: string;
  state?: string;
  country: string; // ISO
  lat: number;
  lon: number;
};

type SavedCity = {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
};

export default function CitySearch() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<GeoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<SavedCity | null>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? (JSON.parse(raw) as SavedCity) : null;
    } catch {
      return null;
    }
  });

  // --- debounce 検索 ---
const tRef = useRef<number | null>(null);
useEffect(() => {
  const typed = q.trim();

  if (!typed) {
    setResults([]);
    setError(null);
    return;
  }

  if (tRef.current) window.clearTimeout(tRef.current);

  tRef.current = window.setTimeout(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1) 入力に国コードが無ければ ",JP" を補って検索（1件だけ）
      const q1 = hasCountry(typed) ? typed : `${typed},${DEFAULT_COUNTRY}`;
      const url1 = `${GEO_API}?q=${encodeURIComponent(q1)}&limit=1&appid=${KEY}`;

      let res = await fetch(url1);
      let list: GeoItem[] = [];
      if (res.ok) list = (await res.json()) as GeoItem[];

      // 2) JP指定で0件なら、国指定なしで 1件だけ再検索
      if (list.length === 0) {
        const url2 = `${GEO_API}?q=${encodeURIComponent(typed)}&limit=1&appid=${KEY}`;
        res = await fetch(url2);
        if (res.ok) list = (await res.json()) as GeoItem[];
      }

      setResults(list);
      if (list.length === 0) setError("都市名を正しく打ってください");
    } catch {
      setError("検索に失敗しました");
    } finally {
      setLoading(false);
    }
  }, 300);

  return () => {
    if (tRef.current) window.clearTimeout(tRef.current);
  };
}, [q]);

  const onSave = (it: GeoItem) => {
    const payload: SavedCity = {
      name: it.name,
      state: it.state,
      country: it.country,
      lat: it.lat,
      lon: it.lon,
    };
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
    setSaved(payload);
    setResults([]);
    setQ(`${it.name}`);
    useCity.getState().setCity({
    name: payload.name,
    lat: payload.lat,
    lon: payload.lon,
    country: payload.country,
    state: payload.state,
  });
  };

   async function fetchTopCandidate(typed: string): Promise<GeoItem | null> {
    if (!typed) return null;

    // まず「,JP」を付けて 1件だけ検索
    const urlJP = `${GEO_API}?q=${encodeURIComponent(typed + ",JP")}&limit=1&appid=${KEY}`;
    try {
      let res = await fetch(urlJP);
      let list: GeoItem[] = res.ok ? ((await res.json()) as GeoItem[]) : [];

      // JPで0件 → 国指定なしで 1件だけ
      if (list.length === 0) {
        const urlAny = `${GEO_API}?q=${encodeURIComponent(typed)}&limit=1&appid=${KEY}`;
        res = await fetch(urlAny);
        list = res.ok ? ((await res.json()) as GeoItem[]) : [];
      }
      return list[0] ?? null;
    } catch {
      return null;
    }
  }

  /** Enter で候補の先頭を保存 */
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = async (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const typed = q.trim();
    if (!typed) return;

    // 既に候補が出ていれば先頭を保存
    if (results.length > 0) {
      onSave(results[0]);
      return;
    }

    // まだ候補が無ければ即時に1件取得して保存
    const top = await fetchTopCandidate(typed);
    if (top) onSave(top);
    else setError("候補が見つかりませんでした");
  };


  const styles: Record<string, React.CSSProperties> = {
    wrap: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "16px clamp(12px, 2vw, 20px) 80px",
    },
    shift: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      transform: `translate(${PAGE_SHIFT_X}px, ${PAGE_SHIFT_Y}px)`,
    },
    box: {
      width: BOX_W,
    },
    title: {
      fontSize: "clamp(20px, 3.6vw, 32px)",
      fontWeight: 800,
      letterSpacing: ".2px",
      margin: "40px 0 28px",
      transform: `translate(${TITLE_SHIFT_X}px, ${TITLE_SHIFT_Y}px)`,
    },
    savedLine: {
      marginBottom: 12,
      fontSize: 14,
      opacity: 0.8,
    },
    inputWrap: {
      position: "relative",
      width: "100%",
    },
    input: {
      width: "100%",
      height: 44,
      borderRadius: 6,
      border: "1px solid rgba(0,0,0,.45)",
      boxShadow: "0 2px 0 rgba(0,0,0,.18)",
      padding: "0 14px 0 40px",
      fontSize: 16,
      outline: "none",
      background: "#fff",
    },
    icon: {
      position: "absolute",
      left: 10,
      top: 10,
      width: 22,
      height: 22,
      opacity: 0.8,
      pointerEvents: "none",
    },
    err: {
      color: "#e03131",
      marginTop: 12,
      fontSize: 14,
    },
    ok: {
      color: "#2b8a3e",
      marginTop: 12,
      fontSize: 14,
    },
    list: {
      marginTop: 10,
      border: "1px solid rgba(0,0,0,.25)",
      borderRadius: 8,
      overflow: "hidden",
      background: "#fff",
    },
    item: {
      padding: "10px 12px",
      borderTop: "1px solid rgba(0,0,0,.08)",
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    itemHead: {
      fontWeight: 700,
    },
    itemSub: {
      opacity: 0.7,
      fontSize: 12,
      marginLeft: 8,
    },
    saveBtn: {
      fontSize: 13,
      padding: "6px 10px",
      borderRadius: 6,
      border: "1px solid rgba(0,0,0,.4)",
      background: "#f8fbff",
      cursor: "pointer",
    },
    smallNote: { fontSize: 12, opacity: 0.7, marginTop: 6 },
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.shift}>
        <div style={styles.box}>
          <div style={styles.title}>デフォルト都市検索</div>

          {saved && (
            <div style={styles.savedLine}>
              現在の設定：<strong>{saved.name}</strong>
              {saved.state ? `（${saved.state}）` : ""} / {saved.country}
            </div>
          )}

          <div style={styles.inputWrap}>
            {/* 検索アイコン（SVG） */}
            <svg viewBox="0 0 24 24" style={styles.icon} aria-hidden>
              <circle cx="10.5" cy="10.5" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
              <line x1="16" y1="16" x2="22" y2="22" stroke="currentColor" strokeWidth="2" />
            </svg>

            <input
              style={styles.input}
              placeholder="都市名"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
            />
          </div>

          {error && <div style={styles.err}>{error}</div>}
          {!error && !loading && results.length === 0 && q.trim() && (
            <div style={styles.smallNote}>候補が見つかりませんでした</div>
          )}

          {results.length > 0 && (
            <div style={styles.list}>
              {results.map((it, i) => (
                <div key={`${it.name}-${it.lat}-${it.lon}-${i}`} style={styles.item}>
                  <div>
                    <span style={styles.itemHead}>{it.name}</span>
                    <span style={styles.itemSub}>
                      {it.state ? ` / ${it.state}` : ""} / {it.country}
                    </span>
                  </div>
                  <button style={styles.saveBtn} onClick={() => onSave(it)}>
                    設定
                  </button>
                </div>
              ))}
            </div>
          )}

          {saved && !results.length && !error && (
            <div style={styles.ok}>保存しました：{saved.name}（{saved.country}）</div>
          )}
        </div>
      </div>
    </div>
  );
}
