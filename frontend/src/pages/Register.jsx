import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Toast from '../components/Toast';
import Spinner from '../components/Spinner';
export default function Register() {
  const [form,setForm]=useState({name:'',email:'',password:'',role:'student',bio:''});
  const [loading,setLoading]=useState(false);const [toast,setToast]=useState(null);const [mounted,setMounted]=useState(false);const [showPw,setShowPw]=useState(false);
  const navigate=useNavigate();
  useEffect(()=>{setTimeout(()=>setMounted(true),50);},[]);
  const pwStr=()=>{const p=form.password;if(!p)return 0;let s=0;if(p.length>=6)s++;if(p.length>=10)s++;if(/[A-Z]/.test(p))s++;if(/[0-9]/.test(p))s++;if(/[^A-Za-z0-9]/.test(p))s++;return s;};
  const str=pwStr();const strColor=['#FF4560','#FF4560','#FFB300','#00E676','#00E676'][Math.min(str,4)];const strLabel=['','Weak','Fair','Good','Strong'][Math.min(str,4)];
  const inp={background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,color:'#fff',padding:'14px 18px',fontSize:15,width:'100%',outline:'none',transition:'all 0.3s ease',boxSizing:'border-box'};
  const handleRegister=async()=>{
    if(!form.name||!form.email||!form.password){setToast({msg:'Please fill all fields',type:'warning'});return;}
    setLoading(true);
    try{await api.post('/auth/register',form);setToast({msg:'🎉 Account created! Redirecting...',type:'success'});setTimeout(()=>navigate('/login'),1500);}
    catch(err){setToast({msg:err.response?.data?.error||'Registration failed',type:'error'});}
    finally{setLoading(false);}
  };
  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#0A0A0F',fontFamily:'system-ui,-apple-system,sans-serif'}}>
      {toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      <div style={{flex:1,position:'relative',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',padding:48}}>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,#0A0A0F,#1A1A2E,#0A0A0F)'}}/>
        <div style={{position:'absolute',width:600,height:600,borderRadius:'50%',background:'radial-gradient(circle,rgba(255,107,157,0.2),transparent 70%)',top:'-10%',left:'-20%',filter:'blur(50px)'}}/>
        <div style={{position:'relative',zIndex:1,textAlign:'center'}}>
          <div style={{fontSize:60,marginBottom:20}}>🚀</div>
          <h2 style={{fontSize:34,fontWeight:900,color:'#fff',marginBottom:12}}>Start Your<br/><span style={{background:'linear-gradient(135deg,#FF6B9D,#6C63FF)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Journey Today</span></h2>
          <p style={{color:'#A0A0B8',fontSize:15,lineHeight:1.7,maxWidth:300}}>Join a community of passionate learners. Access expert courses and earn certificates.</p>
        </div>
      </div>
      <div style={{width:500,display:'flex',alignItems:'center',justifyContent:'center',padding:32,overflowY:'auto'}}>
        <div style={{width:'100%',opacity:mounted?1:0,transform:mounted?'translateY(0)':'translateY(30px)',transition:'all 0.6s ease'}}>
          <div style={{textAlign:'center',marginBottom:28}}>
            <div style={{width:52,height:52,borderRadius:14,background:'linear-gradient(135deg,#FF6B9D,#6C63FF)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,margin:'0 auto 14px',boxShadow:'0 0 30px rgba(255,107,157,0.4)'}}>🎓</div>
            <h1 style={{color:'#fff',fontSize:24,fontWeight:800,marginBottom:4}}>Create Account</h1>
            <p style={{color:'#A0A0B8',fontSize:14}}>Join EduFlow today — it's free</p>
          </div>
          <div style={{display:'flex',background:'rgba(255,255,255,0.05)',borderRadius:14,padding:4,marginBottom:18}}>
            {['student','instructor'].map(r=>(
              <button key={r} onClick={()=>setForm({...form,role:r})} style={{flex:1,padding:'10px',borderRadius:10,border:'none',cursor:'pointer',fontSize:14,fontWeight:600,transition:'all 0.3s ease',background:form.role===r?'linear-gradient(135deg,#FF6B9D,#6C63FF)':'transparent',color:form.role===r?'#fff':'#A0A0B8'}}>
                {r==='student'?'👨‍🎓 Student':'👨‍🏫 Instructor'}
              </button>
            ))}
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {[{label:'Full Name',key:'name',placeholder:'Your full name',type:'text'},{label:'Email',key:'email',placeholder:'you@email.com',type:'email'}].map(f=>(
              <div key={f.key}>
                <label style={{color:'#A0A0B8',fontSize:13,marginBottom:6,display:'block'}}>{f.label}</label>
                <input value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})} onFocus={e=>e.target.style.borderColor='#FF6B9D'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'} placeholder={f.placeholder} type={f.type} style={inp}/>
              </div>
            ))}
            <div>
              <label style={{color:'#A0A0B8',fontSize:13,marginBottom:6,display:'block'}}>Password</label>
              <div style={{position:'relative'}}>
                <input value={form.password} onChange={e=>setForm({...form,password:e.target.value})} onFocus={e=>e.target.style.borderColor='#FF6B9D'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'} placeholder="Min 6 characters" type={showPw?'text':'password'} style={inp}/>
                <button onClick={()=>setShowPw(!showPw)} style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:16}}>{showPw?'🙈':'👁'}</button>
              </div>
              {form.password&&(<div style={{marginTop:6}}><div style={{display:'flex',gap:3,marginBottom:3}}>{[1,2,3,4].map(i=><div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=str?strColor:'rgba(255,255,255,0.1)',transition:'background 0.3s ease'}}/>)}</div><span style={{color:strColor,fontSize:12}}>{strLabel}</span></div>)}
            </div>
            {form.role==='instructor'&&(
              <div>
                <label style={{color:'#A0A0B8',fontSize:13,marginBottom:6,display:'block'}}>Bio</label>
                <textarea value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} onFocus={e=>e.target.style.borderColor='#FF6B9D'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'} placeholder="Tell students about yourself..." rows={3} style={{...inp,resize:'vertical',fontFamily:'inherit'}}/>
              </div>
            )}
            <button onClick={handleRegister} disabled={loading} onMouseEnter={e=>{e.target.style.transform='translateY(-2px)';}} onMouseLeave={e=>{e.target.style.transform='translateY(0)';}}
              style={{background:'linear-gradient(135deg,#FF6B9D,#6C63FF)',border:'none',borderRadius:12,color:'#fff',padding:'15px',fontSize:16,fontWeight:700,cursor:loading?'not-allowed':'pointer',transition:'all 0.3s ease',opacity:loading?0.7:1,display:'flex',alignItems:'center',justifyContent:'center',gap:10}}>
              {loading?<><Spinner size={20} color="#fff"/>Creating account...</>:'✨ Create Account'}
            </button>
          </div>
          <p style={{textAlign:'center',color:'#A0A0B8',marginTop:18,fontSize:14}}>Already have an account? <span onClick={()=>navigate('/login')} style={{color:'#FF6B9D',cursor:'pointer',fontWeight:600}}>Sign in</span></p>
        </div>
      </div>
    </div>
  );
}
