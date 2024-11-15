// Archivo app.js -- ruta pages/app.js--- AQUI SE DEFINIERON LAS RUTAS DE CADA PAGINA 

const express = require('express');
const path = require('path');
const fs = require('fs');
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
  res.render('rutas-de-viaje');  // Aquí se renderiza el archivo ejs
});


// Ruta para manejar el registro de usuarios
app.post('/registrar', (req, res) => {
  const { nombre, email, password } = req.body;

  // Leer usuarios del archivo JSON
  fs.readFile('usuarios.json', (err, data) => {
    if (err) throw err;
    const usuarios = JSON.parse(data) || [];

    // Verificar si el usuario ya existe
    const usuarioExistente = usuarios.find(usuario => usuario.email === email);
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "Este correo ya está registrado." });
    }

    // Agregar nuevo usuario
    const nuevoUsuario = { nombre, email, password };
    usuarios.push(nuevoUsuario);

    // Guardar en el archivo JSON
    fs.writeFile('usuarios.json', JSON.stringify(usuarios), (err) => {
      if (err) throw err;
      res.json({ mensaje: "Registro exitoso.", redirigir: "/home" });
    });
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
