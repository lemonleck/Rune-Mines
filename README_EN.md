# Rune Mines

[<kbd>中文</kbd>](./README.md) [<kbd>English</kbd>](./README_EN.md)

Rune Mines is a browser-based Minesweeper variant with character progression, permanent items, loadout building, and a new elite risk-reward layer. Clear minefields, earn coins and XP, unlock stronger builds, and push better records on harder boards.

## Latest Update

This update ships 3 improvement areas around elite risk play:

1. Elite cell system: each run now spawns visible `Vault`, `Scout`, and `Doom` cells with different outcomes.
2. Better in-run feedback: the board now shows elite cells remaining, current bounty multiplier, and how many `Doom` triggers have fired.
3. Stronger results and records: the result overlay now highlights elite bounty outcomes and tracks best reward / best clear time per difficulty.

## Features

- Classic Minesweeper controls: left-click to reveal, right-click to flag.
- Four difficulties with different board sizes, mine counts, target times, and reward weights.
- Character progression with coins, XP, and level-based reward scaling.
- Permanent item shop and loadout system.
- Achievements and daily tasks for long-term progression.
- Elite cell events that add meaningful risk-reward decisions inside each run.
- Local save data stored in browser `localStorage`.

## Elite Cells

Each difficulty spawns a fixed number of elite cells:

- `easy`: 1
- `normal`: 2
- `hard`: 3
- `ultimate`: 4

Elite types:

- `Vault`
  - Grants a `x1.12` run bounty multiplier
  - Stacks multiplicatively
- `Scout`
  - Reveals up to 3 nearby safe unopened cells
  - Falls back to 1 global safe reveal if no local target exists
- `Doom`
  - Grants a `x1.20` run bounty multiplier
  - Adds 1 new hidden mine to a valid unopened safe cell
  - If no valid cell exists, only the bounty bonus is kept

## Running

This is a pure frontend project with no build step.

1. Open the project folder.
2. Open `index.html` in a browser.
3. Start playing.

You can also run it with any static file server, such as VS Code Live Server.

## Record Tracking

The local save now persists:

- `eliteOpened`
- `eliteDoomTriggered`
- `bestRewardByDifficulty`
- `bestTimeByDifficulty`

If a run beats the best reward or best clear time for the selected difficulty, the result panel will show `New Record`.

## Project Structure

```text
Rune Mines/
├── index.html
├── styles.css
├── game.js
└── README.md
```
