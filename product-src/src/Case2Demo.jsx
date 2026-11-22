import React from 'react';

export const CASE2_DUR = 28;

// [發話者, 內容, 出現秒數]。them = 使用者,it = 現任 IT,me = 我,sys = 旁白
// 範例對話,依真實經驗改寫;系統名稱、網址皆為代稱
export const MSGS2 = [
  ['them', '報表裡的地圖不會顯示了,可以幫忙看看嗎?', 1.0],
  ['sys', '這個系統已經不是我負責了,我替他拉了一個臨時群聊,把現任 IT 一起拉進來', 2.6],
  ['me', '我先看一下,馬上回覆。', 4.2],
  ['sys', '打開 F12 看實際的錯誤', 5.0],
  ['me', 'F12 只告訴我:某個地圖網站,說我們的呼叫方式不符合它的規範。', 9.0],
  ['sys', '我再對照他們的使用規範,逐項查我們的呼叫差在哪', 11.0],
  ['me', '可能的差異:流量太大、沒有使用 HTTPS、請求沒有帶來源資訊(Referer)。', 15.0],
  ['me', '如果不能繼續用這個套件,可替代的套件我也整理好了,一併提供給現任 IT。', 17.2],
  ['it', '收到,我來處理。', 19.4],
  ['sys', '一天後', 20.6],
  ['it', '我在請求的 Header 補上來源資訊了,再看看地圖。', 22.0],
  ['them', '地圖回來了,謝謝!', 24.0],
  ['sys', '現任 IT 沒有改用 HTTPS。我只提供建議,不強制對方怎麼做,畢竟這已經不是我的系統了', 25.6],
];

const CAPS2 = [
  [1.0, '又是一個已經不歸我管的系統,使用者第一個想到的還是我。'],
  [2.6, '替他拉一個臨時群聊,把現任 IT 一起拉進來,大家在同一個地方處理。'],
  [5.0, '打開 F12 看實際的錯誤,而不是用猜的。'],
  [9.0, 'F12 的訊息很籠統:只知道是哪個網站、說我們不符合規範,沒說差在哪。'],
  [11.0, '所以我再去對照他們的使用規範,查出我們的呼叫差多少。'],
  [17.2, '把可能的原因與替代方案都列給現任 IT,讓他有選擇。'],
  [22.0, '一天後補上來源資訊,地圖恢復。HTTPS 沒有調整:我只提供建議,畢竟這已經不是我的系統。'],
];

const COMPARE = [
  ['流量', '有使用上限', '可能超出', 'warn', 12.0],
  ['連線', '需使用 HTTPS', '可能未使用', 'warn', 12.8],
  ['來源資訊', '需帶 Referer', '未帶', 'warn', 13.6],
];

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ramp = (t, a, b) => clamp((t - a) / (b - a));
const LABEL = { them: '使用者', it: '現任 IT' };

export function renderCase2(root, t) {
  root.querySelectorAll('.msg').forEach((el, i) => {
    const [who, , at] = MSGS2[i];
    const from = who === 'sys' ? at : at - 0.8;
    el.style.display = t >= from ? '' : 'none';
    const o = ramp(t, from, from + 0.25);
    el.style.opacity = o;
    el.style.transform = `translateY(${(1 - o) * 10}px)`;
    const typing = who !== 'sys' && t >= from && t < at;
    const d = el.querySelector('.dots');
    if (d) d.style.display = typing ? '' : 'none';
    el.querySelector('.txt').style.display = typing ? 'none' : '';
  });

  // 右側面板:5 秒出現 F12(籠統的錯誤)→ 11 秒起改為「規範對照」→ 22 秒補上來源資訊
  const dev = root.querySelector('.dev');
  const on = ramp(t, 4.8, 5.4);
  dev.style.opacity = on;
  dev.style.transform = `translateY(${(1 - on) * 12}px)`;
  const cmp = t >= 11;
  dev.querySelector('.dev-title').textContent = cmp ? '規範對照(示意)' : 'F12 開發者工具(示意)';
  dev.querySelector('.dev-tabs').style.display = cmp ? 'none' : '';
  dev.querySelector('.con').style.display = cmp ? 'none' : '';
  dev.querySelector('.cmp').style.display = cmp ? '' : 'none';
  dev.querySelectorAll('.con .dl').forEach(l => {
    const start = parseFloat(l.dataset.at);
    l.style.display = t >= start ? '' : 'none';
    l.style.opacity = ramp(t, start, start + 0.3);
    if (l.classList.contains('key')) l.style.backgroundColor = `color-mix(in srgb, var(--warn) ${Math.round(22 * ramp(t, 8.0, 8.4))}%, transparent)`;
  });
  dev.querySelectorAll('.cmp tbody tr').forEach((r, i) => {
    const start = COMPARE[i][4];
    r.style.opacity = ramp(t, start, start + 0.3);
    const fixed = i === 2 && t >= 22.4;
    const st = r.querySelector('.st');
    st.textContent = fixed ? '✓ 已補上' : (i === 1 && t >= 22.4 ? '⚠ 未調整' : (i === 2 ? '✕ ' : '⚠ ') + COMPARE[i][2]);
    st.className = 'st ' + (fixed ? 'good' : 'warn');
  });
  const sum = dev.querySelector('.cmp-sum');
  sum.style.opacity = ramp(t, 23.2, 23.6);

  const cap = root.querySelector('.case-cap');
  let idx = -1;
  CAPS2.forEach(([s], i) => { if (t >= s) idx = i; });
  cap.textContent = idx >= 0 ? CAPS2[idx][1] : '';
  cap.style.opacity = idx >= 0 ? ramp(t, CAPS2[idx][0], CAPS2[idx][0] + 0.4) : 0;
}

export default function Case2Demo() {
  return (
    <div className="case-grid" data-demo="case2">
      <div className="chat" role="img" aria-label="臨時群聊示意:替使用者拉群、用 F12 看到籠統的錯誤、對照規範找出差異、一天後現任 IT 補上標頭,地圖恢復但仍未完全符合規範">
        <div className="chat-bar"><span className="av">群</span><div><b>臨時群聊 · 報表系統 A</b><small>範例對話</small></div></div>
        <div className="chat-body">
          {MSGS2.map(([who, text], i) => (
            <div className={'msg ' + who} key={i}>
              {LABEL[who] && <small className="who">{LABEL[who]}</small>}
              <div className="bub">
                {who !== 'sys' && <span className="dots"><i /><i /><i /></span>}
                <span className="txt">{text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="case-side">
        <div className="dev" aria-hidden="true">
          <div className="win-bar"><i /><i /><i /><span className="dev-title">F12 開發者工具(示意)</span></div>
          <div className="dev-tabs"><span>Elements</span><span className="dev-tab on">Console</span><span>Sources</span></div>
          <div className="dev-body con">
            <div className="dl err" data-at="5.6">✕ GET https://tile.example.com/… 403 (Forbidden)</div>
            <div className="dl warn key" data-at="6.8">⚠ tile.example.com: your request does not comply with our usage policy</div>
          </div>
          <table className="cmp" style={{ display: 'none' }}>
            <thead><tr><th>項目</th><th>對方規範</th><th>我們的呼叫</th></tr></thead>
            <tbody>
              {COMPARE.map(([a, b, c, cls]) => (
                <tr key={a}><td>{a}</td><td>{b}</td><td className={'st ' + cls}>{c}</td></tr>
              ))}
            </tbody>
          </table>
          <p className="cmp-sum" style={{ opacity: 0 }}>地圖已恢復 · 其餘項目由現任 IT 決定</p>
        </div>
        <p className="case-cap" aria-live="off" />
      </div>
    </div>
  );
}
