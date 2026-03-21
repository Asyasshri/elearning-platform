import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Toast from '../../components/Toast';
import ProgressBar from '../../components/ProgressBar';
import Spinner from '../../components/Spinner';
export default function CourseDetail() {
  const {courseId}=useParams();const navigate=useNavigate();
  const [user,setUser]=useState(null);const [course,setCourse]=useState(null);const [videos,setVideos]=useState([]);const [quizzes,setQuizzes]=useState([]);const [progress,setProgress]=useState({});const [enrollment,setEnrollment]=useState(null);const [loading,setLoading]=useState(true);const [toast,setToast]=useState(null);
  useEffect(()=>{const u=JSON.parse(localStorage.getItem('user')||'null');setUser(u);fetchAll();},[courseId]);
  const fetchAll=async()=>{
    try{
      const[coursesRes,videosRes,quizzesRes,enrollRes]=await Promise.all([api.get('/courses'),api.get(`/videos/course/${courseId}`),api.get(`/quizzes/course/${courseId}`),api.get('/courses/my-courses')]);
      setCourse(coursesRes.data.find(c=>String(c.courseid)===String(courseId)));
      setVideos(videosRes.data);setQuizzes(quizzesRes.data);
      const enroll=enrollRes.data.find(e=>String(e.courseid)===String(courseId));setEnrollment(enroll);
      if(enroll){const pm={};for(const v of videosRes.data){try{const r=await api.get(`/videos/${v.videoid}/status/${enroll.enrollmentid}`);pm[v.videoid]=r.data;}catch{}}setProgress(pm);}
    }catch{setToast({msg:'Failed to load',type:'error'});}finally{setLoading(false);}
  };
  const completedCount=Object.values(progress).filter(p=>p?.IsCompleted||p?.iscompleted).length;
  const pct=videos.length>0?Math.round((completedCount/videos.length)*100):0;
  if(loading)return<div style={{background:'#0A0A0F',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><Spinner size={48}/></div>;
  return (
    <div style={{background:'#0A0A0F',minHeight:'100vh',fontFamily:'system-ui,-apple-system,sans-serif'}}>
      {toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      <Navbar user={user}/><Sidebar role="student"/>
      <div style={{marginLeft:240,paddingTop:64,display:'flex',minHeight:'100vh'}}>
        <div style={{width:300,borderRight:'1px solid rgba(255,255,255,0.06)',position:'sticky',top:64,height:'calc(100vh - 64px)',overflowY:'auto'}}>
          <div style={{padding:'20px 16px',background:'linear-gradient(135deg,#1A1A2E,#111118)',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
            <button onClick={()=>navigate('/student')} style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#A0A0B8',padding:'6px 12px',cursor:'pointer',fontSize:12,marginBottom:12}}>← Back</button>
            <h2 style={{color:'#fff',fontSize:15,fontWeight:700,marginBottom:6,lineHeight:1.4}}>{course?.title}</h2>
            <p style={{color:'#A0A0B8',fontSize:12,marginBottom:12}}>👨‍🏫 {course?.instructorname}</p>
            <ProgressBar percentage={pct} showLabel={true}/>
          </div>
          <div style={{padding:'8px 10px'}}>
            <div style={{color:'#A0A0B8',fontSize:11,fontWeight:600,padding:'10px 8px 6px',textTransform:'uppercase',letterSpacing:1}}>📹 Videos ({videos.length})</div>
            {videos.map((v,i)=>{
              const done=progress[v.videoid]?.IsCompleted||progress[v.videoid]?.iscompleted;
              return(
                <div key={v.videoid} onClick={()=>enrollment&&navigate(`/student/video/${v.videoid}/${enrollment.enrollmentid}`)}
                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(108,99,255,0.1)';}} onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.02)';}}
                  style={{display:'flex',alignItems:'center',gap:10,padding:'10px',borderRadius:10,cursor:enrollment?'pointer':'default',background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.04)',marginBottom:5,transition:'all 0.2s ease'}}>
                  <div style={{width:26,height:26,borderRadius:'50%',background:done?'rgba(0,230,118,0.2)':'rgba(108,99,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,flexShrink:0,color:done?'#00E676':'#6C63FF',fontWeight:700}}>{done?'✓':i+1}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{color:'#fff',fontSize:12,fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v.title}</div>
                    <div style={{color:'#505070',fontSize:11}}>Week {v.weeknumber}</div>
                  </div>
                  <span style={{fontSize:12}}>{done?'✅':'▶️'}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{flex:1,padding:'32px 32px',overflowY:'auto'}}>
          <div style={{color:'#A0A0B8',fontSize:13,marginBottom:20}}>
            <span onClick={()=>navigate('/student')} style={{cursor:'pointer',color:'#6C63FF'}}>Dashboard</span> › <span>{course?.title}</span>
          </div>
          <div style={{background:'linear-gradient(135deg,rgba(108,99,255,0.15),rgba(0,212,255,0.08))',border:'1px solid rgba(108,99,255,0.2)',borderRadius:20,padding:'24px',marginBottom:28}}>
            <h1 style={{color:'#fff',fontSize:22,fontWeight:800,marginBottom:10}}>{course?.title}</h1>
            <p style={{color:'#A0A0B8',lineHeight:1.7,marginBottom:16,fontSize:14}}>{course?.description}</p>
            <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
              {[{l:`📹 ${videos.length} Videos`,c:'#6C63FF'},{l:`📝 ${quizzes.length} Quizzes`,c:'#00D4FF'},{l:`⏱ ${course?.durationmonths}mo`,c:'#FF6B9D'},{l:`${pct}% Done`,c:'#00E676'}].map((b,i)=>(
                <div key={i} style={{background:`rgba(0,0,0,0.3)`,border:`1px solid ${b.c}33`,borderRadius:20,padding:'5px 14px',color:b.c,fontSize:12,fontWeight:600}}>{b.l}</div>
              ))}
            </div>
          </div>
          {quizzes.length>0&&(
            <div>
              <h2 style={{color:'#fff',fontSize:18,fontWeight:700,marginBottom:16}}>📝 Quizzes</h2>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {quizzes.map(q=>(
                  <div key={q.quizid} onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(0,212,255,0.3)';}} onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.07)';}} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,padding:'18px 22px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,transition:'all 0.3s ease'}}>
                    <div>
                      <div style={{color:'#fff',fontWeight:600,marginBottom:3,fontSize:15}}>{q.title}</div>
                      <div style={{color:'#A0A0B8',fontSize:12}}>📅 {q.scheduleddate?.slice(0,10)} • Week {q.week_number}</div>
                    </div>
                    <button onClick={()=>navigate(`/student/quiz/${q.quizid}`)} onMouseEnter={e=>e.target.style.background='linear-gradient(135deg,#00D4FF,#6C63FF)'} onMouseLeave={e=>e.target.style.background='rgba(0,212,255,0.15)'} style={{background:'rgba(0,212,255,0.15)',border:'1px solid rgba(0,212,255,0.3)',borderRadius:10,color:'#00D4FF',padding:'9px 18px',cursor:'pointer',fontSize:13,fontWeight:600,transition:'all 0.3s ease',whiteSpace:'nowrap'}}>📝 Attempt</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
