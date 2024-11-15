// Archivo para añadir las rutas y conexiones con la base de datos
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt'); // Importar bcrypt
const db = require('./config/db');
const app = express();
const port = 3000;

// Configuración del motor de plantillas
app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'ejs');

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
  res.render('index');
});

// Ruta para la página de registro
app.get('/registro', (req, res) => {
  res.render('registro');
});

// Ruta para la página de inicio ("Home") tras iniciar sesión o registrarse
app.get('/home', (req, res) => {
  res.render('home');
});

// Ruta para la página perfil de usuario
app.get('/perfil', (req, res) => {
  res.render('perfil');
});

// Ruta para la página de rutas de viaje
app.get('/rutas', (req, res) => {
  res.render('rutas-de-viaje'); // Renderizar el archivo EJS
});

// Ruta para manejar el registro de usuarios
app.post('/registrar', (req, res) => {
  const { nombre, email, password } = req.body;

  // Verificar si el usuario ya existe
  db.query('SELECT * FROM usuarios WHERE correo = ?', [email], (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).send('Error en el servidor.');
    }

    if (results.length > 0) {
      return res.status(400).json({ mensaje: "Este correo ya está registrado." });
    }

    // Hashear la contraseña antes de almacenarla
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error al hashear la contraseña:', err);
        return res.status(500).send('Error al procesar la contraseña.');
      }

      // Insertar un nuevo usuario con la contraseña hasheada
      const sql = 'INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)';
      db.query(sql, [nombre, email, hashedPassword], (err, results) => {
        if (err) {
          console.error('Error al insertar el usuario:', err);
          return res.status(500).send('Error en el servidor.');
        }

        res.json({ mensaje: "Registro exitoso.", redirigir: "/home" });
      });
    });
  });
});

// Ruta para manejar el inicio de sesión de usuarios
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Verificar si el usuario existe
  db.query('SELECT * FROM usuarios WHERE correo = ?', [email], (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).send('Error en el servidor.');
    }

    if (results.length === 0) {
      return res.status(400).json({ mensaje: "Usuario no encontrado." });
    }

    const usuario = results[0];

    // Comparar la contraseña ingresada con el hash de la base de datos
    bcrypt.compare(password, usuario.contraseña, (err, isMatch) => {
      if (err) {
        console.error('Error al comparar contraseñas:', err);
        return res.status(500).send('Error en el servidor.');
      }

      if (!isMatch) {
        return res.status(400).json({ mensaje: "Contraseña incorrecta." });
      }

      // Autenticación exitosa
      res.json({ mensaje: "Login exitoso", redirigir: "/home" });
    });
  });
});

// Middleware para manejar errores genéricos
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal en el servidor.');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
