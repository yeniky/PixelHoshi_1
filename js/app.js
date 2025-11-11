
const JUEGOS = [
  { id: 1, nombre: "Kena Bridge Of Spirits", genero: "Aventura", anio: 2021, portada: "assets/img/Kena.jpg", puntaje: 4.7 },
  { id: 2, nombre: "Final Fantasy XIV",      genero: "MMORPG",  anio: 2013, portada: "assets/img/Final_fantasy_xiv.jpg", puntaje: 4.6 },
  { id: 3, nombre: "Uncharted: The Nathan Drake Collection", genero: "Aventura", anio: 2015, portada: "assets/img/uncharted.jpg", puntaje: 3.9 },
  { id: 4, nombre: "Spyro Reignited Trilogy", genero: "Aventura", anio: 2018, portada: "assets/img/Spyro.jpg", puntaje: 4.8 }
];
function estrellas(n){ const e=Math.round(n); return "⭐".repeat(e)+"☆".repeat(5-e); }
function idDesdeQuery(){ const u=new URL(location.href); return parseInt(u.searchParams.get("id")); }
//
(function(){ const rejilla=document.getElementById('rejilla'); if(!rejilla) return;
  JUEGOS.forEach(j=>{
    const col=document.createElement('div'); col.className='col-12 col-sm-6 col-lg-4';
    col.innerHTML=`<div class="card h-100">
      <img src="${j.portada}" alt="Portada de ${j.nombre}" class="portada" loading="lazy">
      <div class="card-body">
        <h5 class="card-title text-white ">${j.nombre}</h5>
        <p class="text-white mb-1">${j.genero} • ${j.anio}</p>
        <p class="mb-2 text-white ">Rating comunidad: <strong>${j.puntaje.toFixed(1)}</strong> ${estrellas(j.puntaje)}</p>
        <a class="btn btn-outline-primary w-100" href="game.html?id=${j.id}">Ver detalle</a>
      </div></div>`;
    rejilla.appendChild(col);
  });
})();

(function(){ const cab=document.getElementById('cabecera'); if(!cab) return;
  const lista=document.getElementById('lista');
  const id=idDesdeQuery(); const juego=JUEGOS.find(j=>j.id===id);
  if(!juego){ cab.innerHTML='<div class="alert alert-danger">Juego no encontrado.</div>'; return; }

  cab.innerHTML=`<div class="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3">
    <img src="${juego.portada}" alt="Portada de ${juego.nombre}" style="width:180px;height:180px;object-fit:cover;border-radius:.5rem" loading="lazy">
    <div><h1 class="h4 m-0">${juego.nombre}</h1>
      <p class="text-white   m-0">${juego.genero} • ${juego.anio}</p>
      <p class="m-0">Rating comunidad: <strong>${juego.puntaje.toFixed(1)}</strong> ${estrellas(juego.puntaje)}</p>
    </div></div>`;

  const clave=`resenas_${id}`; const resenas=JSON.parse(localStorage.getItem(clave)||"[]");
  const rolActual=localStorage.getItem('rolActual'); // 'admin' o 'usuario'

  function dibujar(){ lista.innerHTML=''; resenas.forEach((r,i)=>{
      const div=document.createElement('div'); div.className='border rounded p-3';
      div.innerHTML=`<div class="d-flex justify-content-between align-items-center mb-1">
        <strong>${r.usuario||'Anónimo'}</strong>
        <span class="small">${estrellas(r.puntaje)} (${r.puntaje})</span></div>
        <p class="mb-2 ${r.oculta?'text-muted fst-italic':''}">${r.oculta?'(Oculta) ':''}${r.texto}</p>
        <div class="d-flex gap-2 ${rolActual==='admin'?'':'d-none'}">
          <button class="btn btn-sm btn-outline-danger" data-i="${i}" data-action="del">Eliminar</button>
          <button class="btn btn-sm btn-outline-secondary" data-i="${i}" data-action="toggle">${r.oculta?'Mostrar':'Ocultar'}</button>
        </div>`;
      lista.appendChild(div); });
    document.getElementById('contador').textContent=resenas.length; }
  dibujar();
//Eliminar-Ocultar
  lista.addEventListener('click', e=>{
    const b=e.target.closest('button'); if(!b) return;
    const i=parseInt(b.dataset.i,10); const a=b.dataset.action;
    if(a==='del'){ resenas.splice(i,1); }
    if(a==='toggle'){ resenas[i].oculta=!resenas[i].oculta; }
    localStorage.setItem(clave, JSON.stringify(resenas)); dibujar();
  });

  const form=document.getElementById('formResena');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    if(!form.checkValidity()){ form.classList.add('was-validated'); return; }
    const puntaje=parseInt(document.getElementById('puntaje').value);
    const texto=document.getElementById('comentario').value.trim();
    if(puntaje<1||puntaje>5) return;
    resenas.push({ puntaje, texto, usuario: localStorage.getItem('usuarioActual')||'Usuario', oculta:false });
    localStorage.setItem(clave, JSON.stringify(resenas));
    form.reset(); form.classList.remove('was-validated'); dibujar();
  });
})();
