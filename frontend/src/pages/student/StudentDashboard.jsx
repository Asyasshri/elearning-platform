import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Toast from '../../components/Toast';
import CircularProgress from '../../components/CircularProgress';
import Spinner from '../../components/Spinner';
export default function StudentDashboard() {
  const [user,setUser]=useState(null);const [courses,setCourses]=useState([]);const [enrolled,setEnrolled]=useState([]);const [loading,setLoading]=useState(true);const [toast,setToast]=useState(null);const [enrolling,setEnrolling]=useState(null);
  const navigate=useNavigate();
  useEffect(()=>{const u=JSON.parse(localStorage.getItem('user')||'null');setUser(u);fetchData();},[]);
  const fetchData=async()=>{try{const[c,e]=await Promise.all([api.get('/courses'),api.get('/courses/my-courses')]);setCourses(c.data);setEnrolled(e.data);}catch{setToast({msg:'Failed to load',type:'error'});}finally{setLoading(false);}};
  const enroll=async(courseId)=>{setEnrolling(courseId);try{await api.post(`/courses/${courseId}/enroll`);setToast({msg:'🎉 Enrolled!',type:'success'});fetchData();}catch(err){setToast({msg:err.response?.data?.error||'Failed',type:'error'});}finally{setEnrolling(null);}};
  const enrolledIds=enrolled.map(e=>e.courseid);const available=courses.filter(c=>!enrolledIds.includes(c.courseid));
  const greet=()=>{const h=new Date().getHours();if(h<12)return'Good morning';if(h<17)return'Good afternoon';return'Good evening';};
  const card={background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:20,transition:'all 0.35s ease'};
  return (
    <div style={{background:'#0A0A0F',minHeight:'100vh',fontFamily:'system-ui,-apple-system,sans-serif'}}>
      {toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      <Navbar user={user}/><Sidebar role="student"/>
      <div style={{marginLeft:240,paddingTop:64}}>
        <div style={{padding:'32px 36px'}}>
          <div style={{marginBottom:28}}>
            <h1 style={{color:'#fff',fontSize:26,fontWeight:800,marginBottom:4}}>{greet()}, {user?.name?.split(' ')[0]} 👋</h1>
            <p style={{color:'#A0A0B8',fontSize:14}}>{new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:16,marginBottom:36}}>
            {[{icon:'📚',label:'Enrolled Courses',value:enrolled.length,g:'linear-gradient(135deg,#6C63FF,#00D4FF)'},{icon:'⭐',label:'Total Points',value:user?.points||0,g:'linear-gradient(135deg,#FFD700,#FF8C00)'},{icon:'✅',label:'Completed',value:enrolled.filter(e=>e.status==='Completed').length,g:'linear-gradient(135deg,#00E676,#00B0FF)'}].map((s,i)=>(
              <div key={i} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-6px)';}} onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';}} style={{...card,padding:'22px 24px',cursor:'default'}}>
                <div style={{fontSize:28,marginBottom:10}}>{s.icon}</div>
                <div style={{fontSize:32,fontWeight:900,background:s.g,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{s.value}</div>
                <div style={{color:'#A0A0B8',fontSize:13,marginTop:3}}>{s.label}</div>
              </div>
            ))}
          </div>
          {enrolled.length>0&&(
            <div style={{marginBottom:40}}>
              <h2 style={{color:'#fff',fontSize:20,fontWeight:700,marginBottom:16}}>📖 My Courses</h2>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:18}}>
                {enrolled.map(course=>{
                  const pct=course.progress_percentage||0;
                  return (
                    <div key={course.enrollmentid} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-8px)';e.currentTarget.style.borderColor='rgba(108,99,255,0.4)';}} onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.borderColor='rgba(255,255,255,0.07)';}} style={{...card,padding:'22px',cursor:'pointer'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
                        <div style={{flex:1,marginRight:10}}>
                          <div style={{fontSize:11,color:'#6C63FF',fontWeight:600,marginBottom:5,textTransform:'uppercase',letterSpacing:1}}>Course</div>
                          <h3 style={{color:'#fff',fontSize:15,fontWeight:700,lineHeight:1.4,marginBottom:5}}>{course.title}</h3>
                          <p style={{color:'#A0A0B8',fontSize:12}}>👨‍🏫 {course.instructorname||'Instructor'}</p>
                        </div>
                        <CircularProgress percentage={pct} size={58} color="#6C63FF"/>
                      </div>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:14}}>
                        <div style={{fontSize:11,fontWeight:600,padding:'3px 10px',borderRadius:20,background:course.status==='Completed'?'rgba(0,230,118,0.15)':'rgba(108,99,255,0.15)',color:course.status==='Completed'?'#00E676':'#6C63FF',border:`1px solid ${course.status==='Completed'?'rgba(0,230,118,0.3)':'rgba(108,99,255,0.3)'}`}}>{course.status==='Completed'?'✅ Completed':'⏳ In Progress'}</div>
                        <button onClick={()=>navigate(`/student/course/${course.courseid}`)} onMouseEnter={e=>e.target.style.background='linear-gradient(135deg,#6C63FF,#00D4FF)'} onMouseLeave={e=>e.target.style.background='rgba(108,99,255,0.15)'} style={{background:'rgba(108,99,255,0.15)',border:'1px solid rgba(108,99,255,0.3)',borderRadius:8,color:'#6C63FF',padding:'7px 14px',cursor:'pointer',fontSize:12,fontWeight:600,transition:'all 0.3s ease'}}>Continue →</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div>
            <h2 style={{color:'#fff',fontSize:20,fontWeight:700,marginBottom:16}}>🌟 Available Courses</h2>
            {loading?<div style={{display:'flex',justifyContent:'center',padding:60}}><Spinner size={40}/></div>:available.length===0?<div style={{...card,padding:48,textAlign:'center'}}><div style={{fontSize:48,marginBottom:12}}>🎉</div><p style={{color:'#A0A0B8'}}>You're enrolled in all courses!</p></div>:(
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:18}}>
                {available.map(course=>(
                  <div key={course.courseid} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-8px)';e.currentTarget.style.borderColor='rgba(0,212,255,0.4)';}} onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.borderColor='rgba(255,255,255,0.07)';}} style={{...card,padding:'22px'}}>
                    <div style={{fontSize:11,color:'#00D4FF',fontWeight:600,marginBottom:6,textTransform:'uppercase',letterSpacing:1}}>{course.durationmonths} Month{course.durationmonths>1?'s':''}</div>
                    <h3 style={{color:'#fff',fontSize:15,fontWeight:700,marginBottom:6,lineHeight:1.4}}>{course.title}</h3>
                    <p style={{color:'#A0A0B8',fontSize:12,marginBottom:4}}>👨‍🏫 {course.instructorname}</p>
                    <p style={{color:'#505070',fontSize:12,lineHeight:1.6,marginBottom:16}}>{course.description?.slice(0,70)}...</p>
                    <button onClick={()=>enroll(course.courseid)} disabled={enrolling===course.courseid} style={{width:'100%',background:'linear-gradient(135deg,#00D4FF,#6C63FF)',border:'none',borderRadius:10,color:'#fff',padding:'11px',fontSize:13,fontWeight:700,cursor:enrolling===course.courseid?'not-allowed':'pointer',transition:'all 0.3s ease',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                      {enrolling===course.courseid?<><Spinner size={14} color="#fff"/>Enrolling...</>:'➕ Enroll Now'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
