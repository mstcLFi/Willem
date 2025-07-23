import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, set, onValue, get } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "",
  authDomain: "willem-626ef.firebaseapp.com",
  projectId: "willem-626ef",
  storageBucket: "willem-626ef.firebasestorage.app",
  messagingSenderId: "849432090624",
  appId: "1:849432090624:web:1fa4f458e25313d7f0e0e5",
  measurementId: "G-VHRSJC5ZDK",
  databaseURL: "https://willem-626ef-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const highscoreRef = ref(db, 'highscore');

let num1, num2;
let score = 0;
let timer;
let timeLeft = 180;
let gameRunning = false;
let spelerNaam = '';

let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

const pointsPerTable = {
  0: 0.1,
  1: 0.1,
  2: 0.2,
  3: 1.0,
  4: 0.9,
  5: 0.3,
  6: 1.5,
  7: 2.0,
  8: 1.8,
  9: 1.3,
  10: 0.2
};

const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const highscoreEl = document.getElementById('highscore');
const highscorerEl = document.getElementById('highscorer');
const spelerNaamEl = document.getElementById('spelerNaam');
const submitBtn = document.getElementById('submit');
const timerEl = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const resetHighscoreBtn = document.getElementById('resetHighscoreBtn');
const afbeeldingEl = document.getElementById('afbeelding');
const tafelCheckboxesContainer = document.getElementById('tafelCheckboxes');
const leaderboardList = document.getElementById('leaderboardList');

const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');

const afbeeldingen = [
  "minecraft images/1.png",
  "minecraft images/2.png",
  "minecraft images/3.png",
  "minecraft images/4.jpg",
  "minecraft images/5.png",
  "minecraft images/6.png",
  "minecraft images/7.png",
  "minecraft images/8.png",
  "minecraft images/9.png",
  "minecraft images/10.png",
  "minecraft images/11.png",
  "minecraft images/12.png",
  "minecraft images/13.jpg",
  "minecraft images/14.png",
  "minecraft images/15.png",
  "minecraft images/16.png",
  "minecraft images/17.png",
  "minecraft images/18.jpg"
];

for (let i = 0; i <= 10; i++) {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'tafel' + i;
  checkbox.value = i;

  const label = document.createElement('label');
  label.htmlFor = checkbox.id;
  label.textContent = i;

  // Add a tooltip with the score
  const score = pointsPerTable[i] ?? 0;
  label.title = `+${score.toFixed(1)} punt(en)`;

  tafelCheckboxesContainer.appendChild(checkbox);
  tafelCheckboxesContainer.appendChild(label);
}


function getSelectedTafels() {
  const selected = [];
  for (let i = 0; i <= 10; i++) {
    const cb = document.getElementById('tafel' + i);
    if (cb.checked) selected.push(i);
  }
  return selected;
}

function updateScoreboard() {
  scoreEl.textContent = score.toFixed(1);
  spelerNaamEl.textContent = spelerNaam || '-';

  onValue(highscoreRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      highscoreEl.textContent = data.score.toFixed(1);
      highscorerEl.textContent = data.name;
    } else {
      highscoreEl.textContent = '0.0';
      highscorerEl.textContent = 'niemand';
    }
  });

  renderLeaderboard();
}

function renderLeaderboard() {
  leaderboardList.innerHTML = '';
  leaderboard.slice(0, 5).forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${entry.name}: ${entry.score.toFixed(1)}`;
    leaderboardList.appendChild(li);
  });
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

function showRandomImage() {
  const randomAfbeelding = afbeeldingen[Math.floor(Math.random() * afbeeldingen.length)];
  afbeeldingEl.src = randomAfbeelding;
}

function nieuweVraag() {
  if (!gameRunning) return;
  const selectedTafels = getSelectedTafels();
  if (selectedTafels.length === 0) {
    alert("Selecteer minstens één tafel om mee te oefenen.");
    return;
  }
  num1 = Math.floor(Math.random() * 10) + 1;
  num2 = selectedTafels[Math.floor(Math.random() * selectedTafels.length)];
  questionEl.textContent = `Wat is ${num1} × ${num2}?`;
  answerEl.value = '';
  feedbackEl.textContent = '';
  answerEl.focus();

  showRandomImage();
}

function resetSpel() {
  clearInterval(timer);
  timeLeft = 180;
  score = 0;
  gameRunning = true;
  answerEl.disabled = false;
  submitBtn.disabled = false;
  startBtn.disabled = true;
  updateScoreboard();
  timerEl.textContent = `⏳ Tijd over: ${formatTime(timeLeft)}`;
  timer = setInterval(updateTimer, 1000);
  nieuweVraag();
}

function checkLeaderboard() {
  leaderboard.push({ name: spelerNaam || 'Gast', score });
  leaderboard.sort((a, b) => b.score - a.score);
  // Check if new top score beats Firebase highscore
  const topScore = leaderboard[0];
  get(highscoreRef).then(snapshot => {
    const current = snapshot.val();
    if (!current || topScore.score > current.score) {
      set(highscoreRef, {
        name: topScore.name,
        score: topScore.score
      });
    }
  });
  leaderboard = leaderboard.slice(0, 5);
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function controleerAntwoord() {
  if (!gameRunning) return;

  const antwoord = parseInt(answerEl.value);
  const juist = num1 * num2;

  if (antwoord === juist) {
    const earned = pointsPerTable[num2] || 0;
    score += earned;
    feedbackEl.textContent = `✅ Goed zo! +${earned} punt(en)`;
    feedbackEl.style.color = 'green';
    correctSound.currentTime = 0;
    correctSound.play();
    updateScoreboard();
    nieuweVraag();
  } else {
    // Freeze the timer
    clearInterval(timer);

    feedbackEl.textContent = `❌ Fout! Het juiste antwoord op ${num1} × ${num2} is ${juist}.`;
    feedbackEl.style.color = 'red';
    wrongSound.currentTime = 0;
    wrongSound.play();
    gameRunning = false;
    answerEl.disabled = true;
    submitBtn.disabled = true;

    checkLeaderboard();

    setTimeout(() => {
      startBtn.disabled = false;
      questionEl.textContent = "Klik op 'Start spel' om opnieuw te beginnen.";
      updateScoreboard();
    }, 1000);
  }
}


function updateTimer() {
  if (timeLeft <= 0) {
    clearInterval(timer);
    gameRunning = false;
    timerEl.textContent = "⏳ Tijd is om!";
    questionEl.textContent = "⏹️ Spel afgelopen!";
    answerEl.disabled = true;
    submitBtn.disabled = true;
    startBtn.disabled = false;

    wrongSound.currentTime = 0;
    wrongSound.play().finally(() => {
      checkLeaderboard();
      updateScoreboard();
    });

    return;
  }

  timeLeft--;
  timerEl.textContent = `⏳ Tijd over: ${formatTime(timeLeft)}`;
}

answerEl.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    controleerAntwoord();
  }
});

submitBtn.addEventListener('click', controleerAntwoord);

startBtn.addEventListener('click', () => {
  spelerNaam = prompt("Wat is je naam?");
  if (!spelerNaam) spelerNaam = 'Gast';

  correctSound.play().then(() => correctSound.pause());
  wrongSound.play().then(() => wrongSound.pause());
  resetSpel();
});

resetHighscoreBtn.addEventListener('click', () => {
  const input = prompt("Voer het wachtwoord in om de highscores te wissen:");
  if (input === "Zombie") {
    if (confirm("Weet je zeker dat je de highscore wilt wissen?")) {
      localStorage.removeItem('leaderboard');
      leaderboard = [];
      updateScoreboard();
      alert("Highscores zijn gewist.");
    }
  } else if (input !== null) {
    alert("❌ Wachtwoord onjuist. De highscores blijven behouden.");
  }
});

// Add reset logic when any tafel checkbox is toggled during a running game
for (let i = 0; i <= 10; i++) {
  const checkbox = document.getElementById('tafel' + i);
  checkbox.addEventListener('change', () => {
    if (gameRunning) {
      // Reset score and timeLeft
      score = 0;
      timeLeft = 180;

      // Update UI elements
      updateScoreboard();
      timerEl.textContent = `⏳ Tijd over: ${formatTime(timeLeft)}`;

      // Optionally reset the timer interval so it restarts at 180 seconds
      clearInterval(timer);
      timer = setInterval(updateTimer, 1000);

      // Also generate a new question immediately
      nieuweVraag();
    }
  });
}

showRandomImage();
updateScoreboard();
