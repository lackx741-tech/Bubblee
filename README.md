# Bubblee - Official Reown AppKit (Web3Modal) Vite JavaScript

This project uses the **official Reown AppKit** (formerly Web3Modal) so you get the real modal UI/UX.

## Quick start

```bash
npm install
npm run dev
```

Open the local URL shown in terminal (usually `http://localhost:5173`).

## Configure your Project ID

1. Create a free project at Reown Cloud.
2. Copy your Project ID.
3. Create a `.env` file in project root:

```bash
cp .env.example .env
```

4. Put your ID in `.env`:

```env
VITE_REOWN_PROJECT_ID=YOUR_REAL_PROJECT_ID
```

Restart dev server after changing `.env`.

## Build

```bash
npm run build
npm run preview
```

## Notes

- This is **JavaScript** (not TypeScript).
- UI modal is the official AppKit modal (exact family of UI you requested).
- You can style your page around it in `src/styles.css`.
