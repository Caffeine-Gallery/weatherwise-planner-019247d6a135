import { backend } from 'declarations/backend';

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

async function init() {
    document.getElementById('get-info').addEventListener('click', getLocationInfo);
    document.getElementById('add-note-btn').addEventListener('click', addNote);
    renderCalendar(currentMonth, currentYear);
    await loadNotes();
}

async function getLocationInfo() {
    const location = document.getElementById('location').value;
    if (!location) return;

    try {
        const weatherData = await backend.getWeatherForecast(location);
        const dateTimeData = await backend.getDateTime(location);

        // Parse and display the data (you'll need to adjust this based on the actual response format)
        const weatherInfo = JSON.parse(weatherData);
        const dateTimeInfo = JSON.parse(dateTimeData);

        const infoDiv = document.getElementById('current-info');
        infoDiv.innerHTML = `
            <p>Temperature: ${weatherInfo.main.temp}°C</p>
            <p>Weather: ${weatherInfo.weather[0].description}</p>
            <p>Date & Time: ${new Date(dateTimeInfo.datetime).toLocaleString()}</p>
        `;
    } catch (error) {
        console.error('Error fetching location info:', error);
    }
}

function renderCalendar(month, year) {
    const calendarDiv = document.getElementById('calendar');
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = `<h2>${monthNames[month]} ${year}</h2>`;
    html += '<table><tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr><tr>';

    for (let i = 0; i < firstDay; i++) {
        html += '<td></td>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
        if ((day + firstDay - 1) % 7 === 0) {
            html += '</tr><tr>';
        }
        html += `<td>${day}</td>`;
    }

    html += '</tr></table>';
    calendarDiv.innerHTML = html;
}

async function addNote() {
    const date = document.getElementById('note-date').value;
    const content = document.getElementById('note-content').value;
    if (!date || !content) return;

    try {
        await backend.addNote(new Date(date).getTime(), content);
        await loadNotes();
        document.getElementById('note-content').value = '';
    } catch (error) {
        console.error('Error adding note:', error);
    }
}

async function loadNotes() {
    try {
        const notes = await backend.getNotes();
        const notesList = document.getElementById('notes-list');
        notesList.innerHTML = '';

        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note';
            noteElement.innerHTML = `
                <input type="checkbox" ${note.isCompleted ? 'checked' : ''} onchange="updateNoteStatus('${note.id}', this.checked)">
                <span>${new Date(Number(note.date)).toDateString()}: ${note.content}</span>
            `;
            notesList.appendChild(noteElement);
        });
    } catch (error) {
        console.error('Error loading notes:', error);
    }
}

async function updateNoteStatus(id, isCompleted) {
    try {
        await backend.updateNoteStatus(id, isCompleted);
    } catch (error) {
        console.error('Error updating note status:', error);
    }
}

window.updateNoteStatus = updateNoteStatus;
window.addEventListener('load', init);
