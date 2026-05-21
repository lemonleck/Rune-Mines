const BASE_REWARD = 120;
const SAVE_KEY = "spire-mines-save-v3";

const difficulties = [
  { id: "easy", name: "简单", rows: 9, cols: 9, mines: 10, weight: 1, target: 180, unlock: 1, note: "3 分钟目标，适合热身和攒第一批金币。" },
  { id: "normal", name: "进阶", rows: 14, cols: 14, mines: 32, weight: 3.2, target: 300, unlock: 1, note: "地图更大，节奏开始考验判断。" },
  { id: "hard", name: "困难", rows: 16, cols: 24, mines: 88, weight: 8, target: 360, unlock: 1, note: "高密度矿区，高收益也更吃操作。" },
  { id: "ultimate", name: "终极", rows: 18, cols: 30, mines: 145, weight: 17, target: 480, unlock: 10, note: "10 级解锁，真正的高风险高回报。" }
];

const eliteConfig = {
  easy: { count: 1, doomLimit: 0 },
  normal: { count: 2, doomLimit: 1 },
  hard: { count: 3, doomLimit: 3 },
  ultimate: { count: 4, doomLimit: 4 }
};

const items = [
  { id: "ember-heart", name: "余烬之心", min: 1, price: 90, type: "护命", desc: "踩雷时免死 1 次，并立刻翻开该格周围区域。", effect: "life", charges: 1 },
  { id: "scout-lens", name: "斥候透镜", min: 1, price: 120, type: "主动", desc: "本局可揭示 5 次安全格。", effect: "revealSafe", charges: 5 },
  { id: "chalk-mark", name: "矿脉粉笔", min: 2, price: 170, type: "主动", desc: "本局可自动标记 3 颗雷。", effect: "markMine", charges: 3 },
  { id: "minute-knife", name: "分针匕首", min: 2, price: 220, type: "结算", desc: "结算时实际用时减少 60 秒。", effect: "timeCut", amount: 60 },
  { id: "copper-oath", name: "铜誓纹章", min: 3, price: 260, type: "收益", desc: "胜利金币 x1.08。", effect: "scoreMult", amount: 1.08 },
  { id: "torch-map", name: "火把地图", min: 3, price: 310, type: "开局", desc: "开局自动翻开 8 个安全数字格。", effect: "startReveal", amount: 8 },
  { id: "bone-dice", name: "骨骰", min: 4, price: 360, type: "收益", desc: "4 分钟内胜利时额外金币 x1.15。", effect: "fastBonus", limit: 240, amount: 1.15 },
  { id: "rust-shield", name: "锈盾", min: 4, price: 420, type: "护命", desc: "额外获得 1 次免死。", effect: "life", charges: 1 },
  { id: "glass-orb", name: "观星玻璃", min: 5, price: 520, type: "主动", desc: "本局可窥视 2 个未知格是否为雷。", effect: "peek", charges: 2 },
  { id: "silver-contract", name: "银契约", min: 5, price: 640, type: "收益", desc: "胜利金币 x1.12。", effect: "scoreMult", amount: 1.12 },
  { id: "fuse-cutter", name: "引线剪", min: 6, price: 760, type: "容错", desc: "错误插旗不会生效，并提供 1 次提醒。", effect: "flagGuard" },
  { id: "echo-bell", name: "回声铃", min: 6, price: 900, type: "主动", desc: "本局可展开 1 片安全空白区。", effect: "openZero", charges: 1 },
  { id: "golden-nail", name: "金钉", min: 7, price: 1050, type: "收益", desc: "每快于目标时间 1 分钟，额外金币 +2%。", effect: "remainBonus" },
  { id: "black-candle", name: "黑蜡灯", min: 7, price: 1250, type: "开局", desc: "开局随机移除 3 颗雷。", effect: "removeMines", amount: 3 },
  { id: "mirror-mask", name: "镜面假面", min: 8, price: 1480, type: "主动", desc: "复制一个已拥有主动道具的 1 次使用次数。", effect: "copyCharge", charges: 1 },
  { id: "red-ledger", name: "猩红账本", min: 8, price: 1750, type: "收益", desc: "困难与终极难度金币 x1.18。", effect: "hardMult", amount: 1.18 },
  { id: "spire-key", name: "尖塔钥匙", min: 9, price: 2100, type: "开局", desc: "首击会额外清理一圈相邻地雷。", effect: "firstBloom" },
  { id: "void-coin", name: "虚空铸币", min: 9, price: 2500, type: "收益", desc: "胜利金币 x1.20，但失败时损失 80 金币。", effect: "riskyMult", amount: 1.2, penalty: 80 },
  { id: "crown-clock", name: "王冠时钟", min: 10, price: 3200, type: "结算", desc: "结算时实际用时再减少 90 秒。", effect: "timeCut", amount: 90 },
  { id: "ascension-core", name: "升格核心", min: 10, price: 4200, type: "终局", desc: "终极难度胜利金币 x1.35，经验 x1.5。", effect: "ultimateCore", amount: 1.35 }
];

const quotaPass = {
  id: "tactician-pass",
  name: "战术增编令",
  price: 3000,
  desc: "若下一局超出基础携带位，临时增加 1 个被动位和 1 个主动位。"
};

const activeEffects = new Set(["revealSafe", "markMine", "peek", "openZero", "copyCharge"]);

const achievementGroups = [
  {
    title: "初级成就",
    items: [
      { id: "games-50", name: "矿区熟手", desc: "完成 50 局游戏", reward: 600, done: stats => stats.games >= 50 },
      { id: "wins-10", name: "稳定排雷", desc: "累计胜利 10 局", reward: 700, done: stats => stats.wins >= 10 },
      { id: "coins-5000", name: "第一桶矿金", desc: "累计赚得 5000 金币", reward: 800, done: stats => stats.coinsEarned >= 5000 }
    ]
  },
  {
    title: "中级成就",
    items: [
      { id: "games-100", name: "百局探险家", desc: "完成 100 局游戏", reward: 1400, done: stats => stats.games >= 100 },
      { id: "wins-30", name: "可靠矿长", desc: "累计胜利 30 局", reward: 1600, done: stats => stats.wins >= 30 },
      { id: "coins-20000", name: "金脉经营者", desc: "累计赚得 20000 金币", reward: 1800, done: stats => stats.coinsEarned >= 20000 }
    ]
  },
  {
    title: "高级成就",
    items: [
      { id: "games-200", name: "尖塔常客", desc: "完成 200 局游戏", reward: 3200, done: stats => stats.games >= 200 },
      { id: "wins-80", name: "排雷大师", desc: "累计胜利 80 局", reward: 3600, done: stats => stats.wins >= 80 },
      { id: "coins-80000", name: "矿金巨匠", desc: "累计赚得 80000 金币", reward: 4200, done: stats => stats.coinsEarned >= 80000 }
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
  boardFxLayer: document.getElementById("boardFxLayer"),
  mode: document.getElementById("modeText"),
  mines: document.getElementById("mineText"),
  flags: document.getElementById("flagText"),
  timer: document.getElementById("timerText"),
  estimate: document.getElementById("estimateText"),
  message: document.getElementById("messageText"),
  feedbackRibbon: document.getElementById("feedbackRibbon"),
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
  resultMeta: document.getElementById("resultMeta"),
  resultRecap: document.getElementById("resultRecap"),
  resultText: document.getElementById("resultText"),
  eliteRemaining: document.getElementById("eliteRemainingText"),
  eliteBonus: document.getElementById("eliteBonusText"),
  eliteDoom: document.getElementById("eliteDoomText"),
  soundToggle: document.getElementById("soundToggleBtn")
};

const feedbackTimers = {
  ribbon: null
};

const audioState = {
  ctx: null,
  unlocked: false
};

document.getElementById("newGameBtn").addEventListener("click", startGame);
document.getElementById("upgradeBtn").addEventListener("click", upgradeLevel);
document.getElementById("resetBtn").addEventListener("click", resetSave);
document.getElementById("closeResultBtn").addEventListener("click", hideResult);
document.getElementById("resultNewGameBtn").addEventListener("click", startGame);
el.soundToggle.addEventListener("click", toggleSoundSetting);

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
    daily: defaultDaily(),
    settings: defaultSettings()
  };
}

function defaultStats() {
  return {
    games: 0,
    wins: 0,
    coinsEarned: 0,
    eliteOpened: 0,
    eliteDoomTriggered: 0,
    noFlagWins: 0,
    fastEasyWins: 0,
    itemsOwned: 0,
    difficultyWins: { easy: 0, normal: 0, hard: 0, ultimate: 0 },
    bestRewardByDifficulty: { easy: 0, normal: 0, hard: 0, ultimate: 0 },
    bestTimeByDifficulty: { easy: null, normal: null, hard: null, ultimate: null }
  };
}

function defaultDaily() {
  return { date: todayKey(), claimed: [], stats: { games: 0, wins: 0, flags: 0 } };
}

function defaultSettings() {
  return { soundEnabled: true };
}

function normalizeSave(data) {
  const statsDefaults = defaultStats();
  data.owned = Array.isArray(data.owned) ? data.owned : [];
  data.quotaPasses = Number.isFinite(data.quotaPasses) ? Math.max(0, data.quotaPasses) : 0;
  data.loadout = data.loadout || { passive: [], active: [] };
  data.loadout.passive = Array.isArray(data.loadout.passive) ? data.loadout.passive : [];
  data.loadout.active = Array.isArray(data.loadout.active) ? data.loadout.active : [];
  data.achievements = Array.isArray(data.achievements) ? data.achievements : [];
  data.stats = { ...statsDefaults, ...(data.stats || {}) };
  data.stats.difficultyWins = { ...statsDefaults.difficultyWins, ...(data.stats.difficultyWins || {}) };
  data.stats.bestRewardByDifficulty = { ...statsDefaults.bestRewardByDifficulty, ...(data.stats.bestRewardByDifficulty || {}) };
  data.stats.bestTimeByDifficulty = { ...statsDefaults.bestTimeByDifficulty, ...(data.stats.bestTimeByDifficulty || {}) };
  data.stats.itemsOwned = data.owned.length;
  data.daily = { ...defaultDaily(), ...(data.daily || {}) };
  data.daily.claimed = Array.isArray(data.daily.claimed) ? data.daily.claimed : [];
  data.daily.stats = { ...defaultDaily().stats, ...(data.daily.stats || {}) };
  data.settings = { ...defaultSettings(), ...(data.settings || {}) };
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

function loadoutLimitsFor(data) {
  const base = baseLoadoutLimits(data.level);
  const boost = data.quotaPasses > 0 ? 1 : 0;
  return { passive: base.passive + boost, active: base.active + boost };
}

function loadoutLimits() {
  return loadoutLimitsFor(save);
}

function normalizeLoadout(data = save) {
  const owned = new Set(data.owned || []);
  const limits = loadoutLimitsFor(data);
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

function equippedIds() {
  normalizeLoadout();
  return [...save.loadout.passive, ...save.loadout.active];
}

function equippedItems() {
  const ids = game?.equipped || equippedIds();
  return items.filter(item => ids.includes(item.id));
}

function currentLoadoutUsesBoost() {
  const base = baseLoadoutLimits();
  return save.loadout.passive.length > base.passive || save.loadout.active.length > base.active;
}

function ownedEffects(effect) {
  return equippedItems().filter(item => item.effect === effect);
}

function hasEffect(effect) {
  return ownedEffects(effect).length > 0;
}

function levelBonus() {
  return +(1 + (save.level - 1) * 0.15).toFixed(2);
}

function upgradeCost() {
  return Math.round(100 * Math.pow(save.level, 1.72));
}

function soundEnabled() {
  return !!save.settings.soundEnabled;
}

function renderSoundToggle() {
  el.soundToggle.textContent = soundEnabled() ? "ON" : "OFF";
  el.soundToggle.setAttribute("aria-pressed", soundEnabled() ? "true" : "false");
  el.soundToggle.classList.toggle("muted", !soundEnabled());
}

function toggleSoundSetting() {
  save.settings.soundEnabled = !soundEnabled();
  persist();
  renderSoundToggle();
  unlockAudio();
  if (soundEnabled()) {
    playSound("toggleOn");
    pushRibbon("音效已开启", "tone-info");
  } else {
    pushRibbon("音效已静音", "tone-doom");
  }
}

function unlockAudio() {
  if (audioState.unlocked) return;
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return;
  if (!audioState.ctx) audioState.ctx = new AudioCtor();
  if (audioState.ctx.state === "suspended") {
    audioState.ctx.resume().catch(() => {});
  }
  audioState.unlocked = true;
}

function playTone(frequency, duration, options = {}) {
  if (!soundEnabled()) return;
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return;
  if (!audioState.ctx) audioState.ctx = new AudioCtor();
  const ctx = audioState.ctx;
  if (ctx.state === "suspended") return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = options.type || "sine";
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime((options.endFrequency || frequency) + 0.001, ctx.currentTime + duration);
  gain.gain.setValueAtTime(options.volume || 0.025, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);
}

function playChord(notes, duration, options = {}) {
  notes.forEach((note, index) => {
    window.setTimeout(() => playTone(note, duration, options), index * (options.delay || 45));
  });
}

function playSound(kind) {
  if (!soundEnabled()) return;
  if (!audioState.ctx || audioState.ctx.state === "suspended") return;
  const soundMap = {
    open: () => playTone(500, 0.08, { type: "triangle", endFrequency: 640, volume: 0.018 }),
    chain: () => playChord([420, 560, 680], 0.12, { type: "triangle", volume: 0.012, delay: 30 }),
    flag: () => playTone(300, 0.06, { type: "square", endFrequency: 260, volume: 0.022 }),
    unflag: () => playTone(260, 0.05, { type: "square", endFrequency: 320, volume: 0.016 }),
    item: () => playChord([620, 760], 0.08, { type: "triangle", volume: 0.016, delay: 22 }),
    guard: () => playChord([430, 520, 610], 0.12, { type: "sine", volume: 0.018, delay: 35 }),
    vault: () => playChord([660, 820, 980], 0.12, { type: "triangle", volume: 0.016, delay: 28 }),
    scout: () => playChord([520, 700, 920], 0.12, { type: "triangle", volume: 0.014, delay: 22 }),
    doom: () => playChord([260, 220, 170], 0.18, { type: "sawtooth", volume: 0.02, delay: 42 }),
    win: () => playChord([520, 660, 780, 1040], 0.16, { type: "triangle", volume: 0.018, delay: 45 }),
    loss: () => playChord([340, 240, 170], 0.18, { type: "sawtooth", volume: 0.018, delay: 55 }),
    toggleOn: () => playChord([620, 900], 0.08, { type: "triangle", volume: 0.014, delay: 28 })
  };
  soundMap[kind]?.();
}

function pushRibbon(text, tone = "tone-info") {
  if (!el.feedbackRibbon) return;
  window.clearTimeout(feedbackTimers.ribbon);
  el.feedbackRibbon.textContent = text;
  el.feedbackRibbon.className = `feedback-ribbon show ${tone}`;
  feedbackTimers.ribbon = window.setTimeout(() => {
    el.feedbackRibbon.className = "feedback-ribbon";
  }, 1450);
}

function spawnBoardBurst(label, tone = "info") {
  if (!el.boardFxLayer) return;
  const node = document.createElement("div");
  node.className = `board-burst burst-${tone}`;
  node.textContent = label;
  el.boardFxLayer.appendChild(node);
  window.setTimeout(() => node.remove(), 1200);
}

function celebrateEvent({ message, ribbon, burst, sound, boardImpact }) {
  if (message) el.message.textContent = message;
  if (ribbon) pushRibbon(ribbon.text, ribbon.tone);
  if (burst) spawnBoardBurst(burst.label, burst.tone);
  if (boardImpact) triggerBoardFeedback(boardImpact);
  if (sound) playSound(sound);
}

function recordFinishedGame(won, reward = 0) {
  ensureDaily();
  save.stats.games += 1;
  save.daily.stats.games += 1;
  save.stats.eliteOpened += game?.eliteRun.opened || 0;
  save.stats.eliteDoomTriggered += game?.eliteRun.doomCount || 0;
  if (!won) return;
  save.stats.wins += 1;
  save.stats.coinsEarned += reward;
  save.stats.difficultyWins[game.diff.id] += 1;
  save.daily.stats.wins += 1;
  if (game.flags === 0) save.stats.noFlagWins += 1;
  if (game.diff.id === "easy" && game.elapsed <= 60) save.stats.fastEasyWins += 1;
}

function updateBestRecords(reward, seconds) {
  const result = { reward: false, time: false };
  if (reward > save.stats.bestRewardByDifficulty[game.diff.id]) {
    save.stats.bestRewardByDifficulty[game.diff.id] = reward;
    result.reward = true;
  }
  const bestTime = save.stats.bestTimeByDifficulty[game.diff.id];
  if (!bestTime || seconds < bestTime) {
    save.stats.bestTimeByDifficulty[game.diff.id] = seconds;
    result.time = true;
  }
  return result;
}

function checkAchievements(showMessage = true) {
  updateStatsSnapshot();
  const unlocked = new Set(save.achievements);
  const newlyUnlocked = achievementGroups.flatMap(group => group.items)
    .filter(item => !unlocked.has(item.id) && item.done(save.stats));
  if (!newlyUnlocked.length) return;
  newlyUnlocked.forEach(item => {
    save.achievements.push(item.id);
    save.coins += item.reward;
  });
  if (showMessage) {
    const totalReward = newlyUnlocked.reduce((sum, item) => sum + item.reward, 0);
    celebrateEvent({
      message: `解锁成就：${newlyUnlocked.map(item => item.name).join("、")}，奖励 ${totalReward} 金币。`,
      ribbon: { text: `成就奖励 +${totalReward}`, tone: "tone-vault" },
      burst: { label: "Achievement", tone: "vault" },
      sound: "vault"
    });
  }
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
  renderEliteSummary();
  renderAchievements();
  renderDailyTasks();
  renderSoundToggle();
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
    const bestReward = save.stats.bestRewardByDifficulty[diff.id];
    const bestTime = save.stats.bestTimeByDifficulty[diff.id];
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
      <div class="shop-meta">
        <span class="tag">Elite ${eliteConfig[diff.id].count}</span>
        <span class="tag">Best ${bestReward || 0}</span>
        <span class="tag">${bestTime ? `Fast ${formatTime(bestTime)}` : "No Clear Yet"}</span>
      </div>
    `;
    card.addEventListener("click", () => {
      unlockAudio();
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
        <span class="tag">${equipped ? "已出战" : owned ? "仓库" : locked ? "未解锁" : "可购买"}</span>
      </div>
      <div class="shop-actions">
        <span>${owned ? "可在出战配置中切换" : "永久购买"}</span>
        <button class="small" ${owned || locked || save.coins < item.price ? "disabled" : ""}>购买</button>
      </div>
    `;
    card.querySelector("button").addEventListener("click", () => buyItem(item));
    el.shopList.appendChild(card);
  });
}

function buyQuotaPass() {
  if (save.coins < quotaPass.price) return;
  unlockAudio();
  save.coins -= quotaPass.price;
  save.quotaPasses += 1;
  persist();
  renderAll();
  celebrateEvent({
    message: `已购买 ${quotaPass.name}，下次超额出战时会自动消耗。`,
    ribbon: { text: "战术配额 +1", tone: "tone-info" },
    burst: { label: "Quota +1", tone: "info" },
    sound: "item"
  });
}

function renderAchievements() {
  const unlocked = new Set(save.achievements);
  el.achievementList.innerHTML = achievementGroups.map(group => `
    <div class="achievement-group">
      <h3>${group.title}</h3>
      ${group.items.map(item => `
        <div class="goal-card ${unlocked.has(item.id) ? "done" : ""}">
          <div>
            <b>${item.name}</b>
            <p>${item.desc}</p>
          </div>
          <span class="reward">${unlocked.has(item.id) ? "已完成" : `+${item.reward}`}</span>
        </div>
      `).join("")}
    </div>
  `).join("");
}

function renderDailyTasks() {
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
          <div class="progress"><span style="width: ${(progress / task.target) * 100}%"></span></div>
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
  unlockAudio();
  ensureDaily();
  const task = dailyTaskTemplates.find(entry => entry.id === id);
  if (!task || save.daily.claimed.includes(id) || task.progress(save.daily) < task.target) return;
  save.daily.claimed.push(id);
  save.coins += task.reward;
  persist();
  renderAll();
  celebrateEvent({
    message: `每日任务完成：获得 ${task.reward} 金币。`,
    ribbon: { text: `Daily +${task.reward}`, tone: "tone-vault" },
    burst: { label: "Daily Cleared", tone: "vault" },
    sound: "vault"
  });
}

function renderLoadout() {
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
    target.innerHTML = `<p class="empty-loadout">购买${slot === "passive" ? "被动" : "主动"}道具后即可配置出战。</p>`;
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
    note.textContent = "超出基础位会在开局时消耗 1 张战术增编令。";
    target.appendChild(note);
  }
}

function toggleLoadout(slot, id) {
  unlockAudio();
  const list = save.loadout[slot];
  const index = list.indexOf(id);
  if (index >= 0) {
    list.splice(index, 1);
  } else if (list.length < loadoutLimits()[slot]) {
    list.push(id);
  }
  persist();
  renderAll();
  playSound("item");
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

function renderEliteSummary() {
  if (!game) {
    el.eliteRemaining.textContent = "0";
    el.eliteBonus.textContent = "x1.00";
    el.eliteDoom.textContent = "0";
    return;
  }
  el.eliteRemaining.textContent = String(game.cells.filter(cell => cell.eliteType && !cell.open).length);
  el.eliteBonus.textContent = `x${eliteMultiplier().toFixed(2)}`;
  el.eliteDoom.textContent = String(game.eliteRun.doomCount);
  const hot = game.eliteRun.doomCount > 0;
  el.eliteDoom.parentElement.classList.toggle("elite-hot", hot);
}

function buyItem(item) {
  if (save.level < item.min || save.owned.includes(item.id) || save.coins < item.price) return;
  unlockAudio();
  save.coins -= item.price;
  save.owned.push(item.id);
  autoEquipItem(item);
  checkAchievements();
  persist();
  renderAll();
  celebrateEvent({
    message: `已购买 ${item.name}。`,
    ribbon: { text: `Shop: ${item.name}`, tone: "tone-info" },
    burst: { label: item.name, tone: "info" },
    sound: "item"
  });
}

function autoEquipItem(item) {
  const slot = itemSlot(item);
  if (!save.loadout[slot].includes(item.id) && save.loadout[slot].length < loadoutLimits()[slot]) {
    save.loadout[slot].push(item.id);
  }
}

function upgradeLevel() {
  const cost = upgradeCost();
  if (save.level >= 20 || save.coins < cost) return;
  unlockAudio();
  save.coins -= cost;
  save.level += 1;
  save.xp = 0;
  persist();
  renderAll();
  celebrateEvent({
    message: `等级提升至 ${save.level}。`,
    ribbon: { text: `Level ${save.level}`, tone: "tone-vault" },
    burst: { label: `Lv.${save.level}`, tone: "vault" },
    sound: "vault"
  });
}

function resetSave() {
  if (!confirm("确定重置等级、金币与道具存档吗？")) return;
  localStorage.removeItem(SAVE_KEY);
  save = loadSave();
  renderAll();
  startGame();
}

function currentDifficulty() {
  return difficulties.find(diff => diff.id === save.selected) || difficulties[0];
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
    lives: runEquippedItems.filter(item => item.effect === "life").reduce((sum, item) => sum + (item.charges || 0), 0),
    flagGuard: runEquipped.some(id => items.find(item => item.id === id)?.effect === "flagGuard"),
    lastUsedItem: null,
    cells: [],
    charges: {},
    eliteRun: {
      opened: 0,
      vaultBonus: 0,
      scoutTriggers: 0,
      doomCount: 0
    }
  };

  runEquippedItems.forEach(item => {
    if (itemSlot(item) === "active" && item.charges) game.charges[item.id] = item.charges;
  });

  buildCells();
  applyStartItems();
  assignEliteCells();
  hideResult();
  clearBoardFeedback();
  clearBoardFx();
  el.board.style.gridTemplateColumns = `repeat(${diff.cols}, var(--cell-size))`;
  el.board.style.setProperty("--cell-size", `${size}px`);
  el.mode.textContent = diff.name;
  el.mines.textContent = diff.mines;
  celebrateEvent({
    message: boosted
      ? `${diff.name} 探险开始，已消耗 1 张战术增编令。`
      : `${diff.name} 探险开始。右键插旗，留意闭合格上的 Elite 标记。`,
    ribbon: { text: `${diff.name} Run`, tone: "tone-info" },
    burst: { label: "New Run", tone: "info" }
  });
  renderLoadout();
  renderBoard();
  renderActiveItems();
  tick();
  timer = setInterval(tick, 1000);
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
    eliteType: "",
    eliteTriggered: false,
    justOpened: false,
    flash: "",
    count: 0
  }));
  recalcCounts();
}

function recalcCounts() {
  game.cells.forEach(cell => {
    cell.count = neighbors(cell).filter(next => next.mine).length;
  });
}

function applyStartItems() {
  if (hasEffect("removeMines")) {
    const amount = ownedEffects("removeMines").reduce((sum, item) => sum + item.amount, 0);
    shuffle(game.cells.filter(cell => cell.mine)).slice(0, amount).forEach(cell => {
      cell.mine = false;
    });
    game.diff.mines = game.cells.filter(cell => cell.mine).length;
    recalcCounts();
  }
  if (hasEffect("startReveal")) {
    const amount = ownedEffects("startReveal").reduce((sum, item) => sum + item.amount, 0);
    shuffle(game.cells.filter(cell => !cell.mine && cell.count > 0)).slice(0, amount).forEach(cell => {
      openCell(cell);
    });
  }
}

function assignEliteCells() {
  const config = eliteConfig[game.diff.id] || eliteConfig.easy;
  const pool = shuffle(game.cells.filter(cell => !cell.mine && !cell.open)).slice(0, config.count);
  let doomUsed = 0;
  pool.forEach((cell, index) => {
    const choices = ["vault", "scout"];
    if (doomUsed < config.doomLimit) choices.push("doom");
    if ((game.diff.id === "hard" || game.diff.id === "ultimate") && config.count - index <= config.doomLimit - doomUsed) {
      cell.eliteType = "doom";
    } else {
      cell.eliteType = shuffle(choices)[0];
    }
    if (cell.eliteType === "doom") doomUsed += 1;
  });
}

function renderBoard() {
  el.board.innerHTML = "";
  game.cells.forEach(cell => {
    const node = document.createElement("button");
    node.className = `cell ${cell.open ? "open" : ""} ${cell.justOpened ? "revealed" : ""} ${cell.mine && game.over ? "mine" : ""} ${cell.count ? `n${cell.count}` : ""} ${cell.flag ? "flagged" : ""} ${cell.flash ? `flash-${cell.flash}` : ""} ${cell.eliteType ? `elite elite-${cell.eliteType}` : ""}`;
    node.dataset.eliteMark = cell.open || !cell.eliteType ? "" : eliteMark(cell.eliteType);
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
  renderEliteSummary();
  updateEstimate();
}

function handleOpen(cell) {
  if (game.over || cell.open || cell.flag) return;
  unlockAudio();
  if (game.firstClick) protectFirstClick(cell);
  game.firstClick = false;

  if (cell.mine) {
    if (game.lives > 0) {
      game.lives -= 1;
      cell.mine = false;
      game.diff.mines = game.cells.filter(next => next.mine && next !== cell).length;
      recalcCounts();
      const rescued = openArea(cell);
      triggerOpenedElites(rescued);
      flashCells([cell], "guard");
      celebrateEvent({
        message: `余烬之心挡下了一次爆炸，剩余免死 ${game.lives} 次。`,
        ribbon: { text: "护命生效", tone: "tone-guard" },
        burst: { label: "Second Chance", tone: "guard" },
        sound: "guard",
        boardImpact: "guard"
      });
      renderBoard();
      checkWin();
      return;
    }
    loseGame();
    return;
  }

  const opened = openArea(cell);
  triggerOpenedElites(opened);
  const chain = opened.length >= 4;
  playSound(chain ? "chain" : "open");
  if (chain) {
    pushRibbon(`连锁展开 ${opened.length} 格`, "tone-chain");
    spawnBoardBurst(`+${opened.length}`, "chain");
  }
  renderBoard();
  checkWin();
}

function protectFirstClick(cell) {
  if (!cell.mine && cell.count === 0 && !hasEffect("firstBloom")) return;

  if (cell.mine) {
    cell.mine = false;
    const target = shuffle(game.cells.filter(next => next.index !== cell.index && !next.mine))[0];
    if (target) target.mine = true;
  }

  if (hasEffect("firstBloom")) {
    neighbors(cell).forEach(next => {
      if (next.mine) next.mine = false;
    });
  }

  game.diff.mines = game.cells.filter(next => next.mine).length;
  recalcCounts();
}

function toggleFlag(cell) {
  if (game.over || cell.open) return;
  unlockAudio();
  ensureDaily();
  if (!cell.flag && game.flagGuard && !cell.mine) {
    game.flagGuard = false;
    cell.peeked = true;
    celebrateEvent({
      message: "引线剪提醒：这里不是雷。",
      ribbon: { text: "错误插旗已拦截", tone: "tone-guard" },
      burst: { label: "Guard", tone: "guard" },
      sound: "guard"
    });
    renderBoard();
    return;
  }
  cell.flag = !cell.flag;
  game.flags += cell.flag ? 1 : -1;
  if (cell.flag) save.daily.stats.flags += 1;
  persist();
  renderDailyTasks();
  playSound(cell.flag ? "flag" : "unflag");
  renderBoard();
}

function openArea(start) {
  const stack = [start];
  const seen = new Set();
  const opened = [];
  while (stack.length) {
    const cell = stack.pop();
    if (seen.has(cell.index) || cell.flag || cell.mine) continue;
    seen.add(cell.index);
    if (openCell(cell)) opened.push(cell);
    if (cell.count === 0) neighbors(cell).forEach(next => stack.push(next));
  }
  return opened;
}

function openCell(cell) {
  if (!cell.open && !cell.mine) {
    cell.open = true;
    cell.justOpened = true;
    game.opened += 1;
    return true;
  }
  return false;
}

function triggerOpenedElites(cells) {
  cells.filter(cell => cell.eliteType && cell.open && !cell.eliteTriggered).forEach(cell => {
    cell.eliteTriggered = true;
    game.eliteRun.opened += 1;
    applyEliteEffect(cell);
  });
}

function applyEliteEffect(cell) {
  if (cell.eliteType === "vault") {
    game.eliteRun.vaultBonus += 1;
    flashCells([cell], "eliteVault");
    celebrateEvent({
      message: "Elite Vault 已开启，本局金币赏金 +12%。",
      ribbon: { text: "Vault +12%", tone: "tone-vault" },
      burst: { label: "Vault", tone: "vault" },
      sound: "vault",
      boardImpact: "elite"
    });
    return;
  }

  if (cell.eliteType === "scout") {
    const around = shuffle(neighbors(cell).filter(next => !next.mine && !next.open && !next.flag)).slice(0, 3);
    const affected = [];
    if (around.length) {
      around.forEach(next => {
        if (openCell(next)) affected.push(next);
      });
    } else {
      const fallback = shuffle(game.cells.filter(next => !next.mine && !next.open && !next.flag))[0];
      if (fallback && openCell(fallback)) affected.push(fallback);
    }
    game.eliteRun.scoutTriggers += 1;
    flashCells([cell, ...affected], "eliteScout");
    celebrateEvent({
      message: affected.length
        ? `Elite Scout 额外侦测了 ${affected.length} 个安全格。`
        : "Elite Scout 已触发，但没有可展开的安全格。",
      ribbon: { text: affected.length ? `Scout +${affected.length}` : "Scout Triggered", tone: "tone-scout" },
      burst: { label: "Scout", tone: "scout" },
      sound: "scout",
      boardImpact: "elite"
    });
    triggerOpenedElites(affected);
    return;
  }

  const promoted = shuffle(game.cells.filter(next => !next.mine && !next.open && !next.flag && !next.eliteType))[0];
  if (promoted) {
    promoted.mine = true;
    game.diff.mines += 1;
    recalcCounts();
  }
  game.eliteRun.doomCount += 1;
  flashCells(promoted ? [cell, promoted] : [cell], "eliteDoom");
  celebrateEvent({
    message: promoted
      ? "Elite Doom 已触发：赏金 +20%，同时矿区新增 1 颗地雷。"
      : "Elite Doom 已触发：赏金 +20%，但没有合法位置可新增地雷。",
    ribbon: { text: promoted ? "Doom +1 Mine" : "Doom +20%", tone: "tone-doom" },
    burst: { label: "Doom", tone: "doom" },
    sound: "doom",
    boardImpact: "elite"
  });
}

function useItem(id) {
  const item = items.find(entry => entry.id === id);
  if (!item || !game.charges[id]) return;
  unlockAudio();

  let affected = [];
  game.lastUsedItem = null;

  if (item.effect === "revealSafe") {
    const safeClosed = game.cells.filter(cell => !cell.open && !cell.flag && !cell.mine);
    if (safeClosed.length) {
      const before = new Set(game.cells.filter(cell => cell.open).map(cell => cell.index));
      openArea(shuffle(safeClosed)[0]);
      affected = game.cells.filter(cell => cell.open && !before.has(cell.index));
    }
  }

  if (item.effect === "markMine") {
    const mine = shuffle(game.cells.filter(cell => !cell.open && !cell.flag && cell.mine))[0];
    if (mine) {
      mine.flag = true;
      game.flags += 1;
      affected = [mine];
    }
  }

  if (item.effect === "peek") {
    const target = shuffle(game.cells.filter(cell => !cell.open && !cell.flag && !cell.peeked))[0];
    if (target) {
      target.peeked = true;
      affected = [target];
    }
  }

  if (item.effect === "openZero") {
    const safeClosed = game.cells.filter(cell => !cell.open && !cell.flag && !cell.mine);
    const zero = safeClosed.find(cell => cell.count === 0) || safeClosed[0];
    if (zero) {
      const before = new Set(game.cells.filter(cell => cell.open).map(cell => cell.index));
      openArea(zero);
      affected = game.cells.filter(cell => cell.open && !before.has(cell.index));
    }
  }

  if (item.effect === "copyCharge") {
    const target = Object.keys(game.charges).find(key => key !== id && game.charges[key] > 0);
    if (target) {
      game.charges[target] += 1;
    }
  }

  game.charges[id] -= 1;
  game.lastUsedItem = id;
  triggerOpenedElites(affected);
  flashCells(affected, item.effect === "markMine" ? "mineHint" : "item");
  celebrateEvent({
    message: `${item.name} 已发动。`,
    ribbon: { text: item.name, tone: "tone-info" },
    burst: { label: symbolFor(item.effect), tone: "info" },
    sound: "item",
    boardImpact: "item"
  });
  renderBoard();
  checkWin();
}

function checkWin() {
  const safeCount = game.cells.filter(cell => !cell.mine).length;
  if (game.opened >= safeCount) winGame();
}

function flashCells(cells, type) {
  cells.slice(0, 48).forEach(cell => {
    cell.flash = type;
  });
}

function triggerBoardFeedback(type) {
  const className = {
    boom: "impact-boom",
    guard: "impact-guard",
    item: "impact-item",
    elite: "impact-elite",
    win: "impact-win"
  }[type];
  if (!className) return;
  el.boardWrap.classList.remove(className);
  void el.boardWrap.offsetWidth;
  el.boardWrap.classList.add(className);
  window.setTimeout(() => el.boardWrap.classList.remove(className), 700);
}

function clearBoardFeedback() {
  el.boardWrap.classList.remove("impact-boom", "impact-guard", "impact-item", "impact-elite", "impact-win");
}

function clearBoardFx() {
  if (el.boardFxLayer) el.boardFxLayer.innerHTML = "";
}

function showResult({ won, title, coins, xp, seconds, meta = [], recap = [], text }) {
  el.resultOverlay.hidden = false;
  el.resultOverlay.classList.toggle("loss", !won);
  el.resultOverlay.classList.toggle("win", won);
  el.resultKicker.textContent = won ? "Run Cleared" : "Run Failed";
  el.resultTitle.textContent = title;
  el.resultCoins.textContent = coins > 0 ? `+${coins}` : `${coins}`;
  el.resultXp.textContent = xp > 0 ? `+${xp}` : `${xp}`;
  el.resultTime.textContent = `${seconds}s`;
  el.resultMeta.innerHTML = meta.map(entry => `<span class="tag">${entry}</span>`).join("");
  el.resultRecap.innerHTML = recap.map(entry => `
    <div class="recap-card">
      <span>${entry.label}</span>
      <strong>${entry.value}</strong>
    </div>
  `).join("");
  el.resultText.innerHTML = text;
}

function hideResult() {
  el.resultOverlay.hidden = true;
  el.resultOverlay.classList.remove("win", "loss");
  el.resultMeta.innerHTML = "";
  el.resultRecap.innerHTML = "";
}

function eliteMultiplier() {
  if (!game) return 1;
  return Math.pow(1.12, game.eliteRun.vaultBonus) * Math.pow(1.2, game.eliteRun.doomCount);
}

function eliteResultMeta(records = null) {
  if (!game) return [];
  const meta = [
    `Elite x${eliteMultiplier().toFixed(2)}`,
    `Vault ${game.eliteRun.vaultBonus}`,
    `Scout ${game.eliteRun.scoutTriggers}`,
    `Doom ${game.eliteRun.doomCount}`
  ];
  if (records?.reward) meta.push("New Reward Record");
  if (records?.time) meta.push("New Time Record");
  return meta;
}

function eliteResultRecap(records = null) {
  if (!game) return [];
  return [
    { label: "精英翻开", value: String(game.eliteRun.opened) },
    { label: "Vault", value: String(game.eliteRun.vaultBonus) },
    { label: "Scout", value: String(game.eliteRun.scoutTriggers) },
    { label: "Doom", value: String(game.eliteRun.doomCount) },
    { label: "最终赏金", value: `x${eliteMultiplier().toFixed(2)}` },
    { label: "记录状态", value: records?.reward || records?.time ? "New Record" : "Stable" }
  ];
}

function resultFlavor(won, records) {
  if (won && records?.reward && records?.time) return "一局双刷记录，尖塔今天替你记住了这个名字。";
  if (won && game.eliteRun.doomCount >= 2) return "带着 Doom 的火药味清场，这一局赢得很凶。";
  if (won && game.eliteRun.vaultBonus >= 2) return "赏金层层叠起，这是一场漂亮的高价值通关。";
  if (!won && game.eliteRun.doomCount > 0) return "你把风险吃满了，只差最后一点控制力。";
  if (!won) return "矿区没有放水，但你已经摸清它的脾气了。";
  return "节奏很稳，下一局还可以再往上压。";
}

function eliteResultText(won, records, coinDelta) {
  const lines = [
    `本局触发精英格 ${game.eliteRun.opened} 次，最终赏金倍率为 x${eliteMultiplier().toFixed(2)}。`,
    won ? `本局共结算 ${coinDelta} 金币。` : coinDelta < 0 ? `失败额外损失 ${Math.abs(coinDelta)} 金币。` : "这次未能带走赏金，下次再冲一把。",
    resultFlavor(won, records)
  ];
  return lines.join("<br>");
}

function winGame() {
  game.over = true;
  clearInterval(timer);
  const reward = estimateReward(game.diff, game.elapsed);
  const xpGain = Math.round(game.diff.weight * 22 * (hasEffect("ultimateCore") && game.diff.id === "ultimate" ? 1.5 : 1));
  const records = updateBestRecords(reward, game.elapsed);
  save.coins += reward;
  save.xp += xpGain;
  recordFinishedGame(true, reward);
  while (save.xp >= save.level * 100 && save.level < 20) {
    save.xp -= save.level * 100;
    save.level += 1;
  }
  checkAchievements(false);
  persist();
  celebrateEvent({
    message: `胜利！获得 ${reward} 金币，${xpGain} 经验。`,
    ribbon: { text: records.reward || records.time ? "Victory + Record" : "Victory", tone: "tone-vault" },
    burst: { label: "Cleared", tone: "vault" },
    sound: "win",
    boardImpact: "win"
  });
  renderAll();
  renderBoard();
  showResult({
    won: true,
    title: "精英矿区已清空",
    coins: reward,
    xp: xpGain,
    seconds: game.elapsed,
    meta: eliteResultMeta(records),
    recap: eliteResultRecap(records),
    text: eliteResultText(true, records, reward)
  });
}

function loseGame() {
  game.over = true;
  clearInterval(timer);
  const risky = equippedItems().find(item => item.effect === "riskyMult");
  const penalty = risky ? risky.penalty : 0;
  if (risky) save.coins = Math.max(0, save.coins - penalty);
  recordFinishedGame(false);
  checkAchievements(false);
  persist();
  celebrateEvent({
    message: risky
      ? `爆炸失败，虚空铸币吞掉了 ${penalty} 金币。`
      : "爆炸失败，调整出战配置后再试一次。",
    ribbon: { text: risky ? `Failure -${penalty}` : "Failure", tone: "tone-doom" },
    burst: { label: "Shattered", tone: "doom" },
    sound: "loss",
    boardImpact: "boom"
  });
  renderAll();
  renderBoard();
  showResult({
    won: false,
    title: "矿区爆炸",
    coins: penalty ? -penalty : 0,
    xp: 0,
    seconds: game.elapsed,
    meta: eliteResultMeta(),
    recap: eliteResultRecap(),
    text: eliteResultText(false, null, penalty ? -penalty : 0)
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
  if (hasEffect("remainBonus")) itemMult *= 1 + (Math.max(0, diff.target - settledSeconds) / 60) * 0.02;
  const eliteMult = game && diff.id === game.diff.id ? eliteMultiplier() : 1;
  return Math.floor(BASE_REWARD * diff.weight * timeFactor * levelBonus() * itemMult * eliteMult);
}

function updateEstimate() {
  el.estimate.textContent = estimateReward();
}

function tick() {
  if (!game || game.over) return;
  const previousDate = save.daily.date;
  ensureDaily();
  if (save.daily.date !== previousDate) {
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

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatTime(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function eliteMark(type) {
  return {
    vault: "V",
    scout: "S",
    doom: "D"
  }[type] || "";
}

function symbolFor(effect) {
  return {
    revealSafe: "⌁",
    markMine: "⚑",
    peek: "?",
    openZero: "◌",
    copyCharge: "+"
  }[effect] || "•";
}
