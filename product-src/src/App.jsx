import React, { useLayoutEffect, useRef, useState, useEffect, useCallback } from 'react';
import { gsap, reduceMotion } from './motion.js';
import { AppWindow, Server, Database, Cloud, Network, ShieldCheck } from 'lucide-react';
import CaseDemo, { renderCase, CASE_DUR } from './CaseDemo.jsx';
import Case2Demo, { renderCase2, CASE2_DUR } from './Case2Demo.jsx';
import Case3Demo, { renderCase3, CASE3_DUR } from './Case3Demo.jsx';
import Case4Demo, { renderCase4, CASE4_DUR } from './Case4Demo.jsx';
import { Edge1Demo, SecDemo, AiDemo, renderG1, renderSec, renderAi, G1_DUR, SEC_DUR, AI_DUR } from './EdgeDemos.jsx';
import FastStage from './FastStage.tsx';
import SkillStage from './SkillStage.tsx';
import DebugStage from './DebugStage.tsx';
import E2eStage from './E2eStage.tsx';

// 圖示一律來自同一套圖示庫(lucide),統一尺寸與線寬
const CORE = [['前端', AppWindow], ['後端', Server]];
const EXT = [['資料庫', Database], ['雲端', Cloud], ['網路', Network], ['資安', ShieldCheck]];
const STACK = ['.NET', 'ASP.NET MVC', 'jQuery', 'Oracle', 'Python', 'Vue.js', 'LangChain'];
const RELEASES = [
  ['v3.0', 'MIS 系統開發工程師', '群創光電 · 2023/8 – 現在 · 2025/12 起轉向物流領域'],
  ['v2.0', '資訊管理碩士(加密貨幣研究)', '國立中正大學 · 2021 – 2023 · 國際會議與期刊發表'],
  ['v1.0', '資訊管理學士(數位內容科技組)', '國立彰化師範大學 · 2016 – 2021'],
];

// 影片章節:id 對應 <section data-scene>,start 為開始秒數,dur 為長度
// 只需要設定每章的長度,開始時間自動累加
const DEFS = [
  ['hero', '開場', 9], ['merge', '融合', 8],
  ['edge', '優勢', 11], ['sec', '資安', 11], ['debug', '驗證', 15], ['e2e', 'E2E', 21], ['skill', 'SKILL', 15], ['fast', '交付', 22], ['ai', 'AI', 13],
  ['user', '使用者視角', 8], ['case', '案例一', 31], ['case2', '案例二', 30],
  ['case3', '案例三', 30], ['case4', '案例四', 29], ['stack', '延展', 9], ['notes', '版本', 6], ['cta', '結尾', 4],
];
const FAST_IDX = DEFS.findIndex(d => d[0] === 'fast');
const SKILL_IDX = DEFS.findIndex(d => d[0] === 'skill');
const DEBUG_IDX = DEFS.findIndex(d => d[0] === 'debug');
const E2E_IDX = DEFS.findIndex(d => d[0] === 'e2e');
let acc = 0;
const SCENES = DEFS.map(([id, label, dur]) => { const s = { id, label, start: acc, dur }; acc += dur; return s; });

function buildMaster(root) {
  const q = s => root.querySelector(s);
  const qa = s => root.querySelectorAll(s);
  const master = gsap.timeline({ paused: true });

  // 每個章節是一條子時間軸:淡入、演出、淡出
  const scene = (id, build) => {
    const sc = SCENES.find(s => s.id === id);
    const el = q(`[data-scene="${id}"]`);
    const tl = gsap.timeline();
    if (sc.start > 0) tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0);
    build(tl);
    tl.to({}, { duration: sc.dur }, 0); // 確保長度
    if (id !== 'cta') tl.to(el, { autoAlpha: 0, duration: 0.5 }, sc.dur - 0.5);
    master.add(tl, sc.start);
  };
  const stagger = (tl, sel, at, each = 0.12, y = 24) =>
    tl.fromTo(qa(sel), { y, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: each }, at);

  scene('hero', tl => {
    tl.from(qa('.split'), { yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: 0.15 }, 0.2);
    stagger(tl, '.hero .fx', 0.9, 0.15, 20);
    tl.fromTo(qa('.si-core'), { y: 24, opacity: 0, scale: 0.7 }, { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(2.2)', stagger: 0.2 }, 2.8)
      .fromTo('.si-extra', { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.6 }, 3.5)
      .fromTo(qa('.si-ext'), { y: 18, opacity: 0, scale: 0.7 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2.2)', stagger: 0.18 }, 3.8)
      .fromTo('.si-note', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7 }, 5.0);
  });

  scene('merge', tl => {
    tl.fromTo('.w-left', { xPercent: -120 }, { xPercent: -28, duration: 1.4, ease: 'power2.out' }, 0.3)
      .fromTo('.w-right', { xPercent: 120 }, { xPercent: 28, duration: 1.4, ease: 'power2.out' }, 0.3)
      .to('.w-left, .w-right', { xPercent: 0, scale: 0.92, duration: 1, ease: 'power2.inOut' }, 2)
      .to('.w-left, .w-right', { opacity: 0, filter: 'blur(14px)', duration: 0.6 }, 3.1)
      .fromTo('.w-center', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.6)' }, 3.2)
      .to('.merge-caption', { opacity: 1, y: -10, duration: 0.6 }, 4);
  });

  // 「我的優勢」的四頁小動畫:標題浮現 → 動畫依時間播放
  const demoScene = (id, sel, render, dur, delay = 1.0) => scene(id, tl => {
    stagger(tl, `[data-scene="${id}"] .head`, 0.2, 0.15);
    const el = q(sel);
    const o = { t: 0 };
    render(el, 0);
    tl.fromTo(`[data-scene="${id}"] .gx`, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, 0.8)
      .to(o, { t: dur, duration: dur, ease: 'none', onUpdate: () => render(el, o.t) }, delay);
  });
  demoScene('edge', '[data-demo="edge1"]', renderG1, G1_DUR);
  demoScene('sec', '[data-demo="sec"]', renderSec, SEC_DUR);
  scene('e2e', tl => {
    stagger(tl, '[data-scene="e2e"] .head', 0.2, 0.15);
    tl.fromTo('[data-scene="e2e"] .gx', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, 0.6);
  });
  scene('skill', tl => {
    stagger(tl, '[data-scene="skill"] .head', 0.2, 0.15);
    tl.fromTo('[data-scene="skill"] .gx', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, 0.6);
  });
  scene('fast', tl => {
    stagger(tl, '[data-scene="fast"] .head', 0.2, 0.15);
    tl.fromTo('[data-scene="fast"] .gx', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, 0.6);
  });
  demoScene('ai', '[data-demo="ai"]', renderAi, AI_DUR);

  scene('debug', tl => {
    stagger(tl, '[data-scene="debug"] .head', 0.2, 0.15);
    tl.fromTo('[data-scene="debug"] .gx', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, 0.6);
  });
  scene('skill', tl => {
    stagger(tl, '[data-scene="skill"] .head', 0.2, 0.15);
    tl.fromTo('[data-scene="skill"] .gx', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, 0.6);
  });
  scene('fast', tl => {
    stagger(tl, '[data-scene="fast"] .head', 0.2, 0.15);
    tl.fromTo('[data-scene="fast"] .gx', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, 0.6);
  });
  demoScene('ai', '[data-demo="ai"]', renderAi, AI_DUR);

  scene('user', tl => {
    stagger(tl, '[data-scene="user"] .head', 0.2, 0.15);
    stagger(tl, '.roles li', 1.4, 0.18, 14);
    tl.fromTo('.vs', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, 3);
  });

  scene('case', tl => {
    stagger(tl, '[data-scene="case"] .head', 0.2, 0.15);
    const el = q('[data-demo="case"]');
    const o = { t: 0 };
    renderCase(el, 0);
    tl.fromTo('[data-scene="case"] .chat', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, 0.8)
      .to(o, { t: CASE_DUR, duration: CASE_DUR, ease: 'none', onUpdate: () => renderCase(el, o.t) }, 0.8);
  });

  scene('case2', tl => {
    stagger(tl, '[data-scene="case2"] .head', 0.2, 0.15);
    const el = q('[data-demo="case2"]');
    const o = { t: 0 };
    renderCase2(el, 0);
    tl.fromTo('[data-scene="case2"] .chat', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, 0.8)
      .to(o, { t: CASE2_DUR, duration: CASE2_DUR, ease: 'none', onUpdate: () => renderCase2(el, o.t) }, 0.8);
  });

  scene('case3', tl => {
    stagger(tl, '[data-scene="case3"] .head', 0.2, 0.15);
    const el = q('[data-demo="case3"]');
    const o = { t: 0 };
    renderCase3(el, 0);
    tl.fromTo('[data-scene="case3"] .c3-stage', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, 0.8)
      .to(o, { t: CASE3_DUR, duration: CASE3_DUR, ease: 'none', onUpdate: () => renderCase3(el, o.t) }, 0.8);
  });

  scene('case4', tl => {
    stagger(tl, '[data-scene="case4"] .head', 0.2, 0.15);
    const el = q('[data-demo="case4"]');
    const o = { t: 0 };
    renderCase4(el, 0);
    tl.fromTo('[data-scene="case4"] .c4-stage', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, 0.8)
      .to(o, { t: CASE4_DUR, duration: CASE4_DUR, ease: 'none', onUpdate: () => renderCase4(el, o.t) }, 0.8);
  });

  scene('stack', tl => {
    tl.fromTo('.ba-chips li', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.5 }, 0.3)
      .to('.ba-chips li', { opacity: 0, filter: 'blur(10px)', scale: 0.6, y: -30, stagger: { each: 0.08, from: 'random' }, duration: 0.6 }, 2.6)
      .to('.l-before', { opacity: 0, duration: 0.3 }, 2.6)
      .to('.l-after', { opacity: 1, duration: 0.3 }, 3.2)
      .fromTo('.ba-after', { opacity: 0, scale: 0.85, filter: 'blur(14px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.9 }, 3.3)
      .to('.ba-caption', { opacity: 1, y: -10, duration: 0.6 }, 4.6);
  });

  scene('notes', tl => {
    stagger(tl, '[data-scene="notes"] .head', 0.2, 0.15);
    stagger(tl, '.rel li', 0.8, 0.3);
  });

  scene('cta', tl => {
    stagger(tl, '[data-scene="cta"] .fx', 0.3, 0.3, 30);
  });

  return master;
}

export default function App() {
  const root = useRef(null);
  const master = useRef(null);
  const idxRef = useRef(0);
  const [slide, setSlide] = useState(0);
  const [run, setRun] = useState(0); // 每次換頁遞增,讓即時播放的畫面從頭開始
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const m = buildMaster(root.current);
      master.current = m;
      m.eventCallback('onUpdate', () => {
        const tt = m.time();
        let i = 0;
        SCENES.forEach((sc, k) => { if (tt >= sc.start - 0.001) i = k; });
        if (i !== idxRef.current) { idxRef.current = i; setSlide(i); setRun(n => n + 1); }
      });
      m.eventCallback('onComplete', () => { setPlaying(false); setEnded(true); });
      if (!reduceMotion()) { m.play(); setPlaying(true); }
    }, root);
    return () => ctx.revert();
  }, []);

  const toggle = useCallback(() => {
    const m = master.current;
    if (!m) return;
    if (m.progress() >= 1) { m.restart(); setEnded(false); setPlaying(true); }
    else if (m.paused()) { m.play(); setPlaying(true); }
    else { m.pause(); setPlaying(false); }
  }, []);

  const seek = useCallback((sec, keepState = false) => {
    const m = master.current;
    m.time(Math.min(Math.max(sec, 0), m.duration()));
    setRun(n => n + 1);
    setEnded(m.progress() >= 1);
    if (!keepState) { m.play(); setPlaying(true); }
  }, []);

  // 投影片換頁:下一頁跳到下一章開頭;上一頁在章節剛開始時回到前一章,否則回到本章開頭
  const next = useCallback(() => {
    const m = master.current;
    const i = Math.min(idxRef.current + 1, SCENES.length - 1);
    if (idxRef.current === SCENES.length - 1) { m.time(m.duration()); setEnded(true); setPlaying(false); m.pause(); return; }
    seek(SCENES[i].start);
  }, [seek]);
  const prev = useCallback(() => {
    const m = master.current;
    const sc = SCENES[idxRef.current];
    const i = m.time() - sc.start < 1.5 ? Math.max(idxRef.current - 1, 0) : idxRef.current;
    seek(SCENES[i].start);
  }, [seek]);

  useEffect(() => {
    const key = e => {
      const tag = e.target.tagName;
      if (e.code === 'Space' && tag !== 'BUTTON' && tag !== 'A') { e.preventDefault(); toggle(); }
      if (e.code === 'ArrowRight') next();
      if (e.code === 'ArrowLeft') prev();
    };
    addEventListener('keydown', key);
    return () => { removeEventListener('keydown', key); };
  }, [toggle, next, prev]);

  const onStageClick = e => { if (!e.target.closest('a,button')) toggle(); };

  return (
    <div ref={root}>
      <header className="nav">
        <button className="brand" onClick={() => seek(0)}>謝博旭</button>
        <nav>
          {SCENES.filter(s => ['edge', 'debug', 'case', 'case2', 'case3', 'case4', 'stack'].includes(s.id)).map(s => (
            <button key={s.id} onClick={() => seek(s.start)}>{s.label}</button>
          ))}
          <a href="../">履歷版 →</a>
        </nav>
      </header>

      <main className="stage" onClick={onStageClick}>
        <section className="scene hero" data-scene="hero">
          <h1 className="hero-title">
            <span className="line"><span className="split">傳統的穩</span></span>
            <span className="line"><span className="split grad">現代的快</span></span>
          </h1>
          <p className="hero-sub fx">一位懂企業怎麼運作,也懂怎麼用 AI 的工程師。</p>
          <p className="hero-name fx">謝博旭 Bosh Shieh · 全端工程師</p>
          <div className="si-row" aria-label="全端涵蓋的範圍">
            {CORE.map(([label, Icon]) => (
              <div className="si si-core" key={label}><Icon size={26} strokeWidth={1.6} aria-hidden="true" /><span>{label}</span></div>
            ))}
            <div className="si-extra">
              <span className="si-tag">延伸範圍</span>
              {EXT.map(([label, Icon]) => (
                <div className="si si-ext" key={label}><Icon size={26} strokeWidth={1.6} aria-hidden="true" /><span>{label}</span></div>
              ))}
            </div>
          </div>
          <p className="si-note">核心是前端與後端;資料庫、雲端、網路與資安這些延伸範圍,需要時我也能自己處理。</p>
        </section>

        <section className="scene merge" data-scene="merge">
          <div className="merge-stage">
            <div className="word w-left">傳統</div>
            <div className="word w-right">現代</div>
            <div className="word w-center">融合</div>
            <p className="merge-caption">不是二選一,是兩邊都有。</p>
          </div>
        </section>

        <section className="scene" data-scene="edge">
          <div className="in">
            <p className="eyebrow head">我的優勢</p>
            <h2 className="head">知道系統不是一個人的事</h2>
            <p className="band-lead head">在企業裡開發系統,每一關都有人、有規範。我知道該找誰、照什麼流程走,讓系統不只做得出來,還能安全上線。</p>
            <div className="gx"><Edge1Demo /></div>
          </div>
        </section>

        <section className="scene" data-scene="sec">
          <div className="in">
            <p className="eyebrow head">我的優勢</p>
            <h2 className="head">知道什麼該守住</h2>
            <p className="band-lead head">哪些資料不該送出去、哪些權限不能開,讓我在享受 AI 速度的同時,也能守住企業的底線。</p>
            <div className="gx"><SecDemo /></div>
          </div>
        </section>

        <section className="scene" data-scene="debug">
          <div className="in">
            <p className="eyebrow head">我的優勢</p>
            <h2 className="head">出問題,自己查得到</h2>
            <p className="band-lead head">看 Log、F12、Postman,一步步縮小範圍,找到真正的原因。</p>
            <div className="gx fs-wrap">{slide === DEBUG_IDX && <DebugStage key={run} />}</div>
          </div>
        </section>

        <section className="scene" data-scene="e2e">
          <div className="in">
            <p className="eyebrow head">我的優勢</p>
            <h2 className="head">測試全部通過,不代表沒問題</h2>
            <p className="band-lead head">測試全過、上線卻出問題,這種事很常見。所以我讓 AI 實際把程式跑起來、取得登入狀態,操作它剛改的部分。</p>
            <div className="gx fs-wrap">{slide === E2E_IDX && <E2eStage key={run} />}</div>
          </div>
        </section>

        <section className="scene" data-scene="skill">
          <div className="in">
            <p className="eyebrow head">我的優勢</p>
            <h2 className="head">把查詢做成有護欄的 SKILL</h2>
            <p className="band-lead head">我與 AI 一起寫出這個 SKILL,並在寫的時候就設好界線:查詢直接執行,新增與修改要經過同意,其他指令直接過濾掉,而且 AI 用的是權限較低的專用帳號。</p>
            <div className="gx fs-wrap">{slide === SKILL_IDX && <SkillStage key={run} />}</div>
          </div>
        </section>

        <section className="scene" data-scene="fast">
          <div className="in">
            <p className="eyebrow head">我的優勢</p>
            <h2 className="head">貼上原話,AI 直接查</h2>
            <p className="band-lead head">有了這個 SKILL,把使用者的原話貼給 AI,它就能在界線內直接查出狀況。</p>
            <div className="gx fs-wrap">{slide === FAST_IDX && <FastStage key={run} />}</div>
          </div>
        </section>

        <section className="scene" data-scene="ai">
          <div className="in">
            <p className="eyebrow head">我的優勢</p>
            <h2 className="head">懂得使用 AI</h2>
            <p className="band-lead head">AI 是加速器,不是拐杖。我負責拆解需求、給足脈絡、審查與把關,讓 AI 去做重複又費時的部分。</p>
            <div className="gx"><AiDemo /></div>
          </div>
        </section>

        <section className="scene user" data-scene="user">
          <div className="in user-inner">
            <p className="eyebrow head">核心功能</p>
            <h2 className="big head">站在使用者的角度,<br />一起解決問題。</h2>
            <p className="band-lead head">擔任 SRM 工程師時,我偶爾要暫代客服,同時接到各部門的需求與問題:</p>
            <ul className="roles"><li>採購</li><li>物流</li><li>物管</li><li>會計</li><li>……</li></ul>
            <div className="vs">
              <p className="tag">我的做法</p>
              <p className="flow"><span>先弄懂對方真正想完成什麼</span><i aria-hidden="true">→</i><span className="grad">一起找出根本的解法</span></p>
            </div>
          </div>
        </section>

        <section className="scene" data-scene="case">
          <div className="in">
            <p className="eyebrow head">實際案例 一</p>
            <h2 className="head">一張發票,背後的真正問題。</h2>
            <CaseDemo />
          </div>
        </section>

        <section className="scene" data-scene="case2">
          <div className="in">
            <p className="eyebrow head">實際案例 二</p>
            <h2 className="head">地圖不見了,原因在 F12 裡。</h2>
            <Case2Demo />
          </div>
        </section>

        <section className="scene" data-scene="case3">
          <div className="in">
            <p className="eyebrow head">實際案例 三</p>
            <h2 className="head">每天的工時回報,交給 AI。</h2>
            <Case3Demo />
          </div>
        </section>

        <section className="scene" data-scene="case4">
          <div className="in">
            <p className="eyebrow head">實際案例 四</p>
            <h2 className="head">一個大需求,七天重構五次。</h2>
            <Case4Demo />
          </div>
        </section>

        <section className="scene ba" data-scene="stack">
          <div className="ba-stage">
            <p className="ba-label"><span className="l-before">BEFORE</span><span className="l-after">AFTER</span></p>
            <ul className="ba-chips" aria-label="過去累積的技術">{STACK.map(s => <li key={s}>{s}</li>)}</ul>
            <div className="ba-after">
              <p className="ba-big grad">任何你需要的技術</p>
              <p className="ba-with">WITH&nbsp;AI</p>
            </div>
            <p className="ba-caption">技術棧是起點,不是邊界。</p>
          </div>
        </section>

        <section className="scene" data-scene="notes">
          <div className="in">
            <h2 className="head">版本紀錄</h2>
            <ol className="rel">
              {RELEASES.map(([v, t, d]) => (
                <li key={v}><span className="ver">{v}</span><div><h3>{t}</h3><p>{d}</p></div></li>
              ))}
            </ol>
          </div>
        </section>

        <section className="scene cta" data-scene="cta">
          <h2 className="big fx">想一起把問題<br />真正解決嗎?</h2>
          <p className="fx"><a className="btn" href="https://github.com/opp1opp1">在 GitHub 找我</a></p>
          <p className="fx foot">© {new Date().getFullYear()} 謝博旭 Bosh Shieh · <a href="../">查看完整履歷</a></p>
        </section>
      </main>

      <div className="player" role="group" aria-label="投影片控制">
        <button className="pbtn ghost" onClick={prev} aria-label="上一頁">‹</button>
        <button className="pbtn" onClick={toggle} aria-label={ended ? '重新播放' : playing ? '暫停' : '播放'}>
          {ended ? '↺' : playing ? '❚❚' : '▶'}
        </button>
        <button className="pbtn ghost" onClick={next} aria-label="下一頁">›</button>
        <div className="dots" role="tablist" aria-label="頁面">
          {SCENES.map((sc, i) => (
            <button key={sc.id} role="tab" aria-selected={i === slide} aria-label={sc.label} title={sc.label}
              className={'dotn' + (i === slide ? ' on' : '')} onClick={() => seek(sc.start)} />
          ))}
        </div>
      </div>
    </div>
  );
}
