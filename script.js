// Variables
const timetable = document.querySelector("#timetable tbody");
const addRowBtn = document.getElementById("add-row");
const saveButton = document.getElementById("save-button");
const notesList = document.getElementById("notes-list");
const addNoteBtn = document.getElementById("add-note");
const clearNotesBtn = document.getElementById("clear-notes");
const newNoteContent = document.getElementById("new-note-content");

// Local Storage Data
let timetableData = JSON.parse(localStorage.getItem("timetable")) || [];
let notesData = JSON.parse(localStorage.getItem("notes")) || [];

// Render Timetable
function renderTimetable() {
    timetable.innerHTML = ""; // Clear existing rows
    timetableData.forEach((row, index) => {
        const tableRow = document.createElement("tr");
        tableRow.innerHTML = `
            <td contenteditable="true">${row.courseCode || ""}</td>
            <td contenteditable="true">${row.title || ""}</td>
            <td contenteditable="true">${row.day || ""}</td>
            <td contenteditable="true">${row.time || ""}</td>
            <td contenteditable="true">${row.venue || ""}</td>
            <td><button class="delete-row" data-index="${index}">Delete</button></td>
        `;
        timetable.appendChild(tableRow);
    });

    // Attach delete functionality
    document.querySelectorAll(".delete-row").forEach((btn) =>
        btn.addEventListener("click", deleteRow)
    );
}

// Add Row to Timetable
addRowBtn.addEventListener("click", () => {
    timetableData.push({
        courseCode: "",
        title: "",
        day: "",
        time: "",
        venue: "",
    });
    renderTimetable();
});

// Save Timetable to Local Storage
saveButton.addEventListener("click", () => {
    const rows = Array.from(timetable.querySelectorAll("tr"));
    timetableData = rows.map((row) => {
        const cells = row.querySelectorAll("td");
        return {
            courseCode: cells[0].textContent.trim(),
            title: cells[1].textContent.trim(),
            day: cells[2].textContent.trim(),
            time: cells[3].textContent.trim(),
            venue: cells[4].textContent.trim(),
        };
    });
    localStorage.setItem("timetable", JSON.stringify(timetableData));
    alert("Timetable saved!");
});

// Delete Row from Timetable
function deleteRow(event) {
    const index = event.target.getAttribute("data-index");
    timetableData.splice(index, 1);
    renderTimetable();
    localStorage.setItem("timetable", JSON.stringify(timetableData));
}

// Render Notes
function renderNotes() {
    notesList.innerHTML = ""; // Clear existing notes
    notesData.forEach((note, index) => {
        const noteDiv = document.createElement("div");
        noteDiv.classList.add("note-card");
        noteDiv.innerHTML = `
            <pre>${note.content}</pre>
            <button class="delete-note" data-index="${index}">Delete</button>
        `;

        // Attach delete functionality
        noteDiv.querySelector(".delete-note").addEventListener("click", () => {
            notesData.splice(index, 1);
            renderNotes();
            localStorage.setItem("notes", JSON.stringify(notesData));
        });

        notesList.appendChild(noteDiv);
    });
}

// Add Note
addNoteBtn.addEventListener("click", () => {
    const content = newNoteContent.value.trim();
    if (content) {
        notesData.push({ content });
        localStorage.setItem("notes", JSON.stringify(notesData));
        renderNotes();
        newNoteContent.value = ""; // Clear input
    } else {
        alert("Please write something before adding a note.");
    }
});

// Clear All Notes
clearNotesBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all notes?")) {
        notesData = [];
        localStorage.setItem("notes", JSON.stringify(notesData));
        renderNotes();
    }
});

// Initialize Timetable and Notes on Page Load
window.addEventListener("load", () => {
    renderTimetable();
    renderNotes();
});
// Automatic Timer Variables
let autoTimerSeconds = 0; // Seconds elapsed since app launch
const autoTimerDisplay = document.getElementById("timer-minutes");
const autoTimerSecondsDisplay = document.getElementById("timer-seconds");

// Manual Stopwatch Variables
let stopwatchInterval = null; // Interval for stopwatch
let stopwatchRunning = false;
let stopwatchSeconds = 0;
const stopwatchMinutesDisplay = document.getElementById("stopwatch-minutes");
const stopwatchSecondsDisplay = document.getElementById("stopwatch-seconds");

// Start Automatic Timer
function startAutoTimer() {
    setInterval(() => {
        autoTimerSeconds++;
        const minutes = Math.floor(autoTimerSeconds / 60);
        const seconds = autoTimerSeconds % 60;

        autoTimerDisplay.textContent = String(minutes).padStart(2, "0");
        autoTimerSecondsDisplay.textContent = String(seconds).padStart(2, "0");
    }, 1000); // Update every second
}

// Start Manual Stopwatch
function startStopwatch() {
    if (!stopwatchRunning) {
        stopwatchRunning = true;
        stopwatchInterval = setInterval(() => {
            stopwatchSeconds++;
            const minutes = Math.floor(stopwatchSeconds / 60);
            const seconds = stopwatchSeconds % 60;

            stopwatchMinutesDisplay.textContent = String(minutes).padStart(2, "0");
            stopwatchSecondsDisplay.textContent = String(seconds).padStart(2, "0");
        }, 1000); // Update every second
    }
}

// Stop Manual Stopwatch
function stopStopwatch() {
    if (stopwatchRunning) {
        clearInterval(stopwatchInterval);
        stopwatchRunning = false;
    }
}

// Reset Manual Stopwatch
function resetStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchRunning = false;
    stopwatchSeconds = 0;
    stopwatchMinutesDisplay.textContent = "00";
    stopwatchSecondsDisplay.textContent = "00";
}

// Attach Event Listeners to Stopwatch Buttons
document.getElementById("start-stopwatch").addEventListener("click", startStopwatch);
document.getElementById("stop-stopwatch").addEventListener("click", stopStopwatch);
document.getElementById("reset-stopwatch").addEventListener("click", resetStopwatch);

// Start the Automatic Timer on Page Load
window.onload = function () {
    startAutoTimer();
    renderTimetable();
    renderNotes();
};
// Render Weekly Calendar
function renderWeeklyCalendar() {
    const calendar = document.getElementById("calendar");
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // Get current day index
    const todayDate = currentDate.getDate();

    // Clear existing calendar
    calendar.innerHTML = "";

    // Create weekly calendar structure
    const calendarTable = document.createElement("table");
    calendarTable.className = "weekly-calendar";

    // Table header for weekdays
    const headerRow = document.createElement("tr");
    weekDays.forEach((day, index) => {
        const dayCell = document.createElement("th");
        dayCell.textContent = day;

        // Highlight current day
        if (index === currentDay) {
            dayCell.classList.add("highlight-day");
        }

        headerRow.appendChild(dayCell);
    });

    calendarTable.appendChild(headerRow);

    // Table row for dates (assumes current week based on the current day)
    const dateRow = document.createElement("tr");
    weekDays.forEach((_, index) => {
        const dateCell = document.createElement("td");
        const diff = index - currentDay; // Difference from the current day
        const date = new Date(currentDate);
        date.setDate(todayDate + diff); // Adjust to correct date for the week
        dateCell.textContent = date.getDate();

        // Highlight current day
        if (index === currentDay) {
            dateCell.classList.add("highlight-date");
        }

        dateRow.appendChild(dateCell);
    });

    calendarTable.appendChild(dateRow);

    // Append calendar to the section
    calendar.appendChild(calendarTable);
}

// Initialize Weekly Calendar on Page Load
window.onload = function () {
    startAutoTimer(); // Auto Timer
    renderTimetable(); // Render Timetable
    renderNotes(); // Render Notes
    renderWeeklyCalendar(); // Render Calendar
};
// Array of Motivational Quotes
const motivationalQuotes = [
    "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.",
    "Education is the most powerful weapon which you can use to change the world.",
    "The best way to predict your future is to create it.",
    "Don’t watch the clock; do what it does. Keep going.",
    "The beautiful thing about learning is that no one can take it away from you.",
    "Strive for progress, not perfection.",
    "You don’t have to be great to start, but you have to start to be great.",
    "Believe you can and you're halfway there.",
    "Learning is never done without errors and defeat.",
    "The expert in anything was once a beginner."
];

// Show Pop-Up with Motivational Quote
function showWelcomePopup() {
    const popup = document.getElementById("welcome-popup");
    const quoteElement = document.getElementById("motivational-quote");

    // Generate a random quote
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    quoteElement.textContent = randomQuote;

    // Show the popup
    popup.style.display = "flex";
}

// Close Pop-Up
function closeWelcomePopup() {
    const popup = document.getElementById("welcome-popup");
    popup.style.display = "none";
}

// Initialize Welcome Popup on Page Load
window.onload = function () {
    showWelcomePopup();
    startAutoTimer(); // Auto Timer
    renderTimetable(); // Render Timetable
    renderNotes(); // Render Notes
    renderWeeklyCalendar(); // Render Calendar
};