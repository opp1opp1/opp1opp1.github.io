import { Bar, Camera, Caret, Code, Prompt, Stage, Text, Window, type Act, type CodeLine, type Rect } from './kit';
import { useSiteTheme } from './useSiteTheme.js';
import './debug-stage.css';

// 示意:用 API 工具重現問題、看回應定位原因;再請 AI 寫並執行 E2E 測試,用綠燈驗證。
// 網址、欄位、測試名稱與耗時皆為範例,不是真實系統。

const URL_TEXT = 'https://api.example.com/v1/orders/10086';
const CMD = 'npx playwright test';
const TESTS: [string, number][] = [
  ['建立請購單', 820],
  ['送出簽核流程', 1340],
  ['供應商回覆報價', 1105],
  ['驗收並入庫', 960],
  ['付款狀態更新', 1480],
];

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
  termFront: boolean; // 終端機走到前面,Postman 退後
  cmd: string;
  running: number; // 正在跑第幾個測試(-1 = 沒有)
  done: number; // 已通過幾個
  summary: boolean;
};
const initial: S = { status: 'idle', zoom: null, termFront: false, cmd: '', running: -1, done: 0, summary: false };
// 減少動態效果時直接顯示結果:測試全部通過
const poster: S = { ...initial, status: 'ok', termFront: true, cmd: CMD, done: TESTS.length, summary: true };

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
  await a.wait(1500);
  // 4. 換請 AI 寫的 E2E 測試:終端機走到前面,逐一通過
  a.put({ termFront: true });
  await a.wait(600);
  await a.type('cmd', CMD, { interval: 38 });
  await a.wait(350);
  for (let i = 0; i < TESTS.length; i++) {
    a.put({ running: i });
    await a.wait(480);
    a.put({ running: -1, done: i + 1 });
    await a.wait(170);
  }
  await a.wait(300);
  a.put({ summary: true });
  await a.wait(3600);
}

export default function DebugStage() {
  const theme = useSiteTheme();
  return (
    <Stage
      width={760}
      height={380}
      compact={{ below: 560, width: 358, height: 520 }}
      initial={initial}
      poster={poster}
      script={script}
      play="once"
      fill
      theme={theme}
      accent={theme === 'dark' ? '#6d9bff' : '#1f5eff'}
      tokens={{ '--ss-font': '"Noto Sans TC", system-ui, sans-serif' }}
      cursor={{ at: { wide: { x: 300, y: 250 }, compact: { x: 240, y: 200 } }, style: 'arrow', ripple: true }}
      className="db"
    >
      {(s) => (
        <Camera focus={s.zoom} pad={40} max={1.7}>
          <Window title="API 測試" className="db-pm" receded={s.termFront}>
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

          <Window chrome="terminal" title="app — zsh" className="db-term" receded={!s.termFront}>
            <Prompt path="~/app">
              {s.cmd}
              {s.done < TESTS.length && <Caret still={s.cmd.length > 0 && s.cmd !== CMD} />}
            </Prompt>
            <div className="db-tests">
              {TESTS.map(([name, ms], i) => {
                const st = i < s.done ? 'done' : i === s.running ? 'run' : 'idle';
                return (
                  <div className="db-test" key={name} data-state={st}>
                    <span className="db-mark" />
                    <span className="db-name">{name}</span>
                    <span className="db-ms">{st === 'done' ? `${ms} ms` : ''}</span>
                  </div>
                );
              })}
            </div>
            <div className="ok db-sum" data-show={s.summary || undefined}>5 passed (12.4s)</div>
          </Window>
        </Camera>
      )}
    </Stage>
  );
}
