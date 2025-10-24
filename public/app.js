// app.js — envía POST a /register y /login usando fetch

function showMessage(el, text, ok = true) {
  el.textContent = text;
  el.style.color = ok ? 'green' : 'crimson';
}

// Registrar
document.getElementById('btn-register').addEventListener('click', async () => {
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value.trim();
  const msgEl = document.getElementById('reg-msg');

  if (!username || !password) {
    showMessage(msgEl, 'Usuario y contraseña son requeridos.', false);
    return;
  }

  try {
    const res = await fetch('/register', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) {
      showMessage(msgEl, data.message, true);
    } else {
      showMessage(msgEl, data.message || 'Error en el registro', false);
    }
  } catch (err) {
    showMessage(msgEl, 'Error de conexión.', false);
  }
});

// Login
document.getElementById('btn-login').addEventListener('click', async () => {
  const username = document.getElementById('log-username').value.trim();
  const password = document.getElementById('log-password').value.trim();
  const msgEl = document.getElementById('log-msg');

  if (!username || !password) {
    showMessage(msgEl, 'Usuario y contraseña son requeridos.', false);
    return;
  }

  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) {
      showMessage(msgEl, data.message, true);
    } else {
      showMessage(msgEl, data.message || 'Error en la autenticación', false);
    }
  } catch (err) {
    showMessage(msgEl, 'Error de conexión.', false);
  }
});
