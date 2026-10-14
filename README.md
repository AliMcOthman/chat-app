# Real-Time Chat Application

A real-time chat application built with **Node.js, Express, Socket.IO, and SQLite using Sequelize**.

## Features

- Real-time messaging between multiple users
- Usernames for joining the chat
- Live list of connected users
- System messages when users join or leave
- Persistent chat history stored in a database
- Automatic timestamps for messages
- Input validation for usernames and messages

## Technologies Used

- Node.js
- Express
- Socket.IO
- SQLite
- Sequelize ORM
- HTML5
- CSS3
- JavaScript

## Project Structure

```text
chat-app/
├── public/
│   ├── index.html
│   ├── client.js
│   └── style.css
├── database.js
├── server.mjs
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Installation

Make sure Node.js and npm are installed.

1. Clone the repository:

   ```bash
   git clone https://github.com/AliMcOthman/chat-app.git
   ```

2. Open the project directory:

   ```bash
   cd chat-app
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   node server.mjs
   ```

5. Open the application in your browser:

   `http://localhost:3000`

## Database

The application uses SQLite to store chat messages. The database initialization and message operations are handled in `database.js`.

The local database file is excluded from Git using `.gitignore`.

## Learning Objectives

This project demonstrates practical knowledge of Node.js, Express, event-driven programming, real-time communication with Socket.IO, asynchronous JavaScript, and database integration.

## Author

Created as a web development training project.