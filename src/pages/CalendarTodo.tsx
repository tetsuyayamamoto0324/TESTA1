// src/pages/CalendarTodo.tsx
import React, { useMemo, useState } from "react";
import TodoModal from "@/components/TodoModal";
// import ErrorModal from "@/components/ErrorModal"; // 修正: 共通モーダル（ErrorProvider）に統一するため未使用
// import { AppError, normalizeError, messageFor } from "@/lib/appError"; // 修正: 未使用の import を削除
import { AppError } from "@/lib/appError"; // 修正: 必要な型だけ残す
import { z } from "zod";
import { supabase } from "@/lib/supabase"; // 例
import { useError } from "@/contexts/ErrorContext"; // 修正: 共通モーダルを使う

const clip = (text: string, max: number) => {
  // Array.from でコードポイント分割（サロゲート対策）
  const arr = Array.from(text);
  return arr.length <= max ? text : arr.slice(0, max).join("") + "…";
};
/** ローカルストレージ保存キー */
const LS_KEY = "todo-cal-v1";
const LONG_LINE_MAX = 10;   // 長文モード（中央1行表示）の最大文字数
const ITEM_LINE_MAX = 10;

/** 位置と幅（UIを右に寄せたい時は CAL_SHIFT_X を+方向に） */
const CAL_SHIFT_X = 290;
const CAL_SHIFT_Y = 30;
const BOX_W = 840;
const TITLE_SHIFT_X = 440;
const TITLE_SHIFT_Y = -10;
const WEEK_SHIFT_X = 10;
const WEEK_SHIFT_Y = -6;
const ARROW_SIZE = 60;
const SIDE_MONTH_SIZE = 30;
const CENTER_YM_SIZE = 40;
const CENTER_YM_WEIGHT = 900;

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
  const start = new Date(viewYear, viewMonth, 1 - firstDow); // 表の先頭=その週のSun

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

  // ▼ モーダル用
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<Date | null>(null);
  const [modalInitial, setModalInitial] = useState("");
  const [modalShowDelete, setModalShowDelete] = useState(false);

  const showError = useError(); // 修正: ローカルモーダルではなく共通モーダルを使用

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

  const keyFromDate = (d: Date) => ymd(d);

  // ▼ クリックでモーダルを開く
  const editDay = (d: Date) => {
    const key = keyFromDate(d);
    const cur = todos[key] ?? [];
    setModalDate(d);
    setModalInitial(cur.join("\n"));
    setModalShowDelete(cur.length > 0);
    setModalOpen(true);
  };

  const handleDeleteModal = () => {
    if (!modalDate) return;
    const key = ymd(modalDate);

    const nextTodos: TodoMap = { ...todos };
    delete nextTodos[key];

    setTodos(nextTodos);
    saveTodos(nextTodos);

    setModalOpen(false);
    setModalDate(null);
  };

  // ▼ モーダル保存
  const handleSaveModal = (text: string) => {
    if (!modalDate) return;
    const key = keyFromDate(modalDate);

    const lines = text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const nextTodos: TodoMap = { ...todos };
    if (lines.length === 0) delete nextTodos[key];
    else nextTodos[key] = lines;

    setTodos(nextTodos);
    saveTodos(nextTodos);

    setModalOpen(false);
    setModalDate(null);
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
      transform: `translate(${CAL_SHIFT_X}px, ${CAL_SHIFT_Y}px)`,
    },
    box: { width: BOX_W },
    title: {
      fontSize: "clamp(20px, 3.6vw, 32px)",
      fontWeight: 800,
      textAlign: "center",
      marginTop: 24,
      marginBottom: 10,
      transform: `translate(${TITLE_SHIFT_X}px, ${TITLE_SHIFT_Y}px)`,
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
      transform: `translate(${WEEK_SHIFT_X}px, ${WEEK_SHIFT_Y}px)`,
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
      fontSize: SIDE_MONTH_SIZE,
    },
    arrow: {
      fontSize: ARROW_SIZE,
      lineHeight: 1,
      transform: "translateY(-2px)",
    },
    centerYM: {
      fontSize: CENTER_YM_SIZE,
      fontWeight: CENTER_YM_WEIGHT,
    },
    todoOneLineCenter: {
      position: "absolute",
      left: 6,
      right: 6,
      top: "50%",
      transform: "translateY(-40%)", // 日付と被らないよう少し上
      textAlign: "center",
      fontSize: 12,
      lineHeight: 1.3,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    navPrevOffset: { transform: "translate(250px, 8px)" },
    navCenterOffset: { transform: "translate(430px, -6px)" },
    navNextOffset: { transform: "translate(600px, 8px)" },
  }; // ← ここを必ず閉じる！

  const week = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const prevMonthText = (() => {
    const m = new Date(viewYear, viewMonth - 1, 1);
    return `${m.getMonth() + 1}月`;
  })();
  const nextMonthText = (() => {
    const m = new Date(viewYear, viewMonth + 1, 1);
    return `${m.getMonth() + 1}月`;
  })();

  // ▼ 以下の通信系ユーティリティを共通モーダルでラップ（例）
  async function fetchSomething() {
    try {
      const res = await fetch("/api/data");
      if (!res.ok) {
        throw { status: res.status, message: await res.text() }; // normalizeErrorが拾う（ErrorProvider 側）
      }
      return await res.json();
    } catch (e) {
      showError(e, () => fetchSomething()); // 修正: 共通モーダル & 再試行
    }
  }

  // 例2) 新規登録（CREATE_FAIL）
  // スキーマは Zod で検証する例
  const NewTodo = z.object({
    title: z.string().min(1).max(200),
    date: z.string(), // 例: "2025-01-01"
  });

  async function createTodo(input: unknown) {
    // スキーマ検証
    const parsed = NewTodo.safeParse(input);
    if (!parsed.success) {
      showError(new AppError("SCHEMA", parsed.error.issues.map(i => i.message).join("\n"))); // 修正
      return;
    }

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        throw new AppError("CREATE_FAIL", `作成失敗（${res.status}）`);
      }
      // 成功処理...
    } catch (e) {
      showError(e, () => createTodo(input)); // 修正
    }
  }

  async function signUp(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error; // normalizeError は ErrorProvider 内で判定
      // 成功処理...
    } catch (e) {
      showError(e, () => signUp(email, password)); // 修正
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error; // -> AUTH_FAIL
    } catch (e) {
      showError(e, () => signIn(email, password)); // 修正
    }
  }

  return (
    <>
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

                // ★ IIFEをやめて先に判定（読みやすさ向上）
                const first = list[0] ?? "";
                const totalChars = list.join("").length;
                const isLong = first.length >= 8 || totalChars >= 20;

                return (
                  <div
                    key={key}
                    style={{ ...styles.cell, ...(inMonth ? {} : styles.outCell) }}
                    onClick={() => editDay(date)}
                    title="クリックでこの日のToDoを編集"
                  >
                    <div style={styles.dateNum}>{date.getDate()}</div>

                    {/* ★ 三項演算子で分岐 */}
                    {list.length > 0 &&
                      (isLong ? (
                        // ★ 長文：中央1行省略（上限でカット）
                        <div style={styles.todoOneLineCenter} title={first}>
                          {clip(first, LONG_LINE_MAX)}
                        </div>
                      ) : (
                        // ★ 短文：従来のリスト（各行を上限でカット）
                        <div style={styles.todoList}>
                          {list.slice(0, 3).map((t, i) => (
                            <div key={i} style={styles.todoItem} title={t}>
                              {clip(t, ITEM_LINE_MAX)}
                            </div>
                          ))}
                          {list.length > 3 && (
                            <div style={{ ...styles.todoItem, opacity: 0.6 }}>
                              +{list.length - 3} more
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                );
              })}
            </div>

            {/* 下部ナビゲーション（前月/翌月） */}
            <div style={styles.navRow}>
              {/* 左：前月 */}
              <div style={{ ...styles.navBtn, ...styles.navPrevOffset }} onClick={prev}>
                <div style={styles.navTxt}>{prevMonthText}</div>
                <div style={styles.arrow} aria-hidden>
                  ←
                </div>
              </div>

              {/* 中央：年月 */}
              <div style={{ ...styles.centerYM, ...styles.navCenterOffset }}>
                {viewYear} / {titleMonth}
              </div>

              {/* 右：翌月 */}
              <div style={{ ...styles.navBtn, ...styles.navNextOffset }} onClick={next}>
                <div style={styles.navTxt}>{nextMonthText}</div>
                <div style={styles.arrow} aria-hidden>
                  →
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ▼ モーダル */}
      <TodoModal
        open={modalOpen}
        dateText={modalDate ? ymd(modalDate) : ""}
        initialText={modalInitial}
        showDelete={modalShowDelete}          // ★既存維持
        onDelete={handleDeleteModal}
        onSave={handleSaveModal}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
