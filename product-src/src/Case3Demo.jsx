import React from 'react';

export const CASE3_DUR = 26;

// 範例資料:系統名稱、commit 內容、工時皆為示意,非真實紀錄
const PAINS = [
  ['手動填寫,每天都要花時間', 1.2],
  ['忘記填,事後補填花更久,甚至要 0.5~1 小時', 2.2],
  ['系統沒有 API,session 過期還會無限迴圈', 3.2],
  ['不少動作要等 1~2 秒才有回應', 5.2],
];
const COMMITS = [
  ['系統 A', 'fix: 修正付款狀態判斷', 8.2],
  ['系統 A', 'refactor: 整理查詢條件', 8.8],
  ['系統 B', 'feat: 新增報表欄位', 9.4],
  ['系統 C', 'test: 補上 E2E 測試', 10.0],
];
const SUMMARY = [
  ['系統 A', '修正付款狀態判斷、整理查詢條件', 11.0],
  ['系統 B', '新增報表欄位', 11.8],
  ['系統 C', '補上自動化測試', 12.6],
];
const ROWS = [
  ['系統 A', '修正付款狀態判斷、整理查詢條件', '2.0', 14.6],
  ['系統 B', '新增報表欄位', '3.0', 16.8],
  ['系統 C', '補上自動化測試', '2.5', 19.0],
  ['其他', '需求討論、支援 UAT', '0.5', 22.8],
];
const CAPS3 = [
  [1.0, '每天都要填工作報告,記錄花了多少工時、在哪個系統上。'],
  [7.6, '請 AI 讀取各系統當天的 Git commit,整理出做了什麼。有憑有據。'],
  [14.2, '再用 Chrome MCP 操作瀏覽器,幫我把工時填進去。'],
  [21.8, '沒有程式碼修改的日子,也能直接告訴 AI 當天做了什麼,它照樣會填。'],
  [25.0, '省下不少時間,每一筆也都有依據。'],
];

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ramp = (t, a, b) => clamp((t - a) / (b - a));
const lerp = (a, b, k) => a + (b - a) * k;

export function renderCase3(root, t) {
  const $ = s => root.querySelector(s);

  // 版面切換:填表(手動痛點)→ Git commit 與 AI 整理 → 填表(自動填寫)
  const inGen = t >= 7.4 && t < 14.2;
  const formO = t < 7.0 ? 1 : t < 7.4 ? 1 - ramp(t, 7.0, 7.4) : t < 14.2 ? 0 : ramp(t, 14.2, 14.6);
  const form = $('.c3-form');
  form.style.opacity = formO;
  form.style.display = formO === 0 ? 'none' : '';
  const gen = $('.c3-gen');
  const genO = inGen ? Math.min(ramp(t, 7.4, 7.8), 1 - ramp(t, 13.8, 14.2)) : 0;
  gen.style.opacity = genO;
  gen.style.display = genO === 0 ? 'none' : '';

  // 痛點 / 狀態 / 口述
  const pains = $('.c3-pains');
  pains.style.opacity = t < 7.0 ? 1 : t < 7.4 ? 1 - ramp(t, 7.0, 7.4) : t < 14.2 ? 0 : 0;
  pains.querySelectorAll('li').forEach((li, i) => {
    li.style.opacity = ramp(t, PAINS[i][1], PAINS[i][1] + 0.35);
    li.style.transform = `translateX(${(1 - ramp(t, PAINS[i][1], PAINS[i][1] + 0.35)) * -10}px)`;
  });
  // session 過期的無限迴圈:載入中 → 已過期 → 重試,次數不斷增加
  const ex = $('.c3-expire');
  const EX0 = 3.4, CYC = 1.2;
  const exOn = t >= EX0 && t < 7.4;
  ex.style.display = exOn ? '' : 'none';
  if (exOn) {
    const k = (t - EX0) / CYC;
    const ph = k - Math.floor(k);
    ex.style.opacity = ramp(t, EX0, EX0 + 0.3);
    ex.querySelector('.sp').style.transform = `rotate(${t * 540}deg)`;
    ex.querySelector('.sp').style.opacity = ph < 0.55 ? 1 : 0.25;
    ex.querySelector('.ex-msg').textContent = ph < 0.55 ? '載入中…' : '⚠ Session 已過期,重新整理…';
    ex.querySelector('.ex-msg').className = 'ex-msg' + (ph < 0.55 ? '' : ' bad');
    ex.querySelector('.ex-n').textContent = '重試第 ' + (Math.floor(k) + 1) + ' 次';
  }
  const status = $('.c3-status');
  status.style.opacity = t >= 14.2 && t < 21.8 ? ramp(t, 14.2, 14.6) : 0;
  const say = $('.c3-say');
  say.style.opacity = t >= 21.8 ? ramp(t, 21.8, 22.2) : 0;

  // Git commit 與 AI 整理
  root.querySelectorAll('.gl').forEach((l, i) => {
    l.style.opacity = ramp(t, COMMITS[i][2], COMMITS[i][2] + 0.3);
  });
  root.querySelectorAll('.al').forEach((l, i) => {
    l.style.opacity = ramp(t, SUMMARY[i][2], SUMMARY[i][2] + 0.3);
  });

  // 表單自動填寫:游標移動、逐字輸入
  const rows = root.querySelectorAll('.fr:not(.head)');
  const tops = [...rows].map(r => r.offsetTop + r.offsetHeight / 2);
  let cur = null;
  rows.forEach((r, i) => {
    const s = ROWS[i][3];
    const [sys, txt, hrs] = ROWS[i];
    r.querySelector('.c-sys').textContent = t >= s + 0.3 ? sys : '';
    const n = Math.round(txt.length * ramp(t, s + 0.5, s + 1.5));
    r.querySelector('.c-txt').textContent = txt.slice(0, n);
    r.querySelector('.c-hrs').textContent = t >= s + 1.6 ? hrs : '';
    r.classList.toggle('act', t >= s && t < s + 1.9);
    if (t >= s) cur = i;
  });
  const cursor = $('.c3-cursor');
  if (formO > 0 && t >= 14.2 && t < 25.5 && cur !== null) {
    const s = ROWS[cur][3];
    const from = cur === 0 ? tops[0] - 40 : tops[cur - 1];
    cursor.style.opacity = 1;
    cursor.style.top = lerp(from, tops[cur], ramp(t, s, s + 0.4)) + 'px';
  } else if (formO > 0 && t >= 14.2 && t < 25.5) {
    cursor.style.opacity = 1; cursor.style.top = tops[0] - 40 + 'px';
  } else cursor.style.opacity = 0;
  $('.c3-total').style.opacity = ramp(t, 24.8, 25.2);

  const cap = $('.case-cap');
  let idx = -1;
  CAPS3.forEach(([s], i) => { if (t >= s) idx = i; });
  cap.textContent = idx >= 0 ? CAPS3[idx][1] : '';
  cap.style.opacity = idx >= 0 ? ramp(t, CAPS3[idx][0], CAPS3[idx][0] + 0.4) : 0;
}

export default function Case3Demo() {
  return (
    <div className="c3" data-demo="case3">
      <div className="c3-stage" role="img" aria-label="工時回報示意:先是手動填寫的痛點,接著 AI 讀取 Git commit 整理當天工作,最後透過 Chrome MCP 自動填進表單">
        <div className="win c3-form">
          <div className="win-bar"><i /><i /><i /><span>每日工時回報(示意)</span></div>
          <div className="c3-table">
            <div className="fr head"><span>系統</span><span>工作內容</span><span>工時</span></div>
            {ROWS.map(([, , ], i) => (
              <div className="fr" key={i}><span className="c-sys" /><span className="c-txt" /><span className="c-hrs" /></div>
            ))}
            <svg className="c3-cursor" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 1l13 7-6 1.6L6.6 16z" fill="#4fd1c1" stroke="#06231f" strokeWidth="1.2" strokeLinejoin="round" /></svg>
          </div>
          <p className="c3-total">合計 8.0 小時 · 已送出 ✓</p>
          <div className="c3-expire" style={{ display: 'none' }}>
            <span className="sp" />
            <p className="ex-msg">載入中…</p>
            <p className="ex-n">重試第 1 次</p>
          </div>
        </div>

        <div className="c3-gen" style={{ display: 'none' }}>
          <div className="win">
            <div className="win-bar"><i /><i /><i /><span>git log · 今天(示意)</span></div>
            <div className="c3-lines">
              {COMMITS.map(([sys, msg], i) => (<div className="gl" key={i}><b>{sys}</b> {msg}</div>))}
            </div>
          </div>
          <div className="c3-arrow" aria-hidden="true">AI 整理 →</div>
          <div className="win">
            <div className="win-bar"><i /><i /><i /><span>今天做了什麼</span></div>
            <div className="c3-lines">
              {SUMMARY.map(([sys, msg], i) => (<div className="al" key={i}><b>{sys}</b> {msg}</div>))}
            </div>
          </div>
        </div>
      </div>

      <div className="c3-under">
        <ul className="c3-pains">{PAINS.map(([t]) => <li key={t}>{t}</li>)}</ul>
        <p className="c3-status"><i /> Chrome MCP · 操作瀏覽器中…</p>
        <p className="c3-say">我:「今天沒有改程式,主要在討論需求、支援 UAT。」</p>
      </div>
      <p className="case-cap" aria-live="off" />
    </div>
  );
}
