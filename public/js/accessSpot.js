document.addEventListener('DOMContentLoaded', () => {
    // Verificar si el usuario está en 'spots.html'
    if (window.location.pathname.endsWith('spots.html')) {
      const isAuthenticated = localStorage.getItem('token'); // Verifica si el token está almacenado
  
      if (!isAuthenticated) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: "Necesitas crear un usuario y loguearte para crear el spot!",
          confirmButtonText: 'OK'
        }).then(() => {
          // Redirige a la página de login después de que el usuario cierre el SweetAlert
          window.location.href = 'registrate.html'; 
        });
      }
    }
  });