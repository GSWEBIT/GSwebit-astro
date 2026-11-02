(() => {
  'use strict';
  const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bar = $('.bar'), cols = $$('.col'); let tick = false;
  const frame = () => { tick = false; const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    bar.style.setProperty('--p', max > 0 ? y / max : 0);
    if (!reduce && y < innerHeight * 1.3) cols.forEach(c => c.style.transform = `translateY(${y * parseFloat(c.dataset.par)}px)`); };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(frame); } }, { passive: true }); frame();
  const rail = $('.rail');
  if (rail) { let down = false, sx = 0, sl = 0;
    rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = rail.scrollLeft; rail.classList.add('drag'); });
    addEventListener('pointerup', () => { down = false; rail.classList.remove('drag'); });
    addEventListener('pointermove', e => { if (down) rail.scrollLeft = sl - (e.clientX - sx); }); }
  const q = $$('.quotes blockquote'), d = $$('.dots button'); let k = 0, t;
  const show = (n) => { k = n; q.forEach((b, i) => b.classList.toggle('on', i === n)); d.forEach((b, i) => b.classList.toggle('on', i === n)); };
  const auto = () => { clearInterval(t); if (!reduce && q.length > 1) t = setInterval(() => show((k + 1) % q.length), 6000); };
  d.forEach((b, i) => b.addEventListener('click', () => { show(i); auto(); })); auto();
})();
