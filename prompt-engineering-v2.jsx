import { useState, useEffect, useRef } from "react";

// ========== THEME ==========
const getStyles = (dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,400;0,500;1,400&family=Nunito:wght@400;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Nunito', sans-serif; background: ${dark ? '#0a0a0f' : '#f4f4f9'}; color: ${dark ? '#e8e8f0' : '#1a1a2e'}; transition: background 0.3s, color 0.3s; }

  .app { min-height: 100vh; position: relative; overflow: hidden; }

  .bg-grid {
    position: fixed; inset: 0;
    background-image: linear-gradient(${dark ? 'rgba(99,102,241,0.04)' : 'rgba(99,102,241,0.07)'} 1px, transparent 1px), linear-gradient(90deg, ${dark ? 'rgba(99,102,241,0.04)' : 'rgba(99,102,241,0.07)'} 1px, transparent 1px);
    background-size: 40px 40px; pointer-events: none; z-index: 0;
  }
  .bg-glow {
    position: fixed; width: 600px; height: 600px;
    background: radial-gradient(circle, ${dark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)'} 0%, transparent 70%);
    top: -200px; left: 50%; transform: translateX(-50%); pointer-events: none; z-index: 0;
  }

  .header {
    position: relative; z-index: 10; text-align: center;
    padding: 40px 20px 28px;
    border-bottom: 1px solid ${dark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.2)'};
    background: ${dark ? 'transparent' : 'rgba(255,255,255,0.6)'};
  }
  .badge {
    display: inline-block; background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3);
    color: #a5b4fc; font-family: 'DM Mono', monospace; font-size: 11px; padding: 4px 12px;
    border-radius: 20px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 14px;
  }
  .title {
    font-family: 'Syne', sans-serif; font-size: clamp(26px,5vw,46px); font-weight: 800; line-height: 1.1;
    background: linear-gradient(135deg, ${dark ? '#fff' : '#1a1a2e'} 30%, #a5b4fc 70%, #818cf8 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 10px;
  }
  .subtitle { color: ${dark ? '#6b7280' : '#9ca3af'}; font-size: 14px; font-style: italic; font-family: 'DM Mono', monospace; }

  .theme-btn {
    position: absolute; top: 20px; right: 20px;
    background: ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'};
    border: 1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'};
    color: ${dark ? '#a5b4fc' : '#6366f1'}; border-radius: 50%; width: 38px; height: 38px;
    font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; z-index: 20;
  }
  .theme-btn:hover { transform: scale(1.1); }

  /* NAV TABS */
  .nav-tabs {
    display: flex; gap: 0; position: relative; z-index: 10;
    background: ${dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)'};
    border-bottom: 1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'};
    overflow-x: auto;
  }
  .nav-tab {
    flex: 1; min-width: 120px; padding: 14px 10px; text-align: center; cursor: pointer;
    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
    color: ${dark ? '#6b7280' : '#9ca3af'}; border-bottom: 2px solid transparent;
    transition: all 0.2s; letter-spacing: 0.3px;
  }
  .nav-tab.active { color: #818cf8; border-bottom-color: #6366f1; background: ${dark ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.04)'}; }
  .nav-tab:hover { color: #a5b4fc; }

  .main { position: relative; z-index: 10; max-width: 960px; margin: 0 auto; padding: 28px 16px 60px; }

  /* CARDS */
  .card {
    background: ${dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.85)'};
    border: 1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'};
    border-radius: 16px; overflow: hidden; margin-bottom: 20px;
    box-shadow: ${dark ? 'none' : '0 2px 16px rgba(0,0,0,0.06)'};
    animation: fadeIn 0.3s ease;
  }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  .card-header {
    padding: 18px 22px; border-bottom: 1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'};
    display: flex; align-items: center; gap: 12px;
    background: ${dark ? 'rgba(99,102,241,0.05)' : 'rgba(99,102,241,0.04)'};
  }
  .card-header-icon { font-size: 26px; }
  .card-header-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: ${dark ? '#e8e8f0' : '#1a1a2e'}; }
  .card-header-sub { font-size: 12px; color: ${dark ? '#6b7280' : '#9ca3af'}; font-family: 'DM Mono', monospace; margin-top: 2px; }
  .card-body { padding: 22px; }

  /* LEVEL TABS */
  .level-tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
  .level-tab {
    padding: 7px 18px; border-radius: 8px;
    border: 1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'};
    background: ${dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)'};
    color: ${dark ? '#6b7280' : '#9ca3af'}; font-family: 'Syne', sans-serif;
    font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;
  }
  .level-tab:hover { border-color: rgba(99,102,241,0.4); color: #a5b4fc; }
  .level-tab.active { background: linear-gradient(135deg,#4f46e5,#7c3aed); border-color: transparent; color: #fff; box-shadow: 0 4px 20px rgba(79,70,229,0.35); }

  /* PROFESSION GRID */
  .profession-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px,1fr)); gap: 10px; margin-bottom: 22px; }
  .prof-card {
    padding: 12px 8px; border-radius: 12px;
    border: 1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'};
    background: ${dark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.7)'};
    text-align: center; cursor: pointer; transition: all 0.2s;
  }
  .prof-card:hover { border-color: rgba(99,102,241,0.3); transform: translateY(-2px); }
  .prof-card.active { border-color: rgba(99,102,241,0.6); background: rgba(99,102,241,0.1); box-shadow: 0 0 16px rgba(99,102,241,0.15); }
  .prof-icon { font-size: 22px; margin-bottom: 5px; }
  .prof-name { font-size: 11px; font-weight: 700; color: ${dark ? '#d1d5db' : '#374151'}; font-family: 'Syne', sans-serif; }

  /* LESSON */
  .lesson { margin-bottom: 26px; }
  .lesson:last-child { margin-bottom: 0; }
  .lesson-num { font-family: 'DM Mono', monospace; font-size: 11px; color: #6366f1; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 5px; }
  .lesson-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: ${dark ? '#f1f1f8' : '#1a1a2e'}; margin-bottom: 8px; }
  .lesson-desc { font-size: 13px; color: ${dark ? '#9ca3af' : '#6b7280'}; line-height: 1.7; margin-bottom: 12px; }

  /* PROMPT BOX */
  .prompt-box {
    background: ${dark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.03)'};
    border: 1px solid ${dark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.15)'};
    border-left: 3px solid #6366f1; border-radius: 8px; padding: 14px 14px 14px 16px; position: relative;
  }
  .prompt-label { font-family: 'DM Mono', monospace; font-size: 10px; color: #6366f1; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
  .prompt-text { font-family: 'DM Mono', monospace; font-size: 12px; color: ${dark ? '#d1d5db' : '#374151'}; line-height: 1.7; white-space: pre-wrap; word-break: break-word; padding-right: 48px; }
  .btn-row { display: flex; gap: 8px; margin-top: 12px; }
  .copy-btn, .test-btn {
    padding: 5px 12px; border-radius: 5px; font-size: 11px;
    font-family: 'DM Mono', monospace; cursor: pointer; transition: all 0.15s; border: 1px solid;
  }
  .copy-btn { background: rgba(99,102,241,0.12); border-color: rgba(99,102,241,0.25); color: #a5b4fc; }
  .copy-btn:hover { background: rgba(99,102,241,0.25); }
  .test-btn { background: rgba(34,197,94,0.12); border-color: rgba(34,197,94,0.25); color: #4ade80; }
  .test-btn:hover { background: rgba(34,197,94,0.22); }
  .test-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* AI RESPONSE */
  .ai-response {
    margin-top: 12px; border-radius: 8px; overflow: hidden;
    border: 1px solid ${dark ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.3)'};
    animation: fadeIn 0.3s ease;
  }
  .ai-response-header {
    padding: 8px 14px; display: flex; align-items: center; gap: 8px;
    background: rgba(34,197,94,0.08); border-bottom: 1px solid rgba(34,197,94,0.15);
  }
  .ai-response-label { font-family: 'DM Mono', monospace; font-size: 10px; color: #4ade80; letter-spacing: 2px; text-transform: uppercase; }
  .ai-response-body { padding: 14px; font-size: 13px; color: ${dark ? '#d1d5db' : '#374151'}; line-height: 1.75; white-space: pre-wrap; }
  .ai-loading { padding: 14px; display: flex; gap: 10px; align-items: center; color: ${dark ? '#6b7280' : '#9ca3af'}; font-size: 13px; }
  .dot-anim span { display: inline-block; animation: blink 1.2s infinite; }
  .dot-anim span:nth-child(2) { animation-delay: 0.2s; }
  .dot-anim span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes blink { 0%,80%,100%{opacity:0} 40%{opacity:1} }

  /* TIP BOX */
  .tip-box {
    background: rgba(251,191,36,0.06); border: 1px solid rgba(251,191,36,0.15);
    border-radius: 8px; padding: 10px 14px; margin-top: 12px; display: flex; gap: 10px; align-items: flex-start;
  }
  .tip-text { font-size: 12px; color: ${dark ? '#d1b55a' : '#92700a'}; line-height: 1.6; }

  .divider { height: 1px; background: ${dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}; margin: 22px 0; }

  /* FRAMEWORK */
  .framework { background: rgba(99,102,241,0.06); border: 1px solid rgba(99,102,241,0.15); border-radius: 10px; padding: 16px; margin-top: 12px; }
  .framework-title { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: #a5b4fc; margin-bottom: 10px; }
  .framework-item { display: flex; gap: 10px; margin-bottom: 8px; font-size: 13px; color: ${dark ? '#9ca3af' : '#6b7280'}; line-height: 1.5; }
  .framework-key { font-family: 'DM Mono', monospace; color: #818cf8; flex-shrink: 0; min-width: 80px; font-size: 12px; }

  /* PROGRESS */
  .progress-label { display: flex; justify-content: space-between; font-size: 12px; color: ${dark ? '#6b7280' : '#9ca3af'}; margin-bottom: 8px; font-family: 'DM Mono', monospace; }
  .progress-bar { height: 4px; background: ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}; border-radius: 10px; overflow: hidden; margin-bottom: 22px; }
  .progress-fill { height: 100%; background: linear-gradient(90deg,#4f46e5,#7c3aed); border-radius: 10px; transition: width 0.5s ease; }

  /* STATS */
  .stats-row { display: flex; gap: 10px; margin-bottom: 22px; flex-wrap: wrap; }
  .stat-chip { flex: 1; min-width: 70px; background: ${dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)'}; border: 1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'}; border-radius: 10px; padding: 12px 8px; text-align: center; }
  .stat-num { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #a5b4fc; }
  .stat-label { font-size: 10px; color: ${dark ? '#6b7280' : '#9ca3af'}; margin-top: 2px; font-family: 'DM Mono', monospace; }

  /* LEVEL BADGE */
  .level-badge { margin-left: auto; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'DM Mono', monospace; }
  .level-badge.beginner { background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.2); }
  .level-badge.intermediate { background: rgba(251,191,36,0.15); color: #fbbf24; border: 1px solid rgba(251,191,36,0.2); }
  .level-badge.advanced { background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }

  /* QUIZ */
  .quiz-scene { animation: fadeIn 0.3s ease; }
  .quiz-scenario {
    background: ${dark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)'};
    border: 1px solid rgba(99,102,241,0.2); border-radius: 12px; padding: 18px; margin-bottom: 18px;
  }
  .quiz-scenario-label { font-family: 'DM Mono', monospace; font-size: 10px; color: #818cf8; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
  .quiz-scenario-text { font-size: 14px; color: ${dark ? '#e8e8f0' : '#1a1a2e'}; line-height: 1.7; font-weight: 600; }
  .quiz-hint { font-size: 12px; color: ${dark ? '#6b7280' : '#9ca3af'}; margin-top: 8px; }

  .quiz-textarea {
    width: 100%; min-height: 120px; padding: 14px; border-radius: 10px; resize: vertical;
    background: ${dark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.9)'};
    border: 1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)'};
    color: ${dark ? '#e8e8f0' : '#1a1a2e'}; font-family: 'DM Mono', monospace; font-size: 13px;
    line-height: 1.6; outline: none; transition: border 0.2s; margin-bottom: 12px;
  }
  .quiz-textarea:focus { border-color: rgba(99,102,241,0.5); }

  .submit-btn {
    padding: 10px 24px; border-radius: 8px; border: none; cursor: pointer;
    background: linear-gradient(135deg,#4f46e5,#7c3aed); color: #fff;
    font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
    transition: all 0.2s; letter-spacing: 0.3px;
  }
  .submit-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(79,70,229,0.4); }
  .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .next-btn {
    padding: 9px 20px; border-radius: 8px; border: 1px solid rgba(99,102,241,0.3);
    background: rgba(99,102,241,0.1); color: #a5b4fc; font-family: 'Syne', sans-serif;
    font-size: 13px; font-weight: 700; cursor: pointer; margin-top: 12px; transition: all 0.2s;
  }
  .next-btn:hover { background: rgba(99,102,241,0.2); }

  .score-display {
    text-align: center; padding: 24px; border-radius: 12px;
    background: ${dark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)'};
    border: 1px solid rgba(99,102,241,0.2);
  }
  .score-num { font-family: 'Syne', sans-serif; font-size: 52px; font-weight: 800; color: #818cf8; }
  .score-label { font-size: 14px; color: ${dark ? '#9ca3af' : '#6b7280'}; margin-top: 4px; }
  .score-msg { font-size: 13px; color: ${dark ? '#6b7280' : '#9ca3af'}; margin-top: 12px; line-height: 1.6; }
  .restart-btn {
    margin-top: 16px; padding: 10px 24px; border-radius: 8px; border: none; cursor: pointer;
    background: linear-gradient(135deg,#4f46e5,#7c3aed); color: #fff;
    font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
  }

  .section-label { font-size: 11px; color: ${dark ? '#6b7280' : '#9ca3af'}; font-family: 'DM Mono', monospace; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px; }

  /* QUIZ FEEDBACK */
  .feedback-box {
    border-radius: 10px; padding: 16px; margin-top: 14px;
    background: ${dark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)'};
    border: 1px solid rgba(99,102,241,0.2); font-size: 13px; line-height: 1.7;
    color: ${dark ? '#d1d5db' : '#374151'}; white-space: pre-wrap;
  }
  .feedback-score-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .feedback-score-badge { padding: 4px 14px; border-radius: 20px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; }

  /* QUIZ PROGRESS */
  .quiz-progress { display: flex; gap: 6px; margin-bottom: 20px; }
  .quiz-dot { width: 8px; height: 8px; border-radius: 50%; background: ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}; transition: background 0.3s; }
  .quiz-dot.done { background: #6366f1; }
  .quiz-dot.current { background: #a5b4fc; }

  /* TRY IT */
  .tryit-section {
    margin-top: 14px;
    background: ${dark ? 'rgba(16,185,129,0.05)' : 'rgba(16,185,129,0.04)'};
    border: 1px solid rgba(16,185,129,0.2);
    border-radius: 12px; overflow: hidden;
  }
  .tryit-header {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 14px;
    border-bottom: 1px solid rgba(16,185,129,0.15);
    cursor: pointer;
    background: rgba(16,185,129,0.04);
    user-select: none;
  }
  .tryit-header-title { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: #34d399; }
  .tryit-header-sub { font-size: 11px; color: ${dark ? '#6b7280' : '#9ca3af'}; margin-left: auto; font-family: 'DM Mono', monospace; }
  .tryit-body { padding: 14px; }
  .tryit-fields { display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px; }
  .tryit-field label {
    display: block; font-family: 'DM Mono', monospace; font-size: 10px;
    color: #6366f1; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 5px;
  }
  .tryit-input {
    width: 100%; padding: 9px 12px; border-radius: 8px;
    background: ${dark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.9)'};
    border: 1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)'};
    color: ${dark ? '#e8e8f0' : '#1a1a2e'}; font-family: 'DM Mono', monospace;
    font-size: 13px; outline: none; transition: border 0.2s;
  }
  .tryit-input:focus { border-color: rgba(16,185,129,0.5); }
  .tryit-input::placeholder { color: ${dark ? '#4b5563' : '#9ca3af'}; }
  .tryit-preview {
    background: ${dark ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.04)'};
    border: 1px dashed rgba(16,185,129,0.3);
    border-radius: 8px; padding: 12px 14px; margin-bottom: 12px;
  }
  .tryit-preview-label { font-family: 'DM Mono', monospace; font-size: 10px; color: #34d399; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
  .tryit-preview-text { font-family: 'DM Mono', monospace; font-size: 12px; color: ${dark ? '#9ca3af' : '#52525b'}; line-height: 1.7; white-space: pre-wrap; word-break: break-word; }
  .tryit-preview-text .blank-filled { color: #34d399; font-weight: 600; }
  .tryit-preview-text .blank-empty { color: #4b5563; font-style: italic; }
  .tryit-btn-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .tryit-send-btn {
    padding: 8px 18px; border-radius: 8px; border: none; cursor: pointer;
    background: linear-gradient(135deg, #059669, #10b981);
    color: #fff; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
    transition: all 0.2s;
  }
  .tryit-send-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(16,185,129,0.35); }
  .tryit-send-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .tryit-clear-btn {
    padding: 8px 14px; border-radius: 8px; border: 1px solid rgba(16,185,129,0.25);
    background: transparent; color: #6b7280; font-size: 12px; cursor: pointer;
    font-family: 'DM Mono', monospace; transition: all 0.15s;
  }
  .tryit-clear-btn:hover { border-color: rgba(16,185,129,0.4); color: #34d399; }
  .tryit-response {
    margin-top: 12px;
    background: ${dark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.03)'};
    border: 1px solid rgba(16,185,129,0.2);
    border-left: 3px solid #10b981;
    border-radius: 8px; padding: 12px 14px; animation: fadeIn 0.3s ease;
  }
  .tryit-response-label { font-family: 'DM Mono', monospace; font-size: 10px; color: #10b981; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
  .tryit-response-text { font-size: 13px; color: ${dark ? '#d1d5db' : '#374151'}; line-height: 1.7; white-space: pre-wrap; }
  /* ===== AUTH SCREENS ===== */
  .auth-overlay { position: fixed; inset: 0; background: ${dark ? '#0a0a0f' : '#f4f4f8'}; z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.3s ease; }
  .auth-box { width: 100%; max-width: 400px; }
  .auth-logo { text-align: center; margin-bottom: 28px; }
  .auth-logo-icon { font-size: 56px; margin-bottom: 10px; }
  .auth-logo-title { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; background: linear-gradient(135deg, #a5b4fc, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .auth-logo-sub { font-size: 13px; color: ${dark ? '#6b7280' : '#9ca3af'}; font-family: 'DM Mono', monospace; margin-top: 4px; }
  .auth-card { background: ${dark ? 'rgba(255,255,255,0.04)' : '#ffffff'}; border: 1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}; border-radius: 20px; padding: 28px 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
  .auth-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: ${dark ? '#e8e8f0' : '#111118'}; margin-bottom: 6px; }
  .auth-sub { font-size: 13px; color: ${dark ? '#6b7280' : '#9ca3af'}; margin-bottom: 22px; line-height: 1.6; }
  .auth-phone-row { display: flex; gap: 8px; margin-bottom: 14px; }
  .auth-country-code { padding: 12px 14px; border-radius: 10px; border: 1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}; background: ${dark ? 'rgba(0,0,0,0.3)' : '#f8f8fb'}; color: ${dark ? '#e8e8f0' : '#111118'}; font-family: 'DM Mono', monospace; font-size: 14px; font-weight: 700; width: 80px; text-align: center; }
  .auth-input { flex: 1; padding: 12px 14px; border-radius: 10px; border: 1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}; background: ${dark ? 'rgba(0,0,0,0.3)' : '#f8f8fb'}; color: ${dark ? '#e8e8f0' : '#111118'}; font-family: 'DM Mono', monospace; font-size: 15px; outline: none; transition: border 0.2s; width: 100%; }
  .auth-input:focus { border-color: rgba(99,102,241,0.5); }
  .auth-input::placeholder { color: ${dark ? '#4b5563' : '#9ca3af'}; }
  .auth-btn { width: 100%; padding: 13px; border-radius: 12px; border: none; cursor: pointer; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #fff; font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; transition: all 0.2s; box-shadow: 0 4px 20px rgba(79,70,229,0.35); margin-top: 6px; }
  .auth-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(79,70,229,0.45); }
  .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .auth-otp-grid { display: flex; gap: 8px; margin-bottom: 14px; justify-content: center; }
  .auth-otp-input { width: 46px; height: 54px; border-radius: 10px; border: 2px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}; background: ${dark ? 'rgba(0,0,0,0.3)' : '#f8f8fb'}; color: ${dark ? '#e8e8f0' : '#111118'}; font-family: 'Syne', monospace; font-size: 22px; font-weight: 800; text-align: center; outline: none; transition: border 0.2s; }
  .auth-otp-input:focus { border-color: #6366f1; }
  .auth-resend { text-align: center; font-size: 13px; color: ${dark ? '#6b7280' : '#9ca3af'}; margin-top: 14px; font-family: 'DM Mono', monospace; }
  .auth-resend button { background: none; border: none; color: #818cf8; cursor: pointer; font-family: 'DM Mono', monospace; font-size: 13px; text-decoration: underline; }
  .auth-skip { text-align: center; margin-top: 16px; font-size: 12px; color: ${dark ? '#4b5563' : '#9ca3af'}; font-family: 'DM Mono', monospace; }
  .auth-skip button { background: none; border: none; color: ${dark ? '#6b7280' : '#9ca3af'}; cursor: pointer; font-size: 12px; text-decoration: underline; font-family: 'DM Mono', monospace; }
  .auth-error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 8px; padding: 10px 12px; font-size: 13px; color: #f87171; margin-bottom: 12px; text-align: center; }
  .auth-success { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); border-radius: 8px; padding: 10px 12px; font-size: 13px; color: #4ade80; margin-bottom: 12px; text-align: center; }
  .user-chip { display: flex; align-items: center; gap: 8px; background: ${dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}; border: 1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}; border-radius: 20px; padding: 4px 12px 4px 6px; }
  .user-avatar { width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(135deg,#4f46e5,#7c3aed); display: flex; align-items: center; justify-content: center; font-size: 12px; color: #fff; font-weight: 800; font-family: 'Syne', sans-serif; }
  .user-phone { font-size: 11px; color: ${dark ? '#9ca3af' : '#6b7280'}; font-family: 'DM Mono', monospace; }
  .logout-btn { background: none; border: none; color: ${dark ? '#4b5563' : '#9ca3af'}; font-size: 10px; cursor: pointer; font-family: 'DM Mono', monospace; margin-left: 4px; }
  .logout-btn:hover { color: #ef4444; }

  /* ===== LEGAL PAGES ===== */
  .legal-wrapper { animation: fadeIn 0.3s ease; max-width: 760px; margin: 0 auto; }
  .legal-hero { background: linear-gradient(135deg,#1e293b,#0f172a); border-radius: 16px; padding: 24px 20px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.07); text-align: center; }
  .legal-hero-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 6px; }
  .legal-hero-sub { font-size: 12px; color: #6b7280; font-family: 'DM Mono', monospace; }
  .legal-tabs { display: flex; gap: 6px; margin-bottom: 22px; flex-wrap: wrap; }
  .legal-tab { padding: 7px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: #6b7280; font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
  .legal-tab:hover { border-color: rgba(99,102,241,0.4); color: #a5b4fc; }
  .legal-tab.active { background: linear-gradient(135deg,#4f46e5,#7c3aed); border-color: transparent; color: #fff; }
  .legal-doc { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 24px; animation: fadeIn 0.3s ease; }
  .legal-doc h1 { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #e8e8f0; margin-bottom: 6px; }
  .legal-doc .legal-date { font-family: 'DM Mono', monospace; font-size: 11px; color: #6b7280; margin-bottom: 20px; display: block; }
  .legal-doc h2 { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; color: #a5b4fc; margin: 20px 0 8px; }
  .legal-doc p { font-size: 13px; color: #9ca3af; line-height: 1.8; margin-bottom: 10px; }
  .legal-doc ul { padding-left: 18px; margin-bottom: 12px; }
  .legal-doc li { font-size: 13px; color: #9ca3af; line-height: 1.8; margin-bottom: 4px; }
  .legal-doc a { color: #818cf8; text-decoration: underline; }
  .legal-doc .highlight { background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.2); border-radius: 8px; padding: 12px 14px; margin: 12px 0; font-size: 13px; color: #a5b4fc; line-height: 1.7; }
  .legal-footer { text-align: center; margin-top: 16px; font-size: 11px; color: #4b5563; font-family: 'DM Mono', monospace; }

  /* ===== FREEMIUM ===== */
  .paywall-overlay { position: relative; }
  .paywall-blur { filter: blur(4px); pointer-events: none; user-select: none; opacity: 0.5; }
  .paywall-badge { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 10; text-align: center; background: ${dark ? 'rgba(10,10,15,0.95)' : 'rgba(255,255,255,0.97)'}; border: 2px solid rgba(99,102,241,0.4); border-radius: 16px; padding: 20px 24px; min-width: 240px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
  .paywall-lock { font-size: 32px; margin-bottom: 8px; }
  .paywall-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; color: ${dark ? '#e8e8f0' : '#111118'}; margin-bottom: 6px; }
  .paywall-price { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; background: linear-gradient(135deg,#4f46e5,#7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 14px; }
  .paywall-unlock-btn { width: 100%; padding: 10px; border-radius: 10px; border: none; cursor: pointer; background: linear-gradient(135deg,#4f46e5,#7c3aed); color: #fff; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 800; transition: all 0.2s; }
  .paywall-unlock-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(79,70,229,0.4); }

  /* UPGRADE MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease; }
  .modal-box { background: ${dark ? '#0f0f1a' : '#ffffff'}; border: 1px solid rgba(99,102,241,0.3); border-radius: 24px; padding: 28px 24px; max-width: 380px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.5); animation: fadeIn 0.3s ease; }
  .modal-close { float: right; background: none; border: none; color: ${dark ? '#6b7280' : '#9ca3af'}; font-size: 20px; cursor: pointer; line-height: 1; }
  .modal-emoji { font-size: 44px; text-align: center; margin-bottom: 12px; }
  .modal-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: ${dark ? '#e8e8f0' : '#111118'}; text-align: center; margin-bottom: 6px; }
  .modal-sub { font-size: 13px; color: ${dark ? '#9ca3af' : '#6b7280'}; text-align: center; line-height: 1.7; margin-bottom: 20px; }
  .modal-features { margin-bottom: 20px; }
  .modal-feature { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid ${dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}; font-size: 13px; color: ${dark ? '#d1d5db' : '#374151'}; }
  .modal-price-box { background: linear-gradient(135deg,rgba(79,70,229,0.1),rgba(124,58,237,0.1)); border: 1px solid rgba(99,102,241,0.3); border-radius: 14px; padding: 16px; text-align: center; margin-bottom: 16px; }
  .modal-price-main { font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 800; color: #a5b4fc; }
  .modal-price-sub { font-size: 12px; color: ${dark ? '#6b7280' : '#9ca3af'}; margin-top: 4px; font-family: 'DM Mono', monospace; }
  .modal-cta { width: 100%; padding: 13px; border-radius: 12px; border: none; cursor: pointer; background: linear-gradient(135deg,#4f46e5,#7c3aed); color: #fff; font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; transition: all 0.2s; box-shadow: 0 4px 20px rgba(79,70,229,0.4); }
  .modal-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(79,70,229,0.5); }

  /* PLAN CARDS */
  .plan-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
  .plan-tag { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg,#4f46e5,#7c3aed); color: #fff; font-size: 9px; font-family: 'Syne',sans-serif; font-weight: 800; padding: 2px 8px; border-radius: 10px; white-space: nowrap; }
  .plan-card { border-radius: 14px; padding: 14px 12px; border: 2px solid transparent; cursor: pointer; transition: all 0.2s; text-align: center; position: relative; }
  .plan-card:hover { transform: translateY(-2px); }
  .plan-card.selected { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.2); }
  .plan-badge { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg,#4f46e5,#7c3aed); color: #fff; font-size: 10px; font-family: 'Syne',sans-serif; font-weight: 800; padding: 2px 10px; border-radius: 10px; white-space: nowrap; }
  .plan-price { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; color: #a5b4fc; }
  .plan-name { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; margin-top: 4px; }
  .plan-desc { font-size: 10px; font-family: 'DM Mono', monospace; margin-top: 3px; }
  .razorpay-note { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 10px; font-size: 11px; font-family: 'DM Mono', monospace; }
  .modal-free-note { text-align: center; font-size: 12px; color: ${dark ? '#6b7280' : '#9ca3af'}; margin-top: 12px; font-family: 'DM Mono', monospace; }
  .pro-badge { display: inline-block; background: linear-gradient(135deg,#4f46e5,#7c3aed); color: #fff; font-family: 'Syne', sans-serif; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 6px; margin-left: 8px; letter-spacing: 0.5px; }
  .free-badge { display: inline-block; background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.3); font-family: 'Syne', sans-serif; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 6px; margin-left: 8px; }

  /* ===== CAREER GUIDANCE ===== */
  .career-hero { border-radius: 20px; padding: 26px 20px; text-align: center; margin-bottom: 22px; position: relative; overflow: hidden; }
  .career-hero-title { font-family: 'Syne', sans-serif; font-size: clamp(20px,4vw,30px); font-weight: 800; color: #fff; margin-bottom: 8px; }
  .career-hero-sub { font-size: 13px; color: rgba(255,255,255,0.85); line-height: 1.7; }
  .career-age-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 22px; }
  @media (max-width: 400px) { .career-age-grid { grid-template-columns: 1fr; } }
  .career-age-card { padding: 14px 8px; border-radius: 14px; text-align: center; cursor: pointer; transition: all 0.2s; border: 3px solid transparent; }
  .career-age-card:hover { transform: translateY(-3px); }
  .career-age-card.active { border-color: rgba(255,255,255,0.6); box-shadow: 0 6px 20px rgba(0,0,0,0.3); }
  .career-age-emoji { font-size: 28px; margin-bottom: 6px; }
  .career-age-label { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 800; color: #fff; }
  .career-age-desc { font-size: 10px; color: rgba(255,255,255,0.75); margin-top: 3px; font-family: 'DM Mono', monospace; }
  .career-intro { padding: 12px 16px; border-radius: 12px; margin-bottom: 20px; font-size: 13px; line-height: 1.7; font-weight: 600; border: 1px solid; }
  .career-category { margin-bottom: 24px; }
  .career-cat-header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; padding: 10px 14px; border-radius: 10px; }
  .career-cat-icon { font-size: 22px; }
  .career-cat-name { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; }
  .career-course-list { display: flex; flex-direction: column; gap: 10px; }
  .career-course-card { border-radius: 14px; overflow: hidden; border: 1px solid rgba(255,255,255,0.07); transition: all 0.2s; cursor: pointer; }
  .career-course-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.2); }
  .career-course-header { padding: 12px 16px; display: flex; align-items: center; gap: 10px; }
  .career-course-emoji { font-size: 22px; }
  .career-course-name { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 800; color: #fff; }
  .career-course-desc { font-size: 11px; color: rgba(255,255,255,0.75); margin-top: 3px; }
  .career-course-body { padding: 0 16px; overflow: hidden; transition: max-height 0.3s ease; }
  .career-course-body.open { padding: 14px 16px; }
  .career-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
  @media (max-width: 400px) { .career-detail-grid { grid-template-columns: 1fr; } }
  .career-detail-item { padding: 8px 10px; border-radius: 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); }
  .career-detail-label { font-family: 'DM Mono', monospace; font-size: 9px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
  .career-detail-val { font-size: 12px; font-weight: 700; line-height: 1.5; }
  .career-ai-btn { width: 100%; padding: 10px; border-radius: 10px; border: none; cursor: pointer; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800; color: #fff; margin-top: 4px; transition: all 0.2s; }
  .career-ai-btn:hover:not(:disabled) { transform: translateY(-1px); }
  .career-ai-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .career-ai-response { border-radius: 10px; padding: 12px 14px; margin-top: 10px; animation: fadeIn 0.3s ease; border-left: 4px solid; }
  .career-ai-label { font-family: 'DM Mono', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; font-weight: 700; }
  .career-ai-text { font-size: 13px; line-height: 1.7; white-space: pre-wrap; }

  /* ===== MISTAKES SECTION ===== */
  .mistakes-hero { background: linear-gradient(135deg,#1a0a0a,#2d1515); border-radius: 20px; padding: 24px 20px; text-align: center; margin-bottom: 22px; border: 1px solid rgba(239,68,68,0.2); }
  .mistakes-hero-title { font-family: 'Syne', sans-serif; font-size: clamp(20px,4vw,30px); font-weight: 800; color: #fff; margin-bottom: 8px; }
  .mistakes-hero-sub { font-size: 13px; color: #9ca3af; line-height: 1.7; }
  .mistake-card { border-radius: 16px; overflow: hidden; margin-bottom: 16px; animation: fadeIn 0.3s ease; }
  .mistake-card-header { padding: 14px 18px; display: flex; align-items: center; gap: 12px; }
  .mistake-icon { font-size: 28px; }
  .mistake-num { font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 2px; }
  .mistake-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; color: #fff; margin-top: 3px; }
  .mistake-category { display: inline-block; background: rgba(255,255,255,0.2); border-radius: 10px; padding: 2px 8px; font-size: 10px; color: rgba(255,255,255,0.8); font-family: 'DM Mono', monospace; margin-top: 4px; }
  .mistake-body { padding: 16px 18px; }
  .mistake-compare { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
  @media (max-width: 500px) { .mistake-compare { grid-template-columns: 1fr; } }
  .mistake-bad { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; padding: 12px 14px; }
  .mistake-good { background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2); border-radius: 10px; padding: 12px 14px; }
  .mistake-label { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .mistake-text { font-family: 'DM Mono', monospace; font-size: 12px; line-height: 1.65; white-space: pre-wrap; word-break: break-word; }
  .mistake-why { display: flex; gap: 8px; align-items: flex-start; padding: 10px 12px; border-radius: 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); }
  .mistake-why-text { font-size: 13px; line-height: 1.6; font-weight: 600; }
  .mistake-filter { display: flex; gap: 8px; margin-bottom: 18px; flex-wrap: wrap; }
  .mistake-filter-btn { padding: 6px 14px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); color: #9ca3af; font-size: 12px; cursor: pointer; font-family: 'Syne', sans-serif; font-weight: 700; transition: all 0.15s; }
  .mistake-filter-btn:hover { border-color: rgba(239,68,68,0.4); color: #f87171; }
  .mistake-filter-btn.active { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.4); color: #f87171; }


  /* ===== KIDS SECTION ===== */
  .kids-wrapper { animation: fadeIn 0.3s ease; }
  .kids-hero {
    background: linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #0891b2 100%);
    border-radius: 20px; padding: 28px 20px; text-align: center; margin-bottom: 22px;
    position: relative; overflow: hidden;
  }
  .kids-hero-emoji { font-size: 48px; margin-bottom: 10px; animation: bounce 1s infinite alternate; }
  @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-8px); } }
  .kids-hero-title { font-family: 'Syne', sans-serif; font-size: clamp(22px,5vw,34px); font-weight: 800; color: #fff; margin-bottom: 8px; text-shadow: 0 2px 10px rgba(0,0,0,0.2); }
  .kids-hero-sub { font-size: 14px; color: rgba(255,255,255,0.9); line-height: 1.7; }
  .kids-age-badge { display: inline-block; background: rgba(255,255,255,0.25); border: 2px solid rgba(255,255,255,0.5); color: #fff; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 13px; padding: 5px 16px; border-radius: 20px; margin-top: 12px; }
  .kids-topic-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px; margin-bottom: 22px; }
  .kids-topic-card { padding: 16px 10px; border-radius: 16px; text-align: center; cursor: pointer; transition: all 0.2s; border: 3px solid transparent; box-shadow: 0 4px 14px rgba(0,0,0,0.15); }
  .kids-topic-card:hover { transform: translateY(-4px) scale(1.03); }
  .kids-topic-card.active { border-color: rgba(255,255,255,0.6); box-shadow: 0 6px 20px rgba(0,0,0,0.25); }
  .kids-topic-icon { font-size: 30px; margin-bottom: 8px; }
  .kids-topic-name { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 800; color: #fff; }
  .kids-lesson-card { border-radius: 20px; overflow: hidden; margin-bottom: 16px; animation: fadeIn 0.3s ease; }
  .kids-lesson-header { padding: 16px 20px; }
  .kids-lesson-num { font-family: 'Syne', sans-serif; font-size: 10px; font-weight: 800; color: rgba(255,255,255,0.7); letter-spacing: 2px; text-transform: uppercase; }
  .kids-lesson-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #fff; margin-top: 4px; }
  .kids-lesson-body { padding: 18px 20px; background: ${dark ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.95)'}; }
  .kids-story { font-size: 14px; color: ${dark ? '#d1d5db' : '#374151'}; line-height: 1.9; margin-bottom: 16px; }
  .kids-prompt-box { background: ${dark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.04)'}; border-radius: 12px; padding: 14px 16px; margin-bottom: 14px; border-left: 4px solid; }
  .kids-prompt-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; font-family: 'Syne', sans-serif; }
  .kids-prompt-text { font-family: 'DM Mono', monospace; font-size: 13px; color: ${dark ? '#d1d5db' : '#374151'}; line-height: 1.7; white-space: pre-wrap; }
  .kids-fun-fact { border-radius: 12px; padding: 12px 14px; display: flex; gap: 10px; align-items: flex-start; margin-bottom: 12px; }
  .kids-fun-fact-text { font-size: 13px; line-height: 1.6; font-weight: 700; }
  .kids-try-btn { width: 100%; padding: 13px; border-radius: 14px; border: none; cursor: pointer; font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; color: #fff; transition: all 0.2s; }
  .kids-try-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.25); }
  .kids-try-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .kids-response { border-radius: 14px; padding: 16px; margin-top: 14px; animation: fadeIn 0.3s ease; }
  .kids-response-label { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; color: #fff; }
  .kids-response-text { font-size: 14px; line-height: 1.9; white-space: pre-wrap; color: ${dark ? '#f1f5f9' : '#1e293b'}; }
`;


// ========== REAL LIFE DATA ==========
const REAL_LIFE_CATS = [
  { id:"kitchen", icon:"🍳", name:"Rasoi & Khana", color:"#ea580c", bg:"linear-gradient(135deg,#ea580c,#f97316)" },
  { id:"shopping", icon:"🛒", name:"Shopping", color:"#0284c7", bg:"linear-gradient(135deg,#0284c7,#38bdf8)" },
  { id:"travel", icon:"✈️", name:"Travel", color:"#7c3aed", bg:"linear-gradient(135deg,#7c3aed,#a78bfa)" },
  { id:"health", icon:"💪", name:"Health & Fitness", color:"#16a34a", bg:"linear-gradient(135deg,#16a34a,#4ade80)" },
  { id:"money", icon:"💰", name:"Paisa & Budget", color:"#ca8a04", bg:"linear-gradient(135deg,#ca8a04,#fbbf24)" },
  { id:"home", icon:"🏠", name:"Ghar ka Kaam", color:"#be185d", bg:"linear-gradient(135deg,#be185d,#f472b6)" },
];

const REAL_LIFE_EXAMPLES = {
  kitchen: [
    { icon:"🍳", title:"Ingredients se Recipe Banwao", usecase:"Ghar mein jo bhi pada hai usi se kya banaayein?",
      prompt:"Mere ghar mein yeh ingredients hain:\n- Aloo, pyaaz, tamatar, dahi\n- Masale: haldi, jeera, dhaniya\n- Rice aur atta\n\nMujhe 3 quick recipes batao jo 30 min mein ban sake.\nHar recipe mein steps bhi batao.\nSimple Indian ghar ka khana.",
      tip:"Jo bhi available hai list karo — AI perfect recipe suggest karega!" },
    { icon:"🥗", title:"Diet Plan Banwao", usecase:"Weight loss ya healthy eating ke liye weekly plan",
      prompt:"Mujhe ek 7-day healthy meal plan chahiye:\n- Goal: Weight loss (5 kg in 2 months)\n- Budget: ₹150/day\n- Preference: Vegetarian, Indian food\n- Avoid: Bahut spicy, maida\n\nHar din: Breakfast + Lunch + Dinner + 1 snack\nSimple ghar ka khana.",
      tip:"Budget aur preference clearly batao — AI practical aur affordable plan deta hai!" },
  ],
  shopping: [
    { icon:"🛒", title:"Smart Shopping List", usecase:"Monthly grocery list jisme kuch bhi miss na ho",
      prompt:"Mere ghar mein 4 log hain (2 adults, 2 bacche).\nMujhe ek monthly grocery list chahiye:\n- Basic Indian kitchen staples\n- Healthy snacks for kids\n- Budget: ₹4000/month\n\nFormat: Category wise (Sabzi, Dal/Chawal, Dairy, etc.)\nQuantity bhi batao.",
      tip:"Family size aur budget batao — AI perfect quantity suggest karta hai!" },
    { icon:"📱", title:"Product Compare Karwao", usecase:"Kaunsa phone khareedein — confused ho?",
      prompt:"Mujhe ek smartphone lena hai:\nBudget: ₹15,000-18,000\nUse: Photos, YouTube, social media\nImportance: Battery > Camera > Performance\n\nTop 3 options compare karo:\n- Pros & Cons table\n- Best value for money kaun sa\n- Final recommendation",
      tip:"Use case clearly batao — AI tumhare liye BEST option choose karta hai!" },
  ],
  travel: [
    { icon:"🗺️", title:"Trip Plan Banwao", usecase:"Family ya friends ke saath trip — sab kuch plan ho jaye",
      prompt:"Mujhe ek 3-day trip plan chahiye:\nDestination: Manali\nGroup: 2 adults, 1 child (8 saal)\nBudget: ₹15,000 total\nMonth: December\n\nInclude karo:\n- Day-wise itinerary\n- Budget breakdown\n- Best budget stay\n- Kya carry karein",
      tip:"Budget + group + month sab batao — AI realistic plan deta hai!" },
    { icon:"🏨", title:"Stay Options Dhundho", usecase:"Best hotel/hostel jaldi dhundho",
      prompt:"Mujhe Goa trip ke liye stay chahiye:\n2 nights, January\n2 adults, Budget: ₹1500/night\nLocation: Baga beach ke paas\nRequirement: Clean, AC, safe\n\nTop 3 options + pros/cons + booking platform batao.",
      tip:"Exact requirements batao — AI time bachata hai research mein!" },
  ],
  health: [
    { icon:"🏃", title:"Home Workout Routine", usecase:"Ghar pe bina gym ke fit rehna",
      prompt:"Mujhe ghar pe workout routine chahiye:\n- Goal: Weight loss + strength\n- Time: 30 min/day\n- Equipment: Koi nahi (bodyweight only)\n- Level: Beginner\n- Age: 28\n\n7-day routine chahiye with sets, reps, warm-up, rest days.",
      tip:"Fitness level honest batao — beginner routine se injury nahi hogi!" },
    { icon:"😴", title:"Better Sleep Plan", usecase:"Neend nahi aati? Practical solution lo",
      prompt:"Problem: Raat 2-3 baje tak jaagta hoon, phone use karta rehta hoon.\nJob: Work from home, stress.\n\nMujhe chahiye:\n- 7-day sleep improvement plan\n- Evening routine\n- Phone addiction kaise kam karoon\nHindi mein, practical advice.",
      tip:"Apni exact situation batao — generic se zyada helpful response aata hai!" },
  ],
  money: [
    { icon:"💸", title:"Monthly Budget Banwao", usecase:"Salary ke baad kahan kitna kharcha karein",
      prompt:"Monthly salary: ₹25,000\nFixed: Rent ₹8000, EMI ₹3000, Phone ₹500\n\nHelp chahiye:\n1. Baaki paise kaise allocate karoon\n2. Savings kahan (FD/SIP/RD)\n3. Emergency fund kaise banaaon\nSimple Indian middle class ke liye practical advice.",
      tip:"Real numbers batao — AI actual budget plan banega, generic nahi!" },
    { icon:"📈", title:"Investment Basics", usecase:"Pehli baar invest karna chahte ho?",
      prompt:"Main pehli baar invest karna chahta hoon:\n- Age: 24, Monthly: ₹2,000 invest kar sakta hoon\n- Goal: 5 saal mein ₹80,000\n- Risk: Low (paise safe rehne chahiye)\n- Experience: Zero\n\nKahan invest karoon? Step-by-step guide do.\nNote: Sirf guidance chahiye, financial advice nahi.",
      tip:"Note: AI financial advisor nahi hai — final decision apna lo!" },
  ],
  home: [
    { icon:"🧹", title:"Cleaning Schedule", usecase:"Weekly routine jisme ghar organized rahe",
      prompt:"Ghar: 2BHK, main akela rehta hoon.\nTime: Weekdays 30 min, weekend 2 ghante.\n\nChahiye:\n- Weekly cleaning schedule\n- Har room ke priority tasks\n- Quick daily 5-min habits\n- Monthly deep clean checklist",
      tip:"Ghar ka size aur available time batao — AI realistic schedule banega!" },
    { icon:"🔧", title:"Home Repair Guide", usecase:"Chhoti repair khud karo — plumber ka wait nahi",
      prompt:"Problem: Bathroom ka nal thoda tapakta hai.\nMere paas: Screwdriver, pliers.\nMain beginner hoon.\n\n1. Kyun hota hai?\n2. Step-by-step fix kaise karoon?\n3. Kya khareedna padega?\n4. Kab plumber bulana zaroori hai?\nSimple Hindi mein.",
      tip:"Problem clearly describe karo — AI safe aur practical steps batata hai!" },
  ],
};



// ========== CAREER GUIDANCE DATA ==========
const CAREER_AGE_GROUPS = [
  { id: "8to10", label: "Class 8-10", emoji: "🌱", desc: "Career explore karna shuru karo", color: "#0891b2", bg: "linear-gradient(135deg,#0891b2,#06b6d4)" },
  { id: "11to12", label: "Class 11-12", emoji: "🎯", desc: "Stream aur course choose karo", color: "#7c3aed", bg: "linear-gradient(135deg,#7c3aed,#a855f7)" },
  { id: "aftergrad", label: "After Graduation", emoji: "🚀", desc: "Higher study ya career path", color: "#16a34a", bg: "linear-gradient(135deg,#16a34a,#4ade80)" },
];

const CAREER_DATA = {
  "8to10": {
    intro: "Abhi koi pressure nahi — sirf explore karo! India mein 50+ career paths hain. Apna interest pehchano.",
    categories: [
      {
        name: "Science & Technology", icon: "🔬", color: "#0891b2",
        courses: [
          { name: "Engineering (B.Tech)", emoji: "⚙️", desc: "Computers, Civil, Mechanical, Electronics — bahut branches!", eligibility: "PCM in Class 12 + JEE", duration: "4 saal", fees: "₹50K-15L/year", topColleges: "IITs, NITs, BITS Pilani", salary: "₹3L-50L+/year", scope: "Software, Construction, Manufacturing, Research" },
          { name: "Medical (MBBS)", emoji: "🩺", desc: "Doctor banna — logo ki jaan bachana", eligibility: "PCB in Class 12 + NEET", duration: "5.5 saal", fees: "₹10K-25L/year", topColleges: "AIIMS, CMC Vellore, JIPMER", salary: "₹5L-1Cr+/year", scope: "Hospitals, Clinics, Research, Government" },
          { name: "BSc (Science)", emoji: "🧪", desc: "Physics, Chemistry, Biology, Math — pure science", eligibility: "PCM/PCB in Class 12", duration: "3 saal", fees: "₹10K-3L/year", topColleges: "IISc, St. Stephens, Presidency", salary: "₹2.5L-10L/year", scope: "Research, Teaching, Government Labs" },
          { name: "Data Science / AI", emoji: "🤖", desc: "Future ka career — AI aur data se khelna!", eligibility: "PCM in Class 12", duration: "3-4 saal", fees: "₹1L-10L/year", topColleges: "IITs, IIIT Hyderabad, Manipal", salary: "₹5L-40L+/year", scope: "Tech companies, Startups, Finance, Healthcare" },
        ]
      },
      {
        name: "Arts & Humanities", icon: "🎭", color: "#be185d",
        courses: [
          { name: "BA (History/Pol Sci/Sociology)", emoji: "📜", desc: "Society, politics, history samajhna", eligibility: "Class 12 (any stream)", duration: "3 saal", fees: "₹5K-2L/year", topColleges: "DU, JNU, BHU, Jadavpur", salary: "₹2L-8L/year", scope: "Civil Services, Journalism, NGO, Teaching" },
          { name: "Journalism & Mass Comm", emoji: "📰", desc: "News, media, content — awaz uthao!", eligibility: "Class 12 (any stream)", duration: "3-4 saal", fees: "₹50K-5L/year", topColleges: "ACJ Chennai, IIMC Delhi, Symbiosis", salary: "₹2.5L-15L/year", scope: "TV, Digital Media, PR, Content Creation" },
          { name: "Psychology", emoji: "🧠", desc: "Human mind aur behavior samajhna", eligibility: "Class 12 (any stream)", duration: "3-5 saal", fees: "₹30K-4L/year", topColleges: "NIMHANS, DU, Christ Bangalore", salary: "₹3L-12L/year", scope: "Counseling, HR, Research, Mental Health" },
          { name: "Philosophy", emoji: "💭", desc: "Critical thinking, ethics, logic — deep sochna", eligibility: "Class 12 (any stream)", duration: "3 saal", fees: "₹5K-1L/year", topColleges: "DU, JNU, Calcutta University", salary: "₹2L-6L/year", scope: "Civil Services, Law, Teaching, Writing" },
        ]
      },
      {
        name: "Commerce & Business", icon: "💼", color: "#ea580c",
        courses: [
          { name: "CA (Chartered Accountancy)", emoji: "📊", desc: "Finance ka raja — sabse respected professional course", eligibility: "Class 12 (any stream) + CA Foundation", duration: "4-5 saal", fees: "₹30K-2L total", topColleges: "ICAI (India ka top body)", salary: "₹5L-50L+/year", scope: "Big 4 firms, Banks, Companies, Own practice" },
          { name: "BBA/MBA", emoji: "🏢", desc: "Business management aur leadership", eligibility: "Class 12 (any) for BBA; Graduation for MBA", duration: "3+2 saal", fees: "₹1L-25L/year", topColleges: "IIMs, FMS, XLRI, SP Jain", salary: "₹4L-50L+/year", scope: "Consulting, Banking, Startups, MNCs" },
          { name: "B.Com", emoji: "💰", desc: "Accounting, finance, taxation basics", eligibility: "Commerce in Class 12 (preferred)", duration: "3 saal", fees: "₹10K-2L/year", topColleges: "SRCC Delhi, Loyola Chennai, Christ", salary: "₹2.5L-8L/year", scope: "Banking, Accounting, Finance, Government" },
        ]
      },
      {
        name: "Creative & Design", icon: "🎨", color: "#d97706",
        courses: [
          { name: "Fine Arts / BFA", emoji: "🖌️", desc: "Painting, sculpture, visual arts", eligibility: "Class 12 (any) + portfolio", duration: "4 saal", fees: "₹20K-3L/year", topColleges: "NID, NIFT, Srishti, Sir JJ School", salary: "₹2L-15L+/year", scope: "Design studios, Art galleries, Teaching, Freelance" },
          { name: "Fashion Design", emoji: "👗", desc: "Clothes design karna aur fashion industry", eligibility: "Class 12 (any) + entrance test", duration: "4 saal", fees: "₹1L-8L/year", topColleges: "NIFT, Pearl Academy, Symbiosis", salary: "₹2.5L-20L+/year", scope: "Fashion houses, Export, Retail, Freelance" },
          { name: "Animation & VFX", emoji: "🎬", desc: "Movies, games, digital content banana", eligibility: "Class 12 (any)", duration: "3-4 saal", fees: "₹50K-5L/year", topColleges: "Arena Animation, Maya Academy, NID", salary: "₹3L-20L+/year", scope: "Bollywood, Gaming, OTT, Advertising" },
          { name: "Architecture", emoji: "🏛️", desc: "Buildings aur spaces design karna", eligibility: "PCM in Class 12 + NATA", duration: "5 saal", fees: "₹1L-8L/year", topColleges: "SPA Delhi, CEPT Ahmedabad, IIT Roorkee", salary: "₹3L-20L+/year", scope: "Architecture firms, Government, Urban planning" },
        ]
      },
      {
        name: "Sports & Physical", icon: "⚽", color: "#16a34a",
        courses: [
          { name: "Sports Science / BSc Sports", emoji: "🏃", desc: "Sports psychology, fitness, nutrition", eligibility: "Class 12 (any) + sports background", duration: "3-4 saal", fees: "₹30K-3L/year", topColleges: "LNIPE, NSNIS Patiala, Amity", salary: "₹2.5L-10L/year", scope: "Coaching, Sports management, Fitness industry" },
          { name: "Physical Education (BPEd)", emoji: "🏅", desc: "School mein PE teacher banana", eligibility: "Class 12 (any)", duration: "4 saal", fees: "₹20K-1.5L/year", topColleges: "Lakshmibai National University, SNIPES", salary: "₹2L-6L/year", scope: "Schools, Coaching centers, NCC, Government" },
        ]
      },
    ]
  },

  "11to12": {
    intro: "Stream select ho gayi? Ab specific courses explore karo. Yahan sabhi popular aur lesser-known options hain!",
    categories: [
      {
        name: "Science Stream ke baad", icon: "🔬", color: "#0891b2",
        courses: [
          { name: "Engineering (B.Tech/BE)", emoji: "⚙️", desc: "PCM wale students ka most popular choice", eligibility: "PCM + JEE Main/Advanced", duration: "4 saal", fees: "₹50K-20L/year", topColleges: "IITs, NITs, BITS, VIT", salary: "₹3.5L-50L+/year", scope: "IT, Core Engineering, Startups, Research" },
          { name: "MBBS / BDS / BAMS", emoji: "🩺", desc: "Doctor — Allopathy, Dentist ya Ayurvedic", eligibility: "PCB + NEET", duration: "5.5 / 5 / 5.5 saal", fees: "₹10K-30L/year", topColleges: "AIIMS, JIPMER, Armed Forces Medical", salary: "₹5L-1Cr+/year", scope: "Hospitals, Own clinic, Research, Government" },
          { name: "B.Pharm / Pharmacy", emoji: "💊", desc: "Medicines, drug research, pharmacology", eligibility: "PCB/PCM + entrance", duration: "4 saal", fees: "₹30K-3L/year", topColleges: "Jamia, Manipal, JSS", salary: "₹2.5L-10L/year", scope: "Pharma companies, Hospitals, Research, Own chemist" },
          { name: "BVSc (Veterinary)", emoji: "🐾", desc: "Janwaron ka doctor banana", eligibility: "PCB + state entrance", duration: "5.5 saal", fees: "₹20K-5L/year", topColleges: "IVRI Bareilly, TANUVAS, Bombay Vet", salary: "₹3L-12L/year", scope: "Government vet, Animal hospitals, Research, Dairy" },
          { name: "BSc Nursing", emoji: "🏥", desc: "Healthcare mein essential — bahut demand hai", eligibility: "PCB + NEET (some states)", duration: "4 saal", fees: "₹30K-3L/year", topColleges: "AIIMS Nursing, CMC Vellore", salary: "₹2.5L-8L/year", scope: "Hospitals, Abroad opportunities, ICU, Community health" },
          { name: "B.Sc Agriculture", emoji: "🌾", desc: "Modern farming, crop science, agri business", eligibility: "PCB/PCM + state entrance", duration: "4 saal", fees: "₹10K-2L/year", topColleges: "IARI Delhi, BHU Ag, PAU Ludhiana", salary: "₹2.5L-10L/year", scope: "Government, Agri companies, Own farm, Research" },
          { name: "Merchant Navy / Marine Eng", emoji: "🚢", desc: "Samundar pe ship chalao — highest paying!", eligibility: "PCM + IMU CET", duration: "4 saal", fees: "₹5L-15L total", topColleges: "T.S. Chanakya, IMU Chennai", salary: "₹6L-50L+/year", scope: "Shipping companies, Global travel included!" },
          { name: "Pilot Training (CPL)", emoji: "✈️", desc: "Airplane chalao — dream career!", eligibility: "PCM + Class 12 + Medical", duration: "1.5-3 saal", fees: "₹30L-80L total", topColleges: "Indira Gandhi RGIA, CAE India", salary: "₹8L-1Cr+/year", scope: "Airlines (Air India, IndiGo etc.)" },
        ]
      },
      {
        name: "Commerce Stream ke baad", icon: "💼", color: "#ea580c",
        courses: [
          { name: "CA (Chartered Accountancy)", emoji: "📊", desc: "India ka most respected finance career", eligibility: "Class 12 (any) + CA Foundation exam", duration: "4-5 saal", fees: "₹30K-2L total (ICAI)", topColleges: "ICAI — self-study based", salary: "₹6L-1Cr+/year", scope: "Big 4, Banks, MNCs, Own firm" },
          { name: "CS (Company Secretary)", emoji: "⚖️", desc: "Corporate law aur compliance expert", eligibility: "Class 12 (any) + CS Foundation", duration: "3-4 saal", fees: "₹20K-1L total", topColleges: "ICSI — self-study based", salary: "₹4L-25L+/year", scope: "Corporate houses, Law firms, MNCs" },
          { name: "CMA (Cost Accountant)", emoji: "💰", desc: "Cost management aur financial analysis", eligibility: "Class 12 (any) + CMA Foundation", duration: "3-4 saal", fees: "₹20K-1L total", topColleges: "ICMAI — self-study", salary: "₹4L-20L+/year", scope: "Manufacturing, Banks, Consulting" },
          { name: "BBA + MBA", emoji: "🏢", desc: "Business management — entrepreneur ka base", eligibility: "Class 12 (any)", duration: "3+2 saal", fees: "₹1L-25L/year", topColleges: "IIMs (MBA), NMIMS, Symbiosis", salary: "₹4L-50L+/year", scope: "Management, Consulting, Startups, Banking" },
          { name: "BA LLB / BBA LLB", emoji: "🏛️", desc: "Law — 5 saal integrated program", eligibility: "Class 12 (any) + CLAT", duration: "5 saal", fees: "₹50K-5L/year", topColleges: "NLUs (NLSIU, NLU Delhi), Symbiosis Law", salary: "₹4L-1Cr+/year", scope: "Corporate law, Courts, Government, LPO" },
          { name: "Hotel Management", emoji: "🏨", desc: "Hospitality industry — global opportunities", eligibility: "Class 12 (any) + NCHMCT JEE", duration: "3-4 saal", fees: "₹1L-8L/year", topColleges: "IHM Delhi, IHM Mumbai, Welcomgroup", salary: "₹2.5L-20L+/year", scope: "Hotels, Airlines, Cruise ships, Own restaurant" },
        ]
      },
      {
        name: "Arts Stream ke baad", icon: "🎭", color: "#be185d",
        courses: [
          { name: "UPSC / Civil Services", emoji: "🏛️", desc: "IAS, IPS, IFS — India ka sabse prestigious exam", eligibility: "Any Graduation + Age 21-32", duration: "Preparation 1-3 saal", fees: "₹5K-2L (coaching)", topColleges: "LBSNAA (IAS training), NPA (IPS)", salary: "₹56K-2.5L/month + perks", scope: "District Collector, SP, Ambassador — Nation serve karo" },
          { name: "Journalism & Media", emoji: "📺", desc: "TV, digital, print — awaz uthao", eligibility: "Class 12 (any) + entrance", duration: "3-4 saal", fees: "₹50K-5L/year", topColleges: "IIMC Delhi, ACJ Chennai, AJK MCRC", salary: "₹2.5L-20L+/year", scope: "News channels, OTT, Podcasting, YouTube" },
          { name: "Social Work (BSW/MSW)", emoji: "🤝", desc: "Samaj ki seva — NGO, community development", eligibility: "Class 12 (any)", duration: "3-2 saal", fees: "₹10K-2L/year", topColleges: "TISS Mumbai, Delhi School of Social Work", salary: "₹2L-8L/year", scope: "NGOs, Government, UN agencies, CSR" },
          { name: "Library Science", emoji: "📚", desc: "Knowledge management — underrated career!", eligibility: "Graduation", duration: "1-2 saal", fees: "₹5K-50K/year", topColleges: "BHU, DU, Jadavpur", salary: "₹2L-6L/year", scope: "Schools, Universities, Digital libraries, Archives" },
          { name: "Travel & Tourism", emoji: "🌍", desc: "India ka growing industry — guide, planner", eligibility: "Class 12 (any) + diploma/degree", duration: "3 saal", fees: "₹50K-3L/year", topColleges: "IITTM, Amity, Christ", salary: "₹2.5L-12L+/year", scope: "Travel agencies, Airlines, Government tourism, Blogs" },
        ]
      },
      {
        name: "Vocational & Skill-Based", icon: "🔧", color: "#16a34a",
        courses: [
          { name: "ITI (Industrial Training)", emoji: "🔨", desc: "Electrician, plumber, fitter — quick job!", eligibility: "Class 10/12", duration: "1-2 saal", fees: "₹5K-50K total", topColleges: "Government ITIs all over India", salary: "₹1.5L-6L/year", scope: "Government jobs, Private sector, Self-employment" },
          { name: "Polytechnic Diploma", emoji: "🛠️", desc: "Engineering ka short route — 3 saal mein job!", eligibility: "Class 10 + entrance", duration: "3 saal", fees: "₹10K-1L/year", topColleges: "Government Polytechnics, State institutes", salary: "₹2L-6L/year", scope: "Manufacturing, Government, Further B.Tech (lateral)" },
          { name: "Beauty & Wellness", emoji: "💄", desc: "Salon, spa, skincare — growing industry!", eligibility: "Class 10/12", duration: "6 months - 2 saal", fees: "₹20K-2L total", topColleges: "VLCC, Lakme Academy, Jawed Habib", salary: "₹1.5L-10L+/year", scope: "Own salon, Bollywood, International brands" },
          { name: "Culinary Arts / Cooking", emoji: "👨‍🍳", desc: "Chef banna — hotels, restaurants, own business", eligibility: "Class 10/12", duration: "1-3 saal", fees: "₹50K-5L/year", topColleges: "IHM, Culinary Academy of India, WGSHA", salary: "₹2.5L-25L+/year", scope: "5-star hotels, Own restaurant, Cloud kitchen, Abroad" },
        ]
      },
    ]
  },

  "aftergrad": {
    intro: "Graduation ho gayi? Ab decide karo — higher study, professional course, ya seedha career!",
    categories: [
      {
        name: "Competitive Exams", icon: "🏆", color: "#ea580c",
        courses: [
          { name: "UPSC Civil Services (IAS/IPS)", emoji: "🏛️", desc: "India ka sabse prestigious — district collector bano", eligibility: "Any graduation, Age 21-32", duration: "1-3 saal preparation", fees: "₹5K-3L (coaching optional)", topColleges: "LBSNAA Mussoorie (IAS training)", salary: "₹56K-2.5L/month + bungalow, car, staff", scope: "IAS, IPS, IFS, IRS — all central services" },
          { name: "State PCS (SDM/DSP)", emoji: "🎖️", desc: "State level officer — SDM, DSP, BDO", eligibility: "Any graduation + State exam", duration: "1-2 saal preparation", fees: "₹20K-1.5L", topColleges: "State training academies", salary: "₹40K-1.5L/month + perks", scope: "Revenue, Police, Development departments" },
          { name: "Banking (IBPS/SBI PO)", emoji: "🏦", desc: "Bank PO ya Clerk — stable aur reputed", eligibility: "Any graduation + IBPS exam", duration: "6 months preparation", fees: "₹5K-50K", topColleges: "All PSU Banks", salary: "₹3L-8L/year", scope: "SBI, PNB, BOB, Canara — sab PSU banks" },
          { name: "SSC CGL / CHSL", emoji: "📋", desc: "Central government job — income tax, CBI, etc.", eligibility: "Graduation + SSC exam", duration: "6-12 months prep", fees: "₹5K-30K", topColleges: "Income Tax, CBI, MEA offices", salary: "₹2.5L-7L/year", scope: "Income Tax Inspector, Sub-Inspector, Customs" },
          { name: "Defence (NDA/CDS/AFCAT)", emoji: "🎯", desc: "Army, Navy, Air Force — desh ki sewa", eligibility: "Class 12/Graduation + physical", duration: "Training 1-1.5 saal", fees: "Free (government trains)", topColleges: "IMA Dehradun, NDA Pune, OTA Chennai", salary: "₹5.6L-18L+/year", scope: "Army Officer, Naval Officer, IAF Pilot" },
        ]
      },
      {
        name: "Higher Education", icon: "🎓", color: "#7c3aed",
        courses: [
          { name: "MBA (IIM/Top B-Schools)", emoji: "💼", desc: "Business ka crown — highest ROI degree", eligibility: "Graduation + CAT/GMAT", duration: "2 saal", fees: "₹3L-25L total", topColleges: "IIM A/B/C, FMS, XLRI, MDI", salary: "₹8L-1Cr+/year (placement)", scope: "Consulting, Banking, Startups, Corporate" },
          { name: "M.Tech / MS", emoji: "⚙️", desc: "Engineering mein masters — research ya senior roles", eligibility: "B.Tech + GATE", duration: "2 saal", fees: "₹20K-5L/year", topColleges: "IITs, NITs, IISC", salary: "₹5L-30L+/year", scope: "R&D, Senior Engineering, Teaching, DRDO/ISRO" },
          { name: "LLM (Law Masters)", emoji: "⚖️", desc: "Law mein specialization — corporate ya international", eligibility: "LLB + entrance", duration: "1-2 saal", fees: "₹50K-5L/year", topColleges: "NLUs, DU Law, Symbiosis Law", salary: "₹6L-50L+/year", scope: "High court, Corporate law, International orgs" },
          { name: "PhD / Research", emoji: "🔬", desc: "Professor ya researcher banna — knowledge create karo", eligibility: "Masters + NET/JRF", duration: "3-5 saal", fees: "₹10K-2L/year (often with stipend)", topColleges: "IISc, IITs, JNU, TIFR", salary: "₹31K-50K (JRF) then ₹5L-15L+", scope: "Universities, Research labs, DRDO, ISRO, Industry R&D" },
          { name: "Study Abroad (MS/MBA)", emoji: "🌍", desc: "USA, UK, Canada, Germany mein higher study", eligibility: "Graduation + GRE/GMAT/IELTS", duration: "1-2 saal", fees: "₹20L-80L total", topColleges: "MIT, Stanford, Oxford, TU Munich", salary: "₹15L-2Cr+ (abroad)", scope: "Global tech companies, Research, Return to India" },
        ]
      },
      {
        name: "Professional Certifications", icon: "📜", color: "#16a34a",
        courses: [
          { name: "CFA (Finance)", emoji: "📈", desc: "Investment banking aur finance ka global standard", eligibility: "Graduation + self-study", duration: "2-4 saal (3 levels)", fees: "₹1.5L-3L total", topColleges: "CFA Institute (global)", salary: "₹6L-40L+/year", scope: "Investment banks, Hedge funds, Asset management" },
          { name: "FRM (Risk Management)", emoji: "⚠️", desc: "Financial risk management — banking sector demand", eligibility: "Graduation", duration: "1-2 saal", fees: "₹80K-1.5L", topColleges: "GARP (global certification)", salary: "₹5L-25L+/year", scope: "Banks, Insurance, Risk consulting firms" },
          { name: "Digital Marketing", emoji: "📱", desc: "SEO, Social media, Ads — highest demand skill", eligibility: "Any graduation", duration: "3-6 months", fees: "₹15K-2L", topColleges: "Google, HubSpot (free certs), NIIT", salary: "₹2.5L-15L+/year", scope: "Every company, Agencies, Freelance, Own business" },
          { name: "Data Science / ML", emoji: "🤖", desc: "AI era ka sabse sought-after skill", eligibility: "Any graduation (preferably math background)", duration: "6 months - 1 saal", fees: "₹50K-3L", topColleges: "IIT online, Coursera, UpGrad", salary: "₹5L-40L+/year", scope: "Tech companies, Finance, Healthcare, Every industry" },
          { name: "Product Management", emoji: "🎯", desc: "Tech products build karna — CEO ka training ground", eligibility: "Any graduation + experience helpful", duration: "3-6 months", fees: "₹50K-2L", topColleges: "IIM online, Product School, UpGrad", salary: "₹8L-50L+/year", scope: "Tech startups, Google, Amazon, Flipkart" },
        ]
      },
      {
        name: "Entrepreneurship Path", icon: "🚀", color: "#ca8a04",
        courses: [
          { name: "Startup Ecosystem", emoji: "💡", desc: "Khud ka business shuru karo", eligibility: "Koi bhi — bus idea aur himmat chahiye!", duration: "Ongoing", fees: "Variable", topColleges: "IIT incubators, NSRCEL, T-Hub Hyderabad", salary: "₹0 se ₹Unlimited", scope: "Tech startups, Social enterprise, D2C brands" },
          { name: "Freelancing / Consulting", emoji: "💻", desc: "Skill se paisa kamao — koi boss nahi!", eligibility: "Any relevant skill", duration: "Start immediately", fees: "₹0-50K (tools)", topColleges: "Upwork, Fiverr, LinkedIn", salary: "₹2L-50L+/year", scope: "Design, Writing, Coding, Marketing, Finance" },
          { name: "Content Creator / YouTuber", emoji: "🎥", desc: "India ka growing creator economy", eligibility: "Koi bhi — passion chahiye", duration: "6-18 months to build", fees: "₹10K-1L (equipment)", topColleges: "YouTube Academy, Meta Blueprint", salary: "₹2L-5Cr+/year (top creators)", scope: "YouTube, Instagram, Podcast, Course selling" },
        ]
      },
    ]
  },
};
// ========== PROMPT MISTAKES DATA ==========
const MISTAKES = [
  {
    id: 1,
    icon: "😱",
    title: "Too Vague — Kuch Bhi Mat Bolo",
    category: "Beginner Mistake",
    bad: "Mujhe business ke baare mein batao.",
    good: "Tu ek MBA consultant hai. Mujhe ek D2C skincare brand ke liye India mein go-to-market strategy batao. Target: Urban women 22-35. Budget: ₹5 lakh. Timeline: 6 months.",
    why: "AI ko direction chahiye. 'Business' ek ocean hai — AI nahi jaanta tum kahan jaana chahte ho!",
    color: "#ef4444", bg: "linear-gradient(135deg,#ef4444,#f97316)"
  },
  {
    id: 2,
    icon: "🙅",
    title: "No Role = Generic Answer",
    category: "Beginner Mistake",
    bad: "Marketing strategy do.",
    good: "Tu ek senior digital marketing expert hai jo Indian D2C brands ke saath kaam karta hai. Mujhe Instagram pe organic growth strategy do.",
    why: "Role assign karne se AI ka perspective aur expertise level change ho jaata hai. Same question, alag results!",
    color: "#f59e0b", bg: "linear-gradient(135deg,#f59e0b,#fbbf24)"
  },
  {
    id: 3,
    icon: "📏",
    title: "No Format Specified",
    category: "Beginner Mistake",
    bad: "Python mein web scraper banao.",
    good: "Python mein web scraper banao:\n- BeautifulSoup use karo\n- Comments English mein\n- Error handling include karo\n- Beginner-friendly code\n- Output: CSV file mein save karo",
    why: "Bina format ke AI apni marzi se likhta hai — kabhi essay, kabhi code, kabhi bullet points. Specify karo!",
    color: "#8b5cf6", bg: "linear-gradient(135deg,#8b5cf6,#6366f1)"
  },
  {
    id: 4,
    icon: "🔄",
    title: "Ek Hi Shot Mein Sab Maangna",
    category: "Intermediate Mistake",
    bad: "Mujhe ek complete app banado — login, dashboard, payment, notifications, aur analytics bhi.",
    good: "Pehle: Login screen ka wireframe describe karo.\nPhir: Ek cheez complete hone ke baad agli maangna.",
    why: "AI ek baar mein bahut zyada handle nahi kar sakta accurately. Break it down — ek kaam, ek prompt!",
    color: "#0891b2", bg: "linear-gradient(135deg,#0891b2,#06b6d4)"
  },
  {
    id: 5,
    icon: "🎭",
    title: "Context Switch Karte Rehna",
    category: "Intermediate Mistake",
    bad: "Recipe batao. (phir agla message) Ab mujhe Python code chahiye. (phir) Acha woh recipe mein kya tha?",
    good: "Ek topic pe focus karo. Naya topic = naya conversation shuru karo.",
    why: "AI ka conversation history limited hota hai. Context switch karne se AI confuse ho jaata hai aur quality girti hai.",
    color: "#16a34a", bg: "linear-gradient(135deg,#16a34a,#4ade80)"
  },
  {
    id: 6,
    icon: "✅",
    title: "Negative Instructions Use Karna",
    category: "Intermediate Mistake",
    bad: "Koi bullet points mat use karo, koi tables mat banana, boring mat likhna.",
    good: "Response likhna: Conversational paragraph style mein, engaging aur story-driven, professional tone.",
    why: "AI ko batao KYA KARNA HAI — nahi ki kya nahi karna. Negative instructions confuse karte hain!",
    color: "#be185d", bg: "linear-gradient(135deg,#be185d,#ec4899)"
  },
  {
    id: 7,
    icon: "🔍",
    title: "Output Verify Nahi Karna",
    category: "Advanced Mistake",
    bad: "AI ne jo bola — seedha copy-paste kar diya without checking.",
    good: "AI ka output starting point hai — final answer nahi. Numbers, facts, aur code hamesha verify karo.",
    why: "AI hallucinate kar sakta hai — confidently galat facts de sakta hai. Critical decisions ke liye always double-check!",
    color: "#dc2626", bg: "linear-gradient(135deg,#dc2626,#991b1b)"
  },
  {
    id: 8,
    icon: "🧪",
    title: "Ek Prompt Se Give Up Karna",
    category: "Advanced Mistake",
    bad: "AI ne pehli baar sahi jawab nahi diya — AI kaam ka nahi!",
    good: "Prompt refine karo: Role add karo, format change karo, more context do, ya 'isko aur better banao' kaho.",
    why: "Prompt engineering iterative hai. Best output pehli baar nahi, 3rd-4th iteration mein milta hai!",
    color: "#7c3aed", bg: "linear-gradient(135deg,#7c3aed,#a855f7)"
  },
];

// ========== KIDS DATA ==========
const KIDS_TOPICS = [
  { id:"homework", icon:"📚", name:"Homework Help", color:"#7c3aed", bg:"linear-gradient(135deg,#7c3aed,#a855f7)" },
  { id:"story", icon:"🐉", name:"Kahaniya!", color:"#dc2626", bg:"linear-gradient(135deg,#dc2626,#f97316)" },
  { id:"games", icon:"🎮", name:"Games & Fun", color:"#0891b2", bg:"linear-gradient(135deg,#0891b2,#06b6d4)" },
  { id:"science", icon:"🔬", name:"Science Magic", color:"#059669", bg:"linear-gradient(135deg,#059669,#10b981)" },
  { id:"art", icon:"🎨", name:"Drawing & Art", color:"#d97706", bg:"linear-gradient(135deg,#d97706,#fbbf24)" },
  { id:"animals", icon:"🐾", name:"Janwar Duniya", color:"#be185d", bg:"linear-gradient(135deg,#be185d,#ec4899)" },
];

const KIDS_LESSONS = {
  homework: [
    { num:"Lesson 1", title:"AI se Homework Help lo!", color:"#7c3aed", bg:"linear-gradient(135deg,#7c3aed,#a855f7)", story:"Socho tumhara teacher ne kaha — 'Kal Mughal Empire pe essay lao!' Tum ghabra gaye. Par AI tumhara dost hai! Usse sahi tarike se poocho — toh woh turant help karega. 😊", prompt:`Tu mera school teacher hai.
Mujhe Mughal Empire ke baare mein batao:
- Sirf 5 points mein
- Class 5 ke bacche ko samajhne wali language mein
- Hindi mein
- Real examples ke saath`, label:"Yeh prompt try karo! 📋", labelColor:"#a855f7", funFact:"💡 Ek Secret: Jab tum AI ko batate ho 'Class 5 ka baccha hoon' — woh bilkul tumhare level ki language use karta hai!", funBg:"rgba(124,58,237,0.1)", funColor:"#7c3aed", btnBg:"linear-gradient(135deg,#7c3aed,#a855f7)", responseBg:"rgba(124,58,237,0.1)" },
    { num:"Lesson 2", title:"Math ki Problems Solve karo!", color:"#7c3aed", bg:"linear-gradient(135deg,#6d28d9,#8b5cf6)", story:"Math mushkil lagti hai? Koi baat nahi! AI tumhara personal math teacher hai — jo kabhi bhi available hai, kabhi gussa nahi karta, aur jab tak chahiye samjhata rehta hai! 🧮", prompt:`Mujhe yeh math problem samjhao:
12 × 15 = ?

Step by step batao jaise main Class 4 ka student hoon.
Example bhi do — jaise 12 rows mein 15 chairs hain.
Hindi mein batao.`, label:"Magic Math Prompt! 🔢", labelColor:"#8b5cf6", funFact:"🎯 Pro Tip: 'Step by step batao' likhne se AI har cheez slowly explain karta hai — koi confusion nahi!", funBg:"rgba(109,40,217,0.1)", funColor:"#6d28d9", btnBg:"linear-gradient(135deg,#6d28d9,#8b5cf6)", responseBg:"rgba(109,40,217,0.1)" },
  ],
  story: [
    { num:"Lesson 1", title:"Apni Kahani Khud Banao!", color:"#dc2626", bg:"linear-gradient(135deg,#dc2626,#f97316)", story:"Kya tum chahte ho ki ek aise hero ki story ho jisme TUMA ho? Ya ek aisa dragon jo aag nahi — ice cream ugalta hai? AI ke saath koi bhi kahaani possible hai! 🐉🍦", prompt:`Mujhe ek funny story sunao:
- Hero ka naam: Arjun (8 saal ka ladka)
- Special power: Haath hilane se khana ban jaata hai  
- Villain: Ek boring homework monster
- Ending: Happy aur funny ho
- Language: Hindi
- Length: 10 lines`, label:"Story Banana ka Jadoo! ✨", labelColor:"#f97316", funFact:"🌟 Fun Fact: AI se story mein apna naam, apne dost ka naam, apna school — sab daal sakte ho! Bilkul apni personal story!",funBg:"rgba(220,38,38,0.1)", funColor:"#dc2626", btnBg:"linear-gradient(135deg,#dc2626,#f97316)", responseBg:"rgba(220,38,38,0.1)" },
    { num:"Lesson 2", title:"Kahani mein Twist Laao!", color:"#dc2626", bg:"linear-gradient(135deg,#b91c1c,#ef4444)", story:"Boring stories mein TWIST laao! Cinderella ke paas glass slipper nahi — rocket ship thi! Snow White ke saath 7 dwarfs nahi — 7 robots the! AI ke saath sab possible hai 🚀", prompt:`Ek purani kahani ko naye tarike se batao:
Original story: Cinderella
Twist: Cinderella ek scientist hai
Setting: 2050 mein future India mein
Villain: Ek AI robot jo ghar ka kaam nahi karne deta
Hero: Cinderella khud apni problem solve karti hai
Language: Hindi, funny style mein`, label:"Twist Wali Story! 🌀", labelColor:"#ef4444", funFact:"🎭 Yaad rakho: Jitni zyada details doge — utni mast story milegi! Characters, setting, twist — sab batao!", funBg:"rgba(185,28,28,0.1)", funColor:"#b91c1c", btnBg:"linear-gradient(135deg,#b91c1c,#ef4444)", responseBg:"rgba(185,28,28,0.08)" },
  ],
  games: [
    { num:"Lesson 1", title:"AI ke saath Games Khelo!", color:"#0891b2", bg:"linear-gradient(135deg,#0891b2,#06b6d4)", story:"Kya tum jaante ho AI tumhare saath riddles, puzzles, aur trivia bhi khel sakta hai? Aur woh ek baar bhi nahi kehta 'Ab bas karo!' 😄🎮", prompt:`Mujhe 5 mast riddles batao:
- Mere liye (10 saal ka bachcha)
- Hindi mein
- Answers bhi do lekin END mein
- Easy se medium difficulty
- Ek hint bhi dena har riddle ke saath`, label:"Riddle Time! 🧩", labelColor:"#06b6d4", funFact:"🎮 Game Idea: Apne dosto ke saath AI se riddles lao aur ek doosre ko poocho — jo jaldi answer kare woh jeet gaya!", funBg:"rgba(8,145,178,0.1)", funColor:"#0891b2", btnBg:"linear-gradient(135deg,#0891b2,#06b6d4)", responseBg:"rgba(8,145,178,0.1)" },
  ],
  science: [
    { num:"Lesson 1", title:"Science ke Jaadui Sawaal!", color:"#059669", bg:"linear-gradient(135deg,#059669,#10b981)", story:"'Aasman neela kyun hota hai?' 'Bijli kaise chamakti hai?' 'Dinosaur kaise mare?' Yeh sawaal tum AI se kabhi bhi pooch sakte ho — aur woh ekdum simple Hindi mein samjhayega! ⚡🌈", prompt:`Mujhe batao: Bijli (lightning) kyun chamakti hai?
- Main 9 saal ka hoon, simple language use karo
- Ek funny example do
- Ek cool experiment bhi batao jo ghar pe kar sakun
- Hindi mein, 6-7 lines mein`, label:"Science Magic Prompt! ⚡", labelColor:"#10b981", funFact:"🔬 Did You Know: AI se tum koi bhi science ka sawaal pooch sakte ho — chahe din ke 3 baje raat ko bhi! Woh kabhi nahi soyega!", funBg:"rgba(5,150,105,0.1)", funColor:"#059669", btnBg:"linear-gradient(135deg,#059669,#10b981)", responseBg:"rgba(5,150,105,0.1)" },
  ],
  art: [
    { num:"Lesson 1", title:"Drawing aur Art ke Ideas!", color:"#d97706", bg:"linear-gradient(135deg,#d97706,#fbbf24)", story:"Kya draw karoon yeh samajh nahi aata? AI tumhara art teacher bhi ban sakta hai! Drawing ideas, colors kaise mix karein, aur step-by-step instructions — sab milega! 🎨", prompt:`Mujhe ek drawing idea do:
- Main ek beginner hoon (10 saal)
- Topic: Mera future dream house
- Step by step batao kaise banaaon
- Kaunse colors use karoon yeh bhi batao
- Hindi mein, easy language mein`, label:"Art Ideas Prompt! 🖌️", labelColor:"#fbbf24", funFact:"🎨 Cool Idea: AI se drawing ke steps seekho, phir apni drawing photo khicho aur AI ko dikhao — woh feedback bhi dega!", funBg:"rgba(217,119,6,0.1)", funColor:"#d97706", btnBg:"linear-gradient(135deg,#d97706,#fbbf24)", responseBg:"rgba(217,119,6,0.1)" },
  ],
  animals: [
    { num:"Lesson 1", title:"Janwaron ki Duniya!", color:"#be185d", bg:"linear-gradient(135deg,#be185d,#ec4899)", story:"Kya tum jaante ho ek octopus ke 3 dil hote hain? Ya ki cows ke sabse kareeb dost elephants hain? AI ke saath janwaron ke baare mein amazing baatein seekho! 🐙❤️", prompt:`Mujhe mere favorite animal ke baare mein batao:
Animal: Dolphin 🐬
Mujhe chahiye:
- 5 amazing facts jo main nahi jaanta
- Yeh kitna smart hai (example ke saath)
- Kya main isse pet rakh sakta hoon?
- Ek funny fact
Hindi mein, Class 4-5 level language`, label:"Animal Facts Prompt! 🐾", labelColor:"#ec4899", funFact:"🐾 Fun Idea: Apne favorite animal ka naam daal do is prompt mein — aur AI tumhe wo sab batayega jo tum janna chahte ho!", funBg:"rgba(190,24,93,0.1)", funColor:"#be185d", btnBg:"linear-gradient(135deg,#be185d,#ec4899)", responseBg:"rgba(190,24,93,0.1)" },
  ],
};


const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const PROFESSIONS = [
  { id: "student", icon: "🎓", name: "Student" },
  { id: "editor", icon: "✍️", name: "Editor" },
  { id: "coder", icon: "💻", name: "Coder" },
  { id: "doctor", icon: "🩺", name: "Doctor" },
  { id: "marketer", icon: "📣", name: "Marketer" },
  { id: "lawyer", icon: "⚖️", name: "Lawyer" },
  { id: "teacher", icon: "📚", name: "Teacher" },
  { id: "designer", icon: "🎨", name: "Designer" },
  { id: "farmer", icon: "🌾", name: "Farmer" },
  { id: "chef", icon: "👨‍🍳", name: "Chef" },
  { id: "entrepreneur", icon: "🚀", name: "Entrepreneur" },
  { id: "journalist", icon: "📰", name: "Journalist" },
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    scenario: "Tum ek student ho. Tum chahte ho ki AI tumhe 'Climate Change' topic pe ek essay likh ke de — 400 words mein, formal tone, English mein, intro/body/conclusion format mein.",
    hint: "Hint: Role, format, length, tone, structure sab specify karo.",
    ideal: "Role, word count, tone, format, aur language clearly batao."
  },
  {
    id: 2,
    scenario: "Tum ek coder ho. Tumhara Python code mein ek bug hai — ek function hai jo do numbers add karta hai par SyntaxError de raha hai. Tum AI se fix karwana chahte ho aur explain bhi chahte ho.",
    hint: "Hint: Code paste karo (ya describe karo), error batao, explanation maango.",
    ideal: "Code + error type + 'explain karo kyun' — teen cheez zaroori hain."
  },
  {
    id: 3,
    scenario: "Tum ek doctor ho. Tumhe ek 60 saal ke Hindi-speaking patient ko Diabetes Type 2 ke baare mein simple bhasha mein samjhana hai — scary nahi, practical tips ke saath.",
    hint: "Hint: Patient ka age, language, health literacy, tone, aur length specify karo.",
    ideal: "Audience details + tone + practical output format clearly mention karo."
  },
  {
    id: 4,
    scenario: "Tum ek marketer ho. Tumhe Instagram ke liye ek handmade jewellery brand ki 5 ad copies chahiye — target audience: urban women 22-35, premium feel, CTA: website visit.",
    hint: "Hint: Platform, audience, goal, tone, aur kitni copies — sab do.",
    ideal: "Platform + audience + goal + tone + number of variations = perfect ad prompt."
  },
  {
    id: 5,
    scenario: "Tum ek teacher ho. Tumhe Class 6 ke liye 45-minute Science lesson plan chahiye — topic Photosynthesis, warm-up + activity + assessment sab include ho.",
    hint: "Hint: Grade, duration, topic, aur required sections clearly mention karo.",
    ideal: "Grade + duration + topic + section breakdown = structured lesson plan."
  }
];

const CURRICULUM = {
  student: {
    icon: "🎓", label: "Student", desc: "Assignments, research & learning",
    beginner: [
      { num: "Lesson 01", title: "AI se baat karo — sahi tarike se", desc: "AI ek bahut smart assistant hai, lekin use clearly bolo. Jo tum teacher ko bolte ho wahi AI ko bhi bolna hoga — context ke saath.", prompt: `Mujhe class 10 ke liye photosynthesis explain karo.\nSimple Hindi mein, 5 points mein, examples ke saath.`, tip: "Always bolo: KISKE LIYE (class level), KAISE (points/story), KAUNSI LANGUAGE" },
      { num: "Lesson 02", title: "Role assign karo AI ko", desc: "AI ko ek role do — jaise 'Tu mera science teacher hai'. Isse AI ka jawab zyada focused aata hai.", prompt: `Tu mera Class 12 Physics teacher hai.\nNewton ke 3 laws ko ek cricket match ke example se samjha.\nEasy language mein, 200 words mein.`, tip: "Role + Topic + Format = Perfect Output" },
      { num: "Lesson 03", title: "Essay banana", desc: "Sirf topic mat dena. Bolo ki kitne words, kaunsa format chahiye.", prompt: `Mere liye ek essay likho:\nTopic: "Social Media ke Fayde aur Nuksaan"\nWords: 400\nFormat: Introduction → 3 Body Paragraphs → Conclusion\nTone: Formal\nLanguage: English`, tip: "Format specify karne se AI ek ready-to-submit essay deta hai." }
    ],
    intermediate: [
      { num: "Lesson 04", title: "Research Assistant banana", desc: "Ek topic pe deep research ke liye structured prompt use karo.", prompt: `Topic: "Climate Change ka India pe Impact"\nMujhe chahiye:\n1. Top 5 statistics\n2. 3 positive aur 3 negative impacts\n3. India government ke 2 initiatives\n4. Ek counter-argument bhi do\nFormat: Bullet points`, tip: "Research ke liye numbered list format poochho." },
      { num: "Lesson 05", title: "Study Plan banana", desc: "Exams ke liye personalized study schedule banwao.", prompt: `Mera exam 20 din baad hai.\nSubject: Class 12 Economics\nDaily: 2 ghante\nWeak: National Income, Money & Banking\nStrong: Development, Trade\n\n20-day study plan do:\n- Daily schedule\n- Revision days\n- Last 3 din mock tests`, tip: "Apni weakness aur strength batao." }
    ],
    advanced: [
      { num: "Lesson 06", title: "Chain-of-Thought Prompting", desc: "Complex problems mein AI se step-by-step sochne ko kaho.", prompt: `Problem: "Startup idea validate karni hai"\n\nStep 1 → Idea summary\nStep 2 → Target market\nStep 3 → 3 competitors\nStep 4 → USP\nStep 5 → Risk factors\nStep 6 → Final recommendation\n\nHar step pe ruko aur clearly socho.`, tip: "\"Step by step socho\" likhne se AI ka logic 40% better hota hai." }
    ]
  },
  coder: {
    icon: "💻", label: "Coder", desc: "Code generation, debugging & architecture",
    beginner: [
      { num: "Lesson 01", title: "Code likhwana — basic rules", desc: "Sirf 'Python code likho' mat bolo. Language + purpose + constraints batao.", prompt: `Python mein ek function likho jo:\n- Input: User ka naam (string)\n- Output: "Hello [naam], aapka swagat hai!"\n- Comments Hindi mein add karo\n- Beginner-friendly simple code chahiye`, tip: "Language + Input + Output + Style = Clean Code" },
      { num: "Lesson 02", title: "Bug Fix karwana", desc: "Error aane pe poori code paste karo aur clearly describe karo kya galat hai.", prompt: `Yeh mera Python code hai:\n\ndef add(a, b)\n    return a + b\nprint(add(2, 3))\n\nError: "SyntaxError"\nKya galat hai? Fix karo aur explain karo kyun yeh error aaya.`, tip: "Code + Error message + Explain karo — AI best teacher ban jaata hai.",
        tryIt: { template: "Yeh mera {language} code hai:\n\n{code}\n\nError: \"{error}\"\nFix karo aur explain karo kyun yeh error aaya.", blanks: [{ id:"language", label:"Language (Python/JS...)", ph:"Python" },{ id:"code", label:"Apna code paste karo", ph:"def add(a, b)\n    return a + b" },{ id:"error", label:"Error message", ph:"SyntaxError" }] }
      }
    ],
    intermediate: [
      { num: "Lesson 03", title: "API Integration prompt", desc: "Complex integrations ke liye structured prompts likhna seekho.", prompt: `Node.js Express API chahiye:\nEndpoint: POST /api/send-alert\nInput: { userId, message, phone }\nAction: Twilio SMS bhejo\nResponse: { success: true, messageId }\n\nRequirements:\n- Error handling\n- async/await\n- Environment variables`, tip: "Endpoint + Input/Output + Libraries = Production-ready code" },
      { num: "Lesson 04", title: "Code Review karwana", desc: "AI se apna code review karwao — bugs, security, improvements sab.", prompt: `Yeh mera React component hai. Review karo:\n\n[CODE PASTE HERE]\n\n1. Performance issues\n2. Security vulnerabilities\n3. Best practices missing\n4. Refactored version bhi do\n\nFormat: Issue → Why → Fix`, tip: "\"Refactored version bhi do\" likhne se directly better code milega." }
    ],
    advanced: [
      { num: "Lesson 05", title: "System Design Prompt", desc: "Architecture-level decisions ke liye structured prompts.", prompt: `SaaS product — Privacy filter Chrome extension\nExpected users: 10,000 in 6 months\nStack: React + Node.js + PostgreSQL\n\n1. Recommended architecture\n2. Database schema\n3. Caching strategy\n4. Security considerations\n5. Scalability bottlenecks\n\nTechnical depth: Senior Engineer level`, tip: "Scale + Stack + Technical depth specify karo." }
    ]
  },
  doctor: {
    icon: "🩺", label: "Doctor", desc: "Medical research, patient communication & education",
    beginner: [
      { num: "Lesson 01", title: "Medical Literature Summarize karna", desc: "Research papers ko AI se summarize karwao.", prompt: `[ABSTRACT PASTE KARO]\n\nMujhe chahiye:\n1. Main finding (1 line)\n2. Sample size & methodology\n3. Clinical significance\n4. Limitations\n5. Guideline change karega?\n\nAudience: General Practitioner`, tip: "Audience specify karo — GP ke liye alag, specialist ke liye alag.",
        tryIt: { template: "Yeh medical study ka abstract hai:\n\n{abstract}\n\nMujhe chahiye:\n1. Main finding (1 line)\n2. Sample size & methodology\n3. Clinical significance\n4. Limitations\n\nAudience: {audience}", blanks: [{ id:"abstract", label:"Abstract ya summary paste karo", ph:"Study examined effect of X on Y in 500 patients..." },{ id:"audience", label:"Audience (GP/Specialist...)", ph:"General Practitioner" }] }
      },
      { num: "Lesson 02", title: "Patient ko samjhana", desc: "Complex medical terms ko patient-friendly language mein convert karwao.", prompt: `Condition: Type 2 Diabetes\nAudience: 55 saal ke patient, Hindi-speaking, low health literacy\n\nExplain karo:\n- Yeh hota kya hai (simple analogy)\n- Kyon hota hai\n- 3 actionable steps\n- Kya avoid karein\n\nTone: Compassionate\nLength: 150 words max`, tip: "Health literacy level batao — AI accordingly simple ya complex bolega.",
        tryIt: { template: "Condition: {condition}\nAudience: {audience}\n\nExplain karo:\n- Yeh hota kya hai (simple analogy)\n- Kyon hota hai\n- 3 actionable steps\n- Kya avoid karein\n\nTone: Compassionate\nLength: {words} words max", blanks: [{ id:"condition", label:"Medical Condition", ph:"Type 2 Diabetes" },{ id:"audience", label:"Patient (age, language, literacy)", ph:"55 saal ke patient, Hindi-speaking" },{ id:"words", label:"Word limit", ph:"150" }] }
      }
    ],
    intermediate: [
      { num: "Lesson 03", title: "Differential Diagnosis (Educational)", desc: "Clinical case ke liye structured differential list banwao.", prompt: `[Educational Case Study]\n35M, Chest pain + dyspnea on exertion\nDuration: 3 weeks\nVitals: BP 140/90, HR 88, SpO2 97%\n\n1. Top 5 differentials\n2. Discriminating features\n3. First 3 investigations\n4. Red flags\n\nNote: Medical education only.`, tip: "ALWAYS add 'Educational purpose' tag." }
    ],
    advanced: [
      { num: "Lesson 04", title: "Research Proposal", desc: "Medical research proposals ke liye structured prompts.", prompt: `Topic: "Telemedicine in Rural UP"\nFunding: ICMR\nDesign: Mixed methods\n\n1. Background & rationale\n2. SMART objectives\n3. Methodology (350 words)\n4. Expected outcomes\n5. Ethical considerations\n6. Budget justification\n\nAcademic tone, APA style`, tip: "Funding body + Study design specify karo." }
    ]
  },
  editor: {
    icon: "✍️", label: "Editor", desc: "Content editing, proofreading & style",
    beginner: [
      { num: "Lesson 01", title: "Proofreading karwana", desc: "Grammar, spelling, punctuation sab ek saath fix karwao.", prompt: `[CONTENT PASTE KARO]\n\nFix karo:\n- Grammar mistakes\n- Spelling errors\n- Punctuation\n- Awkward sentences\n\nOutput:\nCorrected version → Changes list: Original → Fixed`, tip: "\"Changes list\" maangne se tum exactly samjhoge kya change hua.",
        tryIt: { template: "{content}\n\nFix karo:\n- Grammar mistakes\n- Spelling errors\n- Punctuation\n- Awkward sentences\n\nOutput:\nCorrected version → Changes list: Original → Fixed", blanks: [{ id:"content", label:"Apna content yahan paste karo", ph:"Their is many peoples who dont understand how to writes properly..." }] }
      },
      { num: "Lesson 02", title: "Tone change karna", desc: "Ek hi content ko alag tone mein rewrite karwao.", prompt: `[PARAGRAPH PASTE KARO]\n\nTeen versions mein rewrite karo:\nVersion 1: Formal (corporate email)\nVersion 2: Casual (WhatsApp)\nVersion 3: Persuasive (sales copy)\n\nOriginal meaning preserve karo.`, tip: "3 versions maangna best practice — A/B test kar sako.",
        tryIt: { template: "{paragraph}\n\n{versions} versions mein rewrite karo:\nVersion 1: {v1}\nVersion 2: {v2}\nVersion 3: {v3}\n\nOriginal meaning preserve karo.", blanks: [{ id:"paragraph", label:"Paragraph jo rewrite karna hai", ph:"Our product helps businesses save time and money." },{ id:"versions", label:"Kitne versions chahiye", ph:"3" },{ id:"v1", label:"Version 1 tone", ph:"Formal (corporate email)" },{ id:"v2", label:"Version 2 tone", ph:"Casual (WhatsApp)" },{ id:"v3", label:"Version 3 tone", ph:"Persuasive (sales copy)" }] }
      }
    ],
    intermediate: [
      { num: "Lesson 03", title: "Long-form editing", desc: "Articles aur blogs ko structured editing se improve karwao.", prompt: `[800-WORD ARTICLE]\n\nEditorial checklist:\n☐ Headline compelling?\n☐ Hook strong?\n☐ Flow logical?\n☐ Redundancy remove karo\n☐ SEO natural placement\n☐ CTA clear?\n\nOutput: Edited version + Editor's notes`, tip: "Checklist format use karo — structured editorial pass." }
    ],
    advanced: [
      { num: "Lesson 04", title: "Style Guide enforce karna", desc: "Brand voice ke hisaab se content align karwao.", prompt: `Brand: PrivacyBridge AI (B2B SaaS)\nVoice: Professional, approachable\nAvoid: Jargon, passive voice, sentences > 20 words\n\n[CONTENT PASTE KARO]\n\nEnsure:\n1. Brand voice match\n2. Passive → Active voice\n3. Long sentences break karo\n4. Add specific numbers`, tip: "Brand style guide AI ko do — consistent voice guarantee hogi." }
    ]
  },
  marketer: {
    icon: "📣", label: "Marketer", desc: "Ads, copy, campaigns & strategy",
    beginner: [
      { num: "Lesson 01", title: "Ad Copy likhwana", desc: "Platform + audience + goal specify karo — perfect ad copy milega.", prompt: `Platform: Instagram\nProduct: Handmade silver jewellery\nTarget: Women 22-35, urban India\nGoal: Website clicks\nTone: Aspirational, warm\n\n5 ad copies do — 3 lines each.\nHook + Value + CTA format mein.`, tip: "5 variations maangna best practice hai — A/B test karo.",
        tryIt: { template: "Platform: {platform}\nProduct: {product}\nTarget: {target}\nGoal: {goal}\nTone: {tone}\n\n{copies} ad copies do — 3 lines each.\nHook + Value + CTA format mein.", blanks: [{ id:"platform", label:"Platform", ph:"Instagram" },{ id:"product", label:"Product/Service", ph:"Handmade silver jewellery" },{ id:"target", label:"Target Audience", ph:"Women 22-35, urban India" },{ id:"goal", label:"Goal", ph:"Website clicks" },{ id:"tone", label:"Tone", ph:"Aspirational, warm" },{ id:"copies", label:"Kitne copies chahiye", ph:"5" }] }
      }
    ],
    intermediate: [
      { num: "Lesson 02", title: "Content Calendar banana", desc: "30-day social media calendar ek prompt mein.", prompt: `Brand: Fitness coaching startup\nPlatforms: Instagram + LinkedIn\nMonth: April\n\n30-day calendar:\n- Post type (Reel/Carousel/Static)\n- Caption theme\n- Hashtag cluster\n- Best time\n\nMix: 40% educational, 30% engaging, 20% promotional, 10% UGC\nFormat: Table`, tip: "Content mix percentage batao — balanced calendar banega." }
    ],
    advanced: [
      { num: "Lesson 03", title: "Full Funnel Strategy", desc: "TOFU → MOFU → BOFU strategy AI se banwao.", prompt: `Product: Privacy filtering B2B SaaS\nTarget: IT Managers\nDeal size: ₹50,000/year\n\nTOFU: Awareness (content + channels)\nMOFU: Consideration (nurture emails)\nBOFU: Decision (demo, pricing)\n\nInclude:\n- Key messaging per stage\n- 2 content ideas per stage\n- KPIs`, tip: "Deal size batao — funnel length adjust hoti hai." }
    ]
  },
  teacher: {
    icon: "📚", label: "Teacher", desc: "Lesson plans, assessments & student engagement",
    beginner: [
      { num: "Lesson 01", title: "Lesson Plan banana", desc: "Grade + subject + learning objective se complete plan banwao.", prompt: `Subject: Science\nTopic: Photosynthesis\nGrade: 6\nDuration: 45 minutes\nObjective: Students explain photosynthesis using diagram\n\nFormat:\n- Warm-up (5 min)\n- Main teaching (25 min)\n- Activity (10 min)\n- Assessment (5 min)\nMid-lesson questions bhi include karo`, tip: "Duration aur activities specify karo — time-bound plan milega.",
        tryIt: { template: "Subject: {subject}\nTopic: {topic}\nGrade: {grade}\nDuration: {duration} minutes\nObjective: {objective}\n\nFormat:\n- Warm-up (5 min)\n- Main teaching\n- Activity\n- Assessment\nMid-lesson questions bhi include karo", blanks: [{ id:"subject", label:"Subject", ph:"Science" },{ id:"topic", label:"Topic", ph:"Photosynthesis" },{ id:"grade", label:"Grade", ph:"6" },{ id:"duration", label:"Duration (minutes)", ph:"45" },{ id:"objective", label:"Learning Objective", ph:"Students explain photosynthesis using diagram" }] }
      }
    ],
    intermediate: [
      { num: "Lesson 02", title: "Quiz banana", desc: "Bloom's Taxonomy ke hisaab se questions banwao.", prompt: `Topic: French Revolution\nGrade: 10\n\nQuestions:\n- 5 MCQ (Remember level)\n- 3 Short Answer (Understand + Apply)\n- 1 Essay (Analyze + Evaluate)\n\nInclude: Answer key + Marking rubric\nDifficulty: Medium-High`, tip: "Bloom's levels specify karo — rote learning se zyada depth aayegi." }
    ],
    advanced: [
      { num: "Lesson 03", title: "Differentiated Instruction", desc: "Alag-alag levels ke liye same topic pe differentiated material.", prompt: `Topic: Fractions — Grade 5 (mixed ability)\n\nTier 1 (Struggling): Visual, simpler numbers\nTier 2 (On-grade): Standard + worked examples\nTier 3 (Advanced): Word problems + challenge\n\nEach tier: 5 problems + instructions\nTeacher note: How to run all 3 simultaneously`, tip: "Tiered assignments = inclusive classroom." }
    ]
  },
  lawyer: {
    icon: "⚖️", label: "Lawyer", desc: "Research, drafting & legal communication",
    beginner: [
      { num: "Lesson 01", title: "Legal Research summary", desc: "Case laws aur statutes quickly summarize karwao.", prompt: `[Educational/Research purpose]\nTopic: DPDP Act 2023 (India)\n\n1. Key definitions\n2. Business obligations\n3. Non-compliance penalties\n4. GDPR comparison (5 differences)\n\nAudience: Non-legal startup founder\nNote: Educational only`, tip: "ALWAYS add 'Educational purpose' tag.",
        tryIt: { template: "[Educational/Research purpose]\nTopic: {topic}\n\n1. Key definitions\n2. Business obligations\n3. Non-compliance penalties\n4. {comparison} comparison ({points} differences)\n\nAudience: {audience}\nNote: Educational only", blanks: [{ id:"topic", label:"Legal Topic / Act", ph:"DPDP Act 2023 (India)" },{ id:"comparison", label:"Compare with kya?", ph:"GDPR" },{ id:"points", label:"Kitne differences", ph:"5" },{ id:"audience", label:"Audience", ph:"Non-legal startup founder" }] }
      }
    ],
    intermediate: [
      { num: "Lesson 02", title: "Contract Clause drafting", desc: "Specific clauses AI se draft karwao — template ke roop mein.", prompt: `NDA clause draft karo:\nContext: Startup sharing roadmap with investor\nJurisdiction: India\nDuration: 2 years\n\nCover karo:\n- Confidential info definition\n- Exclusions\n- Permitted disclosures\n- Breach consequences\n\nNote: Template only, legal review required`, tip: "Jurisdiction + Duration always specify karo." }
    ],
    advanced: [
      { num: "Lesson 03", title: "Legal Memo (IRAC)", desc: "Structured legal memo AI se draft karwao.", prompt: `Issue: DPDP Act consent requirements for SOS app?\n\nIRAC Format:\nIssue: (1 sentence)\nRule: (Relevant provisions)\nApplication: (How rules apply)\nConclusion: (Recommendation)\n\nAudience: Senior Partner\nLength: 400-500 words`, tip: "IRAC format = legal memo gold standard." }
    ]
  },
  designer: {
    icon: "🎨", label: "Designer", desc: "Briefs, concepts & design thinking",
    beginner: [
      { num: "Lesson 01", title: "Design Brief banana", desc: "Client projects ke liye structured brief AI se banwao.", prompt: `Project: Logo — PrivacyBridge AI\nIndustry: B2B SaaS / Cybersecurity\nAudience: IT Managers, CISOs\nValues: Trust, Privacy, Innovation, Simplicity\n\nBrief include karo:\n- 3 brand personality adjectives\n- Color palette (hex codes)\n- Typography direction\n- What to avoid\n- Reference brands`, tip: "3 adjectives for brand personality — AI choices accordingly.",
        tryIt: { template: "Project: {project}\nIndustry: {industry}\nAudience: {audience}\nValues: {values}\n\nBrief include karo:\n- 3 brand personality adjectives\n- Color palette (hex codes)\n- Typography direction\n- What to avoid\n- Reference brands", blanks: [{ id:"project", label:"Project type (Logo/Website...)", ph:"Logo design" },{ id:"industry", label:"Industry", ph:"B2B SaaS / Cybersecurity" },{ id:"audience", label:"Target Audience", ph:"IT Managers, CISOs" },{ id:"values", label:"Brand Values", ph:"Trust, Privacy, Innovation, Simplicity" }] }
      }
    ],
    intermediate: [
      { num: "Lesson 02", title: "UX Copy likhwana", desc: "App screens ke liye microcopy — buttons, errors, onboarding.", prompt: `App: SafeAlert (Personal Safety)\n\nUX copy chahiye:\n1. Permission request (Location)\n2. Error: "SMS failed"\n3. Success: "Alert sent to 3 contacts"\n4. Empty state: "No contacts added"\n5. SOS button — 3 CTA versions\n\nTone: Reassuring, calm\nMax words: 15 per copy`, tip: "Max word limit batao — UX copy mein brevity sab kuch hai." }
    ],
    advanced: [
      { num: "Lesson 03", title: "Design System prompt", desc: "AI se design tokens aur component hierarchy banwao.", prompt: `Design System — B2B SaaS Dashboard\nTheme: Dark, professional\n\n1. Color tokens (Primary, Semantic)\n2. Typography scale (H1-H6 + Body)\n3. Spacing system (base unit)\n4. Component priority list\n5. WCAG 2.1 AA compliance\n\nFormat: Developer-handoff ready`, tip: "\"Developer-handoff ready\" = AI technical specs mein output karta hai." }
    ]
  },
  farmer: {
    icon: "🌾", label: "Farmer", desc: "Kheti, mausam, mandi aur sarkari schemes",
    beginner: [
      { num: "Lesson 01", title: "Mausam ka Haal lo AI se", desc: "Fasal ke liye sahi time pe sahi jaankari lo.", prompt: "Tu ek expert agricultural advisor hai.\nMujhe bata:\n- Is mahine UP mein gehu ki fasal ke liye kya karna chahiye\n- Kaunsi khaad dalni chahiye\n- Paani kitni baar dena hai\nSimple Hindi mein, kisan ke level par batao.", tip: "Location aur mahina batao — AI local advice deta hai!" },
      { num: "Lesson 02", title: "Sarkari Schemes Samjho", desc: "PM Kisan, Fasal Bima — sab ek jagah.", prompt: "Mujhe India ke kisan schemes ke baare mein batao:\n1. PM Kisan Samman Nidhi — kya milta hai, kaise apply karein\n2. Pradhan Mantri Fasal Bima Yojana — kya cover hota hai\n3. Kisan Credit Card — kaise banwayein\n\nSimple Hindi mein, step-by-step.", tip: "Specific scheme ka naam lo — AI direct aur accurate info deta hai!" },
    ],
    intermediate: [
      { num: "Lesson 03", title: "Mandi Price Research", desc: "Apni fasal ka sahi bhav pata karo.", prompt: "Mujhe help chahiye:\nFasal: Gehu\nLocation: Uttar Pradesh\n\n1. Aaj ka average mandi bhav kya hoga?\n2. Kab bechna sabse faida mand hoga?\n3. Online mandi apps kaunse hain India mein?\n4. MSP kya hai is saal?\n\nPractical advice chahiye.", tip: "Fasal + location specify karo — zyada relevant info milega!" },
    ],
    advanced: [
      { num: "Lesson 04", title: "Modern Farming Techniques", desc: "Technology se kheti ko better banao.", prompt: "Mujhe modern farming techniques batao jo chhote kisan kar saken:\n- 2 acre zameen hai\n- Budget: ₹50,000 invest kar sakta hoon\n- Location: UP, canal irrigation available\n\nBatao:\n1. Drip irrigation worth hai?\n2. Kaunsi high-value crops try karoon\n3. Organic farming kaise shuru karoon\n4. Government subsidy kahan milegi\nHindi mein.", tip: "Zameen ka size aur budget batao — AI realistic plan deta hai!" },
    ]
  },
  chef: {
    icon: "👨‍🍳", label: "Chef", desc: "Recipes, menu planning & culinary techniques",
    beginner: [
      { num: "Lesson 01", title: "Recipe Variations Banwao", desc: "Ek dish ko kai tarike se banana seekho.", prompt: "Tu ek professional chef hai.\nDish: Dal Makhani\n\nMujhe batao:\n1. Classic recipe (restaurant style)\n2. Healthy version (less butter, less cream)\n3. Quick version (30 min mein)\n4. Jain version (no onion/garlic)\n\nHar version mein exact ingredients aur steps.", tip: "Dietary restrictions specify karo — AI perfect variations deta hai!" },
      { num: "Lesson 02", title: "Menu Planning", desc: "Restaurant ya event ke liye menu design karo.", prompt: "Mujhe help chahiye menu banane mein:\nEvent: Family wedding reception\nGuests: 200 log\nBudget: ₹500 per person\nType: North Indian vegetarian\n\nMenu banao:\n- Starters (4 options)\n- Main course (6 items)\n- Dessert (3 options)\n- Drinks\n\nBulk quantity bhi suggest karo.", tip: "Guest count aur budget specify karo — AI per person breakdown deta hai!" },
    ],
    intermediate: [
      { num: "Lesson 03", title: "Food Costing Seekho", desc: "Dish ki actual cost calculate karo.", prompt: "Mujhe food cost calculate karna hai:\nDish: Butter Chicken (1 portion)\n\nIngredients list ke saath:\n- Retail price bhi batao\n- 1 portion ka cost\n- Agar restaurant mein ₹350 mein sell karoon toh profit % kitna?\n- Food cost % industry standard kya hai?\n\nDetailed breakdown chahiye.", tip: "Exact selling price batao — AI profit margin calculate kar deta hai!" },
    ],
    advanced: [
      { num: "Lesson 04", title: "Cloud Kitchen Business Plan", desc: "Ghar se ya small kitchen se business shuru karo.", prompt: "Mujhe cloud kitchen shuru karna hai:\nLocation: Lucknow\nCuisine: North Indian home food\nTarget: Office workers, students\nBudget: ₹2 lakh start\n\nBatao:\n1. Legal requirements (FSSAI etc.)\n2. Zomato/Swiggy pe kaise list karein\n3. Packaging suggestions\n4. Pricing strategy\n5. First month ka plan\nDetailed aur practical.", tip: "City aur target audience batao — AI local market ke hisaab se advice deta hai!" },
    ]
  },
  entrepreneur: {
    icon: "🚀", label: "Entrepreneur", desc: "Startup ideas, business plans & growth strategies",
    beginner: [
      { num: "Lesson 01", title: "Idea Validate Karo", desc: "Startup idea sahi hai ya nahi — pehle check karo.", prompt: "Mera startup idea hai:\n[APNA IDEA YAHAN LIKHO]\n\nMujhe help karo validate karne mein:\n1. Problem real hai? Kitne log face karte hain?\n2. Existing solutions kya hain?\n3. Mera unique angle kya ho sakta hai?\n4. Pehle 10 customers kahan milenge?\n5. Kya yeh India mein kaam karega?\n\nHonest feedback chahiye.", tip: "Idea clearly describe karo — AI honest aur critical feedback deta hai!" },
      { num: "Lesson 02", title: "Competitor Analysis", desc: "Market mein already kya chal raha hai.", prompt: "Mera product: Privacy filtering Chrome extension for enterprises\nTarget market: India B2B\n\nMujhe chahiye:\n1. Top 5 competitors (India + global)\n2. Unki pricing kya hai\n3. Unki weakness kya hai\n4. Mera differentiation angle kya ho\n5. Market size estimate\n\nTable format mein batao.", tip: "Specific product describe karo — AI zyada targeted analysis deta hai!" },
    ],
    intermediate: [
      { num: "Lesson 03", title: "Pitch Deck Content", desc: "Investor ke liye compelling pitch banao.", prompt: "Meri startup ke liye pitch deck content chahiye:\nStartup: PrivacyBridge AI\nStage: Pre-seed\nAsk: ₹50 lakh\n\n10 slides ke liye content:\n1. Problem\n2. Solution\n3. Market Size\n4. Product Demo (describe)\n5. Business Model\n6. Traction\n7. Team\n8. Competition\n9. Financials (projections)\n10. Ask\n\nHar slide ke liye 3-4 bullet points.", tip: "Stage aur funding ask clearly batao — tone accordingly adjust hoti hai!" },
    ],
    advanced: [
      { num: "Lesson 04", title: "Growth Hacking Strategy", desc: "Bina bade budget ke users kaise badhao.", prompt: "Meri app: SafeAlert (Personal Safety SOS App)\nCurrent users: 0 (just launched)\nBudget: ₹10,000/month marketing\nTarget: Urban women in India\n\nGrowth strategy chahiye:\n1. First 1000 users kaise laoon (free tactics)\n2. Viral loop kaise banaaon\n3. Community building strategy\n4. Partnership ideas\n5. Content marketing plan\n\nPractical aur actionable steps.", tip: "Current user count aur budget batao — AI realistic growth plan deta hai!" },
    ]
  },
  journalist: {
    icon: "📰", label: "Journalist", desc: "Research, interviews, writing & fact-checking",
    beginner: [
      { num: "Lesson 01", title: "Story Angle Dhundho", desc: "Kisi bhi topic pe unique angle nikalo.", prompt: "Topic: India mein Electric Vehicles ka badta market\n\nMujhe 5 unique story angles batao jo:\n- Aam reader ko interesting lagein\n- Already covered na ho\n- Local angle ho (India specific)\n- Data-driven ho sake\n\nHar angle ke liye:\n- Headline suggestion\n- Key sources kaun honge\n- Interview ke liye kaun relevant hoga", tip: "Topic broad batao — AI niche angles dhundh ke deta hai!" },
      { num: "Lesson 02", title: "Interview Questions Banwao", desc: "Subject expert se best answers nikalo.", prompt: "Mujhe interview questions chahiye:\nSubject: Startup founder jisne rural India mein fintech launch kiya\nAngle: Challenges aur lessons learned\nAudience: Business readers\nFormat: 45-min interview\n\nQuestions chahiye:\n- 5 warm-up questions\n- 10 main questions (hard-hitting)\n- 3 closing questions\n\nFollow-up probes bhi suggest karo.", tip: "Interview angle clearly batao — AI targeted aur deep questions deta hai!" },
    ],
    intermediate: [
      { num: "Lesson 03", title: "Fact-Check Framework", desc: "Information verify karne ka structured approach.", prompt: "Mujhe ek fact-checking checklist chahiye:\nClaim: 'India mein 2024 mein 10 crore naye smartphone users aaye'\n\nStep-by-step verify karne ka process:\n1. Primary sources kahan dhundhunga\n2. Red flags kya hote hain fake stats mein\n3. Expert se verify kaise karoon\n4. Agar data contradictory ho toh kya karoon\n5. Correction publish karne ka protocol\n\nJournalistic standards ke hisaab se.", tip: "Specific claim paste karo — AI claim-specific verification strategy deta hai!" },
    ],
    advanced: [
      { num: "Lesson 04", title: "Investigative Story Structure", desc: "Complex investigative pieces professionally likhna.", prompt: "Mujhe investigative story structure chahiye:\nTopic: Small town mein illegal sand mining aur local political nexus\nEvidence: Documents + 3 whistleblowers + financial records\n\nBatao:\n1. Story structure (inverted pyramid vs narrative)\n2. Legal risks aur precautions\n3. How to protect sources\n4. Editor ko pitch kaise karoon\n5. Digital security (Signal, encrypted docs)\n6. Publication timing strategy\n\nPress freedom + safety dono important hai.", tip: "Evidence type batao — AI legal aur editorial guidance accordingly deta hai!" },
    ]
  },
};

const FRAMEWORK = [
  { key: "Role →", val: "AI ko ek role assign karo (Tu ek senior doctor hai...)" },
  { key: "Context →", val: "Background info do (Kiske liye, kab, kyun)" },
  { key: "Task →", val: "Clearly bolo kya karna hai (Likho / Explain / Fix)" },
  { key: "Format →", val: "Output ka format batao (Table / Bullets / 3 paragraphs)" },
  { key: "Constraints →", val: "Limits do (100 words / Simple language / Hindi mein)" },
];

// ========== API ==========
const _rateLimitLog = [];
function checkRateLimit() {
  const now = Date.now();
  const recent = _rateLimitLog.filter(t => now - t < 60000);
  if (recent.length >= 10) return false;
  _rateLimitLog.push(now);
  return true;
}

// Sarvam AI call (Primary - India ka AI!)
async function callSarvam(systemPrompt, userMessage) {
  const sarvamKey = import.meta.env.VITE_SARVAM_KEY || "";
  if (!sarvamKey) return null;
  try {
    const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": sarvamKey
      },
      body: JSON.stringify({
        model: "sarvam-m",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        max_tokens: 2048,
        temperature: 0.7
      })
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch(e) {
    return null;
  }
}

// Gemini call (Fallback)
async function callGemini(systemPrompt, userMessage) {
  const apiKey = import.meta.env.VITE_GEMINI_KEY || "";
  if (!apiKey) return null;
  const models = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-flash-8b"];
  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] }],
            generationConfig: { maxOutputTokens: 2048 }
          })
        }
      );
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const msg = err.error?.message || "";
        if (msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("high demand")) continue;
        return null;
      }
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch(e) { continue; }
  }
  return null;
}

// Main function - Sarvam pehle, phir Gemini
async function callClaude(systemPrompt, userMessage) {
  if (!checkRateLimit()) {
    return "⚠️ Thoda wait karo — 1 minute mein dobara try karo!";
  }
  systemPrompt = String(systemPrompt).slice(0, 2000);
  userMessage = String(userMessage).slice(0, 2000);

  // Try Sarvam first (India ka AI - better Hindi!)
  const sarvamResult = await callSarvam(systemPrompt, userMessage);
  if (sarvamResult) return sarvamResult;

  // Fallback to Gemini
  const geminiResult = await callGemini(systemPrompt, userMessage);
  if (geminiResult) return geminiResult;

  return "⚠️ AI abhi busy hai — thoda wait karke dobara try karo!";
}

// ========== TRY IT COMPONENT ==========
function TryIt({ data }) {
  const [open, setOpen] = useState(false);
  const [vals, setVals] = useState({});
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const setValue = (id, val) => setVals(p => ({ ...p, [id]: val }));

  // Build assembled prompt with filled/empty blanks
  const assembled = data.blanks.reduce((str, b) => {
    const val = vals[b.id] || "";
    return str.replace(`{${b.id}}`, val || `[${b.label}]`);
  }, data.template);

  const allFilled = data.blanks.every(b => (vals[b.id] || "").trim() !== "");

  const sendToAI = async () => {
    setLoading(true); setResponse(null);
    try {
      const res = await callClaude(
        "Tu ek helpful AI assistant hai. User ne ek prompt diya hai — isko genuinely aur helpfully answer kar. Concise reh (300 words max). Hinglish ya English mein jawab do.",
        assembled
      );
      setResponse(res);
    } catch {
      setResponse("Error aaya. Dobara try karo.");
    }
    setLoading(false);
  };

  const reset = () => { setVals({}); setResponse(null); };

  // Render preview with colored filled/empty parts
  const renderPreview = () => {
    let parts = [{ text: data.template, filled: null }];
    data.blanks.forEach(b => {
      parts = parts.flatMap(part => {
        if (part.filled !== null) return [part];
        const segments = part.text.split(`{${b.id}}`);
        const result = [];
        segments.forEach((seg, i) => {
          if (seg) result.push({ text: seg, filled: null });
          if (i < segments.length - 1) {
            const val = vals[b.id];
            result.push({ text: val || `[${b.label}]`, filled: !!val });
          }
        });
        return result;
      });
    });
    return parts.map((p, i) => (
      <span key={i} style={{ color: p.filled === null ? undefined : p.filled ? '#34d399' : '#6b7280', fontWeight: p.filled === true ? 600 : undefined, fontStyle: p.filled === false ? 'italic' : undefined }}>
        {p.text}
      </span>
    ));
  };

  return (
    <div className="tryit-section">
      <div className="tryit-header" onClick={() => setOpen(o => !o)}>
        <span style={{ fontSize: 16 }}>✏️</span>
        <span className="tryit-header-title">Try It Yourself — Blanks Bharo!</span>
        <span className="tryit-header-sub">{open ? "▲ collapse" : "▼ expand"}</span>
      </div>
      {open && (
        <div className="tryit-body">
          <div className="tryit-fields">
            {data.blanks.map(b => (
              <div className="tryit-field" key={b.id}>
                <label>{b.label}</label>
                {b.ph && b.ph.includes('\n') ? (
                  <textarea
                    className="tryit-input"
                    style={{ minHeight: 70, resize: 'vertical' }}
                    placeholder={b.ph}
                    value={vals[b.id] || ""}
                    onChange={e => setValue(b.id, e.target.value)}
                  />
                ) : (
                  <input
                    className="tryit-input"
                    type="text"
                    placeholder={b.ph}
                    value={vals[b.id] || ""}
                    onChange={e => setValue(b.id, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="tryit-preview">
            <div className="tryit-preview-label">📋 Tumhara Prompt (live preview)</div>
            <div className="tryit-preview-text">{renderPreview()}</div>
          </div>

          <div className="tryit-btn-row">
            <button className="tryit-send-btn" onClick={sendToAI} disabled={!allFilled || loading}>
              {loading ? "⏳ AI soch raha hai..." : "🚀 AI ko bhejo"}
            </button>
            <button className="tryit-clear-btn" onClick={reset}>↺ Reset</button>
          </div>

          {!allFilled && !loading && (
            <div style={{ fontSize: 11, color: '#6b7280', marginTop: 8, fontFamily: 'DM Mono, monospace' }}>
              ↑ Sab blanks bharo tab AI button active hoga
            </div>
          )}

          {loading && (
            <div className="ai-loading" style={{ marginTop: 12 }}>
              <span style={{ marginRight: 6 }}>🤖</span> AI tumhara prompt process kar raha hai...
            </div>
          )}
          {response && (
            <div className="tryit-response">
              <div className="tryit-response-label">✅ AI ka Response</div>
              <div className="tryit-response-text">{response}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ========== COMPONENTS ==========
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button className="copy-btn" onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
      {copied ? "✓ Copied" : "📋 Copy"}
    </button>
  );
}

function Lesson({ data, dark }) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const testPrompt = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const res = await callClaude(
        "Tu ek expert AI assistant hai. User ne ek prompt diya hai — isko genuinely aur helpfully answer kar. Concise reh (300 words max).",
        data.prompt
      );
      setResponse(res);
    } catch (e) {
      setResponse("Error aaya. Network check karo aur dobara try karo.");
    }
    setLoading(false);
  };

  return (
    <div className="lesson">
      <div className="lesson-num">{data.num}</div>
      <div className="lesson-title">{data.title}</div>
      <div className="lesson-desc">{data.desc}</div>
      <div className="prompt-box">
        <div className="prompt-label">📋 Prompt Example</div>
        <div className="prompt-text">{data.prompt}</div>
        <div className="btn-row">
          <CopyBtn text={data.prompt} />
          <button className="test-btn" onClick={testPrompt} disabled={loading}>
            {loading ? "⏳ Testing..." : "▶ Live Test karo"}
          </button>
        </div>
      </div>
      {(loading || response) && (
        <div className="ai-response">
          <div className="ai-response-header">
            <span>🤖</span>
            <span className="ai-response-label">AI ka Live Response</span>
          </div>
          {loading ? (
            <div className="ai-loading">
              Soch raha hoon<span className="dot-anim"><span>.</span><span>.</span><span>.</span></span>
            </div>
          ) : (
            <div className="ai-response-body">{response}</div>
          )}
        </div>
      )}
      <div className="tip-box">
        <span style={{fontSize:15, flexShrink:0, marginTop:1}}>💡</span>
        <span className="tip-text"><strong>Pro Tip:</strong> {data.tip}</span>
      </div>
      {data.tryIt && <TryIt data={data.tryIt} />}
    </div>
  );
}

// ========== QUIZ ==========
function QuizTab({ dark }) {
  const [qIndex, setQIndex] = useState(0);
  const [userPrompt, setUserPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [scores, setScores] = useState([]);
  const [done, setDone] = useState(false);

  const q = QUIZ_QUESTIONS[qIndex];

  const submitQuiz = async () => {
    if (!userPrompt.trim()) return;
    setLoading(true);
    setFeedback(null);
    try {
      const res = await callClaude(
        `Tu ek senior prompt engineering expert hai jiske paas 15 saal ka experience hai.
User ne ek prompt likha hai jo ek specific scenario ke liye hai.
Tujhe yeh evaluate karna hai:
1. Score do 1-10 (sirf number)
2. Kya achha kiya (2-3 points)
3. Kya improve ho sakta tha (2-3 points)
4. Ek better version bhi do

Format:
SCORE: [number]/10
✅ Achha kiya:
- point 1
- point 2
❌ Improve karo:
- point 1
- point 2
💡 Better Version:
[improved prompt here]

Hinglish mein jawab do. Encouraging reh lekin honest bhi.`,
        `Scenario: ${q.scenario}\n\nUser ka prompt:\n${userPrompt}`
      );
      setFeedback(res);
      const scoreMatch = res.match(/SCORE:\s*(\d+)/i);
      const sc = scoreMatch ? parseInt(scoreMatch[1]) : 5;
      setScores(prev => [...prev, sc]);
    } catch (e) {
      setFeedback("Error aaya. Dobara try karo.");
    }
    setLoading(false);
  };

  const nextQuestion = () => {
    if (qIndex >= QUIZ_QUESTIONS.length - 1) { setDone(true); return; }
    setQIndex(i => i + 1);
    setUserPrompt("");
    setFeedback(null);
  };

  const restart = () => { setQIndex(0); setUserPrompt(""); setFeedback(null); setScores([]); setDone(false); };

  const avgScore = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0;

  const getScoreColor = (s) => s >= 8 ? '#4ade80' : s >= 5 ? '#fbbf24' : '#f87171';

  if (done) {
    return (
      <div className="quiz-scene">
        <div className="score-display">
          <div style={{fontSize:40, marginBottom:12}}>🏆</div>
          <div className="score-num">{avgScore}/10</div>
          <div className="score-label">Average Score — {scores.length} questions complete</div>
          <div className="score-msg">
            {avgScore >= 8 ? "Bahut mast! Tum ek pro prompt engineer bante ja rahe ho. 🔥" :
             avgScore >= 5 ? "Achha progress hai! RCTFC framework practice karte raho. 💪" :
             "Keep practicing! Har lesson ke examples dekho aur phir quiz try karo. 📚"}
          </div>
          <div style={{marginTop:14, display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap'}}>
            {scores.map((s,i) => (
              <span key={i} style={{padding:'4px 12px', borderRadius:20, background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.2)', fontSize:13, fontFamily:'DM Mono, monospace', color: getScoreColor(s)}}>
                Q{i+1}: {s}/10
              </span>
            ))}
          </div>
          <button className="restart-btn" onClick={restart}>🔄 Dobara Try karo</button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-scene">
      <div className="quiz-progress">
        {QUIZ_QUESTIONS.map((_, i) => (
          <div key={i} className={`quiz-dot ${i < qIndex ? 'done' : i === qIndex ? 'current' : ''}`} />
        ))}
        <span style={{marginLeft:8, fontSize:12, color: dark ? '#6b7280' : '#9ca3af', fontFamily:'DM Mono, monospace'}}>
          {qIndex+1} / {QUIZ_QUESTIONS.length}
        </span>
      </div>

      <div className="quiz-scenario">
        <div className="quiz-scenario-label">📋 Scenario</div>
        <div className="quiz-scenario-text">{q.scenario}</div>
        <div className="quiz-hint">{q.hint}</div>
      </div>

      <div className="section-label">Apna Prompt Likho ↓</div>
      <textarea
        className="quiz-textarea"
        placeholder="Yahan apna prompt type karo... RCTFC framework use karo!"
        value={userPrompt}
        onChange={e => setUserPrompt(e.target.value)}
        disabled={loading || !!feedback}
      />

      {!feedback && (
        <button className="submit-btn" onClick={submitQuiz} disabled={loading || !userPrompt.trim()}>
          {loading ? "⏳ Evaluate ho raha hai..." : "✅ Submit karo — AI evaluate karega"}
        </button>
      )}

      {(loading && !feedback) && (
        <div className="ai-loading" style={{marginTop:14}}>
          Tumhara prompt evaluate ho raha hai<span className="dot-anim"><span>.</span><span>.</span><span>.</span></span>
        </div>
      )}

      {feedback && (
        <>
          <div className="feedback-box">{feedback}</div>
          <button className="next-btn" onClick={nextQuestion}>
            {qIndex >= QUIZ_QUESTIONS.length - 1 ? "🏆 Results dekho" : "Next Question →"}
          </button>
        </>
      )}
    </div>
  );
}


// ========== REAL LIFE COMPONENT ==========
function RealLifeCard({ item, color, bg, dark }) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleTest = async () => {
    setLoading(true); setResponse(null);
    try {
      const res = await callClaude(
        "Tu ek helpful Indian assistant hai. User ne ek real-life problem ke liye prompt diya hai. Genuinely help karo. Hindi ya Hinglish mein jawab do. Practical aur actionable advice do. Max 300 words.",
        item.prompt
      );
      setResponse(res);
    } catch { setResponse("Error aaya. Dobara try karo."); }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(item.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rl-card">
      <div className="rl-card-header" style={{ background: bg }}>
        <span className="rl-card-icon">{item.icon}</span>
        <div>
          <div className="rl-card-title">{item.title}</div>
          <div className="rl-card-usecase">{item.usecase}</div>
        </div>
      </div>
      <div className="rl-card-body" style={{ background: dark ? 'rgba(0,0,0,0.3)' : '#fff' }}>
        <div className="rl-prompt-box" style={{ borderLeftColor: color }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8, fontWeight: 700 }}>
            📋 Ready-made Prompt
          </div>
          <div className="rl-prompt-text" style={{ color: dark ? '#d1d5db' : '#374151' }}>{item.prompt}</div>
          <button className="copy-btn" onClick={handleCopy}>{copied ? "✓ Copied" : "Copy"}</button>
        </div>
        <div className="rl-tip">
          <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
          <span className="rl-tip-text" style={{ color: dark ? '#d1b55a' : '#92701a' }}>{item.tip}</span>
        </div>
        <button className="rl-test-btn" style={{ background: bg }} onClick={handleTest} disabled={loading}>
          {loading ? "⏳ AI soch raha hai..." : "🚀 AI se Try Karo"}
        </button>
        {loading && (
          <div className="ai-loading" style={{ marginTop: 10 }}>
            <div className="spinner" />
            <span>Response generate ho raha hai...</span>
          </div>
        )}
        {response && (
          <div className="rl-response" style={{ background: dark ? 'rgba(0,0,0,0.25)' : '#f8f8fb', borderLeftColor: color }}>
            <div className="rl-response-label" style={{ color }}>✅ AI ka Jawab</div>
            <div className="rl-response-text" style={{ color: dark ? '#d1d5db' : '#374151' }}>{response}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function RealLifeTab({ dark }) {
  const [cat, setCat] = useState("kitchen");
  const items = REAL_LIFE_EXAMPLES[cat] || [];
  const currentCat = REAL_LIFE_CATS.find(c => c.id === cat);

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div className="rl-hero">
        <div style={{ fontSize: 40, marginBottom: 10 }}>🏡</div>
        <div className="rl-hero-title">Real Life Prompts</div>
        <div className="rl-hero-sub">
          Rasoi se lekar budget tak — rozana ki zindagi mein AI ka use karo!<br />
          Ready-made prompts — seedha copy karo ya AI se test karo.
        </div>
      </div>

      <div style={{ marginBottom: 8, fontSize: 10, color: dark ? '#6b7280' : '#9ca3af', fontFamily: 'DM Mono, monospace', letterSpacing: 1, textTransform: 'uppercase' }}>
        Category Chunno 👇
      </div>
      <div className="rl-cat-grid">
        {REAL_LIFE_CATS.map(c => (
          <div
            key={c.id}
            className={`rl-cat-card ${cat === c.id ? 'active' : ''}`}
            style={{ background: c.bg, opacity: cat === c.id ? 1 : 0.7 }}
            onClick={() => setCat(c.id)}
          >
            <div className="rl-cat-icon">{c.icon}</div>
            <div className="rl-cat-name">{c.name}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 16, padding: '10px 14px', background: currentCat ? `${currentCat.color}15` : 'transparent', borderRadius: 12, border: `1px solid ${currentCat?.color || '#6366f1'}30`, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 20 }}>{currentCat?.icon}</span>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 15, color: currentCat?.color }}>{currentCat?.name}</span>
        <span style={{ fontSize: 12, color: dark ? '#6b7280' : '#9ca3af', fontFamily: 'DM Mono, monospace' }}>— {items.length} prompts ready</span>
      </div>

      {items.map((item, i) => (
        <RealLifeCard key={i} item={item} color={currentCat?.color || '#6366f1'} bg={currentCat?.bg || ''} dark={dark} />
      ))}

      <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(99,102,241,0.06)', borderRadius: 14, border: '1px solid rgba(99,102,241,0.15)', marginTop: 8 }}>
        <div style={{ fontSize: 20, marginBottom: 6 }}>💡</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 13, color: dark ? '#e8e8f0' : '#111118', marginBottom: 4 }}>Prompt ko Customize karo!</div>
        <div style={{ fontSize: 12, color: dark ? '#9ca3af' : '#52525b', lineHeight: 1.7 }}>Copy karo → Apna naam/budget/location dalo → ChatGPT ya Claude mein paste karo → Apna personal answer pao! 🎯</div>
      </div>
    </div>
  );
}



// ========== CAREER GUIDANCE COMPONENT ==========
function CareerCourseCard({ course, color, bg, dark }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiGuide, setAiGuide] = useState(null);

  const getAIGuide = async () => {
    setLoading(true); setAiGuide(null);
    try {
      const res = await callClaude(
        `Tu ek expert Indian career counselor hai jiske paas 15+ saal ka experience hai. Students ko genuinely helpful aur honest guidance do. Hindi mein jawab do. Practical aur India-specific batao. Max 250 words.`,
        `Student puchh raha hai: "${course.name}" course ke baare mein complete guidance chahiye.
Mujhe batao:
1. Yeh course actually kaisa hota hai (real picture)
2. Kise karna chahiye — kis type ke student ke liye best hai
3. India mein scope aur future kya hai (honest batao)
4. Shuru karne ke liye aaj kya karun
5. Ek chhoti si motivational baat`
      );
      setAiGuide(res);
    } catch { setAiGuide("Error aaya. Dobara try karo."); }
    setLoading(false);
  };

  return (
    <div className="career-course-card" style={{ background: dark ? "rgba(0,0,0,0.3)" : "#fff" }}>
      <div className="career-course-header" style={{ background: bg }} onClick={() => setOpen(o => !o)}>
        <span className="career-course-emoji">{course.emoji}</span>
        <div style={{ flex: 1 }}>
          <div className="career-course-name">{course.name}</div>
          <div className="career-course-desc">{course.desc}</div>
        </div>
        <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, marginLeft: 8 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div className="career-course-body open">
          <div className="career-detail-grid">
            {[
              { label: "📋 Eligibility", val: course.eligibility },
              { label: "⏱️ Duration", val: course.duration },
              { label: "💰 Fees/Year", val: course.fees },
              { label: "🏫 Top Colleges", val: course.topColleges },
              { label: "💵 Salary Range", val: course.salary },
              { label: "🌐 Job Scope", val: course.scope },
            ].map((d, i) => (
              <div key={i} className="career-detail-item">
                <div className="career-detail-label" style={{ color }}>{d.label}</div>
                <div className="career-detail-val" style={{ color: dark ? "#e8e8f0" : "#1a1a2e" }}>{d.val}</div>
              </div>
            ))}
          </div>
          <button className="career-ai-btn" style={{ background: bg }} onClick={getAIGuide} disabled={loading}>
            {loading ? "⏳ AI soch raha hai..." : "🤖 AI se Personal Guidance Lo"}
          </button>
          {loading && <div className="ai-loading" style={{ marginTop: 10 }}><div className="spinner" /><span>Career guidance generate ho raha hai...</span></div>}
          {aiGuide && (
            <div className="career-ai-response" style={{ background: dark ? "rgba(0,0,0,0.25)" : "#f8f8fb", borderLeftColor: color }}>
              <div className="career-ai-label" style={{ color }}>🎯 AI Career Guidance</div>
              <div className="career-ai-text" style={{ color: dark ? "#d1d5db" : "#374151" }}>{aiGuide}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CareerGuidanceTab({ dark }) {
  const [ageGroup, setAgeGroup] = useState("8to10");
  const groupData = CAREER_DATA[ageGroup];
  const currentGroup = CAREER_AGE_GROUPS.find(g => g.id === ageGroup);

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div className="career-hero" style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81,#1e3a5f)" }}>
        <div style={{ fontSize: 44, marginBottom: 10 }}>🎓</div>
        <div className="career-hero-title">Career Explorer — India</div>
        <div className="career-hero-sub">
          100+ courses aur career paths — sab ek jagah!<br />
          Apni age group chunno aur explore karo 👇
        </div>
      </div>

      <div style={{ marginBottom: 10, fontSize: 10, color: dark ? "#6b7280" : "#9ca3af", fontFamily: "DM Mono, monospace", letterSpacing: 1, textTransform: "uppercase" }}>
        Apni Stage Chunno
      </div>
      <div className="career-age-grid">
        {CAREER_AGE_GROUPS.map(g => (
          <div key={g.id} className={`career-age-card ${ageGroup === g.id ? "active" : ""}`}
            style={{ background: g.bg, opacity: ageGroup === g.id ? 1 : 0.7 }}
            onClick={() => setAgeGroup(g.id)}>
            <div className="career-age-emoji">{g.emoji}</div>
            <div className="career-age-label">{g.label}</div>
            <div className="career-age-desc">{g.desc}</div>
          </div>
        ))}
      </div>

      <div className="career-intro" style={{ background: `${currentGroup?.color}15`, borderColor: `${currentGroup?.color}30`, color: currentGroup?.color }}>
        💡 {groupData.intro}
      </div>

      {groupData.categories.map((cat, ci) => (
        <div className="career-category" key={ci}>
          <div className="career-cat-header" style={{ background: `${cat.color}12`, border: `1px solid ${cat.color}25` }}>
            <span className="career-cat-icon">{cat.icon}</span>
            <span className="career-cat-name" style={{ color: cat.color }}>{cat.name}</span>
            <span style={{ marginLeft: "auto", fontSize: 11, color: dark ? "#6b7280" : "#9ca3af", fontFamily: "DM Mono, monospace" }}>{cat.courses.length} courses</span>
          </div>
          <div className="career-course-list">
            {cat.courses.map((course, cj) => (
              <CareerCourseCard key={cj} course={course} color={cat.color} bg={`linear-gradient(135deg,${cat.color},${cat.color}99)`} dark={dark} />
            ))}
          </div>
        </div>
      ))}

      <div style={{ textAlign: "center", padding: "18px", background: "linear-gradient(135deg,rgba(30,27,75,0.5),rgba(49,46,129,0.3))", borderRadius: 16, border: "1px solid rgba(99,102,241,0.2)", marginTop: 8 }}>
        <div style={{ fontSize: 22, marginBottom: 8 }}>🌟</div>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 14, color: dark ? "#e8e8f0" : "#111118", marginBottom: 6 }}>Yaad Rakho!</div>
        <div style={{ fontSize: 13, color: dark ? "#9ca3af" : "#52525b", lineHeight: 1.8 }}>
          Koi bhi course "safe" ya "risky" nahi hota — passion + mehnat se har field mein success milti hai.<br />
          Kisi bhi course pe click karo → AI se personal guidance lo → Apna decision khud lo! 💪
        </div>
      </div>
    </div>
  );
}

// ========== MISTAKES COMPONENT ==========
function MistakesTab({ dark }) {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Beginner Mistake", "Intermediate Mistake", "Advanced Mistake"];
  const filtered = filter === "All" ? MISTAKES : MISTAKES.filter(m => m.category === filter);

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div className="mistakes-hero">
        <div style={{ fontSize: 40, marginBottom: 10 }}>🚫</div>
        <div className="mistakes-hero-title">Prompt Mistakes — Yeh Mat Karo!</div>
        <div className="mistakes-hero-sub">
          8 common galtiyan jo log karte hain AI se baat karte waqt.<br />
          Inhe avoid karo — output 10x better ho jaayega! 🔥
        </div>
      </div>

      <div className="mistake-filter">
        {categories.map(c => (
          <button key={c} className={`mistake-filter-btn ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>
            {c === "All" ? "📋 Sab" : c === "Beginner Mistake" ? "🟢 Beginner" : c === "Intermediate Mistake" ? "🟡 Intermediate" : "🔴 Advanced"}
          </button>
        ))}
      </div>

      {filtered.map((m) => (
        <div className="mistake-card" key={m.id} style={{ border: `2px solid ${m.color}22` }}>
          <div className="mistake-card-header" style={{ background: m.bg }}>
            <span className="mistake-icon">{m.icon}</span>
            <div>
              <div className="mistake-num">Mistake #{m.id}</div>
              <div className="mistake-title">{m.title}</div>
              <div className="mistake-category">{m.category}</div>
            </div>
          </div>
          <div className="mistake-body" style={{ background: dark ? "rgba(0,0,0,0.3)" : "#fff" }}>
            <div className="mistake-compare">
              <div className="mistake-bad">
                <div className="mistake-label" style={{ color: "#ef4444" }}>❌ Galat Tarika</div>
                <div className="mistake-text" style={{ color: dark ? "#fca5a5" : "#991b1b" }}>{m.bad}</div>
              </div>
              <div className="mistake-good">
                <div className="mistake-label" style={{ color: "#22c55e" }}>✅ Sahi Tarika</div>
                <div className="mistake-text" style={{ color: dark ? "#86efac" : "#166534" }}>{m.good}</div>
              </div>
            </div>
            <div className="mistake-why">
              <span style={{ fontSize: 16, flexShrink: 0 }}>🧠</span>
              <span className="mistake-why-text" style={{ color: dark ? "#d1d5db" : "#374151" }}>
                <strong>Kyun?</strong> {m.why}
              </span>
            </div>
          </div>
        </div>
      ))}

      <div style={{ textAlign: "center", padding: "16px", background: "rgba(239,68,68,0.06)", borderRadius: 14, border: "1px solid rgba(239,68,68,0.15)", marginTop: 8 }}>
        <div style={{ fontSize: 20, marginBottom: 6 }}>💡</div>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 13, color: dark ? "#e8e8f0" : "#111118", marginBottom: 4 }}>
          Golden Rule
        </div>
        <div style={{ fontSize: 12, color: dark ? "#9ca3af" : "#52525b", lineHeight: 1.7 }}>
          RCTFC formula yaad rakho: Role → Context → Task → Format → Constraints<br />
          Yeh 5 cheezein hamesha raho — mistakes automatically kam ho jaayengi! 🎯
        </div>
      </div>
    </div>
  );
}

// ========== KIDS COMPONENTS ==========
function KidsLesson({ lesson }) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleTry = async () => {
    setLoading(true); setResponse(null);
    try {
      const res = await callClaude(
        "Tu ek friendly teacher hai jo chote bacchon ko (8-12 saal) padhata hai. Apna jawab simple, fun, aur engaging rakho. Hindi mein jawab do. Emojis use karo to make it fun. Max 200 words.",
        lesson.prompt
      );
      setResponse(res);
    } catch { setResponse("Oops! Dobara try karo 🙈"); }
    setLoading(false);
  };

  return (
    <div className="kids-lesson-card" style={{ border: `3px solid ${lesson.color}22` }}>
      <div className="kids-lesson-header" style={{ background: lesson.bg }}>
        <div>
          <div className="kids-lesson-num">{lesson.num}</div>
          <div className="kids-lesson-title">{lesson.title}</div>
        </div>
      </div>
      <div className="kids-lesson-body">
        <div className="kids-story">{lesson.story}</div>
        <div className="kids-prompt-box" style={{ borderLeftColor: lesson.color }}>
          <div className="kids-prompt-label" style={{ color: lesson.labelColor }}>
            {lesson.label}
          </div>
          <div className="kids-prompt-text">{lesson.prompt}</div>
        </div>
        <div className="kids-fun-fact" style={{ background: lesson.funBg }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
          <span className="kids-fun-fact-text" style={{ color: lesson.funColor }}>{lesson.funFact}</span>
        </div>
        <button className="kids-try-btn" style={{ background: lesson.btnBg }} onClick={handleTry} disabled={loading}>
          {loading ? "⏳ AI soch raha hai..." : "🚀 AI se Poochho!"}
        </button>
        {loading && (
          <div style={{ textAlign: "center", marginTop: 12, fontSize: 20 }}>
            🤖 ⏳ 💫
          </div>
        )}
        {response && (
          <div className="kids-response" style={{ background: lesson.responseBg, border: `2px solid ${lesson.color}33` }}>
            <div className="kids-response-label" style={{ color: lesson.color }}>🤖 AI ka Jawab!</div>
            <div className="kids-response-text">{response}</div>
            <div style={{ textAlign: "center", marginTop: 14, fontSize: 24 }}>⭐⭐⭐</div>
          </div>
        )}
      </div>
    </div>
  );
}

const KIDS_PRO_TOPICS = ["homework", "games", "science"];

function KidsTab({ dark, isPro, onUpgrade }) {
  const [topic, setTopic] = useState("homework");
  const lessons = KIDS_LESSONS[topic] || [];
  const currentTopic = KIDS_TOPICS.find(t => t.id === topic);
  const isTopicLocked = !isPro && KIDS_PRO_TOPICS.includes(topic);

  return (
    <div className="kids-wrapper">
      {/* Hero */}
      <div className="kids-hero">
        <div className="kids-hero-emoji">🤖</div>
        <div className="kids-hero-title">AI Seekho — Masti se! 🎉</div>
        <div className="kids-hero-sub">
          Homework help se lekar stories tak —<br />
          AI tumhara sabse smart dost hai!
        </div>
        <div className="kids-age-badge">⭐ 8 to 12 saal ke bacchon ke liye ⭐</div>
      </div>

      {/* Topic Select */}
      <div style={{ marginBottom: 10, fontSize: 12, color: dark ? "#6b7280" : "#9ca3af", fontFamily: "DM Mono, monospace", letterSpacing: 1, textTransform: "uppercase" }}>
        Kya seekhna hai aaj? 👇
      </div>
      <div className="kids-topic-grid">
        {KIDS_TOPICS.map(t => {
          const locked = !isPro && KIDS_PRO_TOPICS.includes(t.id);
          return (
            <div
              key={t.id}
              className={`kids-topic-card ${topic === t.id ? "active" : ""}`}
              style={{ background: t.bg, opacity: topic === t.id ? 1 : 0.75, position: "relative" }}
              onClick={() => setTopic(t.id)}
            >
              <div className="kids-topic-icon">{t.icon}</div>
              <div className="kids-topic-name">{t.name}</div>
              {locked && (
                <div style={{ position: "absolute", top: 6, right: 6, background: "linear-gradient(135deg,#4f46e5,#7c3aed)", borderRadius: 6, padding: "1px 6px", fontSize: 9, color: "#fff", fontFamily: "Syne, sans-serif", fontWeight: 800 }}>PRO</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lessons */}
      <div style={{ marginBottom: 14, padding: "10px 14px", background: currentTopic ? `${currentTopic.color}15` : "transparent", borderRadius: 12, border: `1px solid ${currentTopic?.color || "#6366f1"}30`, display: "flex", alignItems: "center" }}>
        <span style={{ fontSize: 18 }}>{currentTopic?.icon}</span>
        <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 15, marginLeft: 8, color: currentTopic?.color }}>{currentTopic?.name}</span>
        {isTopicLocked
          ? <span className="pro-badge" style={{ marginLeft: 8 }}>PRO</span>
          : <span className="free-badge" style={{ marginLeft: 8 }}>FREE</span>
        }
        <span style={{ fontSize: 12, color: dark ? "#6b7280" : "#9ca3af", marginLeft: 8, fontFamily: "DM Mono, monospace" }}>— {lessons.length} lesson{lessons.length !== 1 ? "s" : ""}</span>
      </div>

      {isTopicLocked ? (
        <div style={{ textAlign: "center", padding: "32px 20px", background: "rgba(99,102,241,0.06)", borderRadius: 16, border: "2px dashed rgba(99,102,241,0.25)", marginBottom: 16 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 16, color: dark ? "#e8e8f0" : "#111118", marginBottom: 6 }}>
            {currentTopic?.icon} {currentTopic?.name} — PRO mein hai!
          </div>
          <div style={{ fontSize: 13, color: dark ? "#9ca3af" : "#6b7280", marginBottom: 18, lineHeight: 1.7 }}>
            Yeh topic unlock karo — sirf ₹49/month mein<br />
            Kahaniya, Drawing & Art, Janwar Duniya — sab milega!
          </div>
          <button onClick={onUpgrade} style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff", border: "none", fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 14, padding: "11px 28px", borderRadius: 12, cursor: "pointer", boxShadow: "0 4px 16px rgba(79,70,229,0.35)" }}>
            🚀 Pro Unlock Karo — ₹49/month
          </button>
          {/* Blurred preview */}
          <div style={{ marginTop: 20, filter: "blur(5px)", opacity: 0.4, pointerEvents: "none" }}>
            {lessons.slice(0,1).map((l, i) => (
              <div key={i} style={{ background: l.bg, borderRadius: 14, padding: "12px 16px", marginBottom: 8, textAlign: "left" }}>
                <div style={{ color: "#fff", fontFamily: "Syne, sans-serif", fontWeight: 800 }}>{l.title}</div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 4 }}>{l.story?.slice(0, 60)}...</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        lessons.map((l, i) => (
          <KidsLesson key={i} lesson={l} dark={dark} />
        ))
      )}

      {/* Bottom tip */}
      <div style={{ textAlign: "center", padding: "16px", background: "linear-gradient(135deg,rgba(124,58,237,0.1),rgba(8,145,178,0.1))", borderRadius: 14, border: "1px solid rgba(124,58,237,0.2)", marginTop: 8 }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>🌟</div>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 14, color: dark ? "#e8e8f0" : "#111118", marginBottom: 4 }}>
          Remember!
        </div>
        <div style={{ fontSize: 13, color: dark ? "#9ca3af" : "#52525b", lineHeight: 1.7 }}>
          AI ek tool hai — tumhara dost! Jitna zyada clearly poocho, utna achha jawab milega. Practice karte raho! 💪
        </div>
      </div>
    </div>
  );
}


// ========== PROMPT EVALUATOR (MULTI-AGENT) ==========
function PromptEvaluatorTab({ dark }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const AGENTS = [
    {
      id: "clarity",
      name: "Clarity Agent",
      emoji: "🎯",
      color: "#3b82f6",
      role: "Tu ek expert prompt clarity analyzer hai. User ka prompt dekh aur evaluate kar:
1. SCORE: /10 (kitna clear hai)
2. PROBLEMS: Kya missing hai ya confusing hai (2-3 points)
3. VERDICT: ek line mein summary
Response bilkul concise rakh — Hindi mein."
    },
    {
      id: "effectiveness",
      name: "Effectiveness Agent", 
      emoji: "⚡",
      color: "#f59e0b",
      role: "Tu ek AI output quality expert hai. User ka prompt dekh aur evaluate kar:
1. SCORE: /10 (kitna effective hai)
2. AI RESPONSE: Is prompt se kaisa output aayega? (2-3 points)
3. MISSING: Kya add karna chahiye better results ke liye
Response bilkul concise rakh — Hindi mein."
    },
    {
      id: "improved",
      name: "Improvement Agent",
      emoji: "🔧",
      color: "#10b981",
      role: "Tu ek expert prompt engineer hai. User ka original prompt le aur uska ek better, improved version likh. Bas improved prompt do — explanation nahi chahiye. Hindi/Hinglish mein rakh."
    }
  ];

  const evaluatePrompt = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResults(null);

    const agentResults = {};
    
    // Run all 3 agents simultaneously
    const promises = AGENTS.map(async (agent) => {
      const result = await callClaude(agent.role, `Yeh prompt evaluate karo:\n\n"${prompt}"`);
      agentResults[agent.id] = result;
    });

    await Promise.all(promises);
    setResults(agentResults);
    setLoading(false);
  };

  const cardStyle = (color) => ({
    background: dark ? "rgba(0,0,0,0.2)" : "#fff",
    border: `1px solid ${color}44`,
    borderLeft: `4px solid ${color}`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14
  });

  return (
    <div style={{padding: "0 0 40px 0"}}>
      <div style={{textAlign:"center", marginBottom:20}}>
        <div style={{fontSize:36, marginBottom:8}}>🧪</div>
        <div style={{fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:20, color: dark?"#e8e8f0":"#111118"}}>
          Multi-Agent Prompt Evaluator
        </div>
        <div style={{fontSize:13, color: dark?"#6b7280":"#9ca3af", marginTop:6}}>
          3 AI agents milke tumhara prompt evaluate karenge!
        </div>
      </div>

      {/* Input */}
      <div style={{background: dark?"rgba(255,255,255,0.04)":"#f8f8fb", borderRadius:14, padding:16, marginBottom:16, border:`1px solid ${dark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.06)"}`}}>
        <div style={{fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:13, color: dark?"#a5b4fc":"#4f46e5", marginBottom:10}}>
          📝 Apna Prompt Yahan Likho:
        </div>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Example: Mujhe essay likhna hai climate change pe..."
          style={{width:"100%", minHeight:100, padding:"12px", borderRadius:10, border:`1px solid ${dark?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.1)"}`, background: dark?"rgba(0,0,0,0.3)":"#fff", color: dark?"#e8e8f0":"#111118", fontFamily:"DM Mono,monospace", fontSize:13, resize:"vertical", outline:"none", boxSizing:"border-box"}}
        />
        <button
          onClick={evaluatePrompt}
          disabled={loading || !prompt.trim()}
          style={{width:"100%", marginTop:10, padding:"12px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#4f46e5,#7c3aed)", color:"#fff", fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:15, cursor:"pointer", opacity: (loading || !prompt.trim()) ? 0.6 : 1}}>
          {loading ? "⏳ 3 Agents Evaluate kar rahe hain..." : "🚀 Evaluate Karo (3 Agents)"}
        </button>
      </div>

      {/* Agent Cards */}
      {loading && (
        <div style={{textAlign:"center", padding:"30px 0"}}>
          <div style={{fontSize:32, marginBottom:12}}>
            {AGENTS.map(a => <span key={a.id} style={{margin:"0 6px"}}>{a.emoji}</span>)}
          </div>
          <div style={{fontFamily:"DM Mono,monospace", fontSize:13, color: dark?"#6b7280":"#9ca3af"}}>
            Agents kaam kar rahe hain...
          </div>
        </div>
      )}

      {results && (
        <div>
          <div style={{fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:14, color: dark?"#9ca3af":"#6b7280", marginBottom:12, textAlign:"center"}}>
            ✅ Evaluation Complete!
          </div>
          {AGENTS.map(agent => (
            <div key={agent.id} style={cardStyle(agent.color)}>
              <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:10}}>
                <span style={{fontSize:20}}>{agent.emoji}</span>
                <span style={{fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:14, color: agent.color}}>
                  {agent.name}
                </span>
              </div>
              <div style={{fontSize:13, color: dark?"#d1d5db":"#374151", lineHeight:1.8, whiteSpace:"pre-wrap", fontFamily:"DM Mono,monospace"}}>
                {results[agent.id]}
              </div>
            </div>
          ))}
          <button
            onClick={() => { setResults(null); setPrompt(""); }}
            style={{width:"100%", padding:"10px", borderRadius:10, border:`1px solid ${dark?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.1)"}`, background:"transparent", color: dark?"#6b7280":"#9ca3af", fontFamily:"DM Mono,monospace", fontSize:12, cursor:"pointer"}}>
            🔄 Nayi Evaluation Karo
          </button>
        </div>
      )}
    </div>
  );
}

// ========== MAIN APP ==========

// ========== FREEMIUM COMPONENTS ==========
function UpgradeModal({ onClose, onUpgrade }) {
  const [plan, setPlan] = useState("monthly");
  const [loading, setLoading] = useState(false);

  const PLANS = {
    monthly:  { price: 49,  label: "₹49",  name: "Monthly",   desc: "per month · sab features unlock", amount: 4900,  tag: null,           popular: false },
    halfyear: { price: 199, label: "₹199", name: "6 Months",  desc: "₹33/month · sab features unlock", amount: 19900, tag: "Save 32% 🔥",   popular: true  },
    yearly:   { price: 365, label: "₹365", name: "Yearly",    desc: "₹30/month · sab features unlock", amount: 36500, tag: "Best Value ⭐",  popular: false },
  };

  const handlePayment = () => {
    const selected = PLANS[plan];
    setLoading(true);
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_live_SatXJYBUsmghZo",
      amount: selected.amount,
      currency: "INR",
      name: "Prompt Paathshala",
      description: plan === "monthly" ? "Pro Monthly" : plan === "halfyear" ? "Pro 6 Months" : "Pro Yearly",
      handler: function(response) {
        onUpgrade(plan);
        setLoading(false);
      },
      theme: { color: "#6366f1" },
      modal: { ondismiss: () => setLoading(false) }
    };
    try {
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => { alert("Payment fail ho gayi. Dobara try karo."); setLoading(false); });
      rzp.open();
    } catch(e) {
      onUpgrade(plan);
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-emoji">🚀</div>
        <div className="modal-title">Pro mein Upgrade Karo!</div>
        <div className="modal-sub">Ek purchase mein saare premium features unlock! 🎉</div>
        <div className="modal-features">
          {[
            ["✅","Intermediate + Advanced lessons — 12 professions"],
            ["✅","Mistakes Guide — 8 common galtiyan + fixes"],
            ["✅","Try It Yourself — blank fill practice"],
            ["✅","Live AI Tester — unlimited responses"],
            ["✅","Quiz with AI evaluation"],
            ["✅","Kids Zone — Homework, Games, Science, Story"],
            ["✅","Career Explorer — AI se personal guidance"],
            ["✅","Saare future updates bhi included!"],
          ].map(([icon, text], i) => (
            <div className="modal-feature" key={i}><span>{icon}</span><span>{text}</span></div>
          ))}
        </div>
        <div className="plan-cards">
          {Object.entries(PLANS).map(([key, p]) => (
            <div key={key} className={"plan-card" + (plan===key?" selected":"")}
              style={{background: plan===key?"rgba(99,102,241,0.1)":"rgba(255,255,255,0.03)", position:"relative", paddingTop: p.tag ? "18px" : "14px"}}
              onClick={() => setPlan(key)}>
              {p.tag && <div className="plan-tag">{p.tag}</div>}
              <div className="plan-price">{p.label}</div>
              <div className="plan-name" style={{color: plan===key?"#a5b4fc":"#9ca3af"}}>{p.name}</div>
              <div className="plan-desc" style={{color:"#6b7280"}}>{p.desc}</div>
            </div>
          ))}
        </div>
        <button className="modal-cta" onClick={handlePayment} disabled={loading} style={{opacity:loading?0.7:1}}>
          {loading ? "⏳ Processing..." : `⚡ ${PLANS[plan].label} — ${PLANS[plan].name} Unlock Karo`}
        </button>
        <div className="razorpay-note" style={{color:"#6b7280"}}>
          <span>🔒</span><span>Secured by Razorpay · UPI · Card · NetBanking</span>
        </div>
        <div className="modal-free-note">No hidden charges · Cancel anytime</div>
      </div>
    </div>
  );
}

function LockedLesson({ data, onUpgrade }) {
  return (
    <div className="paywall-overlay">
      <div className="paywall-blur">
        <div className="lesson">
          <div className="lesson-num">{data.num}</div>
          <div className="lesson-title">{data.title}</div>
          <div className="lesson-desc">{data.desc}</div>
          <div className="prompt-box" style={{height: 80}} />
        </div>
      </div>
      <div className="paywall-badge">
        <div className="paywall-lock">🔒</div>
        <div className="paywall-title">{data.title}</div>
        <div className="paywall-price">₹49/month</div>
        <button className="paywall-unlock-btn" onClick={onUpgrade}>
          🚀 Pro mein Unlock Karo
        </button>
      </div>
    </div>
  );
}



// ========== FIREBASE CONFIG ==========
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCZbeEdS2Ykap8Dg5PrO_VFGOsxZ7rsNB0",
  authDomain: "prompt-paathshala.firebaseapp.com",
  projectId: "prompt-paathshala",
  storageBucket: "prompt-paathshala.firebasestorage.app",
  messagingSenderId: "819082767513",
  appId: "1:819082767513:web:9245a56be03bf5c56cdc08"
};

// Firebase Auth loader
let _fbInstance = null;

async function initFirebase() {
  if (_fbInstance) return _fbInstance;
  try {
    const { initializeApp, getApps } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js");
    const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
            GoogleAuthProvider, signInWithPopup, sendEmailVerification } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
    const app = getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApps()[0];
    _fbInstance = { auth: getAuth(app), createUserWithEmailAndPassword, signInWithEmailAndPassword,
                    GoogleAuthProvider, signInWithPopup, sendEmailVerification };
    return _fbInstance;
  } catch(e) {
    console.error("Firebase init error:", e);
    return null;
  }
}

// ========== AUTH SCREENS ==========
function AuthScreen({ dark, onLogin }) {
  const [tab, setTab] = useState("email");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [error, setError] = useState("");
  const [verifyMode, setVerifyMode] = useState(false);

  const isSignup = tab === "signup";

  const handleEmail = async () => {
    if (!email.includes("@")) { setError("Valid email daalo"); return; }
    if (pass.length < 6) { setError("Password min 6 characters ka hona chahiye"); return; }
    setLoading(true); setError("");
    try {
      const fb = await initFirebase();
      if (fb) {
        if (isSignup) {
          const result = await fb.createUserWithEmailAndPassword(fb.auth, email, pass);
          await fb.sendEmailVerification(result.user);
          await fb.auth.signOut();
          setVerifyMode(true);
          setLoading(false);
          return;
        } else {
          const result = await fb.signInWithEmailAndPassword(fb.auth, email, pass);
          if (!result.user.emailVerified) {
            await fb.sendEmailVerification(result.user);
            await fb.auth.signOut();
            setError("Email verify nahi hua! Verification email bheja gaya — inbox check karo.");
            setLoading(false);
            return;
          }
          onLogin(result.user);
        }
      } else {
        throw new Error("Firebase connect nahi ho pa raha. Internet check karo.");
      }
    } catch(e) {
      const msg = e.code === "auth/user-not-found" ? "Account nahi mila — Sign Up karo!" :
                  e.code === "auth/wrong-password" ? "Galat password!" :
                  e.code === "auth/invalid-credential" ? "Galat email ya password!" :
                  e.code === "auth/email-already-in-use" ? "Email registered hai — Login karo!" :
                  e.code === "auth/weak-password" ? "Password zyada strong banao!" :
                  e.message || "Error aaya. Dobara try karo.";
      setError(msg);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setGLoading(true); setError("");
    try {
      const fb = await initFirebase();
      if (fb) {
        const provider = new fb.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        const result = await fb.signInWithPopup(fb.auth, provider);
        onLogin(result.user);
      } else {
        throw new Error("Firebase connect nahi ho pa raha.");
      }
    } catch(e) {
      if (e.code !== "auth/popup-closed-by-user") {
        setError("Google login mein problem: " + (e.message || "Dobara try karo"));
      }
    }
    setGLoading(false);
  };

  if (verifyMode) {
    return (
      <div className="auth-overlay">
        <div className="auth-box">
          <div className="auth-logo">
            <div className="auth-logo-icon">🧠</div>
            <div className="auth-logo-title">Prompt Paathshala</div>
            <div className="auth-logo-sub">India ka AI Prompt Masterclass</div>
          </div>
          <div className="auth-card">
            <div style={{textAlign:"center", padding:"10px 0"}}>
              <div style={{fontSize:48, marginBottom:16}}>📧</div>
              <div style={{fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:18, color: dark?"#e8e8f0":"#111118", marginBottom:10}}>
                Email Verify Karo!
              </div>
              <div style={{fontSize:13, color: dark?"#9ca3af":"#6b7280", lineHeight:1.8, marginBottom:20}}>
                <strong style={{color:"#a5b4fc"}}>{email}</strong> pe verification email bheja gaya hai.<br/>
                Email kholo → Link pe click karo → Wapas aao → Login karo!
              </div>
              <div style={{background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.2)", borderRadius:10, padding:"12px", marginBottom:16, fontSize:12, color:"#9ca3af"}}>
                📬 Spam/Junk folder bhi check karo!
              </div>
              <button className="auth-btn" onClick={() => { setVerifyMode(false); setTab("email"); setError(""); }}>
                ✅ Email verify kar liya — Login karo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-overlay">
      <div className="auth-box">
        <div className="auth-logo">
          <div className="auth-logo-icon">🧠</div>
          <div className="auth-logo-title">Prompt Paathshala</div>
          <div className="auth-logo-sub">India ka AI Prompt Masterclass</div>
        </div>

        <div className="auth-card">
          <div style={{display:"flex", gap:6, marginBottom:20, background:"rgba(0,0,0,0.2)", borderRadius:12, padding:4}}>
            {[["email","🔑 Login"],["signup","📝 Sign Up"]].map(([t, label]) => (
              <button key={t} onClick={() => { setTab(t); setError(""); }}
                style={{flex:1, padding:"8px", borderRadius:9, border:"none",
                  background: tab===t ? "linear-gradient(135deg,#4f46e5,#7c3aed)" : "transparent",
                  color: tab===t ? "#fff" : "#6b7280",
                  fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:13, cursor:"pointer", transition:"all 0.2s"}}>
                {label}
              </button>
            ))}
          </div>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <button onClick={handleGoogle} disabled={gLoading}
            style={{width:"100%", padding:"11px", borderRadius:12, border:"1px solid rgba(255,255,255,0.15)",
              background:"rgba(255,255,255,0.06)", color: dark?"#e8e8f0":"#111118",
              fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:14, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:10,
              marginBottom:14, transition:"all 0.2s"}}>
            {gLoading ? "⏳ Google se login ho raha hai..." : <><span style={{fontSize:18}}>🔵</span> Google se Login karo</>}
          </button>

          <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:14}}>
            <div style={{flex:1, height:1, background:"rgba(255,255,255,0.08)"}}/>
            <span style={{fontSize:11, color:"#6b7280", fontFamily:"DM Mono,monospace"}}>ya email se</span>
            <div style={{flex:1, height:1, background:"rgba(255,255,255,0.08)"}}/>
          </div>

          <input className="auth-input" type="email" placeholder="Email address"
            value={email} style={{marginBottom:10}}
            onChange={e => { setEmail(e.target.value); setError(""); }} />

          <div style={{position:"relative", marginBottom:16}}>
            <input className="auth-input" type={showPass?"text":"password"}
              placeholder={isSignup ? "Password banao (min 6 characters)" : "Password"}
              value={pass}
              onChange={e => { setPass(e.target.value); setError(""); }} />
            <button onClick={() => setShowPass(s=>!s)}
              style={{position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                background:"none", border:"none", cursor:"pointer", fontSize:16, color:"#6b7280"}}>
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>

          <button className="auth-btn" onClick={handleEmail}
            disabled={loading || !email || pass.length < 6}>
            {loading ? "⏳ Please wait..." : isSignup ? "🚀 Account Banao" : "✅ Login Karo"}
          </button>
        </div>

        <div id="recaptcha-container"></div>
        <div style={{textAlign:"center", marginTop:14, fontSize:11, color: dark?"#4b5563":"#9ca3af", fontFamily:"DM Mono, monospace"}}>
          Login karke tum Privacy Policy aur Terms of Service accept karte ho
        </div>
      </div>
    </div>
  );
}

// ========== LEGAL PAGES ==========
function LegalTab({ dark }) {
  const [doc, setDoc] = useState("privacy");

  const DOCS = {
    privacy: {
      title: "Privacy Policy",
      icon: "🔒",
      content: (
        <>
          <h1>Privacy Policy</h1>
          <span className="legal-date">Last Updated: April 3, 2026 | Effective: April 3, 2026</span>
          <div className="highlight">
            This Privacy Policy applies to Prompt Paathshala ("we", "us", "our") — an AI prompt engineering education platform operated by Aditya Chauhan, Uttar Pradesh, India. We comply with India's <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong>.
          </div>
          <h2>1. Information We Collect</h2>
          <p>We collect only what is necessary to provide our services:</p>
          <ul>
            <li><strong>Account Data:</strong> Name, email address when you sign up</li>
            <li><strong>Payment Data:</strong> Processed securely by Razorpay — we never store card/UPI details</li>
            <li><strong>Usage Data:</strong> Pages visited, features used (for improving the app)</li>
            <li><strong>Device Data:</strong> Browser type, device type, IP address</li>
            <li><strong>AI Prompts:</strong> Prompts you type in Live AI Tester — sent to Anthropic/Google API for processing</li>
          </ul>
          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To provide and improve our educational services</li>
            <li>To process payments and manage subscriptions</li>
            <li>To send important service updates (not spam)</li>
            <li>To analyze usage patterns and improve content</li>
          </ul>
          <h2>3. Data Sharing</h2>
          <p>We do NOT sell your personal data. We share data only with:</p>
          <ul>
            <li><strong>Razorpay:</strong> For payment processing (their <a href="https://razorpay.com/privacy/" target="_blank">Privacy Policy</a>)</li>
            <li><strong>Anthropic/Google:</strong> AI prompts for processing (no personal data sent)</li>
            <li><strong>Vercel:</strong> Hosting infrastructure</li>
          </ul>
          <h2>4. DPDP Act 2023 Compliance (India)</h2>
          <ul>
            <li>We obtain your explicit consent before collecting personal data</li>
            <li>You have the right to access, correct, and delete your data</li>
            <li>You can withdraw consent at any time by emailing us</li>
            <li>We appoint a Data Protection Officer as required by law</li>
            <li>Data breaches will be reported to DPBI within 72 hours</li>
          </ul>
          <h2>5. Data Retention</h2>
          <p>We retain your data for as long as your account is active, or as needed to provide services. You can request deletion anytime.</p>
          <h2>6. Children's Privacy</h2>
          <p>Our Kids Zone is designed for children aged 8-12. We do NOT knowingly collect personal data from children under 13 without verifiable parental consent, in compliance with DPDP Act 2023.</p>
          <h2>7. Security</h2>
          <p>We use industry-standard encryption (HTTPS/TLS) to protect your data. Payment data is handled entirely by Razorpay's PCI-DSS compliant infrastructure.</p>
          <h2>8. Your Rights</h2>
          <ul>
            <li>Right to access your personal data</li>
            <li>Right to correct inaccurate data</li>
            <li>Right to delete your data ("right to be forgotten")</li>
            <li>Right to withdraw consent</li>
            <li>Right to file grievance with Data Protection Board of India</li>
          </ul>
          <h2>9. Contact Us</h2>
          <p>For privacy concerns, data requests, or grievances:<br/>
          📧 Email: promptpaathshala@gmail.com<br/>
          📍 Address: Uttar Pradesh, India</p>
        </>
      )
    },
    terms: {
      title: "Terms of Service",
      icon: "📋",
      content: (
        <>
          <h1>Terms of Service</h1>
          <span className="legal-date">Last Updated: April 3, 2026 | Effective: April 3, 2026</span>
          <div className="highlight">
            By using Prompt Paathshala, you agree to these Terms. Please read carefully. These terms are governed by the laws of India.
          </div>
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using Prompt Paathshala ("Service"), you agree to be bound by these Terms of Service. If you disagree, please do not use our Service.</p>
          <h2>2. Description of Service</h2>
          <p>Prompt Paathshala is an educational platform that teaches AI prompt engineering through lessons, quizzes, career guidance, and interactive AI tools. We offer both free and paid (Pro) tiers.</p>
          <h2>3. User Accounts</h2>
          <ul>
            <li>You must provide accurate information when creating an account</li>
            <li>You are responsible for maintaining account security</li>
            <li>You must be 13 years or older to create an account</li>
            <li>Children under 13 may use Kids Zone only with parental supervision</li>
          </ul>
          <h2>4. Pro Subscription & Payments</h2>
          <ul>
            <li><strong>Monthly Plan:</strong> ₹49/month, auto-renews unless cancelled</li>
            <li><strong>6 Month Plan:</strong> ₹199 for 6 months (₹33/month)</li>
            <li><strong>Yearly Plan:</strong> ₹365/year (₹30/month)</li>
            <li>All payments processed securely via Razorpay</li>
            <li>Prices may change with 30 days advance notice</li>
            <li>No refunds except as stated in our Refund Policy</li>
          </ul>
          <h2>5. Acceptable Use</h2>
          <p>You agree NOT to:</p>
          <ul>
            <li>Use the Service for illegal purposes</li>
            <li>Share your Pro account credentials with others</li>
            <li>Attempt to reverse engineer or copy our content</li>
            <li>Use AI features to generate harmful, misleading, or illegal content</li>
            <li>Scrape or systematically download our content</li>
          </ul>
          <h2>6. AI-Generated Content Disclaimer</h2>
          <p>Our Live AI Tester and guidance features use third-party AI APIs (Anthropic Claude / Google Gemini). AI responses are for educational purposes only and may not always be accurate. Do not rely on AI-generated content for critical decisions without independent verification.</p>
          <h2>7. Intellectual Property</h2>
          <p>All content on Prompt Paathshala (lessons, prompts, curriculum) is owned by Aditya Chauhan / Prompt Paathshala. You may not reproduce, distribute, or create derivative works without written permission.</p>
          <h2>8. Limitation of Liability</h2>
          <p>Prompt Paathshala is provided "as is" without warranties. We are not liable for any indirect, incidental, or consequential damages arising from use of our Service.</p>
          <h2>9. Termination</h2>
          <p>We reserve the right to terminate accounts that violate these Terms. You may cancel your account at any time.</p>
          <h2>10. Governing Law</h2>
          <p>These Terms are governed by the laws of India. Disputes shall be subject to the jurisdiction of courts in Uttar Pradesh, India.</p>
          <h2>11. Contact</h2>
          <p>📧 Email: promptpaathshala@gmail.com</p>
        </>
      )
    },
    refund: {
      title: "Refund Policy",
      icon: "💰",
      content: (
        <>
          <h1>Refund Policy</h1>
          <span className="legal-date">Last Updated: April 3, 2026</span>
          <div className="highlight">
            We want you to be completely satisfied with Prompt Paathshala Pro. Our refund policy is designed to be fair to both users and our small team.
          </div>
          <h2>1. Monthly Subscription (₹49/month)</h2>
          <ul>
            <li><strong>7-day refund window:</strong> Full refund if requested within 7 days of first purchase</li>
            <li><strong>After 7 days:</strong> No refund for the current billing period</li>
            <li><strong>Cancellation:</strong> Cancel anytime — no charges from next billing cycle</li>
            <li>Cancellation takes effect at end of current billing period</li>
          </ul>
          <h2>2. 6 Month Plan (₹199) & Yearly Plan (₹365)</h2>
          <ul>
            <li><strong>7-day refund window:</strong> Full refund if requested within 7 days of purchase</li>
            <li><strong>After 7 days:</strong> No refund (you retain access for the full period)</li>
          </ul>
          <h2>3. Eligible Refund Situations</h2>
          <ul>
            <li>✅ Technical issues preventing access (not resolved within 48 hours)</li>
            <li>✅ Duplicate payment charged by error</li>
            <li>✅ Service not available in your region</li>
            <li>✅ Request within 7-day window</li>
          </ul>
          <h2>4. Non-Refundable Situations</h2>
          <ul>
            <li>❌ Change of mind after 7 days</li>
            <li>❌ Partial usage of subscription period</li>
            <li>❌ Account suspended due to Terms violation</li>
            <li>❌ Forgetting to cancel before renewal</li>
          </ul>
          <h2>5. How to Request a Refund</h2>
          <p>Email us at <strong>promptpaathshala@gmail.com</strong> with:</p>
          <ul>
            <li>Your registered email address</li>
            <li>Razorpay Payment ID (from payment confirmation)</li>
            <li>Reason for refund</li>
          </ul>
          <p>We process refunds within <strong>5-7 business days</strong>. Amount credited back to original payment method.</p>
          <h2>6. Razorpay</h2>
          <p>Refunds are processed through Razorpay. Bank processing time may add 3-5 additional days. For payment disputes, you may also contact Razorpay support directly.</p>
          <h2>7. Contact</h2>
          <p>📧 Email: promptpaathshala@gmail.com<br/>
          ⏰ Response time: Within 24 hours</p>
        </>
      )
    },
    cookies: {
      title: "Cookie Policy",
      icon: "🍪",
      content: (
        <>
          <h1>Cookie Policy</h1>
          <span className="legal-date">Last Updated: April 3, 2026</span>
          <div className="highlight">
            Prompt Paathshala uses minimal cookies to provide a better experience. We do NOT use advertising cookies or sell cookie data.
          </div>
          <h2>1. What Are Cookies?</h2>
          <p>Cookies are small text files stored on your device when you visit our website. They help us remember your preferences and provide core functionality.</p>
          <h2>2. Cookies We Use</h2>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for login and payment processing (cannot be disabled)</li>
            <li><strong>Preference Cookies:</strong> Remember your dark/light mode preference</li>
            <li><strong>Session Cookies:</strong> Keep you logged in during your visit (deleted when browser closes)</li>
          </ul>
          <h2>3. Cookies We Do NOT Use</h2>
          <ul>
            <li>❌ Advertising / tracking cookies</li>
            <li>❌ Third-party marketing cookies</li>
            <li>❌ Social media tracking pixels</li>
            <li>❌ Cross-site tracking cookies</li>
          </ul>
          <h2>4. Third-Party Cookies</h2>
          <ul>
            <li><strong>Razorpay:</strong> Payment processing cookies (required for transactions)</li>
            <li><strong>Vercel:</strong> Performance and analytics (anonymized)</li>
          </ul>
          <h2>5. Managing Cookies</h2>
          <p>You can control cookies through your browser settings. Note that disabling essential cookies may affect app functionality (e.g., staying logged in, payment processing).</p>
          <h2>6. Local Storage</h2>
          <p>We use browser Local Storage to save your Pro status and preferences locally on your device. This data never leaves your device except for payment verification.</p>
          <h2>7. DPDP Act Compliance</h2>
          <p>Under India's DPDP Act 2023, we obtain consent before storing non-essential cookies. You can withdraw consent by clearing your browser cookies and local storage.</p>
          <h2>8. Contact</h2>
          <p>📧 Email: promptpaathshala@gmail.com</p>
        </>
      )
    }
  };

  const current = DOCS[doc];

  return (
    <div className="legal-wrapper">
      <div className="legal-hero">
        <div style={{fontSize: 36, marginBottom: 8}}>⚖️</div>
        <div className="legal-hero-title">Legal & Privacy</div>
        <div className="legal-hero-sub">DPDP Act 2023 Compliant · Razorpay Approved · India</div>
      </div>

      <div className="legal-tabs">
        {Object.entries(DOCS).map(([key, d]) => (
          <button key={key} className={"legal-tab" + (doc===key?" active":"")} onClick={() => setDoc(key)}>
            {d.icon} {d.title}
          </button>
        ))}
      </div>

      <div className="legal-doc" style={{background: dark?"rgba(255,255,255,0.02)":"#fff", color: dark?"#9ca3af":"#374151"}}>
        {current.content}
      </div>

      <div className="legal-footer">
        Questions? Email us at promptpaathshala@gmail.com · Prompt Paathshala © 2026
      </div>
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(true);
  const [tab, setTab] = useState("learn");
  const [level, setLevel] = useState("Beginner");
  const [prof, setProf] = useState("student");
  const [isPro, setIsPro] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(true);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  const data = CURRICULUM[prof];
  const levelKey = level.toLowerCase();
  const lessons = data[levelKey] || [];
  const progress = Math.round(((LEVELS.indexOf(level) + 1) / 3) * 100);
  const isLocked = !isPro && (level === "Intermediate" || level === "Advanced");

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsPro(false);
    setShowAuth(true);
  };

  const handleUpgrade = (planType) => {
    if (!user) { setShowUpgrade(false); setShowAuth(true); return; }
    setIsPro(true);
    setShowUpgrade(false);
    alert("🎉 Pro unlock ho gaya! Saare premium features ab available hain — Lessons, Mistakes Guide, Kids Zone sab kuch!");
  };

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsPro(false);
  };

  return (
    <>
      <style>{getStyles(dark)}</style>
      {showAuth && <AuthScreen dark={dark} onLogin={handleLogin} onSkip={() => setShowAuth(false)} />}
      {showAuth && <AuthScreen dark={dark} onLogin={handleLogin} />}
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} onUpgrade={(p) => handleUpgrade(p)} />}
      <div className="app">
        <div className="bg-grid" />
        <div className="bg-glow" />

        <header className="header">
          <button className="theme-btn" onClick={() => setDark(d => !d)} title="Theme toggle">
            {dark ? "☀️" : "🌙"}
          </button>
          <div className="badge">🧠 India ka #1 AI Prompt Course</div>
          <div className="title">Prompt Paathshala</div>
          <div className="subtitle">// Beginner → Advanced · Har Profession ke liye</div>
          <div style={{marginTop: 10, display:'flex', gap: 8, justifyContent:'center', alignItems:'center', flexWrap:'wrap'}}>
            {user ? (
              <div className="user-chip">
                <div className="user-avatar">{user.phoneNumber ? user.phoneNumber.slice(-2) : "U"}</div>
                <span className="user-phone">{user.phoneNumber || "User"}</span>
                <button className="logout-btn" onClick={handleLogout} title="Logout">✕</button>
              </div>
            ) : (
              <button onClick={() => setShowAuth(true)} style={{background:'rgba(99,102,241,0.15)', color:'#a5b4fc', border:'1px solid rgba(99,102,241,0.3)', fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:12, padding:'5px 14px', borderRadius:20, cursor:'pointer'}}>
                👤 Login / Sign Up
              </button>
            )}
            {isPro
              ? <span style={{background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'#fff', fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:12, padding:'4px 14px', borderRadius:20}}>⚡ PRO</span>
              : <button onClick={() => user ? setShowUpgrade(true) : setShowAuth(true)} style={{background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'#fff', border:'none', fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:12, padding:'5px 16px', borderRadius:20, cursor:'pointer'}}>🚀 Upgrade — ₹49/month se shuru</button>
            }
          </div>
        </header>

        <div className="nav-tabs">
          <div className={`nav-tab ${tab==='learn'?'active':''}`} onClick={()=>setTab('learn')}>📖 Learn</div>
          <div className={`nav-tab ${tab==='kids'?'active':''}`} onClick={()=>setTab('kids')} style={{background: tab==='kids' ? 'linear-gradient(135deg,#7c3aed,#0891b2)' : undefined, borderColor: tab==='kids' ? 'transparent' : undefined}}>🧒 Kids Zone</div>
          <div className={`nav-tab ${tab==='reallife'?'active':''}`} onClick={()=>setTab('reallife')} style={{background: tab==='reallife' ? 'linear-gradient(135deg,#ea580c,#ca8a04)' : undefined, borderColor: tab==='reallife' ? 'transparent' : undefined}}>🏡 Real Life</div>
          <div className={`nav-tab ${tab==='career'?'active':''}`} onClick={()=>setTab('career')} style={{background: tab==='career' ? 'linear-gradient(135deg,#1e3a5f,#312e81)' : undefined, borderColor: tab==='career' ? 'transparent' : undefined}}>🎓 Career</div>
          <div className={`nav-tab ${tab==='mistakes'?'active':''}`} onClick={()=>{ if(!isPro){setShowUpgrade(true);} else {setTab('mistakes');} }} style={{background: tab==='mistakes' ? 'linear-gradient(135deg,#ef4444,#f97316)' : undefined, borderColor: tab==='mistakes' ? 'transparent' : undefined, position:'relative'}}>
            🚫 Mistakes {!isPro && <span style={{fontSize:9, background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'#fff', padding:'1px 5px', borderRadius:6, marginLeft:4, fontFamily:'Syne,sans-serif', fontWeight:800}}>PRO</span>}
          </div>
          <div className={`nav-tab ${tab==='evaluator'?'active':''}`} onClick={()=>setTab('evaluator')} style={{background: tab==='evaluator' ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : undefined, borderColor: tab==='evaluator' ? 'transparent' : undefined}}>
            🧪 Evaluator
          </div>
          <div className={`nav-tab ${tab==='quiz'?'active':''}`} onClick={()=>setTab('quiz')}>🧠 Quiz</div>
          <div className={`nav-tab ${tab==='legal'?'active':''}`} onClick={()=>setTab('legal')} style={{background: tab==='legal' ? 'linear-gradient(135deg,#1e293b,#374151)' : undefined, borderColor: tab==='legal' ? 'transparent' : undefined}}>⚖️ Legal</div>
        </div>

        <main className="main">
          {tab === "learn" && (
            <>
              <div className="stats-row">
                {[["12","Professions"],["3","Skill Levels"],["30+","Lessons"],["50+","Prompts"]].map(([n,l]) => (
                  <div key={l} className="stat-chip"><div className="stat-num">{n}</div><div className="stat-label">{l}</div></div>
                ))}
              </div>

              {/* Framework */}
              <div className="card" style={{marginBottom:22}}>
                <div className="card-header">
                  <span className="card-header-icon">🏗️</span>
                  <div>
                    <div className="card-header-title">Universal Prompt Formula (RCTFC)</div>
                    <div className="card-header-sub">Har prompt is formula se likho</div>
                  </div>
                </div>
                <div className="card-body">
                  <div style={{background:'rgba(99,102,241,0.06)', border:'1px solid rgba(99,102,241,0.15)', borderRadius:10, padding:16}}>
                    <div className="framework-title">✦ The RCTFC Framework</div>
                    {FRAMEWORK.map((f,i) => (
                      <div className="framework-item" key={i}>
                        <span className="framework-key">{f.key}</span>
                        <span>{f.val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="tip-box" style={{marginTop:14}}>
                    <span style={{fontSize:15, flexShrink:0}}>⚡</span>
                    <span className="tip-text">Yahi formula AI experts use karte hain — jitna zyada context, utna better output.</span>
                  </div>
                </div>
              </div>

              {/* Profession */}
              <div className="section-label">Select Your Profession</div>
              <div className="profession-grid">
                {PROFESSIONS.map(p => (
                  <div key={p.id} className={`prof-card ${prof===p.id?'active':''}`} onClick={()=>setProf(p.id)}>
                    <div className="prof-icon">{p.icon}</div>
                    <div className="prof-name">{p.name}</div>
                  </div>
                ))}
              </div>

              {/* Level */}
              <div className="section-label">Select Level</div>
              <div className="level-tabs">
                {LEVELS.map(l => (
                  <button key={l} className={`level-tab ${level===l?'active':''}`} onClick={()=>setLevel(l)}>
                    {l==="Beginner"?"🟢 ":l==="Intermediate"?"🟡 ":"🔴 "}{l}
                  </button>
                ))}
              </div>

              {/* Progress */}
              <div className="progress-label"><span>Learning Progress</span><span>{progress}% complete</span></div>
              <div className="progress-bar"><div className="progress-fill" style={{width:`${progress}%`}} /></div>

              {/* Lessons */}
              {lessons.length > 0 ? (
                <div className="card" key={`${prof}-${level}`}>
                  <div className="card-header">
                    <span className="card-header-icon">{data.icon}</span>
                    <div>
                      <div className="card-header-title">{data.label} Track</div>
                      <div className="card-header-sub">{data.desc}</div>
                    </div>
                    <span className={`level-badge ${levelKey}`}>{level}
                      {isLocked ? <span className="pro-badge">PRO</span> : <span className="free-badge">FREE</span>}
                    </span>
                  </div>
                  <div className="card-body">
                    {isLocked ? (
                      <>
                        <div style={{textAlign:'center', padding:'16px 0 8px', marginBottom:16, background:'rgba(99,102,241,0.06)', borderRadius:12, border:'1px solid rgba(99,102,241,0.15)'}}>
                          <div style={{fontSize:28, marginBottom:6}}>🔒</div>
                          <div style={{fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:15, color: dark?'#e8e8f0':'#111118', marginBottom:6}}>{level} lessons — Pro mein unlock karo</div>
                          <div style={{fontSize:12, color: dark?'#9ca3af':'#6b7280', marginBottom:14}}>Sirf ₹49/month mein sab {level} lessons milenge</div>
                          <button onClick={() => setShowUpgrade(true)} style={{background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'#fff', border:'none', fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:14, padding:'10px 24px', borderRadius:10, cursor:'pointer', boxShadow:'0 4px 16px rgba(79,70,229,0.3)'}}>
                            🚀 Unlock {level} — ₹49/month
                          </button>
                        </div>
                        {lessons.map((l, i) => (
                          <div key={i}>
                            <LockedLesson data={l} onUpgrade={() => setShowUpgrade(true)} />
                            {i < lessons.length-1 && <div className="divider" />}
                          </div>
                        ))}
                      </>
                    ) : (
                      lessons.map((l, i) => (
                        <div key={i}>
                          <Lesson data={l} dark={dark} />
                          {i < lessons.length-1 && <div className="divider" />}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="card">
                  <div className="card-body" style={{textAlign:'center', padding:'40px', color: dark?'#6b7280':'#9ca3af'}}>
                    <div style={{fontSize:40, marginBottom:12}}>🚧</div>
                    <div style={{fontFamily:'Syne,sans-serif', fontSize:16, marginBottom:8}}>Coming Soon</div>
                    <div style={{fontSize:13}}>Baaki levels try karo!</div>
                  </div>
                </div>
              )}

              <div style={{textAlign:'center', marginTop:28, color: dark?'#374151':'#9ca3af', fontFamily:'DM Mono,monospace', fontSize:12}}>
                ▶ Live Test button dabao → real AI response dekho ✦
              </div>
            </>
          )}

          {tab === "kids" && (
            <KidsTab dark={dark} isPro={isPro} onUpgrade={() => setShowUpgrade(true)} />
          )}

          {tab === "reallife" && (
            <RealLifeTab dark={dark} />
          )}

          {tab === "evaluator" && (
            <PromptEvaluatorTab dark={dark} />
          )}
          {tab === "mistakes" && (
            isPro ? <MistakesTab dark={dark} /> : (
              <div style={{textAlign:'center', padding:'48px 20px', background:'rgba(99,102,241,0.06)', borderRadius:16, border:'2px dashed rgba(99,102,241,0.25)'}}>
                <div style={{fontSize:48, marginBottom:14}}>🔒</div>
                <div style={{fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:18, color: dark?'#e8e8f0':'#111118', marginBottom:8}}>Mistakes Guide — PRO Feature</div>
                <div style={{fontSize:14, color: dark?'#9ca3af':'#6b7280', marginBottom:20, lineHeight:1.7}}>
                  8 common prompt mistakes aur unka solution<br/>sirf Pro users ke liye available hai!
                </div>
                <button onClick={()=>setShowUpgrade(true)} style={{background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'#fff', border:'none', fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:15, padding:'12px 28px', borderRadius:12, cursor:'pointer', boxShadow:'0 4px 16px rgba(79,70,229,0.35)'}}>
                  🚀 Pro Unlock Karo
                </button>
              </div>
            )
          )}

          {tab === "career" && (
            <CareerGuidanceTab dark={dark} />
          )}

          {tab === "quiz" && (
            <>
              <div className="card">
                <div className="card-header">
                  <span className="card-header-icon">🧠</span>
                  <div>
                    <div className="card-header-title">Prompt Writing Quiz</div>
                    <div className="card-header-sub">Scenario padho → Apna prompt likho → AI evaluate karega</div>
                  </div>
                </div>
                <div className="card-body">
                  <QuizTab dark={dark} />
                </div>
              </div>
            </>
          )}

          {tab === "legal" && (
            <LegalTab dark={dark} />
          )}
        </main>

        {/* Footer */}
        <footer style={{textAlign:'center', padding:'20px 16px', borderTop:`1px solid ${dark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.06)'}`, marginTop:8}}>
          <div style={{fontSize:12, color:'#4b5563', fontFamily:'DM Mono, monospace', marginBottom:10}}>
            Prompt Paathshala © 2026 · Made with ❤️ in India
          </div>
          <div style={{display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap'}}>
            {[["Privacy Policy","privacy"],["Terms of Service","terms"],["Refund Policy","refund"],["Cookie Policy","cookies"]].map(([label, key]) => (
              <button key={key} onClick={() => { setTab("legal"); }} style={{background:'none', border:'none', color:'#6b7280', fontSize:11, cursor:'pointer', fontFamily:'DM Mono, monospace', textDecoration:'underline'}}>{label}</button>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}
