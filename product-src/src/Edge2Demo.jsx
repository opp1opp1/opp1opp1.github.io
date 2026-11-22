import React from 'react';

export const EDGE2_DUR = 13;

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ramp = (t, a, b) => clamp((t - a) / (b - a));
const TYPED = 'PO-12345';
const ROWS_T = [[1.0, 2.2], [3.4, 4.6]];

// 示意:程式碼、單號與查詢結果皆為範例
export function renderEdge2(root, t) {
  const $ = s => root.querySelector(s);

  // 左:我不會這樣做(打 ✕)
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
  $('.e2-ok').style.opacity = ramp(t, 6.2, 6.7);

  // 右:輸入單號 → AI → SKILL → 資料庫(權限控制)→ 異常原因
  const n = Math.round(TYPED.length * ramp(t, 1.2, 2.6));
  $('.e2-typed').textContent = TYPED.slice(0, n);
  const parts = root.querySelectorAll('.e2-flow > *');
  const at = [3.2, 3.5, 3.8, 4.1, 4.4];
  parts.forEach((p, i) => { p.style.opacity = ramp(t, at[i], at[i] + 0.3); });
  const db = $('.e2-flow .db');
  db.classList.toggle('hot', t >= 4.8 && t < 5.8);
  $('.e2-wait').style.opacity = t >= 4.8 && t < 5.8 ? 1 : 0;
  const res = $('.e2-result');
  const ro = ramp(t, 5.8, 6.3);
  res.style.opacity = ro;
  res.style.transform = `translateY(${(1 - ro) * 10}px)`;
}

export default function Edge2Demo() {
  return (
    <div className="e2-grid" data-demo="edge2">
      <div className="e2p" role="img" aria-label="示意:API 金鑰寫在前端、把 .env 上傳到 Git,都是我不會做的事">
        <h3>守住底線</h3>
        <p className="e2-sub">這些事,我不會做</p>
        <div className="e2-rows">
          <div className="e2r"><div><code>const API_KEY = "sk-xxxx"</code><small>金鑰寫在前端程式碼</small></div><span className="x">✕</span></div>
          <div className="e2r"><div><code>git add .env &amp;&amp; git push</code><small>把 .env 上傳到 Git</small></div><span className="x">✕</span></div>
        </div>
        <p className="e2-ok">✓ 金鑰放在後端與環境變數,不進版控</p>
      </div>

      <div className="e2p" role="img" aria-label="示意:輸入單號,AI 透過 SKILL 在權限控制下查詢資料庫,直接看到異常原因">
        <h3>更快交付</h3>
        <p className="e2-sub">寫了 SKILL,讓 AI 調用資料庫,並控制權限</p>
        <div className="e2-input"><span>輸入單號</span><b className="e2-typed" /><i className="caret" /></div>
        <div className="e2-flow">
          <span className="fn">AI</span><i>→</i><span className="fn">SKILL</span><i>→</i><span className="fn db">資料庫<small>權限控制</small></span>
        </div>
        <p className="e2-wait">查詢中…</p>
        <div className="e2-result"><small>異常原因(示意)</small>簽核停在第 2 關,等待主管回覆</div>
      </div>
    </div>
  );
}
