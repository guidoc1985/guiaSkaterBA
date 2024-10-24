document.addEventListener('DOMContentLoaded', () => {
    
    if (window.location.pathname.endsWith('login.html')) {
      const isAuthenticated = localStorage.getItem('token'); 
  
      if (isAuthenticated) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: "Ya estás logueado, cerra sesión si queres crear otro usuario!",
          confirmButtonText: 'OK'
        }).then(() => {
         
          window.location.href = 'index.html'; 
        });
      }
    }
  });