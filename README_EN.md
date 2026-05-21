# Rune Mines

[<kbd>中文</kbd>](./README.md) [<kbd>English</kbd>](./README_EN.md)

Rune Mines is a browser-based Minesweeper variant with progression, permanent items, loadout building, and elite risk-reward mechanics. Clear minefields, earn coins and XP, grow your build, and chase higher-value clears on harder boards.

## Latest Update

This update adds a second presentation-focused enhancement pass with 3 improvements:

1. A global sound system with an `SFX` toggle.
2. Stronger in-run feedback, including chain reveal cues, elite event overlays, and more forceful end-state board reactions.
3. A richer result recap that summarizes elite triggers, final bounty multiplier, and record status.

## Features

- Classic Minesweeper controls: left-click to reveal, right-click to flag.
- Four difficulties with different board sizes, mine counts, target times, and reward weights.
- Character progression with coins, XP, and level-based reward scaling.
- Permanent item shop and loadout system.
- Achievements and daily tasks for long-term progression.
- Elite cell events that add meaningful risk-reward decisions inside each run.
- Immersive feedback with sound cues, board overlays, and stronger result presentation.
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

## Sound And Feedback

- The board status area now includes an `SFX` toggle, enabled by default and persisted between refreshes.
- Lightweight audio cues are generated with native `Web Audio API`, with no external audio assets.
- Standard reveals, chain clears, flags, elite triggers, wins, and losses each have distinct feedback.
- Elite events now use both message text and short-lived overlay feedback to make risk spikes more readable.

## Running

This is a pure frontend project with no build step.

1. Open the project folder.
2. Open `index.html` in a browser.
3. Start playing.

You can also run it with any static file server, such as VS Code Live Server.

## Result Recap

The result panel now highlights:

- Elite cells opened in the run
- `Vault / Scout / Doom` trigger counts
- Final bounty multiplier
- Whether reward or clear-time records were refreshed
- A short flavor line based on how the run ended

## Record Tracking

The local save persists:

- `eliteOpened`
- `eliteDoomTriggered`
- `bestRewardByDifficulty`
- `bestTimeByDifficulty`
- `settings.soundEnabled`

If a run beats the best reward or best clear time for the selected difficulty, the result panel shows `New Record`.

## Project Structure

```text
Rune Mines/
├── index.html
├── styles.css
├── game.js
└── README.md
```
