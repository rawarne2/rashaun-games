# Memory Game

A sequence memory game where you watch a pattern light up on a grid, then repeat it back in order. Each round adds one more item to the sequence — see how far you can go before you miss.

## How to Play

1. Pick a difficulty and hit **Start**
2. Watch the grid — squares will highlight one at a time to show the sequence
3. Once the sequence finishes, click the squares in the same order
4. Get it right and the sequence grows by one. Get it wrong and it's game over
5. Use the **Hint** button to briefly reveal the next square if you're stuck

### Difficulty levels

| Level | Grid | Content |
|-------|------|---------|
| Easy | 4×4 | Numbers |
| Medium | 5×5 | Numbers + colors |
| Hard | 6×6 | Numbers + colors + images |

Scores are saved locally and tracked on the leaderboard (top 3 per difficulty).

## Running the project

```bash
npm install
npm run dev     # dev server at localhost:5173
npm run build   # production build
```

## Stack

React 19 · TypeScript · Vite · Ant Design · motion/react
