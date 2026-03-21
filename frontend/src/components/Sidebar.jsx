import { useNavigate, useLocation } from 'react-router-dom';
const studentNav = [{icon:'🏠',label:'Dashboard',path:'/student'},{icon:'🏆',label:'Certificates',path:'/student/certificates'}];
const instructorNav = [{icon:'🏠',label:'Dashboard',path:'/instructor'},{icon:'📹',label:'Upload Video',path:'/instructor'},{icon:'📝',label:'Create Quiz',path:'/instructor'}];
export default function Sidebar({ role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const nav = role==='instructor'?instructorNav:studentNav;
  return (
    <div style={{position:'fixed',top:64,left:0,width:240,bottom:0,zIndex:900,background:'rgba(17,17,24,0.95)',backdropFilter:'blur(20px)',borderRight:'1px solid rgba(255,255,255,0.06)',padding:'20px 12px',display:'flex',flexDirection:'column',gap:4}}>
      {nav.map(item=>{
        const active=location.pathname===item.path;
        return (
          <div key={item.label} onClick={()=>navigate(item.path)}
            onMouseEnter={e=>{if(!active)e.currentTarget.style.background='rgba(255,255,255,0.05)';}}
            onMouseLeave={e=>{if(!active)e.currentTarget.style.background='transparent';}}
            style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',borderRadius:12,cursor:'pointer',background:active?'linear-gradient(135deg,rgba(108,99,255,0.2),rgba(0,212,255,0.1))':'transparent',borderLeft:active?'3px solid #6C63FF':'3px solid transparent',transition:'all 0.25s ease'}}>
            <span style={{fontSize:18}}>{item.icon}</span>
            <span style={{color:active?'#fff':'#A0A0B8',fontWeight:active?600:400,fontSize:14}}>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
