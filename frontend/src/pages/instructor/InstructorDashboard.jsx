import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Toast from '../../components/Toast';
import Spinner from '../../components/Spinner';
export default function InstructorDashboard() {
  const [user,setUser]=useState(null);const [courses,setCourses]=useState([]);const [loading,setLoading]=useState(true);const [creating,setCreating]=useState(false);const [toast,setToast]=useState(null);
  const [form,setForm]=useState({title:'',description:'',duration_months:1,start_date:''});
  const navigate=useNavigate();
  useEffect(()=>{const u=JSON.parse(localStorage.getItem('user')||'null');setUser(u);fetchCourses();},[]);
  const fetchCourses=()=>{api.get('/courses').then(r=>{setCourses(r.data);setLoading(false);}).catch(()=>setLoading(false));};
  const createCourse=async()=>{
    if(!form.title||!form.start_date){setToast({msg:'Fill title and start date',type:'warning'});return;}
    setCreating(true);
    try{await api.post('/courses',form);setToast({msg:'🎉 Course created!',type:'success'});setForm({title:'',description:'',duration_months:1,start_date:''});fetchCourses();}
    catch(err){setToast({msg:err.response?.data?.error||'Failed',type:'error'});}
    finally{setCreating(false);}
  };
  const inp={background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,color:'#fff',padding:'13px 16px',fontSize:14,width:'100%',outline:'none',transition:'all 0.3s ease',boxSizing:'border-box'};
  const u=JSON.parse(localStorage.getItem('user')||'null');
  const myCourses=courses.filter(c=>String(c.instructorid)===String(u?.id));
  return (
    <div style={{background:'#0A0A0F',minHeight:'100vh',fontFamily:'system-ui,-apple-system,sans-serif'}}>
      {toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      <Navbar user={user}/><Sidebar role="instructor"/>
      <div style={{marginLeft:240,paddingTop:64}}>
        <div style={{padding:'32px 36px'}}>
          <div style={{marginBottom:28}}>
            <h1 style={{color:'#fff',fontSize:26,fontWeight:800,marginBottom:4}}>Instructor Dashboard 👨‍🏫</h1>
            <p style={{color:'#A0A0B8',fontSize:14}}>Manage your courses, upload videos, and create quizzes</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:16,marginBottom:36}}>
            {[{icon:'📚',label:'My Courses',value:myCourses.length,g:'linear-gradient(135deg,#6C63FF,#00D4FF)'},{icon:'📹',label:'Videos',value:'—',g:'linear-gradient(135deg,#FF6B9D,#6C63FF)'},{icon:'👨‍🎓',label:'Students',value:'—',g:'linear-gradient(135deg,#00D4FF,#00E676)'}].map((s,i)=>(
              <div key={i} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-5px)';}} onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';}} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:18,padding:'22px',transition:'all 0.3s ease'}}>
                <div style={{fontSize:28,marginBottom:10}}>{s.icon}</div>
                <div style={{fontSize:30,fontWeight:900,background:s.g,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{s.value}</div>
                <div style={{color:'#A0A0B8',fontSize:13,marginTop:3}}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:22,padding:'28px',marginBottom:36}}>
            <h2 style={{color:'#fff',fontSize:18,fontWeight:700,marginBottom:20}}>➕ Create New Course</h2>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
              <div>
                <label style={{color:'#A0A0B8',fontSize:12,marginBottom:6,display:'block'}}>Course Title</label>
                <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} onFocus={e=>e.target.style.borderColor='#6C63FF'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'} placeholder="e.g. Intro to Python" style={inp}/>
              </div>
              <div>
                <label style={{color:'#A0A0B8',fontSize:12,marginBottom:6,display:'block'}}>Start Date</label>
                <input value={form.start_date} onChange={e=>setForm({...form,start_date:e.target.value})} onFocus={e=>e.target.style.borderColor='#6C63FF'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'} type="date" style={inp}/>
              </div>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{color:'#A0A0B8',fontSize:12,marginBottom:6,display:'block'}}>Description</label>
              <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} onFocus={e=>e.target.style.borderColor='#6C63FF'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'} placeholder="What will students learn?" rows={2} style={{...inp,resize:'vertical',fontFamily:'inherit'}}/>
            </div>
            <div style={{marginBottom:20}}>
              <label style={{color:'#A0A0B8',fontSize:12,marginBottom:10,display:'block'}}>Duration</label>
              <div style={{display:'flex',gap:8}}>
                {[1,2,3].map(d=>(
                  <button key={d} onClick={()=>setForm({...form,duration_months:d})} style={{flex:1,padding:'11px',borderRadius:10,border:`1px solid ${form.duration_months===d?'#6C63FF':'rgba(255,255,255,0.1)'}`,background:form.duration_months===d?'linear-gradient(135deg,rgba(108,99,255,0.3),rgba(0,212,255,0.2))':'rgba(255,255,255,0.04)',color:form.duration_months===d?'#fff':'#A0A0B8',cursor:'pointer',fontWeight:600,fontSize:13,transition:'all 0.3s ease'}}>
                    {d} Month{d>1?'s':''}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={createCourse} disabled={creating} onMouseEnter={e=>{e.target.style.transform='translateY(-2px)';}} onMouseLeave={e=>{e.target.style.transform='translateY(0)';}} style={{background:'linear-gradient(135deg,#6C63FF,#00D4FF)',border:'none',borderRadius:12,color:'#fff',padding:'13px 28px',fontSize:14,fontWeight:700,cursor:creating?'not-allowed':'pointer',transition:'all 0.3s ease',opacity:creating?0.7:1,display:'flex',alignItems:'center',gap:8}}>
              {creating?<><Spinner size={16} color="#fff"/>Creating...</>:'🚀 Create Course'}
            </button>
          </div>
          <h2 style={{color:'#fff',fontSize:20,fontWeight:700,marginBottom:16}}>📚 My Courses</h2>
          {loading?<div style={{display:'flex',justifyContent:'center',padding:40}}><Spinner size={40}/></div>:(
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:18}}>
              {myCourses.map(course=>(
                <div key={course.courseid} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-6px)';e.currentTarget.style.borderColor='rgba(108,99,255,0.3)';}} onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.borderColor='rgba(255,255,255,0.07)';}} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:18,padding:'22px',transition:'all 0.35s ease'}}>
                  <div style={{fontSize:10,color:'#6C63FF',fontWeight:600,marginBottom:6,textTransform:'uppercase',letterSpacing:1}}>{course.durationmonths} Month Course</div>
                  <h3 style={{color:'#fff',fontSize:15,fontWeight:700,marginBottom:14,lineHeight:1.4}}>{course.title}</h3>
                  <div style={{display:'flex',gap:8}}>
                    <button onClick={()=>navigate(`/instructor/upload/${course.courseid}`)} onMouseEnter={e=>e.target.style.background='linear-gradient(135deg,#6C63FF,#00D4FF)'} onMouseLeave={e=>e.target.style.background='rgba(108,99,255,0.15)'} style={{flex:1,background:'rgba(108,99,255,0.15)',border:'1px solid rgba(108,99,255,0.3)',borderRadius:9,color:'#6C63FF',padding:'9px',cursor:'pointer',fontSize:12,fontWeight:600,transition:'all 0.3s ease'}}>📹 Upload</button>
                    <button onClick={()=>navigate(`/instructor/quiz/${course.courseid}`)} onMouseEnter={e=>e.target.style.background='linear-gradient(135deg,#00D4FF,#6C63FF)'} onMouseLeave={e=>e.target.style.background='rgba(0,212,255,0.15)'} style={{flex:1,background:'rgba(0,212,255,0.15)',border:'1px solid rgba(0,212,255,0.3)',borderRadius:9,color:'#00D4FF',padding:'9px',cursor:'pointer',fontSize:12,fontWeight:600,transition:'all 0.3s ease'}}>📝 Quiz</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
