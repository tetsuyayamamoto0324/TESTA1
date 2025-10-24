import React from "react";

type Props = { open: boolean; title?: string; message: string; onClose: () => void; onRetry?: () => void; };

export default function ErrorModal({ open, title="エラーが発生しました", message, onClose, onRetry }: Props) {
  if (!open) return null;
  const styles: Record<string, React.CSSProperties> = {
    overlay:{position:"fixed",inset:0,background:"rgba(0,0,0,.22)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:5000},
    modal:{position:"relative",width:420,background:"#fff",borderRadius:12,boxShadow:"0 8px 24px rgba(0,0,0,.18)",padding:16},
    head:{display:"flex",alignItems:"center",gap:10,marginBottom:8},
    badge:{width:20,height:20,borderRadius:9999,background:"#fa5252",color:"#fff",display:"grid",placeItems:"center",fontSize:14,fontWeight:900,lineHeight:1},
    title:{fontWeight:900,fontSize:16},
    msg:{fontSize:14,lineHeight:1.6,whiteSpace:"pre-wrap"},
    footer:{marginTop:12,display:"flex",justifyContent:onRetry?"space-between":"flex-end",gap:8},
    btn:{background:"#fff",border:"1px solid rgba(0,0,0,.85)",borderRadius:8,padding:"8px 16px",fontWeight:800,cursor:"pointer"},
  };
  return (
    <div style={styles.overlay} onClick={(e)=>e.target===e.currentTarget&&onClose()}>
      <div style={styles.modal} role="dialog" aria-modal="true" aria-label="エラーモーダル">
        <div style={styles.head}><div style={styles.badge}>!</div><div style={styles.title}>{title}</div></div>
        <div style={styles.msg}>{message}</div>
        <div style={styles.footer}>
          {onRetry && <button style={styles.btn} onClick={onRetry}>再試行</button>}
          <button style={styles.btn} onClick={onClose}>閉じる</button>
        </div>
      </div>
    </div>
  );
}
