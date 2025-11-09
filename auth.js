
function emailValido(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function passValida(v){ return v.length>=8 && /[A-Z]/.test(v) && /[0-9]/.test(v) && /[^A-Za-z0-9]/.test(v); }

(function seed(){
  if(!localStorage.getItem('usuarios')){
    const usuarios=[
      { email:'admin@pixelhoshi.com', password:'Admin*123',  rol:'admin'  },
      { email:'user@pixelhoshi.com',  password:'User*1234', rol:'usuario'}
    ];
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }
})();
function getUsuarios(){ return JSON.parse(localStorage.getItem('usuarios')||'[]'); }
function setUsuarios(a){ localStorage.setItem('usuarios', JSON.stringify(a)); }

(function(){
  const f=document.getElementById('formRegistro'); if(!f) return;
  f.addEventListener('submit', e=>{
    e.preventDefault();
    const email=document.getElementById('emailRegistro');
    const p1=document.getElementById('passRegistro');
    const p2=document.getElementById('passRegistro2');
    let ok=true;
    if(!emailValido(email.value)){ email.classList.add('is-invalid'); ok=false; } else { email.classList.remove('is-invalid'); email.classList.add('is-valid'); }
    if(!passValida(p1.value))    { p1.classList.add('is-invalid');    ok=false; } else { p1.classList.remove('is-invalid');    p1.classList.add('is-valid'); }
    if(p1.value!==p2.value||!p2.value){ p2.classList.add('is-invalid'); ok=false; } else { p2.classList.remove('is-invalid'); p2.classList.add('is-valid'); }
    if(!ok) return;

    const usuarios=getUsuarios();
    if(usuarios.some(u=>u.email.toLowerCase()===email.value.toLowerCase())){ alert('Ese email ya está registrado.'); return; }
    usuarios.push({ email:email.value, password:p1.value, rol:'usuario' });
    setUsuarios(usuarios);
    alert('Cuenta creada. Ahora puedes ingresar.');
    location.href='login.html';
  });
})();

(function(){
  const f=document.getElementById('formLogin'); if(!f) return;
  f.addEventListener('submit', e=>{
    e.preventDefault();
    const email=document.getElementById('emailLogin');
    const pass=document.getElementById('passLogin');
    let ok=true;
    if(!emailValido(email.value)){ email.classList.add('is-invalid'); ok=false; } else { email.classList.remove('is-invalid'); }
    if(!pass.value){ pass.classList.add('is-invalid'); ok=false; } else { pass.classList.remove('is-invalid'); }
    if(!ok) return;

    const usuarios=getUsuarios();
    const u=usuarios.find(x=>x.email.toLowerCase()===email.value.toLowerCase());
    if(u && u.password===pass.value){
      localStorage.setItem('usuarioActual', u.email);
      localStorage.setItem('rolActual', u.rol);
      alert('Ingreso correcto');
      location.href='catalogo.html';
    } else {
      alert('Credenciales incorrectas');
    }
  });
})();

(function(){
  const f=document.getElementById('formRecuperar'); if(!f) return;
  f.addEventListener('submit', e=>{
    e.preventDefault();
    const email=document.getElementById('emailRecuperar');
    if(!emailValido(email.value)){ email.classList.add('is-invalid'); return; }
    alert('Enlace de recuperación enviado (simulado).');
    email.classList.remove('is-invalid'); email.value='';
  });
})();

(function(){
  const f=document.getElementById('formPerfil'); if(!f) return;
  const emailPerfil=document.getElementById('emailPerfil');
  const conectado=localStorage.getItem('usuarioActual');
  const rol=localStorage.getItem('rolActual');
  emailPerfil.textContent = conectado ? `${conectado} (${rol||'sin rol'})` : 'No autenticado';
  f.addEventListener('submit', e=>{
    e.preventDefault();
    const nueva=document.getElementById('passNueva');
    if(!passValida(nueva.value)){ nueva.classList.add('is-invalid'); return; }
    const usuarios=getUsuarios();
    const i=usuarios.findIndex(u=>u.email===conectado);
    if(i===-1){ alert('No hay sesión activa.'); return; }
    usuarios[i].password=nueva.value;
    setUsuarios(usuarios);
    nueva.classList.remove('is-invalid'); nueva.value='';
    alert('Contraseña actualizada.');
  });
})();
