import React from 'react';

export const CASE_DUR = 27;

// [發話者, 內容, 出現秒數]。them = 會計同仁,me = 我,sys = 旁白
// 範例對話,依真實經驗改寫;發票編號、人名皆為代稱
export const MSGS = [
  ['them', '請問發票 A 是不是已經作廢了?', 1.0],
  ['me', '這個現在不是我負責了,我幫你問現任的 IT,稍等我一下。', 2.8],
  ['sys', '已替他聯絡現任 IT…', 4.4],
  ['sys', '現任 IT 回覆:發票 A 已作廢', 5.6],
  ['me', '確認了,發票 A 已作廢。這樣有解決你的疑問嗎?', 7.0],
  ['them', '可是我平常用的系統,顯示它還是「尚未作廢」…', 8.8],
  ['me', '我這邊查到是已作廢,你是在哪個畫面看到的?', 10.4],
  ['them', '就是我常用的系統啊,它還是顯示「尚未作廢」。', 12.0],
  ['sys', '文字溝通卡住了,我主動提議改用電話,把狀況問清楚', 13.4],
  ['me', '我從 LOG 判斷,我們沒有作廢的紀錄,推測是廠商沒有透過我們向財政部作廢。', 15.2],
  ['sys', '他向廠商確認,證實了這個推論', 17.4],
  ['me', '目前的侷限是:不在加值服務中心處理的發票事務,我們沒辦法知道。', 18.8],
  ['me', '沒有 API 的話,也可以試試用 AI 瀏覽網站,或寫爬蟲去查。', 20.8],
  ['me', '但有侷限:發票很多要一張一張查、財政部可能不允許、登入帳密只有少數人有。', 22.8],
  ['them', '原來如此,我懂了,謝謝!', 25.0],
];

const CAPTIONS = [
  [1.0, '有人跑來問一件已經不歸我管的事。'],
  [2.8, '「替」他聯絡現任 IT,而不是請他自己去問,使用者不會覺得被踢皮球。'],
  [7.0, '給了答案,再多問一句:他可能還有沒說出口的疑問。'],
  [10.4, '他一再提到系統顯示「尚未作廢」。文字說不清楚,我主動提議改用電話。'],
  [15.2, '從 LOG 推論原因,再請他向廠商證實,不把猜測當成結論。'],
  [18.8, '說清楚系統的侷限,提出可能的做法,也誠實說明每個做法的限制。'],
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
