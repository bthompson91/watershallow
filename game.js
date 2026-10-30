"use strict";

const SAVE_KEY = "kings-of-watershallow-save-v1";
const ROUNDS = 8;

const RESOURCE_ICONS = {
  coin: "©",
  supplies: "[]",
  relics: "(*)",
  followers: "^^",
  influence: "**"
};

const LOCATIONS = [
  { id: "harbor", name: "Old Harbor", art: "~^~^~^~", action: { coin: 2 }, agents: 2 },
  { id: "market", name: "Salt Market", art: "[=|=]=", action: { supplies: 2 }, agents: 2 },
  { id: "vault", name: "Relic Vault", art: "(*)_", action: { relics: 1 }, agents: 1 },
  { id: "tavern", name: "Gull & Anchor", art: "/\\_/\\", action: { followers: 2 }, agents: 2 },
  { id: "quay", name: "North Quay", art: "==[]==", action: { coin: 1, supplies: 1 }, agents: 1 },
  { id: "workshop", name: "Tinker Workshop", art: "<|>|", action: { build: true }, agents: 1 },
  { id: "council", name: "Tide Council", art: "/===\\", action: { influence: 2, drawIntrigue: true }, agents: 1 }
];

const BUILDINGS = [
  { id: "warehouse", name: "Warehouse", cost: { coin: 4 }, effect: "At round end, gain 1 supply.", endRound: { supplies: 1 }, vp: 4 },
  { id: "countinghouse", name: "Counting House", cost: { coin: 6 }, effect: "At round end, gain 2 coin.", endRound: { coin: 2 }, vp: 6 },
  { id: "observatory", name: "Observatory", cost: { coin: 5, relics: 1 }, effect: "At round end, gain 1 influence.", endRound: { influence: 1 }, vp: 7 },
  { id: "garrison", name: "Garrison", cost: { coin: 5, supplies: 2 }, effect: "At round end, gain 1 follower.", endRound: { followers: 1 }, vp: 6 },
  { id: "lighthouse", name: "Lighthouse", cost: { coin: 8 }, effect: "You have one extra agent.", extraAgent: true, vp: 8 }
];

const INTRIGUE = [
  { id: "bribe", name: "Harbour Bribe", text: "Gain 3 coin.", play: p => gain(p, { coin: 3 }) },
  { id: "requisition", name: "Requisition", text: "Gain 2 supplies.", play: p => gain(p, { supplies: 2 }) },
  { id: "rumor", name: "Dockside Rumor", text: "Gain 2 influence.", play: p => gain(p, { influence: 2 }) },
  { id: "recruit", name: "Recruitment Drive", text: "Gain 2 followers.", play: p => gain(p, { followers: 2 }) },
  { id: "salvage", name: "Salvage Rights", text: "Gain 1 relic and 1 coin.", play: p => gain(p, { relics: 1, coin: 1 }) }
];

const QUEST_TEMPLATES = [
  { name: "Repair the Sea Wall", cost: { supplies: 3 }, reward: { coin: 2 }, vp: 5 },
  { name: "Fund a Lantern Ship", cost: { coin: 5 }, reward: { followers: 1 }, vp: 6 },
  { name: "Recover a Sunken Idol", cost: { relics: 2 }, reward: { influence: 2 }, vp: 8 },
  { name: "Feed the Outer Isles", cost: { supplies: 2, coin: 2 }, reward: { relics: 1 }, vp: 7 },
  { name: "Recruit the Tideguard", cost: { followers: 4 }, reward: { coin: 3 }, vp: 8 },
  { name: "Map the Shallows", cost: { coin: 3, supplies: 2 }, reward: { influence: 1 }, vp: 7 },
  { name: "Restore the Ancient Pier", cost: { supplies: 4, followers: 2 }, reward: { relics: 1 }, vp: 10 },
  { name: "Commission a Tide Engine", cost: { coin: 6, relics: 1 }, reward: { followers: 2 }, vp: 11 }
];

function emptyResources() {
  return { coin: 0, supplies: 0, relics: 0, followers: 0, influence: 0 };
}

function gain(player, resources) {
  for (const [key, value] of Object.entries(resources)) player.resources[key] += value;
}

function canAfford(player, cost) {
  return Object.entries(cost).every(([key, value]) => player.resources[key] >= value);
}

function pay(player, cost) {
  for (const [key, value] of Object.entries(cost)) player.resources[key] -= value;
}

function resourceText(resources) {
  return Object.entries(resources)
    .filter(([, value]) => value)
    .map(([key, value]) => `${value} ${RESOURCE_ICONS[key]} ${key}`)
    .join(", ") || "nothing";
}

let state = null;

function newGame(playerName, aiCount) {
  const names = [playerName || "Captain", "Bosun Mira", "Quartermaster Vane", "Harbourmaster Reed"];
  const players = [];
  for (let i = 0; i <= Number(aiCount); i++) {
    players.push({
      id: i,
      name: names[i],
      ai: i > 0,
      resources: emptyResources(),
      agents: 3,
      agentsUsed: 0,
      buildings: [],
      intrigue: [],
      completedQuests: 0,
      score: 0
    });
  }
  players[0].resources = { coin: 4, supplies: 2, relics: 0, followers: 1, influence: 0 };
  players.slice(1).forEach(p => p.resources = { coin: 3, supplies: 2, relics: 0, followers: 1, influence: 0 });

  state = {
    round: 1,
    turn: 0,
    phase: "place",
    players,
    locations: LOCATIONS.map(location => ({ ...location, occupied: [] })),
    buildings: [...BUILDINGS],
    quests: drawQuests(4),
    intrigueDeck: shuffle(INTRIGUE.map(card => card.id)),
    log: []
  };
  players.forEach(p => {
    for (let i = 0; i < 2; i++) p.intrigue.push(state.intrigueDeck.pop());
  });
  logMessage(`The voyage begins. Round 1: ${players[0].name} acts.`);
  saveGame();
  render();
}

function drawQuests(count) {
  const deck = shuffle([...QUEST_TEMPLATES]);
  return deck.slice(0, count).map((quest, index) => ({ ...quest, id: `q${index}` }));
}

function shuffle(items) {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function currentPlayer() {
  return state.players[state.turn];
}

function logMessage(message) {
  state.log.unshift(`R${state.round}: ${message}`);
  state.log = state.log.slice(0, 100);
}

function placeAgent(locationId) {
  const player = currentPlayer();
  const location = state.locations.find(item => item.id === locationId);
  if (!location || location.occupied.length >= location.agents || player.agentsUsed >= player.agents) return;

  location.occupied.push(player.id);
  player.agentsUsed++;
  applyLocation(player, location);
  logMessage(`${player.name} sent an agent to ${location.name}.`);
  advanceTurn();
}

function applyLocation(player, location) {
  const action = location.action;
  if (action.build) {
    render();
    return;
  }
  gain(player, action);
  if (action.drawIntrigue && state.intrigueDeck.length) {
    player.intrigue.push(state.intrigueDeck.pop());
  }
}

function buildBuilding(buildingId) {
  const player = currentPlayer();
  const building = state.buildings.find(item => item.id === buildingId);
  if (!building || !canAfford(player, building.cost)) return;
  pay(player, building.cost);
  player.buildings.push(building.id);
  state.buildings = state.buildings.filter(item => item.id !== buildingId);
  if (building.extraAgent) player.agents++;
  player.score += building.vp;
  logMessage(`${player.name} built the ${building.name} for ${resourceText(building.cost)}.`);
  advanceTurn();
}

function completeQuest(questId) {
  const player = currentPlayer();
  const quest = state.quests.find(item => item.id === questId);
  if (!quest || !canAfford(player, quest.cost)) return;
  pay(player, quest.cost);
  gain(player, quest.reward);
  player.score += quest.vp;
  player.completedQuests++;
  state.quests = state.quests.filter(item => item.id !== questId);
  state.quests.push(...drawQuests(1));
  logMessage(`${player.name} completed “${quest.name}” for ${quest.vp} influence.`);
  advanceTurn();
}

function playIntrigue(cardId) {
  const player = currentPlayer();
  const index = player.intrigue.indexOf(cardId);
  const card = INTRIGUE.find(item => item.id === cardId);
  if (index === -1 || !card) return;
  player.intrigue.splice(index, 1);
  card.play(player);
  logMessage(`${player.name} played ${card.name}: ${card.text}`);
  render();
}

function advanceTurn() {
  const activePlayers = state.players.filter(player => player.agentsUsed < player.agents);
  if (!activePlayers.length) {
    endRound();
    return;
  }
  do {
    state.turn = (state.turn + 1) % state.players.length;
  } while (currentPlayer().agentsUsed >= currentPlayer().agents);

  if (currentPlayer().ai) {
    setTimeout(aiTurn, 450);
  }
  saveGame();
  render();
}

function endRound() {
  state.players.forEach(player => {
    player.buildings.forEach(id => {
      const building = BUILDINGS.find(item => item.id === id);
      if (building?.endRound) gain(player, building.endRound);
    });
    player.agentsUsed = 0;
  });
  state.locations.forEach(location => location.occupied = []);

  if (state.round >= ROUNDS) {
    finishGame();
    return;
  }
  state.round++;
  state.turn = 0;
  logMessage(`Round ${state.round} begins.`);
  saveGame();
  render();
}

function aiTurn() {
  const player = currentPlayer();
  const affordableQuest = state.quests.find(quest => canAfford(player, quest.cost));
  if (affordableQuest) {
    completeQuest(affordableQuest.id);
    return;
  }

  const openLocations = state.locations.filter(location => location.occupied.length < location.agents);
  if (!openLocations.length) {
    advanceTurn();
    return;
  }

  const preference = openLocations.find(location => {
    if (player.resources.coin < 3) return location.action.coin;
    if (player.resources.supplies < 2) return location.action.supplies;
    if (player.resources.relics < 1) return location.action.relics;
    return location.action.followers || location.action.influence;
  }) || openLocations[Math.floor(Math.random() * openLocations.length)];

  placeAgent(preference.id);
}

function finishGame() {
  state.players.forEach(player => {
    player.score += player.resources.influence;
    player.score += Math.floor(player.resources.coin / 2);
    player.score += player.completedQuests * 2;
  });
  state.phase = "over";
  localStorage.removeItem(SAVE_KEY);
  render();
}

function saveGame() {
  if (state && state.phase === "play") localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;
  try {
    state = JSON.parse(raw);
    render();
    return true;
  } catch {
    localStorage.removeItem(SAVE_KEY);
    return false;
  }
}

function render() {
  document.getElementById("setup").classList.toggle("hidden", !!state);
  document.getElementById("game").classList.toggle("hidden", !state || state.phase !== "play");
  document.getElementById("game-over").classList.toggle("hidden", !state || state.phase !== "over");
  document.getElementById("continue-game").classList.toggle("hidden", !localStorage.getItem(SAVE_KEY));
  if (!state) return;

  if (state.phase === "over") {
    const ranked = [...state.players].sort((a, b) => b.score - a.score);
    document.getElementById("final-scores").innerHTML = ranked.map((player, index) =>
      `<div class="player-row ${index === 0 ? "current" : ""}">${index + 1}. ${player.name} — ${player.score} influence</div>`
    ).join("");
    return;
  }

  const player = currentPlayer();
  document.getElementById("status-bar").innerHTML = `
    <strong>Round ${state.round}/${ROUNDS}</strong> — <span class="current">${player.name}</span>
    ${player.ai ? "(AI)" : ""} — Agents: ${player.agents - player.agentsUsed}/${player.agents}
  `;

  document.getElementById("locations").innerHTML = state.locations.map(location => {
    const open = location.occupied.length < location.agents;
    const usable = open && player.agentsUsed < player.agents && !player.ai;
    return `
      <div class="location ${open ? "available" : "taken"}">
        <strong>${location.name}</strong> <span class="small">(${location.occupied.length}/${location.agents})</span>
        <pre>${location.art}</pre>
        <div class="reward">Gives: ${location.action.build ? "Build a structure" : resourceText(location.action)}${location.action.drawIntrigue ? " + Order" : ""}</div>
        <div>${location.occupied.map(id => `<span class="agent-chip">${state.players[id].name}</span>`).join("")}</div>
        <button data-location="${location.id}" ${usable ? "" : "disabled"}>Place agent</button>
      </div>`;
  }).join("");

  document.getElementById("player-area").innerHTML = `
    <div class="player-row current">${player.name}</div>
    <div>${resourceText(player.resources)}</div>
    <div class="small">Buildings: ${player.buildings.map(id => BUILDINGS.find(b => b.id === id).name).join(", ") || "none"}</div>
    <div class="small">Score: ${player.score}</div>
    ${state.buildings.map(building => `
      <div class="building">
        <strong>${building.name}</strong> — <span class="cost">${resourceText(building.cost)}</span><br>
        <span class="small">${building.effect} • ${building.vp} VP</span><br>
        <button data-build="${building.id}" ${canAfford(player, building.cost) && !player.ai ? "" : "disabled"}>Build</button>
      </div>`).join("")}
  `;

  document.getElementById("quests").innerHTML = state.quests.map(quest => `
    <div class="quest">
      <strong>${quest.name}</strong><br>
      <span class="cost">Cost: ${resourceText(quest.cost)}</span><br>
      <span class="reward">Reward: ${resourceText(quest.reward)} • ${quest.vp} influence</span><br>
      <button data-quest="${quest.id}" ${canAfford(player, quest.cost) && !player.ai ? "" : "disabled"}>Complete</button>
    </div>`).join("");

  document.getElementById("intrigue").innerHTML = player.intrigue.map(id => {
    const card = INTRIGUE.find(item => item.id === id);
    return `<div class="intrigue"><strong>${card.name}</strong><br><span class="small">${card.text}</span><br><button data-intrigue="${card.id}" ${player.ai ? "disabled" : ""}>Play</button></div>`;
  }).join("") || '<p class="small">No orders in hand.</p>';

  document.getElementById("log").innerHTML = state.log.map(entry => `<div>${entry}</div>`).join("");
}

document.addEventListener("click", event => {
  const target = event.target;
  if (target.dataset.location) placeAgent(target.dataset.location);
  if (target.dataset.build) buildBuilding(target.dataset.build);
  if (target.dataset.quest) completeQuest(target.dataset.quest);
  if (target.dataset.intrigue) playIntrigue(target.dataset.intrigue);
});

document.getElementById("start-game").addEventListener("click", () => {
  newGame(document.getElementById("player-name").value, document.getElementById("ai-count").value);
});

document.getElementById("continue-game").addEventListener("click", loadGame);
document.getElementById("save-game").addEventListener("click", () => {
  saveGame();
  alert("Voyage saved.");
});
document.getElementById("new-game").addEventListener("click", () => {
  if (confirm("Abandon this voyage and return to setup?")) {
    localStorage.removeItem(SAVE_KEY);
    state = null;
    render();
  }
});
document.getElementById("play-again").addEventListener("click", () => {
  state = null;
  render();
});

render();
