"use strict";

// Verbindung zum Socket.IO-Server herstellen
const socket = io();

// HTML-Elemente auswählen
const loginForm = document.querySelector("#loginForm");
const usernameInput = document.querySelector("#username");
const chatArea = document.querySelector("#chatArea");
const messages = document.querySelector("#messages");
const messageForm = document.querySelector("#messageForm");
const messageInput = document.querySelector("#messageInput");
const usersList = document.querySelector("#users");


// Chat betreten
loginForm.addEventListener("submit", (event) => {

    // Verhindern, dass die Seite neu geladen wird
    event.preventDefault();

    // Benutzernamen aus dem Eingabefeld lesen
    const username = usernameInput.value.trim();

    // Prüfen, ob ein Benutzername eingegeben wurde
    if (!username) return;

    // Benutzernamen an den Server senden
    socket.emit("join", username);

    // Login-Formular ausblenden
    loginForm.style.display = "none";

    // Chat-Bereich anzeigen
    chatArea.style.display = "flex";
});


// Nachricht senden
messageForm.addEventListener("submit", (event) => {

    // Verhindern, dass die Seite neu geladen wird
    event.preventDefault();

    // Nachricht aus dem Eingabefeld lesen
    const text = messageInput.value.trim();

    // Prüfen, ob die Nachricht leer ist
    if (!text) return;

    // Nachricht an den Server senden
    socket.emit("chatMessage", text);

    // Eingabefeld leeren
    messageInput.value = "";

    // Cursor wieder in das Eingabefeld setzen
    messageInput.focus();
});


// Nachrichtenverlauf anzeigen
socket.on("chatHistory", (history) => {

    // Alte Nachrichten aus der Anzeige entfernen
    messages.replaceChildren();

    // Alle Nachrichten aus dem Verlauf anzeigen
    history.forEach(showMessage);

    // Automatisch zur neuesten Nachricht scrollen
    scrollToBottom();
});


// Neue Nachrichten empfangen
socket.on("message", (message) => {

    // Neue Nachricht anzeigen
    showMessage(message);

    // Automatisch nach unten scrollen
    scrollToBottom();
});


// Benutzerliste aktualisieren
socket.on("users", (users) => {

    // Alte Benutzerliste leeren
    usersList.replaceChildren();

    // Alle verbundenen Benutzer durchlaufen
    users.forEach((username) => {

        // Ein neues Listenelement erstellen
        const li = document.createElement("li");

        // Benutzernamen in das Listenelement schreiben
        li.textContent = username;

        // Benutzer zur Liste hinzufügen
        usersList.appendChild(li);
    });
});


// Eine Nachricht anzeigen
function showMessage(message) {

    // Ein Listenelement für die Nachricht erstellen
    const li = document.createElement("li");

    // Prüfen, ob es eine Systemnachricht ist
    if (message.type === "system") {

        // CSS-Klasse für Systemnachrichten setzen
        li.className = "system";

        // Uhrzeit und Nachrichtentext anzeigen
        li.textContent =
            `[${message.time}] ${message.text}`;

    } else {

        // Ein Element für den Benutzernamen erstellen
        const name = document.createElement("span");

        // CSS-Klasse für den Benutzernamen setzen
        name.className = "username";

        // Benutzernamen mit Doppelpunkt anzeigen
        name.textContent = message.username + ": ";

        // Ein Element für den Nachrichtentext erstellen
        const text = document.createElement("span");

        // Uhrzeit und Nachrichtentext anzeigen
        text.textContent =
            `[${message.time}] ${message.text}`;

        // Benutzernamen und Nachricht zusammenfügen
        li.append(name, text);
    }

    // Die Nachricht zur Nachrichtenliste hinzufügen
    messages.appendChild(li);
}


// Automatisch nach unten scrollen
function scrollToBottom() {

    // Die Scrollposition auf die gesamte Höhe der Nachrichten setzen
    messages.scrollTop = messages.scrollHeight;
}