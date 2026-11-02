(() => {
  'use strict';
  const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(pointer:fine)').matches;
  const glow = $('.glow');
  if (fine && !reduce) addEventListener('pointermove', e => { glow.style.setProperty('--gx', e.clientX + 'px'); glow.style.setProperty('--gy', e.clientY + 'px'); }, { passive: true });
  $$('.b').forEach(b => b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.setProperty('--mx', e.clientX - r.left + 'px'); b.style.setProperty('--my', e.clientY - r.top + 'px'); }));
  if (fine && !reduce) $$('.mag').forEach(m => {
    m.addEventListener('pointermove', e => { const r = m.getBoundingClientRect(); m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .2}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; });
    m.addEventListener('pointerleave', () => m.style.transform = '');
  });
  const rot = $('.rot');
  if (rot && !reduce) { const w = JSON.parse(rot.dataset.words); let i = 0;
    setInterval(() => { rot.classList.add('out'); setTimeout(() => { i = (i + 1) % w.length; rot.textContent = w[i]; rot.classList.remove('out'); rot.classList.add('pre'); void rot.offsetWidth; rot.classList.remove('pre'); }, 450); }, 2600); }
})();
