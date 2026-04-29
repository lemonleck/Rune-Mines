const BASE_REWARD = 120;
const SAVE_KEY = "spire-mines-save-v1";

const difficulties = [
  { id: "easy", name: "简单", rows: 9, cols: 9, mines: 10, weight: 1, target: 180, unlock: 1, note: "3 分钟完成：120 金币起步。" },
  { id: "normal", name: "进阶", rows: 14, cols: 14, mines: 32, weight: 3.2, target: 300, unlock: 1, note: "地图变宽，节奏开始吃判断。" },
  { id: "hard", name: "困难", rows: 16, cols: 24, mines: 88, weight: 8, target: 360, unlock: 1, note: "6 分钟完成：960 金币起步，难度占比明显更高。" },
  { id: "ultimate", name: "终极", rows: 18, cols: 30, mines: 145, weight: 17, target: 480, unlock: 10, note: "10 级解锁。高风险高收入。" }
];

const items = [
  { id: "ember-heart", name: "余烬之心", min: 1, price: 90, type: "护命", desc: "踩雷时免死 1 次，并翻开该格周围。", effect: "life", charges: 1 },
  { id: "scout-lens", name: "斥候透镜", min: 1, price: 120, type: "主动", desc: "本局可揭示 5 个安全格。", effect: "revealSafe", charges: 5 },
  { id: "chalk-mark", name: "矿脉粉笔", min: 2, price: 170, type: "主动", desc: "本局可自动标记 3 个雷。", effect: "markMine", charges: 3 },
  { id: "minute-knife", name: "分针匕首", min: 2, price: 220, type: "结算", desc: "结算时实际用时减少 60 秒。", effect: "timeCut", amount: 60 },
  { id: "copper-oath", name: "铜誓纹章", min: 3, price: 260, type: "收益", desc: "胜利金币 x1.08。", effect: "scoreMult", amount: 1.08 },
  { id: "torch-map", name: "火把地图", min: 3, price: 310, type: "开局", desc: "开局自动翻开 8 个安全格。", effect: "startReveal", amount: 8 },
  { id: "bone-dice", name: "骨骰", min: 4, price: 360, type: "收益", desc: "若 4 分钟内获胜，额外金币 x1.15。", effect: "fastBonus", limit: 240, amount: 1.15 },
  { id: "rust-shield", name: "锈盾", min: 4, price: 420, type: "护命", desc: "额外获得 1 次免死。", effect: "life", charges: 1 },
  { id: "glass-orb", name: "观星玻璃", min: 5, price: 520, type: "主动", desc: "本局可窥视 2 个未知格是否为雷。", effect: "peek", charges: 2 },
  { id: "silver-contract", name: "银契约", min: 5, price: 640, type: "收益", desc: "胜利金币 x1.12。", effect: "scoreMult", amount: 1.12 },
  { id: "fuse-cutter", name: "引线剪", min: 6, price: 760, type: "容错", desc: "错误插旗不会计入旗数，并提示一次。", effect: "flagGuard" },
  { id: "echo-bell", name: "回声铃", min: 6, price: 900, type: "主动", desc: "本局可展开 1 片安全空白区。", effect: "openZero", charges: 1 },
  { id: "golden-nail", name: "金钉", min: 7, price: 1050, type: "收益", desc: "每剩 1 分钟目标时间，额外金币 +2%。", effect: "remainBonus" },
  { id: "black-candle", name: "黑蜡烛", min: 7, price: 1250, type: "开局", desc: "开局随机移除 3 个雷并补成安全格。", effect: "removeMines", amount: 3 },
  { id: "mirror-mask", name: "镜面假面", min: 8, price: 1480, type: "主动", desc: "本局可复制一次已购买主动道具的使用次数。", effect: "copyCharge", charges: 1 },
  { id: "red-ledger", name: "猩红账本", min: 8, price: 1750, type: "收益", desc: "困难和终极难度金币 x1.18。", effect: "hardMult", amount: 1.18 },
  { id: "spire-key", name: "尖塔钥匙", min: 9, price: 2100, type: "开局", desc: "每局首次点击必定打开一片更大的安全区域。", effect: "firstBloom" },
  { id: "void-coin", name: "虚空铸币", min: 9, price: 2500, type: "收益", desc: "胜利金币 x1.20，但失败损失 80 金币。", effect: "riskyMult", amount: 1.2, penalty: 80 },
  { id: "crown-clock", name: "王冠时钟", min: 10, price: 3200, type: "结算", desc: "结算时实际用时再减少 90 秒。", effect: "timeCut", amount: 90 },
  { id: "ascension-core", name: "升格核心", min: 10, price: 4200, type: "终局", desc: "终极难度胜利金币 x1.35，且经验 x1.5。", effect: "ultimateCore", amount: 1.35 }
];

let save = loadSave();
let game = null;
let timer = null;

const el = {
  level: document.getElementById("levelText"),
  xp: document.getElementById("xpText"),
  coins: document.getElementById("coinText"),
  levelBonus: document.getElementById("levelBonusText"),
  difficultyList: document.getElementById("difficultyList"),
  shopList: document.getElementById("shopList"),
  board: document.getElementById("board"),
  mode: document.getElementById("modeText"),
  mines: document.getElementById("mineText"),
  flags: document.getElementById("flagText"),
  timer: document.getElementById("timerText"),
  estimate: document.getElementById("estimateText"),
  message: document.getElementById("messageText"),
  activeItems: document.getElementById("activeItems"),
  upgradeCost: document.getElementById("upgradeCostText")
};

document.getElementById("newGameBtn").addEventListener("click", startGame);
document.getElementById("upgradeBtn").addEventListener("click", upgradeLevel);
document.getElementById("resetBtn").addEventListener("click", resetSave);

renderAll();
startGame();

function loadSave() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return { level: 1, xp: 0, coins: 0, selected: "easy", owned: [] };
  try {
    return { level: 1, xp: 0, coins: 0, selected: "easy", owned: [], ...JSON.parse(raw) };
  } catch {
    return { level: 1, xp: 0, coins: 0, selected: "easy", owned: [] };
  }
}

function persist() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
}

function levelBonus() {
  return +(1 + (save.level - 1) * 0.15).toFixed(2);
}

function upgradeCost() {
  return Math.round(100 * Math.pow(save.level, 1.72));
}

function renderAll() {
  renderPlayer();
  renderDifficulties();
  renderShop();
  renderActiveItems();
  updateEstimate();
}

function renderPlayer() {
  const need = save.level * 100;
  el.level.textContent = save.level;
  el.xp.textContent = `${save.xp} / ${need}`;
  el.coins.textContent = Math.floor(save.coins);
  el.levelBonus.textContent = `x${levelBonus().toFixed(2)}`;
  el.upgradeCost.textContent = save.level >= 20 ? "满级" : `${upgradeCost()} 金币`;
  document.getElementById("upgradeBtn").disabled = save.level >= 20 || save.coins < upgradeCost();
}

function renderDifficulties() {
  el.difficultyList.innerHTML = "";
  difficulties.forEach(diff => {
    const locked = save.level < diff.unlock;
    const card = document.createElement("button");
    card.className = `difficulty-card ${save.selected === diff.id ? "selected" : ""} ${locked ? "locked" : ""}`;
    card.disabled = locked;
    card.innerHTML = `
      <div class="difficulty-head">
        <h2>${diff.name}</h2>
        <strong>x${diff.weight}</strong>
      </div>
      <p>${locked ? `${diff.unlock} 级解锁。` : diff.note}</p>
      <div class="stats">
        <b>${diff.rows} x ${diff.cols}</b><b>${diff.mines} 雷</b>
        <b>目标 ${formatTime(diff.target)}</b><b>预计 ${estimateReward(diff, diff.target)} 金币</b>
      </div>
    `;
    card.addEventListener("click", () => {
      save.selected = diff.id;
      persist();
      renderAll();
      startGame();
    });
    el.difficultyList.appendChild(card);
  });
}

function renderShop() {
  el.shopList.innerHTML = "";
  items.forEach(item => {
    const owned = save.owned.includes(item.id);
    const locked = save.level < item.min;
    const card = document.createElement("div");
    card.className = `shop-card ${owned ? "owned" : ""} ${locked ? "locked" : ""}`;
    card.innerHTML = `
      <div class="shop-head">
        <h2>${item.name}</h2>
        <strong>${item.price}</strong>
      </div>
      <p>${item.desc}</p>
      <div class="shop-meta">
        <span class="tag">${item.type}</span>
        <span class="tag">${item.min} 级</span>
        <span class="tag">${owned ? "已拥有" : locked ? "未解锁" : "可购买"}</span>
      </div>
      <div class="shop-actions">
        <span>${owned ? "本局自动生效" : "永久购买"}</span>
        <button class="small" ${owned || locked || save.coins < item.price ? "disabled" : ""}>购买</button>
      </div>
    `;
    card.querySelector("button").addEventListener("click", () => buyItem(item));
    el.shopList.appendChild(card);
  });
}

function renderActiveItems() {
  if (!game) {
    el.activeItems.innerHTML = "";
    return;
  }
  const active = items.filter(item => save.owned.includes(item.id) && item.charges);
  el.activeItems.innerHTML = active.map(item => {
    const charge = game.charges[item.id] || 0;
    return `
      <div class="active-card">
        <div><span>${item.type}</span><b>${item.name} x${charge}</b></div>
        <button title="${item.desc}" data-use="${item.id}" ${charge <= 0 || game.over ? "disabled" : ""}>${symbolFor(item.effect)}</button>
      </div>
    `;
  }).join("");
  el.activeItems.querySelectorAll("[data-use]").forEach(btn => {
    btn.addEventListener("click", () => useItem(btn.dataset.use));
  });
}

function buyItem(item) {
  if (save.level < item.min || save.owned.includes(item.id) || save.coins < item.price) return;
  save.coins -= item.price;
  save.owned.push(item.id);
  persist();
  renderAll();
}

function upgradeLevel() {
  const cost = upgradeCost();
  if (save.level >= 20 || save.coins < cost) return;
  save.coins -= cost;
  save.level += 1;
  save.xp = 0;
  persist();
  renderAll();
}

function resetSave() {
  if (!confirm("确定重置等级、金币和道具吗？")) return;
  localStorage.removeItem(SAVE_KEY);
  save = loadSave();
  renderAll();
  startGame();
}

function startGame() {
  clearInterval(timer);
  const diff = { ...currentDifficulty() };
  const size = diff.cols >= 24 ? 26 : diff.cols >= 14 ? 31 : 40;
  game = {
    diff,
    started: Date.now(),
    elapsed: 0,
    over: false,
    flags: 0,
    opened: 0,
    firstClick: true,
    lives: ownedEffects("life").reduce((sum, item) => sum + item.charges, 0),
    flagGuard: hasEffect("flagGuard"),
    cells: [],
    charges: {}
  };
  items.forEach(item => {
    if (save.owned.includes(item.id) && item.charges) game.charges[item.id] = item.charges;
  });
  buildCells();
  applyStartItems();
  el.board.style.gridTemplateColumns = `repeat(${diff.cols}, var(--cell-size))`;
  el.board.style.setProperty("--cell-size", `${size}px`);
  el.mode.textContent = diff.name;
  el.mines.textContent = diff.mines;
  el.message.textContent = `${diff.name} expedition started. 右键插旗，主动道具在棋盘上方。`;
  renderBoard();
  renderActiveItems();
  tick();
  timer = setInterval(tick, 1000);
}

function currentDifficulty() {
  return difficulties.find(diff => diff.id === save.selected) || difficulties[0];
}

function buildCells() {
  const total = game.diff.rows * game.diff.cols;
  const mineSet = new Set();
  while (mineSet.size < game.diff.mines) mineSet.add(Math.floor(Math.random() * total));
  game.cells = Array.from({ length: total }, (_, index) => ({
    index,
    row: Math.floor(index / game.diff.cols),
    col: index % game.diff.cols,
    mine: mineSet.has(index),
    open: false,
    flag: false,
    peeked: false,
    count: 0
  }));
  game.cells.forEach(cell => {
    cell.count = neighbors(cell).filter(next => next.mine).length;
  });
}

function applyStartItems() {
  if (hasEffect("removeMines")) {
    const amount = ownedEffects("removeMines").reduce((sum, item) => sum + item.amount, 0);
    shuffle(game.cells.filter(cell => cell.mine)).slice(0, amount).forEach(cell => cell.mine = false);
    game.cells.forEach(cell => cell.count = neighbors(cell).filter(next => next.mine).length);
    game.diff.mines -= amount;
  }
  if (hasEffect("startReveal")) {
    const amount = ownedEffects("startReveal").reduce((sum, item) => sum + item.amount, 0);
    shuffle(game.cells.filter(cell => !cell.mine && cell.count > 0)).slice(0, amount).forEach(openCell);
  }
}

function renderBoard() {
  el.board.innerHTML = "";
  game.cells.forEach(cell => {
    const node = document.createElement("button");
    node.className = `cell ${cell.open ? "open" : ""} ${cell.mine && game.over ? "mine" : ""} ${cell.count ? `n${cell.count}` : ""} ${cell.flag ? "flagged" : ""}`;
    node.textContent = cell.open ? (cell.mine ? "✹" : cell.count || "") : cell.flag ? "⚑" : cell.peeked ? (cell.mine ? "!" : "?") : "";
    node.addEventListener("click", () => handleOpen(cell));
    node.addEventListener("contextmenu", event => {
      event.preventDefault();
      toggleFlag(cell);
    });
    el.board.appendChild(node);
  });
  el.flags.textContent = game.flags;
  el.mines.textContent = game.diff.mines;
  renderActiveItems();
  updateEstimate();
}

function handleOpen(cell) {
  if (game.over || cell.open || cell.flag) return;
  if (game.firstClick) protectFirstClick(cell);
  game.firstClick = false;
  if (cell.mine) {
    if (game.lives > 0) {
      game.lives -= 1;
      cell.mine = false;
      game.diff.mines -= 1;
      game.cells.forEach(next => next.count = neighbors(next).filter(n => n.mine).length);
      openArea(cell);
      el.message.textContent = `余烬挡下了一次爆炸，剩余免死 ${game.lives} 次。`;
      renderBoard();
      checkWin();
      return;
    }
    loseGame();
    return;
  }
  openArea(cell);
  renderBoard();
  checkWin();
}

function protectFirstClick(cell) {
  if (!cell.mine && cell.count === 0 && !hasEffect("firstBloom")) return;
  if (cell.mine) {
    cell.mine = false;
    const candidates = game.cells.filter(next => next.index !== cell.index && !next.mine);
    const target = candidates[candidates.length - 1];
    if (target) target.mine = true;
  }
  game.cells.forEach(next => next.count = neighbors(next).filter(n => n.mine).length);
  if (hasEffect("firstBloom")) neighbors(cell).forEach(next => {
    if (next.mine) next.mine = false;
  });
  game.cells.forEach(next => next.count = neighbors(next).filter(n => n.mine).length);
  game.diff.mines = game.cells.filter(next => next.mine).length;
}

function toggleFlag(cell) {
  if (game.over || cell.open) return;
  if (!cell.flag && game.flagGuard && !cell.mine) {
    game.flagGuard = false;
    cell.peeked = true;
    el.message.textContent = "引线剪提醒：这里不是雷。";
    renderBoard();
    return;
  }
  cell.flag = !cell.flag;
  game.flags += cell.flag ? 1 : -1;
  renderBoard();
}

function openArea(start) {
  const stack = [start];
  const seen = new Set();
  while (stack.length) {
    const cell = stack.pop();
    if (seen.has(cell.index) || cell.flag || cell.mine) continue;
    seen.add(cell.index);
    openCell(cell);
    if (cell.count === 0) neighbors(cell).forEach(next => stack.push(next));
  }
}

function openCell(cell) {
  if (!cell.open && !cell.mine) {
    cell.open = true;
    game.opened += 1;
  }
}

function useItem(id) {
  const item = items.find(entry => entry.id === id);
  if (!item || !game.charges[id]) return;
  const safeClosed = game.cells.filter(cell => !cell.open && !cell.flag && !cell.mine);
  const mineClosed = game.cells.filter(cell => !cell.open && !cell.flag && cell.mine);
  if (item.effect === "revealSafe" && safeClosed.length) {
    openArea(shuffle(safeClosed)[0]);
  }
  if (item.effect === "markMine" && mineClosed.length) {
    const mine = shuffle(mineClosed)[0];
    mine.flag = true;
    game.flags += 1;
  }
  if (item.effect === "peek") {
    const closed = game.cells.filter(cell => !cell.open && !cell.flag && !cell.peeked);
    if (closed.length) shuffle(closed)[0].peeked = true;
  }
  if (item.effect === "openZero") {
    const zero = safeClosed.find(cell => cell.count === 0) || safeClosed[0];
    if (zero) openArea(zero);
  }
  if (item.effect === "copyCharge") {
    const target = Object.keys(game.charges).find(key => key !== id && game.charges[key] >= 0);
    if (target) game.charges[target] += 1;
  }
  game.charges[id] -= 1;
  renderBoard();
  checkWin();
}

function checkWin() {
  const safeCount = game.cells.filter(cell => !cell.mine).length;
  if (game.opened >= safeCount) winGame();
}

function winGame() {
  game.over = true;
  clearInterval(timer);
  const reward = estimateReward(game.diff, game.elapsed);
  const xpGain = Math.round(game.diff.weight * 22 * (hasEffect("ultimateCore") && game.diff.id === "ultimate" ? 1.5 : 1));
  save.coins += reward;
  save.xp += xpGain;
  while (save.xp >= save.level * 100 && save.level < 20) {
    save.xp -= save.level * 100;
    save.level += 1;
  }
  persist();
  el.message.textContent = `胜利！获得 ${reward} 金币、${xpGain} 经验。`;
  renderAll();
  renderBoard();
}

function loseGame() {
  game.over = true;
  clearInterval(timer);
  const risky = items.find(item => item.effect === "riskyMult" && save.owned.includes(item.id));
  if (risky) save.coins = Math.max(0, save.coins - risky.penalty);
  persist();
  el.message.textContent = risky ? `爆炸失败。虚空铸币吞掉了 ${risky.penalty} 金币。` : "爆炸失败。换套道具再来一局。";
  renderAll();
  renderBoard();
}

function estimateReward(diff = currentDifficulty(), seconds = game ? game.elapsed : diff.target) {
  const cuts = ownedEffects("timeCut").reduce((sum, item) => sum + item.amount, 0);
  const settledSeconds = Math.max(30, seconds - cuts);
  const timeFactor = clamp(diff.target / settledSeconds, 0.35, 2.5);
  let itemMult = ownedEffects("scoreMult").reduce((mult, item) => mult * item.amount, 1);
  if (hasEffect("fastBonus") && settledSeconds <= 240) itemMult *= 1.15;
  if (hasEffect("hardMult") && ["hard", "ultimate"].includes(diff.id)) itemMult *= 1.18;
  if (hasEffect("riskyMult")) itemMult *= 1.2;
  if (hasEffect("ultimateCore") && diff.id === "ultimate") itemMult *= 1.35;
  if (hasEffect("remainBonus")) itemMult *= 1 + Math.max(0, diff.target - settledSeconds) / 60 * .02;
  return Math.floor(BASE_REWARD * diff.weight * timeFactor * levelBonus() * itemMult);
}

function updateEstimate() {
  if (!el.estimate) return;
  el.estimate.textContent = estimateReward();
}

function tick() {
  if (!game || game.over) return;
  game.elapsed = Math.floor((Date.now() - game.started) / 1000);
  el.timer.textContent = `${game.elapsed}s`;
  updateEstimate();
}

function neighbors(cell) {
  const result = [];
  for (let row = cell.row - 1; row <= cell.row + 1; row += 1) {
    for (let col = cell.col - 1; col <= cell.col + 1; col += 1) {
      if (row === cell.row && col === cell.col) continue;
      if (row < 0 || col < 0 || row >= game.diff.rows || col >= game.diff.cols) continue;
      result.push(game.cells[row * game.diff.cols + col]);
    }
  }
  return result;
}

function ownedEffects(effect) {
  return items.filter(item => item.effect === effect && save.owned.includes(item.id));
}

function hasEffect(effect) {
  return ownedEffects(effect).length > 0;
}

function shuffle(list) {
  return [...list].sort(() => Math.random() - .5);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatTime(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function symbolFor(effect) {
  return {
    revealSafe: "⌕",
    markMine: "⚑",
    peek: "?",
    openZero: "◇",
    copyCharge: "+"
  }[effect] || "•";
}
