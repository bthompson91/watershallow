# 👑 ⚓ Kings of Watershallow

**Kings of Watershallow** is an original, open-source, single-player worker-placement game that runs entirely in a browser. Deploy agents around a small harbour town, gather resources, construct buildings, complete commissions, and finish with the most influence.

It is inspired by the worker-placement genre, but its setting, rules, text, artwork, characters, and implementation are original. It is not affiliated with, endorsed by, or derived from any commercial board game.

## 🎮 Play online

**https://bthompson91.github.io/watershallow/**

## 💻 Run locally

```bash
git clone https://github.com/bthompson91/watershallow
cd watershallow
python3 -m http.server 8000
```

Then open `http://localhost:8000`. You can also open `index.html` directly in a browser.

No installation, build tools, frameworks, accounts, or network access are required.

## ⚙️ How it plays

- The game lasts **8 rounds**.
- You compete against 1–3 simple AI harbour rivals.
- Place agents at locations to gain 🪙 coin, 📦 supplies, 🔮 relics, 🧑‍🤝‍🧑 followers, or ⭐ influence.
- Spend resources to complete 📜 commissions for points and bonuses.
- Build 🏗️ structures for ongoing income, extra agents, or end-of-round resources.
- Play 🗂️ Orders for one-off benefits.
- After the final round, influence, leftover coin, commissions, and buildings determine the winner.

## 💾 Saving

The current voyage is stored in your browser under the key `kings-of-watershallow-save-v1`. Clearing site data or using a different browser profile will remove the save.

## 🛠️ Development

The game is intentionally dependency-free:

- `index.html` — page structure
- `style.css` — terminal-inspired interface
- `game.js` — rules, AI, rendering, and save system

Contributions are welcome. Useful starting points include better AI, more locations and commissions, difficulty settings, keyboard controls, sound effects, and mobile improvements.

## 📄 License

Released under the [MIT License](LICENSE).
