(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // sticky nav + mobile menu
  const nav = $('#nav'), burger = $('.burger'), menu = $('#menu');
  const onScroll = () => nav.classList.toggle('stuck', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const toggle = (open) => { burger.setAttribute('aria-expanded', open); menu.classList.toggle('open', open); document.body.style.overflow = open ? 'hidden' : ''; };
  burger.addEventListener('click', () => toggle(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach(a => a.addEventListener('click', () => toggle(false)));
  addEventListener('keydown', e => e.key === 'Escape' && toggle(false));

  // scroll reveal + count-up (runs once)
  const count = (el) => {
    const m = el.dataset.count.match(/^(\D*)([\d.,]+)(.*)$/); if (!m || reduce) return;
    const end = parseFloat(m[2].replace(/,/g, '')), t0 = performance.now(), dur = 1400;
    const step = (t) => { const p = Math.min((t - t0) / dur, 1), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.textContent = m[1] + v.toLocaleString() + m[3]; if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((es) => es.forEach(e => {
    if (!e.isIntersecting) return; e.target.classList.add('in'); $$('[data-count]', e.target).forEach(count); io.unobserve(e.target);
  }), { threshold: .15, rootMargin: '0px 0px -6% 0px' });
  $$('[data-r]').forEach(el => io.observe(el));

  // active link highlight
  const links = $$('.menu a[href^="#"]:not(.btn)');
  const so = new IntersectionObserver((es) => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('on', l.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  links.forEach(l => { const s = $(l.getAttribute('href')); s && so.observe(s); });

  // FAQ: one open at a time
  $$('.qa').forEach(d => d.addEventListener('toggle', () => d.open && $$('.qa').forEach(o => o !== d && (o.open = false))));

  // contact form (AJAX; works without JS via normal POST fallback to the JSON endpoint)
  const form = $('#cform'); if (!form) return;
  const status = $('.status', form), btn = $('button', form);
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); status.className = 'status';
    const bad = $$('[required]', form).filter(i => { const ok = i.checkValidity() && i.value.trim(); i.classList.toggle('invalid', !ok); return !ok; });
    if (bad.length) { status.textContent = 'Please fill in the highlighted fields.'; status.classList.add('err'); bad[0].focus(); return; }
    btn.disabled = true; btn.textContent = 'Sending…';
    try {
      const r = await fetch(form.action, { method: 'POST', body: new FormData(form) }), j = await r.json();
      status.textContent = j.message; status.classList.add(j.ok ? 'ok' : 'err');
      if (j.ok) form.reset();
    } catch { status.textContent = 'Network error. Please try again or email us directly.'; status.classList.add('err'); }
    btn.disabled = false; btn.textContent = 'Send message';
  });
})();
