const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];

const IC = {
  design: 'M12 3a9 9 0 100 18c1.7 0 2-1 1.4-2-.6-1 0-2 1.2-2H17a4 4 0 004-4c0-5-4-10-9-10zM7.5 11h.01M10 7h.01M15 7h.01',
  dev: 'M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14',
  mkt: 'M3 17l6-6 4 4 8-8M15 7h6v6',
  odoo: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  wp: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  sup: 'M4 14v-2a8 8 0 0116 0v2M4 14h3v5H4zM17 14h3v5h-3z'
};

const ico = k => `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="${IC[k]}"/></svg>`;

/* Render data-ico */
$$('[data-ico]').forEach(e => {
  if (IC[e.dataset.ico]) e.innerHTML = ico(e.dataset.ico);
});

/* Mobile Menu */
const bg = $('#burger'), mn = $('#mnav');
if (bg && mn) {
  const setMenu = o => {
    mn.classList.toggle('open', o);
    bg.setAttribute('aria-expanded', String(o));
  };
  bg.onclick = () => setMenu(!mn.classList.contains('open'));
  $$('a', mn).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('resize', () => innerWidth >= 768 && setMenu(false));
}

/* Sticky Header */
const hd = $('.hdr');
if (hd) {
  const stick = () => hd.classList.toggle('stuck', scrollY > 8);
  stick();
  addEventListener('scroll', stick, { passive: true });
}

/* FAQ Accordion */
$$('.faq button').forEach(b => {
  b.onclick = () => {
    const a = b.nextElementSibling;
    if (!a) return;
    const o = !a.classList.contains('open');
    a.classList.toggle('open', o);
    b.setAttribute('aria-expanded', String(o));
  };
});

/* API Base URL - relative by default for same origin Astro server */
const getApiBase = () => {
  if (window.API_BASE_URL) return window.API_BASE_URL.replace(/\/+$/, '');
  const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname) || location.protocol === 'file:';
  if (isLocal && location.port !== '' && location.port !== '3000' && location.port !== '4321') {
    // Fallback if needed
    return '';
  }
  return '';
};

/* Contact / Inquiries Form */
const f = $('#cform');
if (f) {
  f.onsubmit = async e => {
    e.preventDefault();
    const btn = $('button', f), ok = $('#ok');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
    try {
      const d = Object.fromEntries(new FormData(f));
      const apiEndpoint = `${getApiBase()}/api/inquiries`;
      const r = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d)
      });
      const resData = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(resData.error || 'Submission failed');
      if (ok) {
        ok.style.color = '#15803d';
        ok.textContent = "Thanks! We've received your inquiry and will reply within one business day.";
        ok.hidden = false;
      }
      f.reset();
    } catch (err) {
      if (ok) {
        ok.style.color = '#b91c1c';
        ok.textContent = err.message && err.message !== 'Submission failed'
          ? err.message
          : 'Something went wrong. Please email gswebit23@gmail.com directly.';
        ok.hidden = false;
      }
    }
    if (btn) { btn.disabled = false; btn.textContent = 'Send inquiry'; }
  };
}

/* Scroll reveal + counters */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const auto = '.main-rv, main .head, main .card, main .proj, main .quote, main .stats>div, main .steps>div, main .faq>div, main .split>*, main .cta-box, main .contact, main .narrow>*';
  $$(auto).forEach(el => {
    if (el.closest('.hero,.pg-head')) return;
    el.classList.add('rv');
    const parent = el.parentElement;
    if (parent) {
      const sib = [...parent.children].filter(x => x.classList.contains('rv')), i = sib.indexOf(el);
      if (parent.matches('.grid,.stats,.steps,.faq')) el.style.setProperty('--d', Math.min(i, 5) * .09 + 's');
      if (parent.matches('.split')) el.classList.add(i ? 'r' : 'l');
    }
  });

  const count = el => {
    const m = el.textContent.trim().match(/^(\d+)(.*)$/);
    if (!m) return;
    const n = +m[1], suf = m[2];
    if (reduce) { el.textContent = n + suf; return; }
    const t0 = performance.now(), dur = 1400, tick = t => {
      const k = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - k, 4);
      el.textContent = Math.round(n * e) + suf;
      k < 1 && requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const t = e.target;
    t.classList.add('in');
    if (t.matches('.stats>div')) {
      const b = $('b', t);
      if (b) count(b);
    }
    io.unobserve(t);
  }), { threshold: .15, rootMargin: '0px 0px -6% 0px' });

  $$('.rv:not(.hero .rv):not(.pg-head .rv),.steps').forEach(el => io.observe(el));
  if (!('IntersectionObserver' in window)) $$('.rv').forEach(e => e.classList.add('in'));
})();

/* Template previews: scale 1280px-wide live iframes to fit their card */
(() => {
  const fit = f => {
    const w = +f.dataset.w || 1280, h = +f.dataset.h || 853;
    const parentWidth = f.parentElement ? f.parentElement.clientWidth : 1280;
    const k = parentWidth / w;
    f.style.setProperty('--k', String(k));
    f.style.setProperty('--w', w + 'px');
    f.style.setProperty('--h', h + 'px');
  };
  const frames = $$('.frame');
  if (!frames.length) return;
  frames.forEach(fit);
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(es => es.forEach(e => fit(e.target.querySelector('.frame') || e.target)));
    frames.forEach(f => {
      if (f.parentElement) ro.observe(f.parentElement);
    });
  } else {
    addEventListener('resize', () => frames.forEach(fit));
  }

  /* Filter chips */
  const chips = $$('.chip');
  chips.forEach(c => c.onclick = () => {
    chips.forEach(x => {
      const on = x === c;
      x.classList.toggle('on', on);
      x.setAttribute('aria-pressed', String(on));
    });
    $$('#tplGrid .tpl').forEach(t => {
      const show = c.dataset.f === 'all' || t.dataset.cat === c.dataset.f;
      t.hidden = !show;
      if (show) t.classList.add('in');
    });
    frames.forEach(fit);
  });
})();

/* Contact page: pre-fill message from ?template=... */
(() => {
  const t = new URLSearchParams(location.search).get('template');
  const m = $('#cform textarea'), sel = $('#cform select');
  if (t && sel) {
    const o = [...sel.options].find(x => x.text === 'Website template');
    if (o) sel.value = o.value;
  }
  if (t && m && !m.value) {
    m.value = "Hi, I'm interested in the " + t.replace(/-/g, ' ') + " template. Please share pricing and next steps.";
  }
})();
