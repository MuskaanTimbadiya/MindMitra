# MindMitra – AI‑Powered Wellness Companion for Indian Exam Aspirants 🎓✨

> **MindMitra** is a modern, glassmorphic web app that helps JEE, NEET, UPSC, CAT & other aspirants stay calm, organized and motivated with AI‑driven journaling, mindfulness tools, study‑trackers and instant helpline access.

---

## ✨ Key Features
- **Stitch Design System** – sleek glass‑morphic UI, animated sea‑foam underlines, vibrant color palette, mobile‑first layout.
- **Top‑navbar & Sidebar** – section anchors (Home, Daily Tools, Mindfulness, Helplines) + quick‑action badges (exam, streak, notifications, settings, avatar).
- **Daily Tools** – multi‑language AI journal (Gemini 2.5 Flash), exam‑specific advice, mood‑check & vent‑wall.
- **Mindfulness Studio** – box breathing, progressive muscle relaxation, body‑scan with soothing soundscapes.
- **Vent Wall** – canvas‑based particle dissolve animation for emotional release.
- **Safety Card** – one‑tap access to Vandrevala, AASRA & other crisis helplines.
- **Multilingual UI** – English, Hindi, Tamil & Hinglish via `utils/translations.js`.
- **Responsive** – mobile bottom navigation, swipe gestures, sticky header on scroll.
- **WebGL Shader Background** – calming floating blob effect.

---

## 🛠️ Tech Stack
| Layer | Tech |
|---|---|
| **Framework** | React 18 (hooks) + Vite 5 |
| **Styling** | Vanilla CSS with custom `stitch-` design tokens |
| **AI** | Google Gemini 2.5 Flash (via `src/utils/gemini.js`)
| **Icons** | Material Symbols Outlined |
| **Build** | Vite (ESBuild) |
| **Deployment** | Vercel (static SPA) |
| **Version Control** | GitHub |

---

## 🚀 Getting Started (Local Development)
```bash
# 1. Clone the repo
git clone https://github.com/MuskaanTimbadiya/MindMitra.git
cd MindMitra

# 2. Install dependencies
npm install

# 3. Create a .env file (do NOT commit it!)
cp .env.example .env
# Edit .env and insert your Gemini API key:
# VITE_GEMINI_API_KEY=your_gemini_api_key_here

# 4. Run the dev server
npm run dev
# Open http://localhost:5173 in your browser
```

---

## 📦 Build & Deploy
```bash
npm run build   # creates the static “dist” folder
```
The generated files are ready for any static‑host. For Vercel we ship a **`vercel.json`** that rewrites all routes to `index.html` so React routing works.

---

## 🔐 Environment Variables
- `VITE_GEMINI_API_KEY` – **Required**. Your Gemini API key. **Never commit** this value.
- The project ships an `.env.example` to show the required key.
- `.env` is already added to `.gitignore`.

---

## 🌐 Deploy to Vercel (One‑click)
1. Visit **[vercel.com/new](https://vercel.com/new)** and import the `MindMitra` repository.
2. In **Environment Variables**, add:
   - **Key:** `VITE_GEMINI_API_KEY`
   - **Value:** *your Gemini key*
   - Enable for **Production**, **Preview**, and **Development**.
3. Confirm the framework preset is **Vite**, build command `npm run build`, output dir `dist`.
4. Click **Deploy** – Vercel will build and give you a live URL (e.g., `https://mindmitra.vercel.app`).

---

## 🎨 Design System – “Stitch”
- **Glass‑morphism** – background blur, translucent panels.
- **Animated Underlines** – sea‑foam `#90dbf4` slide on hover.
- **Badges** – exam badge (`school` icon) & streak badge (`local_fire_department`).
- **Avatar Ring** – filled `person` icon with secondary teal ring.
- **Typography** – `Plus Jakarta Sans` for headings, `Manrope` for body text.
- All components live under the `stitch-` CSS namespace.

---

## 🤝 Contributing
1. Fork the repo.
2. Create a feature branch (`git checkout -b feat/your‑feature`).
3. Follow the existing coding style, run `npm run lint` (Oxlint) before committing.
4. Open a Pull Request – describe the change and reference any related issue.

---

## 📄 License
This project is licensed under the **MIT License** – see the `LICENSE` file for details.

---

**Enjoy a calmer study life with MindMitra!**
