# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite, localhost:5173)
npm run build     # Type-check + production build (tsc -b && vite build)
npm run lint      # ESLint (TypeScript + react-hooks + react-refresh rules)
npm run preview   # Preview the production build locally
```

There are no tests configured in this project.

## Stack

- **React 19** + **TypeScript** via **Vite**
- **Ant Design v5** (`antd`) for UI components (Button, Modal, Select, Statistic, Typography, Row/Col)
- **`motion/react`** (the `motion` package, formerly `framer-motion`) for animations — import as `import { motion } from 'motion/react'`
- **`@ant-design/icons`** for icons

## Architecture

The entire game lives in `src/App.tsx` — a single-file design with four co-located components:

| Component | Responsibility |
|---|---|
| `GameSquare` | One grid cell; handles 3D card-flip animation (front/back faces), image preloading, and per-cell animation state (correct/wrong/sequence highlight) |
| `GameControls` | Difficulty selector, Start, Hint, Leaderboard buttons |
| `LeaderboardModal` | Ant Design Modal showing top-3 scores per difficulty from localStorage |
| `GameOverModal` | Ant Design Modal with round count and elapsed time on loss |
| `App` | Root: all game state, timers, sequence logic, grid generation |

### Game State Machine

```
idle → showing → playing → (correct sequence complete) → showing  (next round)
                         → lost
lost → idle  (via GameOverModal close / resetBoard)
```

`GameState` type: `'idle' | 'playing' | 'showing' | 'lost'`

### Difficulty

Configured via `DIFFICULTY_CONFIG`:

| Level | Grid | Item types |
|---|---|---|
| easy | 4×4 | numbers only |
| medium | 5×5 | numbers + colors |
| hard | 6×6 | numbers + colors + images (picsum.photos) |

### Key State

- `sequence` — array of grid item IDs representing the full sequence so far; grows by one each round
- `displaySequence` — subset of `sequence` currently being animated (shown one at a time, 1.5s apart)
- `revealed` — `Set<number>` of IDs whose content is currently visible (user clicks + hint)
- `errorSquare` — ID of the wrong square clicked (triggers shake animation)
- Two timer refs (`timerRef`, `displayTimerRef`) separate internal tracking from display updates to avoid unnecessary re-renders

### Leaderboard

Persisted in `localStorage` under the key `memoryGameLeaderboard` as `Record<Difficulty, Score[]>`. Top 3 scores per difficulty, sorted by rounds descending then time ascending.

### Styling

CSS variables for all colors and spacing are defined at the top of `src/App.css`. Use `var(--color-primary)`, `var(--spacing-md)`, etc. rather than hardcoding values. The layout is responsive with breakpoints at 600px (mobile portrait) and 900px (tablet/landscape).

### Animation Notes

- Card flip: `rotateY` on `.square-front` (0→180 hidden, 180→0 shown) and `.square-back` (opposite)
- Correct click: `scale: [1, 1.05, 1]` + green `borderColor`
- Wrong click: `x: [0, -5, 5, -5, 5, 0]` shake + red `borderColor`
- Sequence display: `scale: [1, 1.05, 1]` + blue `borderColor`
- `prefers-reduced-motion` collapses all durations to near-zero via CSS
