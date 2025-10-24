// index.js - servidor mínimo de registro y login

const express = require('express'); // web
const bcrypt = require('bcrypt');   // hash contraseñas
const fs = require('fs');           // leer/escribir archivo
const path = require('path');       // rutas
const app = express();
const PORT = process.env.PORT || 3000;
const USERS_FILE = path.join(__dirname, 'users.json');
const SALT = 10;

app.use(express.json()); // parse JSON
app.use(express.static(path.join(__dirname, 'public'))); // servir frontend

// lee users.json (crea si no existe)
function readUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [] }, null, 2));
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } catch {
    return { users: [] };
  }
}

// escribe users.json
function writeUsers(data) {
  try { fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2), 'utf8'); } catch {}
}

// REGISTRAR
app.post('/register', async (req, res) => {
  console.log('POST /register', req.body); // log corto
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: 'Usuario y contraseña requeridos.' });

  const db = readUsers();
  if (db.users.find(u => u.username === username)) return res.status(409).json({ success: false, message: 'El usuario ya existe.' });

  const hash = await bcrypt.hash(password, SALT);
  db.users.push({ id: Date.now(), username, password: hash });
  writeUsers(db);
  return res.status(201).json({ success: true, message: 'Registro exitoso.' });
});

// LOGIN
app.post('/login', async (req, res) => {
  console.log('POST /login', req.body);
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: 'Usuario y contraseña requeridos.' });

  const db = readUsers();
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ success: false, message: 'Error en la autenticación.' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ success: false, message: 'Error en la autenticación.' });

  return res.status(200).json({ success: true, message: 'Autenticación satisfactoria.' });
});

// raíz -> servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));