# AutoVault — Car Management Application

A sleek, dark-themed car inventory management system built with vanilla HTML, CSS, and JavaScript.

## Features

- 🚗 **Full CRUD** — Add, edit, and remove vehicles from your inventory
- 🔍 **Search & Filter** — Filter by make, model, year, color, and status
- 📊 **Live Stats** — Real-time totals for available, sold, and average price
- 💾 **Persistent Storage** — Data saved to localStorage
- 📱 **Responsive** — Works on desktop and mobile
- ⚡ **Zero dependencies** — Pure HTML/CSS/JS, no build step needed

## Project Structure

```
Test-repo/
├── index.html                      # Main application
├── src/
│   ├── styles.css                  # Dark luxury styles
│   └── app.js                      # Application logic
├── .github/
│   └── workflows/
│       └── deploy-dev.yml          # CI/CD for dev environment
└── README.md
```

## Environments

| Environment | Branch | Status |
|-------------|--------|--------|
| `dev`       | `dev`  | Active |
| `qa`        | `qa`   | Pending |
| `main`      | `main` | Pending |

## Running Locally

No build step required — just open `index.html` in a browser:

```bash
# Option 1: Direct open
open index.html

# Option 2: Simple HTTP server
npx serve .

# Option 3: Python
python3 -m http.server 8080
```

## CI/CD

Pushing to the `dev` branch automatically triggers the **Deploy to Dev** workflow, which:
1. Validates the project structure
2. Runs lint checks
3. Deploys to GitHub Pages under the `/dev` path
