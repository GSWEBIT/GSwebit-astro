(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = $('#nav'), burger = $('.burger'), menu = $('#menu');
  const stick = () => nav.classList.toggle('stuck', scrollY > 24);
  addEventListener('scroll', stick, { passive: true }); stick();
  const toggle = (o) => { burger.setAttribute('aria-expanded', o); menu.classList.toggle('open', o); document.body.style.overflow = o ? 'hidden' : ''; };
  burger.addEventListener('click', () => toggle(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach(a => a.addEventListener('click', () => toggle(false)));
  addEventListener('keydown', e => e.key === 'Escape' && toggle(false));
  const count = (el) => {
    const m = el.dataset.count.match(/^(\D*)([\d.,]+)(.*)$/); if (!m || reduce) return;
    const end = parseFloat(m[2].replace(/,/g, '')), dec = (m[2].split('.')[1] || '').length, t0 = performance.now();
    const f = (t) => { const p = Math.min((t - t0) / 1600, 1), v = end * (1 - Math.pow(1 - p, 4)); el.textContent = m[1] + (dec ? v.toFixed(dec) : Math.round(v).toLocaleString()) + m[3]; if (p < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; e.target.classList.add('in'); $$('[data-count]', e.target).forEach(count); io.unobserve(e.target);
  }), { threshold: .12, rootMargin: '0px 0px -5% 0px' });
  $$('[data-r],[data-clip]').forEach(el => io.observe(el));
  const form = $('#cform'); if (!form) return;
  const status = $('.status', form), btn = $('button', form), label = btn.textContent;
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); status.className = 'status';
    const bad = $$('[required]', form).filter(i => { const ok = i.checkValidity() && i.value.trim(); i.classList.toggle('invalid', !ok); return !ok; });
    if (bad.length) { status.textContent = 'Please fill in the highlighted fields.'; status.classList.add('err'); bad[0].focus(); return; }
    btn.disabled = true; btn.textContent = 'Sending…';
    try { const j = await (await fetch(form.action, { method: 'POST', body: new FormData(form) })).json();
      status.textContent = j.message; status.classList.add(j.ok ? 'ok' : 'err'); if (j.ok) form.reset();
    } catch { status.textContent = 'Network error. Please try again or email us directly.'; status.classList.add('err'); }
    btn.disabled = false; btn.textContent = label;
  });
})();
