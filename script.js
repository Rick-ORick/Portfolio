// step 1 - initialize our list of todos && display the todos

let mainContainer = document.querySelector('main');
let addBtn = document.getElementById('addBtn');
let todoInput = document.getElementById('todoInput');

let todo_list = localStorage.getItem('todo-list')
  ? JSON.parse(localStorage.getItem('todo-list')).todo_list
  : []; // load from localStorage or start empty

function createTodoElement(todo, index) {
  const todoDiv = document.createElement('div');
  todoDiv.className = 'todoItem';
  todoDiv.setAttribute('data-index', index);

  const p = document.createElement('p');
  p.textContent = todo.text;

  const descP = document.createElement('p');
  descP.style.fontSize = '0.8em';
  descP.style.color = '#555';
  descP.textContent = todo.description || 'Loading description...';

  const img = document.createElement('img');
  img.className = 'todoImage';
  if (todo.image_url) {
    img.src = todo.image_url;
    img.alt = `Image for ${todo.text}`;
  }

  const actions = document.createElement('div');
  actions.className = 'actionsContainer';

  const editBtn = document.createElement('button');
  editBtn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
  editBtn.onclick = () => editTodo(index);

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
  deleteBtn.onclick = () => deleteTodo(index);

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);
  todoDiv.appendChild(p);
  todoDiv.appendChild(descP);
  if (todo.image_url) todoDiv.appendChild(img);
  todoDiv.appendChild(actions);

  return todoDiv;
}

function addTodo() {
  let current_todo = todoInput.value;
  if (!current_todo) return;

  const index = todo_list.length;
  const newTodo = {
    text: current_todo,
    description: '',
    image_url: ''
  };

  todo_list.push(newTodo);
  const newItem = createTodoElement(newTodo, index);
  mainContainer.appendChild(newItem);
  todoInput.value = '';
  saveData();
  fetchAIGeneratedContent(index);
}

addBtn.addEventListener('click', addTodo);

function deleteTodo(index) {
  todo_list.splice(index, 1);
  saveData();
  renderAll();
}

function editTodo(index) {
  let current_todo = todo_list[index];
  todoInput.value = current_todo.text;
  deleteTodo(index);
}

function saveData() {
  localStorage.setItem('todo-list', JSON.stringify({ todo_list }));
}

function renderAll() {
  mainContainer.innerHTML = '';
  todo_list.forEach((todo, i) => {
    mainContainer.appendChild(createTodoElement(todo, i));
  });
}

renderAll();

// AI image and description fetch
async function fetchAIGeneratedContent(index) {
  const todo = todo_list[index];

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todoText: todo.text })
    });

    const data = await response.json();
    todo.description = data.description;
    todo.image_url = data.imageUrl;

    saveData();
    renderAll();
  } catch (err) {
    console.error('AI generation failed:', err);
  }
}
