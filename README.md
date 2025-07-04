# 🏠 Aqarat-Finder

Real-estate search WebApp powered by **Fanar LLM** (multilingual Q&A & translation) with a **React + Vite** frontend and a **Node/Express** backend.  
Type (or speak!) a prompt in **English or Arabic** and get filtered listings, instant summaries, maps, and images.

---

## ✨ Key Features
- **Semantic Search** – fuzzy keyword + rule-based filters (district, type, price).
- **Bilingual** – automatic Arabic ↔ English detection and translation through Fanar.
- **Google Maps Embed** for every listing.
- **Modern UI** – glassmorphic navbar, chat-style search bar, responsive cards & modals.

---

## 📁 Project Structure

```
# Project tree

.
 * [backend](./backend)                — Express API & Fanar integration
 * [public](./public)                  — Static assets served by Vite
 * [src](./src)                        — React frontend (components, styles)
 * [.gitignore](./.gitignore)
 * [README.md](./README.md)
 * [eslint.config.js](./eslint.config.js)
 * [index.html](./index.html)          — Vite entry
 * [package.json](./package.json)      — root dev scripts
 * [package-lock.json](./package-lock.json)
 * [vite.config.js](./vite.config.js)  — proxy `/search` → backend
```

<details>
<summary>backend sub-tree</summary>

```
backend
 ├─ images/                — placeholder & fallback photos
 ├─ buy.json               — raw listings for “buy”
 ├─ rent.json              — raw listings for “rent”
 ├─ listings.json          — merged dataset used in demo
 ├─ fanar.js               — helper to call Fanar chat API
 ├─ fanar_prompt.txt       — system prompt
 ├─ search.js              — semantic match + summary generation
 ├─ server.js              — Express server (PORT 5000)
 ├─ package.json / lock    — backend deps & scripts
 └─ .env                   — **add your FANAR_API_KEY here**
```
</details>

---

## 🚀 Quick Start

### 1. Clone and install
```bash
git clone https://github.com/mahiplol/Aqarat-Finder.git
cd Aqarat-Finder
```

### 2. Backend (port **5000**)
```bash
cd backend
cp .env.example .env          # create and add FANAR_API_KEY, optional MAP key
npm install
npm run dev                   # nodemon server.js
# → “Server running on http://localhost:5000”
```

### 3. Frontend (port **5173**)
```bash
cd ../src
npm install
npm run dev                   # Vite dev server
# React app opens at http://localhost:5173
```

> **Vite proxy** in `vite.config.js` automatically forwards  
> `POST /search` → `http://localhost:5000/search`.

---

## 🔧 Environment Variables

| File / var           | Purpose                           |
|----------------------|-----------------------------------|
| `backend/.env`       | `FANAR_API_KEY=xxxx` (required)   |
|                      | `VITE_GOOGLE_MAPS_API_KEY=xxxx` (optional, if embedding maps) |

---

