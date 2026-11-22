import { Bar, Camera, Code, Stage, Text, Window, type Act, type CodeLine, type Rect } from './kit';
import { useSiteTheme } from './useSiteTheme.js';
import './debug-stage.css';

// 示意:用 API 工具重現問題、看回應定位原因。網址與欄位皆為範例,不是真實系統。

const URL_TEXT = 'https://api.example.com/v1/orders/10086';
const BAD: CodeLine[] = [
  { text: '{' },
  { text: '  "code": 500,' },
  { text: '  "message": "status is null",', kind: 'del' },
  { text: '  "field": "order.status"', kind: 'del' },
  { text: '}' },
];
const OK: CodeLine[] = [
  { text: '{' },
  { text: '  "id": 10086,' },
  { text: '  "status": "RECEIVED",' },
  { text: '  "items": 3' },
  { text: '}' },
];

type S = {
  status: 'idle' | 'wait' | 'bad' | 'ok';
  zoom: Rect | null; // 鏡頭推近的位置(舞台座標)
};
const initial: S = { status: 'idle', zoom: null };
// 減少動態效果時直接顯示結果:修正後的 200
const poster: S = { status: 'ok', zoom: null };

async function script(a: Act<S>) {
  await a.wait(600);
  // 1. 送出請求,得到 500
  await a.click('send');
  a.put({ status: 'wait' });
  await a.wait(750);
  a.put({ status: 'bad' });
  await a.wait(700);
  // 2. 鏡頭推近到出錯的欄位,再拉回
  a.put({ zoom: a.rect('err', { layout: true }) });
  await a.wait(2200);
  a.put({ zoom: null });
  await a.wait(900);
  // 3. 修正後重送,得到 200
  await a.click('send');
  a.put({ status: 'wait' });
  await a.wait(650);
  a.put({ status: 'ok' });
  await a.wait(3800);
}

export default function DebugStage() {
  const theme = useSiteTheme();
  return (
    <Stage
      width={760}
      height={380}
      compact={{ below: 560, width: 358, height: 340 }}
      initial={initial}
      poster={poster}
      script={script}
      play="once"
      fill
      theme={theme}
      accent={theme === 'dark' ? '#6d9bff' : '#1f5eff'}
      tokens={{ '--ss-font': '"Noto Sans TC", system-ui, sans-serif' }}
      cursor={{ at: { wide: { x: 420, y: 260 }, compact: { x: 240, y: 200 } }, style: 'arrow', ripple: true }}
      className="db"
    >
      {(s) => (
        <Camera focus={s.zoom} pad={40} max={1.7}>
          <Window title="API 測試" className="db-pm">
            <div className="db-body">
              <div className="db-req">
                <span className="db-method">GET</span>
                <div className="db-url"><Text>{URL_TEXT}</Text></div>
                <span className="db-send" data-target="send" data-cursor="pointer">Send</span>
              </div>
              <div className="db-tabs">
                <Bar w={40} h={7} r={4} tone={2} />
                <Bar w={46} h={7} r={4} tone={2} />
                <Text className="db-tab-on">Body</Text>
                <Bar w={34} h={7} r={4} tone={2} />
                <span className="db-status" data-tone={s.status === 'bad' ? 'bad' : s.status === 'ok' ? 'ok' : 'wait'} data-show={s.status !== 'idle' || undefined}>
                  {s.status === 'wait' ? '傳送中…' : s.status === 'bad' ? '500 Error · 182 ms' : '200 OK · 96 ms'}
                </span>
              </div>
              <div className="db-resp" data-target="err">
                {s.status === 'bad' && <Code lines={BAD} numbers={false} />}
                {s.status === 'ok' && <Code lines={OK} numbers={false} />}
              </div>
            </div>
          </Window>

        </Camera>
      )}
    </Stage>
  );
}
