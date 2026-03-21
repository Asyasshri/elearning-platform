import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Toast from '../../components/Toast';
import Spinner from '../../components/Spinner';
export default function CreateQuiz() {
  const {courseId}=useParams();const navigate=useNavigate();
  const [user,setUser]=useState(null);const [form,setForm]=useState({title:'',week_number:'',quiz_date:''});const [questions,setQuestions]=useState([{text:'',a:'',b:'',c:'',d:'',correct:'a'}]);const [submitting,setSubmitting]=useState(false);const [toast,setToast]=useState(null);
  useEffect(()=>{const u=JSON.parse(localStorage.getItem('user')||'null');setUser(u);},[]);
  const isWeekday=d=>{if(!d)return false;const day=new Date(d).getDay();return day!==0&&day!==6;};
  const handleDateChange=e=>{const val=e.target.value;setForm({...form,quiz_date:val});if(val&&isWeekday(val))setToast({msg:'❌ Weekends only! Sat or Sun',type:'error'});};
  const addQ=()=>setQuestions([...questions,{text:'',a:'',b:'',c:'',d:'',correct:'a'}]);
  const removeQ=i=>setQuestions(questions.filter((_,qi)=>qi!==i));
  const upQ=(i,f,v)=>{const q=[...questions];q[i][f]=v;setQuestions(q);};
  const handleSubmit=async()=>{
    if(!form.title||!form.quiz_date||!form.week_number){setToast({msg:'Fill all fields',type:'warning'});return;}
    if(isWeekday(form.quiz_date)){setToast({msg:'Quiz must be on weekend',type:'error'});return;}
    setSubmitting(true);
    try{await api.post('/quizzes',{course_id:courseId,title:form.title,week_number:form.week_number,quiz_date:form.quiz_date,questions});setToast({msg:'🎉 Quiz created!',type:'success'});setTimeout(()=>navigate('/instructor'),1500);}
    catch(err){setToast({msg:err.response?.data?.error||'Failed',type:'error'});}
    finally{setSubmitting(false);}
  };
  const inp={background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,color:'#fff',padding:'11px 14px',fontSize:13,width:'100%',outline:'none',transition:'all 0.3s ease',boxSizing:'border-box'};
  return (
    <div style={{background:'#0A0A0F',minHeight:'100vh',fontFamily:'system-ui,-apple-system,sans-serif'}}>
      {toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      <Navbar user={user}/><Sidebar role="instructor"/>
      <div style={{marginLeft:240,paddingTop:64}}>
        <div style={{padding:'36px',maxWidth:760}}>
          <button onClick={()=>navigate('/instructor')} style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,color:'#A0A0B8',padding:'7px 14px',cursor:'pointer',fontSize:13,marginBottom:24}}>← Back</button>
          <h1 style={{color:'#fff',fontSize:24,fontWeight:800,marginBottom:6}}>📝 Create Quiz</h1>
          <p style={{color:'#A0A0B8',marginBottom:28,fontSize:13}}>Course ID: {courseId}</p>
          <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:18,padding:'24px',marginBottom:20}}>
            <h3 style={{color:'#fff',fontWeight:700,marginBottom:16,fontSize:16}}>Quiz Details</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14}}>
              <div><label style={{color:'#A0A0B8',fontSize:12,marginBottom:6,display:'block'}}>Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} onFocus={e=>e.target.style.borderColor='#6C63FF'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'} placeholder="Week 1 Quiz" style={inp}/></div>
              <div><label style={{color:'#A0A0B8',fontSize:12,marginBottom:6,display:'block'}}>Week #</label><input value={form.week_number} onChange={e=>setForm({...form,week_number:e.target.value})} onFocus={e=>e.target.style.borderColor='#6C63FF'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'} placeholder="1" type="number" style={inp}/></div>
              <div><label style={{color:'#A0A0B8',fontSize:12,marginBottom:6,display:'block'}}>Date</label><input value={form.quiz_date} onChange={handleDateChange} type="date" style={{...inp,borderColor:form.quiz_date&&isWeekday(form.quiz_date)?'#FF4560':'rgba(255,255,255,0.1)'}}/><p style={{color:'#FFB300',fontSize:10,marginTop:3}}>⚠️ Sat & Sun only</p></div>
            </div>
          </div>
          <div style={{marginBottom:20}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
              <h3 style={{color:'#fff',fontWeight:700,fontSize:16}}>Questions ({questions.length})</h3>
              <button onClick={addQ} onMouseEnter={e=>e.target.style.background='linear-gradient(135deg,#6C63FF,#00D4FF)'} onMouseLeave={e=>e.target.style.background='rgba(108,99,255,0.15)'} style={{background:'rgba(108,99,255,0.15)',border:'1px solid rgba(108,99,255,0.3)',borderRadius:9,color:'#6C63FF',padding:'8px 18px',cursor:'pointer',fontSize:13,fontWeight:600,transition:'all 0.3s ease'}}>➕ Add</button>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              {questions.map((q,i)=>(
                <div key={i} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,padding:'20px',position:'relative'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                    <div style={{width:26,height:26,borderRadius:'50%',background:'linear-gradient(135deg,#6C63FF,#00D4FF)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#fff'}}>{i+1}</div>
                    {questions.length>1&&<button onClick={()=>removeQ(i)} style={{background:'rgba(255,69,96,0.1)',border:'1px solid rgba(255,69,96,0.2)',borderRadius:7,color:'#FF4560',padding:'3px 10px',cursor:'pointer',fontSize:12}}>✕</button>}
                  </div>
                  <textarea value={q.text} onChange={e=>upQ(i,'text',e.target.value)} placeholder="Enter question..." rows={2} style={{...inp,resize:'vertical',fontFamily:'inherit',marginBottom:12}}/>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
                    {['a','b','c','d'].map(opt=>(
                      <div key={opt} style={{display:'flex',alignItems:'center',gap:6}}>
                        <span style={{color:'#6C63FF',fontWeight:700,width:16,fontSize:12}}>{opt.toUpperCase()}</span>
                        <input value={q[opt]} onChange={e=>upQ(i,opt,e.target.value)} placeholder={`Option ${opt.toUpperCase()}`} style={{...inp,flex:1}}/>
                      </div>
                    ))}
                  </div>
                  <div style={{display:'flex',gap:6}}>
                    {['a','b','c','d'].map(opt=>(
                      <button key={opt} onClick={()=>upQ(i,'correct',opt)} style={{flex:1,padding:'7px',borderRadius:7,border:`1px solid ${q.correct===opt?'#00E676':'rgba(255,255,255,0.1)'}`,background:q.correct===opt?'rgba(0,230,118,0.15)':'rgba(255,255,255,0.04)',color:q.correct===opt?'#00E676':'#A0A0B8',cursor:'pointer',fontWeight:700,fontSize:12,transition:'all 0.2s ease'}}>{opt.toUpperCase()}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={handleSubmit} disabled={submitting} onMouseEnter={e=>{e.target.style.transform='translateY(-2px)';}} onMouseLeave={e=>{e.target.style.transform='translateY(0)';}} style={{width:'100%',background:'linear-gradient(135deg,#6C63FF,#00D4FF)',border:'none',borderRadius:12,color:'#fff',padding:'14px',fontSize:15,fontWeight:700,cursor:submitting?'not-allowed':'pointer',transition:'all 0.3s ease',opacity:submitting?0.7:1,display:'flex',alignItems:'center',justifyContent:'center',gap:10}}>
            {submitting?<><Spinner size={18} color="#fff"/>Creating...</>:'🚀 Create Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
}
