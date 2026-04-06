const gameState = {
  playerHp: 100,
  enemyHp: 100,
  hand: ["火", "水", "風", "土", "雷"],
};

function renderHp() {
  document.getElementById("player-hp").textContent = String(gameState.playerHp);
  document.getElementById("enemy-hp").textContent = String(gameState.enemyHp);
}

function renderHand() {
  const handArea = document.getElementById("hand-area");
  handArea.innerHTML = "";

  gameState.hand.forEach((element, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = `${element}\n#${index + 1}`;
    handArea.appendChild(card);
  });
}

function addLog(message) {
  const logArea = document.getElementById("log-area");
  const logItem = document.createElement("li");
  logItem.textContent = message;
  logArea.appendChild(logItem);
}

function initGame() {
  renderHp();
  renderHand();
  addLog("バトル準備完了。");
  addLog("先攻プレイヤーのターンです。");
}

window.addEventListener("DOMContentLoaded", initGame);
