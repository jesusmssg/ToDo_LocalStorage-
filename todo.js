// Paso 2: Añadir tareas creando nodos a mano (sin innerHTML)

const form = document.getElementById('formTodo');
const input = document.getElementById('inputTodo');
const lista = document.getElementById('lista');
const KEY = 'todos';

// helper para fabricar un <li> accesible y limpio
function crearItem(texto, done = false) {
  const li = document.createElement('li');
  if (done) li.classList.add('done');

  const check = document.createElement('input');
  check.type = 'checkbox';
  check.className = 'check';
  check.setAttribute('aria-label', 'Marcar tarea');
  check.checked = done;

  const span = document.createElement('span');
  span.className = 'text';
  span.textContent = texto;

  const btnEdit = document.createElement('button');
  btnEdit.type = 'button';
  btnEdit.className = 'btn edit';
  btnEdit.textContent = 'Editar';

  const btnDel = document.createElement('button');
  btnDel.type = 'button';
  btnDel.className = 'btn del';
  btnDel.textContent = 'Eliminar';

  li.append(check, span, btnEdit, btnDel);
  return li;
}

// Persistencia
const save = () => {
  const data = [...lista.children].map((li) => ({
    text: li.querySelector('.text').textContent,
    done: li.classList.contains('done'),
  }));
  localStorage.setItem(KEY, JSON.stringify(data));
};

const load = () => {
  const data = JSON.parse(localStorage.getItem(KEY) || '[]');
  const frag = document.createDocumentFragment();
  data.forEach((t) => frag.append(crearItem(t.text, t.done)));
  lista.append(frag);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const texto = input.value.trim();
  if (!texto) return;

  const frag = document.createDocumentFragment();
  frag.append(crearItem(texto));
  lista.append(frag);

  form.reset();
  input.focus();
  save();
});

// --- Delegación de eventos en la lista ---
lista.addEventListener('click', (e) => {
  const target = e.target;
  const li = target.closest('li');
  if (!li) return;

  // Marcar tarea como hecha
  if (target.classList.contains('check')) {
    li.classList.toggle('done');
    save();
    return;
  }

  // Eliminar tarea
  if (target.classList.contains('del')) {
    if (confirm('¿Eliminar esta tarea?')) {
      li.remove();
      save();
    }
    return;
  }

  // Editar tarea
  if (target.classList.contains('edit')) {
    const span = li.querySelector('.text');
    if (!span) return;

    const inputEdit = document.createElement('input');
    inputEdit.type = 'text';
    inputEdit.value = span.textContent;
    inputEdit.className = 'text';
    li.replaceChild(inputEdit, span);
    inputEdit.focus();

    const guardar = () => {
      const nuevoTexto = inputEdit.value.trim() || 'Sin título';
      const nuevoSpan = document.createElement('span');
      nuevoSpan.className = 'text';
      nuevoSpan.textContent = nuevoTexto;
      li.replaceChild(nuevoSpan, inputEdit);
      save();
    };

    inputEdit.addEventListener('blur', guardar);
    inputEdit.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') guardar();
    });
  }
});

// Cargar al inicio
load();
