<p align="center">
  <img width="199" height="199" alt="qshare" src="https://github.com/user-attachments/assets/8d5916ed-37ec-4252-8586-f387f20a65cb" />
</p>



```
  _____                _                 _ 
 |  ___| __ ___  _ __ | |_ ___ _ __   __| |
 | |_ | '__/ _ \| '_ \| __/ _ \ '_ \ / _` |
 |  _|| | | (_) | | | | ||  __/ | | | (_| |
 |_|  |_|  \___/|_| |_|\__\___|_| |_|\__,_|
                                           
       FRONTEND UI
```


<!-- Title Section -->
<h1 align="center">🎨 Kitsu Frontend — React + Vite + Tailwind 🎨</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Vite-5.0.0-ffde57?style=for-the-badge&logo=vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.17-teal?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Framer_Motion-animations-ff69b4?style=for-the-badge&logo=framer" />
</p>

<p align="center">
  <i>A sleek, animated UI for shortening links, powered by React + Vite + Tailwind.</i>
</p>


---

## ✨ Cool Features
- 🎥 **Logo animations** with Framer Motion
- 🌈 **Drifting blobs background** for soft ambience
- 📋 **One-click copy** + toast notifications
- 💾 **Local history** of shortened links with localStorage
- 📱 **Responsive & mobile-first**

---

## ⚡ Quick Start

```bash
npm install
npm run dev
```

Visit 👉 `http://localhost:5173`

---

## 📡 Backend Requirements
Expects a backend with these endpoints:
- `POST /shorten`
- `GET /shorten/{code}`
- `PUT /shorten/{code}`
- `DELETE /shorten/{code}`
- `GET /shorten/r/{code}`
- `GET /shorten/{code}/stats`

Set API base in `.env`:

```env
VITE_API_URL=http://localhost:8080
```

---

## 📂 Folder Highlights
```
src/
├── components/       # Reusable React components
├── styles/           # Tailwind + custom theme
├── config/           # Animation configs
└── assets/           # Logos, icons, extras
```

---

## 🌱 Roadmap
- [ ] 📊 Stats UI with charts
- [ ] 🌙 Dark/Light mode toggle
- [ ] 🖼️ Custom theme selector
- [ ] 🧩 PWA support (offline-first)

---

## 🤝 Contribution Guide
- Keep PRs small and focused
- Respect Tailwind utility-first philosophy
- Add visual demos (GIFs/screens) for new features

---

<h3 align="center">💖 MIT License | Beautiful UI for Everyone 💖</h3>
