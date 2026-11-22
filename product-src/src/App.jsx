import React, { useLayoutEffect, useRef, useEffect } from 'react';
import { gsap, reduceMotion } from './motion.js';
import PostmanDemo from './PostmanDemo.jsx';
import E2EDemo from './E2EDemo.jsx';

const ADVANTAGES = [
  ['01 · 企業脈絡', '懂企業內部怎麼運作', '採購、驗收、招標、付款,這些流程為什麼長這樣,我都待在第一線看過、改過。需求還沒說完,我大概就知道背後的原因。'],
  ['02 · 資安意識', '知道什麼該守住', '哪些資料不該送出去、哪些權限不能開,這些常識讓我在享受 AI 速度的同時,也能守住企業的底線。'],
  ['03 · 除錯與驗證', '出問題,自己查得到', '看 Log、F12 開發者工具、Postman 逐步縮小範圍。用 AI 開發,也請 AI 寫測試、指示它跑 E2E 測試,用結果說話,而不是憑感覺。'],
  ['04 · 交付效率', '更快把問題解決', '善用 AI 提高需求交付與問題處理的效率,把省下來的時間,拿去思考真正值得解決的問題。'],
];

const STACK = ['.NET', 'ASP.NET MVC', 'jQuery', 'Oracle', 'Python', 'Vue.js', 'LangChain'];

const RELEASES = [
  ['v3.0', 'MIS 系統開發工程師', '群創光電 · 2023/8 – 現在 · 2025/12 起轉向物流領域'],
  ['v2.0', '資訊管理碩士(加密貨幣研究)', '國立中正大學 · 2021 – 2023 · 國際會議與期刊發表'],
  ['v1.0', '資訊管理學士(數位內容科技組)', '國立彰化師範大學 · 2016 – 2021'],
];

export default function App() {
  const root = useRef(null);

  useEffect(() => {
    const glow = root.current.querySelector('.glow');
    const move = e => { glow.style.setProperty('--x', e.clientX + 'px'); glow.style.setProperty('--y', e.clientY + 'px'); };
    addEventListener('pointermove', move);
    return () => removeEventListener('pointermove', move);
  }, []);

  useLayoutEffect(() => {
    if (reduceMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from('.split', { yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: .15 });
      gsap.from('.hero .reveal', { y: 20, opacity: 0, duration: .9, ease: 'power3.out', stagger: .12, delay: .5 });

      gsap.set('.w-left', { xPercent: -120 });
      gsap.set('.w-right', { xPercent: 120 });
      gsap.timeline({ scrollTrigger: { trigger: '.merge', start: 'top top', end: '+=140%', scrub: .6, pin: true } })
        .to('.w-left', { xPercent: -28, duration: 1 }, 0)
        .to('.w-right', { xPercent: 28, duration: 1 }, 0)
        .to('.w-left, .w-right', { xPercent: 0, scale: .9, duration: 1 })
        .to('.w-left, .w-right', { opacity: 0, filter: 'blur(14px)', duration: .6 })
        .fromTo('.w-center', { opacity: 0, scale: .7 }, { opacity: 1, scale: 1, duration: .8 }, '<')
        .to('.merge-caption', { opacity: 1, y: -10, duration: .5 });

      gsap.set('.ba-chips li', { opacity: 0, y: 20 });
      gsap.timeline({ scrollTrigger: { trigger: '.ba', start: 'top top', end: '+=130%', scrub: .6, pin: true } })
        .to('.ba-chips li', { opacity: 1, y: 0, stagger: .08, duration: .4 })
        .to({}, { duration: .5 })
        .to('.ba-chips li', { opacity: 0, filter: 'blur(10px)', scale: .6, y: -30, stagger: { each: .06, from: 'random' }, duration: .5 })
        .to('.l-before', { opacity: 0, duration: .3 }, '<')
        .to('.l-after', { opacity: 1, duration: .3 }, '<+=.3')
        .fromTo('.ba-after', { opacity: 0, scale: .85, filter: 'blur(14px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: .8 }, '<')
        .to('.ba-caption', { opacity: 1, y: -10, duration: .5 });

      gsap.utils.toArray('main section:not(.hero) .reveal').forEach(el => {
        gsap.from(el, { y: 40, opacity: 0, duration: .9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root}>
      <div className="glow" aria-hidden="true" />

      <header className="nav">
        <a className="brand" href="#top">謝博旭</a>
        <nav>
          <a href="#edge">優勢</a>
          <a href="#debug">驗證</a>
          <a href="#user">使用者視角</a>
          <a href="#stack">延展</a>
          <a href="../">履歷版 →</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <p className="eyebrow reveal">Introducing</p>
          <h1 className="hero-title">
            <span className="line"><span className="split">傳統的穩</span></span>
            <span className="line"><span className="split grad">現代的快</span></span>
          </h1>
          <p className="hero-sub reveal">一位懂企業怎麼運作,也懂怎麼用 AI 的工程師。</p>
          <p className="hero-name reveal">謝博旭 Bosh Shieh · 全端工程師</p>
          <div className="scroll-hint reveal" aria-hidden="true">向下捲動 ↓</div>
        </section>

        <section className="merge" id="edge">
          <div className="merge-stage">
            <div className="word w-left">傳統</div>
            <div className="word w-right">現代</div>
            <div className="word w-center">融合</div>
            <p className="merge-caption">不是二選一,是兩邊都有。</p>
          </div>
        </section>

        <section className="compare band">
          <h2 className="reveal">我的優勢</h2>
          <p className="band-lead reveal">不只會寫程式,更懂程式是為了誰而寫。</p>
          <div className="cards">
            {ADVANTAGES.map(([tag, title, text]) => (
              <article className="pcard reveal" key={tag}>
                <p className="tag">{tag}</p><h3>{title}</h3><p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="debug band" id="debug">
          <p className="eyebrow reveal">除錯與驗證</p>
          <h2 className="reveal">問題要查得到,<br />結果要驗得過。</h2>
          <p className="band-lead reveal">出錯時用工具一步步縮小範圍;交給 AI 的工作,也用自動化測試確認它真的做對。</p>
          <div className="demos">
            <div className="demo reveal"><PostmanDemo /><p className="demo-cap">用 API 工具重現問題,看回應定位原因</p></div>
            <div className="demo reveal"><E2EDemo /><p className="demo-cap">請 AI 寫測試、跑 E2E,用綠燈驗證</p></div>
          </div>
        </section>

        <section className="user" id="user">
          <div className="user-inner">
            <p className="eyebrow reveal">核心功能</p>
            <h2 className="big reveal">站在使用者的角度,<br />一起解決問題。</h2>
            <p className="band-lead reveal">擔任 SRM 工程師時,我偶爾要暫代客服,同時接到來自各個部門的需求與問題:</p>
            <ul className="roles reveal"><li>採購</li><li>物流</li><li>物管</li><li>會計</li><li>……</li></ul>
            <div className="vs reveal">
              <p className="tag">我的做法</p>
              <p className="flow"><span>先弄懂對方真正想完成什麼</span><i aria-hidden="true">→</i><span className="grad">一起找出根本的解法</span></p>
            </div>
          </div>
        </section>

        <section className="ba" id="stack">
          <div className="ba-stage">
            <p className="ba-label"><span className="l-before">BEFORE</span><span className="l-after">AFTER</span></p>
            <ul className="ba-chips" aria-label="過去累積的技術">
              {STACK.map(s => <li key={s}>{s}</li>)}
            </ul>
            <div className="ba-after">
              <p className="ba-big grad">任何你需要的技術</p>
              <p className="ba-with">WITH&nbsp;AI</p>
            </div>
            <p className="ba-caption">技術棧是起點,不是邊界。</p>
          </div>
        </section>

        <section className="notes">
          <h2 className="reveal">版本紀錄</h2>
          <ol className="rel">
            {RELEASES.map(([v, t, d]) => (
              <li className="reveal" key={v}><span className="ver">{v}</span><div><h3>{t}</h3><p>{d}</p></div></li>
            ))}
          </ol>
        </section>

        <section className="cta">
          <h2 className="big reveal">想一起把問題<br />真正解決嗎?</h2>
          <p className="reveal"><a className="btn" href="https://github.com/opp1opp1">在 GitHub 找我</a></p>
        </section>
      </main>

      <footer>© {new Date().getFullYear()} 謝博旭 Bosh Shieh · <a href="../">查看完整履歷</a></footer>
    </div>
  );
}
