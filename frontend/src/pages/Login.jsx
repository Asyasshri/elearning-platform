import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Toast from '../components/Toast';
import Spinner from '../components/Spinner';
export default function Login() {
  const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [role,setRole]=useState('student');const [showPw,setShowPw]=useState(false);const [loading,setLoading]=useState(false);const [toast,setToast]=useState(null);const [mounted,setMounted]=useState(false);
  const navigate=useNavigate();
  useEffect(()=>{setTimeout(()=>setMounted(true),50);},[]);
  const inp={background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,color:'#fff',padding:'14px 18px',fontSize:15,width:'100%',outline:'none',transition:'all 0.3s ease',boxSizing:'border-box'};
  const handleLogin=async()=>{
    if(!email||!password){setToast({msg:'Please fill all fields',type:'warning'});return;}
    setLoading(true);
    try{const res=await api.post('/auth/login',{email,password,role});localStorage.setItem('token',res.data.token);localStorage.setItem('user',JSON.stringify(res.data.user));navigate(role==='instructor'?'/instructor':'/student');}
    catch(err){setToast({msg:err.response?.data?.error||'Login failed',type:'error'});}
    finally{setLoading(false);}
  };
  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#0A0A0F',fontFamily:'system-ui,-apple-system,sans-serif'}}>
      {toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      <div style={{flex:1,position:'relative',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',padding:48}}>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,#0A0A0F,#1A1A2E,#0A0A0F)'}}/>
        <div style={{position:'absolute',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(108,99,255,0.25),transparent 70%)',top:'10%',left:'-20%',filter:'blur(40px)'}}/>
        <div style={{position:'relative',zIndex:1,textAlign:'center'}}>
          <div style={{fontSize:60,marginBottom:20}}>🎓</div>
          <h2 style={{fontSize:34,fontWeight:900,color:'#fff',marginBottom:12}}>Welcome to<br/><span style={{background:'linear-gradient(135deg,#6C63FF,#00D4FF)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>EduFlow</span></h2>
          <p style={{color:'#A0A0B8',fontSize:15,lineHeight:1.7,maxWidth:280}}>Your journey to mastery begins here. Join thousands of learners today.</p>
        </div>
      </div>
      <div style={{width:460,display:'flex',alignItems:'center',justifyContent:'center',padding:32}}>
        <div style={{width:'100%',opacity:mounted?1:0,transform:mounted?'translateY(0)':'translateY(30px)',transition:'all 0.6s ease'}}>
          <div style={{textAlign:'center',marginBottom:32}}>
            <div style={{width:52,height:52,borderRadius:14,background:'linear-gradient(135deg,#6C63FF,#00D4FF)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,margin:'0 auto 16px',boxShadow:'0 0 30px rgba(108,99,255,0.4)'}}>⚡</div>
            <h1 style={{color:'#fff',fontSize:26,fontWeight:800,marginBottom:6}}>Welcome Back</h1>
            <p style={{color:'#A0A0B8',fontSize:14}}>Sign in to continue learning</p>
          </div>
          <div style={{display:'flex',background:'rgba(255,255,255,0.05)',borderRadius:14,padding:4,marginBottom:20}}>
            {['student','instructor'].map(r=>(
              <button key={r} onClick={()=>setRole(r)} style={{flex:1,padding:'10px',borderRadius:10,border:'none',cursor:'pointer',fontSize:14,fontWeight:600,transition:'all 0.3s ease',background:role===r?'linear-gradient(135deg,#6C63FF,#00D4FF)':'transparent',color:role===r?'#fff':'#A0A0B8'}}>
                {r==='student'?'👨‍🎓 Student':'👨‍🏫 Instructor'}
              </button>
            ))}
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div>
              <label style={{color:'#A0A0B8',fontSize:13,marginBottom:6,display:'block'}}>Email</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} onFocus={e=>e.target.style.borderColor='#6C63FF'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'} placeholder="you@email.com" type="email" style={inp}/>
            </div>
            <div>
              <label style={{color:'#A0A0B8',fontSize:13,marginBottom:6,display:'block'}}>Password</label>
              <div style={{position:'relative'}}>
                <input value={password} onChange={e=>setPassword(e.target.value)} onFocus={e=>e.target.style.borderColor='#6C63FF'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'} onKeyDown={e=>e.key==='Enter'&&handleLogin()} placeholder="••••••••" type={showPw?'text':'password'} style={inp}/>
                <button onClick={()=>setShowPw(!showPw)} style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:16}}>{showPw?'🙈':'👁'}</button>
              </div>
            </div>
            <button onClick={handleLogin} disabled={loading} onMouseEnter={e=>{if(!loading){e.target.style.transform='translateY(-2px)';e.target.style.boxShadow='0 8px 32px rgba(108,99,255,0.5)';}}} onMouseLeave={e=>{e.target.style.transform='translateY(0)';e.target.style.boxShadow='0 4px 20px rgba(108,99,255,0.3)';}}
              style={{background:'linear-gradient(135deg,#6C63FF,#00D4FF)',border:'none',borderRadius:12,color:'#fff',padding:'15px',fontSize:16,fontWeight:700,cursor:loading?'not-allowed':'pointer',transition:'all 0.3s ease',opacity:loading?0.7:1,display:'flex',alignItems:'center',justifyContent:'center',gap:10}}>
              {loading?<><Spinner size={20} color="#fff"/>Signing in...</>:'🚀 Sign In'}
            </button>
          </div>
          <p style={{textAlign:'center',color:'#A0A0B8',marginTop:20,fontSize:14}}>Don't have an account? <span onClick={()=>navigate('/register')} style={{color:'#6C63FF',cursor:'pointer',fontWeight:600}}>Register here</span></p>
        </div>
      </div>
    </div>
  );
}
