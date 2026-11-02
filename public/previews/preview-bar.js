/* GSWebIT template-preview helper: floating bar + demo-safe forms */
(()=>{
  const name=document.documentElement.dataset.tplName||document.title.split(/[—|\-]/)[0].trim();
  const css=`#gsw-bar{position:fixed;left:50%;bottom:16px;z-index:2147483000;display:flex;align-items:center;gap:6px;padding:6px 6px 6px 14px;border-radius:999px;background:rgba(15,23,42,.92);color:#fff;font:600 13px/1 Inter,system-ui,sans-serif;box-shadow:0 12px 32px -8px rgba(0,0,0,.5);backdrop-filter:blur(8px);max-width:calc(100vw - 24px);transform:translate(-50%,24px);opacity:0;animation:gswIn .6s .8s cubic-bezier(.22,.8,.3,1) forwards}
#gsw-bar span{opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:6px}
#gsw-bar a{padding:9px 14px;border-radius:999px;text-decoration:none;white-space:nowrap;color:#fff;transition:transform .25s,background .2s}
#gsw-bar a.p{background:#ea580c}#gsw-bar a.p:hover{background:#c2410c;transform:translateY(-1px)}
#gsw-bar a.s{background:rgba(255,255,255,.12)}#gsw-bar a.s:hover{background:rgba(255,255,255,.22)}
#gsw-toast{position:fixed;left:50%;top:18px;transform:translateX(-50%);z-index:2147483001;background:#0f172a;color:#fff;padding:12px 18px;border-radius:12px;font:500 14px/1.4 Inter,system-ui,sans-serif;box-shadow:0 12px 32px -8px rgba(0,0,0,.5)}
@keyframes gswIn{to{transform:translate(-50%,0);opacity:1}}
@media(max-width:520px){#gsw-bar span{display:none;}#gsw-bar{padding-left:6px}}
@media(prefers-reduced-motion:reduce){#gsw-bar{animation:none;opacity:1;transform:translate(-50%,0)}}`;
  const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  const bar=document.createElement('div');bar.id='gsw-bar';
  bar.innerHTML=`<span>Template preview · ${name.replace(/</g,'&lt;')}</span><a class="s" href="../../templates.html">← All templates</a><a class="p" href="../../contact.html?template=${encodeURIComponent(name)}">Get this template</a>`;
  document.body.appendChild(bar);
  // forms in previews are demos: never POST anywhere
  const toast=m=>{let t=document.getElementById('gsw-toast');t&&t.remove();t=document.createElement('div');t.id='gsw-toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),3200)};
  document.addEventListener('submit',e=>{
    e.preventDefault();e.stopImmediatePropagation();
    toast('This is a demo preview — forms are disabled. Contact GSWebIT to get this template.');
  },true);
})();
