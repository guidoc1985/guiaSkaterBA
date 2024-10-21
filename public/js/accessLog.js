document.addEventListener('DOMContentLoaded', () => {
    // Verificar si el usuario está en 'spots.html'
    if (window.location.pathname.endsWith('login.html')) {
      const isAuthenticated = localStorage.getItem('token'); // Verifica si el token está almacenado
  
      if (isAuthenticated) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: "Ya estás logueado, cerra sesión si queres crear otro usuario!",
          confirmButtonText: 'OK'
        }).then(() => {
          // Redirige a la página de login después de que el usuario cierre el SweetAlert
          window.location.href = 'index.html'; 
        });
      }
    }
  });