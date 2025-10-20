import React, { useMemo, useState } from "react";

/** ローカルストレージ保存キー */
const LS_KEY = "todo-cal-v1";

/** 位置と幅（UIを右に寄せたい時は CAL_SHIFT_X を+方向に） */
const CAL_SHIFT_X = 290;   // カレンダー全体を右へ
const CAL_SHIFT_Y = -50;     // 上下位置（必要なら負の値）
const BOX_W = 840;
const TITLE_SHIFT_X = 440;   // 水平方向（px）
const TITLE_SHIFT_Y = -10;
const WEEK_SHIFT_X = 10;   // 右へ +、左へ −
const WEEK_SHIFT_Y = -6;   // 垂直方向（px）        // カレンダーの見た目幅（表＋見出しの基準）
const ARROW_SIZE       = 60;  // 矢印
const SIDE_MONTH_SIZE  = 30;  // 左右「◯月」
const CENTER_YM_SIZE   = 40;  // 中央「YYYY / M」
const CENTER_YM_WEIGHT = 900; // 太さ

/** 日付 → "YYYY-MM-DD" */
const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

type TodoMap = Record<string, string[]>;

function loadTodos(): TodoMap {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as TodoMap) : {};
  } catch {
    return {};
  }
}
function saveTodos(v: TodoMap) {
  localStorage.setItem(LS_KEY, JSON.stringify(v));
}

/** 指定月(0-11)のカレンダー 6週×7列（42マス）を返す */
function buildMonthMatrix(viewYear: number, viewMonth: number) {
  const first = new Date(viewYear, viewMonth, 1);
  const firstDow = first.getDay(); // 0: Sun
  // 表の先頭 = 「その週のSun」
  const start = new Date(viewYear, viewMonth, 1 - firstDow);

  const cells: { date: Date; inMonth: boolean }[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push({ date: d, inMonth: d.getMonth() === viewMonth });
  }
  return cells;
}

export default function CalendarTodo() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-11
  const [todos, setTodos] = useState<TodoMap>(() => loadTodos());

  const cells = useMemo(
    () => buildMonthMatrix(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const titleMonth = viewMonth + 1;

  const prev = () => {
    const m = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(m.getFullYear());
    setViewMonth(m.getMonth());
  };
  const next = () => {
    const m = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(m.getFullYear());
    setViewMonth(m.getMonth());
  };

  const editDay = (d: Date) => {
    const key = ymd(d);
    const cur = todos[key] ?? [];
    const initial = cur.join("\n");
    const input = window.prompt(
      `この日のToDo（1行1件）\n空で保存すると削除します`,
      initial
    );
    if (input === null) return; // cancel
    const lines = input
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const nextTodos: TodoMap = { ...todos };
    if (lines.length === 0) delete nextTodos[key];
    else nextTodos[key] = lines;

    setTodos(nextTodos);
    saveTodos(nextTodos);
  };

  const styles: Record<string, React.CSSProperties> = {
    wrap: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "16px clamp(12px, 2vw, 20px) 80px",
    },

    /** ← ここで全体をまとめて動かす（中身は触らない） */
    shift: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      transform: `translate(${CAL_SHIFT_X}px, ${CAL_SHIFT_Y}px)`,
    },

    /** カレンダー本体の箱（幅を固定して中央に） */
    box: {
      width: BOX_W,
    },

    title: {
    fontSize: "clamp(20px, 3.6vw, 32px)",
    fontWeight: 800,
    textAlign: "center",
    marginTop: 24,
    marginBottom: 10,
    transform: `translate(${TITLE_SHIFT_X}px, ${TITLE_SHIFT_Y}px)`, // ★追加
  },

    weekHead: {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: 0,
  margin: "12px auto 6px",
  width: "295%",
  fontWeight: 800,
  letterSpacing: ".5px",
  columnGap: 24,  
  transform: `translate(${WEEK_SHIFT_X}px, ${WEEK_SHIFT_Y}px)`, // ★追加
},
    weekCell: {
      textAlign: "center",
      padding: "8px 4px",
      opacity: 0.9,
    },

    grid: {
      margin: "0 auto",
      width: "300%",
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gap: 0,
      border: "1px solid rgba(0,0,0,.25)",
      borderRight: "none",
      borderBottom: "none",
      background: "#fff",
    },
    cell: {
      borderRight: "1px solid rgba(0,0,0,.25)",
      borderBottom: "1px solid rgba(0,0,0,.25)",
      minHeight: 60,
      padding: 8,
      position: "relative",
      background: "#fff",
      cursor: "pointer",
    },
    outCell: {
      background: "#f6fafc",
      color: "rgba(0,0,0,.5)",
    },
    dateNum: {
      position: "absolute",
      top: 6,
      left: 8,
      fontWeight: 700,
      fontSize: 14,
      opacity: 0.9,
    },
    todoList: {
      marginTop: 20,
      display: "flex",
      flexDirection: "column",
      gap: 4,
    },
    todoItem: {
      fontSize: 12,
      lineHeight: 1.3,
      padding: "2px 4px",
      borderRadius: 4,
      background: "rgba(0,0,0,.04)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },

    navRow: {
      margin: "14px auto 0",
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "#111",
    },
    navBtn: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
      cursor: "pointer",
      userSelect: "none",
    },
     navTxt: {
    fontWeight: 800,
    fontSize: SIDE_MONTH_SIZE,     // ← 左右「◯月」の文字サイズ
  },

  arrow: {
    fontSize: ARROW_SIZE,          // ← 矢印サイズ
    lineHeight: 1,
    transform: "translateY(-2px)", // 既存の調整が必要なら残す
  },

  centerYM: {
    fontSize: CENTER_YM_SIZE,      // ← 中央「YYYY / M」の文字サイズ
    fontWeight: CENTER_YM_WEIGHT,
  },

    navPrevOffset: { transform: "translate(250px, 8px)" },    // 左ブロック（←）を左へ40 / 下へ8
    navCenterOffset: { transform: "translate(430px, -6px)" }, // 中央の「YYYY / M」を右へ20 / 上へ6
    navNextOffset: { transform: "translate(600px, 8px)" },
  };

  const week = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const prevMonthText = (() => {
    const m = new Date(viewYear, viewMonth - 1, 1);
    return `${m.getMonth() + 1}月`;
  })();
  const nextMonthText = (() => {
    const m = new Date(viewYear, viewMonth + 1, 1);
    return `${m.getMonth() + 1}月`;
  })();

  return (
    <div style={styles.wrap}>
      <div style={styles.shift}>
        <div style={styles.box}>
          <div style={styles.title}>ToDoカレンダー</div>

          {/* 曜日ヘッダ */}
          <div style={styles.weekHead}>
            {week.map((w) => (
              <div key={w} style={styles.weekCell}>
                {w}
              </div>
            ))}
          </div>

          {/* 本体グリッド（7×6） */}
          <div style={styles.grid}>
            {cells.map(({ date, inMonth }) => {
              const key = ymd(date);
              const list = todos[key] ?? [];
              return (
                <div
                  key={key}
                  style={{ ...styles.cell, ...(inMonth ? {} : styles.outCell) }}
                  onClick={() => editDay(date)}
                  title="クリックでこの日のToDoを編集"
                >
                  <div style={styles.dateNum}>{date.getDate()}</div>
                  {list.length > 0 && (
                    <div style={styles.todoList}>
                      {list.slice(0, 3).map((t, i) => (
                        <div key={i} style={styles.todoItem}>
                          {t}
                        </div>
                      ))}
                      {list.length > 3 && (
                        <div style={{ ...styles.todoItem, opacity: 0.6 }}>
                          +{list.length - 3} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 下部ナビゲーション（前月/翌月） */}
          <div style={styles.navRow}>
  {/* 左：前月 */}
  <div style={{ ...styles.navBtn, ...styles.navPrevOffset }} onClick={prev}>
    <div style={styles.navTxt}>{prevMonthText}</div>
    <div style={styles.arrow} aria-hidden>←</div>
  </div>

  {/* 中央：年月（サイズ指定を centerYM に） */}
  <div style={{ ...styles.centerYM, ...styles.navCenterOffset }}>
    {viewYear} / {titleMonth}
  </div>

  {/* 右：翌月 */}
  <div style={{ ...styles.navBtn, ...styles.navNextOffset }} onClick={next}>
    <div style={styles.navTxt}>{nextMonthText}</div>
    <div style={styles.arrow} aria-hidden>→</div>
  </div>
</div>
        </div>
      </div>
    </div>
  );
}
