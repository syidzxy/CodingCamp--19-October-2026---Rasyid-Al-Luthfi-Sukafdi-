/* ============================================================
   Life Dashboard — js/script.js
   Sections:
     1.  DOM References
     2.  Local Storage Keys
     3.  Utility Helpers
     4.  Greeting, Date & Time
     5.  Custom Name
     6.  Dark Mode
     7.  Focus Timer
     8.  To-Do List
     9.  Quick Links
    10.  Initialisation
   ============================================================ */


/* ─── 1. DOM REFERENCES ─────────────────────────────────────── */
const greetingText    = document.getElementById('greeting-text');
const userNameSpan    = document.getElementById('user-name');
const datetimeDisplay = document.getElementById('datetime-display');
const nameInput       = document.getElementById('name-input');
const nameSaveBtn     = document.getElementById('name-save-btn');
const themeToggleBtn  = document.getElementById('theme-toggle-btn');

const timerDisplay    = document.getElementById('timer-display');
const timerStartBtn   = document.getElementById('timer-start-btn');
const timerStopBtn    = document.getElementById('timer-stop-btn');
const timerResetBtn   = document.getElementById('timer-reset-btn');

const todoForm        = document.getElementById('todo-form');
const todoInput       = document.getElementById('todo-input');
const todoList        = document.getElementById('todo-list');

const linkForm        = document.getElementById('link-form');
const linkNameInput   = document.getElementById('link-name-input');
const linkUrlInput    = document.getElementById('link-url-input');
const linkList        = document.getElementById('link-list');

const footerName      = document.getElementById('footer-name');


/* ─── 2. LOCAL STORAGE KEYS ─────────────────────────────────── */
const LS_THEME = 'dashboard_theme';
const LS_NAME  = 'dashboard_username';
const LS_TASKS = 'dashboard_tasks';
const LS_LINKS = 'dashboard_links';


/* ─── 3. UTILITY HELPERS ────────────────────────────────────── */

/**
 * Left-pad a number to 2 digits.
 * @param {number} n
 * @returns {string}
 */
function pad(n) {
  return String(n).padStart(2, '0');
}

/**
 * Normalise a string for duplicate comparison:
 * collapse internal whitespace and lower-case.
 * @param {string} str
 * @returns {string}
 */
function normalise(str) {
  return str.trim().replace(/\s+/g, ' ').toLowerCase();
}

/**
 * Render a temporary validation error immediately after `anchor`.
 * Reuses an existing element if the same `id` is passed.
 * Auto-removes after 3 s.
 *
 * @param {HTMLElement} anchor  - Element to insert after.
 * @param {string}      message - Error text to show.
 * @param {string}      id      - Stable element id for deduplication.
 */
function showError(anchor, message, id) {
  const prev = document.getElementById(id);
  if (prev) prev.remove();

  const el = document.createElement('p');
  el.id = id;
  el.setAttribute('role', 'alert');
  el.style.cssText = 'margin:4px 0 0;font-size:0.82rem;font-weight:600;color:var(--clr-danger)';
  el.textContent = message;    // textContent — no injection risk

  anchor.insertAdjacentElement('afterend', el);
  setTimeout(() => el.remove(), 3000);
}

/**
 * Return true only for http / https URLs.
 * @param {string} url
 * @returns {boolean}
 */
function isValidUrl(url) {
  try {
    const { protocol } = new URL(url);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}


/* ─── 4. GREETING, DATE & TIME ──────────────────────────────── */

/**
 * Return the appropriate greeting word for the current hour.
 * @returns {string}
 */
function getGreetingWord() {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return 'Good morning';
  if (h >= 12 && h < 17) return 'Good afternoon';
  if (h >= 17 && h < 21) return 'Good evening';
  return 'Good night';
}

/**
 * Format the current date and time as a readable string.
 * Example: "Friday, 23 October 2026  •  14:35:07"
 * @returns {string}
 */
function formatDatetime() {
  const now     = new Date();
  const weekday = now.toLocaleDateString('en-GB', { weekday: 'long' });
  const day     = now.getDate();
  const month   = now.toLocaleDateString('en-GB', { month: 'long' });
  const year    = now.getFullYear();
  const time    = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  return `${weekday}, ${day} ${month} ${year}  •  ${time}`;
}

/**
 * Update only the greeting word text node, leaving the <span id="user-name">
 * child element untouched.
 */
function updateGreetingWord() {
  // greetingText's first child is the text node "Good morning, "
  const textNode = greetingText.firstChild;
  if (textNode && textNode.nodeType === Node.TEXT_NODE) {
    textNode.nodeValue = `${getGreetingWord()}, `;
  }
}

/** Kick off a 1-second clock that updates the display and greeting word. */
function startClock() {
  function tick() {
    datetimeDisplay.textContent = formatDatetime();
    updateGreetingWord();
  }
  tick();                      // paint immediately — no blank first second
  setInterval(tick, 1000);
}


/* ─── 5. CUSTOM NAME ────────────────────────────────────────── */

/**
 * Apply `name` to every element that shows the user's name.
 * @param {string} name
 */
function applyName(name) {
  userNameSpan.textContent = name;
  if (footerName) footerName.textContent = name;
}

/** Restore the saved name from Local Storage. */
function loadName() {
  const saved = localStorage.getItem(LS_NAME);
  if (saved) {
    applyName(saved);
    nameInput.value = saved;
  }
}

/** Validate and persist the name entered by the user. */
function saveName() {
  const value = nameInput.value.trim();

  if (!value) {
    showError(nameInput, 'Please enter a name.', 'name-error');
    nameInput.focus();
    return;
  }

  localStorage.setItem(LS_NAME, value);
  applyName(value);

  // Brief visual confirmation on the button
  const original = nameSaveBtn.textContent;
  nameSaveBtn.textContent = '✓ Saved';
  setTimeout(() => { nameSaveBtn.textContent = original; }, 1500);
}

nameSaveBtn.addEventListener('click', saveName);
nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') saveName(); });


/* ─── 6. DARK MODE ──────────────────────────────────────────── */

/**
 * Apply `'dark'` or `'light'` theme.
 * @param {'dark'|'light'} theme
 */
function applyTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  themeToggleBtn.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
}

/** Toggle theme and persist the preference. */
function toggleTheme() {
  const next = document.body.classList.contains('dark') ? 'light' : 'dark';
  localStorage.setItem(LS_THEME, next);
  applyTheme(next);
}

/** Restore theme preference before first paint to avoid a flash. */
function loadTheme() {
  applyTheme(localStorage.getItem(LS_THEME) || 'light');
}

themeToggleBtn.addEventListener('click', toggleTheme);


/* ─── 7. FOCUS TIMER ────────────────────────────────────────── */
const TIMER_DURATION = 25 * 60;    // seconds

let timerSeconds  = TIMER_DURATION;
let timerInterval = null;           // null when stopped; ID when running

/** Write the current timerSeconds into the display element. */
function renderTimer() {
  timerDisplay.textContent = `${pad(Math.floor(timerSeconds / 60))}:${pad(timerSeconds % 60)}`;
}

/**
 * Start the countdown.
 * Guard with a null-check so multiple clicks cannot stack intervals.
 */
function startTimer() {
  if (timerInterval !== null) return;    // already running

  timerStartBtn.textContent = '⏸ Running…';

  timerInterval = setInterval(() => {
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerDisplay.textContent = '00:00';
      timerStartBtn.textContent = '▶ Start';
      // Use setTimeout so the alert doesn't block the final DOM paint
      setTimeout(() => alert('⏰ Focus session complete! Take a well-earned break.'), 50);
      return;
    }
    timerSeconds--;
    renderTimer();
  }, 1000);
}

/** Pause without resetting. */
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerStartBtn.textContent = '▶ Start';
}

/** Stop and reset to 25:00. */
function resetTimer() {
  stopTimer();
  timerSeconds = TIMER_DURATION;
  renderTimer();
}

timerStartBtn.addEventListener('click', startTimer);
timerStopBtn.addEventListener('click', stopTimer);
timerResetBtn.addEventListener('click', resetTimer);


/* ─── 8. TO-DO LIST ─────────────────────────────────────────── */
/*
 * Task object shape:
 *   { id: number, text: string, completed: boolean }
 *
 * Each <li> gets a data-task-id attribute so mutations can always
 * locate the correct record in Local Storage.
 */

/** Read tasks array from Local Storage. */
function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(LS_TASKS)) || [];
  } catch {
    return [];
  }
}

/** Persist the tasks array to Local Storage. */
function saveTasks(tasks) {
  localStorage.setItem(LS_TASKS, JSON.stringify(tasks));
}

/**
 * Update one task's record in Local Storage by id.
 * @param {number} id
 * @param {Partial<{text:string, completed:boolean}>} patch
 */
function updateTaskInStorage(id, patch) {
  const tasks = loadTasks();
  const idx   = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return;
  Object.assign(tasks[idx], patch);
  saveTasks(tasks);
}

/**
 * Remove one task record from Local Storage by id.
 * @param {number} id
 */
function deleteTaskFromStorage(id) {
  saveTasks(loadTasks().filter((t) => t.id !== id));
}

/**
 * Build and return a <li> for one task.
 * @param {{ id: number, text: string, completed: boolean }} task
 * @returns {HTMLLIElement}
 */
function createTaskElement(task) {
  const li = document.createElement('li');
  li.dataset.taskId = task.id;
  if (task.completed) li.classList.add('completed');

  /* ── Checkbox ── */
  const checkbox = document.createElement('input');
  checkbox.type    = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.setAttribute('aria-label', `Mark "${task.text}" as completed`);

  checkbox.addEventListener('change', () => {
    task.completed = checkbox.checked;
    li.classList.toggle('completed', task.completed);
    updateTaskInStorage(task.id, { completed: task.completed });
  });

  /* ── Task text span ── */
  const span = document.createElement('span');
  span.className   = 'task-text';
  span.textContent = task.text;    // safe — no innerHTML

  /* ── Edit button ── */
  const editBtn = document.createElement('button');
  editBtn.className   = 'btn-task btn-edit';
  editBtn.textContent = 'Edit';
  editBtn.setAttribute('aria-label', `Edit task: ${task.text}`);

  editBtn.addEventListener('click', () => {
    // Only open an editor if we are not already in edit mode
    if (li.querySelector('.edit-input')) return;

    const editInput = document.createElement('input');
    editInput.type      = 'text';
    editInput.className = 'edit-input';
    editInput.value     = task.text;

    li.replaceChild(editInput, span);
    editBtn.textContent = 'Save';
    editInput.focus();
    editInput.select();

    /** Validate, persist, and close the inline editor. */
    function commitEdit() {
      const newText = editInput.value.trim();

      if (!newText) {
        showError(editInput, 'Task cannot be empty.', 'edit-task-error');
        editInput.focus();
        return;
      }

      // Duplicate check — exclude the current task itself
      const isDuplicate = loadTasks().some(
        (t) => t.id !== task.id && normalise(t.text) === normalise(newText)
      );
      if (isDuplicate) {
        showError(editInput, 'A task with that name already exists.', 'edit-task-error');
        editInput.focus();
        return;
      }

      task.text        = newText;
      span.textContent = newText;   // safe
      editBtn.setAttribute('aria-label', `Edit task: ${newText}`);
      updateTaskInStorage(task.id, { text: newText });

      li.replaceChild(span, editInput);
      editBtn.textContent = 'Edit';
    }

    /** Cancel edit — restore the original span without saving. */
    function cancelEdit() {
      li.replaceChild(span, editInput);
      editBtn.textContent = 'Edit';
    }

    // Swap the edit button's handler for the duration of editing
    editBtn.onclick = (e) => { e.stopPropagation(); commitEdit(); };

    editInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter')  { e.preventDefault(); commitEdit(); }
      if (e.key === 'Escape') { e.preventDefault(); cancelEdit(); }
    });

    // If the user clicks away, cancel gracefully
    editInput.addEventListener('blur', () => {
      // Small delay so a Save button click can fire first
      setTimeout(() => {
        if (li.querySelector('.edit-input')) cancelEdit();
      }, 150);
    });
  });

  /* ── Delete button ── */
  const deleteBtn = document.createElement('button');
  deleteBtn.className   = 'btn-task btn-delete';
  deleteBtn.textContent = 'Delete';
  deleteBtn.setAttribute('aria-label', `Delete task: ${task.text}`);

  deleteBtn.addEventListener('click', () => {
    deleteTaskFromStorage(task.id);
    li.remove();
  });

  li.append(checkbox, span, editBtn, deleteBtn);
  return li;
}

/** Clear and re-render the entire task list from Local Storage. */
function renderTasks() {
  todoList.innerHTML = '';
  loadTasks().forEach((task) => {
    todoList.appendChild(createTaskElement(task));
  });
}

/** Handle the "Add task" form submission. */
function addTask(e) {
  e.preventDefault();

  const text = todoInput.value.trim();

  if (!text) {
    showError(todoInput, 'Please enter a task.', 'todo-add-error');
    todoInput.focus();
    return;
  }

  const isDuplicate = loadTasks().some((t) => normalise(t.text) === normalise(text));
  if (isDuplicate) {
    showError(todoInput, 'That task already exists.', 'todo-add-error');
    todoInput.focus();
    return;
  }

  const newTask = { id: Date.now(), text, completed: false };
  const tasks   = loadTasks();
  tasks.push(newTask);
  saveTasks(tasks);

  todoList.appendChild(createTaskElement(newTask));
  todoInput.value = '';
  todoInput.focus();
}

todoForm.addEventListener('submit', addTask);


/* ─── 9. QUICK LINKS ────────────────────────────────────────── */
/*
 * Link object shape:
 *   { id: number, name: string, url: string }
 */

/** Read links array from Local Storage. */
function loadLinks() {
  try {
    return JSON.parse(localStorage.getItem(LS_LINKS)) || [];
  } catch {
    return [];
  }
}

/** Persist the links array to Local Storage. */
function saveLinks(links) {
  localStorage.setItem(LS_LINKS, JSON.stringify(links));
}

/**
 * Build and return a <li> for one quick link.
 * @param {{ id: number, name: string, url: string }} link
 * @returns {HTMLLIElement}
 */
function createLinkElement(link) {
  const li = document.createElement('li');
  li.dataset.linkId = link.id;

  const a = document.createElement('a');
  a.href        = link.url;          // URL already validated on entry
  a.target      = '_blank';
  a.rel         = 'noopener noreferrer';
  a.textContent = link.name;        // safe — no innerHTML

  const deleteBtn = document.createElement('button');
  deleteBtn.className   = 'btn-delete-link';
  deleteBtn.textContent = '✕';
  deleteBtn.setAttribute('aria-label', `Delete link: ${link.name}`);

  deleteBtn.addEventListener('click', () => {
    saveLinks(loadLinks().filter((l) => l.id !== link.id));
    li.remove();
  });

  li.append(a, deleteBtn);
  return li;
}

/** Clear and re-render the entire link list from Local Storage. */
function renderLinks() {
  linkList.innerHTML = '';
  loadLinks().forEach((link) => {
    linkList.appendChild(createLinkElement(link));
  });
}

/** Handle the "Add link" form submission. */
function addLink(e) {
  e.preventDefault();

  const name = linkNameInput.value.trim();
  const url  = linkUrlInput.value.trim();

  if (!name) {
    showError(linkNameInput, 'Please enter a site name.', 'link-name-error');
    linkNameInput.focus();
    return;
  }

  if (!url) {
    showError(linkUrlInput, 'Please enter a URL.', 'link-url-error');
    linkUrlInput.focus();
    return;
  }

  if (!isValidUrl(url)) {
    showError(linkUrlInput, 'Enter a valid URL starting with https://', 'link-url-error');
    linkUrlInput.focus();
    return;
  }

  const newLink = { id: Date.now(), name, url };
  const links   = loadLinks();
  links.push(newLink);
  saveLinks(links);

  linkList.appendChild(createLinkElement(newLink));
  linkNameInput.value = '';
  linkUrlInput.value  = '';
  linkNameInput.focus();
}

linkForm.addEventListener('submit', addLink);


/* ─── 10. INITIALISATION ─────────────────────────────────────── */

/**
 * Boot sequence — runs once when the script loads.
 * The <script> tag is at the bottom of <body>, so the DOM is ready.
 */
function init() {
  loadTheme();    // 1. Apply theme first to avoid a light-flash in dark mode
  loadName();     // 2. Restore saved user name
  startClock();   // 3. Start the live date/time ticker
  renderTimer();  // 4. Paint "25:00" immediately
  renderTasks();  // 5. Restore tasks from Local Storage
  renderLinks();  // 6. Restore quick links from Local Storage
}

init();
