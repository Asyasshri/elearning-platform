import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Landing() {
  const navigate = useNavigate();
  useEffect(()=>{
    const s=document.createElement('style');
    s.textContent=`@keyframes float1{0%,100%{transform:translate(0,0);}50%{transform:translate(30px,-40px);}}@keyframes float2{0%,100%{transform:translate(0,0);}50%{transform:translate(-20px,30px);}}@keyframes shimmer{0%{background-position:0% 50%;}100%{background-position:200% 50%;}}@keyframes fadeUp{from{opacity:0;transform:translateY(40px);}to{opacity:1;transform:translateY(0);}}`;
    document.head.appendChild(s);
    return ()=>document.head.removeChild(s);
  },[]);
  const features=[{icon:'🎥',title:'Structured Video Learning',desc:'Daily weekday lectures by expert instructors, delivered in perfect sequence.'},{icon:'📝',title:'Weekly Quizzes',desc:'Weekend assessments to test knowledge and track your progress every week.'},{icon:'🏆',title:'Verified Certificates',desc:'Earn certificates upon 100% course completion and showcase your skills.'}];
  const stats=[{icon:'👨‍🎓',num:'10,000+',label:'Active Students'},{icon:'📚',num:'150+',label:'Expert Courses'},{icon:'🎓',num:'8,500+',label:'Certificates'},{icon:'⭐',num:'4.9',label:'Rating'}];
  return (
    <div style={{background:'#0A0A0F',minHeight:'100vh',color:'#fff',fontFamily:'system-ui,-apple-system,sans-serif'}}>
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,background:'rgba(10,10,15,0.85)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 48px',height:70}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#6C63FF,#00D4FF)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>⚡</div>
          <span style={{fontSize:20,fontWeight:800,background:'linear-gradient(135deg,#6C63FF,#00D4FF)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>EduFlow</span>
        </div>
        <div style={{display:'flex',gap:12}}>
          <button onClick={()=>navigate('/login')} style={{background:'transparent',border:'1px solid rgba(108,99,255,0.5)',borderRadius:12,color:'#6C63FF',padding:'10px 24px',cursor:'pointer',fontSize:14,fontWeight:600}}>Login</button>
          <button onClick={()=>navigate('/register')} style={{background:'linear-gradient(135deg,#6C63FF,#00D4FF)',border:'none',borderRadius:12,color:'#fff',padding:'10px 24px',cursor:'pointer',fontSize:14,fontWeight:600}}>Get Started</button>
        </div>
      </nav>
      <div style={{position:'relative',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',paddingTop:70}}>
        <div style={{position:'absolute',width:600,height:600,borderRadius:'50%',background:'radial-gradient(circle,rgba(108,99,255,0.2),transparent 70%)',top:'5%',left:'-15%',animation:'float1 8s ease-in-out infinite',filter:'blur(40px)'}}/>
        <div style={{position:'absolute',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(0,212,255,0.15),transparent 70%)',top:'20%',right:'-10%',animation:'float2 10s ease-in-out infinite',filter:'blur(40px)'}}/>
        <div style={{position:'relative',zIndex:1,textAlign:'center',maxWidth:800,padding:'0 24px',animation:'fadeUp 1s ease forwards'}}>
          <h1 style={{fontSize:'clamp(48px,8vw,80px)',fontWeight:900,lineHeight:1.1,marginBottom:24,background:'linear-gradient(135deg,#fff 30%,#6C63FF 60%,#00D4FF 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Learn Without<br/>Limits</h1>
          <p style={{fontSize:18,color:'#A0A0B8',lineHeight:1.7,marginBottom:48}}>Master new skills with structured courses, interactive quizzes, and verified certificates.</p>
          <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
            <button onClick={()=>navigate('/register')} style={{background:'linear-gradient(135deg,#6C63FF,#00D4FF)',border:'none',borderRadius:14,color:'#fff',padding:'16px 40px',fontSize:16,fontWeight:700,cursor:'pointer',boxShadow:'0 8px 32px rgba(108,99,255,0.4)'}}>🚀 Start Learning Free</button>
            <button onClick={()=>navigate('/login')} style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:14,color:'#fff',padding:'16px 40px',fontSize:16,fontWeight:700,cursor:'pointer'}}>👀 Sign In</button>
          </div>
        </div>
      </div>
      <div style={{padding:'80px 48px',background:'#111118'}}>
        <div style={{textAlign:'center',marginBottom:56}}>
          <h2 style={{fontSize:40,fontWeight:800,marginBottom:12}}>Everything you need to <span style={{background:'linear-gradient(135deg,#6C63FF,#00D4FF)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>succeed</span></h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:24,maxWidth:1000,margin:'0 auto'}}>
          {features.map((f,i)=>(
            <div key={i} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-8px)';e.currentTarget.style.borderColor='rgba(108,99,255,0.4)';}} onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.borderColor='rgba(255,255,255,0.07)';}}
              style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:24,padding:36,transition:'all 0.35s ease',backdropFilter:'blur(10px)'}}>
              <div style={{fontSize:44,marginBottom:16}}>{f.icon}</div>
              <h3 style={{fontSize:19,fontWeight:700,marginBottom:10}}>{f.title}</h3>
              <p style={{color:'#A0A0B8',lineHeight:1.7,fontSize:15}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:'60px 48px',background:'#0A0A0F'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:20,maxWidth:800,margin:'0 auto'}}>
          {stats.map((s,i)=>(
            <div key={i} style={{background:'rgba(108,99,255,0.08)',border:'1px solid rgba(108,99,255,0.15)',borderRadius:20,padding:'28px 20px',textAlign:'center'}}>
              <div style={{fontSize:32,marginBottom:10}}>{s.icon}</div>
              <div style={{fontSize:32,fontWeight:900,background:'linear-gradient(135deg,#6C63FF,#00D4FF)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{s.num}</div>
              <div style={{color:'#A0A0B8',fontSize:13,marginTop:4}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <footer style={{padding:'32px 48px',borderTop:'1px solid rgba(255,255,255,0.06)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontWeight:700,background:'linear-gradient(135deg,#6C63FF,#00D4FF)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>⚡ EduFlow</span>
        <span style={{color:'#505070',fontSize:14}}>© 2024 EduFlow. All rights reserved.</span>
      </footer>
    </div>
  );
}
