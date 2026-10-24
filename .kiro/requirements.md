# Requirements Document

## Introduction

The To-Do List Life Dashboard is a single-page productivity web application built with plain HTML5, CSS3, and Vanilla JavaScript — no frameworks, no libraries, no backend. It combines a greeting header, a 25-minute Pomodoro focus timer, a full-featured to-do list, and a quick-link launcher into one responsive dashboard. All user data is persisted in the browser's `localStorage` so the dashboard survives page refreshes.

The project lives in the `CodingCamp-[19 Oktober 2026]-[Rasyid Al Luthfi]` folder with the required file structure:
- `index.html` — semantic HTML structure
- `css/style.css` — all styles, CSS custom properties, responsive layout
- `js/script.js` — all JavaScript logic

## Glossary

- **Dashboard**: The single-page web application.
- **Greeting**: The header element that displays a time-based salutation, the user's name, and the live date/time.
- **Focus Timer**: A 25-minute countdown timer (Pomodoro-style) with Start, Stop, and Reset controls.
- **Task**: A single to-do item with a text label and a completed/pending state.
- **Task List**: The collection of all Tasks rendered in the dashboard.
- **Quick Link**: A user-saved shortcut to an external URL identified by a display name.
- **LocalStorage**: The browser's `window.localStorage` API used for data persistence.
- **Dark Mode**: An alternative colour theme applied by toggling the `dark` class on `<body>`.
- **Custom Name**: The user's display name saved in LocalStorage and shown in the Greeting and footer.
- **Normalised Text**: A string that has been trimmed, had internal whitespace collapsed to single spaces, and been converted to lower-case — used for duplicate detection.

---

## Requirements

### Requirement 1: Greeting, Date, and Time

**User Story:** As a user, I want to see a personalised greeting and the live date and time when I open the dashboard, so that I immediately know the time and feel welcomed.

#### Acceptance Criteria

1. THE Dashboard SHALL display a greeting phrase in the header that reads "Good morning", "Good afternoon", "Good evening", or "Good night" depending on the current local hour: 05:00–11:59 → morning, 12:00–16:59 → afternoon, 17:00–20:59 → evening, 21:00–04:59 → night.
2. THE greeting phrase SHALL update automatically without a page reload whenever the hour boundary changes.
3. THE Dashboard SHALL display the current date formatted as `{Weekday}, {Day} {Month} {Year}  •  {HH}:{MM}:{SS}` (e.g. "Friday, 23 October 2026  •  14:35:07") and SHALL update every second.
4. THE Dashboard SHALL display the user's saved name (see Requirement 7) next to the greeting phrase; before any name is saved, it SHALL default to "Friend".
5. THE date/time display SHALL be rendered in the `#datetime-display` element and the greeting in the `#greeting-text` element.

---

### Requirement 2: Focus Timer

**User Story:** As a user, I want a 25-minute countdown timer so that I can run focused Pomodoro-style work sessions directly from the dashboard.

#### Acceptance Criteria

1. THE Focus Timer SHALL initialise and display `25:00` when the page loads.
2. WHEN the user clicks the Start button (`#timer-start-btn`), THE timer SHALL count down one second per real second and update `#timer-display` after each tick.
3. THE timer SHALL guard against multiple simultaneous intervals: if Start is clicked while the timer is already running, the second click SHALL be ignored and no additional interval SHALL be created.
4. WHEN the user clicks the Stop button (`#timer-stop-btn`), THE timer SHALL pause at its current value without resetting.
5. WHEN the user clicks the Reset button (`#timer-reset-btn`), THE timer SHALL stop (if running) and reset the display to `25:00`.
6. WHEN the countdown reaches `00:00`, THE timer SHALL stop automatically and alert the user that the focus session is complete.
7. THE timer display SHALL always show minutes and seconds zero-padded to two digits (e.g. `04:07`).

---

### Requirement 3: To-Do List

**User Story:** As a user, I want to manage a list of tasks so that I can track my work and mark items as done.

#### Acceptance Criteria

1. WHEN the user submits the `#todo-form` (by pressing Enter or clicking the Add button), THE Dashboard SHALL add a new Task to the Task List and to LocalStorage.
2. WHEN a Task is added, the `#todo-input` field SHALL be cleared and focused.
3. EACH Task SHALL be rendered as a `<li>` in `#todo-list` containing: a checkbox, a text span with class `task-text`, an Edit button with class `btn-edit`, and a Delete button with class `btn-delete`.
4. WHEN the user checks the checkbox, THE Task's `completed` state SHALL toggle, the `<li>` SHALL gain or lose the class `completed`, and the change SHALL be persisted to LocalStorage.
5. WHEN the user clicks the Edit button, THE `task-text` span SHALL be replaced in-place with an `<input>` of class `edit-input` pre-filled with the current task text; the user SHALL be able to confirm the edit by pressing Enter or clicking the (now relabelled) Save button, and cancel by pressing Escape.
6. WHEN the user confirms an edit, THE new text SHALL be validated (non-empty, not a duplicate of another task) before being saved; on validation failure, an error message SHALL appear near the input.
7. WHEN the user clicks the Delete button, THE Task SHALL be removed from the DOM and from LocalStorage immediately.
8. THE Task List SHALL be restored from LocalStorage on every page load, including completed states.

---

### Requirement 4: Duplicate Task Prevention

**User Story:** As a user, I want the dashboard to reject duplicate tasks so that my list stays clean and unambiguous.

#### Acceptance Criteria

1. WHEN the user attempts to add a Task whose Normalised Text matches the Normalised Text of any existing Task, THE Dashboard SHALL reject the submission, display an error message near `#todo-input`, and NOT add the Task.
2. WHEN the user attempts to save an edited Task whose Normalised Text matches that of any OTHER existing Task, THE Dashboard SHALL reject the save, display an error message near the edit input, and NOT update the Task.
3. Normalised Text is defined as: `text.trim().replace(/\s+/g, ' ').toLowerCase()`.

---

### Requirement 5: Quick Links

**User Story:** As a user, I want to save shortcuts to my favourite websites so that I can open them quickly from the dashboard.

#### Acceptance Criteria

1. WHEN the user submits the `#link-form` with a non-empty name and a valid URL, THE Dashboard SHALL add a new Quick Link to `#link-list` and to LocalStorage.
2. A URL SHALL be considered valid if and only if `new URL(value).protocol` is `'http:'` or `'https:'`; any other string SHALL be rejected with an error message near `#link-url-input`.
3. EACH Quick Link SHALL be rendered as a `<li>` containing: an `<a>` element that opens the URL in a new tab with `target="_blank" rel="noopener noreferrer"`, and a Delete button with class `btn-delete-link`.
4. WHEN the user clicks the Delete button, THE Quick Link SHALL be removed from the DOM and from LocalStorage immediately.
5. The `<a>` element's `href` and `textContent` SHALL be set via DOM properties (`href`, `textContent`), never via `innerHTML`, to prevent HTML injection.
6. THE Quick Link list SHALL be restored from LocalStorage on every page load.

---

### Requirement 6: Dark Mode

**User Story:** As a user, I want to switch between light and dark themes so that I can use the dashboard comfortably in any lighting condition.

#### Acceptance Criteria

1. THE Dashboard SHALL provide a theme toggle button (`#theme-toggle-btn`) in the header.
2. WHEN clicked, THE button SHALL toggle the `dark` class on `<body>` and update the button label to "☀️ Light Mode" (when dark is active) or "🌙 Dark Mode" (when light is active).
3. THE selected theme SHALL be persisted in LocalStorage (`dashboard_theme`) and restored on every page load before first paint to avoid a visible flash.
4. ALL colour changes in dark mode SHALL be driven exclusively by CSS custom property overrides on `body.dark` — no inline styles or JavaScript colour manipulation.

---

### Requirement 7: Custom Name

**User Story:** As a user, I want to save my name so that the greeting and footer feel personalised.

#### Acceptance Criteria

1. THE header SHALL contain a `#name-input` text field and a `#name-save-btn` button.
2. WHEN the user clicks Save (or presses Enter inside `#name-input`), THE Dashboard SHALL validate that the input is non-empty; if valid, it SHALL save the name to LocalStorage (`dashboard_username`), update `#user-name` in the greeting, and update `#footer-name` in the footer.
3. THE `#name-input` field SHALL be pre-filled with the previously saved name on page load.
4. IF no name has been saved, THE `#user-name` element SHALL display "Friend".
5. A brief visual confirmation (button label changes to "✓ Saved" for 1.5 s) SHALL appear after a successful save.

---

### Requirement 8: Input Validation and Error Messages

**User Story:** As a user, I want clear feedback when I submit invalid data so that I know exactly what to fix.

#### Acceptance Criteria

1. ALL validation error messages SHALL be created dynamically by JavaScript and inserted immediately after the relevant input element via `insertAdjacentElement('afterend', el)`.
2. Each error message element SHALL have `role="alert"` and `aria-live="assertive"` so screen readers announce it.
3. Error messages SHALL auto-remove themselves after 3 seconds.
4. If an error message for the same input already exists when a new one is triggered, the old one SHALL be removed before the new one is inserted (no stacking).
5. THE Dashboard SHALL never display a console error as a result of normal user interaction.

---

### Requirement 9: Persistence and Data Integrity

**User Story:** As a user, I want my data to survive page refreshes so that I don't lose my tasks and links.

#### Acceptance Criteria

1. ALL Task data SHALL be stored under the LocalStorage key `dashboard_tasks` as a JSON array of `{ id: number, text: string, completed: boolean }` objects.
2. ALL Quick Link data SHALL be stored under the LocalStorage key `dashboard_links` as a JSON array of `{ id: number, name: string, url: string }` objects.
3. THE username SHALL be stored under `dashboard_username` and the theme under `dashboard_theme`.
4. ALL LocalStorage reads SHALL be wrapped in `try/catch`; if parsing fails, the feature SHALL fall back to an empty array or default value without throwing a console error.
5. Task and Quick Link IDs SHALL be generated using `Date.now()` to guarantee uniqueness within a session.
