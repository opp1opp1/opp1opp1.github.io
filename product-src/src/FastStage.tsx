import { Bar, Collapse, Field, Stage, Stream, Text, Toast, Window, type Act } from './kit';
import { useSiteTheme } from './useSiteTheme.js';
import './fast-stage.css';

// 示意:把使用者的對話複製、貼給 AI,AI 自己呼叫 SKILL 在權限控制下查資料庫,給出原因。
// 單號、對話與結果皆為範例。Stageshow 的腳本以即時時鐘播放,於換到本頁時才掛上。
//
// 真實文字只有:使用者的訊息、貼上的草稿(同一句)、SKILL 那一列、答案。其餘用灰色佔位。

const MSG = '我的請購單 PO-12345 卡住好幾天了,不知道是什麼原因?';
// Stream 以空格分詞,中文逐字切開,再用負字距把空格抵銷
const ANSWER = '單據 PO-12345 停在第 2 關簽核,主管尚未回覆。'.split('').join(' ');
const WORDS = ANSWER.split(' ').length;

type S = {
  copied: boolean;
  draft: string;
  sent: boolean;
  phase: 'idle' | 'thinking' | 'tool' | 'answer';
  words: number;
};
const initial: S = { copied: false, draft: '', sent: false, phase: 'idle', words: 0 };
const poster: S = { copied: false, draft: '', sent: true, phase: 'answer', words: WORDS };

async function script(a: Act<S>) {
  await a.wait(600);
  await a.move('msg'); // 滑到訊息上,才會出現「複製」
  await a.wait(250);
  await a.click('copy');
  a.put({ copied: true });
  await a.wait(1000);
  a.put({ copied: false });
  await a.click('composer');
  await a.key('cmd+v');
  a.put({ draft: MSG });
  await a.wait(700);
  await a.key('enter');
  a.put({ sent: true, draft: '' });
  await a.wait(450);
  a.put({ phase: 'thinking' });
  await a.wait(900);
  a.put({ phase: 'tool' }); // AI 自己呼叫 SKILL
  await a.wait(1700);
  a.put({ phase: 'answer' });
  for (let i = 1; i <= WORDS; i++) {
    a.put({ words: i });
    await a.wait(55);
  }
  await a.wait(3200);
}

export default function FastStage() {
  const theme = useSiteTheme();
  return (
    <Stage
      width={760}
      height={340}
      compact={{ below: 560, width: 358, height: 470 }}
      initial={initial}
      poster={poster}
      script={script}
      play="once"
      fill
      theme={theme}
      accent={theme === 'dark' ? '#6d9bff' : '#1f5eff'}
      tokens={{ '--ss-font': '"Noto Sans TC", system-ui, sans-serif' }}
      cursor={{ at: 'msg', style: 'arrow' }}
      className="fs"
    >
      {(s) => (
        <>
          <Window title="對話" className="fs-chat">
            <div className="fs-chat-body">
              <Bar w={96} h={8} r={4} tone={2} />
              <Bar w={170} h={8} r={4} tone={2} />
              <div className="fs-msg" data-target="msg" data-cursor="pointer">
                <Text wrap>{MSG}</Text>
                <span className="fs-copy" data-target="copy" data-cursor="pointer">複製</span>
              </div>
            </div>
          </Window>

          <Window title="AI" className="fs-ai">
            <div className="fs-ai-body">
              <div className="fs-thread">
                <Collapse open={s.sent} reveal="drop" from="below">
                  <div className="fs-q"><Text wrap>{MSG}</Text></div>
                </Collapse>
                <Collapse open={s.phase === 'thinking'}>
                  <Text className="fs-thinking">思考中</Text>
                </Collapse>
                <Collapse open={s.phase === 'tool' || s.phase === 'answer'}>
                  <div className="fs-tool">
                    <span className="fs-tool-name">SKILL · 查詢單據</span>
                    <span className="fs-tool-tag">權限控制</span>
                    <span className="fs-tool-state" data-done={s.phase === 'answer' || undefined}>{s.phase === 'answer' ? '完成' : '查詢中…'}</span>
                  </div>
                </Collapse>
                <Collapse open={s.phase === 'answer'}>
                  <div className="fs-a"><Stream className="fs-stream" text={ANSWER} count={s.words} /></div>
                </Collapse>
              </div>
              <div data-target="composer" data-cursor="ibeam">
                <Field className="fs-composer" value={s.draft} placeholder="貼上對話,讓 AI 查" focused={!s.sent} />
              </div>
            </div>
          </Window>

          <Toast show={s.copied} className="fs-toast">已複製</Toast>
        </>
      )}
    </Stage>
  );
}
