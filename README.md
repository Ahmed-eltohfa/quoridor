# 🎮 Quoridor

A modern web implementation of the classic **Quoridor** board game built with **React**, **Node.js**, and **Socket.IO**. Challenge your friends online or sharpen your strategy against AI opponents with multiple difficulty levels.

---

## 🎥 Demo

https://drive.google.com/file/d/1BQw5STBcnl1feXzgxW6Q8pegyGubQJL7/view?usp=drive_link

---

## 📸 Screenshots

### Home Page

![Home](<img width="952" height="440" alt="image" src="https://github.com/user-attachments/assets/c6e07d7e-db37-400a-9c65-a4f2ff360447" />
)

### Game Board

![Game](<img width="951" height="438" alt="image" src="https://github.com/user-attachments/assets/ea6b4e2c-a100-44ca-9dcf-5fd1619fa8f3" />
)

### Multiplayer

![Multiplayer](<img width="948" height="437" alt="image" src="https://github.com/user-attachments/assets/5493080d-cb4d-4052-b60f-5f95cc2db49c" />
)


---

# ✨ Features

- 🎮 Complete implementation of Quoridor rules
- 🌐 Online multiplayer using Socket.IO
- 🤖 AI opponents with multiple difficulty levels
- ↩️ Undo moves
- 🚪 Create and join game rooms
- ⚡ Real-time synchronization
- 🚧 Smart wall placement validation
- 🛣️ Pathfinding validation to ensure legal wall placement
- 👥 Player matchmaking
- 📱 Responsive interface
- 🧩 Modular game engine
- 🎨 Clean and intuitive UI

---

# 🎲 About Quoridor

Quoridor is a two-player strategy board game played on a **Usually 9×9** board.

Each player starts with:

- One pawn
- Ten walls

On each turn, a player can either:

- Move their pawn
- Place one wall

The objective is simple:

> Reach the opposite side of the board before your opponent.

Walls make the game interesting—they can block your opponent's path, but **they can never completely trap a player**. There must always remain at least one valid path to the goal.

---

# 🕹️ Gameplay

Every turn you may choose one action:

### Move your pawn

Move one square:

- Up
- Down
- Left
- Right

If the opponent is directly in front of you, jumping over them is allowed according to Quoridor's official rules.

### Place a wall

Walls can be placed either:

- Horizontally
- Vertically

The game automatically validates every placement to ensure that both players always have at least one valid path to their destination.

---

# 🤖 AI Opponents

Play against computer-controlled opponents powered by the **Minimax algorithm**.

The AI includes:

- Multiple difficulty levels
- Strategic wall placement
- Move evaluation
- Alpha-Beta pruning optimization
- Pathfinding analysis

Higher difficulties search deeper into the game tree, making the AI increasingly challenging.

---

# ⚙️ Tech Stack

## Frontend

- React
- JavaScript
- HTML5
- CSS3

## Backend

- Node.js
- Express.js

## Real-time Communication

- Socket.IO

## Game Logic

- Custom Quoridor Engine (JS)

## AI

- Minimax Algorithm
- Alpha-Beta Pruning

---

# 🏗️ Architecture

```
                React Frontend
                      │
               Socket.IO Client
                      │
                Socket.IO Server
                      │
                 Express Backend
                      │
               Quoridor Game Engine
                      │
         ┌────────────┴────────────┐
         │                         │
    Multiplayer Logic          AI Player
```

---

# 📂 Project Structure

```
.
├── client
│   ├── src
│   ├── components
│   ├── pages
│   ├── assets
│   └── styles
│
├── server
│   ├── routes
│   ├── sockets
│   ├── controllers
│   └── game
│
└── README.md
```

> *The structure may differ slightly depending on future updates.*

---

# 🚀 Getting Started

## Clone the repository

```bash
git clone https://github.com/Ahmed-eltohfa/quoridor.git
```

## Enter the project

```bash
cd quoridor
cd client
npm install

cd ../server
npm install
```

---

# ▶️ Running the Project

Start the backend:

```bash
npm run server
```

Start the frontend:

```bash
npm run dev
```

Or use the project's available scripts if they differ.

---

# 🌐 Multiplayer

Players can:

- Join queue
- Play in real time
- Synchronize moves instantly
- Handle player disconnects gracefully

---

# 🧠 Game Engine

The project contains a custom-built Quoridor engine responsible for:

- Pawn movement
- Wall placement
- Move validation
- Jump mechanics
- Win detection
- Pathfinding validation
- Turn management
- Undo functionality

Keeping the game logic separate from the UI makes the project easier to maintain and extend.

---

# 💡 Challenges

Some interesting technical challenges solved during development include:

- Designing the complete Quoridor game engine from scratch
- Synchronizing multiplayer game state
- Implementing intelligent AI using Minimax
- Preventing illegal wall placements
- Validating paths after every wall placement
- Managing game rooms and player sessions
- Keeping the UI synchronized across clients

---

# 📈 Future Improvements

- Spectator mode
- Match replay
- Tournament mode
- Chat during games
- More AI personalities
- Mobile application
- Custom themes

---

# 📚 What I Learned

Building this project helped strengthen my understanding of:

- Object-Oriented Design
- Real-time networking
- WebSockets
- React architecture
- Backend development
- Game development
- AI algorithms
- Minimax search
- Alpha-Beta pruning
- Graph traversal and pathfinding
- State management
- Clean software architecture

---

# 🤝 Contributing

Contributions, ideas, bug reports, and feature requests are always welcome.

Feel free to open an issue or submit a pull request.

---

# 👨‍💻 Author

**Ahmed Ehab**

GitHub: https://github.com/Ahmed-eltohfa

LinkedIn: https://www.linkedin.com/in/ahmed-ehab-dev

---

## ⭐ If you enjoyed this project

If you found this project interesting, consider giving it a ⭐ on GitHub. It helps others discover the project and supports future development.
