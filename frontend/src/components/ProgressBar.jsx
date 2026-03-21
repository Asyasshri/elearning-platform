import { useEffect, useState } from 'react';
export default function ProgressBar({ percentage=0, height=8, showLabel=true }) {
  const [w, setW] = useState(0);
  useEffect(()=>{ setTimeout(()=>setW(percentage),100); },[percentage]);
  return (
    <div>
      {showLabel && <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><span style={{color:'#A0A0B8',fontSize:13}}>Progress</span><span style={{color:'#fff',fontSize:13,fontWeight:600}}>{Math.round(percentage)}%</span></div>}
      <div style={{background:'rgba(255,255,255,0.08)',borderRadius:100,height,overflow:'hidden'}}>
        <div style={{height:'100%',background:'linear-gradient(135deg,#6C63FF,#00D4FF)',borderRadius:100,width:`${w}%`,transition:'width 1s cubic-bezier(0.4,0,0.2,1)'}}/>
      </div>
    </div>
  );
}
