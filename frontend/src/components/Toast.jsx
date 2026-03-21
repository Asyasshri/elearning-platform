import { useEffect, useState } from 'react';
export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => { setVisible(false); setTimeout(onClose, 300); }, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  const c = { success: { border: '#00E676', icon: '✅' }, error: { border: '#FF4560', icon: '❌' }, warning: { border: '#FFB300', icon: '⚠️' } }[type];
  return (
    <div style={{ position:'fixed',top:24,right:24,zIndex:9999,background:'rgba(17,17,24,0.95)',border:`1px solid ${c.border}`,borderLeft:`4px solid ${c.border}`,borderRadius:14,padding:'16px 20px',display:'flex',alignItems:'center',gap:12,backdropFilter:'blur(20px)',boxShadow:'0 8px 32px rgba(0,0,0,0.4)',transform:visible?'translateX(0)':'translateX(120%)',opacity:visible?1:0,transition:'all 0.35s cubic-bezier(0.4,0,0.2,1)',minWidth:280,maxWidth:380 }}>
      <span style={{fontSize:20}}>{c.icon}</span>
      <span style={{color:'#fff',fontSize:14,fontWeight:500,flex:1}}>{message}</span>
      <button onClick={()=>{setVisible(false);setTimeout(onClose,300)}} style={{background:'none',border:'none',color:'#666',cursor:'pointer',fontSize:18}}>×</button>
    </div>
  );
}
