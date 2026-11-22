import React from 'react';

export const CASE_DUR = 22;

// [發話者, 內容, 出現秒數]。them = 會計同仁,me = 我,sys = 旁白
// 範例對話,依真實經驗改寫;發票編號、人名皆為代稱
export const MSGS = [
  ['them', '請問發票 A 是不是已經作廢了?', 1.0],
  ['me', '這個現在不是我負責了,我幫你問現任的 IT,稍等我一下。', 2.8],
  ['sys', '已替他聯絡現任 IT…', 4.4],
  ['sys', '現任 IT 回覆:發票 A 已作廢', 5.8],
  ['me', '確認了,發票 A 已作廢。這樣有解決你的疑問嗎?', 7.4],
  ['them', '可是我平常用的系統,顯示它還是「尚未作廢」…', 9.8],
  ['me', '我陪你一起查看看。', 11.4],
  ['me', '查到了:廠商沒有透過我們向財政部作廢,所以我們這邊沒有作廢的 LOG。', 13.2],
  ['me', '目前的侷限是:不在加值服務中心處理的發票事務,我們沒辦法知道。', 15.4],
  ['me', '如果財政部開放 API,就能自動去查發票的最新狀態,這是可行的改善方向。', 17.4],
  ['them', '原來如此,我懂了,謝謝!', 19.6],
];

const CAPTIONS = [
  [1.0, '有人跑來問一件已經不歸我管的事。'],
  [2.8, '「替」他聯絡現任 IT,而不是請他自己去問,使用者不會覺得被踢皮球。'],
  [7.4, '給了答案,再多問一句:他可能還有沒說出口的疑問。'],
  [11.4, '陪他一路追查,找到真正的原因,而不是只處理眼前這一張發票。'],
  [15.4, '說清楚系統的侷限,並提出可行的改善方向。'],
];

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ramp = (t, a, b) => clamp((t - a) / (b - a));

export function renderCase(root, t) {
  root.querySelectorAll('.msg').forEach((el, i) => {
    const [who, , at] = MSGS[i];
    const from = who === 'sys' ? at : at - 0.8;
    const show = t >= from;
    el.style.display = show ? '' : 'none';
    const o = ramp(t, from, from + 0.25);
    el.style.opacity = o;
    el.style.transform = `translateY(${(1 - o) * 10}px)`;
    const typing = who !== 'sys' && t >= from && t < at;
    el.querySelector('.dots') && (el.querySelector('.dots').style.display = typing ? '' : 'none');
    el.querySelector('.txt').style.display = typing ? 'none' : '';
  });
  const cap = root.querySelector('.case-cap');
  let idx = -1;
  CAPTIONS.forEach(([s], i) => { if (t >= s) idx = i; });
  cap.textContent = idx >= 0 ? CAPTIONS[idx][1] : '';
  cap.style.opacity = idx >= 0 ? ramp(t, CAPTIONS[idx][0], CAPTIONS[idx][0] + 0.4) : 0;
}

export default function CaseDemo() {
  return (
    <div className="case-grid" data-demo="case">
      <div className="chat" role="img" aria-label="與會計同仁的對話示意:替他聯絡現任 IT、追問疑問、查出原因並說明系統侷限">
        <div className="chat-bar"><span className="av">會</span><div><b>會計同仁</b><small>範例對話</small></div></div>
        <div className="chat-body">
          {MSGS.map(([who, text], i) => (
            <div className={'msg ' + who} key={i}>
              <div className="bub">
                {who !== 'sys' && <span className="dots"><i /><i /><i /></span>}
                <span className="txt">{text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="case-cap" aria-live="off" />
    </div>
  );
}
