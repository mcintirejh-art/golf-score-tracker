import { useState, useEffect, useCallback } from "react";

const PAR_OPTIONS = [3, 4, 5];
const defaultPars = (holes) => Array(holes).fill(4);
const defaultScores = (holes) => Array(holes).fill("");

const style = document.createElement("style");
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=IM+Fell+English:ital@0;1&display=swap');
  * { box-sizing: border-box; }
  body { margin: 0; }
  select, input, button { font-family: inherit; }
  .pixel-btn { border: 3px solid #000; box-shadow: 4px 4px 0px #000; transition: box-shadow 0.1s, transform 0.1s; cursor: pointer; }
  .pixel-btn:active { box-shadow: 1px 1px 0px #000; transform: translate(3px, 3px); }
  ::-webkit-scrollbar { height: 6px; }
  ::-webkit-scrollbar-thumb { background: #1a5c38; border-radius: 3px; }
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
  if(d===-1) return "#4ade80";
  if(d===0) return "#f5f0e0";
  if(d===1) return "#fca5a5";
  return "#ef4444";
}
function cellTextColor(score,par){
  if(score===""||score===null) return "#1a1a1a";
  const d=parseInt(score)-par;
  if(d<=-2) return "#f0c040";
  if(d===-1) return "#1a1a1a";
  return d>=2?"#fff":"#1a1a1a";
}
function hcpDiff(score,par){ return((score-par)*113/113).toFixed(1); }

const G="#1a5c38", GOLD="#f0c040", CREAM="#f5f0e0", DARK="#1a1a1a";
const PLAYER_COLORS=["#1a5c38","#1d4ed8","#b91c1c","#92400e"];

// Confirmation Modal Component
function ConfirmModal({message,onYes,onNo}){
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,padding:24}}>
      <div style={{background:CREAM,border:"4px solid #000",boxShadow:"6px 6px 0 #000",padding:28,maxWidth:300,width:"100%",textAlign:"center"}}>
        <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:10,color:DARK,lineHeight:1.8,marginBottom:8}}>ARE YOU SURE?</div>
        <div style={{fontFamily:"'IM Fell English',serif",fontSize:15,color:"#6b7280",marginBottom:24}}>{message}</div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onYes} className="pixel-btn" style={{flex:1,padding:"12px 0",background:"#ef4444",color:"#fff",fontFamily:"'Press Start 2P',monospace",fontSize:10,border:"3px solid #000",boxShadow:"4px 4px 0 #000"}}>YES</button>
          <button onClick={onNo} className="pixel-btn" style={{flex:1,padding:"12px 0",background:CREAM,color:DARK,fontFamily:"'Press Start 2P',monospace",fontSize:10,border:"3px solid #000",boxShadow:"4px 4px 0 #000"}}>NO</button>
        </div>
      </div>
    </div>
  );
}

// Each screen is its own component to avoid any state bleed
function HomeScreen({onNewRound, onHistory, roundCount}){
  return(
    <div style={{minHeight:"100vh",background:`repeating-linear-gradient(0deg,transparent,transparent 31px,rgba(0,0,0,0.06) 31px,rgba(0,0,0,0.06) 32px),repeating-linear-gradient(90deg,transparent,transparent 31px,rgba(0,0,0,0.06) 31px,rgba(0,0,0,0.06) 32px),${G}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Press Start 2P',monospace",padding:24}}>
      <div style={{background:CREAM,border:"4px solid #000",boxShadow:"6px 6px 0 #000",padding:"32px 28px",textAlign:"center",maxWidth:340,width:"100%"}}>
        <h1 style={{fontSize:16,color:DARK,margin:"0 0 4px",lineHeight:1.8}}>GOLF SCORE</h1>
        <h1 style={{fontSize:16,color:G,margin:"0 0 24px",lineHeight:1.8}}>TRACKER</h1>
        <div style={{width:"100%",height:3,background:`repeating-linear-gradient(90deg,${GOLD} 0,${GOLD} 8px,transparent 8px,transparent 12px)`,marginBottom:24}}/>
        <button onClick={onNewRound} className="pixel-btn" style={{width:"100%",padding:"14px 16px",background:G,color:CREAM,fontFamily:"'Press Start 2P',monospace",fontSize:10,border:"3px solid #000",boxShadow:"4px 4px 0 #000",letterSpacing:1,display:"block",marginBottom:12}}>
          ▶ NEW ROUND
        </button>
        <button onClick={onHistory} className="pixel-btn" style={{width:"100%",padding:"14px 16px",background:GOLD,color:DARK,fontFamily:"'Press Start 2P',monospace",fontSize:10,border:"3px solid #000",boxShadow:"4px 4px 0 #000",letterSpacing:1,display:"block"}}>
          📋 HISTORY {roundCount>0&&`(${roundCount})`}
        </button>
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
    setShowSaveCourse(false); setSaveCourseName(""); setCustomTee(""); setShowCustomTee(false);
    setConfirmDelete(false);
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
    const playerStats=scores.map(ps=>calcStats(ps,pars));
    const round={id:Date.now(),...setup,pars,scores,playerStats,hcps:playerStats.map(s=>hcpDiff(s.total,pars.reduce((a,b)=>a+b,0)))};
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
    <div style={{minHeight:"100vh",background:CREAM,fontFamily:"'IM Fell English',serif"}}>
      <RetroHeader title="NEW ROUND" back={goHome}/>
      <div style={{padding:16,maxWidth:480,margin:"0 auto"}}>
        <PixelCard>
          <FieldLabel>Players</FieldLabel>
          {setup.players.map((p,i)=>(
            <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
              <div style={{width:12,height:12,borderRadius:"50%",background:PLAYER_COLORS[i],border:"2px solid #000",flexShrink:0}}/>
              <input value={p} onChange={e=>updatePlayerName(i,e.target.value)} placeholder={`Player ${i+1} name`}
                style={{flex:1,padding:"10px 12px",border:"3px solid #000",fontSize:15,background:CREAM,fontFamily:"'IM Fell English',serif",outline:"none",boxShadow:"2px 2px 0 #000"}}/>
              {setup.players.length>1&&(
                <button onClick={()=>removePlayer(i)} className="pixel-btn" style={{background:"#fee2e2",color:"#dc2626",border:"3px solid #000",padding:"8px 10px",fontFamily:"'Press Start 2P',monospace",fontSize:12}}>×</button>
              )}
            </div>
          ))}
          {setup.players.length<4&&(
            <button onClick={addPlayer} style={{width:"100%",padding:"8px 0",background:CREAM,color:G,border:`3px dashed ${G}`,fontFamily:"'Press Start 2P',monospace",fontSize:8,cursor:"pointer",marginBottom:14}}>+ ADD PLAYER</button>
          )}
          <FieldLabel>Date</FieldLabel>
          <RetroInput type="date" value={setup.date} onChange={v=>setSetup(s=>({...s,date:v}))}/>
          {courses.length>0&&<>
            <FieldLabel>Load Course Preset</FieldLabel>
            <select onChange={e=>selectCoursePreset(e.target.value)} defaultValue="" style={selectStyle}>
              <option value="">— Select saved course —</option>
              {courses.map(c=><option key={c.id} value={c.id}>{c.name} ({c.holes}h)</option>)}
            </select>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
              {courses.map(c=>(
                <div key={c.id} style={{background:GOLD,border:"2px solid #000",padding:"3px 10px",fontSize:12,fontFamily:"'Press Start 2P',monospace",display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:11}}>{c.name} ({c.holes}h)</span>
                  <button onClick={()=>deleteCourse(c.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#dc2626",fontSize:14,padding:0,fontWeight:900}}>×</button>
                </div>
              ))}
            </div>
            <div style={{borderTop:`3px dashed ${G}`,marginBottom:14}}/>
          </>}
          <FieldLabel>Course Name</FieldLabel>
          <RetroInput value={setup.course} onChange={v=>setSetup(s=>({...s,course:v}))} placeholder="Course name"/>
          <FieldLabel>Tee Box</FieldLabel>
          <div style={{display:"flex",gap:8,marginBottom:showCustomTee?8:14,flexWrap:"wrap"}}>
            {["white","blue","black","gold",...customTees].map(t=>{
              const active=setup.tee===t;
              const dotColors={white:"#e5e7eb",blue:"#3b82f6",black:"#1f2937",gold:"#f0c040"};
              const dc=dotColors[t]||"#9ca3af";
              return(
                <button key={t} onClick={()=>{setSetup(s=>({...s,tee:t}));setShowCustomTee(false);}} className="pixel-btn"
                  style={{flex:"1 1 60px",padding:"8px 4px",background:active?dc:CREAM,color:active&&t!=="white"&&t!=="gold"?"#fff":DARK,fontFamily:"'Press Start 2P',monospace",fontSize:8,border:`3px solid ${active?DARK:"#aaa"}`,boxShadow:active?"4px 4px 0 #000":"2px 2px 0 #aaa"}}>
                  {t.charAt(0).toUpperCase()+t.slice(1)}
                </button>
              );
            })}
            <button onClick={()=>{setShowCustomTee(true);setSetup(s=>({...s,tee:customTee||"custom"}));}} className="pixel-btn"
              style={{flex:"1 1 60px",padding:"8px 4px",background:showCustomTee?GOLD:CREAM,fontFamily:"'Press Start 2P',monospace",fontSize:8,border:`3px solid ${showCustomTee?DARK:"#aaa"}`,boxShadow:showCustomTee?"4px 4px 0 #000":"2px 2px 0 #aaa",color:DARK}}>
              +CUSTOM
            </button>
          </div>
          {showCustomTee&&(
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              <input value={customTee} onChange={e=>{setCustomTee(e.target.value);setSetup(s=>({...s,tee:e.target.value||"custom"}));}}
                placeholder="e.g. Red, Senior…" style={{...selectStyle,flex:1,marginBottom:0}}/>
              <button onClick={()=>{
                if(!customTee.trim()) return;
                const name=customTee.trim().toLowerCase();
                if(!["white","blue","black","gold"].includes(name)&&!customTees.includes(name)){
                  const updated=[...customTees,name];
                  setCustomTees(updated);
                  localStorage.setItem("golf_custom_tees",JSON.stringify(updated));
                }
                setSetup(s=>({...s,tee:name})); setShowCustomTee(false);
              }} className="pixel-btn" style={{background:G,color:CREAM,border:"3px solid #000",padding:"8px 14px",fontFamily:"'Press Start 2P',monospace",fontSize:12}}>✓</button>
            </div>
          )}
          <FieldLabel>Round Type</FieldLabel>
          <div style={{display:"flex",gap:8,marginBottom:16}}>
            {[9,18].map(h=>(
              <button key={h} onClick={()=>changeHoles(h)} className="pixel-btn"
                style={{flex:1,padding:"12px 0",background:setup.holes===h?G:CREAM,color:setup.holes===h?CREAM:DARK,fontFamily:"'Press Start 2P',monospace",fontSize:10,border:`3px solid ${setup.holes===h?"#000":"#aaa"}`,boxShadow:setup.holes===h?"4px 4px 0 #000":"2px 2px 0 #aaa"}}>
                {h} HOLES
              </button>
            ))}
          </div>
          <FieldLabel>Par Per Hole</FieldLabel>
          <div style={{display:"grid",gridTemplateColumns:"repeat(9,1fr)",gap:4,marginBottom:8}}>
            {pars.map((p,i)=>(
              <div key={i} style={{textAlign:"center"}}>
                <div style={{fontSize:9,color:"#6b7280",marginBottom:2,fontFamily:"'Press Start 2P',monospace"}}>{i+1}</div>
                <select value={p} onChange={e=>{const np=[...pars];np[i]=parseInt(e.target.value);setPars(np);}}
                  style={{width:"100%",padding:"4px 2px",border:"2px solid #000",fontSize:12,textAlign:"center",background:CREAM,fontFamily:"'Press Start 2P',monospace"}}>
                  {PAR_OPTIONS.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:9,color:"#6b7280",marginBottom:16}}>TOTAL PAR: <span style={{color:G}}>{totalPar}</span></div>
          {!showSaveCourse?(
            <button onClick={()=>{setSaveCourseName(setup.course);setShowSaveCourse(true);}}
              style={{width:"100%",padding:"10px 0",background:CREAM,color:G,border:`3px dashed ${G}`,fontFamily:"'Press Start 2P',monospace",fontSize:8,cursor:"pointer",marginBottom:16}}>
              💾 SAVE COURSE PRESET
            </button>
          ):(
            <div style={{border:`3px solid ${G}`,background:"#f0fdf4",padding:12,marginBottom:16}}>
              <FieldLabel>Preset Name</FieldLabel>
              <div style={{display:"flex",gap:8}}>
                <input value={saveCourseName} onChange={e=>setSaveCourseName(e.target.value)} placeholder="Course name" style={{flex:1,...selectStyle,marginBottom:0}}/>
                <button onClick={handleSaveCoursePreset} className="pixel-btn" style={{background:G,color:CREAM,border:"3px solid #000",padding:"8px 14px",fontFamily:"'Press Start 2P',monospace",fontSize:10}}>SAVE</button>
                <button onClick={()=>setShowSaveCourse(false)} className="pixel-btn" style={{background:"#e5e7eb",color:DARK,border:"3px solid #000",padding:"8px 10px",fontFamily:"'Press Start 2P',monospace",fontSize:10}}>✕</button>
              </div>
            </div>
          )}
          {savedMsg&&<div style={{color:G,fontFamily:"'Press Start 2P',monospace",fontSize:9,marginBottom:10,textAlign:"center"}}>{savedMsg}</div>}
          <PBtn onClick={beginRound} bg={G} color={CREAM}>START ROUND ▶</PBtn>
        </PixelCard>
      </div>
    </div>
  );

  if(screen==="round") return(
    <div style={{minHeight:"100vh",background:CREAM,fontFamily:"'IM Fell English',serif"}}>
      <RetroHeader title={setup.course.toUpperCase()} back={()=>{if(window.confirm("Abandon round?")) goHome();}}/>
      <div style={{padding:"8px 12px 4px",fontFamily:"'Press Start 2P',monospace",fontSize:8,color:"#6b7280",textAlign:"center"}}>
        {setup.tee.toUpperCase()} TEES · {setup.holes} HOLES
      </div>
      <div style={{padding:"4px 12px 8px",display:"flex",flexDirection:"column",gap:6}}>
        {setup.players.map((player,pi)=>{
          const st=calcStats(scores[pi]||[],pars);
          const vpStr=st.vspar===0?"E":st.vspar>0?`+${st.vspar}`:`${st.vspar}`;
          return(
            <div key={pi} style={{display:"flex",alignItems:"center",gap:6,overflowX:"auto"}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:PLAYER_COLORS[pi],border:"2px solid #000",flexShrink:0}}/>
              <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:8,color:DARK,flexShrink:0,minWidth:60,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{player}</div>
              {[{label:"TOT",val:st.total||"—"},{label:"PAR",val:vpStr,color:st.vspar<0?"#166534":st.vspar>0?"#dc2626":DARK},{label:"🦅",val:st.eagles},{label:"🐦",val:st.birdies},{label:"+1",val:st.bogeys},{label:"+2",val:st.doubles}].map((s,i)=>(
                <div key={i} style={{background:"#fff",border:"2px solid #000",boxShadow:"2px 2px 0 #000",padding:"4px 6px",minWidth:36,textAlign:"center",flexShrink:0}}>
                  <div style={{fontSize:6,color:"#6b7280",fontFamily:"'Press Start 2P',monospace"}}>{s.label}</div>
                  <div style={{fontWeight:800,fontSize:11,fontFamily:"'Press Start 2P',monospace",color:s.color||DARK}}>{s.val}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div style={{padding:"0 12px"}}>
        <MultiHoleTable label={setup.holes===18?"FRONT 9":"HOLES"} holeOffset={0}
          pars={pars.slice(0,setup.holes===18?9:setup.holes)}
          scores={scores.map(ps=>ps.slice(0,setup.holes===18?9:setup.holes))}
          players={setup.players} onScore={setScore}/>
        {setup.holes===18&&(
          <MultiHoleTable label="BACK 9" holeOffset={9} pars={pars.slice(9)}
            scores={scores.map(ps=>ps.slice(9))} players={setup.players}
            onScore={(pi,hi,v)=>setScore(pi,9+hi,v)}/>
        )}
      </div>
      <div style={{padding:16}}><PBtn onClick={finishRound} bg={G} color={CREAM}>💾 SAVE ROUND</PBtn></div>
    </div>
  );

  if(screen==="history") return(
    <div style={{minHeight:"100vh",background:CREAM,fontFamily:"'IM Fell English',serif"}}>
      <RetroHeader title="HISTORY" back={goHome}/>
      <div style={{padding:"12px 16px 0",maxWidth:480,margin:"0 auto",display:"flex",gap:8}}>
        <button onClick={exportCSV} className="pixel-btn" style={{flex:1,padding:"10px 0",background:G,color:CREAM,border:"3px solid #000",boxShadow:"3px 3px 0 #000",fontFamily:"'Press Start 2P',monospace",fontSize:7}}>⬇ EXPORT CSV</button>
        <label className="pixel-btn" style={{flex:1,padding:"10px 0",background:GOLD,color:DARK,border:"3px solid #000",boxShadow:"3px 3px 0 #000",fontFamily:"'Press Start 2P',monospace",fontSize:7,textAlign:"center",cursor:"pointer"}}>
          ⬆ IMPORT CSV<input type="file" accept=".csv" onChange={importCSV} style={{display:"none"}}/>
        </label>
      </div>
      <div style={{padding:"8px 16px",maxWidth:480,margin:"0 auto"}}>
        {rounds.length===0&&<p style={{color:"#6b7280",textAlign:"center",marginTop:40,fontFamily:"'Press Start 2P',monospace",fontSize:9}}>NO ROUNDS SAVED YET.</p>}
        {rounds.map(r=>{
          const players=r.players||[r.player];
          const allStats=r.playerStats||(r.stats?[r.stats]:[]);
          return(
            <div key={r.id} onClick={()=>{setViewRound(r);setScreen("view");}}
              style={{background:"#fff",border:"3px solid #000",boxShadow:"4px 4px 0 #000",padding:"14px 16px",marginBottom:12,cursor:"pointer"}}>
              <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:9,color:G,marginBottom:6}}>{r.course}</div>
              <div style={{fontSize:13,color:"#6b7280",marginBottom:8}}>{r.date} · {r.holes} holes · {r.tee} tees</div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {players.map((p,pi)=>{
                  const st=allStats[pi]||{};
                  const vp=st.vspar||0;
                  const vpStr=vp===0?"E":vp>0?`+${vp}`:`${vp}`;
                  return(
                    <div key={pi} style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:PLAYER_COLORS[pi],border:"1px solid #000",flexShrink:0}}/>
                      <div style={{fontSize:14,flex:1}}>{p}</div>
                      <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:12,color:DARK}}>{st.total||"—"}</div>
                      <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:10,color:vp<0?"#166534":vp>0?"#dc2626":DARK,minWidth:32,textAlign:"right"}}>{st.total?vpStr:"—"}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if(screen==="view"&&viewRound){
    const r=viewRound;
    const players=r.players||[r.player];
    const allStats=r.playerStats||(r.stats?[r.stats]:[]);
    const allScores=Array.isArray(r.scores[0])?r.scores:[r.scores];
    const allHcps=r.hcps||(r.hcp?[r.hcp]:[]);
    return(
      <div style={{minHeight:"100vh",background:CREAM,fontFamily:"'IM Fell English',serif"}}>
        {confirmDelete&&(
          <ConfirmModal
            message="This round will be permanently deleted."
            onYes={confirmDeleteRound}
            onNo={()=>setConfirmDelete(false)}
          />
        )}
        <RetroHeader title={r.course.toUpperCase()} back={()=>setScreen("history")}/>
        <div style={{padding:"12px 16px",maxWidth:480,margin:"0 auto"}}>
          <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:8,color:"#6b7280",marginBottom:10}}>{r.date} · {r.holes}H · {r.tee?.toUpperCase()} TEES</div>
          {players.map((p,pi)=>{
            const st=allStats[pi]||{};
            const vp=st.vspar||0;
            const vpStr=vp===0?"E":vp>0?`+${vp}`:`${vp}`;
            return(
              <div key={pi} style={{background:"#fff",border:"3px solid #000",boxShadow:"3px 3px 0 #000",padding:"12px",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:PLAYER_COLORS[pi],border:"2px solid #000"}}/>
                  <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:9,color:DARK}}>{p}</div>
                  <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:14,color:DARK,marginLeft:"auto"}}>{st.total||"—"}</div>
                  <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:11,color:vp<0?"#166534":vp>0?"#dc2626":DARK}}>{st.total?vpStr:"—"}</div>
                  <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:7,color:"#9ca3af"}}>HCP {allHcps[pi]||"—"}</div>
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {[["🦅",st.eagles,"Eagles"],["🐦",st.birdies,"Birdies"],["⚪",st.pars,"Pars"],["+1",st.bogeys,"Bogeys"],["+2+",st.doubles,"Doubles"]].map(([icon,v,label])=>(
                    <div key={label} style={{background:CREAM,border:"2px solid #000",padding:"4px 8px",fontFamily:"'Press Start 2P',monospace",fontSize:7,textAlign:"center"}}>
                      <div>{icon}</div><div style={{color:G}}>{v||0}</div><div style={{color:"#6b7280",fontSize:6}}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          <MultiHoleTableReadOnly label={r.holes===18?"FRONT 9":"HOLES"} holeOffset={0}
            pars={r.pars.slice(0,r.holes===18?9:r.holes)}
            scores={allScores.map(ps=>ps.slice(0,r.holes===18?9:r.holes))} players={players}/>
          {r.holes===18&&(
            <MultiHoleTableReadOnly label="BACK 9" holeOffset={9} pars={r.pars.slice(9)}
              scores={allScores.map(ps=>ps.slice(9))} players={players}/>
          )}
          <div style={{display:"flex",gap:8,marginTop:8,paddingBottom:24}}>
            <PBtn onClick={()=>startEditRound(r)} bg={GOLD} color={DARK}>✏ EDIT</PBtn>
            <PBtn onClick={()=>setConfirmDelete(true)} bg="#ef4444" color="#fff">🗑 DELETE</PBtn>
          </div>
        </div>
      </div>
    );
  }

  if(screen==="edit"&&viewRound&&editScores){
    const r=viewRound;
    const players=r.players||[r.player];
    return(
      <div style={{minHeight:"100vh",background:CREAM,fontFamily:"'IM Fell English',serif"}}>
        <RetroHeader title={"EDIT: "+r.course.toUpperCase()} back={()=>setScreen("view")}/>
        <div style={{padding:"8px 12px 4px",fontFamily:"'Press Start 2P',monospace",fontSize:8,color:"#6b7280",textAlign:"center"}}>
          {r.date} · {r.tee?.toUpperCase()} TEES · {r.holes} HOLES
        </div>
        <div style={{padding:"0 12px"}}>
          <MultiHoleTable label={r.holes===18?"FRONT 9":"HOLES"} holeOffset={0}
            pars={r.pars.slice(0,r.holes===18?9:r.holes)}
            scores={editScores.map(ps=>ps.slice(0,r.holes===18?9:r.holes))}
            players={players}
            onScore={(pi,hi,v)=>setEditScores(sc=>sc.map((ps,p)=>p===pi?ps.map((s,h)=>h===hi?v:s):ps))}/>
          {r.holes===18&&(
            <MultiHoleTable label="BACK 9" holeOffset={9} pars={r.pars.slice(9)}
              scores={editScores.map(ps=>ps.slice(9))} players={players}
              onScore={(pi,hi,v)=>setEditScores(sc=>sc.map((ps,p)=>p===pi?ps.map((s,h)=>h===(9+hi)?v:s):ps))}/>
          )}
        </div>
        <div style={{padding:16}}><PBtn onClick={saveEditRound} bg={G} color={CREAM}>💾 SAVE CHANGES</PBtn></div>
      </div>
    );
  }

  return null;
}

function MultiHoleTable({label,holeOffset,pars,scores,players,onScore}){
  return(
    <div style={{marginBottom:16}}>
      <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:8,color:GOLD,background:G,padding:"6px 10px",border:"3px solid #000",letterSpacing:1}}>{label}</div>
      <div style={{overflowX:"auto",border:"3px solid #000",borderTop:"none",boxShadow:"3px 3px 0 #000"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:360,background:"#fff"}}>
          <thead>
            <tr>
              <th style={rth(G,GOLD)}>HOLE</th>
              {pars.map((_,i)=><th key={i} style={rth(G,GOLD)}>{holeOffset+i+1}</th>)}
              <th style={rth(G,GOLD)}>TOT</th>
            </tr>
            <tr>
              <th style={rth("#e8f5ee","#1a5c38")}>PAR</th>
              {pars.map((p,i)=><td key={i} style={rtd("#e8f5ee")}>{p}</td>)}
              <td style={{...rtd("#e8f5ee"),fontWeight:700,fontFamily:"'Press Start 2P',monospace",fontSize:9}}>{pars.reduce((a,b)=>a+b,0)}</td>
            </tr>
          </thead>
          <tbody>
            {players.map((player,pi)=>{
              const ps=scores[pi]||[];
              const st=calcStats(ps,pars);
              return(
                <React.Fragment key={pi}>
                  <tr>
                    <td style={{...rtd(CREAM),padding:"2px 4px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:4}}>
                        <div style={{width:7,height:7,borderRadius:"50%",background:PLAYER_COLORS[pi],border:"1px solid #000",flexShrink:0}}/>
                        <span style={{fontFamily:"'Press Start 2P',monospace",fontSize:6,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:36}}>{player}</span>
                      </div>
                    </td>
                    {ps.map((s,i)=>{
                      const min=1,max=pars[i]+3,opts=[];
                      for(let v=min;v<=max;v++) opts.push(v);
                      return(
                        <td key={i} style={{...rtd(s!==""?cellColor(s,pars[i]):"#fff"),color:s!==""?cellTextColor(s,pars[i]):DARK,padding:1}}>
                          <select value={s} onChange={e=>onScore(pi,i,e.target.value===""?"":parseInt(e.target.value))}
                            style={{width:"100%",border:"none",background:"transparent",textAlign:"center",fontSize:11,fontWeight:700,fontFamily:"'Press Start 2P',monospace",outline:"none",padding:"4px 0",color:"inherit",cursor:"pointer"}}>
                            <option value="">-</option>
                            {opts.map(v=><option key={v} value={v}>{v}</option>)}
                          </select>
                        </td>
                      );
                    })}
                    <td style={{...rtd(CREAM),fontFamily:"'Press Start 2P',monospace",fontSize:9,fontWeight:700}}>{st.total||""}</td>
                  </tr>
                  <tr>
                    <td style={{...rtd("#f9f9f9"),fontFamily:"'Press Start 2P',monospace",fontSize:6,color:"#9ca3af"}}>±PAR</td>
                    {ps.map((s,i)=>{
                      const diff=s!==""?parseInt(s)-pars[i]:null;
                      return <td key={i} style={{...rtd("#f9f9f9"),fontFamily:"'Press Start 2P',monospace",fontSize:7,color:diff<0?"#166634":diff>0?"#dc2626":DARK}}>{diff===null?"":diff===0?"E":diff>0?`+${diff}`:diff}</td>;
                    })}
                    <td style={{...rtd("#f9f9f9"),fontFamily:"'Press Start 2P',monospace",fontSize:8,fontWeight:700,color:st.vspar<0?"#166534":st.vspar>0?"#dc2626":DARK}}>{st.total?(st.vspar===0?"E":st.vspar>0?`+${st.vspar}`:st.vspar):""}</td>
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

function MultiHoleTableReadOnly({label,holeOffset,pars,scores,players}){
  return(
    <div style={{marginBottom:16}}>
      <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:8,color:GOLD,background:G,padding:"6px 10px",border:"3px solid #000"}}>{label}</div>
      <div style={{overflowX:"auto",border:"3px solid #000",borderTop:"none",boxShadow:"3px 3px 0 #000"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:360,background:"#fff"}}>
          <thead>
            <tr>
              <th style={rth(G,GOLD)}>HOLE</th>
              {pars.map((_,i)=><th key={i} style={rth(G,GOLD)}>{holeOffset+i+1}</th>)}
              <th style={rth(G,GOLD)}>TOT</th>
            </tr>
            <tr>
              <th style={rth("#e8f5ee","#1a5c38")}>PAR</th>
              {pars.map((p,i)=><td key={i} style={rtd("#e8f5ee")}>{p}</td>)}
              <td style={{...rtd("#e8f5ee"),fontWeight:700}}>{pars.reduce((a,b)=>a+b,0)}</td>
            </tr>
          </thead>
          <tbody>
            {players.map((player,pi)=>{
              const ps=scores[pi]||[];
              const st=calcStats(ps,pars);
              return(
                <tr key={pi}>
                  <td style={{...rtd(CREAM),padding:"2px 4px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:4}}>
                      <div style={{width:7,height:7,borderRadius:"50%",background:PLAYER_COLORS[pi],border:"1px solid #000",flexShrink:0}}/>
                      <span style={{fontFamily:"'Press Start 2P',monospace",fontSize:6,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:36}}>{player}</span>
                    </div>
                  </td>
                  {ps.map((s,i)=>(
                    <td key={i} style={{...rtd(s!==""?cellColor(s,pars[i]):"#fff"),color:s!==""?cellTextColor(s,pars[i]):DARK,fontFamily:"'Press Start 2P',monospace",fontSize:10,fontWeight:700}}>{s}</td>
                  ))}
                  <td style={{...rtd(CREAM),fontFamily:"'Press Start 2P',monospace",fontSize:9,fontWeight:700}}>{st.total||""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RetroHeader({title,back}){
  return(
    <div style={{background:G,borderBottom:`4px solid ${GOLD}`,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:10}}>
      <button onClick={back} className="pixel-btn" style={{background:GOLD,color:DARK,border:"3px solid #000",padding:"6px 10px",fontFamily:"'Press Start 2P',monospace",fontSize:12,boxShadow:"2px 2px 0 #000"}}>◀</button>
      <span style={{fontFamily:"'Press Start 2P',monospace",fontSize:10,color:CREAM,letterSpacing:1,flex:1}}>{title}</span>
    </div>
  );
}

// Simple button - no wrapper component issues
function PBtn({onClick,bg,color,children}){
  return(
    <button onClick={onClick} className="pixel-btn"
      style={{flex:1,width:"100%",padding:"14px 16px",background:bg,color,fontFamily:"'Press Start 2P',monospace",fontSize:10,border:"3px solid #000",boxShadow:"4px 4px 0 #000",letterSpacing:1}}>
      {children}
    </button>
  );
}

function PixelCard({children}){
  return <div style={{background:"#fff",border:"3px solid #000",boxShadow:"5px 5px 0 #000",padding:20,marginBottom:16,overflow:"hidden"}}>{children}</div>;
}

function FieldLabel({children}){
  return <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:8,color:G,marginBottom:6,letterSpacing:1}}>{children}</div>;
}

function RetroInput({value,onChange,placeholder,type="text"}){
  return(
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{width:"100%",padding:"10px 12px",border:"3px solid #000",fontSize:15,marginBottom:14,background:CREAM,fontFamily:"'IM Fell English',serif",outline:"none",boxShadow:"2px 2px 0 #000",display:"block",maxWidth:"100%"}}/>
  );
}

const selectStyle={width:"100%",padding:"10px 12px",border:"3px solid #000",fontSize:14,marginBottom:14,background:CREAM,fontFamily:"'IM Fell English',serif",outline:"none",boxShadow:"2px 2px 0 #000"};
function rth(bg,color){ return{background:bg,color,padding:"6px 4px",fontFamily:"'Press Start 2P',monospace",fontSize:8,textAlign:"center",borderRight:"1px solid rgba(0,0,0,0.2)",fontWeight:700}; }
function rtd(bg){ return{padding:"6px 4px",fontSize:12,textAlign:"center",border:"1px solid #d1d5db",background:bg,fontFamily:"'IM Fell English',serif"}; }
