const gameState = {
  playerHp: 100,
  hand: ["火", "水", "風", "土", "雷"],
};

function renderHp() {
  const hpElement = document.getElementById("player-hp");
  hpElement.textContent = String(gameState.playerHp);
}

function renderHand() {
  const handArea = document.getElementById("hand-area");
  handArea.innerHTML = "";

  gameState.hand.forEach((element) => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = `${element}カード`;
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
  addLog("ゲームを初期化しました。");
  addLog("手札を配りました。");
}

window.addEventListener("DOMContentLoaded", initGame);
