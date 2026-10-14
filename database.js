import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
    dialect: "sqlite",       // Wir verwenden SQLite
    storage: "./chat.db",    // Name und Pfad der Datenbankdatei
    logging: false           // SQL-Befehle nicht in der Konsole anzeigen
});

// Model "Message" definieren
const Message = sequelize.define("Message", {

    // Typ der Nachricht, zum Beispiel "chat" oder "system"
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },

    // Benutzername des Absenders
    username: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // Inhalt der Nachricht
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    // Zeitpunkt der Nachricht als Text
    time: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Datenbanktabellen mit den Models synchronisieren
async function initDatabase() {

    // Tabelle erstellen, falls sie noch nicht existiert
    await sequelize.sync();

    console.log("Datenbank ist bereit.");
}

// Eine neue Nachricht in der Datenbank speichern
async function saveMessage(message) {

    // Neuen Datensatz erstellen und das Ergebnis zurückgeben
    return await Message.create(message);
}

// Alle Nachrichten aus der Datenbank laden
async function getAllMessages() {

    // Nachrichten nach ID aufsteigend sortieren
    return await Message.findAll({
        order: [["id", "ASC"]]
    });
}

// Funktionen und Objekte für andere Dateien exportieren
export { sequelize, Message, initDatabase, saveMessage, getAllMessages };
