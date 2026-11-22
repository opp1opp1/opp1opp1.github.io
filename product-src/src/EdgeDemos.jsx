import React from 'react';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ramp = (t, a, b) => clamp((t - a) / (b - a));

// ---------- 1. 企業脈絡:系統不是一個人的事 ----------
export const G1_DUR = 8;
const GATES = ['開通防火牆', '聯絡 DBA', '資安弱掃', '部署到 IIS / K8S'];
const GATE_T = [1.4, 2.4, 3.4, 4.4];

export function renderG1(root, t) {
  const $ = s => root.querySelector(s);
  const top = $('.g1-top');
  top.style.opacity = ramp(t, 0.6, 1.0);
  root.querySelectorAll('.g1-gate').forEach((g, i) => {
    const a = GATE_T[i];
    const o = ramp(t, a, a + 0.4);
    g.style.opacity = o;
    g.style.transform = `translateY(${(1 - o) * 14}px)`;
    const done = t >= a + 1.0;
    g.classList.toggle('done', done);
    g.querySelector('.dot').textContent = done ? '✓' : '';
  });
  root.querySelectorAll('.g1-arrow').forEach((a, i) => { a.style.opacity = ramp(t, (i ? GATE_T[i - 1] : 0.8) + 0.3, (i ? GATE_T[i - 1] : 0.8) + 0.6); });
  const end = $('.g1-end');
  const eo = ramp(t, 6.4, 6.9);
  end.style.opacity = eo; end.style.transform = `scale(${0.9 + 0.1 * eo})`;
}

export function Edge1Demo() {
  return (
    <div className="g1" data-demo="edge1" role="img" aria-label="示意:功能完成後,還要開通防火牆、聯絡 DBA、通過資安弱掃、部署到 IIS 或 K8S,才能安全上線">
      <div className="g1-top">功能開發完成</div>
      <span className="g1-arrow">→</span>
      {GATES.map((g, i) => (
        <React.Fragment key={g}>
          <div className="g1-gate"><span className="dot" /><b>{g}</b></div>
          {i < GATES.length - 1 && <span className="g1-arrow">→</span>}
        </React.Fragment>
      ))}
      <span className="g1-arrow">→</span>
      <div className="g1-end">安全上線 ✓</div>
    </div>
  );
}

// ---------- 2. 資安意識:這些事我不會做 ----------
export const SEC_DUR = 8;
const ROWS_T = [[1.0, 2.2], [3.4, 4.6]];

export function renderSec(root, t) {
  root.querySelectorAll('.e2r').forEach((r, i) => {
    const [a, x] = ROWS_T[i];
    const o = ramp(t, a, a + 0.4);
    r.style.opacity = o;
    r.style.transform = `translateX(${(1 - o) * -14}px)`;
    const stamp = r.querySelector('.x');
    const k = ramp(t, x, x + 0.25);
    stamp.style.opacity = k;
    stamp.style.transform = `scale(${2.2 - 1.2 * k}) rotate(${(1 - k) * -20}deg)`;
    r.classList.toggle('struck', t >= x + 0.2);
  });
  root.querySelector('.e2-ok').style.opacity = ramp(t, 6.2, 6.7);
}

export function SecDemo() {
  return (
    <div className="e2p wide" data-demo="sec" role="img" aria-label="示意:API 金鑰寫在前端、把 .env 上傳到 Git,都是我不會做的事">
      <p className="e2-sub">這些事,我不會做</p>
      <div className="e2-rows">
        <div className="e2r"><div><code>const API_KEY = "sk-xxxx"</code><small>金鑰寫在前端程式碼</small></div><span className="x">✕</span></div>
        <div className="e2r"><div><code>git add .env &amp;&amp; git push</code><small>把 .env 上傳到 Git</small></div><span className="x">✕</span></div>
      </div>
      <p className="e2-ok">✓ 金鑰放在後端與環境變數,不進版控</p>
    </div>
  );
}

// ---------- 5. 懂得使用 AI:方向盤在我手上 ----------
export const AI_DUR = 9.5;
const STEPS_T = [1.0, 2.2, 3.4, 4.8, 6.0, 7.2];

export function renderAi(root, t) {
  const $ = s => root.querySelector(s);
  const nodes = root.querySelectorAll('.g5n');
  nodes.forEach((n, i) => {
    let on = false;
    STEPS_T.forEach((s, k) => { if (k % 3 === i && t >= s && t < s + 1.1) on = true; });
    const seen = STEPS_T.some((s, k) => k % 3 === i && t >= s);
    n.classList.toggle('on', on);
    n.style.opacity = seen ? 1 : 0.35;
  });
  root.querySelectorAll('.g5-arrow').forEach((a, i) => {
    let lit = false;
    STEPS_T.forEach((s, k) => { if (k % 3 === i + 1 && t >= s && t < s + 0.9) lit = true; });
    a.style.opacity = lit ? 1 : 0.3;
  });
  $('.g5-back').style.opacity = ramp(t, 4.2, 4.7);
  $('.g5-final').style.opacity = ramp(t, 8.4, 8.9);
}

export function AiDemo() {
  return (
    <div className="g5" data-demo="ai" role="img" aria-label="示意:我拆解需求並給足脈絡,AI 實作並寫測試,我審查驗證把關,反覆迭代">
      <div className="g5-loop">
        <div className="g5n"><small>我</small>拆解需求、給足脈絡</div>
        <span className="g5-arrow">→</span>
        <div className="g5n ai"><small>AI</small>實作、寫測試</div>
        <span className="g5-arrow">→</span>
        <div className="g5n"><small>我</small>審查、驗證、把關</div>
      </div>
      <p className="g5-back">↺ 反覆迭代</p>
      <p className="g5-final">方向盤在我手上,AI 負責加速。</p>
    </div>
  );
}
