import React from 'react';

export const TESTS = [
  ['建立請購單', 820],
  ['送出簽核流程', 1340],
  ['供應商回覆報價', 1105],
  ['驗收並入庫', 960],
  ['付款狀態更新', 1480],
];
export const E2E_DUR = 8.5;

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ramp = (t, a, b) => clamp((t - a) / (b - a));

export function renderE2E(root, t) {
  root.querySelectorAll('.t-row').forEach((r, i) => {
    const s = 0.6 + i * 1.2;
    const state = t < s ? 'idle' : t < s + 0.8 ? 'run' : 'pass';
    const icon = r.querySelector('.t-icon');
    r.className = 't-row ' + (state === 'idle' ? '' : state);
    icon.textContent = state === 'idle' ? '○' : state === 'run' ? '◐' : '✓';
    icon.style.transform = state === 'run' ? `rotate(${(t - s) * 720}deg)`
      : state === 'pass' ? `scale(${1 + 0.8 * (1 - ramp(t, s + 0.8, s + 1.1))})` : '';
    r.querySelector('.t-ms').textContent = state === 'pass' ? TESTS[i][1] + ' ms' : '';
  });
  root.querySelector('.t-summary').style.opacity = ramp(t, 6.9, 7.3);
}

// 示意:AI 撰寫並執行的 E2E 測試(測試名稱為範例)
export default function E2EDemo() {
  return (
    <div className="win term" data-demo="e2e" role="img" aria-label="終端機示意畫面:五個 E2E 測試依序執行並全部通過">
      <div className="win-bar"><i /><i /><i /><span>AI 撰寫 · AI 執行</span></div>
      <div className="t-cmd"><span className="prompt">$</span> npx playwright test</div>
      <ul className="t-list">
        {TESTS.map(([name]) => (
          <li className="t-row" key={name}>
            <span className="t-icon">○</span><span className="t-name">{name}</span><span className="t-ms" />
          </li>
        ))}
      </ul>
      <div className="t-summary">5 passed (12.4s)</div>
    </div>
  );
}
