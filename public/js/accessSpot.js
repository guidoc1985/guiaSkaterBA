document.addEventListener('DOMContentLoaded', () => {
    
    if (window.location.pathname.endsWith('spots.html')) {
      const isAuthenticated = localStorage.getItem('token'); 
  
      if (!isAuthenticated) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: "Necesitas crear un usuario y loguearte para crear el spot!",
          confirmButtonText: 'OK'
        }).then(() => {
        
          window.location.href = 'registrate.html'; 
        });
      }
    }
  });