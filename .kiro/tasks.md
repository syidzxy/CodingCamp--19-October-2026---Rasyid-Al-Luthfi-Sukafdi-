# Implementation Plan: To-Do List Life Dashboard

## Overview

Build the dashboard as three files inside `CodingCamp-[19 Oktober 2026]-[Rasyid Al Luthfi]/`:
`index.html`, `css/style.css`, and `js/script.js`. Implementation follows the HTML → CSS → JavaScript order so each layer can be reviewed and confirmed before the next begins.

## Tasks

- [x] 1. Create the HTML structure (`index.html`)
  - Write semantic HTML5 with `<header>`, `<main>`, three `<section>` elements, and `<footer>`.
  - Include all required element IDs: `greeting-section`, `greeting-text`, `user-name`, `datetime-display`, `name-form`, `name-input`, `name-save-btn`, `theme-toggle-btn`, `timer-section`, `timer-display`, `timer-controls`, `timer-start-btn`, `timer-stop-btn`, `timer-reset-btn`, `todo-section`, `todo-form`, `todo-input`, `todo-add-btn`, `todo-list`, `links-section`, `link-form`, `link-name-input`, `link-url-input`, `link-add-btn`, `link-list`, `site-footer`, `footer-name`.
  - Link `css/style.css` in `<head>` and `js/script.js` at the bottom of `<body>`.
  - Add `aria-label` and `aria-labelledby` attributes for accessibility.
  - _Requirements: 1.5, 2.1, 3.3, 5.3, 7.1, 8.1_

- [x] 2. Implement styling (`css/style.css`)
  - Define all colour, spacing, radius, shadow, typography, and transition tokens as CSS custom properties on `:root`.
  - Style the header with a purple–violet gradient; position name form and theme toggle in a flex row.
  - Implement the three-column CSS Grid layout for `#dashboard` (`1fr 2fr 1.5fr`).
  - Style all card sections with rounded corners, border, and drop shadow.
  - Style the Focus Timer display as a circular ring using `border-radius: 50%`.
  - Style task `<li>` rows with pre-defined classes: `task-text`, `completed`, `btn-task`, `btn-edit`, `btn-delete`, `edit-input`.
  - Style quick link `<li>` rows with `btn-delete-link`.
  - Implement `body.dark` overrides that replace only the colour tokens.
  - Add responsive breakpoints: two columns at ≤ 900 px (to-do spans both), one column at ≤ 580 px.
  - Ensure `:focus-visible` ring on all interactive elements.
  - _Requirements: 6.4, 7.2, 7.3_

- [x] 3. Implement JavaScript (`js/script.js`)
  - [x] 3.1 DOM references and LocalStorage key constants
    - Bind all 19 element IDs to `const` variables at the top of the file.
    - Define `LS_THEME`, `LS_NAME`, `LS_TASKS`, `LS_LINKS` constants.
    - _Requirements: 9.3_

  - [x] 3.2 Utility helpers
    - `pad(n)` — zero-pad to 2 digits.
    - `normalise(str)` — trim, collapse whitespace, lower-case.
    - `showError(anchor, message, id)` — insert `role="alert"` `<p>` after anchor, auto-remove after 3 s, replace existing if same id.
    - `isValidUrl(url)` — return true for `http:` and `https:` only using `new URL()`.
    - _Requirements: 4.3, 8.1, 8.2, 8.3, 8.4, 5.2_

  - [x] 3.3 Greeting, date, and time
    - `getGreetingWord()` — return greeting phrase based on current hour.
    - `formatDatetime()` — return formatted date+time string.
    - `updateGreetingWord()` — update only the text node before `#user-name`, leaving the span untouched.
    - `startClock()` — call `tick()` immediately, then every 1 000 ms.
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 3.4 Custom name
    - `applyName(name)` — set `#user-name` and `#footer-name` textContent.
    - `loadName()` — restore from `dashboard_username`; pre-fill `#name-input`.
    - `saveName()` — validate non-empty; save to LS; call `applyName`; flash "✓ Saved" for 1.5 s.
    - Bind `saveName` to `#name-save-btn` click and `#name-input` Enter keydown.
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 3.5 Dark mode
    - `applyTheme(theme)` — toggle `body.dark`, update button label.
    - `loadTheme()` — read `dashboard_theme` from LS, call `applyTheme` (defaults to `'light'`).
    - `toggleTheme()` — flip theme, save to LS, call `applyTheme`.
    - Bind `toggleTheme` to `#theme-toggle-btn` click.
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 3.6 Focus timer
    - Module-level state: `timerSeconds = 1500`, `timerInterval = null`.
    - `renderTimer()` — write `MM:SS` to `#timer-display`.
    - `startTimer()` — guard `timerInterval !== null`; start `setInterval`; update label; alert on completion.
    - `stopTimer()` — `clearInterval`; reset label.
    - `resetTimer()` — call `stopTimer`; reset `timerSeconds`; call `renderTimer`.
    - Bind the three buttons to `startTimer`, `stopTimer`, `resetTimer`.
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [x] 3.7 To-Do List — data layer
    - `loadTasks()` — JSON parse `dashboard_tasks` with `try/catch`; return `[]` on failure.
    - `saveTasks(tasks)` — JSON stringify and write to `dashboard_tasks`.
    - `updateTaskInStorage(id, patch)` — find task by id, `Object.assign`, save.
    - `deleteTaskFromStorage(id)` — filter out by id, save.
    - _Requirements: 3.1, 3.4, 3.7, 3.8, 9.1, 9.4, 9.5_

  - [x] 3.8 To-Do List — DOM layer
    - `createTaskElement(task)` — build `<li>` with `data-task-id`, checkbox, `span.task-text`, `button.btn-edit`, `button.btn-delete`. Bind all events. Implement inline edit flow with commit/cancel logic.
    - `renderTasks()` — clear `#todo-list`, call `createTaskElement` for each task from LS.
    - `addTask(e)` — validate non-empty and non-duplicate; create task object; save; append `<li>`; clear input.
    - Bind `addTask` to `#todo-form` submit event.
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 4.1, 4.2_

  - [x] 3.9 Quick Links
    - `loadLinks()` / `saveLinks(links)` — same pattern as tasks.
    - `createLinkElement(link)` — build `<li>` with `data-link-id`, `<a>` (href and textContent via properties), `button.btn-delete-link`.
    - `renderLinks()` — clear `#link-list`, render from LS.
    - `addLink(e)` — validate name non-empty, URL non-empty, URL valid; create link; save; append; clear inputs.
    - Bind `addLink` to `#link-form` submit event.
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 9.2, 9.4_

  - [x] 3.10 Initialisation
    - `init()` — call `loadTheme`, `loadName`, `startClock`, `renderTimer`, `renderTasks`, `renderLinks` in that order.
    - Call `init()` at the bottom of the script (DOM is ready because `<script>` is at end of `<body>`).
    - _Requirements: 1.1, 2.1, 3.8, 5.6, 6.3_

## Notes

- All three files are complete and fully functional.
- No framework, library, or external dependency is used anywhere.
- All user-supplied text is written via `textContent` or DOM property assignment — never `innerHTML`.
- LocalStorage reads are wrapped in `try/catch` to handle storage unavailability gracefully.
- The `data-task-id` attribute on every `<li>` enables O(1) task lookup on delete/edit without a full re-render.
