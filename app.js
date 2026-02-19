const BASE_URL = "http://localhost:4125/api/todos";

// Load all tasks
async function loadTasks() {
  const res = await fetch(BASE_URL);
  const data = await res.json();
  const list = document.getElementById("task-list");
  list.innerHTML = "";
  data.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.task;
    list.appendChild(li);
  });
}

// Add a new task
async function addTask() {
  const task = document.getElementById("task").value;
  await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task })
  });
  document.getElementById("task").value = "";
  loadTasks();
}

// Load on page start
loadTasks();
