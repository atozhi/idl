/* ==========================================================================
   Idle Dad Game - Core Game Engine (Pure Vanilla JavaScript)
   ========================================================================== */

// --- Game Data & Configuration ---
const CAREER_LEVELS = [
  { name: "현재 삼식이", salary: 0, stressRate: 0.2, promoCost: 8000 },
  { name: "회사원 (사원)", salary: 1200, stressRate: 0.6, promoCost: 20000 },
  { name: "회사원 (대리)", salary: 3500, stressRate: 0.9, promoCost: 80000 },
  { name: "회사원 (과장)", salary: 9000, stressRate: 1.3, promoCost: 280000 },
  { name: "회사원 (차장)", salary: 22000, stressRate: 1.9, promoCost: 1000000 },
  { name: "회사원 (부장)", salary: 55000, stressRate: 2.7, promoCost: 3800000 },
  { name: "회사원 (임원)", salary: 160000, stressRate: 4.2, promoCost: Infinity }
];

const UPGRADES_CONFIG = {
  sofa: {
    name: "프리미엄 리클라이너 소파",
    desc: "주말 소파 눕기의 스트레스 회복 효율이 증가합니다.",
    costBase: 5000,
    costMult: 1.8,
    maxLevel: 5,
    effect: (level) => level * 0.2 // 회복량 +20% * level
  },
  stealth: {
    name: "비상금 은닉 교본",
    desc: "비상금 숨기기 작전의 성공 확률이 대폭 증가합니다.",
    costBase: 8000,
    costMult: 2.0,
    maxLevel: 5,
    effect: (level) => level * 0.08 // 성공 확률 +8% * level
  },
  earplug: {
    name: "노이즈 캔슬링 이어폰",
    desc: "아내 잔소리 한 귀로 듣고 흘리기. 평화도 자연 감소가 감소합니다.",
    costBase: 6000,
    costMult: 1.7,
    maxLevel: 5,
    effect: (level) => level * 0.15 // 잔소리 감소 속도 -15% * level
  },
  talkCourse: {
    name: "자녀 소통 마스터 클래스",
    desc: "아이들에게 용돈을 줄 때 상승하는 친밀도가 증가합니다.",
    costBase: 10000,
    costMult: 1.9,
    maxLevel: 5,
    effect: (level) => level * 0.25 // 친밀도 상승률 +25% * level
  },
  autopilot: {
    name: "월급 루팡 매크로",
    desc: "회사 루팡짓 퀘스트가 자동으로 반복 실행됩니다.",
    costBase: 25000,
    costMult: 3.0,
    maxLevel: 1,
    effect: (level) => level > 0
  }
};

const QUESTS_CONFIG = [
  {
    id: "lupang",
    name: "회사에서 눈치 보며 루팡짓하기",
    desc: "모니터 뒤에서 엑셀 켜놓고 웹서핑을 합니다. (직장인 전용)",
    duration: 3, // 초
    rewardMoney: 1500, // 기본 보상 (직급 및 배율 반영됨)
    rewardHarmony: -1,
    rewardStress: 4,
    costMoney: 0,
    icon: "💼"
  },
  {
    id: "part_eyes",
    name: "인형 눈알 붙이기 부업",
    desc: "온 가족이 옹기종기 모여 앉아 밤새 인형 눈알을 붙입니다.",
    duration: 2,
    rewardMoney: 500,
    rewardHarmony: 1,
    rewardStress: 2,
    costMoney: 0,
    icon: "👁️"
  },
  {
    id: "part_delivery",
    name: "배민 도보 배달 알바",
    desc: "골목길을 열심히 뛰며 따끈한 떡볶이를 전달합니다.",
    duration: 5,
    rewardMoney: 3200,
    rewardHarmony: 3, // 아내가 운동된다며 흡족해함
    rewardStress: 6,
    costMoney: 0,
    icon: "🚶"
  },
  {
    id: "part_conveni",
    name: "편의점 주말 야간 대타 알바",
    desc: "야간 취객의 진상을 상대하며 편의점 매대를 정리합니다.",
    duration: 9,
    rewardMoney: 9500,
    rewardHarmony: -3,
    rewardStress: 14,
    costMoney: 0,
    icon: "🏪"
  },
  {
    id: "part_heavy",
    name: "쿠팡 물류창고 야간 상하차",
    desc: "쉴 새 없이 쏟아지는 지옥의 무거운 택배 상자를 적재합니다.",
    duration: 14,
    rewardMoney: 19000,
    rewardHarmony: -5,
    rewardStress: 26,
    costMoney: 0,
    icon: "📦"
  },
  // 장기 프로젝트 아르바이트
  {
    id: "proj_scrdoor",
    name: "[장기] 지하철 스크린도어 심야 정비",
    desc: "막차가 끊긴 선로로 내려가 안전 헬멧을 쓰고 문을 정비합니다. (장기 알바)",
    duration: 45, // 45초 소요
    rewardMoney: 85000,
    rewardHarmony: 10, // 남편의 성실한 노동에 아내가 감동
    rewardStress: 35,
    costMoney: 0,
    icon: "🛠️"
  },
  {
    id: "proj_anchovy",
    name: "[장기] 남해 멸치잡이 그물 수확선 탑승",
    desc: "거친 바다로 나가 며칠 동안 그물을 당기며 멸치를 털어냅니다. (장기 알바)",
    duration: 90, // 90초 소요
    rewardMoney: 220000,
    rewardHarmony: -18, // 며칠씩 집을 비우자 아내 분노
    rewardStress: 55,
    costMoney: 0,
    icon: "🚢"
  },
  {
    id: "rest",
    name: "주말 소파와 물아일체 되기",
    desc: "어떠한 미동도 없이 소파 위에서 숨만 쉽니다.",
    duration: 6,
    rewardMoney: 0,
    rewardHarmony: -6,
    rewardStress: -20,
    costMoney: 0,
    icon: "🛋️"
  },
  {
    id: "trash",
    name: "퇴근길 음식물 및 분리수거 쓰레기 버리기",
    desc: "완벽하게 페트병 라벨을 떼어 버려 평화를 얻습니다.",
    duration: 8,
    rewardMoney: -1000, // 종량제 봉투값 지출
    rewardHarmony: 15,
    rewardStress: 6,
    costMoney: 1000,
    icon: "🗑️"
  },
  {
    id: "ride",
    name: "주말 아침 일찍 아이들 학원 라이딩하기",
    desc: "졸린 눈을 비비며 학원 뺑뺑이 조수석 셔틀을 자처합니다.",
    duration: 12,
    rewardMoney: -8000, // 기름값 지출
    rewardHarmony: 8,
    rewardStress: 12,
    rewardAffinity: 6, // 아이들 친밀도 보너스
    costMoney: 8000,
    icon: "🚗"
  },
  {
    id: "homet",
    name: "홈트레이닝 하는 척하며 엎드려 폰하기",
    desc: "푸쉬업 자세를 잡고 바닥에 밀착해 인스타 릴스를 봅니다.",
    duration: 5,
    rewardMoney: 0,
    rewardHarmony: -2,
    rewardStress: -10,
    costMoney: 0,
    icon: "🏃"
  }
];

// --- Web Audio API Retro Sound Effects ---
let audioCtx = null;
let soundEnabled = false;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playSound(type) {
  if (!soundEnabled) return;
  initAudio();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  if (type === 'click') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1000, now + 0.08);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.08);
    osc.start(now);
    osc.stop(now + 0.08);
  } else if (type === 'success') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
    osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.3);
    gain.gain.linearRampToValueAtTime(0, now + 0.35);
    osc.start(now);
    osc.stop(now + 0.35);
  } else if (type === 'fail') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(120, now + 0.3);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'promo') {
    osc.type = 'sine';
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
    });
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.4);
    gain.gain.linearRampToValueAtTime(0, now + 0.5);
    osc.start(now);
    osc.stop(now + 0.5);
  }
}

// --- Game State Object ---
let state = {
  money: 0,
  stress: 0,
  harmony: 100,
  careerIndex: 0,
  kids: {
    son: { affinity: 50, status: "수능 디데이 카운트다운 보며 멍때리는 중" },
    daughter: { affinity: 50, status: "대학교 축제 라인업 구경 중" }
  },
  upgrades: {
    sofa: 0,
    stealth: 0,
    earplug: 0,
    talkCourse: 0,
    autopilot: 0
  },
  isBurnout: false,
  questProgress: {}, // { questId: progressPercent }
  lastTickTime: Date.now()
};

// Currently running active quests in background
const runningQuests = {};

// --- Helper Functions ---
function formatKoreanMoney(amount) {
  if (amount === 0) return "0원";
  let result = "";
  let temp = Math.floor(amount);
  
  const units = ["", "만", "억", "조"];
  let unitIndex = 0;
  
  while (temp > 0) {
    const part = temp % 10000;
    if (part > 0) {
      result = part.toLocaleString() + units[unitIndex] + " " + result;
    }
    temp = Math.floor(temp / 10000);
    unitIndex++;
  }
  
  return result.trim() + "원";
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let emoji = "ℹ️";
  if (type === 'success') emoji = "✅";
  if (type === 'error') emoji = "❌";
  if (type === 'warning') emoji = "⚠️";

  toast.innerHTML = `<span>${emoji}</span><span>${message}</span>`;
  container.appendChild(toast);

  // Auto remove after 3s
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function writeLog(message, type = 'system') {
  const container = document.getElementById('game-logs');
  if (!container) return;

  const logLine = document.createElement('div');
  logLine.className = `log-line ${type}`;
  
  const time = new Date();
  const timeStr = `[${time.toLocaleTimeString()}] `;
  logLine.innerText = timeStr + message;
  
  container.appendChild(logLine);
  container.scrollTop = container.scrollHeight;

  // Keep logs under 100 entries to prevent memory leaks
  while (container.childNodes.length > 100) {
    container.removeChild(container.firstChild);
  }
}

// --- Floating Text Effect ---
function createFloatingText(x, y, text, color = '#fbbf24') {
  const element = document.createElement('div');
  element.className = 'floating-text';
  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
  element.style.color = color;
  element.innerText = text;
  document.body.appendChild(element);

  setTimeout(() => {
    element.remove();
  }, 1000);
}

// --- Game Save / Load Engine ---
function saveGame() {
  try {
    state.lastTickTime = Date.now();
    localStorage.setItem('idle_dad_game_save', JSON.stringify(state));
  } catch (e) {
    console.error("Save failed", e);
  }
}

function loadGame() {
  try {
    const rawSave = localStorage.getItem('idle_dad_game_save');
    if (rawSave) {
      const parsed = JSON.parse(rawSave);
      
      // Merge keys to support backward compatibility
      state = { ...state, ...parsed };
      
      // Calculate offline progress
      const offlineTimeMs = Date.now() - state.lastTickTime;
      const offlineSec = Math.floor(offlineTimeMs / 1000);
      
      if (offlineSec > 10) {
        processOfflineEarnings(offlineSec);
      }
      
      writeLog("기존 세이브 데이터를 성공적으로 불러왔습니다.", "system");
      showToast("이전 세이브 로드 완료!", "success");
    } else {
      writeLog("새로운 육아가 시작되었습니다. 아빠 파이팅!", "system");
    }
  } catch (e) {
    console.error("Load failed", e);
  }
}

function processOfflineEarnings(seconds) {
  // Cap offline progress to 8 hours (28800 seconds)
  const capSec = Math.min(seconds, 28800);
  
  const career = CAREER_LEVELS[state.careerIndex];
  
  // Calculate passive income base
  let passiveSalary = career.salary * 0.1; // 10% passive rate
  
  // Adjust with upgrades and harmony multiplier
  const harmonyMultiplier = getHarmonyMultiplier();
  const totalPassiveRate = passiveSalary * harmonyMultiplier;
  
  const earnedMoney = Math.floor(totalPassiveRate * capSec);
  state.money += earnedMoney;

  // Passive stress accrual (minimized offline)
  const stressAdded = Math.floor(career.stressRate * 0.05 * capSec);
  state.stress = Math.min(100, Math.max(0, state.stress + stressAdded));

  writeLog(`부재중 (${Math.floor(capSec/60)}분 ${capSec%60}초) 동안 월급 ${formatKoreanMoney(earnedMoney)}이(가) 통장에 꽂혔습니다.`, "earn");
  writeLog(`부재중 스트레스가 ${stressAdded}% 쌓였습니다.`, "danger");
}

function resetGame() {
  if (confirm("정말로 아빠의 삶을 초기화하시겠습니까? 모든 자산과 업그레이드가 날아갑니다!")) {
    playSound('fail');
    localStorage.removeItem('idle_dad_game_save');
    window.location.reload();
  }
}

// --- State Calculation Helpers ---
function getHarmonyMultiplier() {
  // Harmony 100% -> x1.5, Harmony 50% -> x1.0, Harmony 0% -> x0.2
  if (state.harmony >= 50) {
    return 1.0 + ((state.harmony - 50) / 50) * 0.5;
  } else {
    return 0.2 + (state.harmony / 50) * 0.8;
  }
}

function getUpgradeCost(key) {
  const config = UPGRADES_CONFIG[key];
  const currentLevel = state.upgrades[key];
  return Math.floor(config.costBase * Math.pow(config.costMult, currentLevel));
}

// --- UI Rendering ---
function renderUI() {
  const container = document.getElementById('game-container');
  if (container && container.style.opacity === '0') {
    container.style.opacity = '1';
  }

  const career = CAREER_LEVELS[state.careerIndex];
  
  // Header Career & Money
  document.getElementById('player-career').innerText = career.name;
  document.getElementById('player-money').innerText = formatKoreanMoney(state.money);
  
  const mult = getHarmonyMultiplier().toFixed(2);
  document.getElementById('money-multiplier').innerText = `수익 배율: x${mult} (가정 평화도 연동)`;
  
  const passive = state.isBurnout ? 0 : career.salary;
  document.getElementById('career-salary').innerText = `기본 월급: 초당 ${formatKoreanMoney(passive)} (${state.isBurnout ? '번아웃 상태!' : '정상 작동중'})`;

  // Stress State
  const stressBar = document.getElementById('stress-bar');
  const stressPercentText = document.getElementById('stress-percentage');
  const stressStatus = document.getElementById('stress-status');
  
  stressBar.style.width = `${state.stress}%`;
  stressPercentText.innerText = `${Math.floor(state.stress)}%`;
  
  if (state.isBurnout) {
    stressStatus.innerText = "🚨 번아웃 발생! 스트레스를 해소할 때까지 급여가 들어오지 않습니다!";
    stressStatus.style.color = "var(--accent-coral)";
    document.querySelector('.stats-bar').classList.add('shake-element');
  } else if (state.stress > 80) {
    stressStatus.innerText = "⚠️ 스트레스 한계 임박! (주말에 소파에 누워 쉬세요)";
    stressStatus.style.color = "var(--accent-gold)";
    document.querySelector('.stats-bar').classList.remove('shake-element');
  } else {
    stressStatus.innerText = "🔋 아빠의 멘탈은 평온한 상태입니다.";
    stressStatus.style.color = "var(--text-muted)";
    document.querySelector('.stats-bar').classList.remove('shake-element');
  }

  // Harmony State
  const harmonyBar = document.getElementById('harmony-bar');
  const harmonyPercentText = document.getElementById('harmony-percentage');
  const harmonyStatus = document.getElementById('harmony-status');
  
  harmonyBar.style.width = `${state.harmony}%`;
  harmonyPercentText.innerText = `${Math.floor(state.harmony)}%`;
  
  if (state.harmony > 80) {
    harmonyStatus.innerText = "아내의 상태: \"여보, 오늘 맛있는 거 해줄까?\" (수익 1.5배)";
  } else if (state.harmony > 40) {
    harmonyStatus.innerText = "아내의 상태: \"오늘 분리수거 하는 날인 거 알지?\"";
  } else if (state.harmony > 15) {
    harmonyStatus.innerText = "아내의 상태: (싸늘한 침묵) \"문 열어주지 마라\"";
  } else {
    harmonyStatus.innerText = "🚨 위험: 아내가 친정으로 가려고 가방을 싸고 있습니다! (수익 0.2배)";
  }

  // Kids State
  // Son
  document.getElementById('son-affinity').innerText = state.kids.son.affinity;
  document.getElementById('son-affinity-bar').style.width = `${state.kids.son.affinity}%`;
  document.getElementById('son-status').innerText = `상태: ${state.kids.son.status}`;
  
  // Daughter
  document.getElementById('daughter-affinity').innerText = state.kids.daughter.affinity;
  document.getElementById('daughter-affinity-bar').style.width = `${state.kids.daughter.affinity}%`;
  document.getElementById('daughter-status').innerText = `상태: ${state.kids.daughter.status}`;
  
  // Kids Buff indicator coloring
  if (state.kids.son.affinity >= 80) {
    document.getElementById('son-buff').style.borderColor = "var(--accent-green)";
    document.getElementById('son-buff').style.color = "var(--accent-green)";
    document.getElementById('son-buff').innerText = "✅ 버프 활성: 스트레스가 매초 자동으로 회복됩니다 (-1/초)";
  } else {
    document.getElementById('son-buff').style.borderColor = "rgba(251, 191, 36, 0.2)";
    document.getElementById('son-buff').style.color = "var(--accent-gold)";
    document.getElementById('son-buff').innerText = "효과: 친밀도 80 이상 시 스트레스 자동 회복 (-1/초)";
  }
  
  if (state.kids.daughter.affinity >= 80) {
    document.getElementById('daughter-buff').style.borderColor = "var(--accent-green)";
    document.getElementById('daughter-buff').style.color = "var(--accent-green)";
    document.getElementById('daughter-buff').innerText = "✅ 버프 활성: 엄마의 잔소리 쉴드 가동 (평화도 하락률 50% 방어)";
  } else {
    document.getElementById('daughter-buff').style.borderColor = "rgba(251, 191, 36, 0.2)";
    document.getElementById('daughter-buff').style.color = "var(--accent-gold)";
    document.getElementById('daughter-buff').innerText = "효과: 친밀도 80 이상 시 아내 잔소리 쉴드 (평화도 감소 50% 방어)";
  }

  // Render Promotion Card
  renderPromotionCard();

  // Render Upgrades List
  renderUpgrades();
}

function renderPromotionCard() {
  const container = document.getElementById('promotion-card');
  if (!container) return;

  const nextLevelIndex = state.careerIndex + 1;
  if (nextLevelIndex >= CAREER_LEVELS.length) {
    container.innerHTML = `
      <div class="shop-card-info">
        <h4>🎉 회사 임원 (최고 직급 도달)</h4>
        <p>더 이상의 승진은 없습니다. 대한민국 아빠들 중 상위 1%!</p>
      </div>
      <button class="btn btn-primary" disabled>만렙 달성</button>
    `;
    return;
  }

  const nextLevel = CAREER_LEVELS[nextLevelIndex];
  const canAfford = state.money >= nextLevel.promoCost;

  if (state.careerIndex === 0) {
    // 무직 상태일 때는 취업 지원
    container.innerHTML = `
      <div class="shop-card-info">
        <h4>💼 정규직 대기업 공채 신입사원 지원</h4>
        <p>서류 전형 및 실무 면접에 응시합니다. (합격 확률: 15%)</p>
        <p>합격 시: 회사 루팡 퀘스트 해금 & 초당 월급 입금 시작!</p>
        <p class="cost font-outfit">이력서 지원비: ${formatKoreanMoney(nextLevel.promoCost)}</p>
      </div>
      <button class="btn btn-primary" id="btn-promote" ${canAfford ? "" : "disabled"}>
        입사 지원서 제출 📄
      </button>
    `;
  } else {
    // 직장인일 때는 승진 시험
    container.innerHTML = `
      <div class="shop-card-info">
        <h4>${nextLevel.name} 승진 시험</h4>
        <p>급여: 초당 ${formatKoreanMoney(nextLevel.salary)} | 스트레스 증가: +${nextLevel.stressRate}/초</p>
        <p class="cost font-outfit">요구 비용: ${formatKoreanMoney(nextLevel.promoCost)}</p>
      </div>
      <button class="btn btn-primary" id="btn-promote" ${canAfford ? "" : "disabled"}>
        승진하기 💼
      </button>
    `;
  }

  // Bind click
  const btn = document.getElementById('btn-promote');
  if (btn) {
    btn.addEventListener('click', buyPromotion);
  }
}

function buyPromotion() {
  const nextLevelIndex = state.careerIndex + 1;
  if (nextLevelIndex >= CAREER_LEVELS.length) return;

  const nextLevel = CAREER_LEVELS[nextLevelIndex];
  if (state.money >= nextLevel.promoCost) {
    state.money -= nextLevel.promoCost;
    
    if (state.careerIndex === 0) {
      // 무직에서 사원 취업 도전 (15% 확률)
      const roll = Math.random();
      if (roll <= 0.15) {
        state.careerIndex = nextLevelIndex;
        playSound('promo');
        writeLog(`🎉 취업 대성공! 드디어 [${nextLevel.name}]으로 정규직 입사에 성공했습니다! 이제부터 월급이 꼬박꼬박 꽂힙니다.`, "earn");
        showToast("정규직 취업 성공! 🎉", "success");
      } else {
        playSound('fail');
        state.stress = Math.min(100, state.stress + 15);
        writeLog(`❌ 입사 전형 탈락... 면접관들의 차가운 질문에 멘탈이 흔들려 피로가 쌓입니다. (스트레스 +15)`, "danger");
        showToast("탈락... 다음 기회에 😭", "error");
      }
    } else {
      // 일반 승진
      state.careerIndex = nextLevelIndex;
      playSound('promo');
      writeLog(`승진 성공! 이제부터 [${nextLevel.name}]로서 더 높은 월급을 받지만, 스트레스도 가속됩니다.`, "earn");
      showToast(`${nextLevel.name} 승진 성공!`, "success");
    }
    renderUI();
  }
}

function renderUpgrades() {
  const container = document.getElementById('upgrades-container');
  if (!container) return;

  container.innerHTML = "";

  Object.keys(UPGRADES_CONFIG).forEach(key => {
    const config = UPGRADES_CONFIG[key];
    const level = state.upgrades[key];
    const cost = getUpgradeCost(key);
    
    const isMax = level >= config.maxLevel;
    const canAfford = state.money >= cost && !isMax;

    const card = document.createElement('div');
    card.className = "shop-card";
    
    card.innerHTML = `
      <div class="shop-card-info">
        <h4>${config.name} (Lv. ${level}/${config.maxLevel})</h4>
        <p>${config.desc}</p>
        <p class="cost font-outfit">${isMax ? "최대 레벨" : "비용: " + formatKoreanMoney(cost)}</p>
      </div>
      <button class="btn btn-secondary btn-upgrade" data-upgrade="${key}" ${canAfford ? "" : "disabled"}>
        ${isMax ? "완료" : "업그레이드 🛠️"}
      </button>
    `;

    container.appendChild(card);
  });

  // Bind upgrade clicks
  document.querySelectorAll('.btn-upgrade').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const key = e.target.getAttribute('data-upgrade');
      buyUpgrade(key);
    });
  });
}

function buyUpgrade(key) {
  const config = UPGRADES_CONFIG[key];
  const level = state.upgrades[key];
  const cost = getUpgradeCost(key);

  if (level >= config.maxLevel) return;

  if (state.money >= cost) {
    state.money -= cost;
    state.upgrades[key]++;
    playSound('success');
    writeLog(`[${config.name}] 업그레이드 완료 (레벨 ${state.upgrades[key]})`, "system");
    showToast("업그레이드 완료!", "success");
    renderUI();
  }
}

// --- Dynamic Quest Generation & Engine ---
function renderQuests() {
  const container = document.querySelector('.quest-list');
  if (!container) return;

  container.innerHTML = "";

  QUESTS_CONFIG.forEach(quest => {
    const card = document.createElement('div');
    card.className = "quest-card card";
    card.id = `quest-card-${quest.id}`;

    // Dynamic Reward Calculation based on career & status multipliers
    let displayRewardGold = "";
    if (quest.rewardMoney > 0) {
      displayRewardGold = `+${formatKoreanMoney(getQuestMoneyReward(quest))}`;
    } else if (quest.rewardMoney < 0) {
      displayRewardGold = `-${formatKoreanMoney(Math.abs(quest.rewardMoney))}`;
    }

    const hasCost = quest.costMoney > 0;
    const canAfford = state.money >= quest.costMoney;
    
    // Check if quest is running
    const isRunning = runningQuests[quest.id] !== undefined;

    // Check if locked for Unemployed
    const isLockedForUnemployed = quest.id === 'lupang' && state.careerIndex === 0;

    let btnHtml = "";
    if (isLockedForUnemployed) {
      btnHtml = `
        <button class="btn btn-primary" disabled style="opacity: 0.6;">
          직장인 전용 💼
        </button>
      `;
    } else if (quest.id === 'stealth_hide') {
      btnHtml = `
        <button class="btn btn-danger btn-start-quest" data-quest="${quest.id}">
          비상금 숨기기 🤫
        </button>
      `;
    } else {
      btnHtml = `
        <button class="btn btn-primary btn-start-quest" data-quest="${quest.id}" ${(!isRunning && canAfford) ? "" : "disabled"}>
          ${isRunning ? "진행 중..." : "행동하기 🏃"}
        </button>
      `;
    }

    card.innerHTML = `
      <div class="quest-top">
        <div>
          <div class="quest-info-title">${quest.icon} ${quest.name}</div>
          <div class="quest-desc">${quest.desc}</div>
          <div class="quest-rewards">
            ${quest.rewardMoney !== 0 ? `<span class="reward-tag gold">${displayRewardGold}</span>` : ""}
            ${quest.rewardStress !== 0 ? `<span class="reward-tag stress">${quest.rewardStress > 0 ? "+" + quest.rewardStress : quest.rewardStress}% 피로</span>` : ""}
            ${quest.rewardHarmony !== 0 ? `<span class="reward-tag harmony">${quest.rewardHarmony > 0 ? "+" + quest.rewardHarmony : quest.rewardHarmony}% 평화</span>` : ""}
          </div>
        </div>
        
        <div class="quest-actions-btn-group">
          ${btnHtml}
        </div>
      </div>
      <div class="quest-actions">
        <div class="progress-container">
          <div id="quest-progress-${quest.id}" class="progress-fill quest" style="width: ${state.questProgress[quest.id] || 0}%;"></div>
        </div>
        <span class="quest-duration font-outfit">${quest.duration}초</span>
      </div>
    `;

    container.appendChild(card);
  });

  // Attach event listeners to quests
  document.querySelectorAll('.btn-start-quest').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const qid = e.target.getAttribute('data-quest');
      if (qid === 'stealth_hide') {
        // Open mini game
      } else {
        startQuest(qid);
      }
    });
  });
}

function getQuestMoneyReward(quest) {
  if (quest.id === "lupang") {
    // Lupang gets scaled by career salary and multiplier
    const career = CAREER_LEVELS[state.careerIndex];
    const moneyBase = quest.rewardMoney + (career.salary * 1.5);
    return Math.floor(moneyBase * getHarmonyMultiplier());
  }
  return quest.rewardMoney;
}

function startQuest(questId) {
  if (questId === 'lupang' && state.careerIndex === 0) {
    showToast("무직 상태에서는 회사 루팡짓을 할 수 없습니다!", "error");
    playSound('fail');
    return;
  }

  const quest = QUESTS_CONFIG.find(q => q.id === questId);
  if (!quest) return;

  // Check cost
  if (state.money < quest.costMoney) {
    showToast("자산이 부족하여 수행할 수 없습니다!", "error");
    playSound('fail');
    return;
  }

  // Deduct cost immediately
  if (quest.costMoney > 0) {
    state.money -= quest.costMoney;
    renderUI();
  }

  playSound('click');
  runningQuests[questId] = {
    elapsed: 0,
    total: quest.duration
  };

  // Disable button
  const card = document.getElementById(`quest-card-${questId}`);
  if (card) {
    const btn = card.querySelector('.btn-start-quest');
    if (btn) btn.disabled = true;
  }
}

// Tick running quests (Runs every 100ms for smooth transitions)
function updateQuestsProgress(deltaTime) {
  Object.keys(runningQuests).forEach(qid => {
    const qObj = runningQuests[qid];
    qObj.elapsed += deltaTime;
    
    const percent = Math.min(100, (qObj.elapsed / qObj.total) * 100);
    state.questProgress[qid] = percent;

    const progressFill = document.getElementById(`quest-progress-${qid}`);
    if (progressFill) {
      progressFill.style.width = `${percent}%`;
    }

    if (qObj.elapsed >= qObj.total) {
      completeQuest(qid);
    }
  });
}

function completeQuest(questId) {
  const quest = QUESTS_CONFIG.find(q => q.id === questId);
  delete runningQuests[questId];
  state.questProgress[questId] = 0;

  const progressFill = document.getElementById(`quest-progress-${questId}`);
  if (progressFill) {
    progressFill.style.width = `0%`;
  }

  if (!quest) return;

  // Apply Rewards
  if (quest.rewardMoney > 0) {
    const reward = getQuestMoneyReward(quest);
    state.money += reward;
    writeLog(`[${quest.name}] 완료! 통장에 ${formatKoreanMoney(reward)} 입금!`, "earn");
    
    // Spawn floating text on stats bar
    const statAsset = document.getElementById('player-money');
    if (statAsset) {
      const rect = statAsset.getBoundingClientRect();
      createFloatingText(rect.left + 20, rect.top - 10, `+${formatKoreanMoney(reward)}`, '#fbbf24');
    }
  }

  if (quest.rewardStress !== 0) {
    let appliedStress = quest.rewardStress;
    
    // If rest quest and premium sofa upgrade purchased
    if (questId === 'rest' && state.upgrades.sofa > 0) {
      const sofaBonus = UPGRADES_CONFIG.sofa.effect(state.upgrades.sofa);
      appliedStress = Math.floor(appliedStress * (1 + sofaBonus)); // e.g. -20 * 1.2 = -24
    }

    state.stress = Math.min(100, Math.max(0, state.stress + appliedStress));
  }

  if (quest.rewardHarmony !== 0) {
    let appliedHarmony = quest.rewardHarmony;
    // Earplug reduces negative harmony impact
    if (appliedHarmony < 0 && state.upgrades.earplug > 0) {
      const earplugReduction = UPGRADES_CONFIG.earplug.effect(state.upgrades.earplug);
      appliedHarmony = Math.floor(appliedHarmony * (1 - earplugReduction));
    }
    state.harmony = Math.min(100, Math.max(0, state.harmony + appliedHarmony));
  }

  // Kid affinity bonus
  if (quest.rewardAffinity) {
    const courseBuff = 1 + UPGRADES_CONFIG.talkCourse.effect(state.upgrades.talkCourse);
    const addedAffinity = Math.floor(quest.rewardAffinity * courseBuff);
    
    state.kids.son.affinity = Math.min(100, state.kids.son.affinity + addedAffinity);
    state.kids.daughter.affinity = Math.min(100, state.kids.daughter.affinity + addedAffinity);
    
    writeLog(`학원 라이드 덕분에 아들과 딸의 친밀도가 각각 ${addedAffinity} 상승했습니다.`, "family");
  }

  playSound('success');
  renderUI();
  renderQuests();

  // Handle Autopilot (Auto-looping salary lupang)
  if (questId === 'lupang' && state.upgrades.autopilot > 0) {
    setTimeout(() => {
      if (!state.isBurnout) {
        startQuest('lupang');
      }
    }, 200);
  }
}

// --- Kids Pocket Money Interactions ---
function givePocketMoney(kid, amount) {
  playSound('click');
  
  if (state.money < amount) {
    showToast("자산(용돈)이 부족합니다!", "error");
    playSound('fail');
    return;
  }

  state.money -= amount;

  // Calculate affinity gain based on level & course upgrade
  const baseGain = amount === 10000 ? 5 : 30;
  const courseBuff = 1 + UPGRADES_CONFIG.talkCourse.effect(state.upgrades.talkCourse);
  const affinityGain = Math.floor(baseGain * courseBuff);

  state.kids[kid].affinity = Math.min(100, state.kids[kid].affinity + affinityGain);

  const kidNameStr = kid === 'son' ? '아들 민돌이' : '딸 뿡수니';
  writeLog(`${kidNameStr}에게 용돈 ${formatKoreanMoney(amount)}을(를) 주었습니다. 친밀도가 ${affinityGain} 올랐습니다.`, "family");
  showToast(`${kidNameStr} 친밀도 +${affinityGain}!`, "success");

  // Visual text float
  const kidBox = document.getElementById(`kid-${kid}`);
  if (kidBox) {
    const rect = kidBox.getBoundingClientRect();
    createFloatingText(rect.left + 50, rect.top + 20, `💖 +${affinityGain}`, '#f43f5e');
  }

  // Kid quick response status updates
  if (amount === 50000) {
    state.kids[kid].status = kid === 'son' ? "갑자기 공부 모드로 책상에 앉음" : "전공 서적 제본 완료 후 환하게 웃음";
  } else {
    state.kids[kid].status = kid === 'son' ? "스마트 스터디 카페 6시간 연장권 충전" : "선배들과 단체 톡방에 밥약 완료 인증샷 전송";
  }

  renderUI();
}

// --- Random Event System ---
let nextEventTimer = 25; // seconds left till next event check

function handleEventTick() {
  nextEventTimer--;
  if (nextEventTimer <= 0) {
    nextEventTimer = Math.floor(Math.random() * 20) + 20; // 20~40초 간격 재설정
    triggerRandomEvent();
  }
}

function triggerRandomEvent() {
  // Select type of event: 0 -> Son request, 1 -> Daughter request, 2 -> Wife surprise, 3 -> Hidden bonus
  const eventPool = [0, 1, 2];
  const eventType = eventPool[Math.floor(Math.random() * eventPool.length)];

  if (eventType === 0) {
    triggerSonPocketRequest();
  } else if (eventType === 1) {
    triggerDaughterPocketRequest();
  } else if (eventType === 2) {
    triggerWifeSuspectEvent();
  }
}

function showModal(title, icon, message, avatar, options) {
  document.getElementById('modal-title').innerText = title;
  document.getElementById('modal-title-icon').innerText = icon;
  document.getElementById('modal-message').innerText = message;
  document.getElementById('modal-character-avatar').innerText = avatar;

  const footer = document.getElementById('modal-options');
  footer.innerHTML = "";

  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = `btn ${opt.class || 'btn-primary'}`;
    btn.innerText = opt.text;
    btn.addEventListener('click', () => {
      playSound('click');
      closeModal();
      opt.callback();
    });
    footer.appendChild(btn);
  });

  document.getElementById('event-modal').classList.add('active');
}

function closeModal() {
  document.getElementById('event-modal').classList.remove('active');
}

function triggerSonPocketRequest() {
  const reqAmount = getCalculatedPocketRequest();
  const avatar = "👦";
  const title = "아들의 요구";
  const desc = `"아빠... 고3 수험생활이 너무 팍팍해. 친구들이랑 수능 대박 기원 독서실 패스 끊어야 하는데... 딱 ${formatKoreanMoney(reqAmount)}만 보태주면 안 돼? 진짜 열심히 할게!"`;

  showModal(title, "🚨", desc, avatar, [
    {
      text: `용돈 주기 (${formatKoreanMoney(reqAmount)})`,
      class: 'btn-success',
      callback: () => {
        if (state.money >= reqAmount) {
          state.money -= reqAmount;
          const courseBuff = 1 + UPGRADES_CONFIG.talkCourse.effect(state.upgrades.talkCourse);
          const gain = Math.floor(18 * courseBuff);
          state.kids.son.affinity = Math.min(100, state.kids.son.affinity + gain);
          state.kids.son.status = "1타 강사 패키지 결제하고 공부 자극받는 중";
          
          // Son specialty: instant stress relief
          state.stress = Math.max(0, state.stress - 20);
          
          writeLog(`민돌이에게 용돈을 쾌척했습니다! 아빠의 피로가 사르르 녹아내립니다 (스트레스 -20, 친밀도 +${gain})`, "family");
          showToast("아들 용돈 주기 성공!", "success");
        } else {
          // Fallback to refuse if money was spent while modal was open
          refuseSonRequest();
        }
      }
    },
    {
      text: "단호하게 거절하기 (스트레스 상승)",
      class: 'btn-danger',
      callback: refuseSonRequest
    }
  ]);
}

function refuseSonRequest() {
  state.kids.son.affinity = Math.max(0, state.kids.son.affinity - 12);
  state.stress = Math.min(100, state.stress + 5);
  state.kids.son.status = "방 문 쾅 닫고 들어감";
  writeLog("민돌이의 요구를 냉정히 묵살했습니다. 민돌이가 토라졌습니다. (친밀도 -12, 스트레스 +5)", "danger");
  showToast("민돌이가 토라졌습니다.", "warning");
  renderUI();
}

function triggerDaughterPocketRequest() {
  const reqAmount = getCalculatedPocketRequest();
  const avatar = "👧";
  const title = "딸의 은밀한 요구";
  const desc = `"아빠... 이번 학기 전공 책값이 생각보다 너무 많이 나왔네... 개강 총회 회비도 내야 하고... 딱 ${formatKoreanMoney(reqAmount)}만 급전 융통 안 될까? 헤헤..."`;

  showModal(title, "🚨", desc, avatar, [
    {
      text: `용돈 주기 (${formatKoreanMoney(reqAmount)})`,
      class: 'btn-success',
      callback: () => {
        if (state.money >= reqAmount) {
          state.money -= reqAmount;
          const courseBuff = 1 + UPGRADES_CONFIG.talkCourse.effect(state.upgrades.talkCourse);
          const gain = Math.floor(18 * courseBuff);
          state.kids.daughter.affinity = Math.min(100, state.kids.daughter.affinity + gain);
          state.kids.daughter.status = "전공책 제본하고 조별과제 캐리 중";
          
          // Daughter specialty: wife defense shield buff increment
          state.harmony = Math.min(100, state.harmony + 15);
          
          writeLog(`뿡수니에게 흔쾌히 지갑을 열었습니다! 딸이 엄마의 신경을 다른 데로 돌립니다 (평화도 +15, 친밀도 +${gain})`, "family");
          showToast("딸의 잔소리 쉴드 작동!", "success");
        } else {
          refuseDaughterRequest();
        }
      }
    },
    {
      text: "엄마한테 이른다며 훈계하기",
      class: 'btn-danger',
      callback: refuseDaughterRequest
    }
  ]);
}

function refuseDaughterRequest() {
  state.kids.daughter.affinity = Math.max(0, state.kids.daughter.affinity - 12);
  state.stress = Math.min(100, state.stress + 5);
  state.kids.daughter.status = "눈을 흘기며 엄마 방으로 들어감";
  writeLog("뿡수니의 투정을 단호하게 쳐냈습니다. 뿡수니가 아빠를 투명인간 취급하기 시작했습니다. (친밀도 -12, 스트레스 +5)", "danger");
  showToast("뿡수니가 삐졌습니다.", "warning");
  renderUI();
}

function getCalculatedPocketRequest() {
  const career = CAREER_LEVELS[state.careerIndex];
  // Pocket money demands rise as your career salary rises
  const base = career.salary * 5;
  // randomized modifier
  const rand = Math.floor(Math.random() * (base * 0.4)) + (base * 0.8);
  // round to nearest 1000
  return Math.max(10000, Math.floor(rand / 1000) * 1000);
}

function triggerWifeSuspectEvent() {
  const avatar = "👩";
  const title = "아내의 수색 작전";
  const desc = `"당신 요즘 슬슬 주머니가 두꺼워진 거 같네? 베란다 화분 뒤에 웬 봉투가 있는 거 같던데... 확인하러 간다?"`;

  // Check if we actually have any money to lose
  if (state.money < 30000) {
    // skip event if poor
    return;
  }

  showModal(title, "👵", desc, avatar, [
    {
      text: "눈 질끈 감고 시치미 떼기 (확률 체크)",
      class: 'btn-warning',
      callback: () => {
        // Base stealth rate: 40%. Upgrade adds 8% per level.
        const stealthUpgradeLevel = state.upgrades.stealth;
        const successRate = 0.40 + UPGRADES_CONFIG.stealth.effect(stealthUpgradeLevel);
        const rolls = Math.random();

        if (rolls <= successRate) {
          // Success
          playSound('success');
          state.harmony = Math.min(100, state.harmony + 5);
          writeLog("휴... 아내가 그냥 지나갔습니다. 심장이 쫄깃했습니다! (가정 평화도 +5)", "system");
          showToast("비상금 은닉 사수 성공!", "success");
        } else {
          // Failed! Lose half the money
          playSound('fail');
          const loss = Math.floor(state.money * 0.4);
          state.money -= loss;
          state.harmony = Math.max(0, state.harmony - 25);
          
          writeLog(`❌ 비상금 발각! 아내에게 비상금 ${formatKoreanMoney(loss)}을(를) 강탈당했습니다. (가정 평화도 -25)`, "danger");
          showToast("비상금 발각! 자금 압수!", "error");
        }
        renderUI();
      }
    },
    {
      text: "자수하여 광명 찾기 (돈 일부 헌납, 평화 대폭 상승)",
      class: 'btn-success',
      callback: () => {
        // Volunteer 20% of your funds
        const tax = Math.floor(state.money * 0.2);
        state.money -= tax;
        state.harmony = Math.min(100, state.harmony + 20);
        writeLog(`아내에게 웃으며 ${formatKoreanMoney(tax)}을 생활비로 헌납했습니다. 부부의 신뢰가 깊어집니다. (가정 평화도 +20)`, "family");
        showToast("생활비 헌납 완료", "success");
        renderUI();
      }
    }
  ]);
}

// --- Active Mini Game: Hide Pocket Money ---
function initHideGame() {
  const btnClose = document.getElementById('btn-close-hide-game');
  if (btnClose) {
    btnClose.addEventListener('click', () => {
      document.getElementById('hide-money-modal').classList.remove('active');
    });
  }

  // Bind spots
  document.querySelectorAll('.hide-spot-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const spot = e.currentTarget.getAttribute('data-spot');
      executeHideAction(spot);
    });
  });
}

function openHideGameModal() {
  // Update wife's current alert based on active harmony
  const alertLevelSpan = document.getElementById('wife-alert-level');
  let alertText = "보통 (들킬 확률 30%)";
  let failChance = 0.3;

  if (state.harmony < 30) {
    alertText = "경계 강함 (들킬 확률 60%)";
    failChance = 0.6;
  } else if (state.harmony > 80) {
    alertText = "매우 온화함 (들킬 확률 15%)";
    failChance = 0.15;
  }

  alertLevelSpan.innerText = alertText;
  document.getElementById('hide-money-modal').classList.add('active');
}

function executeHideAction(spot) {
  document.getElementById('hide-money-modal').classList.remove('active');
  
  // Calculate success
  let failChance = 0.3;
  if (state.harmony < 30) failChance = 0.6;
  if (state.harmony > 80) failChance = 0.15;

  // Subtract stealth upgrade bonus from fail chance
  const stealthBonus = UPGRADES_CONFIG.stealth.effect(state.upgrades.stealth);
  failChance = Math.max(0.05, failChance - stealthBonus); // min 5% fail chance

  const roll = Math.random();

  let spotKorean = "";
  if (spot === 'sofa') spotKorean = "소파 쿠션 밑";
  if (spot === 'car') spotKorean = "조수석 콘솔박스";
  if (spot === 'veranda') spotKorean = "베란다 화분 뒤";
  if (spot === 'book') spotKorean = "책장 전집 구석";

  if (roll > failChance) {
    // Success! Generate significant income based on career level
    const career = CAREER_LEVELS[state.careerIndex];
    const reward = Math.floor(career.salary * 12 * (1 + Math.random()));
    state.money += reward;
    state.stress = Math.min(100, state.stress + 8); // Stress of hideout thrill
    playSound('success');
    writeLog(`🤫 [${spotKorean}]에 비상금을 은닉하는 데 대성공했습니다! 추가 자금 ${formatKoreanMoney(reward)} 확보! (피로도 +8)`, "earn");
    showToast("비상금 은닉 성공!", "success");
  } else {
    // Failed!
    const loss = Math.floor(state.money * 0.15); // lose 15% of money
    state.money = Math.max(0, state.money - loss);
    state.harmony = Math.max(0, state.harmony - 20);
    playSound('fail');
    writeLog(`❌ 아내가 청소를 하다가 [${spotKorean}]을 들췄습니다! 비상금 ${formatKoreanMoney(loss)}을(를) 빼앗기고 한소리 들었습니다. (가정 평화도 -20)`, "danger");
    showToast("은닉 작전 실패!", "error");
  }

  renderUI();
}

// --- Main Engine Game Tick ---
let accumulator = 0;
const tickRate = 1000; // 1 second in ms

function gameTick() {
  const now = Date.now();
  const deltaTime = now - state.lastTickTime;
  state.lastTickTime = now;

  // 1. Process Passive Monthly Salary and Stress Accrual (Only if not burnt out)
  const career = CAREER_LEVELS[state.careerIndex];
  
  if (!state.isBurnout) {
    const harmonyMultiplier = getHarmonyMultiplier();
    const passiveSalaryEarned = Math.floor(career.salary * harmonyMultiplier);
    state.money += passiveSalaryEarned;

    // Passive Stress accrual
    let stressIncrease = career.stressRate;
    
    // Son affinity 80+ decreases stress
    if (state.kids.son.affinity >= 80) {
      stressIncrease -= 1.0;
    }

    state.stress = Math.min(100, Math.max(0, state.stress + stressIncrease));
    
    // If stress hits 100, trigger burnout
    if (state.stress >= 100) {
      state.isBurnout = true;
      playSound('fail');
      writeLog("🔋 스트레스 수치가 100%에 달해 '아빠의 번아웃'이 발생했습니다! 피로를 풀기 전까지 자산이 들어오지 않습니다.", "danger");
      showToast("번아웃 발생!", "error");
    }
  } else {
    // Burnout state: stress automatically recovers slowly or when resting, but salary is blocked
    // Passive recovery of burnout when resting
    if (state.stress <= 30) {
      state.isBurnout = false;
      writeLog("휴식 덕분에 번아웃에서 벗어났습니다. 다시 경제 활동을 개시합니다!", "system");
      showToast("번아웃 해제!", "success");
    }
  }

  // 2. Passive Family Harmony decrease (due to husband idle state/wife nagging)
  let harmonyDecrease = 1.0; // base decrease per tick
  
  // Earplug upgrade reduces harmony loss
  if (state.upgrades.earplug > 0) {
    const earplugBuff = UPGRADES_CONFIG.earplug.effect(state.upgrades.earplug);
    harmonyDecrease = harmonyDecrease * (1 - earplugBuff);
  }
  
  // Daughter affinity 80+ reduces harmony loss by 50%
  if (state.kids.daughter.affinity >= 80) {
    harmonyDecrease *= 0.5;
  }

  state.harmony = Math.min(100, Math.max(0, state.harmony - harmonyDecrease));

  // 3. Random Event Scheduler
  handleEventTick();

  // 4. Update kid character actions status randomly
  updateKidStatusses();

  // Save game state
  saveGame();

  // Refresh UI
  renderUI();
}

function updateKidStatusses() {
  const sonStatuses = ["수능 대비 1타 강사 교재 펴두고 조는 중", "스터디 카페 사물함에 간식 숨겨두는 중", "수시 원서 어디 쓸지 눈치싸움 중", "몰래 롤토체스 돌리는 중"];
  const daughterStatuses = ["다음 학기 수강 신청 대참사 복구 중", "대학 동기들과 잔디밭에서 배달 떡볶이 흡입 중", "대외활동 자소서 쓰는 척 인스타 켜는 중", "학생회실 구석에서 동기 뒷담 대화 중"];
  
  if (Math.random() < 0.15) {
    state.kids.son.status = sonStatuses[Math.floor(Math.random() * sonStatuses.length)];
  }
  if (Math.random() < 0.15) {
    state.kids.daughter.status = daughterStatuses[Math.floor(Math.random() * daughterStatuses.length)];
  }
}

// --- Smooth Progress Bar Animation Loop ---
let lastFrameTime = performance.now();

function animationLoop(timestamp) {
  const delta = (timestamp - lastFrameTime) / 1000; // seconds
  lastFrameTime = timestamp;

  // Tick active quests
  updateQuestsProgress(delta);

  requestAnimationFrame(animationLoop);
}

// --- Tab Controller ---
function initTabs() {
  const btnQuests = document.getElementById('tab-quests');
  const btnShop = document.getElementById('tab-shop');
  const panelQuests = document.getElementById('quests-panel');
  const panelShop = document.getElementById('shop-panel');

  if (btnQuests && btnShop && panelQuests && panelShop) {
    btnQuests.addEventListener('click', () => {
      playSound('click');
      btnQuests.classList.add('active');
      btnShop.classList.remove('active');
      panelQuests.classList.add('active');
      panelShop.classList.remove('active');
    });

    btnShop.addEventListener('click', () => {
      playSound('click');
      btnShop.classList.add('active');
      btnQuests.classList.remove('active');
      panelShop.classList.add('active');
      panelQuests.classList.remove('active');
    });
  }
}

// --- Audio Controls ---
function initAudioControls() {
  const btnSound = document.getElementById('btn-sound');
  if (btnSound) {
    btnSound.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        btnSound.innerText = "🔊";
        btnSound.classList.add('active');
        initAudio();
        playSound('click');
        showToast("효과음이 켜졌습니다.", "success");
      } else {
        btnSound.innerText = "🔇";
        btnSound.classList.remove('active');
        showToast("효과음이 꺼졌습니다.", "info");
      }
    });
  }
}

// --- Initialization Entry Point ---
window.addEventListener('DOMContentLoaded', () => {
  // Load Game
  loadGame();
  
  // Set last tick time to avoid huge offline leaps during boot
  state.lastTickTime = Date.now();

  // Initialize tabs & settings buttons
  initTabs();
  initAudioControls();
  initHideGame();

  const btnReset = document.getElementById('btn-reset');
  if (btnReset) {
    btnReset.addEventListener('click', resetGame);
  }

  // Bind manual give money buttons
  document.querySelectorAll('.btn-give-money').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const kid = e.currentTarget.getAttribute('data-kid');
      const amount = parseInt(e.currentTarget.getAttribute('data-amount'), 10);
      givePocketMoney(kid, amount);
    });
  });

  // Inject a special custom quest to open the hide money game directly inside the quest list
  QUESTS_CONFIG.push({
    id: "stealth_hide",
    name: "아내 몰래 비상금 숨기기 작전",
    desc: "들키면 벼락이 떨어지지만, 성공하면 쏠쏠한 아빠만의 비자금을 모읍니다.",
    duration: 0, // Instant modal trigger
    rewardMoney: 0,
    rewardHarmony: 0,
    rewardStress: 0,
    costMoney: 0,
    icon: "🤫"
  });

  // Re-bind to render quests
  renderQuests();

  // Bind custom handler for hide money button inside quests
  document.querySelector('.quest-list').addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-start-quest')) {
      const qid = e.target.getAttribute('data-quest');
      if (qid === 'stealth_hide') {
        playSound('click');
        openHideGameModal();
      }
    }
  });

  // Main UI update
  renderUI();

  // Start intervals
  setInterval(gameTick, tickRate);
  requestAnimationFrame(animationLoop);
});
