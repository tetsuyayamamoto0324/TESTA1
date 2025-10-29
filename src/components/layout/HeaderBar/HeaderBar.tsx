import React, { useState } from "react";
import Modal from "@/components/modal/Modal";
import { useAuth } from "@/store/auth";
import { triggerRefetch } from "@/lib/refetchBus";
import s from "./HeaderBar.module.css"; // ← 追加

type Props = {
  date?: Date;
  city?: string;
  onMenuClick?: () => void;
  onCityClick?: () => void;
  onRefetchWeather?: () => Promise<void> | void;
};

const jpWeek = ["日", "月", "火", "水", "木", "金", "土"];

export default function HeaderBar({
  date = new Date(),
  city,
  onMenuClick,
  onCityClick,
  onRefetchWeather,
}: Props) {
  const cityLabel = city && city.trim() ? city : "東京都";
  const { user, signOut } = useAuth();

  const month = date.getMonth() + 1;
  const d = date.getDate();
  const dow = jpWeek[date.getDay()];

  const [menuOpen, setMenuOpen] = useState(false);
  const [refetching, setRefetching] = useState(false);
  const [refetchMsg, setRefetchMsg] = useState("");

  const handleRefetchClick = async () => {
    try {
      setRefetchMsg("");
      setRefetching(true);
      if (onRefetchWeather) {
        await onRefetchWeather();
        setRefetchMsg("最新の天気を取得しました");
        return;
      }
      const executed = await triggerRefetch();
      setRefetchMsg(executed ? "最新の天気を取得しました" : "この画面では再取得できません");
    } catch {
      setRefetchMsg("取得に失敗しました");
    } finally {
      setRefetching(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } finally {
      setMenuOpen(false);
    }
  };

  return (
    <>
      <header className={s.header}>
        <div className={s.inner}>
          <div className={s.dateText}>
            {month}/{d}
          </div>

          <button
            type="button"
            aria-label="都市を変更"
            onClick={onCityClick}
            className={s.cityBtn}
            title="都市を変更"
          >
            <span className={s.cityText}>{cityLabel}</span>
            <span className={s.dowText}>（{dow}）</span>
          </button>

          <button
            type="button"
            className={s.menuBtn}
            onClick={() => {
              onMenuClick?.();
              setMenuOpen(true);
            }}
            aria-label="メニュー"
          >
            menu
          </button>
        </div>
      </header>

      <div className={s.spacer} />

      <Modal open={menuOpen} onClose={() => setMenuOpen(false)}>
        <div
          className={s.modalWrap}
          style={
            {
              "--modal-shift-x": "150px",
              "--modal-shift-y": "0px",
              "--title-offset-x": "5px",
              "--title-offset-y": "0px",
              "--email-offset-x": "0px",
              "--refetch-offset-x": "40px",
              "--refetch-offset-y": "0px",
              "--logout-offset-x": "33px",
              "--logout-offset-y": "0px",
              "--refetch-align": "flex-start",
              "--logout-align": "flex-start",
            } as React.CSSProperties
          }
        >
          <div className={s.modalTitle}>ログイン中のユーザー</div>

          <div className={s.emailRow}>
            <span className={s.emailText}>{user?.email ?? "（未ログイン）"}</span>
          </div>

          <div className={s.refetchRow}>
            <button
              type="button"
              onClick={handleRefetchClick}
              disabled={refetching}
              className={s.refetchBtn}
            >
              {refetching ? "再取得中…" : "再取得"}
            </button>
            <span className={s.note}>{refetchMsg}</span>
          </div>

          <hr className={s.hr} />

          <div className={s.logoutRow}>
            <button type="button" className={s.logoutBtn} onClick={handleLogout}>
              ログアウト
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
