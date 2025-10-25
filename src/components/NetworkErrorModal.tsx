type Props = {
  open: boolean;
  onClose?: () => void;     // 任意。閉じれても、オフライン中は再表示されます
};

export default function NetworkErrorModal({ open, onClose }: Props) {
  if (!open) return null;

  const styles: Record<string, React.CSSProperties> = {
    overlay:{position:"fixed",inset:0,background:"rgba(0,0,0,.22)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:6000},
    modal:{position:"relative",width:440,background:"#fff",borderRadius:12,boxShadow:"0 8px 24px rgba(0,0,0,.18)",padding:16},
    head:{display:"flex",alignItems:"center",gap:10,marginBottom:8},
    badge:{width:20,height:20,borderRadius:9999,background:"#495057",color:"#fff",display:"grid",placeItems:"center",fontSize:12,fontWeight:900,lineHeight:1},
    title:{fontWeight:900,fontSize:16},
    msg:{fontSize:14,lineHeight:1.6,whiteSpace:"pre-wrap"},
    tip:{fontSize:12,opacity:.8,marginTop:8},
    footer:{marginTop:12,display:"flex",justifyContent:"flex-end"},
    btn:{background:"#fff",border:"1px solid rgba(0,0,0,.85)",borderRadius:8,padding:"8px 16px",fontWeight:800,cursor:"pointer"},
  };

  return (
    <div style={styles.overlay} onClick={(e)=>e.target===e.currentTarget && onClose?.()}>
      <div style={styles.modal} role="dialog" aria-modal="true" aria-label="ネットワークエラーモーダル">
        <div style={styles.head}>
          <div style={styles.badge}>!</div>
          <div style={styles.title}>通信できません</div>
        </div>
        <div style={styles.msg}>
          ネットワークに接続できません。回線・Wi-Fi をご確認ください。<br/>
          復旧すると自動で閉じます。
        </div>
        <div style={styles.tip}>
          それでもダメな場合：ブラウザの拡張機能やプロキシ、VPN、企業ネットワークの制限をご確認ください。
        </div>
        <div style={styles.footer}>
          <button type="button" style={styles.btn} onClick={onClose}>閉じる</button>
        </div>
      </div>
    </div>
  );
}
