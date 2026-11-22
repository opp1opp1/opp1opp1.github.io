import React from 'react';

export const CASE4_DUR = 27;

// 示意內容:功能名稱為範例,非真實系統
const FEATURES = [
  ['批次匯入', 8.0],
  ['條件篩選', 8.7],
  ['匯出報表', 9.4],
  ['異動紀錄', 10.1],
];
const ITER_T = [19.0, 20.2, 21.4, 22.6, 23.8];
const METER = [0.15, 0.3, 0.55, 0.75, 1];
const CAPS4 = [
  [1.0, '使用者想要新系統多一個很大的模組。PM 產出實作計畫,交給我實作。'],
  [4.4, '做出來之後,和使用者想的有很大的出入。'],
  [7.8, '了解原因:舊系統有的功能,這次的新系統都沒有,滿足不了使用者實務上的需求。'],
  [13.6, '於是換我去跟使用者訪談,理解真正的需求。'],
  [15.8, '他有想法,就一起規劃怎麼改;沒有想法,就先做出來給他看。'],
  [18.6, '這個模組在短短 7 天內重構了 5 次,'],
  [25.0, '才讓使用者滿意。後續仍有調整,但已經是在現有的基礎上。'],
];

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ramp = (t, a, b) => clamp((t - a) / (b - a));
const vis = (t, a, b) => Math.min(ramp(t, a, a + 0.35), 1 - ramp(t, b - 0.3, b));

export function renderCase4(root, t) {
  const $ = s => root.querySelector(s);
  const views = [['.k1', 0.8, 7.5], ['.k2', 7.6, 13.3], ['.k3', 13.4, 18.3], ['.k4', 18.4, 1e9]];
  views.forEach(([s, a, b]) => {
    const el = $(s), o = vis(t, a, b);
    el.style.opacity = o;
    el.style.display = o <= 0 ? 'none' : '';
  });

  // 1. 計畫 → 實作 → 落差
  const nodeT = [1.0, 2.6, 4.4], arrT = [2.0, 3.6];
  root.querySelectorAll('.k1 .kn').forEach((n, i) => {
    const o = ramp(t, nodeT[i], nodeT[i] + 0.4);
    n.style.opacity = o;
    n.style.transform = `translateY(${(1 - o) * 14}px)`;
  });
  root.querySelectorAll('.k1 .ka').forEach((a, i) => { a.style.opacity = ramp(t, arrT[i], arrT[i] + 0.3); });
  const bad = $('.k1 .kn.bad');
  const on = t >= 4.8;
  bad.classList.toggle('on', on);
  if (on && t < 5.5) bad.style.transform = `translateX(${Math.sin((t - 4.8) * 40) * 6 * (1 - ramp(t, 4.8, 5.5))}px)`;

  // 2. 舊系統有、新系統沒有
  root.querySelectorAll('.k2 .kr:not(.kh)').forEach((r, i) => { r.style.opacity = ramp(t, FEATURES[i][1], FEATURES[i][1] + 0.35); });
  $('.k2 .k-note').style.opacity = ramp(t, 11.0, 11.4);

  // 3. 換我去訪談
  $('.k3 .k-center').style.opacity = ramp(t, 13.6, 14.0);
  const b = root.querySelectorAll('.k3 .kb');
  b[0].style.opacity = ramp(t, 14.8, 15.2); b[0].style.transform = `translateY(${(1 - ramp(t, 14.8, 15.2)) * 12}px)`;
  b[1].style.opacity = ramp(t, 15.8, 16.2); b[1].style.transform = `translateY(${(1 - ramp(t, 15.8, 16.2)) * 12}px)`;

  // 4. 七天、五次重構,滿意度逐步上升
  root.querySelectorAll('.k4 .ki').forEach((c, i) => {
    const o = ramp(t, ITER_T[i], ITER_T[i] + 0.4);
    c.style.opacity = 0.25 + 0.75 * o;
    c.classList.toggle('done', t >= ITER_T[i] + 0.2);
  });
  let fill = 0;
  ITER_T.forEach((st, i) => {
    if (t < st + 0.2) return;
    const prev = i ? METER[i - 1] : 0;
    fill = prev + (METER[i] - prev) * ramp(t, st + 0.2, st + 1.0);
  });
  $('.k4 .meter i').style.width = fill * 100 + '%';
  $('.k4 .k-ok').style.opacity = ramp(t, 25.0, 25.4);
  $('.k4 .k-days').style.opacity = ramp(t, 18.6, 19.0);

  const cap = $('.case-cap');
  let idx = -1;
  CAPS4.forEach(([s], i) => { if (t >= s) idx = i; });
  // 最後兩句銜接成一句話
  cap.textContent = idx < 0 ? '' : idx === 6 ? CAPS4[5][1] + CAPS4[6][1] : CAPS4[idx][1];
  cap.style.opacity = idx >= 0 ? ramp(t, CAPS4[idx][0], CAPS4[idx][0] + 0.4) : 0;
}

export default function Case4Demo() {
  return (
    <div className="c4" data-demo="case4">
      <div className="c4-stage" role="img" aria-label="大型需求的過程示意:實作計畫與使用者想法落差、找出舊系統功能缺漏、我去訪談使用者、七天內重構五次後使用者滿意">
        <div className="kv k1" style={{ display: 'none' }}>
          <div className="kn">PM 產出實作計畫</div>
          <span className="ka">→</span>
          <div className="kn">我依計畫實作</div>
          <span className="ka">→</span>
          <div className="kn bad">和使用者想的<br />有很大的出入</div>
        </div>

        <div className="kv k2" style={{ display: 'none' }}>
          <div className="kt">
            <div className="kr kh"><span>功能(示意)</span><span>舊系統</span><span>新系統</span></div>
            {FEATURES.map(([f]) => (
              <div className="kr" key={f}><span>{f}</span><span className="yes">✓</span><span className="no">✕</span></div>
            ))}
          </div>
          <p className="k-note">舊系統有的,這次都沒有 → 無法滿足實務上的需求</p>
        </div>

        <div className="kv k3" style={{ display: 'none' }}>
          <div className="k-center">換我去跟使用者訪談</div>
          <div className="kbs">
            <div className="kb"><small>使用者有想法</small>理解需求,一起規劃怎麼改</div>
            <div className="kb alt"><small>使用者沒想法</small>先做出來,給他看</div>
          </div>
        </div>

        <div className="kv k4" style={{ display: 'none' }}>
          <p className="k-days">短短 7 天內</p>
          <div className="kis">
            {[1, 2, 3, 4, 5].map(n => <div className="ki" key={n}>重構 {n}</div>)}
          </div>
          <div className="meter-wrap">
            <small>不滿意</small><div className="meter"><i /></div><small>滿意</small>
          </div>
          <p className="k-ok">使用者滿意 ✓</p>
        </div>
      </div>
      <p className="case-cap" aria-live="off" />
    </div>
  );
}
