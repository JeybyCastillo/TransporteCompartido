//Conexion a la base de datos.

const mysql = require('mysql2');

// Crea la conexión 
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '',
  database: 'transportecompartido' 
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos exitosa');
});

module.exports = db;
