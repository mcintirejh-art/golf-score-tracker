import React, { useState, useEffect } from "react";

const PAR_OPTIONS = [3, 4, 5];
const defaultPars = (holes) => Array(holes).fill(4);
const defaultScores = (holes) => Array(holes).fill("");

// ── THEME DEFINITIONS ──────────────────────────────────────────────
const THEMES = {
  morning: {
    key: "morning",
    label: "🌅 MORNING",
    name: "MORNING ROUND",
    desc: "COOL MIST · SOFT BLUES",
    vars: {
      "--sky": "#2a4a6b",
      "--sky-light": "#1a2744",
      "--sky-pale": "#deeef8",
      "--fairway": "#5a9467",
      "--fairway-dark": "#3d6b4a",
      "--fairway-light": "#80b890",
      "--fairway-pale": "#c8e8d0",
      "--rough": "#2d5438",
      "--sand": "#c8e0f0",
      "--sand-dark": "#5a8ab8",
      "--white": "#f0f6fc",
      "--off-white": "#e4f0f8",
      "--text": "#0e2236",
      "--text-mid": "#2a5070",
      "--text-light": "#5a88a8",
      "--red": "#c03030",
      "--red-light": "#f0d0d0",
      "--border": "#6a9ab8",
      "--border-dark": "#3a6a90",
      "--shadow": "rgba(26,39,68,0.18)",
      "--panel-bg": "rgba(18,32,58,0.96)",
      "--panel-border": "#3a6a9a",
      "--panel-header": "linear-gradient(90deg,#1e3d6a,#2a5585)",
      "--panel-title-color": "#a8d4f0",
      "--accent": "#a8d4f0",
      "--accent-bright": "#c8e8ff",
      "--score-eagle-bg": "#0d3320",
      "--score-eagle-fg": "#60e890",
      "--score-birdie-bg": "#1a3a28",
      "--score-birdie-fg": "#80d890",
      "--score-bogey-bg": "#3a1a20",
      "--score-bogey-fg": "#e87880",
      "--btn-primary-bg": "#1e4a7a",
      "--btn-primary-border": "#4a8abf",
      "--btn-primary-color": "#a8d4f0",
      "--btn-primary-shadow": "#0e2a4a",
      "--home-grad": "linear-gradient(180deg,#1a2744 0%,#2a4a6b 45%,#3d6b4a 45%,#5a9467 100%)",
      "--hdr-bg": "#1e3d6a",
      "--hdr-border": "#2a5585",
      "--hdr-shadow": "#0e2040",
      "--home-btn-bg": "rgba(240,248,255,0.93)",
      "--home-btn-text": "#0e2236",
      "--home-btn-border": "rgba(168,212,240,0.7)",
      "--logo-title-color": "#ffffff",
    }
  },
  golden: {
    key: "golden",
    label: "🌇 GOLDEN HOUR",
    name: "GOLDEN HOUR",
    desc: "WARM AMBER · LONG SHADOWS",
    vars: {
      "--sky": "#2d1f0a",
      "--sky-light": "#1a1208",
      "--sky-pale": "#fff0d0",
      "--fairway": "#3d6824",
      "--fairway-dark": "#2a4a18",
      "--fairway-light": "#6a9838",
      "--fairway-pale": "#c8e0a0",
      "--rough": "#1e3810",
      "--sand": "#3a2008",
      "--sand-dark": "#7a4010",
      "--white": "#fdf4e0",
      "--off-white": "#f8ead0",
      "--text": "#1a0e04",
      "--text-mid": "#6a3810",
      "--text-light": "#a86828",
      "--red": "#c83020",
      "--red-light": "#f0d0c0",
      "--border": "#7a4010",
      "--border-dark": "#c87828",
      "--shadow": "rgba(26,14,4,0.25)",
      "--panel-bg": "rgba(14,8,2,0.96)",
      "--panel-border": "#7a4010",
      "--panel-header": "linear-gradient(90deg,#2a1600,#3a2008)",
      "--panel-title-color": "#f0c060",
      "--accent": "#f0c060",
      "--accent-bright": "#ffd878",
      "--score-eagle-bg": "#0a1e08",
      "--score-eagle-fg": "#60c840",
      "--score-birdie-bg": "#121e08",
      "--score-birdie-fg": "#88d840",
      "--score-bogey-bg": "#2a0e08",
      "--score-bogey-fg": "#e87040",
      "--btn-primary-bg": "#3a1e04",
      "--btn-primary-border": "#c87828",
      "--btn-primary-color": "#ffd060",
      "--btn-primary-shadow": "#1a0c00",
      "--home-grad": "linear-gradient(180deg,#0a0604 0%,#2d1f0a 30%,#c87828 60%,#2a4a18 60%,#3d6824 100%)",
      "--hdr-bg": "#2a1600",
      "--hdr-border": "#3a2008",
      "--hdr-shadow": "#100800",
      "--home-btn-bg": "rgba(253,244,224,0.93)",
      "--home-btn-text": "#1a0e04",
      "--home-btn-border": "rgba(200,120,40,0.5)",
      "--logo-title-color": "#ffd878",
    }
  },
  night: {
    key: "night",
    label: "🌙 NIGHT",
    name: "NIGHT / TORCHLIGHT",
    desc: "DEEP EMERALD · GOLD LANTERNS",
    vars: {
      "--sky": "#0f1f14",
      "--sky-light": "#080f0a",
      "--sky-pale": "#c8f0d8",
      "--fairway": "#163018",
      "--fairway-dark": "#0d2010",
      "--fairway-light": "#2a5830",
      "--fairway-pale": "#132b18",
      "--rough": "#081208",
      "--sand": "#0e1e10",
      "--sand-dark": "#1e5028",
      "--white": "#0d1a10",
      "--off-white": "#0f1e13",
      "--text": "#d8f8e0",
      "--text-mid": "#8cd8a0",
      "--text-light": "#5aaa70",
      "--red": "#ff6b58",
      "--red-light": "#2a0c0c",
      "--border": "#1e5028",
      "--border-dark": "#2a8840",
      "--shadow": "rgba(4,12,6,0.4)",
      "--panel-bg": "rgba(4,10,5,0.97)",
      "--panel-border": "#1e5028",
      "--panel-header": "linear-gradient(90deg,#081208,#0e1e10)",
      "--panel-title-color": "#6ad880",
      "--accent": "#6ad880",
      "--accent-bright": "#c8f0d8",
      "--score-eagle-bg": "#0a2a10",
      "--score-eagle-fg": "#e8f840",
      "--score-birdie-bg": "#0c2014",
      "--score-birdie-fg": "#7af090",
      "--score-bogey-bg": "#2a0c0c",
      "--score-bogey-fg": "#ff6b58",
      "--btn-primary-bg": "#0a1e0c",
      "--btn-primary-border": "#2a8840",
      "--btn-primary-color": "#6ad880",
      "--btn-primary-shadow": "#040a04",
      "--home-grad": "linear-gradient(180deg,#020806 0%,#080f0a 50%,#0d2010 50%,#163018 100%)",
      "--hdr-bg": "#081208",
      "--hdr-border": "#0e1e10",
      "--hdr-shadow": "#020602",
      "--home-btn-bg": "rgba(14,30,18,0.97)",
      "--home-btn-text": "#d8f8e0",
      "--home-btn-border": "rgba(90,170,112,0.7)",
      "--logo-title-color": "#7af090",
    }
  }
};

function applyTheme(themeKey) {
  const theme = THEMES[themeKey] || THEMES.morning;
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

const style = document.createElement("style");
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');

  :root {
    --sky: #7dd4f0;
    --sky-light: #b8e8f8;
    --sky-pale: #e8f7fd;
    --fairway: #4caf50;
    --fairway-dark: #2e7d32;
    --fairway-light: #81c784;
    --fairway-pale: #c8e6c9;
    --rough: #388e3c;
    --sand: #f5dfa0;
    --sand-dark: #c8a84b;
    --white: #ffffff;
    --off-white: #f5f9f0;
    --text: #1b3a1b;
    --text-mid: #3d6b3d;
    --text-light: #6a9b6a;
    --red: #d32f2f;
    --red-light: #ffcdd2;
    --border: #a5d6a7;
    --border-dark: #4caf50;
    --shadow: rgba(46,125,50,0.10);
    --panel-bg: rgba(18,40,18,0.95);
    --panel-border: #4caf50;
    --panel-header: linear-gradient(90deg,#2e7d32,#388e3c);
    --panel-title-color: #ffffff;
    --accent: #81c784;
    --accent-bright: #c8e6c9;
    --score-eagle-bg: #1b5e20;
    --score-eagle-fg: #ffd600;
    --score-birdie-bg: #43a047;
    --score-birdie-fg: #ffffff;
    --score-bogey-bg: #ffcdd2;
    --score-bogey-fg: #b71c1c;
    --btn-primary-bg: #2e7d32;
    --btn-primary-border: #388e3c;
    --btn-primary-color: #ffffff;
    --btn-primary-shadow: #1b5e20;
    --home-grad: linear-gradient(180deg,#b8e8f8 0%,#7dd4f0 45%,#c8e6c9 45%,#4caf50 65%,#2e7d32 100%);
    --hdr-bg: #2e7d32;
    --hdr-border: #388e3c;
    --hdr-shadow: #1b5e20;
    --home-btn-bg: rgba(255,255,255,0.92);
    --home-btn-text: #1b3a1b;
    --home-btn-border: rgba(255,255,255,0.5);
    --logo-title-color: #ffffff;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--sky);
    font-family: 'VT323', monospace;
    color: var(--text);
    min-height: 100vh;
  }

  .app-bg {
    min-height: 100vh;
    background: linear-gradient(180deg, var(--sky-light) 0%, var(--sky) 38%, var(--fairway-pale) 38%, var(--off-white) 100%);
  }

  .hdr {
    background: var(--hdr-bg);
    border-bottom: 3px solid var(--hdr-border);
    padding: 10px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 3px 0 var(--hdr-shadow);
  }
  .hdr-title {
    font-family: 'Press Start 2P', monospace;
    font-size: 11px;
    color: #fff;
    letter-spacing: 1px;
    text-shadow: 2px 2px 0 rgba(0,0,0,0.3);
    line-height: 1.4;
  }
  .hdr-sub { font-size: 14px; color: var(--accent); letter-spacing: 1px; margin-top: 1px; }
  .hdr-back {
    background: rgba(0,0,0,0.2);
    border: 2px solid rgba(255,255,255,0.3);
    color: #fff;
    font-family: 'VT323', monospace;
    font-size: 16px;
    padding: 5px 12px;
    cursor: pointer;
    letter-spacing: 1px;
    border-radius: 2px;
    flex-shrink: 0;
  }
  .hdr-back:active { background: rgba(0,0,0,0.4); }

  .screen { padding: 10px 8px; max-width: 520px; margin: 0 auto; }

  .card {
    background: var(--white);
    border: 2px solid var(--border);
    border-radius: 4px;
    margin-bottom: 10px;
    overflow: hidden;
    box-shadow: 0 3px 0 var(--border), 0 4px 8px var(--shadow);
  }
  .card-hdr {
    background: var(--panel-header);
    border-bottom: 2px solid var(--border-dark);
    padding: 7px 12px;
    font-family: 'Press Start 2P', monospace;
    font-size: 9px;
    color: var(--panel-title-color);
    letter-spacing: 1px;
  }
  .card-body { padding: 12px 10px; }

  .lbl {
    font-family: 'Press Start 2P', monospace;
    font-size: 8px;
    color: var(--text-mid);
    letter-spacing: 1px;
    margin-bottom: 6px;
  }
  .field { margin-bottom: 12px; }

  .inp {
    width: 100%;
    background: var(--off-white);
    border: 2px solid var(--border-dark);
    border-radius: 3px;
    color: var(--text);
    font-family: 'VT323', monospace;
    font-size: 20px;
    padding: 9px 10px;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
  }
  .inp:focus { border-color: var(--fairway-dark); box-shadow: 0 0 0 3px var(--fairway-pale); }

  .sel {
    width: 100%;
    background: var(--off-white);
    border: 2px solid var(--border-dark);
    border-radius: 3px;
    color: var(--text);
    font-family: 'VT323', monospace;
    font-size: 20px;
    padding: 9px 10px;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%232e7d32' d='M0 0l6 8 6-8z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-color: var(--off-white);
  }

  .btn {
    background: var(--white);
    border: 2px solid var(--border-dark);
    color: var(--text);
    font-family: 'VT323', monospace;
    font-size: 18px;
    padding: 10px 14px;
    cursor: pointer;
    letter-spacing: 1px;
    border-radius: 3px;
    text-align: center;
    display: block;
    width: 100%;
    transition: background 0.1s;
  }
  .btn:hover { background: var(--fairway-pale); }
  .btn:active { background: var(--fairway-light); }

  .btn-primary {
    background: var(--btn-primary-bg);
    border: 2px solid var(--btn-primary-border);
    color: var(--btn-primary-color);
    font-family: 'Press Start 2P', monospace;
    font-size: 10px;
    padding: 14px 16px;
    letter-spacing: 2px;
    box-shadow: 0 4px 0 var(--btn-primary-shadow);
  }
  .btn-primary:hover { filter: brightness(1.15); color: var(--btn-primary-color); }
  .btn-primary:active { box-shadow: none; transform: translateY(3px); }

  .btn-danger { border-color: var(--red); color: var(--red); }
  .btn-danger:hover { background: var(--red-light); }

  .btn-sm { padding: 7px 12px; font-size: 16px; width: auto; display: inline-block; }

  .tee-grid { display: flex; flex-wrap: wrap; gap: 6px; }
  .tee-btn {
    background: var(--white);
    border: 2px solid var(--border);
    color: var(--text-mid);
    font-family: 'VT323', monospace;
    font-size: 17px;
    padding: 7px 12px;
    cursor: pointer;
    border-radius: 3px;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.1s;
  }
  .tee-btn.active { border-color: var(--border-dark); color: var(--text); background: var(--fairway-pale); font-family: 'Press Start 2P', monospace; font-size: 9px; }

  .hole-type-row { display: flex; gap: 8px; }
  .hole-type-btn {
    flex: 1;
    background: var(--off-white);
    border: 2px solid var(--border);
    color: var(--text-mid);
    font-family: 'Press Start 2P', monospace;
    font-size: 9px;
    padding: 12px 0;
    cursor: pointer;
    border-radius: 3px;
    letter-spacing: 1px;
    transition: all 0.1s;
  }
  .hole-type-btn.active { background: var(--btn-primary-bg); border-color: var(--btn-primary-border); color: var(--btn-primary-color); box-shadow: 0 3px 0 var(--btn-primary-shadow); }

  .holes-grid { display: grid; grid-template-columns: repeat(9, 1fr); gap: 4px; }
  .hole-item { text-align: center; }
  .hole-num { font-family: 'Press Start 2P', monospace; font-size: 7px; color: var(--text-light); margin-bottom: 3px; }
  .hole-sel {
    width: 100%;
    background: var(--off-white);
    border: 2px solid var(--border);
    border-radius: 2px;
    color: var(--text);
    font-family: 'VT323', monospace;
    font-size: 17px;
    padding: 4px 0;
    text-align: center;
    text-align-last: center;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
    outline: none;
  }

  .statbar {
    background: var(--white);
    border: 2px solid var(--border);
    border-radius: 4px;
    padding: 8px 10px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
    overflow-x: auto;
    box-shadow: 0 2px 0 var(--border);
    -webkit-overflow-scrolling: touch;
  }
  .stat-pill { background: var(--off-white); border: 2px solid var(--border); border-radius: 3px; padding: 3px 7px; text-align: center; flex-shrink: 0; min-width: 40px; }
  .stat-pill-lbl { font-family: 'Press Start 2P', monospace; font-size: 7px; color: var(--text-light); }
  .stat-pill-val { font-size: 18px; color: var(--text); line-height: 1.1; }
  .pdot { width: 11px; height: 11px; border-radius: 50%; border: 2px solid rgba(0,0,0,0.15); flex-shrink: 0; }
  .pname { font-size: 17px; min-width: 52px; flex-shrink: 0; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px; }

  .tbl-wrap { overflow-x: auto; margin-bottom: 10px; -webkit-overflow-scrolling: touch; border: 2px solid var(--border); border-radius: 4px; box-shadow: 0 3px 0 var(--border); }
  .tbl-label { font-family: 'Press Start 2P', monospace; font-size: 8px; color: var(--white); letter-spacing: 2px; padding: 5px 0 3px 0; }
  table.tbl { border-collapse: collapse; width: 100%; min-width: 360px; }
  table.tbl th { background: var(--btn-primary-bg); color: var(--btn-primary-color); font-family: 'Press Start 2P', monospace; font-size: 7px; padding: 6px 3px; text-align: center; border: 1px solid var(--btn-primary-border); letter-spacing: 1px; }
  table.tbl td { font-family: 'VT323', monospace; font-size: 17px; text-align: center; border: 1px solid var(--border); padding: 3px 2px; background: var(--white); color: var(--text); }
  table.tbl td.par-row { background: var(--fairway-pale); color: var(--text-mid); font-size: 15px; }
  table.tbl td.tot-cell { background: var(--btn-primary-bg); color: var(--btn-primary-color); font-family: 'Press Start 2P', monospace; font-size: 8px; }
  table.tbl td.vp-row { background: var(--off-white); font-size: 13px; }
  .score-sel { width: 100%; border: none; background: transparent; text-align: center; text-align-last: center; font-size: 17px; font-family: 'VT323', monospace; outline: none; padding: 4px 0; color: inherit; cursor: pointer; -webkit-appearance: none; appearance: none; }

  .round-card { background: var(--white); border: 2px solid var(--border); border-radius: 4px; margin-bottom: 8px; cursor: pointer; overflow: hidden; box-shadow: 0 3px 0 var(--border); transition: border-color 0.15s; }
  .round-card:hover { border-color: var(--border-dark); }
  .round-card-hdr { background: var(--panel-header); border-bottom: 2px solid var(--border-dark); padding: 7px 10px; display: flex; justify-content: space-between; align-items: center; }
  .round-card-course { font-family: 'Press Start 2P', monospace; font-size: 9px; color: var(--panel-title-color); letter-spacing: 1px; }
  .round-card-meta { font-size: 13px; color: var(--accent); letter-spacing: 1px; }
  .round-card-body { padding: 8px 10px; display: flex; flex-direction: column; gap: 5px; }

  .home {
    min-height: 100vh;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 24px 12px;
    background: var(--home-grad);
    position: relative; overflow: hidden;
  }
  .cloud { position: absolute; background: var(--white); border-radius: 2px; opacity: 0.8; }
  .logo { text-align: center; margin-bottom: 32px; position: relative; z-index: 1; }
  .logo-icon { font-size: 52px; display: block; margin-bottom: 12px; }
  .logo-title { font-family: 'Press Start 2P', monospace; font-size: 18px; color: var(--logo-title-color); text-shadow: 3px 3px 0 rgba(0,0,0,0.4); line-height: 1.7; letter-spacing: 2px; }
  .logo-sub { font-size: 16px; color: var(--accent-bright); letter-spacing: 3px; margin-top: 6px; }
  .logo-ver { font-family: 'Press Start 2P', monospace; font-size: 8px; color: var(--accent); letter-spacing: 2px; margin-top: 6px; }
  .home-btns { width: 100%; max-width: 320px; display: flex; flex-direction: column; gap: 10px; position: relative; z-index: 1; }
  .home-footer { margin-top: 32px; font-family: 'Press Start 2P', monospace; font-size: 7px; color: var(--accent); letter-spacing: 2px; text-align: center; position: relative; z-index: 1; }

  .modal-overlay { position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,20,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 999; padding: 24px; }
  .modal { background: var(--white); border: 3px solid var(--border-dark); box-shadow: 0 6px 0 var(--btn-primary-shadow); max-width: 300px; width: 100%; border-radius: 4px; overflow: hidden; }
  .modal-hdr { background: var(--panel-header); border-bottom: 2px solid var(--border-dark); padding: 9px 14px; font-family: 'Press Start 2P', monospace; font-size: 9px; color: var(--panel-title-color); letter-spacing: 1px; }
  .modal-body { padding: 18px 14px; text-align: center; }
  .modal-msg { font-size: 18px; color: var(--text); margin-bottom: 16px; line-height: 1.5; letter-spacing: 1px; }
  .modal-btns { display: flex; gap: 10px; justify-content: center; }

  /* ── THEME PICKER MODAL ── */
  .theme-modal { max-width: 340px; }
  .theme-option {
    width: 100%;
    border: 2px solid var(--border);
    border-radius: 3px;
    margin-bottom: 8px;
    cursor: pointer;
    overflow: hidden;
    transition: border-color 0.15s, transform 0.1s;
    background: transparent;
    padding: 0;
    text-align: left;
  }
  .theme-option:hover { transform: translateY(-1px); }
  .theme-option.selected { border-width: 3px; }
  .theme-opt-preview {
    height: 44px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 12px;
    font-family: 'Press Start 2P', monospace;
    font-size: 8px;
    letter-spacing: 1px;
  }
  .theme-opt-desc {
    font-family: 'VT323', monospace;
    font-size: 14px;
    letter-spacing: 2px;
    padding: 4px 12px 6px;
    background: rgba(0,0,0,0.15);
  }

  .player-row { display: flex; gap: 8px; margin-bottom: 8px; align-items: center; }
  .course-chip { display: inline-flex; align-items: center; gap: 5px; background: var(--fairway-pale); border: 1px solid var(--border-dark); padding: 3px 8px; font-size: 14px; color: var(--text-mid); border-radius: 3px; margin: 2px; }
  .badge { background: var(--off-white); border: 2px solid var(--border); padding: 5px 9px; font-size: 15px; border-radius: 3px; letter-spacing: 1px; display: flex; align-items: center; gap: 4px; }
  .divider { border: none; border-top: 2px solid var(--border); margin: 10px 0; }
  .saved-msg { font-size: 16px; color: var(--text-mid); letter-spacing: 2px; padding: 5px 0; }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: var(--fairway-pale); }
  ::-webkit-scrollbar-thumb { background: var(--border-dark); border-radius: 2px; }
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

function cellBg(score,par){
  if(score===""||score===null) return "var(--white)";
  const d=parseInt(score)-par;
  if(d<=-2) return "var(--score-eagle-bg)";
  if(d===-1) return "var(--score-birdie-bg)";
  if(d===0) return "var(--white)";
  if(d===1) return "var(--red-light)";
  return "var(--red-light)";
}
function cellFg(score,par){
  if(score===""||score===null) return "var(--text)";
  const d=parseInt(score)-par;
  if(d<=-2) return "var(--score-eagle-fg)";
  if(d===-1) return "var(--score-birdie-fg)";
  if(d===0) return "var(--text)";
  return "var(--score-bogey-fg)";
}
function hcpDiff(score,par){ return((score-par)*113/113).toFixed(1); }

const PLAYER_COLORS=["#2e7d32","#0277bd","#c62828","#e65100"];

// Theme option visual configs
const THEME_VISUALS = {
  morning: { previewBg: "linear-gradient(90deg,#1a2744,#2a4a6b)", previewColor: "#a8d4f0", checkColor: "#a8d4f0", descBg: "rgba(10,20,44,0.6)", descColor: "#7ab0d8" },
  golden:  { previewBg: "linear-gradient(90deg,#1a0e04,#3a2008)", previewColor: "#f0c060", checkColor: "#f0c060", descBg: "rgba(14,8,2,0.6)",  descColor: "#c87828" },
  night:   { previewBg: "linear-gradient(90deg,#040a05,#0e1e10)", previewColor: "#4aaa60", checkColor: "#4aaa60", descBg: "rgba(4,8,4,0.7)",   descColor: "#2a8848" },
};

function ThemePickerModal({currentTheme, onSelect, onClose}){
  const [selected, setSelected] = useState(currentTheme);
  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal theme-modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-hdr">🎨 CHOOSE THEME</div>
        <div className="modal-body" style={{padding:"14px"}}>
          {Object.values(THEMES).map(theme=>{
            const vis = THEME_VISUALS[theme.key];
            const isSel = selected===theme.key;
            return(
              <button
                key={theme.key}
                className={`theme-option${isSel?" selected":""}`}
                style={{borderColor: isSel ? vis.checkColor : "rgba(255,255,255,0.1)"}}
                onClick={()=>setSelected(theme.key)}
              >
                <div className="theme-opt-preview" style={{background:vis.previewBg, color:vis.previewColor}}>
                  <span>{theme.label}</span>
                  {isSel && <span style={{fontSize:14}}>✓ SELECTED</span>}
                </div>
                <div className="theme-opt-desc" style={{background:vis.descBg, color:vis.descColor}}>
                  {theme.desc}
                </div>
              </button>
            );
          })}
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <button onClick={()=>onSelect(selected)} className="btn btn-primary" style={{flex:1,fontSize:9,padding:"12px 8px"}}>✓ APPLY</button>
            <button onClick={onClose} className="btn btn-sm" style={{flex:1}}>CANCEL</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({message,onYes,onNo}){
  return(
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-hdr">⚠ CONFIRM</div>
        <div className="modal-body">
          <div className="modal-msg">{message}</div>
          <div className="modal-btns">
            <button onClick={onYes} className="btn btn-danger btn-sm" style={{minWidth:80}}>YES</button>
            <button onClick={onNo} className="btn btn-sm" style={{minWidth:80}}>NO</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Header({title,onBack,sub}){
  return(
    <div className="hdr">
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        {onBack&&<button onClick={onBack} className="hdr-back">◄ BACK</button>}
        <div>
          <div className="hdr-title">{title}</div>
          {sub&&<div className="hdr-sub">{sub}</div>}
        </div>
      </div>
      <span style={{fontSize:24}}>⛳</span>
    </div>
  );
}

function Field({label,children,style:s}){
  return(
    <div className="field" style={s}>
      {label&&<div className="lbl">{label}</div>}
      {children}
    </div>
  );
}

function HomeScreen({onNewRound,onHistory,roundCount,currentTheme,onTheme}){
  return(
    <div className="home">
      {[[40,16,10,8],[120,20,200,14],[64,14,320,28],[72,16,80,60],[48,12,260,50]].map(([w,h,left,top],i)=>(
        <div key={i} className="cloud" style={{width:w,height:h,left,top}}/>
      ))}
      <div className="logo">
        <span className="logo-icon">⛳</span>
        <div className="logo-title">GOLF<br/>TRACKER</div>
        <div className="logo-sub">SCORE EDITION</div>
        <div className="logo-ver">VER 2.0.0</div>
      </div>
      <div className="home-btns">
        <button onClick={onNewRound} className="btn btn-primary">▶ NEW ROUND</button>
        <button onClick={onHistory} className="btn" style={{background:"var(--home-btn-bg)",color:"var(--home-btn-text)",border:"2px solid var(--home-btn-border)",fontSize:17}}>
          ROUND HISTORY {roundCount>0&&`(${roundCount})`}
        </button>
        <button onClick={onTheme} className="btn" style={{background:"var(--home-btn-bg)",color:"var(--home-btn-text)",border:"2px solid var(--home-btn-border)",fontSize:17}}>
           <span>THEME</span>
        </button>
      </div>
      <div className="home-footer">© 2026 FAIRWAY SOFTWARE INC.</div>
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
  const [confirmAbandon,setConfirmAbandon]=useState(false);
  const [showThemePicker,setShowThemePicker]=useState(false);
  const [currentTheme,setCurrentTheme]=useState("morning");

  useEffect(()=>{
    const r=localStorage.getItem("golf_rounds"); if(r) try{setRounds(JSON.parse(r));}catch{}
    const c=localStorage.getItem("golf_courses"); if(c) try{setCourses(JSON.parse(c));}catch{}
    const t=localStorage.getItem("golf_custom_tees"); if(t) try{setCustomTees(JSON.parse(t));}catch{}
    const th=localStorage.getItem("golf_theme")||"morning";
    setCurrentTheme(th);
    applyTheme(th);
  },[]);

  function handleSelectTheme(themeKey){
    setCurrentTheme(themeKey);
    applyTheme(themeKey);
    localStorage.setItem("golf_theme",themeKey);
    setShowThemePicker(false);
  }

  function saveRounds(nr){ setRounds(nr); localStorage.setItem("golf_rounds",JSON.stringify(nr)); }
  function saveCourses(nc){ setCourses(nc); localStorage.setItem("golf_courses",JSON.stringify(nc)); }
  function goHome(){ setScreen("home"); setConfirmDelete(false); setConfirmAbandon(false); setViewRound(null); setEditScores(null); }
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

  if(screen==="home") return(
    <>
      <HomeScreen onNewRound={startSetup} onHistory={goHistory} roundCount={rounds.length} currentTheme={currentTheme} onTheme={()=>setShowThemePicker(true)}/>
      {showThemePicker&&<ThemePickerModal currentTheme={currentTheme} onSelect={handleSelectTheme} onClose={()=>setShowThemePicker(false)}/>}
    </>
  );

  if(screen==="setup") return(
    <div className="app-bg">
      <Header title="NEW ROUND" onBack={goHome} sub="SETUP"/>
      <div className="screen">
        <div className="card">
          <div className="card-hdr">PLAYERS</div>
          <div className="card-body">
            {setup.players.map((p,i)=>(
              <div key={i} className="player-row">
                <div className="pdot" style={{background:PLAYER_COLORS[i]}}/>
                <input value={p} onChange={e=>updatePlayerName(i,e.target.value)} placeholder={`PLAYER ${i+1}`} className="inp" style={{flex:1}}/>
                {setup.players.length>1&&<button onClick={()=>removePlayer(i)} className="btn btn-danger btn-sm" style={{flexShrink:0,width:38,padding:"7px 0"}}>✕</button>}
              </div>
            ))}
            {setup.players.length<4&&<button onClick={addPlayer} className="btn btn-sm" style={{marginTop:4}}>+ ADD PLAYER</button>}
          </div>
        </div>

        <div className="card">
          <div className="card-hdr">DATE</div>
          <div className="card-body">
            <input type="date" value={setup.date} onChange={e=>setSetup(s=>({...s,date:e.target.value}))} className="inp"/>
          </div>
        </div>

        <div className="card">
          <div className="card-hdr">COURSE</div>
          <div className="card-body">
            {courses.length>0&&(
              <Field label="Load Preset:">
                <select onChange={e=>selectCoursePreset(e.target.value)} defaultValue="" className="sel">
                  <option value="">-- SELECT COURSE --</option>
                  {courses.map(c=><option key={c.id} value={c.id}>{c.name} ({c.holes}H)</option>)}
                </select>
                <div style={{marginTop:8,display:"flex",flexWrap:"wrap"}}>
                  {courses.map(c=>(
                    <div key={c.id} className="course-chip">
                      {c.name} ({c.holes}h)
                      <button onClick={()=>deleteCourse(c.id)} className="btn btn-danger" style={{border:"none",padding:"0 3px",width:"auto",fontSize:14,minWidth:0,background:"transparent"}}>✕</button>
                    </div>
                  ))}
                </div>
              </Field>
            )}
            <Field label="Course Name:" style={{marginBottom:0}}>
              <input value={setup.course} onChange={e=>setSetup(s=>({...s,course:e.target.value}))} placeholder="ENTER COURSE NAME" className="inp"/>
            </Field>
          </div>
        </div>

        <div className="card">
          <div className="card-hdr">TEE BOX</div>
          <div className="card-body">
            <div className="tee-grid">
              {["white","blue","black","gold",...customTees].map(t=>{
                const dotColors={white:"#e0e0e0",blue:"#1565c0",black:"#212121",gold:"#fdd835"};
                const dc=dotColors[t]||"#9e9e9e";
                return(
                  <button key={t} onClick={()=>{setSetup(s=>({...s,tee:t}));setShowCustomTee(false);}}
                    className={`tee-btn${setup.tee===t?" active":""}`}>
                    <div style={{width:10,height:10,background:dc,borderRadius:"50%",border:"1px solid rgba(0,0,0,0.2)",flexShrink:0}}/>
                    {t.toUpperCase()}
                  </button>
                );
              })}
              <button onClick={()=>setShowCustomTee(!showCustomTee)} className="tee-btn">+ CUSTOM</button>
            </div>
            {showCustomTee&&(
              <div style={{display:"flex",gap:8,marginTop:10}}>
                <input value={customTee} onChange={e=>{setCustomTee(e.target.value);setSetup(s=>({...s,tee:e.target.value||"custom"}));}}
                  placeholder="TEE COLOR" className="inp" style={{flex:1}}/>
                <button onClick={()=>{
                  if(!customTee.trim()) return;
                  const name=customTee.trim().toLowerCase();
                  if(!["white","blue","black","gold"].includes(name)&&!customTees.includes(name)){
                    const updated=[...customTees,name];
                    setCustomTees(updated);
                    localStorage.setItem("golf_custom_tees",JSON.stringify(updated));
                  }
                  setSetup(s=>({...s,tee:name})); setShowCustomTee(false);
                }} className="btn btn-primary btn-sm">OK</button>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-hdr">ROUND TYPE</div>
          <div className="card-body">
            <div className="hole-type-row">
              {[9,18].map(h=>(
                <button key={h} onClick={()=>changeHoles(h)} className={`hole-type-btn${setup.holes===h?" active":""}`}>{h} HOLES</button>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-hdr">PAR PER HOLE</div>
          <div className="card-body">
            <div className="holes-grid">
              {pars.map((p,i)=>(
                <div key={i} className="hole-item">
                  <div className="hole-num">{i+1}</div>
                  <select value={p} onChange={e=>{const np=[...pars];np[i]=parseInt(e.target.value);setPars(np);}} className="hole-sel">
                    {PAR_OPTIONS.map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div style={{fontFamily:"'VT323',monospace",fontSize:17,marginTop:10,color:"var(--text-mid)"}}>
              TOTAL PAR: <span style={{color:"var(--text-mid)",fontFamily:"'Press Start 2P',monospace",fontSize:10}}>{totalPar}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-hdr">SAVE COURSE PRESET</div>
          <div className="card-body">
            {!showSaveCourse?(
              <button onClick={()=>{setSaveCourseName(setup.course);setShowSaveCourse(true);}} className="btn">💾 SAVE COURSE PRESET</button>
            ):(
              <div style={{display:"flex",gap:8}}>
                <input value={saveCourseName} onChange={e=>setSaveCourseName(e.target.value)} className="inp" style={{flex:1}} placeholder="COURSE NAME"/>
                <button onClick={handleSaveCoursePreset} className="btn btn-primary btn-sm">SAVE</button>
                <button onClick={()=>setShowSaveCourse(false)} className="btn btn-sm">✕</button>
              </div>
            )}
            {savedMsg&&<div className="saved-msg" style={{marginTop:8}}>{savedMsg}</div>}
          </div>
        </div>

        <button onClick={beginRound} className="btn btn-primary" style={{marginBottom:24}}>▶ START ROUND</button>
      </div>
    </div>
  );

  if(screen==="round"){
    const safePars=pars||defaultPars(setup.holes);
    const safeScores=scores.length===setup.players.length?scores:setup.players.map(()=>defaultScores(setup.holes));
    const frontPars=safePars.slice(0,setup.holes===18?9:setup.holes);
    const backPars=safePars.slice(9);
    return(
      <div className="app-bg">
        <Header title={setup.course.toUpperCase()} onBack={()=>setConfirmAbandon(true)} sub={`${setup.tee.toUpperCase()} TEES`}/>
        <div className="screen">
          {confirmAbandon&&<ConfirmModal message="ABANDON THIS ROUND?" onYes={goHome} onNo={()=>setConfirmAbandon(false)}/>}
          {setup.players.map((player,pi)=>{
            const st=calcStats(safeScores[pi]||[],safePars);
            const vpStr=st.vspar===0?"E":st.vspar>0?`+${st.vspar}`:`${st.vspar}`;
            return(
              <div key={pi} className="statbar">
                <div className="pdot" style={{background:PLAYER_COLORS[pi]}}/>
                <span className="pname">{player}</span>
                {[["TOT",st.total||"—"],["PAR",vpStr],["🦅",st.eagles],["🐦",st.birdies],["+1",st.bogeys],["+2",st.doubles]].map(([l,v],i)=>(
                  <div key={i} className="stat-pill">
                    <div className="stat-pill-lbl">{l}</div>
                    <div className="stat-pill-val">{v}</div>
                  </div>
                ))}
              </div>
            );
          })}
          <HoleTable label={setup.holes===18?"FRONT 9":"HOLES"} holeOffset={0}
            pars={frontPars} scores={safeScores.map(ps=>ps.slice(0,setup.holes===18?9:setup.holes))}
            players={setup.players} onScore={setScore}/>
          {setup.holes===18&&(
            <HoleTable label="BACK 9" holeOffset={9} pars={backPars}
              scores={safeScores.map(ps=>ps.slice(9))} players={setup.players}
              onScore={(pi,hi,v)=>setScore(pi,9+hi,v)}/>
          )}
          <button onClick={finishRound} className="btn btn-primary" style={{marginBottom:24}}>💾 SAVE ROUND</button>
        </div>
      </div>
    );
  }

  if(screen==="history") return(
    <div className="app-bg">
      <Header title="ROUND HISTORY" onBack={goHome}/>
      <div className="screen">
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          <button onClick={exportCSV} className="btn btn-primary" style={{flex:1,fontSize:11,padding:"10px 8px"}}>⬇ EXPORT CSV</button>
          <label className="btn" style={{flex:1,fontSize:16,textAlign:"center",cursor:"pointer",padding:"10px 8px"}}>
            ⬆ IMPORT CSV<input type="file" accept=".csv" onChange={importCSV} style={{display:"none"}}/>
          </label>
        </div>
        <hr className="divider"/>
        {rounds.length===0&&(
          <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:10,color:"var(--text-light)",textAlign:"center",marginTop:60,lineHeight:2.5,letterSpacing:1}}>
            NO ROUNDS YET.<br/>START A NEW ROUND!
          </div>
        )}
        {rounds.map(r=>{
          const players=r.players||[r.player];
          const allStats=r.playerStats||(r.stats?[r.stats]:[]);
          return(
            <div key={r.id} className="round-card" onClick={()=>{setViewRound(r);setScreen("view");}}>
              <div className="round-card-hdr">
                <span className="round-card-course">{r.course}</span>
                <span className="round-card-meta">{r.date} · {r.holes}H · {r.tee}</span>
              </div>
              <div className="round-card-body">
                {players.map((p,pi)=>{
                  const st=allStats[pi]||{};
                  const vp=st.vspar||0;
                  const vpStr=vp===0?"E":vp>0?`+${vp}`:`${vp}`;
                  return(
                    <div key={pi} style={{display:"flex",alignItems:"center",gap:10,fontFamily:"'VT323',monospace",fontSize:18}}>
                      <div className="pdot" style={{background:PLAYER_COLORS[pi]}}/>
                      <span style={{flex:1,color:"var(--text)"}}>{p}</span>
                      <span style={{fontFamily:"'Press Start 2P',monospace",fontSize:10,color:"var(--text)"}}>{st.total||"—"}</span>
                      <span style={{color:vp<0?"var(--fairway-dark)":vp>0?"var(--red)":"var(--text-light)",minWidth:36,textAlign:"right",fontFamily:"'Press Start 2P',monospace",fontSize:9}}>{st.total?vpStr:"—"}</span>
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
      <div className="app-bg">
        <Header title={r.course.toUpperCase()} onBack={()=>setScreen("history")} sub={`${r.date} · ${r.holes}H · ${r.tee}`}/>
        <div className="screen">
          {confirmDelete&&<ConfirmModal message="DELETE THIS ROUND?" onYes={confirmDeleteRound} onNo={()=>setConfirmDelete(false)}/>}
          {players.map((p,pi)=>{
            const st=allStats[pi]||{};
            const vp=st.vspar||0;
            const vpStr=vp===0?"E":vp>0?`+${vp}`:`${vp}`;
            return(
              <div key={pi} className="card">
                <div className="card-hdr" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div className="pdot" style={{background:PLAYER_COLORS[pi],border:"2px solid rgba(255,255,255,0.4)"}}/>
                    {p.toUpperCase()}
                  </div>
                  <div style={{display:"flex",gap:12,alignItems:"center"}}>
                    <span style={{fontFamily:"'Press Start 2P',monospace",fontSize:10,color:"var(--panel-title-color)"}}>{st.total||"—"}</span>
                    <span style={{color:vp<0?"var(--accent)":vp>0?"var(--red)":"var(--accent)",fontFamily:"'Press Start 2P',monospace",fontSize:9}}>{st.total?vpStr:"—"}</span>
                    <span style={{color:"var(--accent)",fontSize:13}}>HCP:{allHcps[pi]||"—"}</span>
                  </div>
                </div>
                <div className="card-body">
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {[["🦅",st.eagles,"EAGLES"],["🐦",st.birdies,"BIRDIES"],["⚪",st.pars,"PARS"],["+1",st.bogeys,"BOGEYS"],["+2+",st.doubles,"DBL+"]].map(([icon,v,label])=>(
                      <div key={label} className="badge">
                        {icon} <span style={{color:"var(--text-mid)",fontFamily:"'Press Start 2P',monospace",fontSize:9}}>{v||0}</span>
                        <span style={{color:"var(--text-light)",fontSize:13}}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          <HoleTableReadOnly label={r.holes===18?"FRONT 9":"HOLES"} holeOffset={0}
            pars={r.pars.slice(0,r.holes===18?9:r.holes)}
            scores={allScores.map(ps=>ps.slice(0,r.holes===18?9:r.holes))} players={players}/>
          {r.holes===18&&(
            <HoleTableReadOnly label="BACK 9" holeOffset={9} pars={r.pars.slice(9)}
              scores={allScores.map(ps=>ps.slice(9))} players={players}/>
          )}
          <div style={{display:"flex",gap:8,marginBottom:24}}>
            <button onClick={()=>startEditRound(r)} className="btn" style={{flex:1}}>✏ EDIT SCORES</button>
            <button onClick={()=>setConfirmDelete(true)} className="btn btn-danger" style={{flex:1}}>🗑 DELETE</button>
          </div>
        </div>
      </div>
    );
  }

  if(screen==="edit"&&viewRound&&editScores){
    const r=viewRound;
    const players=r.players||[r.player];
    return(
      <div className="app-bg">
        <Header title={`EDIT: ${r.course.toUpperCase()}`} onBack={()=>setScreen("view")} sub={`${r.date} · ${r.tee}`}/>
        <div className="screen">
          <HoleTable label={r.holes===18?"FRONT 9":"HOLES"} holeOffset={0}
            pars={r.pars.slice(0,r.holes===18?9:r.holes)}
            scores={editScores.map(ps=>ps.slice(0,r.holes===18?9:r.holes))}
            players={players}
            onScore={(pi,hi,v)=>setEditScores(sc=>sc.map((ps,p)=>p===pi?ps.map((s,h)=>h===hi?v:s):ps))}/>
          {r.holes===18&&(
            <HoleTable label="BACK 9" holeOffset={9} pars={r.pars.slice(9)}
              scores={editScores.map(ps=>ps.slice(9))} players={players}
              onScore={(pi,hi,v)=>setEditScores(sc=>sc.map((ps,p)=>p===pi?ps.map((s,h)=>h===(9+hi)?v:s):ps))}/>
          )}
          <button onClick={saveEditRound} className="btn btn-primary" style={{marginBottom:24}}>💾 SAVE CHANGES</button>
        </div>
      </div>
    );
  }

  return null;
}

function HoleTable({label,holeOffset,pars,scores,players,onScore}){
  return(
    <div>
      <div className="tbl-label">{label}</div>
      <div className="tbl-wrap">
        <table className="tbl" style={{minWidth:340}}>
          <thead>
            <tr>
              <th style={{minWidth:50}}>HOLE</th>
              {pars.map((_,i)=><th key={i}>{holeOffset+i+1}</th>)}
              <th>TOT</th>
            </tr>
            <tr>
              <td className="par-row" style={{fontFamily:"'Press Start 2P',monospace",fontSize:7,letterSpacing:1}}>PAR</td>
              {pars.map((p,i)=><td key={i} className="par-row">{p}</td>)}
              <td className="par-row tot-cell">{pars.reduce((a,b)=>a+b,0)}</td>
            </tr>
          </thead>
          <tbody>
            {players.map((player,pi)=>{
              const ps=scores[pi]||[];
              const st=calcStats(ps,pars);
              return(
                <React.Fragment key={pi}>
                  <tr>
                    <td style={{padding:"2px 4px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:4}}>
                        <div style={{width:7,height:7,background:PLAYER_COLORS[pi],borderRadius:"50%",flexShrink:0}}/>
                        <span style={{fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:38}}>{player}</span>
                      </div>
                    </td>
                    {ps.map((s,i)=>{
                      const min=1,max=pars[i]+3,opts=[];
                      for(let v=min;v<=max;v++) opts.push(v);
                      return(
                        <td key={i} style={{background:s!==""?cellBg(s,pars[i]):"var(--white)",color:s!==""?cellFg(s,pars[i]):"var(--text)",padding:0}}>
                          <select value={s} onChange={e=>onScore(pi,i,e.target.value===""?"":parseInt(e.target.value))}
                            className="score-sel" style={{color:s!==""?cellFg(s,pars[i]):"var(--text-light)"}}>
                            <option value="">-</option>
                            {opts.map(v=><option key={v} value={v}>{v}</option>)}
                          </select>
                        </td>
                      );
                    })}
                    <td className="tot-cell">{st.total||""}</td>
                  </tr>
                  <tr>
                    <td className="vp-row" style={{fontFamily:"'Press Start 2P',monospace",fontSize:7,color:"var(--text-light)",padding:"1px 4px"}}>±PAR</td>
                    {ps.map((s,i)=>{
                      const diff=s!==""?parseInt(s)-pars[i]:null;
                      return <td key={i} className="vp-row" style={{color:diff<0?"var(--fairway-dark)":diff>0?"var(--red)":"var(--text-light)",fontSize:13}}>{diff===null?"":diff===0?"E":diff>0?`+${diff}`:diff}</td>;
                    })}
                    <td className="vp-row" style={{color:st.vspar<0?"var(--fairway-dark)":st.vspar>0?"var(--red)":"var(--text-light)",fontFamily:"'Press Start 2P',monospace",fontSize:7}}>{st.total?(st.vspar===0?"E":st.vspar>0?`+${st.vspar}`:st.vspar):""}</td>
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

function HoleTableReadOnly({label,holeOffset,pars,scores,players}){
  return(
    <div>
      <div className="tbl-label">{label}</div>
      <div className="tbl-wrap">
        <table className="tbl" style={{minWidth:340}}>
          <thead>
            <tr>
              <th style={{minWidth:50}}>HOLE</th>
              {pars.map((_,i)=><th key={i}>{holeOffset+i+1}</th>)}
              <th>TOT</th>
            </tr>
            <tr>
              <td className="par-row" style={{fontFamily:"'Press Start 2P',monospace",fontSize:7}}>PAR</td>
              {pars.map((p,i)=><td key={i} className="par-row">{p}</td>)}
              <td className="par-row tot-cell">{pars.reduce((a,b)=>a+b,0)}</td>
            </tr>
          </thead>
          <tbody>
            {players.map((player,pi)=>{
              const ps=scores[pi]||[];
              const st=calcStats(ps,pars);
              return(
                <tr key={pi}>
                  <td style={{padding:"2px 4px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:4}}>
                      <div style={{width:7,height:7,background:PLAYER_COLORS[pi],borderRadius:"50%",flexShrink:0}}/>
                      <span style={{fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:38}}>{player}</span>
                    </div>
                  </td>
                  {ps.map((s,i)=>(
                    <td key={i} style={{background:s!==""?cellBg(s,pars[i]):"var(--white)",color:s!==""?cellFg(s,pars[i]):"var(--text)",fontWeight:"bold",fontSize:17}}>{s}</td>
                  ))}
                  <td className="tot-cell">{st.total||""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
