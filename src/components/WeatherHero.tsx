import React from "react";

type Props = {
  tempC?: number | null;
  iconCode?: string | null;
  pop?: number | null;
  desc?: string | null;
};

export default function WeatherHero({ tempC, iconCode, pop, desc }: Props) {
  const temp = typeof tempC === "number" ? Math.round(tempC) : null;
  const popPct =
    typeof pop === "number" ? Math.round(pop <= 1 ? pop * 100 : pop) : null;

  const styles: Record<string, React.CSSProperties> = {
    // 画面いっぱいの帯（ヘッダーと同じ）
    wrap: {
      width: "100%",
      background: "#eaf6ff",
      borderTop: "1px solid rgba(0,0,0,.15)",
      borderBottom: "1px solid rgba(0,0,0,.15)",
      boxShadow: "0 0 0 rgba(0,0,0,0)", // 影なし
    },
    // 中身は中央に最大幅、左右パディングもヘッダーと同じノリ
    inner: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "16px clamp(12px, 2vw, 20px)",
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center",
      gap: 12,
      minHeight: "clamp(56px, 9vh, 100px)",
    },
    temp: {
      justifySelf: "start",
      fontSize: "clamp(28px, 8vw, 48px)",
      fontWeight: 800,
      letterSpacing: ".5px",
      lineHeight: 1,
    },
    iconBox: {
      justifySelf: "center",
      display: "flex",
      alignItems: "center",
      gap: 8,
      minHeight: 44,
    },
    iconImg: {
      width: "clamp(36px, 12vw, 60px)",
      height: "auto",
    },
    desc: { fontSize: "clamp(12px, 3vw, 14px)", opacity: 0.85 },
    pop: {
      justifySelf: "end",
      textAlign: "right",
      fontSize: "clamp(12px, 3.2vw, 16px)",
      color: "#223",
    },
    popNum: {
      fontSize: "clamp(16px, 4.6vw, 22px)",
      fontWeight: 700,
      marginLeft: 6,
    },
  };

  const iconUrl =
    iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : null;

  return (
    <section style={styles.wrap} aria-label="現在の天気概要">
      <div style={styles.inner}>
        {/* 左：気温（nullなら "—" を表示） */}
        <div style={styles.temp}>{temp !== null ? `${temp}℃` : "—"}</div>

        {/* 中央：アイコン＋説明 */}
        <div style={styles.iconBox}>
          {iconUrl ? (
            <img src={iconUrl} alt={desc ?? "weather"} style={styles.iconImg} />
          ) : (
            <span style={{ fontSize: "clamp(24px, 10vw, 40px)" }}>⛅</span>
          )}
          {desc ? <span style={styles.desc}>{desc}</span> : null}
        </div>

        {/* 右：降水確率 */}
        <div style={styles.pop}>
          降水 <span style={styles.popNum}>{popPct !== null ? `${popPct}%` : "—"}</span>
        </div>
      </div>
    </section>
  );
}
