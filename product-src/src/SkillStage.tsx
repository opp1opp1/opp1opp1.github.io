import { Stage, Window, type Act } from './kit';
import { useSiteTheme } from './useSiteTheme.js';
import './skill-stage.css';

// 示意:與 AI 一起寫 SKILL,並在寫的時候就設好界線。
// 規則文字為示意;帳號說明依實際做法:AI 使用專用帳號,權限低於一般使用者。
const LINES = [
  { text: 'name: 查詢單據', chip: null },
  { text: 'allow:   SELECT', chip: ['直接執行', 'ok'] },
  { text: 'consent: INSERT', chip: ['需使用者同意', 'warn'] },
  { text: 'deny:    UPDATE · DELETE · DROP', chip: ['禁止', 'bad'] },
  { text: 'account: AI 專用帳號', chip: ['權限低於一般使用者', 'info'] },
] as const;
const FULL = LINES.map((l) => l.text).join('\n');

type S = { typed: string };
const initial: S = { typed: '' };
const poster: S = { typed: FULL };

async function script(a: Act<S>) {
  await a.wait(700);
  await a.type('typed', FULL, { interval: 34 });
  await a.wait(5200);
}

export default function SkillStage() {
  const theme = useSiteTheme();
  return (
    <Stage
      width={760}
      height={330}
      compact={{ below: 560, width: 358, height: 330 }}
      initial={initial}
      poster={poster}
      script={script}
      play="once"
      fill
      theme={theme}
      accent={theme === 'dark' ? '#6d9bff' : '#1f5eff'}
      tokens={{ '--ss-font': '"Noto Sans TC", system-ui, sans-serif' }}
      className="sk"
    >
      {(s) => {
        const rows = s.typed.split('\n');
        return (
          <Window title="SKILL · 查詢單據" className="sk-win" toolbar={<span className="sk-with">與 AI 一起寫</span>}>
            <div className="sk-body">
              {rows.map((row, i) => {
                const spec = LINES[i];
                const done = i < rows.length - 1 || s.typed === FULL; // 該行打完才顯示標籤
                const [key, ...rest] = row.split(/(?<=:)\s+/);
                return (
                  <div className="sk-line" key={i}>
                    <span className="sk-key">{key}</span>
                    <span className="sk-val">{rest.join(' ')}</span>
                    {i === rows.length - 1 && s.typed !== FULL && <i className="sk-caret" />}
                    {spec?.chip && (
                      <span className="sk-chip" data-tone={spec.chip[1]} data-on={done || undefined}>{spec.chip[0]}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </Window>
        );
      }}
    </Stage>
  );
}
