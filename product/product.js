document.getElementById('year').textContent = new Date().getFullYear();

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// cursor glow (works without GSAP)
const glow = document.querySelector('.glow');
addEventListener('pointermove', e => {
  glow.style.setProperty('--x', e.clientX + 'px');
  glow.style.setProperty('--y', e.clientY + 'px');
});

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

  // BEFORE -> AFTER (pinned, scrubbed)
  const ba = gsap.timeline({
    scrollTrigger: { trigger: '.ba', start: 'top top', end: '+=130%', scrub: .6, pin: true }
  });
  gsap.set('.ba-chips li', { opacity: 0, y: 20 });
  ba.to('.ba-chips li', { opacity: 1, y: 0, stagger: .08, duration: .4 })
    .to({}, { duration: .5 })
    .to('.ba-chips li', { opacity: 0, filter: 'blur(10px)', scale: .6, y: -30, stagger: { each: .06, from: 'random' }, duration: .5 })
    .to('.l-before', { opacity: 0, duration: .3 }, '<')
    .to('.l-after', { opacity: 1, duration: .3 }, '<+=.3')
    .fromTo('.ba-after', { opacity: 0, scale: .85, filter: 'blur(14px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: .8 }, '<')
    .to('.ba-caption', { opacity: 1, y: -10, duration: .5 });
}
