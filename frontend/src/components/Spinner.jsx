export default function Spinner({ size = 24, color = '#6C63FF' }) {
  return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
      <div style={{width:size,height:size,border:`3px solid rgba(108,99,255,0.2)`,borderTop:`3px solid ${color}`,borderRadius:'50%',animation:'spin 0.8s linear infinite',display:'inline-block'}}/>
    </>
  );
}
