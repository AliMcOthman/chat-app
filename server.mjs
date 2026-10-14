import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import {saveMessage, getAllMessages, initDatabase} from "./database.js";

// IP-Adresse und Port festlegen
const IP = "localhost";
const PORT = 3000;

// Express-App und HTTP-Server erstellen
const app = express();
const server = createServer(app);

// Socket.IO mit dem HTTP-Server verbinden
const io = new Server(server);

// Map für die verbundenen Benutzer erstellen
// socket.id ist der Schlüssel und der Benutzername ist der Wert
const users = new Map();

// Statische Dateien aus dem Ordner "public" bereitstellen
app.use(express.static("public"));

// Auf neue Verbindungen warten
io.on("connection", (socket) => {
    console.log("Ein Benutzer ist verbunden:", socket.id);

    // Chat betreten
    socket.on("join", async (name) => {
        try {
            // Prüfen, ob der Name ein String ist
            if (typeof name !== "string") return;

            // Leerzeichen am Anfang und Ende entfernen
            const username = name.trim();

            // Prüfen, ob der Name leer ist oder der Benutzer schon registriert ist
            if (!username || users.has(socket.id)) return;

            // Benutzer in der Map speichern
            users.set(socket.id, username);

            // Nachrichtenverlauf aus der Datenbank laden
            const history = await getAllMessages();

            // Nachrichtenverlauf nur an diesen Benutzer senden
            socket.emit("chatHistory", history);

            // Systemnachricht für den Eintritt erstellen
            const message = {
                type: "system",
                username: null,
                text: `${username} hat den Chat betreten.`,
                time: new Date().toLocaleTimeString("de-DE")
            };

            // Eintrittsnachricht in der Datenbank speichern
            await saveMessage(message);

            // Nachricht an alle verbundenen Benutzer senden
            io.emit("message", message);

            // Aktuelle Benutzerliste an alle senden
            io.emit("users", Array.from(users.values()));

        } catch (error) {
            // Fehler beim Betreten des Chats ausgeben
            console.error("Fehler beim Betreten:", error);
        }
    });

    // Neue Chatnachricht empfangen
    socket.on("chatMessage", async (text) => {
        try {
            // Benutzernamen anhand der Socket-ID finden
            const username = users.get(socket.id);

            // Prüfen, ob der Benutzer angemeldet ist und der Text ein String ist
            if (!username || typeof text !== "string") return;

            // Leerzeichen am Anfang und Ende entfernen
            const cleanText = text.trim();

            // Leere Nachrichten nicht senden
            if (!cleanText) return;

            // Chatnachricht als Objekt erstellen
            const message = {
                type: "user",
                username,
                text: cleanText,
                time: new Date().toLocaleTimeString("de-DE")
            };

            // Nachricht in der Datenbank speichern
            await saveMessage(message);

            // Nachricht an alle verbundenen Benutzer senden
            io.emit("message", message);

        } catch (error) {
            // Fehler beim Speichern der Nachricht ausgeben
            console.error("Fehler beim Speichern:", error);
        }
    });

    // Reagieren, wenn ein Benutzer die Verbindung beendet
    socket.on("disconnect", async () => {
        // Benutzernamen anhand der Socket-ID finden
        const username = users.get(socket.id);

        // Beenden, wenn der Benutzer nicht registriert ist
        if (!username) return;

        // Benutzer aus der Map entfernen
        users.delete(socket.id);

        try {
            // Systemnachricht für das Verlassen erstellen
            const message = {
                type: "system",
                username: null,
                text: `${username} hat den Chat verlassen.`,
                time: new Date().toLocaleTimeString("de-DE")
            };

            // Verlassensnachricht in der Datenbank speichern
            await saveMessage(message);

            // Nachricht an alle verbundenen Benutzer senden
            io.emit("message", message);

            // Aktualisierte Benutzerliste an alle senden
            io.emit("users", Array.from(users.values()));

            // Ausgabe in der Konsole
            console.log(`${username} hat den Chat verlassen.`);

        } catch (error) {
            // Fehler beim Verlassen des Chats ausgeben
            console.error("Fehler beim Verlassen:", error);
        }
    });
});

// Datenbank initialisieren und Server starten
async function startServer() {
    try {
        // Warten, bis die Datenbank initialisiert ist
        await initDatabase();

        // HTTP- und Socket.IO-Server starten
        server.listen(PORT, IP, () => {
            console.log(`Chat läuft auf http://${IP}:${PORT}`);
    });

} catch (error) {
    // Fehler bei der Datenbankinitialisierung ausgeben
    console.error("Datenbankfehler:", error);
}
}

// Serverstart aufrufen
startServer();
