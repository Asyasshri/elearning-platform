import { useNavigate } from 'react-router-dom';
export default function Navbar({ user }) {
  const navigate = useNavigate();
  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); };
  const initials = user?.name?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)||'U';
  return (
    <div style={{position:'fixed',top:0,left:0,right:0,height:64,zIndex:1000,background:'rgba(10,10,15,0.9)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',padding:'0 24px',gap:16}}>
      <div style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer'}} onClick={()=>navigate(user?.role==='instructor'?'/instructor':'/student')}>
        <div style={{width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#6C63FF,#00D4FF)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>⚡</div>
        <span style={{fontSize:18,fontWeight:800,background:'linear-gradient(135deg,#6C63FF,#00D4FF)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>EduFlow</span>
      </div>
      <div style={{flex:1}}/>
      {user?.role==='student'&&<div style={{background:'rgba(255,215,0,0.1)',border:'1px solid rgba(255,215,0,0.3)',borderRadius:20,padding:'6px 14px',display:'flex',alignItems:'center',gap:6}}><span>⭐</span><span style={{color:'#FFD700',fontWeight:700,fontSize:14}}>{user?.points||0} pts</span></div>}
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <div style={{width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#6C63FF,#FF6B9D)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:'#fff'}}>{initials}</div>
        <span style={{color:'#A0A0B8',fontSize:14}}>{user?.name?.split(' ')[0]}</span>
      </div>
      <button onClick={logout} onMouseEnter={e=>e.target.style.background='rgba(255,69,96,0.2)'} onMouseLeave={e=>e.target.style.background='rgba(255,255,255,0.06)'} style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,color:'#A0A0B8',padding:'8px 16px',cursor:'pointer',fontSize:13,transition:'all 0.3s ease'}}>🚪 Logout</button>
    </div>
  );
}
