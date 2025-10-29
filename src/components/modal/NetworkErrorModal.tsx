// src/components/NetworkErrorModal.tsx
import React from "react";

type Props = {
  open: boolean;
  // onClose?: () => void; // 修正: 閉じる操作を廃止するため未使用に
};

export default function NetworkErrorModal({ open }: Props) { // 修正
  if (!open) return null;

  const styles: Record<string, React.CSSProperties> = {
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.22)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 6000,
    },
    modal: {
      position: "relative",
      width: 440,
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 8px 24px rgba(0,0,0,.18)",
      padding: 16,
    },
    head: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 },
    badge: {
      width: 20,
      height: 20,
      borderRadius: 9999,
      background: "#495057",
      color: "#fff",
      display: "grid",
      placeItems: "center",
      fontSize: 12,
      fontWeight: 900,
      lineHeight: 1,
    },
    title: { fontWeight: 900, fontSize: 16 },
    msg: { fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" },
    tip: { fontSize: 12, opacity: 0.8, marginTop: 8 },
    // footer と btn は削除（閉じるボタン廃止） // 修正
  };

  return (
    <div
      style={styles.overlay}
      // onClick={(e)=>e.target===e.currentTarget && onClose?.()} // 修正: クリックで閉じない
      role="presentation" // 追記: 背景は操作不可
    >
      <div
        style={styles.modal}
        role="alertdialog" // 修正: 重要通知として提示
        aria-modal="true"
        aria-label="ネットワークエラーモーダル"
        // onKeyDown={(e)=> e.key==='Escape' && onClose?.()} // 修正: Escapeでも閉じない
      >
        <div style={styles.head}>
          <div style={styles.badge}>!</div>
          <div style={styles.title}>オフラインです</div>
        </div>
        <div style={styles.msg}>
          ネットワークに接続できません。回線・Wi-Fi をご確認ください。<br />
          復旧すると自動で閉じます。（201）
        </div>
        <div style={styles.tip}>
          それでもダメな場合：ブラウザの拡張機能やプロキシ、VPN、企業ネットワークの制限をご確認ください。
        </div>
        {/* フッター/ボタンなし（常時表示） */} {/* 修正 */}
      </div>
    </div>
  );
}
