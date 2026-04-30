# Rune Mines

[<kbd>中文</kbd>](./README.md) [<kbd>English</kbd>](./README_EN.md)

Rune Mines is a browser-based Minesweeper variant with character progression, coin rewards, and permanent item builds. Players clear minefields of different sizes, earn coins and experience from victories, then upgrade their character and buy items to unlock higher-risk, higher-reward runs.

## Features

- Classic Minesweeper controls: left-click to reveal, right-click to flag.
- Four difficulties: Easy, Advanced, Hard, and Ultimate, each with different board sizes, mine counts, target times, and reward weights.
- Progression system: earn coins and XP from wins, then level up to increase the settlement multiplier.
- Shop system: buy permanent items that apply automatically or provide active abilities in future runs.
- Time-based rewards: faster clears increase the final coin payout.
- Local save: level, XP, coins, and owned items are stored in browser `localStorage`.

## Running

This is a pure frontend project with no build step.

1. Open the project folder.
2. Open `index.html` in a browser.
3. Start playing.

You can also run it with any static file server, such as VS Code Live Server.

## Gameplay

After a run starts, the board appears in the center area. Reveal every safe cell while avoiding mines.

- Left-click: reveal a cell.
- Right-click: place or remove a flag.
- New Run: restart with the selected difficulty.
- Level Up: spend coins to increase your level and reward multiplier.
- Buy Items: shop items are permanent and apply in every run after purchase.
- Reset Save: clear level, coins, and item data from the current browser.

The first click has protection to avoid an immediate mine hit. Some items can expand the opening safe area even further.

## Difficulty Table

| Difficulty | Board | Mines | Weight | Target Time | Unlock Level |
| --- | --- | --- | --- | --- | --- |
| Easy | 9 x 9 | 10 | x1 | 3:00 | 1 |
| Advanced | 14 x 14 | 32 | x3.2 | 5:00 | 1 |
| Hard | 16 x 24 | 88 | x8 | 6:00 | 1 |
| Ultimate | 18 x 30 | 145 | x17 | 8:00 | 10 |

## Reward Formula

Base coin formula:

```text
Coins = 120 × difficulty weight × time factor × level multiplier × item multiplier
```

Where:

```text
Time factor = target time / final settlement time
```

The time factor is clamped between `0.35` and `2.50`. Some items reduce settlement time, increase coin multipliers, or provide extra bonuses for Hard and Ultimate difficulty.

XP gain is tied to difficulty weight. Ultimate runs can gain extra XP after buying the endgame item.

## Item System

Shop items unlock gradually by level:

- Life-saving: prevent death after hitting a mine or provide extra tolerance.
- Active: show buttons above the board to reveal safe cells, mark mines, peek unknown cells, and more.
- Opening: automatically reveal safe cells, remove mines, or strengthen the first click.
- Income: increase victory coins or add multipliers under specific conditions.
- Settlement: reduce final settlement time to make speed rewards easier to trigger.
- Endgame: strengthen coin and XP rewards in Ultimate difficulty.

## Project Structure

```text
Rune Mines/
├── index.html   # Page structure and game UI containers
├── styles.css   # Dark mine-themed UI, board, and responsive layout
├── game.js      # Game rules, Minesweeper logic, save data, items, rewards
└── README.md    # Chinese documentation
```

## Current State

The project is currently a lightweight single-page game prototype. All logic lives in frontend files, making it a good base for achievements, more items, audio, animations, leaderboards, or level objectives.
