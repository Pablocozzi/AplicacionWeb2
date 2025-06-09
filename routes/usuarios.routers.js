
import { Router } from 'express';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { get_user_byId } from '../utils/usuarios.js';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usuariosPath = path.join(__dirname, '../data/usuarios.json');
const SECRET = 'secreto123';

let userData = [];
try {
  const data = await readFile(usuariosPath, 'utf-8');
  userData = JSON.parse(data);
} catch (err) {
  console.error('Error al leer usuarios.json:', err);
  userData = [];
}

router.post('/register', async (req, res) => {
  const { name, username, email, pass } = req.body;

  const yaExiste = userData.find(u => u.username === username || u.userName === username);
  if (yaExiste) {
    return res.status(400).json({ mensaje: 'Usuario ya registrado' });
  }

  const hash = await bcrypt.hash(pass, 10);

  const nuevoUsuario = {
    id: Date.now(),
    name,
    username,
    email,
    pass: hash
  };

  userData.push(nuevoUsuario);
  await writeFile(usuariosPath, JSON.stringify(userData, null, 2));
  res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
});

router.post('/login', async (req, res) => {
  const { username, pass } = req.body;

  const user = userData.find(u =>
    u.username === username || u.userName === username
  );

  if (!user) {
    return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }

  if (user.pass.startsWith('$2b$')) {
    const match = await bcrypt.compare(pass, user.pass);
    if (!match) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
  } else {
    if (user.pass !== pass) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }
  }

  const token = jwt.sign(
    { id: user.id, usuario: user.username || user.userName },
    SECRET,
    { expiresIn: '2h' }
  );

  res.status(200).json({
    mensaje: `Bienvenido ${user.name}`,
    token
  });
});

router.get('/byId/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const result = get_user_byId(id);

  if (result) {
    res.status(200).json(result);
  } else {
    res.status(404).json({ mensaje: `${id} no se encuentra` });
  }
});

router.delete('/delete/:userID', async (req, res) => {
  const user_id = parseInt(req.params.userID);
  const index = userData.findIndex(e => e.id === user_id);

  try {
    if (index !== -1) {
      userData.splice(index, 1);
      await writeFile(usuariosPath, JSON.stringify(userData, null, 2));
      res.status(200).json({ mensaje: 'Usuario eliminado' });
    } else {
      res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar usuario' });
  }
});

export default router;