// public/js/auth.js

// Usuario de prueba (almacenado en localStorage)
const usuarioPrueba = {
  email: "Cronos01@gmail.com",
  password: "Tiempo"
};

// Función para mostrar alertas
function showAlert(message, type) {
  const alert = document.getElementById('alert');
  alert.textContent = message;
  alert.className = `alert ${type === 'success' ? 'alert-success' : 'alert-error'}`;
  alert.style.display = 'block';

  // Ocultar la alerta después de 3 segundos
  setTimeout(() => {
      alert.style.display = 'none';
  }, 3000);
}

// Función para autenticar el usuario
function autenticarUsuario(email, password) {
  // Verificar si el usuario de prueba coincide
  if (email === usuarioPrueba.email && password === usuarioPrueba.password) {
      return { success: true, message: 'Inicio de sesión exitoso (usuario de prueba).' };
  }

  // Verificar en LocalStorage si el usuario está registrado
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuario = usuarios.find(usuario => usuario.email === email && usuario.password === password);

  if (usuario) {
      return { success: true, message: 'Inicio de sesión exitoso.' };
  }

  return { success: false, message: 'Credenciales incorrectas.' };
}

// Evento para manejar el formulario de inicio de sesión
document.getElementById('formLogin').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const { success, message } = autenticarUsuario(email, password);

  if (success) {
      showAlert(message, 'success');
      setTimeout(() => window.location.href = '/home', 1000);
  } else {
      showAlert(message, 'error');
  }
});

// Evento para mostrar/ocultar contraseña
document.getElementById('togglePassword').addEventListener('click', function () {
  const passwordField = document.getElementById('loginPassword');
  const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordField.setAttribute('type', type);

  // Cambiar el ícono de "ojito"
  this.textContent = type === 'password' ? '👁️' : '🙈';
});

/*  >_< ALL NICE HERE*/

/*AQUI COMIENZA LOS EVENTOS PARA REGISTRO DE USUARIO*/ 

document.getElementById('formLogin').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Enviar las credenciales al backend
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.mensaje === 'Login exitoso') {
      // Redirigir al home si el login es exitoso
      window.location.href = '/home';
    } else {
      // Mostrar error de login
      document.getElementById('alert').innerText = data.mensaje;
      document.getElementById('alert').style.display = 'block';
    }
  })
  .catch(error => {
    console.error('Error en la solicitud:', error);
  });
});


//EVENTOS DE LA PAGINA PERFIL 
// Muestra una vista previa de la imagen seleccionada
function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function () {
        const output = document.getElementById('profilePreview');
        output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}

// Permite hacer clic en la imagen para seleccionar un archivo
document.querySelector('.profile-image').addEventListener('click', () => {
    document.getElementById('profileInput').click();
});

// Manejador de evento para actualizar la ubicación del mapa

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('direccion-form');
    const inputDireccion = document.getElementById('direccion');
    const iframe = document.querySelector('.gmap_iframe');  // El iframe donde se mostrará el mapa
    
    // Manejador de eventos para cuando se envíe el formulario
    form.addEventListener('submit', function(e) {
      e.preventDefault();  // Prevenir la acción de redirección del formulario
  
      const direccion = inputDireccion.value.trim();  // Obtener la dirección del input
      if (direccion) {
        // Crear la URL de Google Maps con la dirección proporcionada
        const baseUrl = "https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=";
        const encodedDireccion = encodeURIComponent(direccion);  // Codificar la dirección correctamente
        const url = `${baseUrl}${encodedDireccion}&t=&z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed`;
  
        // Actualizar el src del iframe con la nueva dirección
        iframe.src = url;
      }
    });
  });

// Al cargar la página, cargar los datos de localStorage
document.addEventListener('DOMContentLoaded', function () {
  mostrarViajes();
});

// Obtener referencia al formulario y a la tabla
const formulario = document.querySelector('#viaje-form');
const tabla = document.querySelector('#viajes-table tbody');

// Agregar evento para el formulario
formulario.addEventListener('submit', function (event) {
  event.preventDefault(); // Prevenir la recarga de la página

  // Obtener valores del formulario
  const nombre = document.querySelector('#nombre').value;
  const destino = document.querySelector('#destino').value;
  const puntoDeEncuentro = document.querySelector('#punto-de-encuentro').value;
  const fecha = document.querySelector('#fecha').value;
  const capacidad = document.querySelector('#capacidad').value;
  const costo = document.querySelector('#costo').value;

  // Crear un objeto de viaje
  const nuevoViaje = {
    nombre,
    destino,
    puntoDeEncuentro,
    fecha,
    capacidad,
    costo
  };

  // Recuperar viajes existentes en localStorage
  const viajes = JSON.parse(localStorage.getItem('viajes')) || [];

  // Agregar el nuevo viaje
  viajes.push(nuevoViaje);

  // Guardar en localStorage
  localStorage.setItem('viajes', JSON.stringify(viajes));

  // Actualizar la tabla
  mostrarViajes();

  // Limpiar el formulario
  formulario.reset();
});

// Función para mostrar los viajes en la tabla
function mostrarViajes() {
  // Limpiar la tabla
  tabla.innerHTML = '';

  // Recuperar los datos de localStorage
  const viajes = JSON.parse(localStorage.getItem('viajes')) || [];

  // Iterar sobre los viajes y agregarlos a la tabla
  viajes.forEach((viaje, index) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td><a href="/perfil/${viaje.nombre}" class="nombre-link">${viaje.nombre}</a></td>
      <td>${viaje.destino}</td>
      <td>${viaje.puntoDeEncuentro}</td>
      <td>${viaje.fecha}</td>
      <td>${viaje.capacidad}</td>
      <td>${viaje.costo}</td>
      <td>
        <button class="btn-editar" data-index="${index}">Editar</button>
        <button class="btn-eliminar" data-index="${index}">Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });

  // Agregar eventos a los botones de eliminar
  document.querySelectorAll('.btn-eliminar').forEach((boton) => {
    boton.addEventListener('click', eliminarViaje);
  });

  // Aquí puedes agregar eventos para editar si es necesario
}

// Función para eliminar un viaje
function eliminarViaje(event) {
  const index = event.target.dataset.index;
  const viajes = JSON.parse(localStorage.getItem('viajes')) || [];
  viajes.splice(index, 1); // Eliminar el viaje del array
  localStorage.setItem('viajes', JSON.stringify(viajes)); // Actualizar localStorage
  mostrarViajes(); // Actualizar la tabla
}
