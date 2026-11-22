import { Bar, Camera, Stage, Text, Window, type Act, type Rect } from './kit';
import { useSiteTheme } from './useSiteTheme.js';
import './e2e-stage.css';

// 示意:測試全部通過,上線卻出問題,所以讓 AI 實際把程式跑起來、取得登入狀態,操作它剛改的部分。
// 登入的做法:以 SKILL 讓 AI 取得登入狀態。橋接伺服器讀一份 JSON(各個角色的 profile),把 SESSION 複製到要測試的 PORT;
// AI 不接觸帳號密碼(撰寫時也只知道結構),只知道目前登入的角色與可能的權限。角色名稱為示意。
// 頁面內容、欄位與「發現的問題」皆為示意,不是真實系統。

const ROWS = [
  { label: '讀取剛改的內容', tag: '請購單 · 供應商欄位' },
  { label: '啟動程式', tag: 'localhost:3000' },
  { label: 'SKILL · 取得登入狀態', tag: '角色:請購人 · 不經手帳密' },
  { label: '操作畫面', tag: '新增請購單 → 送出' },
  { label: '發現問題', tag: '送出後供應商是空的' },
];

type S = {
  done: number; // 已完成幾列(0..4)
  running: number; // 正在跑第幾列(-1 = 沒有)
  found: boolean; // 第 5 列:發現問題
  view: 'login' | 'form' | 'result';
  menu: boolean; // 供應商下拉選單
  picked: boolean; // 已選了供應商
  zoom: Rect | null;
};
const initial: S = { done: 0, running: -1, found: false, view: 'login', menu: false, picked: false, zoom: null };
// 減少動態效果時直接顯示結果:操作完成並發現問題
const poster: S = { ...initial, done: 4, found: true, view: 'result', picked: true };

async function script(a: Act<S>) {
  await a.wait(600);
  a.put({ running: 0 });
  await a.wait(900);
  a.put({ running: 1, done: 1 }); // 2. 啟動程式
  await a.wait(1000);
  a.put({ running: 2, done: 2 }); // 3. 橋接 SESSION:登入狀態出現
  await a.wait(1100);
  a.put({ view: 'form', running: 3, done: 3 }); // 4. 操作畫面
  await a.wait(700);
  await a.click('select');
  a.put({ menu: true });
  await a.wait(450);
  await a.click('opt');
  a.put({ menu: false, picked: true });
  await a.wait(500);
  await a.click('submit');
  a.put({ view: 'result', running: -1, done: 4 });
  await a.wait(900);
  a.put({ found: true }); // 5. 發現問題
  a.put({ zoom: a.rect('bad', { layout: true }) });
  await a.wait(2300);
  a.put({ zoom: null });
  await a.wait(3200);
}

export default function E2eStage() {
  const theme = useSiteTheme();
  return (
    <Stage
      width={760}
      height={380}
      compact={{ below: 560, width: 358, height: 560 }}
      initial={initial}
      poster={poster}
      script={script}
      play="once"
      fill
      theme={theme}
      accent={theme === 'dark' ? '#6d9bff' : '#1f5eff'}
      tokens={{ '--ss-font': '"Noto Sans TC", system-ui, sans-serif' }}
      cursor={{ at: { wide: { x: 470, y: 330 }, compact: { x: 220, y: 480 } }, style: 'arrow', ripple: true }}
      className="ev"
    >
      {(s) => (
        <Camera focus={s.zoom} pad={44} max={1.8}>
          <Window title="AI" className="ev-log">
            <div className="ev-rows">
              {ROWS.map((r, i) => {
                const st = i === 4 ? (s.found ? 'bad' : 'idle') : i < s.done ? 'done' : i === s.running ? 'run' : 'idle';
                return (
                  <div className="ev-row" key={r.label} data-state={st}>
                    <span className="ev-mark" />
                    <span className="ev-label">{r.label}</span>
                    <span className="ev-tag">{r.tag}</span>
                  </div>
                );
              })}
            </div>
          </Window>

          <Window url="localhost:3000" className="ev-app">
            {s.view === 'login' && (
              <div className="ev-login">
                <Text className="ev-h">登入</Text>
                <Bar w={190} h={30} r={7} tone={1} />
                <Bar w={190} h={30} r={7} tone={1} />
                <span className="ev-btn ev-btn--off">登入</span>
              </div>
            )}
            {s.view !== 'login' && <span className="ev-role"><i />請購人</span>}
            {s.view === 'form' && (
              <div className="ev-form">
                <Text className="ev-h">新增請購單</Text>
                <Bar w={120} h={7} r={4} tone={2} />
                <div className="ev-field">
                  <Text className="ev-flabel">供應商</Text>
                  <div className="ev-select" data-target="select" data-cursor="pointer">
                    {s.picked ? <Text>供應商 A</Text> : <Bar w={70} h={7} r={4} tone={2} />}
                    <span className="ev-caret">▾</span>
                    <div className="ev-menu" data-open={s.menu || undefined}>
                      <span className="ev-opt"><Bar w={60} h={6} r={3} tone={2} /></span>
                      <span className="ev-opt" data-target="opt" data-cursor="pointer">供應商 A</span>
                      <span className="ev-opt"><Bar w={54} h={6} r={3} tone={2} /></span>
                    </div>
                  </div>
                </div>
                <Bar w={220} h={30} r={7} tone={1} />
                <span className="ev-btn" data-target="submit" data-cursor="pointer">送出</span>
              </div>
            )}
            {s.view === 'result' && (
              <div className="ev-result">
                <Text className="ev-h">請購單 #1024</Text>
                <div className="ev-kv"><Bar w={52} h={7} r={4} tone={2} /><Bar w={110} h={7} r={4} tone={2} /></div>
                <div className="ev-kv ev-kv--bad" data-target="bad" data-bad={s.found || undefined}>
                  <Text className="ev-k">供應商</Text>
                  <Text className="ev-v">—</Text>
                </div>
                <div className="ev-kv"><Bar w={52} h={7} r={4} tone={2} /><Bar w={90} h={7} r={4} tone={2} /></div>
              </div>
            )}
          </Window>
        </Camera>
      )}
    </Stage>
  );
}
