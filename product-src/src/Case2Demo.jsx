import React from 'react';

export const CASE2_DUR = 25;

// [發話者, 內容, 出現秒數]。them = 使用者,it = 現任 IT,me = 我,sys = 旁白
// 範例對話,依真實經驗改寫;系統名稱、網址皆為代稱
export const MSGS2 = [
  ['them', '報表裡的地圖不會顯示了,可以幫忙看看嗎?', 1.0],
  ['sys', '這個系統已經不是我負責了,我替他拉了一個臨時群聊,把現任 IT 一起拉進來', 2.6],
  ['me', '我先看一下,馬上回覆。', 4.2],
  ['sys', '打開 F12 看實際的錯誤', 5.0],
  ['me', '地圖套件有使用規範,看起來我們目前的用法不符合。', 10.0],
  ['me', '可能的原因:流量太大、沒有使用 HTTPS、請求沒有帶來源資訊(Referer)。', 12.0],
  ['me', '如果不能繼續用這個套件,可替代的套件我也整理好了,一併提供給現任 IT。', 14.6],
  ['it', '收到,我來處理。', 17.4],
  ['sys', '一天後', 18.8],
  ['it', '我在請求的 Header 補上來源資訊了,再看看地圖。', 20.0],
  ['them', '地圖回來了,謝謝!', 22.0],
];

const CAPS2 = [
  [1.0, '又是一個已經不歸我管的系統,使用者第一個想到的還是我。'],
  [2.6, '替他拉一個臨時群聊,把現任 IT 一起拉進來,大家在同一個地方處理。'],
  [5.0, '打開 F12 看實際的錯誤,而不是用猜的。'],
  [10.0, '把可能的原因整理清楚,不只指出問題。'],
  [14.6, '連替代方案也一併列出,讓現任 IT 有選擇。'],
  [20.0, '一天後,現任 IT 補上來源資訊,問題解決。'],
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

  // F12 面板:5 秒出現,錯誤逐行浮現,鎖定關鍵行;20 秒後補上標頭,改為成功
  const dev = root.querySelector('.dev');
  const on = ramp(t, 4.8, 5.4);
  dev.style.opacity = on;
  dev.style.transform = `translateY(${(1 - on) * 12}px)`;
  const fixed = t >= 20.4;
  dev.querySelectorAll('.dl').forEach(l => {
    const set = l.dataset.set;
    const start = parseFloat(l.dataset.at);
    const show = set === 'bad' ? (t >= start && !fixed) : (fixed && t >= start);
    l.style.display = show ? '' : 'none';
    l.style.opacity = ramp(t, start, start + 0.3);
    if (l.classList.contains('key')) l.style.backgroundColor = `rgba(245,192,79,${0.2 * ramp(t, 8.6, 9.0)})`;
    if (l.classList.contains('good')) l.style.backgroundColor = `rgba(79,209,139,${0.18 * ramp(t, 21, 21.4)})`;
  });
  dev.querySelector('.dev-tab.on').textContent = fixed ? 'Network' : 'Console';

  const cap = root.querySelector('.case-cap');
  let idx = -1;
  CAPS2.forEach(([s], i) => { if (t >= s) idx = i; });
  cap.textContent = idx >= 0 ? CAPS2[idx][1] : '';
  cap.style.opacity = idx >= 0 ? ramp(t, CAPS2[idx][0], CAPS2[idx][0] + 0.4) : 0;
}

export default function Case2Demo() {
  return (
    <div className="case-grid" data-demo="case2">
      <div className="chat" role="img" aria-label="臨時群聊示意:替使用者拉群、用 F12 找到原因、列出替代方案,一天後現任 IT 補上標頭修好">
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
          <div className="win-bar"><i /><i /><i /><span>F12 開發者工具(示意)</span></div>
          <div className="dev-tabs"><span>Elements</span><span className="dev-tab on">Console</span><span>Sources</span></div>
          <div className="dev-body">
            <div className="dl err" data-set="bad" data-at="5.6">✕ GET https://tile.example.com/12/3374/1670.png 403 (Forbidden)</div>
            <div className="dl err" data-set="bad" data-at="6.6">✕ GET https://tile.example.com/12/3375/1670.png 403 (Forbidden)</div>
            <div className="dl warn key" data-set="bad" data-at="7.6">⚠ Access blocked: requests must include a Referer header (usage policy)</div>
            <div className="dl ok" data-set="ok" data-at="20.4">✓ GET https://tile.example.com/12/3374/1670.png 200 OK</div>
            <div className="dl ok good" data-set="ok" data-at="21">Request Headers › Referer: https://report-a.example.com/</div>
          </div>
        </div>
        <p className="case-cap" aria-live="off" />
      </div>
    </div>
  );
}
