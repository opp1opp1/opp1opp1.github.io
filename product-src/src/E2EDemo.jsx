import React, { useLayoutEffect, useRef } from 'react';
import { gsap, playWhenVisible, reduceMotion } from './motion.js';

const TESTS = [
  ['建立請購單', 820],
  ['送出簽核流程', 1340],
  ['供應商回覆報價', 1105],
  ['驗收並入庫', 960],
  ['付款狀態更新', 1480],
];

// 示意:AI 撰寫並執行的 E2E 測試(測試名稱為範例)
export default function E2EDemo() {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (reduceMotion()) return;
    let stop;
    const q = gsap.utils.selector(root);
    const ctx = gsap.context(() => {
      const rows = q('.t-row');
      const summary = q('.t-summary')[0];
      const reset = () => {
        rows.forEach(r => { r.className = 't-row'; r.querySelector('.t-icon').textContent = '○'; r.querySelector('.t-ms').textContent = ''; });
        summary.style.opacity = 0;
      };
      reset();

      const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 2.5 });
      tl.add(reset).to({}, { duration: .6 });
      rows.forEach((r, i) => {
        tl.add(() => { r.className = 't-row run'; r.querySelector('.t-icon').textContent = '◐'; })
          .to(r.querySelector('.t-icon'), { rotation: 360, duration: .5, ease: 'none', transformOrigin: '50% 55%' })
          .add(() => {
            r.className = 't-row pass'; r.querySelector('.t-icon').textContent = '✓'; r.querySelector('.t-ms').textContent = TESTS[i][1] + ' ms';
            gsap.fromTo(r.querySelector('.t-icon'), { scale: 1.8 }, { scale: 1, duration: .3, ease: 'back.out(3)' });
          });
      });
      tl.to(summary, { opacity: 1, duration: .4 }).to({}, { duration: 2.2 });

      stop = playWhenVisible(root.current, tl);
    }, root);
    return () => { if (stop) stop(); ctx.revert(); };
  }, []);

  return (
    <div className="win term" ref={root} role="img" aria-label="終端機示意畫面:五個 E2E 測試依序執行並全部通過">
      <div className="win-bar"><i /><i /><i /><span>AI 撰寫 · AI 執行</span></div>
      <div className="t-cmd"><span className="prompt">$</span> npx playwright test</div>
      <ul className="t-list">
        {TESTS.map(([name, ms]) => (
          <li className="t-row pass" key={name}>
            <span className="t-icon">✓</span><span className="t-name">{name}</span><span className="t-ms">{ms} ms</span>
          </li>
        ))}
      </ul>
      <div className="t-summary">5 passed (12.4s)</div>
    </div>
  );
}
