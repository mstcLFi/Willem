let num1, num2;
let score = 0;
let timer;
let timeLeft = 180;
let gameRunning = false;

let highscore = parseInt(localStorage.getItem('highscore')) || 0;
let highscorer = localStorage.getItem('highscorer') || 'niemand';

const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const highscoreEl = document.getElementById('highscore');
const highscorerEl = document.getElementById('highscorer');
const submitBtn = document.getElementById('submit');
const timerEl = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const resetHighscoreBtn = document.getElementById('resetHighscoreBtn');
const afbeeldingEl = document.getElementById('afbeelding');
const tafelCheckboxesContainer = document.getElementById('tafelCheckboxes');

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
  "minecraft images/10.png"
];

for (let i = 0; i <= 10; i++) {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'tafel' + i;
  checkbox.value = i;

  const label = document.createElement('label');
  label.htmlFor = checkbox.id;
  label.textContent = i;

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
  scoreEl.textContent = score;
  highscoreEl.textContent = highscore;
  highscorerEl.textContent = highscorer;
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

  // Update image on new question as before
  const randomAfbeelding = afbeeldingen[Math.floor(Math.random() * afbeeldingen.length)];
  afbeeldingEl.src = randomAfbeelding;
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

function controleerAntwoord() {
  if (!gameRunning) return;

  const antwoord = parseInt(answerEl.value);
  const juist = num1 * num2;

  if (antwoord === juist) {
    score++;
    feedbackEl.textContent = '✅ Goed zo!';
    feedbackEl.style.color = 'green';
    correctSound.currentTime = 0;
    correctSound.play();
    updateScoreboard();
    nieuweVraag();
  } else {
    feedbackEl.textContent = `❌ Fout! Het juiste antwoord is ${juist}.`;
    feedbackEl.style.color = 'red';
    wrongSound.currentTime = 0;
    wrongSound.play();
    gameRunning = false;
    answerEl.disabled = true;
    submitBtn.disabled = true;

    const wasHighscore = score > highscore;

    setTimeout(() => {
      if (wasHighscore) {
        const naam = prompt("🎉 Nieuwe highscore! Wat is je naam?");
        if (naam) {
          highscore = score;
          highscorer = naam;
          localStorage.setItem('highscore', highscore);
          localStorage.setItem('highscorer', highscorer);
        }
      }
      startBtn.disabled = false;
      updateScoreboard();
      questionEl.textContent = "Klik op 'Start spel' om opnieuw te beginnen.";
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

    if (score > highscore) {
      const naam = prompt("🎉 Nieuwe highscore! Wat is je naam?");
      if (naam) {
        highscore = score;
        highscorer = naam;
        localStorage.setItem('highscore', highscore);
        localStorage.setItem('highscorer', highscorer);
      }
    }

    updateScoreboard();
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
  correctSound.play().then(() => correctSound.pause());
  wrongSound.play().then(() => wrongSound.pause());
  resetSpel();
});

resetHighscoreBtn.addEventListener('click', () => {
  if (confirm("Weet je zeker dat je de highscore wilt wissen?")) {
    localStorage.removeItem('highscore');
    localStorage.removeItem('highscorer');
    highscore = 0;
    highscorer = 'niemand';
    updateScoreboard();
  }
});

// Show a random image right after loading the script
showRandomImage();

updateScoreboard();
