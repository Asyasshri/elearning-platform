import { useEffect, useState } from 'react';
export default function CircularProgress({ percentage=0, size=80, strokeWidth=7, color='#6C63FF' }) {
  const [prog, setProg] = useState(0);
  const r = (size - strokeWidth*2)/2;
  const circ = 2*Math.PI*r;
  useEffect(()=>{ setTimeout(()=>setProg(percentage),200); },[percentage]);
  return (
    <div style={{position:'relative',width:size,height:size}}>
      <svg width={size} height={size} style={{transform:'rotate(-90deg)'}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={circ} strokeDashoffset={circ-(prog/100)*circ} strokeLinecap="round" style={{transition:'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)'}}/>
      </svg>
      <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:size<60?11:14,fontWeight:700,color:'#fff'}}>{Math.round(prog)}%</div>
    </div>
  );
}
