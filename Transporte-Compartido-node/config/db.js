const mysql = require('mysql2');

// Configuracion para la conexión con la base de datos
const connection = mysql.createConnection({
  host: 'localhost', // Dirección del servidor MySQL 
  user: 'root',      // Usuario de MySQL
  password: '',      // Contraseña
  database: 'transportecompartido' // Nombre de la base de datos
});

// Probar la conexión
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos.');
});

module.exports = connection;
