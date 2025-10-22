// Servidor simple de registro e inicio de sesión
// No está relacionado con ningún almacén; es un ejemplo genérico y didáctico.

// Importaciones
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

// Configuración
const app = express();
const PORT = process.env.PORT || 3000;
const USERS_FILE = path.join(__dirname, 'users.json');
const SALT_ROUNDS = 10;

app.use(bodyParser.json()); // permite recibir JSON en el body

// Lee users.json; si no existe, lo crea con estructura vacía
function readUsersFile() {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [] }, null, 2));
    }
    const raw = fs.readFileSync(USERS_FILE);
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error leyendo users.json:', err);
    return { users: [] };
  }
}

// Guarda el objeto en users.json
function writeUsersFile(data) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error escribiendo users.json:', err);
  }
}

// Ruta: registro
// Recibe { username, password }
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validación mínima
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Usuario y contraseña requeridos.' });
    }

    const db = readUsersFile();
    const existing = db.users.find(u => u.username === username);
    if (existing) {
      return res.status(409).json({ success: false, message: 'El usuario ya existe.' });
    }

    // Hashear contraseña
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = {
      id: Date.now(),
      username,
      password: hashed
    };

    db.users.push(newUser);
    writeUsersFile(db);

    return res.status(201).json({ success: true, message: 'Registro exitoso.' });
  } catch (err) {
    console.error('Error en /register:', err);
    return res.status(500).json({ success: false, message: 'Error del servidor.' });
  }
});

// Ruta: login
// Recibe { username, password }
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Usuario y contraseña requeridos.' });
    }

    const db = readUsersFile();
    const user = db.users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Error en la autenticación.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Error en la autenticación.' });
    }

    // Autenticación correcta
    return res.status(200).json({ success: true, message: 'Autenticación satisfactoria.' });
  } catch (err) {
    console.error('Error en /login:', err);
    return res.status(500).json({ success: false, message: 'Error del servidor.' });
  }
});

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Servicio de autenticación activo. Usa /register y /login.');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});