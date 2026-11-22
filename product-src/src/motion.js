import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
export const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// 讓文字逐字「打」進元素(直接改 DOM,避免 React 重繪)
export function typeInto(el, text, duration) {
  const o = { n: 0 };
  return gsap.to(o, {
    n: text.length, duration, ease: 'none',
    onUpdate: () => { el.textContent = text.slice(0, Math.round(o.n)); },
  });
}

// 進入視窗時播放、離開時暫停;用 IntersectionObserver,不受上方 pin 區塊的位置影響
export function playWhenVisible(el, tl) {
  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? tl.play() : tl.pause()), { threshold: 0.35 });
  io.observe(el);
  return () => io.disconnect();
}
