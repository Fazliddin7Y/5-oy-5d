let todos = JSON.parse(localStorage.getItem('todos')) || [];

const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const allCount = document.getElementById('all-count');
const completedCount = document.getElementById('completed-count');
const uncompletedCount = document.getElementById('uncompleted-count');

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos(filter = 'all') {
    todoList.innerHTML = '';
    const filteredTodos = todos.filter(todo => {
        if (filter === 'completed') return todo.completed;
        if (filter === 'uncompleted') return !todo.completed;
        return true;
    });

    filteredTodos.forEach((todo, index) => {
        const todoItem = document.createElement('div');
        todoItem.className = `flex justify-between items-center py-2 border-b ${todo.completed ? 'line-through text-gray-500' : ''}`;

        const text = document.createElement('span');
        text.textContent = todo.text;
        todoItem.appendChild(text);

        const actions = document.createElement('div');

        const checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.checked = todo.completed;
        checkBox.className = 'mr-2';
        checkBox.addEventListener('change', () => {
            todo.completed = checkBox.checked;
            saveTodos();
            updateCounts();
            renderTodos(filter);
        });
        actions.appendChild(checkBox);

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'bg-yellow-400 text-black px-2 py-1 rounded mr-2';
        editBtn.addEventListener('click', () => {
            const newText = prompt('Edit your todo:', todo.text);
            if (newText) {
                todo.text = newText;
                saveTodos();
                renderTodos(filter);
            }
        });
        actions.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'bg-red-500 text-white px-2 py-1 rounded';
        deleteBtn.addEventListener('click', () => {
            todos.splice(index, 1);
            saveTodos();
            updateCounts();
            renderTodos(filter);
        });
        actions.appendChild(deleteBtn);

        todoItem.appendChild(actions);
        todoList.appendChild(todoItem);
    });

    updateCounts();
}

function updateCounts() {
    allCount.textContent = todos.length;
    completedCount.textContent = todos.filter(todo => todo.completed).length;
    uncompletedCount.textContent = todos.filter(todo => !todo.completed).length;
}

addBtn.addEventListener('click', () => {
    const text = todoInput.value.trim();
    if (text) {
        todos.push({ text, completed: false });
        saveTodos();
        renderTodos();
        todoInput.value = '';
    }
});

document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
        renderTodos(button.dataset.filter);
    });
});

renderTodos();
