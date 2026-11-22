import React from 'react';
import { MousePointer2 } from 'lucide-react';

export const URL_TEXT = 'https://api.example.com/v1/orders/10086';
export const POSTMAN_DUR = 10;

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ramp = (t, a, b) => clamp((t - a) / (b - a));
const pulse = (t, a) => (t > a && t < a + 0.24 ? Math.sin(((t - a) / 0.24) * Math.PI) : 0);

// 依「時間 t」決定畫面上的一切,所以可以任意前進、倒退、拖曳
export function renderPostman(root, t) {
  const $ = s => root.querySelector(s);
  $('.pm-url-text').textContent = URL_TEXT.slice(0, Math.round(URL_TEXT.length * ramp(t, 0, 1.6)));
  const sc = 1 - 0.08 * pulse(t, 1.9) - 0.08 * pulse(t, 6.1);
  $('.pm-send').style.transform = `scale(${sc})`;

  // 游標:移到 Send、按下、移開;再按一次。每個動作都有原因
  const wr = root.getBoundingClientRect();
  const k = wr.width / root.offsetWidth || 1;
  const sr = $('.pm-send').getBoundingClientRect();
  const sx = (sr.left - wr.left + sr.width / 2) / k, sy = (sr.top - wr.top + sr.height / 2) / k;
  const rx = root.offsetWidth * 0.72, ry = root.offsetHeight * 0.78;
  const share = ramp(t, 0.8, 1.8) - ramp(t, 2.3, 3.0) + ramp(t, 5.2, 6.0) - ramp(t, 6.6, 7.3);
  const cur = $('.pm-cursor');
  cur.style.opacity = ramp(t, 0.5, 0.9);
  cur.style.transform = `translate(${rx + (sx - rx) * share}px, ${ry + (sy - ry) * share}px)`;
  // 鏡頭:在錯誤那幾行上推近,再拉回
  const cam = ramp(t, 3.6, 4.4) - ramp(t, 5.6, 6.2);
  $('.pm-body').style.transform = `scale(${1 + 0.1 * cam})`;

  const bad = t >= 2.8 && t < 6.2;
  const ok = t >= 6.8;
  const wait = (t >= 2.1 && t < 2.8) || (t >= 6.2 && t < 6.8);
  const st = $('.pm-status');
  st.style.opacity = t >= 2.1 ? 1 : 0;
  st.className = 'pm-status ' + (wait ? 'wait' : bad ? 'bad' : ok ? 'ok' : 'wait');
  st.textContent = wait ? '傳送中…' : bad ? '500 Error · 182 ms' : ok ? '200 OK · 96 ms' : '';

  const idx = { bad: 0, ok: 0 };
  root.querySelectorAll('.pm-line').forEach(l => {
    const set = l.dataset.set;
    const i = idx[set]++;
    const show = (set === 'bad' && bad) || (set === 'ok' && ok);
    l.style.display = show ? '' : 'none';
    const start = set === 'bad' ? 2.8 : 6.8;
    l.style.opacity = show ? ramp(t, start + i * 0.09, start + i * 0.09 + 0.3) : 0;
    l.style.backgroundColor = l.classList.contains('err') && bad ? `color-mix(in srgb, var(--bad) ${Math.round(24 * ramp(t, 3.7, 4.1))}%, transparent)` : '';
  });

  const n1 = ramp(t, 4.1, 4.5) * (t < 6.1 ? 1 : 0);
  const n2 = ramp(t, 7.2, 7.6) * (1 - ramp(t, 9.5, 9.8));
  const a = $('.pm-note.n1'), b = $('.pm-note.n2');
  a.style.opacity = n1; a.style.transform = `translateY(${(1 - n1) * 8}px)`;
  b.style.opacity = n2; b.style.transform = `translateY(${(1 - n2) * 8}px)`;
}

// 以 Postman 的操作方式為靈感自行繪製的示意畫面(範例資料,非真實系統)
export default function PostmanDemo() {
  return (
    <div className="win" data-demo="postman" role="img" aria-label="API 測試工具的示意畫面:送出請求、看到 500 錯誤、修正後回傳 200">
      <div className="win-bar"><i /><i /><i /><span>API 測試 · Orders</span></div>
      <div className="pm-req">
        <span className="pm-method">GET</span>
        <span className="pm-url"><span className="pm-url-text">{URL_TEXT}</span></span>
        <span className="pm-send">Send</span>
      </div>
      <div className="pm-tabs"><span className="bar" /><span className="bar" /><span className="on">Body</span><span className="bar" />
        <b className="pm-status wait" />
      </div>
      <pre className="pm-body">
        <code>
          <span className="pm-line" data-set="bad">{'{'}</span>
          <span className="pm-line" data-set="bad">{'  "code": 500,'}</span>
          <span className="pm-line err" data-set="bad">{'  "message": "status is null",'}</span>
          <span className="pm-line err" data-set="bad">{'  "field": "order.status"'}</span>
          <span className="pm-line" data-set="bad">{'}'}</span>
          <span className="pm-line" data-set="ok">{'{'}</span>
          <span className="pm-line" data-set="ok">{'  "id": 10086,'}</span>
          <span className="pm-line" data-set="ok">{'  "status": "RECEIVED",'}</span>
          <span className="pm-line" data-set="ok">{'  "items": 3'}</span>
          <span className="pm-line" data-set="ok">{'}'}</span>
        </code>
      </pre>
      <MousePointer2 className="pm-cursor" size={20} fill="currentColor" aria-hidden="true" />
      <p className="pm-note n1">回應直接指出出錯的欄位</p>
      <p className="pm-note n2">修正後重送,確認回傳正常</p>
    </div>
  );
}
