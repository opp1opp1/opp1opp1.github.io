import React, { useLayoutEffect, useRef } from 'react';
import { gsap, playWhenVisible, reduceMotion, typeInto } from './motion.js';

const URL_TEXT = 'https://api.example.com/v1/orders/10086';

// 以 Postman 的操作方式為靈感自行繪製的示意畫面(範例資料,非真實系統)
export default function PostmanDemo() {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (reduceMotion()) return;
    let stop;
    const q = gsap.utils.selector(root);
    const ctx = gsap.context(() => {
      const url = q('.pm-url-text')[0];
      const status = q('.pm-status')[0];
      const lines = q('.pm-line');
      const hl = q('.pm-line.err');

      url.textContent = '';
      gsap.set(lines, { opacity: 0, x: -8 });
      gsap.set(status, { opacity: 0 });
      gsap.set(q('.pm-note'), { opacity: 0, y: 8 });

      const setStatus = (cls, text) => { status.className = 'pm-status ' + cls; status.textContent = text; };
      const showBody = (set) => {
        lines.forEach(l => { l.style.display = l.dataset.set === set ? '' : 'none'; });
        return gsap.fromTo(q(`.pm-line[data-set="${set}"]`), { opacity: 0, x: -8 }, { opacity: 1, x: 0, stagger: .09, duration: .3 });
      };
      const press = () => gsap.fromTo(q('.pm-send'), { scale: 1 }, { scale: .92, yoyo: true, repeat: 1, duration: .12 });

      const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 2.5 });
      tl.add(typeInto(url, URL_TEXT, 1.6))
        .add(press(), '+=.3')
        .add(() => setStatus('wait', '傳送中…'))
        .set(status, { opacity: 1 })
        .add(() => setStatus('bad', '500 Error · 182 ms'), '+=.7')
        .add(() => showBody('bad'))
        .to(hl, { backgroundColor: 'rgba(255,107,107,.22)', duration: .4 }, '+=.9')
        .to(q('.pm-note.n1'), { opacity: 1, y: 0, duration: .4 })
        .to({}, { duration: 1.6 })
        // 修正後重送
        .add(() => { q('.pm-note.n1')[0].style.opacity = 0; hl.forEach(l => l.style.backgroundColor = ''); })
        .add(press())
        .add(() => setStatus('wait', '傳送中…'), '+=.1')
        .add(() => setStatus('ok', '200 OK · 96 ms'), '+=.6')
        .add(() => showBody('ok'))
        .to(q('.pm-note.n2'), { opacity: 1, y: 0, duration: .4 }, '+=.4')
        .to({}, { duration: 2 })
        .to(q('.pm-note.n2'), { opacity: 0, duration: .3 });

      stop = playWhenVisible(root.current, tl);
    }, root);
    return () => { if (stop) stop(); ctx.revert(); };
  }, []);

  return (
    <div className="win" ref={root} role="img" aria-label="API 測試工具的示意畫面:送出請求、看到 500 錯誤、修正後回傳 200">
      <div className="win-bar"><i /><i /><i /><span>API 測試 · Orders</span></div>
      <div className="pm-req">
        <span className="pm-method">GET</span>
        <span className="pm-url"><span className="pm-url-text">{URL_TEXT}</span></span>
        <span className="pm-send">Send</span>
      </div>
      <div className="pm-tabs"><span>Params</span><span>Headers</span><span className="on">Body</span><span>Tests</span>
        <b className="pm-status wait">{'傳送中…'}</b>
      </div>
      <pre className="pm-body">
        <code>
          <span className="pm-line" data-set="bad">{'{'}</span>
          <span className="pm-line" data-set="bad">{'  "code": 500,'}</span>
          <span className="pm-line err" data-set="bad">{'  "message": "status is null",'}</span>
          <span className="pm-line err" data-set="bad">{'  "field": "order.status"'}</span>
          <span className="pm-line" data-set="bad">{'}'}</span>
          <span className="pm-line" data-set="ok" style={{ display: 'none' }}>{'{'}</span>
          <span className="pm-line" data-set="ok" style={{ display: 'none' }}>{'  "id": 10086,'}</span>
          <span className="pm-line" data-set="ok" style={{ display: 'none' }}>{'  "status": "RECEIVED",'}</span>
          <span className="pm-line" data-set="ok" style={{ display: 'none' }}>{'  "items": 3'}</span>
          <span className="pm-line" data-set="ok" style={{ display: 'none' }}>{'}'}</span>
        </code>
      </pre>
      <p className="pm-note n1">回應直接指出出錯的欄位</p>
      <p className="pm-note n2">修正後重送,確認回傳正常</p>
    </div>
  );
}
