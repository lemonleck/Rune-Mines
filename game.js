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

const activeEffects = new Set(["revealSafe", "markMine", "peek", "openZero", "copyCharge"]);
const quotaPass = {
  id: "tactician-pass",
  name: "战术增编令",
  price: 3000,
  desc: "下一局若超出基础携带位，临时增加 1 个被动位和 1 个主动位。"
};

const achievementGroups = [
  {
    title: "初级成就",
    items: [
      { id: "games-50", name: "矿区熟手", desc: "完成 50 局游戏", reward: 600, done: stats => stats.games >= 50 },
      { id: "wins-10", name: "稳定排雷", desc: "累计胜利 10 局", reward: 700, done: stats => stats.wins >= 10 },
      { id: "coins-5000", name: "第一桶矿金", desc: "累计赢得 5000 金币", reward: 800, done: stats => stats.coinsEarned >= 5000 }
    ]
  },
  {
    title: "中级成就",
    items: [
      { id: "games-100", name: "百局探险家", desc: "完成 100 局游戏", reward: 1400, done: stats => stats.games >= 100 },
      { id: "wins-30", name: "可靠矿长", desc: "累计胜利 30 局", reward: 1600, done: stats => stats.wins >= 30 },
      { id: "coins-20000", name: "金脉经营者", desc: "累计赢得 20000 金币", reward: 1800, done: stats => stats.coinsEarned >= 20000 }
    ]
  },
  {
    title: "高级成就",
    items: [
      { id: "games-200", name: "尖塔常客", desc: "完成 200 局游戏", reward: 3200, done: stats => stats.games >= 200 },
      { id: "wins-80", name: "排雷大师", desc: "累计胜利 80 局", reward: 3600, done: stats => stats.wins >= 80 },
      { id: "coins-80000", name: "矿金巨匠", desc: "累计赢得 80000 金币", reward: 4200, done: stats => stats.coinsEarned >= 80000 }
    ]
  },
  {
    title: "特殊成就",
    items: [
      { id: "first-hard-win", name: "困难首胜", desc: "首次完成困难关卡", reward: 1200, done: stats => stats.difficultyWins.hard >= 1 },
      { id: "first-ultimate-win", name: "终极首胜", desc: "首次完成终极关卡", reward: 2600, done: stats => stats.difficultyWins.ultimate >= 1 },
      { id: "no-flag-win", name: "裸手排雷", desc: "不插旗赢得任意一局", reward: 1500, done: stats => stats.noFlagWins >= 1 },
      { id: "fast-easy-win", name: "一分钟矿灯", desc: "60 秒内完成简单关卡", reward: 1000, done: stats => stats.fastEasyWins >= 1 },
      { id: "all-items", name: "全套装备", desc: "购买全部道具", reward: 5000, done: stats => stats.itemsOwned >= items.length }
    ]
  }
];

const dailyTaskTemplates = [
  { id: "daily-games", name: "今日巡矿", desc: "完成 3 局游戏", target: 3, reward: 500, progress: daily => daily.stats.games },
  { id: "daily-win", name: "今日胜利", desc: "赢得 1 局游戏", target: 1, reward: 700, progress: daily => daily.stats.wins },
  { id: "daily-flags", name: "标记矿脉", desc: "插旗 25 次", target: 25, reward: 600, progress: daily => daily.stats.flags }
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
  boardWrap: document.getElementById("boardWrap"),
  mode: document.getElementById("modeText"),
  mines: document.getElementById("mineText"),
  flags: document.getElementById("flagText"),
  timer: document.getElementById("timerText"),
  estimate: document.getElementById("estimateText"),
  message: document.getElementById("messageText"),
  activeItems: document.getElementById("activeItems"),
  upgradeCost: document.getElementById("upgradeCostText"),
  loadoutSummary: document.getElementById("loadoutSummary"),
  passiveLoadout: document.getElementById("passiveLoadout"),
  activeLoadout: document.getElementById("activeLoadout"),
  achievementList: document.getElementById("achievementList"),
  dailyTaskList: document.getElementById("dailyTaskList"),
  resultOverlay: document.getElementById("resultOverlay"),
  resultPanel: document.getElementById("resultPanel"),
  resultKicker: document.getElementById("resultKicker"),
  resultTitle: document.getElementById("resultTitle"),
  resultCoins: document.getElementById("resultCoins"),
  resultXp: document.getElementById("resultXp"),
  resultTime: document.getElementById("resultTime"),
  resultText: document.getElementById("resultText")
};

document.getElementById("newGameBtn").addEventListener("click", startGame);
document.getElementById("upgradeBtn").addEventListener("click", upgradeLevel);
document.getElementById("resetBtn").addEventListener("click", resetSave);
document.getElementById("closeResultBtn").addEventListener("click", hideResult);
document.getElementById("resultNewGameBtn").addEventListener("click", startGame);

renderAll();
startGame();

function loadSave() {
  const defaults = defaultSave();
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return defaults;
  try {
    return normalizeSave({ ...defaults, ...JSON.parse(raw) });
  } catch {
    return defaults;
  }
}

function defaultSave() {
  return {
    level: 1,
    xp: 0,
    coins: 0,
    selected: "easy",
    owned: [],
    loadout: { passive: [], active: [] },
    quotaPasses: 0,
    achievements: [],
    stats: defaultStats(),
    daily: defaultDaily()
  };
}

function defaultStats() {
  return {
    games: 0,
    wins: 0,
    coinsEarned: 0,
    noFlagWins: 0,
    fastEasyWins: 0,
    itemsOwned: 0,
    difficultyWins: { easy: 0, normal: 0, hard: 0, ultimate: 0 }
  };
}

function defaultDaily() {
  return { date: todayKey(), claimed: [], stats: { games: 0, wins: 0, flags: 0 } };
}

function normalizeSave(data) {
  data.owned = Array.isArray(data.owned) ? data.owned : [];
  data.quotaPasses = Number.isFinite(data.quotaPasses) ? Math.max(0, data.quotaPasses) : 0;
  data.loadout = data.loadout || { passive: [], active: [] };
  data.loadout.passive = Array.isArray(data.loadout.passive) ? data.loadout.passive : [];
  data.loadout.active = Array.isArray(data.loadout.active) ? data.loadout.active : [];
  data.achievements = Array.isArray(data.achievements) ? data.achievements : [];
  data.stats = { ...defaultStats(), ...(data.stats || {}) };
  data.stats.difficultyWins = { ...defaultStats().difficultyWins, ...(data.stats.difficultyWins || {}) };
  data.stats.itemsOwned = data.owned.length;
  data.daily = { ...defaultDaily(), ...(data.daily || {}) };
  data.daily.claimed = Array.isArray(data.daily.claimed) ? data.daily.claimed : [];
  data.daily.stats = { ...defaultDaily().stats, ...(data.daily.stats || {}) };
  if (data.daily.date !== todayKey()) data.daily = defaultDaily();
  normalizeLoadout(data);
  return data;
}

function persist() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
}

function todayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function ensureDaily() {
  if (!save.daily || save.daily.date !== todayKey()) save.daily = defaultDaily();
}

function updateStatsSnapshot() {
  save.stats.itemsOwned = save.owned.length;
}

function itemSlot(item) {
  return activeEffects.has(item.effect) ? "active" : "passive";
}

function baseLoadoutLimits(level = save.level) {
  return {
    passive: level >= 7 ? 2 : 1,
    active: level >= 10 ? 3 : level >= 4 ? 2 : 1
  };
}

function loadoutLimits() {
  const base = baseLoadoutLimits();
  const boost = save.quotaPasses > 0 ? 1 : 0;
  return { passive: base.passive + boost, active: base.active + boost };
}

function normalizeLoadout(data = save) {
  const owned = new Set(data.owned || []);
  const limits = loadoutLimitsFor(data);
  data.loadout = data.loadout || { passive: [], active: [] };
  data.loadout.passive = [...new Set(data.loadout.passive || [])]
    .filter(id => {
      const item = items.find(entry => entry.id === id);
      return item && owned.has(id) && itemSlot(item) === "passive";
    })
    .slice(0, limits.passive);
  data.loadout.active = [...new Set(data.loadout.active || [])]
    .filter(id => {
      const item = items.find(entry => entry.id === id);
      return item && owned.has(id) && itemSlot(item) === "active";
    })
    .slice(0, limits.active);
}

function loadoutLimitsFor(data) {
  const base = baseLoadoutLimits(data.level);
  const boost = data.quotaPasses > 0 ? 1 : 0;
  return { passive: base.passive + boost, active: base.active + boost };
}

function equippedIds() {
  normalizeLoadout();
  return [...save.loadout.passive, ...save.loadout.active];
}

function equippedItems() {
  const ids = game && game.equipped ? game.equipped : equippedIds();
  return items.filter(item => ids.includes(item.id));
}

function currentLoadoutUsesBoost() {
  const base = baseLoadoutLimits();
  return save.loadout.passive.length > base.passive || save.loadout.active.length > base.active;
}

function recordFinishedGame(won, reward = 0) {
  ensureDaily();
  save.stats.games += 1;
  save.daily.stats.games += 1;
  if (!won) return;
  save.stats.wins += 1;
  save.stats.coinsEarned += reward;
  save.stats.difficultyWins[game.diff.id] += 1;
  save.daily.stats.wins += 1;
  if (game.flags === 0) save.stats.noFlagWins += 1;
  if (game.diff.id === "easy" && game.elapsed <= 60) save.stats.fastEasyWins += 1;
}

function checkAchievements(showMessage = true) {
  updateStatsSnapshot();
  const unlocked = new Set(save.achievements);
  const newlyUnlocked = achievementGroups
    .flatMap(group => group.items)
    .filter(item => !unlocked.has(item.id) && item.done(save.stats));
  if (!newlyUnlocked.length) return;
  newlyUnlocked.forEach(item => {
    save.achievements.push(item.id);
    save.coins += item.reward;
  });
  if (showMessage) {
    const totalReward = newlyUnlocked.reduce((sum, item) => sum + item.reward, 0);
    el.message.textContent = `解锁成就：${newlyUnlocked.map(item => item.name).join("、")}，奖励 ${totalReward} 金币。`;
  }
}

function levelBonus() {
  return +(1 + (save.level - 1) * 0.15).toFixed(2);
}

function upgradeCost() {
  return Math.round(100 * Math.pow(save.level, 1.72));
}

function renderAll() {
  ensureDaily();
  updateStatsSnapshot();
  normalizeLoadout();
  renderPlayer();
  renderDifficulties();
  renderShop();
  renderLoadout();
  renderActiveItems();
  renderAchievements();
  renderDailyTasks();
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
  const passCard = document.createElement("div");
  passCard.className = "shop-card quota-card";
  passCard.innerHTML = `
    <div class="shop-head">
      <h2>${quotaPass.name}</h2>
      <strong>${quotaPass.price}</strong>
    </div>
    <p>${quotaPass.desc}</p>
    <div class="shop-meta">
      <span class="tag">临时配额</span>
      <span class="tag">库存 ${save.quotaPasses}</span>
      <span class="tag">冲分消耗品</span>
    </div>
    <div class="shop-actions">
      <span>可重复购买</span>
      <button class="small" ${save.coins < quotaPass.price ? "disabled" : ""}>购买</button>
    </div>
  `;
  passCard.querySelector("button").addEventListener("click", buyQuotaPass);
  el.shopList.appendChild(passCard);
  items.forEach(item => {
    const owned = save.owned.includes(item.id);
    const locked = save.level < item.min;
    const equipped = save.loadout[itemSlot(item)].includes(item.id);
    const card = document.createElement("div");
    card.className = `shop-card ${owned ? "owned" : ""} ${equipped ? "equipped" : ""} ${locked ? "locked" : ""}`;
    card.innerHTML = `
      <div class="shop-head">
        <h2>${item.name}</h2>
        <strong>${item.price}</strong>
      </div>
      <p>${item.desc}</p>
      <div class="shop-meta">
        <span class="tag">${item.type}</span>
        <span class="tag">${item.min} 级</span>
        <span class="tag">${equipped ? "出战中" : owned ? "仓库" : locked ? "未解锁" : "可购买"}</span>
      </div>
      <div class="shop-actions">
        <span>${owned ? "在出战配置中选择" : "永久购买"}</span>
        <button class="small" ${owned || locked || save.coins < item.price ? "disabled" : ""}>购买</button>
      </div>
    `;
    card.querySelector("button").addEventListener("click", () => buyItem(item));
    el.shopList.appendChild(card);
  });
}

function buyQuotaPass() {
  if (save.coins < quotaPass.price) return;
  save.coins -= quotaPass.price;
  save.quotaPasses += 1;
  persist();
  renderAll();
  el.message.textContent = `已购买 ${quotaPass.name}，下一局可临时多带 1 被动和 1 主动。`;
}

function renderAchievements() {
  if (!el.achievementList) return;
  const unlocked = new Set(save.achievements);
  el.achievementList.innerHTML = achievementGroups.map(group => `
    <div class="achievement-group">
      <h3>${group.title}</h3>
      ${group.items.map(item => {
        const done = unlocked.has(item.id);
        return `
          <div class="goal-card ${done ? "done" : ""}">
            <div>
              <b>${item.name}</b>
              <p>${item.desc}</p>
            </div>
            <span class="reward">${done ? "已达成" : `+${item.reward}`}</span>
          </div>
        `;
      }).join("")}
    </div>
  `).join("");
}

function renderDailyTasks() {
  if (!el.dailyTaskList) return;
  ensureDaily();
  el.dailyTaskList.innerHTML = dailyTaskTemplates.map(task => {
    const progress = Math.min(task.target, task.progress(save.daily));
    const completed = progress >= task.target;
    const claimed = save.daily.claimed.includes(task.id);
    return `
      <div class="goal-card daily ${claimed ? "done" : ""}">
        <div>
          <b>${task.name}</b>
          <p>${task.desc}</p>
          <div class="progress"><span style="width: ${progress / task.target * 100}%"></span></div>
        </div>
        <button class="small" data-daily="${task.id}" ${!completed || claimed ? "disabled" : ""}>
          ${claimed ? "已领取" : `领 ${task.reward}`}
        </button>
      </div>
    `;
  }).join("");
  el.dailyTaskList.querySelectorAll("[data-daily]").forEach(btn => {
    btn.addEventListener("click", () => claimDailyTask(btn.dataset.daily));
  });
}

function claimDailyTask(id) {
  ensureDaily();
  const task = dailyTaskTemplates.find(entry => entry.id === id);
  if (!task || save.daily.claimed.includes(id) || task.progress(save.daily) < task.target) return;
  save.daily.claimed.push(id);
  save.coins += task.reward;
  persist();
  renderAll();
  el.message.textContent = `每日任务完成：获得 ${task.reward} 金币。`;
}

function renderLoadout() {
  if (!el.passiveLoadout || !el.activeLoadout) return;
  normalizeLoadout();
  const limits = loadoutLimits();
  const base = baseLoadoutLimits();
  const boostText = save.quotaPasses > 0 ? `，临时令 ${save.quotaPasses} 张可用` : "";
  el.loadoutSummary.textContent = `被动 ${save.loadout.passive.length}/${limits.passive}，主动 ${save.loadout.active.length}/${limits.active}${boostText}`;
  renderLoadoutGroup("passive", el.passiveLoadout, limits.passive, base.passive);
  renderLoadoutGroup("active", el.activeLoadout, limits.active, base.active);
}

function renderLoadoutGroup(slot, target, limit, baseLimit) {
  const owned = items.filter(item => save.owned.includes(item.id) && itemSlot(item) === slot);
  if (!owned.length) {
    target.innerHTML = `<p class="empty-loadout">购买${slot === "passive" ? "被动" : "主动"}道具后可配置出战。</p>`;
    return;
  }
  const selected = new Set(save.loadout[slot]);
  target.innerHTML = owned.map(item => {
    const equipped = selected.has(item.id);
    const disabled = !equipped && save.loadout[slot].length >= limit;
    return `
      <button class="loadout-card ${equipped ? "equipped" : ""}" data-loadout="${item.id}" data-slot="${slot}" ${disabled ? "disabled" : ""}>
        <span>${item.type}</span>
        <b>${item.name}</b>
      </button>
    `;
  }).join("");
  target.querySelectorAll("[data-loadout]").forEach(btn => {
    btn.addEventListener("click", () => toggleLoadout(btn.dataset.slot, btn.dataset.loadout));
  });
  if (limit > baseLimit) {
    const note = document.createElement("p");
    note.className = "loadout-note";
    note.textContent = "当前已启用临时配额位，超出基础位开局会消耗 1 张战术增编令。";
    target.appendChild(note);
  }
}

function toggleLoadout(slot, id) {
  normalizeLoadout();
  const list = save.loadout[slot];
  const index = list.indexOf(id);
  if (index >= 0) {
    list.splice(index, 1);
  } else if (list.length < loadoutLimits()[slot]) {
    list.push(id);
  }
  persist();
  renderAll();
}

function renderActiveItems() {
  if (!game) {
    el.activeItems.innerHTML = "";
    return;
  }
  const active = equippedItems().filter(item => itemSlot(item) === "active" && item.charges);
  el.activeItems.innerHTML = active.map(item => {
    const charge = game.charges[item.id] || 0;
    return `
      <div class="active-card">
        <div><span>${item.type}</span><b>${item.name} x${charge}</b></div>
        <button class="${game.lastUsedItem === item.id ? "used" : ""}" title="${item.desc}" data-use="${item.id}" ${charge <= 0 || game.over ? "disabled" : ""}>${symbolFor(item.effect)}</button>
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
  autoEquipItem(item);
  updateStatsSnapshot();
  checkAchievements();
  persist();
  renderAll();
}

function autoEquipItem(item) {
  normalizeLoadout();
  const slot = itemSlot(item);
  if (save.loadout[slot].includes(item.id)) return;
  if (save.loadout[slot].length < loadoutLimits()[slot]) save.loadout[slot].push(item.id);
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
  normalizeLoadout();
  const boosted = currentLoadoutUsesBoost();
  const runEquipped = equippedIds();
  const runEquippedItems = items.filter(item => runEquipped.includes(item.id));
  if (boosted && save.quotaPasses > 0) {
    save.quotaPasses -= 1;
    persist();
  }
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
    equipped: runEquipped,
    quotaBoosted: boosted,
    lives: runEquippedItems.filter(item => item.effect === "life").reduce((sum, item) => sum + item.charges, 0),
    flagGuard: runEquipped.some(id => items.find(item => item.id === id)?.effect === "flagGuard"),
    lastUsedItem: null,
    cells: [],
    charges: {}
  };
  runEquippedItems.forEach(item => {
    if (itemSlot(item) === "active" && item.charges) game.charges[item.id] = item.charges;
  });
  buildCells();
  applyStartItems();
  hideResult();
  clearBoardFeedback();
  el.board.style.gridTemplateColumns = `repeat(${diff.cols}, var(--cell-size))`;
  el.board.style.setProperty("--cell-size", `${size}px`);
  el.mode.textContent = diff.name;
  el.mines.textContent = diff.mines;
  el.message.textContent = boosted ? `${diff.name} 探险开始。已消耗 1 张战术增编令。` : `${diff.name} 探险开始。右键插旗，主动道具在棋盘上方。`;
  renderLoadout();
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
    justOpened: false,
    flash: "",
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
    node.className = `cell ${cell.open ? "open" : ""} ${cell.justOpened ? "revealed" : ""} ${cell.mine && game.over ? "mine" : ""} ${cell.count ? `n${cell.count}` : ""} ${cell.flag ? "flagged" : ""} ${cell.flash ? `flash-${cell.flash}` : ""}`;
    node.textContent = cell.open ? (cell.mine ? "✹" : cell.count || "") : cell.flag ? "⚑" : cell.peeked ? (cell.mine ? "!" : "?") : "";
    node.addEventListener("click", () => handleOpen(cell));
    node.addEventListener("contextmenu", event => {
      event.preventDefault();
      toggleFlag(cell);
    });
    el.board.appendChild(node);
  });
  game.cells.forEach(cell => {
    cell.justOpened = false;
    cell.flash = "";
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
      flashCells([cell], "guard");
      triggerBoardFeedback("guard");
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
  ensureDaily();
  if (!cell.flag && game.flagGuard && !cell.mine) {
    game.flagGuard = false;
    cell.peeked = true;
    el.message.textContent = "引线剪提醒：这里不是雷。";
    renderBoard();
    return;
  }
  cell.flag = !cell.flag;
  game.flags += cell.flag ? 1 : -1;
  if (cell.flag) save.daily.stats.flags += 1;
  persist();
  renderDailyTasks();
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
    cell.justOpened = true;
    game.opened += 1;
  }
}

function useItem(id) {
  const item = items.find(entry => entry.id === id);
  if (!item || !game.charges[id]) return;
  game.lastUsedItem = null;
  const safeClosed = game.cells.filter(cell => !cell.open && !cell.flag && !cell.mine);
  const mineClosed = game.cells.filter(cell => !cell.open && !cell.flag && cell.mine);
  let affected = [];
  if (item.effect === "revealSafe" && safeClosed.length) {
    const before = new Set(game.cells.filter(cell => cell.open).map(cell => cell.index));
    openArea(shuffle(safeClosed)[0]);
    affected = game.cells.filter(cell => cell.open && !before.has(cell.index));
  }
  if (item.effect === "markMine" && mineClosed.length) {
    const mine = shuffle(mineClosed)[0];
    mine.flag = true;
    game.flags += 1;
    affected = [mine];
  }
  if (item.effect === "peek") {
    const closed = game.cells.filter(cell => !cell.open && !cell.flag && !cell.peeked);
    if (closed.length) {
      const peeked = shuffle(closed)[0];
      peeked.peeked = true;
      affected = [peeked];
    }
  }
  if (item.effect === "openZero") {
    const zero = safeClosed.find(cell => cell.count === 0) || safeClosed[0];
    if (zero) {
      const before = new Set(game.cells.filter(cell => cell.open).map(cell => cell.index));
      openArea(zero);
      affected = game.cells.filter(cell => cell.open && !before.has(cell.index));
    }
  }
  if (item.effect === "copyCharge") {
    const target = Object.keys(game.charges).find(key => key !== id && game.charges[key] >= 0);
    if (target) {
      game.charges[target] += 1;
    }
  }
  game.charges[id] -= 1;
  game.lastUsedItem = id;
  flashCells(affected, item.effect === "markMine" ? "mineHint" : "item");
  triggerBoardFeedback("item");
  renderBoard();
  checkWin();
}

function checkWin() {
  const safeCount = game.cells.filter(cell => !cell.mine).length;
  if (game.opened >= safeCount) winGame();
}

function flashCells(cells, type) {
  cells.slice(0, 42).forEach(cell => {
    cell.flash = type;
  });
}

function triggerBoardFeedback(type) {
  if (!el.boardWrap) return;
  const className = {
    boom: "impact-boom",
    guard: "impact-guard",
    item: "impact-item",
    win: "impact-win"
  }[type];
  if (!className) return;
  el.boardWrap.classList.remove(className);
  void el.boardWrap.offsetWidth;
  el.boardWrap.classList.add(className);
  window.setTimeout(() => el.boardWrap.classList.remove(className), 620);
}

function clearBoardFeedback() {
  if (!el.boardWrap) return;
  el.boardWrap.classList.remove("impact-boom", "impact-guard", "impact-item", "impact-win");
}

function showResult({ won, title, coins, xp, seconds, text }) {
  if (!el.resultOverlay) return;
  el.resultOverlay.hidden = false;
  el.resultOverlay.classList.toggle("loss", !won);
  el.resultOverlay.classList.toggle("win", won);
  el.resultKicker.textContent = won ? "Run Cleared" : "Run Failed";
  el.resultTitle.textContent = title;
  el.resultCoins.textContent = coins > 0 ? `+${coins}` : coins;
  el.resultXp.textContent = xp > 0 ? `+${xp}` : xp;
  el.resultTime.textContent = `${seconds}s`;
  el.resultText.textContent = text;
}

function hideResult() {
  if (!el.resultOverlay) return;
  el.resultOverlay.hidden = true;
  el.resultOverlay.classList.remove("win", "loss");
}

function winGame() {
  game.over = true;
  clearInterval(timer);
  const reward = estimateReward(game.diff, game.elapsed);
  const xpGain = Math.round(game.diff.weight * 22 * (hasEffect("ultimateCore") && game.diff.id === "ultimate" ? 1.5 : 1));
  const resultTime = game.elapsed;
  save.coins += reward;
  save.xp += xpGain;
  recordFinishedGame(true, reward);
  while (save.xp >= save.level * 100 && save.level < 20) {
    save.xp -= save.level * 100;
    save.level += 1;
  }
  checkAchievements();
  persist();
  if (!el.message.textContent.startsWith("解锁成就")) el.message.textContent = `胜利！获得 ${reward} 金币、${xpGain} 经验。`;
  renderAll();
  renderBoard();
  triggerBoardFeedback("win");
  showResult({
    won: true,
    title: "探险成功",
    coins: reward,
    xp: xpGain,
    seconds: resultTime,
    text: `清空 ${game.diff.name} 矿区，奖励已经入账。`
  });
}

function loseGame() {
  game.over = true;
  clearInterval(timer);
  const risky = equippedItems().find(item => item.effect === "riskyMult");
  const resultTime = game.elapsed;
  if (risky) save.coins = Math.max(0, save.coins - risky.penalty);
  recordFinishedGame(false);
  checkAchievements();
  persist();
  if (!el.message.textContent.startsWith("解锁成就")) {
    el.message.textContent = risky ? `爆炸失败。虚空铸币吞掉了 ${risky.penalty} 金币。` : "爆炸失败。换套道具再来一局。";
  }
  renderAll();
  renderBoard();
  triggerBoardFeedback("boom");
  showResult({
    won: false,
    title: "矿区爆炸",
    coins: risky ? -risky.penalty : 0,
    xp: 0,
    seconds: resultTime,
    text: risky ? `虚空铸币吞掉了 ${risky.penalty} 金币。` : "地雷已全部显形，调整出战配置再来一局。"
  });
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
  const dailyDate = save.daily.date;
  ensureDaily();
  if (save.daily.date !== dailyDate) {
    persist();
    renderDailyTasks();
  }
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
  return equippedItems().filter(item => item.effect === effect);
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
