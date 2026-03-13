# 📚 CyberDocii

**CyberDocii** is a modern, full-stack **technical documentation platform** designed to capture and visualize complex workflows — built specifically for cybersecurity projects, penetration testing write-ups, and step-by-step technical tutorials.

Instead of static notes, CyberDocii lets you build **living documentation** composed of modular blocks (commands, outputs, images, links) and automatically tracks the **journey** of how every project evolved — giving you a flight recorder for your work.

## 🔗 Live Demo
[cyberdocii.netlify.app](https://cyberdocii.netlify.app)

---

## 📌 Features

✔ Modular block-based documentation editor  
✔ Command, Output, Image, and Link block types  
✔ Journey timeline — automatic activity log for every project  
✔ Drag-and-drop block reordering  
✔ JWT-secured private projects with public sharing support  
✔ Autosave — never lose progress  
✔ Clean dark-themed dashboard UI (Tailwind CSS)  
✔ Image and asset upload support  

---

## 🏗 Architecture Overview

CyberDocii uses a **decoupled, microservices-inspired architecture** separating the presentation layer from the data layer.

```
Frontend (React + Vite + Tailwind)
│
▼
Backend API (Node.js / Express)
│
▼
Database (MongoDB via Mongoose)
│
▼
Storage (Multer / Local Disk — Images & Assets)
```

This separation ensures **scalability, clean API contracts, and a fast, responsive UI**.

---

## 📂 Project Structure

```
CyberDocii/
│
├── frontend/                        # React (Vite) Application
│   └── src/
│       ├── pages/
│       │   ├── Dashboard.jsx        # Project management control center
│       │   ├── ProjectEditor.jsx    # Modular block editor interface
│       │   └── Journey.jsx          # Timeline view of project history
│       ├── components/
│       │   └── BlockItem.jsx        # Dynamic block renderer (command/image/output)
│       └── context/
│           └── AuthContext.js       # Global JWT auth state via React Context
│
└── backend/                         # Node.js (Express) REST API
    ├── models/
    │   ├── User.js                  # User credentials and profile schema
    │   ├── Project.js               # Top-level documentation container
    │   ├── Section.js               # Individual content blocks (type-based)
    │   └── Journey.js               # Activity log — tracks every project action
    ├── routes/
    │   ├── authRoutes.js            # Authentication endpoints
    │   └── projectRoutes.js         # Project and section CRUD
    ├── controllers/                 # Business logic layer
    └── uploads/                     # Stored images and media assets
```

---

## ⚙️ Working Mechanism

CyberDocii operates as a **coordinated documentation pipeline** that transforms raw technical work into structured, shareable write-ups.

---

### 1️⃣ Project Creation

A user creates a **Project** — a blank canvas representing a single piece of documentation, such as:

```
"Network Pentest 101"
"DVWA SQL Injection Walkthrough"
"Home Lab SOC Setup"
```

Projects are stored in MongoDB and immediately accessible from the **Dashboard**.

---

### 2️⃣ Building with Blocks

Inside the **Project Editor**, users add **Sections** — modular content blocks. Each block has a `type` that controls how it renders:

| Block Type | Purpose |
|---|---|
| `command` | Terminal commands run during the workflow |
| `output` | The result or response from those commands |
| `image` | Screenshots, diagrams, visual evidence |
| `text` | Explanations and narrative context |
| `link` | References to tools, CVEs, or resources |

This block-based approach mirrors how a real technical workflow happens — **command → output → observation → next step**.

---

### 3️⃣ The Journey Mechanism

This is CyberDocii's **signature feature**.

Every time a user interacts with a project — adding a block, reordering steps, updating a command — the backend automatically creates a **Journey Entry** in the `Journey` model.

```
[Journey Log - Project: DVWA SQL Injection]

10:02 AM  →  Project created
10:05 AM  →  Added Command block: "sqlmap -u http://target/..."
10:08 AM  →  Added Output block: "[*] identified injectable parameter"
10:12 AM  →  Image uploaded: screenshot_result.png
10:15 AM  →  Reordered blocks
```

This creates a **"flight recorder"** for the documentation — showing exactly how a result was reached, step by step, over time. Useful for:

- Reviewing your own methodology
- Sharing reproducible proof-of-concept write-ups
- Building a portfolio of documented work

---

### 4️⃣ Autosave & Data Syncing

The frontend communicates with the backend via **Axios**. Edits made in the Project Editor are automatically pushed to MongoDB — no manual save required.

---

### 5️⃣ Authentication & Access Control

Projects are protected by **JWT (JSON Web Token)** authentication.

- Private projects require a valid token to view or edit
- Projects can optionally be set to **public** for sharing write-ups or tutorials
- Token validation is handled globally via `AuthContext.js` on the frontend

---

### 6️⃣ Image & Asset Handling

Media uploads (screenshots, diagrams) are handled by **Multer**, stored on local disk under `backend/uploads/`, and served as static assets to the frontend.

---

## 📊 Tech Stack Summary

| Component | Technology | Purpose |
|---|---|---|
| UI | React + Vite + Tailwind CSS | Dynamic editor and dashboard |
| API | Node.js + Express | Business logic and REST endpoints |
| Database | MongoDB (Mongoose) | Flexible block-based data storage |
| Auth | JWT | Secure access control |
| Storage | Multer + Local Disk | Image and asset uploads |
| HTTP Client | Axios | Frontend ↔ Backend communication |
| Tracking | Journey Model | Event-driven activity logging |

---

## 🚀 Key Advantages

### 🧱 Block-Based Documentation
Unlike traditional note-taking or markdown editors, CyberDocii structures content the way technical work actually happens — as a sequence of typed commands, observed outputs, and collected evidence.

### 🗺 Journey Timeline
The automatic activity log goes beyond version history. It gives you a **narrative timeline** of how a project was built, making it ideal for write-ups, post-mortems, and portfolio pieces.

### 🔐 Secure by Default
JWT authentication ensures private projects stay private, while the public sharing option lets you publish tutorials without any manual export steps.

### ⚡ Fast and Responsive
Vite + React ensures near-instant hot reloads during development and a snappy production UI. Autosave means no interruptions while working.

---

## 🛠 Installation

### Clone Repository

```bash
git clone https://github.com/GadeKuldeep/CyberDocii.git
cd CyberDocii
```

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Deployment

| Service | Platform |
|---|---|
| Frontend | Netlify / Vercel |
| Backend + DB | Render / Railway |

---

## 📜 License

MIT License

---

## 👨‍💻 Author

**Kuldeep**  
Cybersecurity Enthusiast | Offensive Security | SOC Analysis  
[GitHub →](https://github.com/GadeKuldeep)
