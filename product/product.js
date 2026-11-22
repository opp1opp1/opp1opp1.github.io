document.getElementById('year').textContent = new Date().getFullYear();

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// cursor glow (works without GSAP)
const glow = document.querySelector('.glow');
addEventListener('pointermove', e => {
  glow.style.setProperty('--x', e.clientX + 'px');
  glow.style.setProperty('--y', e.clientY + 'px');
});

// count-up fallback: show final value if animation can't run
const counts = document.querySelectorAll('.count');
const fmt = n => Math.round(n).toLocaleString('en-US');
counts.forEach(el => { el.textContent = fmt(+el.dataset.to); });

if (!reduce && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  // hero intro
  gsap.from('.split', { yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: .15 });
  gsap.from('.hero .reveal', { y: 20, opacity: 0, duration: .9, ease: 'power3.out', stagger: .12, delay: .5 });

  // 傳統 × 現代 → 融合 (pinned, scrubbed)
  gsap.set('.w-left', { xPercent: -120 });
  gsap.set('.w-right', { xPercent: 120 });
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '.merge', start: 'top top', end: '+=140%', scrub: .6, pin: true }
  });
  tl.to('.w-left', { xPercent: -28, duration: 1 }, 0)
    .to('.w-right', { xPercent: 28, duration: 1 }, 0)
    .to('.w-left, .w-right', { xPercent: 0, scale: .9, duration: 1 })
    .to('.w-left, .w-right', { opacity: 0, filter: 'blur(14px)', duration: .6 })
    .fromTo('.w-center', { opacity: 0, scale: .7 }, { opacity: 1, scale: 1, duration: .8 }, '<')
    .to('.merge-caption', { opacity: 1, y: -10, duration: .5 });

  // generic reveals
  gsap.utils.toArray('main section:not(.hero) .reveal').forEach(el => {
    gsap.from(el, { y: 40, opacity: 0, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  // count-up
  counts.forEach(el => {
    const o = { v: 0 };
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () =>
      gsap.to(o, { v: +el.dataset.to, duration: 1.8, ease: 'power2.out', onUpdate: () => el.textContent = fmt(o.v) }) });
  });
}
