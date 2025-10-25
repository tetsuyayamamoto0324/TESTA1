// src/components/QuoteOfTheDay.tsx
function hash32(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) { h = ((h << 5) + h) + str.charCodeAt(i); h |= 0; }
  return h >>> 0;
}

type Props = {
  seed: string;            // "YYYY-MM-DD" (JST)
  title?: string;
  quotes?: string[];
};

const defaultQuotes = [
 "夢はでっかく根はふかく。",
  "誰かの為に生きてこそ、人生には価値がある。",
  "創作は常に冒険である。所詮は人力を尽した後、天命にまかせるより仕方はない。",
  "誰にでも可能性はある、私も最初はゼロだった。",
  "迷ったら一歩だけ進む。",
  "やらない後悔より、やった学び。",
  "可能性を超えたものが、人の心に残る。",
  "深呼吸一回、世界が整う。",
  "未来には、誰でも15分間は世界的な有名人になれるだろう。",
  "すべての者は生まれながらに知恵を求める。",
];

export default function QuoteOfTheDay({
  seed, title = "今日の格言", quotes = defaultQuotes,
}: Props) {
  const idx = quotes.length ? hash32(seed) % quotes.length : 0;
  const quote = quotes[idx] ?? "";

  const styles: Record<string, React.CSSProperties> = {
    wrap: {
    width: "482%",
    alignSelf: "stretch",     // 親が flex でも全幅に
    boxSizing: "border-box",
    background: "#eaf6ff",
    borderBottom: "1px solid rgba(0,0,0,.25)",
    borderTop: "1px solid rgba(0,0,0,.25)",
    boxShadow: "0 2px 10px rgba(0,0,0,.06)",
    marginTop: -1, 
  },
  inner: {
    maxWidth: 1200,
    width: "100%",
    margin: "0 auto",         // ← 中央寄せの肝
    padding: "29px clamp(18px, 2.6vw, 26px)",
    display: "flex",
    gridTemplateColumns: "1fr auto 1fr", // 左=気温, 中央=アイコン, 右=降水
    alignItems: "center",
    gap: 20,
    minHeight: "clamp(56px, 9vh, 100px)",
    flexDirection: "column",
    transform: "translateX(-80px)",
  },
   title: {
    // ★ここで横書きを“強制”
    writingMode: "horizontal-tb",
    rotate: "0deg",
    transform: "none",

    display: "block",
    textAlign: "center",
    fontWeight: 800,
    letterSpacing: ".4px",
    fontSize: "clamp(18px, 2.4vw, 22px)",
    marginBottom: "clamp(16px, 3vh, 28px)",
    color: "rgba(0,0,0,.78)",
    whiteSpace: "nowrap", // 長すぎたら外してOK
  },
  quote: {
    display: "inline-block",
    fontWeight: 900,
    lineHeight: 1.25,
    fontSize: "clamp(22px, 4.6vw, 38px)",
    background: "rgba(255,255,255,0.65)",
    border: "1px solid var(--mantine-color-default-border)",
    borderRadius: 16,
    padding: "21px 29px",
    boxShadow: "0 2px 10px rgba(0,0,0,.04)",
  },
};

  return (
    <section aria-label="今日の格言" style={styles.wrap}>
      <div style={styles.inner}>
        <div style={styles.title}>{title}</div>
        <div style={styles.quote}>{quote}</div>
      </div>
    </section>
  );
}
