const CARD_POOL = ["fire", "water", "earth", "thunder", "wind"];
const CARD_LABEL = {
  fire: "火",
  water: "水",
  earth: "土",
  thunder: "雷",
  wind: "風",
};

const gameState = {
  playerHp: 20,
  enemyHp: 20,
  playerShield: 0,
  enemyShield: 0,
  enemySkipTurn: false,
  playerSkipTurn: false,
  hand: [],
  isBattleEnd: false,
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createRandomCard() {
  return {
    type: CARD_POOL[randomInt(0, CARD_POOL.length - 1)],
    value: randomInt(1, 4),
  };
}

function damageWithShield(target, amount) {
  const shieldKey = target === "enemy" ? "enemyShield" : "playerShield";
  const hpKey = target === "enemy" ? "enemyHp" : "playerHp";

  const blocked = Math.min(gameState[shieldKey], amount);
  gameState[shieldKey] -= blocked;

  const hpDamage = amount - blocked;
  gameState[hpKey] = Math.max(0, gameState[hpKey] - hpDamage);

  return { blocked, hpDamage };
}

function renderStatus() {
  document.getElementById("player-hp").textContent = String(gameState.playerHp);
  document.getElementById("enemy-hp").textContent = String(gameState.enemyHp);
  document.getElementById("player-shield").textContent = `シールド: ${gameState.playerShield}`;
  document.getElementById("enemy-shield").textContent = `シールド: ${gameState.enemyShield}`;
}

function addLog(message) {
  const logArea = document.getElementById("log-area");
  const logItem = document.createElement("li");
  logItem.textContent = message;
  logArea.prepend(logItem);
}

function renderHand() {
  const handArea = document.getElementById("hand-area");
  handArea.innerHTML = "";

  gameState.hand.forEach((cardData, index) => {
    const cardButton = document.createElement("button");
    cardButton.className = `card card-${cardData.type}`;
    cardButton.type = "button";
    cardButton.innerHTML = `<span>${CARD_LABEL[cardData.type]}</span><strong>${cardData.value}</strong>`;
    cardButton.addEventListener("click", () => handlePlayerCard(index));
    handArea.appendChild(cardButton);
  });
}

function processCardEffect(cardData, actor) {
  const isPlayer = actor === "player";
  const subject = isPlayer ? "プレイヤー" : "相手";

  if (cardData.type === "fire" || cardData.type === "thunder") {
    const target = isPlayer ? "enemy" : "player";
    const { blocked, hpDamage } = damageWithShield(target, cardData.value);

    addLog(
      `${CARD_LABEL[cardData.type]}${cardData.value} → ${isPlayer ? "相手" : "プレイヤー"}に${cardData.value}ダメージ` +
        (blocked > 0 ? `（シールド${blocked}吸収 / HP-${hpDamage}）` : ``),
    );
    return;
  }

  if (cardData.type === "water") {
    const hpKey = isPlayer ? "playerHp" : "enemyHp";
    gameState[hpKey] = Math.min(20, gameState[hpKey] + cardData.value);
    addLog(`${CARD_LABEL.water}${cardData.value} → ${subject}のHP+${cardData.value}`);
    return;
  }

  if (cardData.type === "earth") {
    const shieldKey = isPlayer ? "playerShield" : "enemyShield";
    gameState[shieldKey] += cardData.value;
    addLog(`${CARD_LABEL.earth}${cardData.value} → ${subject}シールド+${cardData.value}`);
    return;
  }

  if (isPlayer) {
    gameState.enemySkipTurn = true;
  } else {
    gameState.playerSkipTurn = true;
  }
  addLog(`${CARD_LABEL.wind}${cardData.value} → ${isPlayer ? "相手" : "プレイヤー"}の次ターンスキップ`);
}

function checkBattleEnd() {
  if (gameState.enemyHp <= 0) {
    gameState.isBattleEnd = true;
    addLog("勝利！相手を倒しました。");
    return true;
  }
  if (gameState.playerHp <= 0) {
    gameState.isBattleEnd = true;
    addLog("敗北…プレイヤーHPが0になりました。");
    return true;
  }
  return false;
}

function enemyTurn() {
  if (gameState.isBattleEnd) {
    return;
  }

  if (gameState.enemySkipTurn) {
    addLog("風の効果で相手ターンをスキップ！");
    gameState.enemySkipTurn = false;
    return;
  }

  const enemyCard = createRandomCard();
  processCardEffect(enemyCard, "enemy");
  checkBattleEnd();
}

function handlePlayerCard(index) {
  if (gameState.isBattleEnd) {
    return;
  }

  if (gameState.playerSkipTurn) {
    gameState.playerSkipTurn = false;
    addLog("風の効果でプレイヤーターンをスキップ！");
    enemyTurn();
    renderStatus();
    renderHand();
    return;
  }

  const [selected] = gameState.hand.splice(index, 1);
  processCardEffect(selected, "player");

  gameState.hand.push(createRandomCard());

  if (!checkBattleEnd()) {
    enemyTurn();
  }

  renderStatus();
  renderHand();
}

function initGame() {
  gameState.hand = Array.from({ length: 5 }, () => createRandomCard());
  renderStatus();
  renderHand();
  addLog("バトル開始！カードを1枚タップしてください。");
}

window.addEventListener("DOMContentLoaded", initGame);
