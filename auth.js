
function emailValido(v){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function passValida(v){
  // mínimo 8, una mayúscula, un número y un símbolo
  return v.length>=8 && /[A-Z]/.test(v) && /[0-9]/.test(v) && /[^A-Za-z0-9]/.test(v);
}
function getUsuarios(){
  try { return JSON.parse(localStorage.getItem('usuarios') || '[]'); }
  catch { return []; }
}
function setUsuarios(arr){
  localStorage.setItem('usuarios', JSON.stringify(arr));
}

/* ===== 2 roles ===== */
(function(){
  if(!localStorage.getItem('usuarios')){
    setUsuarios([
      { email:'admin@pixelhoshi.com', password:'Admin*123',  rol:'admin'  },
      { email:'user@pixelhoshi.com',  password:'User*1234', rol:'usuario'}
    ]);
  }
})();

/* =========================================================
   REGISTRO 
   ========================================================= */
(function(){
  function init(){
    const btn  = document.getElementById('btnCrear');
    const form = document.getElementById('formRegistro');
    if(!btn || !form) return;

    const inpEmail = document.getElementById('emailRegistro');
    const inpP1    = document.getElementById('passRegistro');
    const inpP2    = document.getElementById('passRegistro2');

    btn.addEventListener('click', function(){
      // limpia marcas
      [inpEmail, inpP1, inpP2].forEach(el => el.classList.remove('is-invalid','is-valid'));

      let ok = true;
      if(!emailValido(inpEmail.value)){ inpEmail.classList.add('is-invalid'); ok=false; } else { inpEmail.classList.add('is-valid'); }
      if(!passValida(inpP1.value))    { inpP1.classList.add('is-invalid');    ok=false; } else { inpP1.classList.add('is-valid'); }
      if(inpP1.value !== inpP2.value || !inpP2.value){ inpP2.classList.add('is-invalid'); ok=false; } else { inpP2.classList.add('is-valid'); }

      if(!ok){ alert('Revisa los campos marcados en rojo.'); return; }

      const usuarios = getUsuarios();
      const existe = usuarios.some(u => u.email.toLowerCase() === inpEmail.value.toLowerCase());
      if(existe){ alert('Ese email ya está registrado.'); return; }

      usuarios.push({ email: inpEmail.value, password: inpP1.value, rol: 'usuario' });
      setUsuarios(usuarios);
      alert('Cuenta creada. Ahora puedes ingresar.');
      location.href = 'login.html';
    });
  }
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();

/* =========================================================
   LOGIN 
   ========================================================= */

(function(){
  function init(){
    const btn  = document.getElementById('btnIngresar');
    const form = document.getElementById('formLogin');
    if(!btn || !form) return;

    const inpEmail = document.getElementById('emailLogin');
    const inpPass  = document.getElementById('passLogin');

    btn.addEventListener('click', function(){
      // limpia
      [inpEmail, inpPass].forEach(el => el.classList.remove('is-invalid','is-valid'));

      let ok = true;
      if(!emailValido(inpEmail.value)){ inpEmail.classList.add('is-invalid'); ok=false; } else { inpEmail.classList.add('is-valid'); }
      if(!inpPass.value){ inpPass.classList.add('is-invalid'); ok=false; } else { inpPass.classList.add('is-valid'); }
      if(!ok){ alert('Revisa los campos marcados en rojo.'); return; }

      // lee usuarios
      let usuarios = getUsuarios();
      if(!Array.isArray(usuarios)){
        localStorage.removeItem('usuarios');
        usuarios = getUsuarios();
      }

      const u = usuarios.find(x => x.email.toLowerCase() === inpEmail.value.toLowerCase());
      if(u && u.password === inpPass.value){
        localStorage.setItem('usuarioActual', u.email);
        localStorage.setItem('rolActual', u.rol);
        alert('Ingreso correcto');
        location.href = 'catalogo.html';
      } else {
        alert('Credenciales incorrectas');
      }
    });
  }
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();

/* =========================================================
   SALIR 
   ========================================================= */
(function(){
  function initSalir(){
    const link = document.getElementById('linkSalir');
    if(!link) return;
    link.addEventListener('click', function(e){
      e.preventDefault();
      localStorage.removeItem('usuarioActual');
      localStorage.removeItem('rolActual');
      alert('Sesión cerrada.');
      location.href = 'login.html';
    });
  }
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', initSalir); } else { initSalir(); }
})();
