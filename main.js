const LS_KEY = 'tareas_dashboard';
const SS_KEY = 'filtro_actual';

let tareas = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
let filtroActual = sessionStorage.getItem(SS_KEY) || 'todas';

const tareaInput = document.getElementById('tareaInput');
const agregarBtn = document.getElementById('agregarBtn');
const listaTareas = document.getElementById('listaTareas');
const filtros = document.querySelectorAll('.filtro');

function guardarTareas() {
  localStorage.setItem(LS_KEY, JSON.stringify(tareas));
}

function renderTareas() {
  listaTareas.innerHTML = '';

  const visibles = tareas.filter(t => {
    if (filtroActual === 'todas') return true;
    if (filtroActual === 'completadas') return t.completada;
    if (filtroActual === 'pendientes') return !t.completada;
  });

  if (visibles.length === 0) {
    const vacio = document.createElement('div');
    vacio.className = 'vacio';
    vacio.textContent = 'No hay tareas';
    listaTareas.appendChild(vacio);
    return;
  }

  visibles.forEach(t => {
    const li = document.createElement('li');
    if (t.completada) li.classList.add('completed');

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = t.completada;
    check.addEventListener('change', () => toggleTarea(t.id));

    const texto = document.createElement('span');
    texto.className = 'texto' + (t.completada ? ' completada' : '');
    texto.textContent = t.texto;

    const btnEliminar = document.createElement('button');
    btnEliminar.className = 'eliminar';
    btnEliminar.textContent = '✕';
    btnEliminar.addEventListener('click', () => eliminarTarea(t.id));

    li.append(check, texto, btnEliminar);
    listaTareas.appendChild(li);
  });
}

function agregarTarea() {
  const texto = tareaInput.value.trim();
  if (!texto) return;
  tareas.push({ id: Date.now(), texto, completada: false });
  guardarTareas();
  tareaInput.value = '';
  renderTareas();
}

function toggleTarea(id) {
  tareas = tareas.map(t => t.id === id ? { ...t, completada: !t.completada } : t);
  guardarTareas();
  renderTareas();
}

function eliminarTarea(id) {
  tareas = tareas.filter(t => t.id !== id);
  guardarTareas();
  renderTareas();
}

function cambiarFiltro(nuevo) {
  filtroActual = nuevo;
  sessionStorage.setItem(SS_KEY, nuevo);
  filtros.forEach(f => f.classList.toggle('activo', f.dataset.filtro === nuevo));
  renderTareas();
}

agregarBtn.addEventListener('click', agregarTarea);
tareaInput.addEventListener('keyup', e => { if (e.key === 'Enter') agregarTarea(); });
filtros.forEach(f => f.addEventListener('click', () => cambiarFiltro(f.dataset.filtro)));

cambiarFiltro(filtroActual);
renderTareas();
