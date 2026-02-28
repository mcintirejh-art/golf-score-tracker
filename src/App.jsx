import React, { useState, useEffect } from "react";

const PAR_OPTIONS = [3, 4, 5];
const defaultPars = (holes) => Array(holes).fill(4);
const defaultScores = (holes) => Array(holes).fill("");

const style = document.createElement("style");
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { margin: 0; background: #008080; }
  select, input, button { font-family: 'VT323', monospace; }

  .win-btn {
    background: #c0c0c0;
    border-top: 2px solid #fff;
    border-left: 2px solid #fff;
    border-right: 2px solid #808080;
    border-bottom: 2px solid #808080;
    cursor: pointer;
    font-family: 'VT323', monospace;
    font-size: 16px;
    padding: 4px 12px;
    color: #000;
    outline: none;
  }
  .win-btn:active {
    border-top: 2px solid #808080;
    border-left: 2px solid #808080;
    border-right: 2px solid #fff;
    border-bottom: 2px solid #fff;
    padding: 5px 11px 3px 13px;
  }
  .win-btn-primary {
    background: #1a5c38;
    color: #fff;
    border-top: 2px solid #4ade80;
    border-left: 2px solid #4ade80;
    border-right: 2px solid #0a2e1c;
    border-bottom: 2px solid #0a2e1c;
  }
  .win-btn-primary:active {
    border-top: 2px solid #0a2e1c;
    border-left: 2px solid #0a2e1c;
    border-right: 2px solid #4ade80;
    border-bottom: 2px solid #4ade80;
    padding: 5px 11px 3px 13px;
  }
  .win-btn-danger {
    background: #c0c0c0;
    color: #c00000;
    font-weight: bold;
  }
  .win-input {
    background: #fff;
    border-top: 2px solid #808080;
    border-left: 2px solid #808080;
    border-right: 2px solid #fff;
    border-bottom: 2px solid #fff;
    padding: 4px 8px;
    font-family: 'VT323', monospace;
    font-size: 18px;
    outline: none;
    width: 100%;
    color: #000;
    box-sizing: border-box;
    display: block;
    max-width: 100%;
    WebkitAppearance: none;
    appearance: none;
  }
  .win-select {
    background: #fff;
    border-top: 2px solid #808080;
    border-left: 2px solid #808080;
    border-right: 2px solid #fff;
    border-bottom: 2px solid #fff;
    padding: 4px 8px;
    font-family: 'VT323', monospace;
    font-size: 18px;
    outline: none;
    width: 100%;
    color: #000;
  }
  .win-panel {
    background: #c0c0c0;
    border-top: 2px solid #fff;
    border-left: 2px solid #fff;
    border-right: 2px solid #808080;
    border-bottom: 2px solid #808080;
  }
  .win-inset {
    background: #c0c0c0;
    border-top: 2px solid #808080;
    border-left: 2px solid #808080;
    border-right: 2px solid #fff;
    border-bottom: 2px solid #fff;
  }
  .win-title-bar {
    background: linear-gradient(90deg, #000080, #1084d0);
    color: #fff;
    font-family: 'VT323', monospace;
    font-size: 18px;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
  }
  .win-title-bar.green {
    background: linear-gradient(90deg, #1a5c38, #2d8a57);
  }
  .win-title-btns {
    display: flex;
    gap: 2px;
  }
  .win-title-btn {
    width: 18px;
    height: 16px;
    background: #c0c0c0;
    border-top: 2px solid #fff;
    border-left: 2px solid #fff;
    border-right: 2px solid #808080;
    border-bottom: 2px solid #808080;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-family: 'VT323', monospace;
    color: #000;
    cursor: pointer;
    flex-shrink: 0;
  }
  table.win-table { border-collapse: collapse; width: 100%; }
  table.win-table th {
    background: #1a5c38;
    color: #f0c040;
    font-family: 'VT323', monospace;
    font-size: 15px;
    padding: 3px 4px;
    text-align: center;
    border: 1px solid #0a2e1c;
  }
  table.win-table td {
    font-family: 'VT323', monospace;
    font-size: 16px;
    text-align: center;
    border: 1px solid #808080;
    padding: 2px 3px;
  }
  .statusbar {
    background: #c0c0c0;
    border-top: 2px solid #808080;
    padding: 2px 8px;
    font-family: 'VT323', monospace;
    font-size: 15px;
    color: #000;
    display: flex;
    gap: 8px;
  }
  .statusbar-cell {
    border-top: 1px solid #808080;
    border-left: 1px solid #808080;
    border-right: 1px solid #fff;
    border-bottom: 1px solid #fff;
    padding: 1px 8px;
    flex: 1;
    text-align: center;
  }
  ::-webkit-scrollbar { width: 16px; height: 16px; }
  ::-webkit-scrollbar-track { background: #c0c0c0; }
  ::-webkit-scrollbar-thumb { background: #c0c0c0; border-top: 2px solid #fff; border-left: 2px solid #fff; border-right: 2px solid #808080; border-bottom: 2px solid #808080; }
`;
document.head.appendChild(style);

function calcStats(scores, pars) {
  let eagles=0,birdies=0,parsC=0,bogeys=0,doubles=0,total=0,vspar=0;
  scores.forEach((s,i)=>{
    if(s===""||s===null||s===undefined) return;
    const n=parseInt(s),p=pars[i];
    total+=n; vspar+=n-p;
    const d=n-p;
    if(d<=-2) eagles++;
    else if(d===-1) birdies++;
    else if(d===0) parsC++;
    else if(d===1) bogeys++;
    else doubles++;
  });
  return {eagles,birdies,pars:parsC,bogeys,doubles,total,vspar};
}

function cellColor(score,par){
  if(score===""||score===null) return "#fff";
  const d=parseInt(score)-par;
  if(d<=-2) return "#1a5c38";
  if(d===-1) return "#86efac";
  if(d===0) return "#fff";
  if(d===1) return "#fca5a5";
  return "#ef4444";
}
function cellTextColor(score,par){
  if(score===""||score===null) return "#000";
  const d=parseInt(score)-par;
  if(d<=-2) return "#f0c040";
  return d>=2?"#fff":"#000";
}
function hcpDiff(score,par){ return((score-par)*113/113).toFixed(1); }

const PLAYER_COLORS=["#1a5c38","#000080","#800000","#804000"];
const PLAYER_LABELS=["P1","P2","P3","P4"];

function WinWindow({title,children,onBack,green}){
  return(
    <div className="win-panel" style={{margin:8,display:"flex",flexDirection:"column",minHeight:"calc(100vh - 16px)"}}>
      <div className={`win-title-bar${green?" green":""}`}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          {onBack&&<div className="win-title-btn" onClick={onBack}>◄</div>}
          <span>⛳ {title}</span>
        </div>
        <div className="win-title-btns">
          <div className="win-title-btn">_</div>
          <div className="win-title-btn">□</div>
          <div className="win-title-btn" style={{color:"#c00000",fontWeight:"bold"}}>✕</div>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:8}}>
        {children}
      </div>
    </div>
  );
}

function WinLabel({children}){
  return <div style={{fontFamily:"'VT323',monospace",fontSize:17,color:"#000",marginBottom:3}}>{children}</div>;
}

function WinField({label,children}){
  return(
    <div style={{marginBottom:10}}>
      <WinLabel>{label}</WinLabel>
      {children}
    </div>
  );
}

function ConfirmModal({message,onYes,onNo}){
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,padding:24}}>
      <div className="win-panel" style={{maxWidth:300,width:"100%"}}>
        <div className="win-title-bar">
          <span>⚠ Confirm</span>
          <div className="win-title-btns"><div className="win-title-btn" style={{color:"#c00000",fontWeight:"bold"}}>✕</div></div>
        </div>
        <div style={{padding:16,textAlign:"center"}}>
          <div style={{fontFamily:"'VT323',monospace",fontSize:20,marginBottom:16}}>{message}</div>
          <div style={{display:"flex",gap:8,justifyContent:"center"}}>
            <button onClick={onYes} className="win-btn win-btn-danger" style={{minWidth:80,fontSize:18}}>Yes</button>
            <button onClick={onNo} className="win-btn" style={{minWidth:80,fontSize:18}}>No</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeScreen({onNewRound,onHistory,roundCount}){
  return(
    <div style={{minHeight:"100vh",background:"#008080",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div className="win-panel" style={{maxWidth:340,width:"100%"}}>
        <div className="win-title-bar green">
          <span>⛳ Golf Score Tracker</span>
          <div className="win-title-btns">
            <div className="win-title-btn">_</div>
            <div className="win-title-btn">□</div>
            <div className="win-title-btn" style={{color:"#c00000",fontWeight:"bold"}}>✕</div>
          </div>
        </div>
        <div style={{padding:24,display:"flex",flexDirection:"column",gap:12,alignItems:"center"}}>
          <div className="win-inset" style={{width:"100%",padding:12,textAlign:"center",marginBottom:8}}>
            <div style={{fontFamily:"'VT323',monospace",fontSize:28,color:"#1a5c38",lineHeight:1.2}}>GOLF SCORE</div>
            <div style={{fontFamily:"'VT323',monospace",fontSize:28,color:"#000080",lineHeight:1.2}}>TRACKER v1.0</div>
            <div style={{fontFamily:"'VT323',monospace",fontSize:14,color:"#808080",marginTop:4}}>© 2026 Fairway Software Inc.</div>
          </div>
          <div style={{width:"100%",borderTop:"1px solid #808080",borderBottom:"1px solid #fff"}}/>
          <button onClick={onNewRound} className="win-btn win-btn-primary" style={{width:"100%",fontSize:20,padding:"8px 0"}}>▶ New Round</button>
          <button onClick={onHistory} className="win-btn" style={{width:"100%",fontSize:20,padding:"8px 0"}}>📋 Round History {roundCount>0&&`(${roundCount})`}</button>
        </div>
        <div className="statusbar">
          <div className="statusbar-cell">Ready</div>
          <div className="statusbar-cell">Holes: 18</div>
          <div className="statusbar-cell">v1.0.0</div>
        </div>
      </div>
    </div>
  );
}

export default function App(){
  const [screen,setScreen]=useState("home");
  const [rounds,setRounds]=useState([]);
  const [courses,setCourses]=useState([]);
  const [customTees,setCustomTees]=useState([]);
  const [setup,setSetup]=useState({players:[""],date:new Date().toISOString().split("T")[0],course:"",holes:18,tee:"white"});
  const [pars,setPars]=useState(defaultPars(18));
  const [scores,setScores]=useState([defaultScores(18)]);
  const [viewRound,setViewRound]=useState(null);
  const [editScores,setEditScores]=useState(null);
  const [saveCourseName,setSaveCourseName]=useState("");
  const [showSaveCourse,setShowSaveCourse]=useState(false);
  const [savedMsg,setSavedMsg]=useState("");
  const [customTee,setCustomTee]=useState("");
  const [showCustomTee,setShowCustomTee]=useState(false);
  const [confirmDelete,setConfirmDelete]=useState(false);

  useEffect(()=>{
    const r=localStorage.getItem("golf_rounds"); if(r) try{setRounds(JSON.parse(r));}catch{}
    const c=localStorage.getItem("golf_courses"); if(c) try{setCourses(JSON.parse(c));}catch{}
    const t=localStorage.getItem("golf_custom_tees"); if(t) try{setCustomTees(JSON.parse(t));}catch{}
  },[]);

  function saveRounds(nr){ setRounds(nr); localStorage.setItem("golf_rounds",JSON.stringify(nr)); }
  function saveCourses(nc){ setCourses(nc); localStorage.setItem("golf_courses",JSON.stringify(nc)); }
  function goHome(){ setScreen("home"); setConfirmDelete(false); setViewRound(null); setEditScores(null); }
  function goHistory(){ setScreen("history"); setConfirmDelete(false); }

  function startSetup(){
    setSetup({players:[""],date:new Date().toISOString().split("T")[0],course:"",holes:18,tee:"white"});
    setPars(defaultPars(18)); setScores([defaultScores(18)]);
    setShowSaveCourse(false); setSaveCourseName(""); setCustomTee(""); setShowCustomTee(false); setConfirmDelete(false);
    setScreen("setup");
  }

  function addPlayer(){
    if(setup.players.length>=4) return;
    setSetup(s=>({...s,players:[...s.players,""]}));
    setScores(sc=>[...sc,defaultScores(setup.holes)]);
  }
  function removePlayer(i){
    if(setup.players.length<=1) return;
    setSetup(s=>({...s,players:s.players.filter((_,idx)=>idx!==i)}));
    setScores(sc=>sc.filter((_,idx)=>idx!==i));
  }
  function updatePlayerName(i,v){ setSetup(s=>({...s,players:s.players.map((p,idx)=>idx===i?v:p)})); }

  function beginRound(){
    if(setup.players.some(p=>!p.trim())) return alert("Please fill in all player names.");
    if(!setup.course) return alert("Please fill in the course name.");
    setScreen("round");
  }

  function changeHoles(h){
    setSetup(s=>({...s,holes:h}));
    setPars(defaultPars(h));
    setScores(setup.players.map(()=>defaultScores(h)));
  }

  function selectCoursePreset(id){
    if(!id) return;
    const c=courses.find(c=>c.id===parseInt(id)); if(!c) return;
    setSetup(s=>({...s,course:c.name,holes:c.holes}));
    setPars([...c.pars]);
    setScores(setup.players.map(()=>defaultScores(c.holes)));
  }

  function handleSaveCoursePreset(){
    const name=(saveCourseName.trim()||setup.course.trim());
    if(!name) return alert("Enter a course name.");
    const exists=courses.find(c=>c.name.toLowerCase()===name.toLowerCase()&&c.holes===setup.holes);
    if(exists){ if(!window.confirm(`Update "${name}"?`)) return; saveCourses(courses.map(c=>c.name.toLowerCase()===name.toLowerCase()&&c.holes===setup.holes?{...c,pars:[...pars]}:c)); }
    else saveCourses([...courses,{id:Date.now(),name,holes:setup.holes,pars:[...pars]}]);
    setSavedMsg(`✓ "${name}" saved!`); setShowSaveCourse(false); setSaveCourseName("");
    setTimeout(()=>setSavedMsg(""),2500);
  }

  function deleteCourse(id){ saveCourses(courses.filter(c=>c.id!==id)); }

  function setScore(playerIdx,holeIdx,val){
    setScores(sc=>sc.map((ps,pi)=>pi===playerIdx?ps.map((s,hi)=>hi===holeIdx?val:s):ps));
  }

  function finishRound(){
    const safePars=pars||defaultPars(setup.holes);
    const safeScores=scores.length===setup.players.length?scores:setup.players.map(()=>defaultScores(setup.holes));
    const playerStats=safeScores.map(ps=>calcStats(ps,safePars));
    const round={id:Date.now(),...setup,pars:safePars,scores:safeScores,playerStats,hcps:playerStats.map(s=>hcpDiff(s.total,safePars.reduce((a,b)=>a+b,0)))};
    saveRounds([round,...rounds]);
    goHome();
  }

  function confirmDeleteRound(){
    const updated=rounds.filter(r=>r.id!==viewRound.id);
    saveRounds(updated);
    setConfirmDelete(false);
    setViewRound(null);
    setScreen("history");
  }

  function startEditRound(r){
    const allScores=Array.isArray(r.scores[0])?r.scores:[r.scores];
    setEditScores(allScores.map(ps=>[...ps]));
    setScreen("edit");
  }

  function saveEditRound(){
    const r=viewRound;
    const playerStats=editScores.map(ps=>calcStats(ps,r.pars));
    const updated={...r,scores:editScores,playerStats,hcps:playerStats.map(s=>hcpDiff(s.total,r.pars.reduce((a,b)=>a+b,0)))};
    saveRounds(rounds.map(ro=>ro.id===r.id?updated:ro));
    setViewRound(updated);
    setScreen("view");
  }

  function exportCSV(){
    if(rounds.length===0) return alert("No rounds to export.");
    const rows=[];
    rounds.forEach(r=>{
      const players=r.players||[r.player];
      const allScores=Array.isArray(r.scores[0])?r.scores:[r.scores];
      const allStats=r.playerStats||(r.stats?[r.stats]:[]);
      const allHcps=r.hcps||(r.hcp?[r.hcp]:[]);
      players.forEach((p,pi)=>{
        const ps=allScores[pi]||[], st=allStats[pi]||{};
        rows.push([r.date,r.course,p,r.holes,r.tee||"",st.total||"",st.vspar||"",allHcps[pi]||"",st.eagles||0,st.birdies||0,st.pars||0,st.bogeys||0,st.doubles||0,
          ...Array.from({length:18},(_,i)=>r.pars[i]||""),...Array.from({length:18},(_,i)=>ps[i]||"")]);
      });
    });
    const headers=["Date","Course","Player","Holes","Tee","Total","vs Par","Hcp Diff","Eagles","Birdies","Pars","Bogeys","Doubles+",...Array.from({length:18},(_,i)=>`H${i+1} Par`),...Array.from({length:18},(_,i)=>`H${i+1} Score`)];
    const csv=[headers,...rows].map(r=>r.map(v=>`"${v}"`).join(",")).join("\n");
    const blob=new Blob([csv],{type:"text/csv"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a"); a.href=url; a.download="golf-rounds.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  function importCSV(e){
    const file=e.target.files[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=evt=>{
      try{
        const lines=evt.target.result.split("\n").filter(l=>l.trim());
        const imported=[];
        for(let i=1;i<lines.length;i++){
          const cols=lines[i].split(",").map(c=>c.replace(/^"|"$/g,""));
          const holes=parseInt(cols[3])||18;
          const p=cols.slice(13,31).map(v=>parseInt(v)||4).slice(0,holes);
          const sc=cols.slice(31,49).map(v=>v===""?"":parseInt(v)).slice(0,holes);
          const stats=calcStats(sc,p);
          imported.push({id:Date.now()+i,date:cols[0],course:cols[1],players:[cols[2]],holes,tee:cols[4],pars:p,scores:[sc],playerStats:[stats],hcps:[cols[7]]});
        }
        if(imported.length===0) return alert("No valid rounds found.");
        if(window.confirm(`Import ${imported.length} row(s)?`)){ saveRounds([...imported,...rounds]); alert(`✅ ${imported.length} row(s) imported!`); }
      }catch{ alert("Error reading file."); }
    };
    reader.readAsText(file); e.target.value="";
  }

  const totalPar=pars.reduce((a,b)=>a+b,0);

  if(screen==="home") return <HomeScreen onNewRound={startSetup} onHistory={goHistory} roundCount={rounds.length}/>;

  if(screen==="setup") return(
    <WinWindow title="New Round" onBack={goHome} green>
      {/* Players */}
      <WinField label="Players:">
        {setup.players.map((p,i)=>(
          <div key={i} style={{display:"flex",gap:6,marginBottom:6,alignItems:"center"}}>
            <div style={{width:14,height:14,background:PLAYER_COLORS[i],border:"2px solid #000",flexShrink:0}}/>
            <input value={p} onChange={e=>updatePlayerName(i,e.target.value)} placeholder={`Player ${i+1}`} className="win-input" style={{flex:1}}/>
            {setup.players.length>1&&<button onClick={()=>removePlayer(i)} className="win-btn win-btn-danger" style={{fontSize:16,padding:"2px 8px"}}>✕</button>}
          </div>
        ))}
        {setup.players.length<4&&<button onClick={addPlayer} className="win-btn" style={{fontSize:16,marginTop:4}}>+ Add Player</button>}
      </WinField>

      <div style={{borderTop:"1px solid #808080",borderBottom:"1px solid #fff",margin:"8px 0"}}/>

      <WinField label="Date:">
        <input type="date" value={setup.date} onChange={e=>setSetup(s=>({...s,date:e.target.value}))} className="win-input"/>
      </WinField>

      {courses.length>0&&<>
        <WinField label="Load Course Preset:">
          <select onChange={e=>selectCoursePreset(e.target.value)} defaultValue="" className="win-select">
            <option value="">-- Select --</option>
            {courses.map(c=><option key={c.id} value={c.id}>{c.name} ({c.holes}h)</option>)}
          </select>
          <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:6}}>
            {courses.map(c=>(
              <div key={c.id} className="win-inset" style={{display:"flex",alignItems:"center",gap:4,padding:"2px 6px",fontSize:14,fontFamily:"'VT323',monospace"}}>
                {c.name} ({c.holes}h)
                <button onClick={()=>deleteCourse(c.id)} className="win-btn win-btn-danger" style={{fontSize:14,padding:"0 4px"}}>✕</button>
              </div>
            ))}
          </div>
        </WinField>
        <div style={{borderTop:"1px solid #808080",borderBottom:"1px solid #fff",margin:"8px 0"}}/>
      </>}

      <WinField label="Course Name:">
        <input value={setup.course} onChange={e=>setSetup(s=>({...s,course:e.target.value}))} placeholder="Enter course name" className="win-input"/>
      </WinField>

      <WinField label="Tee Box:">
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {["white","blue","black","gold",...customTees].map(t=>{
            const active=setup.tee===t;
            const dotColors={white:"#e5e7eb",blue:"#3b82f6",black:"#1f2937",gold:"#f0c040"};
            const dc=dotColors[t]||"#9ca3af";
            return(
              <button key={t} onClick={()=>{setSetup(s=>({...s,tee:t}));setShowCustomTee(false);}}
                className="win-btn"
                style={{background:active?"#1a5c38":"#c0c0c0",color:active?"#fff":"#000",fontSize:16,display:"flex",alignItems:"center",gap:4}}>
                <div style={{width:10,height:10,background:dc,border:"1px solid #000",flexShrink:0}}/>
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            );
          })}
          <button onClick={()=>setShowCustomTee(!showCustomTee)} className="win-btn" style={{fontSize:16}}>+ Custom</button>
        </div>
        {showCustomTee&&(
          <div style={{display:"flex",gap:6,marginTop:6}}>
            <input value={customTee} onChange={e=>{setCustomTee(e.target.value);setSetup(s=>({...s,tee:e.target.value||"custom"}));}}
              placeholder="Custom tee color" className="win-input" style={{flex:1}}/>
            <button onClick={()=>{
              if(!customTee.trim()) return;
              const name=customTee.trim().toLowerCase();
              if(!["white","blue","black","gold"].includes(name)&&!customTees.includes(name)){
                const updated=[...customTees,name];
                setCustomTees(updated);
                localStorage.setItem("golf_custom_tees",JSON.stringify(updated));
              }
              setSetup(s=>({...s,tee:name})); setShowCustomTee(false);
            }} className="win-btn win-btn-primary" style={{fontSize:16}}>OK</button>
          </div>
        )}
      </WinField>

      <WinField label="Round Type:">
        <div style={{display:"flex",gap:6}}>
          {[9,18].map(h=>(
            <button key={h} onClick={()=>changeHoles(h)} className={`win-btn${setup.holes===h?" win-btn-primary":""}`} style={{flex:1,fontSize:18,padding:"6px 0"}}>
              {h} Holes
            </button>
          ))}
        </div>
      </WinField>

      <WinField label="Par Per Hole:">
        <div className="win-inset" style={{padding:8}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(9,1fr)",gap:4}}>
            {pars.map((p,i)=>(
              <div key={i} style={{textAlign:"center"}}>
                <div style={{fontFamily:"'VT323',monospace",fontSize:13,color:"#808080"}}>{i+1}</div>
                <select value={p} onChange={e=>{const np=[...pars];np[i]=parseInt(e.target.value);setPars(np);}}
                  style={{width:"100%",fontFamily:"'VT323',monospace",fontSize:15,background:"#fff",border:"1px solid #808080",textAlign:"center"}}>
                  {PAR_OPTIONS.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div style={{fontFamily:"'VT323',monospace",fontSize:16,marginTop:6,color:"#000"}}>Total Par: <strong>{totalPar}</strong></div>
        </div>
      </WinField>

      <div style={{borderTop:"1px solid #808080",borderBottom:"1px solid #fff",margin:"8px 0"}}/>

      {!showSaveCourse?(
        <button onClick={()=>{setSaveCourseName(setup.course);setShowSaveCourse(true);}} className="win-btn" style={{fontSize:16,marginBottom:12,width:"100%"}}>💾 Save Course Preset</button>
      ):(
        <div className="win-inset" style={{padding:8,marginBottom:12}}>
          <WinLabel>Save Preset As:</WinLabel>
          <div style={{display:"flex",gap:6}}>
            <input value={saveCourseName} onChange={e=>setSaveCourseName(e.target.value)} className="win-input" style={{flex:1}} placeholder="Course name"/>
            <button onClick={handleSaveCoursePreset} className="win-btn win-btn-primary" style={{fontSize:16}}>Save</button>
            <button onClick={()=>setShowSaveCourse(false)} className="win-btn" style={{fontSize:16}}>Cancel</button>
          </div>
        </div>
      )}
      {savedMsg&&<div style={{fontFamily:"'VT323',monospace",fontSize:17,color:"#1a5c38",marginBottom:8}}>{savedMsg}</div>}

      <button onClick={beginRound} className="win-btn win-btn-primary" style={{width:"100%",fontSize:22,padding:"10px 0"}}>▶ Start Round</button>
    </WinWindow>
  );

  if(screen==="round"){
    const safePars=pars||defaultPars(setup.holes);
    const safeScores=scores.length===setup.players.length?scores:setup.players.map(()=>defaultScores(setup.holes));
    const frontPars=safePars.slice(0,setup.holes===18?9:setup.holes);
    const backPars=safePars.slice(9);
    return(
      <WinWindow title={`${setup.course} — ${setup.tee} tees`} onBack={()=>{if(window.confirm("Abandon round?")) goHome();}} green>
        {/* Stat bars */}
        <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:8}}>
          {setup.players.map((player,pi)=>{
            const st=calcStats(safeScores[pi]||[],safePars);
            const vpStr=st.vspar===0?"E":st.vspar>0?`+${st.vspar}`:`${st.vspar}`;
            return(
              <div key={pi} className="win-inset" style={{padding:"4px 8px",display:"flex",alignItems:"center",gap:6,overflowX:"auto"}}>
                <div style={{width:12,height:12,background:PLAYER_COLORS[pi],border:"1px solid #000",flexShrink:0}}/>
                <span style={{fontFamily:"'VT323',monospace",fontSize:16,minWidth:60,flexShrink:0}}>{player}</span>
                {[["TOT",st.total||"—"],["PAR",vpStr],["🦅",st.eagles],["🐦",st.birdies],["+1",st.bogeys],["+2",st.doubles]].map(([l,v],i)=>(
                  <div key={i} className="win-panel" style={{padding:"1px 6px",textAlign:"center",flexShrink:0,minWidth:36}}>
                    <div style={{fontFamily:"'VT323',monospace",fontSize:11,color:"#808080"}}>{l}</div>
                    <div style={{fontFamily:"'VT323',monospace",fontSize:16}}>{v}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <WinHoleTable label={setup.holes===18?"Front 9":"Holes"} holeOffset={0}
          pars={frontPars} scores={safeScores.map(ps=>ps.slice(0,setup.holes===18?9:setup.holes))}
          players={setup.players} onScore={setScore}/>
        {setup.holes===18&&(
          <WinHoleTable label="Back 9" holeOffset={9} pars={backPars}
            scores={safeScores.map(ps=>ps.slice(9))} players={setup.players}
            onScore={(pi,hi,v)=>setScore(pi,9+hi,v)}/>
        )}
        <button onClick={finishRound} className="win-btn win-btn-primary" style={{width:"100%",fontSize:20,padding:"8px 0",marginTop:8}}>💾 Save Round</button>
      </WinWindow>
    );
  }

  if(screen==="history") return(
    <WinWindow title="Round History" onBack={goHome}>
      <div style={{display:"flex",gap:6,marginBottom:8}}>
        <button onClick={exportCSV} className="win-btn win-btn-primary" style={{flex:1,fontSize:16}}>⬇ Export CSV</button>
        <label className="win-btn" style={{flex:1,fontSize:16,textAlign:"center",cursor:"pointer"}}>
          ⬆ Import CSV<input type="file" accept=".csv" onChange={importCSV} style={{display:"none"}}/>
        </label>
      </div>
      <div style={{borderTop:"1px solid #808080",borderBottom:"1px solid #fff",marginBottom:8}}/>
      {rounds.length===0&&<div style={{fontFamily:"'VT323',monospace",fontSize:20,color:"#808080",textAlign:"center",marginTop:40}}>No rounds saved yet.</div>}
      {rounds.map(r=>{
        const players=r.players||[r.player];
        const allStats=r.playerStats||(r.stats?[r.stats]:[]);
        return(
          <div key={r.id} className="win-panel" style={{marginBottom:8,cursor:"pointer"}} onClick={()=>{setViewRound(r);setScreen("view");}}>
            <div className="win-title-bar green" style={{fontSize:15}}>
              <span>{r.course}</span>
              <span style={{fontSize:13}}>{r.date} · {r.holes}h · {r.tee} tees</span>
            </div>
            <div style={{padding:"6px 8px"}}>
              {players.map((p,pi)=>{
                const st=allStats[pi]||{};
                const vp=st.vspar||0;
                const vpStr=vp===0?"E":vp>0?`+${vp}`:`${vp}`;
                return(
                  <div key={pi} style={{display:"flex",alignItems:"center",gap:8,fontFamily:"'VT323',monospace",fontSize:18}}>
                    <div style={{width:10,height:10,background:PLAYER_COLORS[pi],border:"1px solid #000",flexShrink:0}}/>
                    <span style={{flex:1}}>{p}</span>
                    <span style={{fontWeight:"bold"}}>{st.total||"—"}</span>
                    <span style={{color:vp<0?"#1a5c38":vp>0?"#c00000":"#000",minWidth:36,textAlign:"right"}}>{st.total?vpStr:"—"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </WinWindow>
  );

  if(screen==="view"&&viewRound){
    const r=viewRound;
    const players=r.players||[r.player];
    const allStats=r.playerStats||(r.stats?[r.stats]:[]);
    const allScores=Array.isArray(r.scores[0])?r.scores:[r.scores];
    const allHcps=r.hcps||(r.hcp?[r.hcp]:[]);
    return(
      <WinWindow title={r.course} onBack={()=>setScreen("history")} green>
        {confirmDelete&&<ConfirmModal message="Delete this round permanently?" onYes={confirmDeleteRound} onNo={()=>setConfirmDelete(false)}/>}
        <div style={{fontFamily:"'VT323',monospace",fontSize:16,color:"#808080",marginBottom:8}}>{r.date} · {r.holes} holes · {r.tee} tees</div>

        {players.map((p,pi)=>{
          const st=allStats[pi]||{};
          const vp=st.vspar||0;
          const vpStr=vp===0?"E":vp>0?`+${vp}`:`${vp}`;
          return(
            <div key={pi} className="win-panel" style={{marginBottom:8}}>
              <div className="win-title-bar" style={{fontSize:15}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:12,height:12,background:PLAYER_COLORS[pi],border:"1px solid #fff"}}/>
                  {p}
                </div>
                <div style={{display:"flex",gap:12}}>
                  <span>Score: {st.total||"—"}</span>
                  <span style={{color:vp<0?"#86efac":vp>0?"#fca5a5":"#fff"}}>{st.total?vpStr:"—"}</span>
                  <span style={{color:"#9ca3af",fontSize:13}}>HCP: {allHcps[pi]||"—"}</span>
                </div>
              </div>
              <div style={{padding:"6px 8px",display:"flex",flexWrap:"wrap",gap:6}}>
                {[["🦅",st.eagles,"Eagles"],["🐦",st.birdies,"Birdies"],["⚪",st.pars,"Pars"],["+1",st.bogeys,"Bogeys"],["+2+",st.doubles,"Doubles+"]].map(([icon,v,label])=>(
                  <div key={label} className="win-inset" style={{padding:"2px 8px",fontFamily:"'VT323',monospace",fontSize:16,textAlign:"center"}}>
                    {icon} {v||0} {label}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <WinHoleTableReadOnly label={r.holes===18?"Front 9":"Holes"} holeOffset={0}
          pars={r.pars.slice(0,r.holes===18?9:r.holes)}
          scores={allScores.map(ps=>ps.slice(0,r.holes===18?9:r.holes))} players={players}/>
        {r.holes===18&&(
          <WinHoleTableReadOnly label="Back 9" holeOffset={9} pars={r.pars.slice(9)}
            scores={allScores.map(ps=>ps.slice(9))} players={players}/>
        )}

        <div style={{display:"flex",gap:8,marginTop:8}}>
          <button onClick={()=>startEditRound(r)} className="win-btn" style={{flex:1,fontSize:18}}>✏ Edit Scores</button>
          <button onClick={()=>setConfirmDelete(true)} className="win-btn win-btn-danger" style={{flex:1,fontSize:18}}>🗑 Delete Round</button>
        </div>
      </WinWindow>
    );
  }

  if(screen==="edit"&&viewRound&&editScores){
    const r=viewRound;
    const players=r.players||[r.player];
    return(
      <WinWindow title={`Edit: ${r.course}`} onBack={()=>setScreen("view")}>
        <div style={{fontFamily:"'VT323',monospace",fontSize:16,color:"#808080",marginBottom:8}}>{r.date} · {r.tee} tees · {r.holes} holes</div>
        <WinHoleTable label={r.holes===18?"Front 9":"Holes"} holeOffset={0}
          pars={r.pars.slice(0,r.holes===18?9:r.holes)}
          scores={editScores.map(ps=>ps.slice(0,r.holes===18?9:r.holes))}
          players={players}
          onScore={(pi,hi,v)=>setEditScores(sc=>sc.map((ps,p)=>p===pi?ps.map((s,h)=>h===hi?v:s):ps))}/>
        {r.holes===18&&(
          <WinHoleTable label="Back 9" holeOffset={9} pars={r.pars.slice(9)}
            scores={editScores.map(ps=>ps.slice(9))} players={players}
            onScore={(pi,hi,v)=>setEditScores(sc=>sc.map((ps,p)=>p===pi?ps.map((s,h)=>h===(9+hi)?v:s):ps))}/>
        )}
        <button onClick={saveEditRound} className="win-btn win-btn-primary" style={{width:"100%",fontSize:20,padding:"8px 0",marginTop:8}}>💾 Save Changes</button>
      </WinWindow>
    );
  }

  return null;
}

function WinHoleTable({label,holeOffset,pars,scores,players,onScore}){
  return(
    <div style={{marginBottom:12}}>
      <div style={{fontFamily:"'VT323',monospace",fontSize:16,background:"#1a5c38",color:"#f0c040",padding:"2px 8px",marginBottom:2}}>{label}</div>
      <div style={{overflowX:"auto"}}>
        <table className="win-table" style={{minWidth:340}}>
          <thead>
            <tr>
              <th style={{background:"#1a5c38",color:"#f0c040",minWidth:50}}>HOLE</th>
              {pars.map((_,i)=><th key={i}>{holeOffset+i+1}</th>)}
              <th>TOT</th>
            </tr>
            <tr>
              <td style={{background:"#c0c0c0",fontWeight:"bold",fontSize:14}}>PAR</td>
              {pars.map((p,i)=><td key={i} style={{background:"#e0e0e0"}}>{p}</td>)}
              <td style={{background:"#e0e0e0",fontWeight:"bold"}}>{pars.reduce((a,b)=>a+b,0)}</td>
            </tr>
          </thead>
          <tbody>
            {players.map((player,pi)=>{
              const ps=scores[pi]||[];
              const st=calcStats(ps,pars);
              const vpStr=st.vspar===0?"E":st.vspar>0?`+${st.vspar}`:`${st.vspar}`;
              return(
                <React.Fragment key={pi}>
                  <tr>
                    <td style={{background:"#c0c0c0",padding:"1px 4px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:3}}>
                        <div style={{width:8,height:8,background:PLAYER_COLORS[pi],border:"1px solid #000",flexShrink:0}}/>
                        <span style={{fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:34}}>{player}</span>
                      </div>
                    </td>
                    {ps.map((s,i)=>{
                      const min=1,max=pars[i]+3,opts=[];
                      for(let v=min;v<=max;v++) opts.push(v);
                      return(
                        <td key={i} style={{background:s!==""?cellColor(s,pars[i]):"#fff",color:s!==""?cellTextColor(s,pars[i]):"#000",padding:0}}>
                          <select value={s} onChange={e=>onScore(pi,i,e.target.value===""?"":parseInt(e.target.value))}
                            style={{width:"100%",border:"none",background:"transparent",textAlign:"center",fontSize:15,fontFamily:"'VT323',monospace",outline:"none",padding:"2px 0",color:"inherit",cursor:"pointer"}}>
                            <option value="">-</option>
                            {opts.map(v=><option key={v} value={v}>{v}</option>)}
                          </select>
                        </td>
                      );
                    })}
                    <td style={{background:"#c0c0c0",fontWeight:"bold"}}>{st.total||""}</td>
                  </tr>
                  <tr>
                    <td style={{background:"#d4d0c8",fontSize:12,color:"#808080"}}>±par</td>
                    {ps.map((s,i)=>{
                      const diff=s!==""?parseInt(s)-pars[i]:null;
                      return <td key={i} style={{background:"#d4d0c8",fontSize:13,color:diff<0?"#1a5c38":diff>0?"#c00000":"#000"}}>{diff===null?"":diff===0?"E":diff>0?`+${diff}`:diff}</td>;
                    })}
                    <td style={{background:"#d4d0c8",fontSize:14,fontWeight:"bold",color:st.vspar<0?"#1a5c38":st.vspar>0?"#c00000":"#000"}}>{st.total?(st.vspar===0?"E":st.vspar>0?`+${st.vspar}`:st.vspar):""}</td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WinHoleTableReadOnly({label,holeOffset,pars,scores,players}){
  return(
    <div style={{marginBottom:12}}>
      <div style={{fontFamily:"'VT323',monospace",fontSize:16,background:"#1a5c38",color:"#f0c040",padding:"2px 8px",marginBottom:2}}>{label}</div>
      <div style={{overflowX:"auto"}}>
        <table className="win-table" style={{minWidth:340}}>
          <thead>
            <tr>
              <th style={{minWidth:50}}>HOLE</th>
              {pars.map((_,i)=><th key={i}>{holeOffset+i+1}</th>)}
              <th>TOT</th>
            </tr>
            <tr>
              <td style={{background:"#c0c0c0",fontWeight:"bold",fontSize:14}}>PAR</td>
              {pars.map((p,i)=><td key={i} style={{background:"#e0e0e0"}}>{p}</td>)}
              <td style={{background:"#e0e0e0",fontWeight:"bold"}}>{pars.reduce((a,b)=>a+b,0)}</td>
            </tr>
          </thead>
          <tbody>
            {players.map((player,pi)=>{
              const ps=scores[pi]||[];
              const st=calcStats(ps,pars);
              return(
                <tr key={pi}>
                  <td style={{background:"#c0c0c0",padding:"1px 4px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:3}}>
                      <div style={{width:8,height:8,background:PLAYER_COLORS[pi],border:"1px solid #000",flexShrink:0}}/>
                      <span style={{fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:34}}>{player}</span>
                    </div>
                  </td>
                  {ps.map((s,i)=>(
                    <td key={i} style={{background:s!==""?cellColor(s,pars[i]):"#fff",color:s!==""?cellTextColor(s,pars[i]):"#000",fontWeight:"bold",fontSize:16}}>{s}</td>
                  ))}
                  <td style={{background:"#c0c0c0",fontWeight:"bold"}}>{st.total||""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
