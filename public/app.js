// public/app.js - envía POST y muestra mensajes

const $ = id => document.getElementById(id);
const show = (el, txt, ok=true) => { el.textContent = txt; el.style.color = ok ? 'green' : 'crimson'; };

async function post(url, body) {
  const r = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
  const data = await r.json().catch(()=>({ message: 'No JSON' }));
  return { ok: r.ok, data };
}

$('reg').onclick = async () => {
  const res = await post('/register', { username: $('ruser').value, password: $('rpass').value });
  show($('rmsg'), res.data.message || 'Error', res.ok);
};

$('log').onclick = async () => {
  const res = await post('/login', { username: $('luser').value, password: $('lpass').value });
  show($('lmsg'), res.data.message || 'Error', res.ok);
};