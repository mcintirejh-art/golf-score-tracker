import { useState, useEffect } from "react";

const PAR_OPTIONS = [3, 4, 5];
const defaultPars = (holes) => Array(holes).fill(4);

// Inject Google Font
const style = document.createElement("style");
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=IM+Fell+English:ital@0;1&display=swap');
  * { box-sizing: border-box; }
  body { margin: 0; }
  select, input, button { font-family: inherit; }
  .pixel-btn {
    image-rendering: pixelated;
    border: 3px solid #000;
    box-shadow: 4px 4px 0px #000;
    transition: box-shadow 0.1s, transform 0.1s;
    cursor: pointer;
  }
  .pixel-btn:active {
    box-shadow: 1px 1px 0px #000;
    transform: translate(3px, 3px);
  }
  .pixel-border {
    border: 3px solid #000;
    box-shadow: 4px 4px 0px #000;
  }
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
  if(score===""||score===null) return "#f5f0e0";
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
function handicapDiff(score,par){ return((score-par)*113/113).toFixed(1); }

const SCREENS={HOME:"home",SETUP:"setup",ROUND:"round",HISTORY:"history",VIEW:"view"};

const G="#1a5c38", GOLD="#f0c040", CREAM="#f5f0e0", DARK="#1a1a1a";

export default function App(){
  const [screen,setScreen]=useState(SCREENS.HOME);
  const [rounds,setRounds]=useState([]);
  const [courses,setCourses]=useState([]);
  const [customTees,setCustomTees]=useState([]);
  const [setup,setSetup]=useState({player:"",date:new Date().toISOString().split("T")[0],course:"",holes:18,tee:"white"});
  const [pars,setPars]=useState(defaultPars(18));
  const [scores,setScores]=useState(Array(18).fill(""));
  const [viewRound,setViewRound]=useState(null);
  const [saveCourseName,setSaveCourseName]=useState("");
  const [showSaveCourse,setShowSaveCourse]=useState(false);
  const [savedMsg,setSavedMsg]=useState("");
  const [customTee,setCustomTee]=useState("");
  const [showCustomTee,setShowCustomTee]=useState(false);

useEffect(()=>{
    const r=localStorage.getItem("golf_rounds");
    if(r) setRounds(JSON.parse(r));
    const c=localStorage.getItem("golf_courses");
    if(c) setCourses(JSON.parse(c));
    const t=localStorage.getItem("golf_custom_tees");
    if(t) setCustomTees(JSON.parse(t));
  },[]);

function saveRounds(nr){ setRounds(nr); localStorage.setItem("golf_rounds",JSON.stringify(nr)); }
function saveCourses(nc){ setCourses(nc); localStorage.setItem("golf_courses",JSON.stringify(nc)); }

  function startSetup(){
    setSetup({player:"",date:new Date().toISOString().split("T")[0],course:"",holes:18,tee:"white"});
    setPars(defaultPars(18)); setScores(Array(18).fill(""));
    setShowSaveCourse(false); setSaveCourseName(""); setCustomTee(""); setShowCustomTee(false);
    setScreen(SCREENS.SETUP);
  }
  function beginRound(){ if(!setup.player||!setup.course) return alert("Please fill in player name and course."); setScreen(SCREENS.ROUND); }
  function changeHoles(h){ setSetup(s=>({...s,holes:h})); setPars(defaultPars(h)); setScores(Array(h).fill("")); }
  function selectCoursePreset(id){ if(!id) return; const c=courses.find(c=>c.id===parseInt(id)); if(!c) return; setSetup(s=>({...s,course:c.name,holes:c.holes})); setPars([...c.pars]); setScores(Array(c.holes).fill("")); }

  function handleSaveCoursePreset(){
    const name=(saveCourseName.trim()||setup.course.trim());
    if(!name) return alert("Enter a course name.");
    const exists=courses.find(c=>c.name.toLowerCase()===name.toLowerCase()&&c.holes===setup.holes);
    if(exists){ if(!window.confirm(`Update "${name}"?`)) return; saveCourses(courses.map(c=>c.name.toLowerCase()===name.toLowerCase()&&c.holes===setup.holes?{...c,pars:[...pars]}:c)); }
    else saveCourses([...courses,{id:Date.now(),name,holes:setup.holes,pars:[...pars]}]);
    setSavedMsg(`✓ "${name}" saved!`); setShowSaveCourse(false); setSaveCourseName("");
    setTimeout(()=>setSavedMsg(""),2500);
  }
  function deleteCourse(id){ if(!window.confirm("Delete this preset?")) return; saveCourses(courses.filter(c=>c.id!==id)); }
  function finishRound(){
    const stats=calcStats(scores,pars);
    saveRounds([{id:Date.now(),...setup,pars,scores,stats,hcp:handicapDiff(stats.total,pars.reduce((a,b)=>a+b,0))},...rounds]);
    setScreen(SCREENS.HOME);
  }

  const stats=calcStats(scores,pars);
  const totalPar=pars.reduce((a,b)=>a+b,0);

  // ── HOME ──
  if(screen===SCREENS.HOME) return(
    <div style={{minHeight:"100vh",background:`repeating-linear-gradient(0deg,transparent,transparent 31px,rgba(0,0,0,0.06) 31px,rgba(0,0,0,0.06) 32px),repeating-linear-gradient(90deg,transparent,transparent 31px,rgba(0,0,0,0.06) 31px,rgba(0,0,0,0.06) 32px),${G}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Press Start 2P',monospace",padding:24}}>
      <div style={{background:CREAM,border:"4px solid #000",boxShadow:"6px 6px 0 #000",padding:"32px 28px",textAlign:"center",maxWidth:340,width:"100%"}}>
        <h1 style={{fontSize:16,color:DARK,margin:"0 0 4px",lineHeight:1.8}}>GOLF SCORE</h1>
        <h1 style={{fontSize:16,color:G,margin:"0 0 24px",lineHeight:1.8}}>TRACKER</h1>
        <div style={{width:"100%",height:3,background:`repeating-linear-gradient(90deg,${GOLD} 0,${GOLD} 8px,transparent 8px,transparent 12px)`,marginBottom:24}}/>
        <PixelBtn onClick={startSetup} bg={G} color={CREAM} full>▶ NEW ROUND</PixelBtn>
        <PixelBtn onClick={()=>setScreen(SCREENS.HISTORY)} bg={GOLD} color={DARK} full style={{marginTop:12}}>
          📋 HISTORY {rounds.length>0&&`(${rounds.length})`}
        </PixelBtn>
      </div>
    </div>
  );

  // ── SETUP ──
  if(screen===SCREENS.SETUP) return(
    <div style={{minHeight:"100vh",background:CREAM,fontFamily:"'IM Fell English',serif"}}>
      <RetroHeader title="NEW ROUND" back={()=>setScreen(SCREENS.HOME)}/>
      <div style={{padding:16,maxWidth:480,margin:"0 auto"}}>
        <PixelCard>
          <FieldLabel>Player Name</FieldLabel>
          <RetroInput value={setup.player} onChange={v=>setSetup(s=>({...s,player:v}))} placeholder="Your name"/>
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
                <button key={t} onClick={()=>{setSetup(s=>({...s,tee:t}));setShowCustomTee(false);}}
                  className="pixel-btn"
                  style={{flex:"1 1 60px",padding:"8px 4px",background:active?dc:CREAM,color:active&&t!=="white"&&t!=="gold"?"#fff":DARK,fontFamily:"'Press Start 2P',monospace",fontSize:8,border:`3px solid ${active?DARK:"#aaa"}`,boxShadow:active?"4px 4px 0 #000":"2px 2px 0 #aaa"}}>
                  {t.charAt(0).toUpperCase()+t.slice(1)}
                </button>
              );
            })}
            <button onClick={()=>{setShowCustomTee(true);setSetup(s=>({...s,tee:customTee||"custom"}));}}
              className="pixel-btn"
              style={{flex:"1 1 60px",padding:"8px 4px",background:showCustomTee?GOLD:CREAM,fontFamily:"'Press Start 2P',monospace",fontSize:8,border:`3px solid ${showCustomTee?DARK:"#aaa"}`,boxShadow:showCustomTee?"4px 4px 0 #000":"2px 2px 0 #aaa",color:DARK}}>
              +CUSTOM
            </button>
          </div>
          {showCustomTee&&(
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              <input value={customTee} onChange={e=>{setCustomTee(e.target.value);setSetup(s=>({...s,tee:e.target.value||"custom"}));}}
                placeholder="e.g. Red, Senior…"
                style={{...selectStyle,flex:1,marginBottom:0}}/>
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
                <input value={saveCourseName} onChange={e=>setSaveCourseName(e.target.value)} placeholder="Course name"
                  style={{flex:1,...selectStyle,marginBottom:0}}/>
                <button onClick={handleSaveCoursePreset} className="pixel-btn" style={{background:G,color:CREAM,border:"3px solid #000",padding:"8px 14px",fontFamily:"'Press Start 2P',monospace",fontSize:10}}>SAVE</button>
                <button onClick={()=>setShowSaveCourse(false)} className="pixel-btn" style={{background:"#e5e7eb",color:DARK,border:"3px solid #000",padding:"8px 10px",fontFamily:"'Press Start 2P',monospace",fontSize:10}}>✕</button>
              </div>
            </div>
          )}
          {savedMsg&&<div style={{color:G,fontFamily:"'Press Start 2P',monospace",fontSize:9,marginBottom:10,textAlign:"center"}}>{savedMsg}</div>}
          <PixelBtn onClick={beginRound} bg={G} color={CREAM} full>START ROUND ▶</PixelBtn>
        </PixelCard>
      </div>
    </div>
  );

  // ── ROUND ──
  if(screen===SCREENS.ROUND){
    const front=scores.slice(0,setup.holes===18?9:setup.holes);
    const back=setup.holes===18?scores.slice(9):[];
    const frontPars=pars.slice(0,setup.holes===18?9:pars.length);
    const backPars=pars.slice(9);
    const frontStats=calcStats(front,frontPars);
    const backStats=calcStats(back,backPars);
    const vpStr=stats.vspar===0?"E":stats.vspar>0?`+${stats.vspar}`:`${stats.vspar}`;
    return(
      <div style={{minHeight:"100vh",background:CREAM,fontFamily:"'IM Fell English',serif"}}>
        <RetroHeader title={setup.course.toUpperCase()} back={()=>{if(window.confirm("Abandon round?")) setScreen(SCREENS.HOME);}}/>
        <div style={{padding:"8px 12px 4px",fontFamily:"'Press Start 2P',monospace",fontSize:8,color:"#6b7280",textAlign:"center"}}>
          {setup.player} · {setup.tee.toUpperCase()} TEES · {setup.holes} HOLES
        </div>

        {/* Stats bar */}
        <div style={{display:"flex",gap:6,padding:"8px 12px",overflowX:"auto"}}>
          {[
            {label:"TOTAL",val:stats.total||"—"},
            {label:"VS PAR",val:vpStr,color:stats.vspar<0?"#166534":stats.vspar>0?"#dc2626":DARK},
            {label:"🦅",val:stats.eagles},
            {label:"🐦",val:stats.birdies},
            {label:"PAR",val:stats.pars},
            {label:"+1",val:stats.bogeys},
            {label:"+2",val:stats.doubles},
          ].map((s,i)=>(
            <div key={i} style={{background:"#fff",border:"3px solid #000",boxShadow:"2px 2px 0 #000",padding:"6px 8px",minWidth:46,textAlign:"center",flexShrink:0}}>
              <div style={{fontSize:7,color:"#6b7280",fontFamily:"'Press Start 2P',monospace",marginBottom:3}}>{s.label}</div>
              <div style={{fontWeight:800,fontSize:13,fontFamily:"'Press Start 2P',monospace",color:s.color||DARK}}>{s.val}</div>
            </div>
          ))}
        </div>

        <div style={{padding:"0 12px"}}>
          <RetroHoleTable label={setup.holes===18?"FRONT 9":"HOLES"} holeOffset={0} pars={frontPars} scores={front} onChange={(i,v)=>{const ns=[...scores];ns[i]=v;setScores(ns);}} stats={frontStats}/>
          {setup.holes===18&&<RetroHoleTable label="BACK 9" holeOffset={9} pars={backPars} scores={back} onChange={(i,v)=>{const ns=[...scores];ns[9+i]=v;setScores(ns);}} stats={backStats}/>}
        </div>
        <div style={{padding:16}}>
          <PixelBtn onClick={finishRound} bg={G} color={CREAM} full>💾 SAVE ROUND</PixelBtn>
        </div>
      </div>
    );
  }

  // ── HISTORY ──
  if(screen===SCREENS.HISTORY) return(
    <div style={{minHeight:"100vh",background:CREAM,fontFamily:"'IM Fell English',serif"}}>
      <RetroHeader title="HISTORY" back={()=>setScreen(SCREENS.HOME)}/>
      <div style={{padding:"0 16px",maxWidth:480,margin:"0 auto"}}>
        {rounds.length===0&&<p style={{color:"#6b7280",textAlign:"center",marginTop:40,fontFamily:"'Press Start 2P',monospace",fontSize:9}}>NO ROUNDS SAVED YET.</p>}
        {rounds.map(r=>{
          const vp=r.stats.vspar;
          const vpStr=vp===0?"E":vp>0?`+${vp}`:`${vp}`;
          return(
            <div key={r.id} onClick={()=>{setViewRound(r);setScreen(SCREENS.VIEW);}}
              style={{background:"#fff",border:"3px solid #000",boxShadow:"4px 4px 0 #000",padding:"14px 16px",marginBottom:12,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:9,color:G,marginBottom:6}}>{r.course}</div>
                <div style={{fontSize:14,color:"#6b7280"}}>{r.player} · {r.date}</div>
                <div style={{fontSize:13,color:"#6b7280"}}>{r.holes} holes · {r.tee} tees</div>
                <div style={{fontSize:12,color:"#9ca3af",marginTop:2}}>HCP: {r.hcp}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:18,color:DARK}}>{r.stats.total}</div>
                <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:11,color:vp<0?"#166534":vp>0?"#dc2626":DARK,marginTop:4}}>{vpStr}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── VIEW ROUND ──
  if(screen===SCREENS.VIEW&&viewRound){
    const r=viewRound;
    const vp=r.stats.vspar;
    const vpStr=vp===0?"E":vp>0?`+${vp}`:`${vp}`;
    const front=r.scores.slice(0,r.holes===18?9:r.holes);
    const back=r.holes===18?r.scores.slice(9):[];
    const frontPars=r.pars.slice(0,r.holes===18?9:r.pars.length);
    const backPars=r.pars.slice(9);
    return(
      <div style={{minHeight:"100vh",background:CREAM,fontFamily:"'IM Fell English',serif"}}>
        <RetroHeader title={r.course.toUpperCase()} back={()=>setScreen(SCREENS.HISTORY)}/>
        <div style={{padding:"12px 16px",maxWidth:480,margin:"0 auto"}}>
          <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:8,color:"#6b7280",marginBottom:10}}>{r.player} · {r.date} · {r.holes}H · {r.tee?.toUpperCase()} TEES</div>
          <div style={{display:"flex",gap:16,alignItems:"flex-end",marginBottom:12}}>
            <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:22,color:DARK}}>{r.stats.total}</div>
            <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:16,color:vp<0?"#166534":vp>0?"#dc2626":DARK}}>{vpStr}</div>
            <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:8,color:"#9ca3af",paddingBottom:2}}>HCP {r.hcp}</div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
            {[["🦅",r.stats.eagles,"Eagles"],["🐦",r.stats.birdies,"Birdies"],["⚪",r.stats.pars,"Pars"],["+1",r.stats.bogeys,"Bogeys"],["+2+",r.stats.doubles,"Doubles"]].map(([icon,v,label])=>(
              <div key={label} style={{background:"#fff",border:"2px solid #000",boxShadow:"2px 2px 0 #000",padding:"6px 10px",fontFamily:"'Press Start 2P',monospace",fontSize:8,textAlign:"center"}}>
                <div style={{fontSize:14,marginBottom:2}}>{icon}</div>
                <div style={{color:G,fontSize:11}}>{v}</div>
                <div style={{color:"#6b7280",fontSize:7}}>{label}</div>
              </div>
            ))}
          </div>
          <RetroHoleTableReadOnly label={r.holes===18?"FRONT 9":"HOLES"} holeOffset={0} pars={frontPars} scores={front}/>
          {r.holes===18&&<RetroHoleTableReadOnly label="BACK 9" holeOffset={9} pars={backPars} scores={back}/>}
        </div>
      </div>
    );
  }
  return null;
}

function RetroHoleTable({label,holeOffset,pars,scores,onChange,stats}){
  return(
    <div style={{marginBottom:16}}>
      <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:8,color:GOLD,background:G,padding:"6px 10px",border:"3px solid #000",marginBottom:0,letterSpacing:1}}>{label}</div>
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
            <tr>
              <td style={{...rtd(CREAM),fontFamily:"'Press Start 2P',monospace",fontSize:8,fontWeight:700}}>SCR</td>
              {scores.map((s,i)=>{
                const min=1, max=pars[i]+3;
                const opts=[];
                for(let v=min;v<=max;v++) opts.push(v);
                return(
                  <td key={i} style={{...rtd(s!==""?cellColor(s,pars[i]):"#fff"),color:s!==""?cellTextColor(s,pars[i]):DARK,padding:1}}>
                    <select value={s} onChange={e=>onChange(i,e.target.value===""?"":parseInt(e.target.value))}
                      style={{width:"100%",border:"none",background:"transparent",textAlign:"center",fontSize:11,fontWeight:700,fontFamily:"'Press Start 2P',monospace",outline:"none",padding:"4px 0",color:"inherit",cursor:"pointer"}}>
                      <option value="">-</option>
                      {opts.map(v=><option key={v} value={v}>{v}</option>)}
                    </select>
                  </td>
                );
              })}
              <td style={{...rtd(CREAM),fontFamily:"'Press Start 2P',monospace",fontSize:9,fontWeight:700}}>{stats.total||""}</td>
            </tr>
            <tr>
              <td style={{...rtd("#f9f9f9"),fontFamily:"'Press Start 2P',monospace",fontSize:7,color:"#6b7280"}}>±PAR</td>
              {scores.map((s,i)=>{
                const diff=s!==""?parseInt(s)-pars[i]:null;
                return <td key={i} style={{...rtd("#f9f9f9"),fontFamily:"'Press Start 2P',monospace",fontSize:8,color:diff<0?"#166534":diff>0?"#dc2626":DARK}}>{diff===null?"":diff===0?"E":diff>0?`+${diff}`:diff}</td>;
              })}
              <td style={{...rtd("#f9f9f9"),fontFamily:"'Press Start 2P',monospace",fontSize:8,fontWeight:700,color:stats.vspar<0?"#166534":stats.vspar>0?"#dc2626":DARK}}>{stats.total?(stats.vspar===0?"E":stats.vspar>0?`+${stats.vspar}`:stats.vspar):""}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RetroHoleTableReadOnly({label,holeOffset,pars,scores}){
  return(
    <div style={{marginBottom:16}}>
      <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:8,color:GOLD,background:G,padding:"6px 10px",border:"3px solid #000",marginBottom:0}}>{label}</div>
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
            <tr>
              <td style={{...rtd(CREAM),fontFamily:"'Press Start 2P',monospace",fontSize:8,fontWeight:700}}>SCR</td>
              {scores.map((s,i)=>(
                <td key={i} style={{...rtd(s!==""?cellColor(s,pars[i]):"#fff"),color:s!==""?cellTextColor(s,pars[i]):DARK,fontFamily:"'Press Start 2P',monospace",fontSize:10,fontWeight:700}}>{s}</td>
              ))}
              <td style={{...rtd(CREAM),fontFamily:"'Press Start 2P',monospace",fontSize:9,fontWeight:700}}>{scores.reduce((a,b)=>a+(parseInt(b)||0),0)||""}</td>
            </tr>
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
      <span style={{fontSize:20}}>⛳</span>
    </div>
  );
}

function PixelBtn({onClick,bg,color,full,children,style:s={}}){
  return(
    <button onClick={onClick} className="pixel-btn"
      style={{width:full?"100%":undefined,padding:"14px 16px",background:bg,color,fontFamily:"'Press Start 2P',monospace",fontSize:10,border:"3px solid #000",boxShadow:"4px 4px 0 #000",letterSpacing:1,...s}}>
      {children}
    </button>
  );
}

function PixelCard({children}){
  return <div style={{background:"#fff",border:"3px solid #000",boxShadow:"5px 5px 0 #000",padding:20,marginBottom:16}}>{children}</div>;
}

function FieldLabel({children}){
  return <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:8,color:G,marginBottom:6,letterSpacing:1}}>{children}</div>;
}

function RetroInput({value,onChange,placeholder,type="text"}){
  return(
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{width:"100%",padding:"10px 12px",border:"3px solid #000",fontSize:15,marginBottom:14,background:CREAM,fontFamily:"'IM Fell English',serif",outline:"none",boxShadow:"2px 2px 0 #000"}}/>
  );
}

const selectStyle={width:"100%",padding:"10px 12px",border:"3px solid #000",fontSize:14,marginBottom:14,background:CREAM,fontFamily:"'IM Fell English',serif",outline:"none",boxShadow:"2px 2px 0 #000"};

function rth(bg,color){
  return{background:bg,color,padding:"6px 4px",fontFamily:"'Press Start 2P',monospace",fontSize:8,textAlign:"center",borderRight:"1px solid rgba(0,0,0,0.2)",fontWeight:700};
}
function rtd(bg){
  return{padding:"6px 4px",fontSize:12,textAlign:"center",border:"1px solid #d1d5db",background:bg,fontFamily:"'IM Fell English',serif"};
}