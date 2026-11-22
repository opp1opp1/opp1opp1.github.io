import gsap from 'gsap';

export { gsap };
export const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export const fmt = s => {
  s = Math.max(0, Math.floor(s));
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
};
