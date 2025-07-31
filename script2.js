const tableSelect = document.getElementById('tableSelect');
const questionBox = document.getElementById('questionBox');
const questionText = document.getElementById('questionText');
const choicesDiv = document.getElementById('choices');
const message = document.getElementById('message');
const successImage = document.getElementById('successImage');
const successSound = document.getElementById('successSound');

let currentNum2 = null;
let correctAnswer = null;
let wrongAttemptMade = false;

let stats = JSON.parse(localStorage.getItem('questionStats')) || {};

const successImages = [
  'brainrot images/ballerina cappuccina.png',
  'brainrot images/bambini crossini.png',
  'brainrot images/bluberini octopussini.png',
  'brainrot images/bobrito bandito.png',
  'brainrot images/bombardino crocodilo.png',
  'brainrot images/bombombini gusini.png',
  'brainrot images/brr brr patapim.webp',
  'brainrot images/brri brri bicus dicus.png',
  'brainrot images/burbaloni loliloni.png',
  'brainrot images/cactusgelataio gattoalbanese.png',
  'brainrot images/cappuccino assassino.jpg',
  'brainrot images/chimpanzini bananini.webp',
  'brainrot images/cocofanto elefanto.png',
  'brainrot images/crocodillo fromagioso.png',
  'brainrot images/ecco cavallo virtuoso.png',
  'brainrot images/frigo camello buffo fardello.png',
  'brainrot images/gattino babanino.png',
  'brainrot images/giraffa celeste.png',
  'brainrot images/graipussi medussi.png',
  'brainrot images/granade frulli frulli frullichino.png',
  'brainrot images/il cacto hipopotamo.png',
  'brainrot images/il sacro carbospaghetti mistico.png',
  'brainrot images/ketupat kepat brekupat kupat kepet kupot.png',
  'brainrot images/perochello lemonchello.png',
  'brainrot images/pippi poppa pippo peppe.png',
  'brainrot images/tigrulli grapefrutunni.png',
  'brainrot images/tralalero tralala.webp',
  'brainrot images/trenostruzzo turbo 3000.png',
  'brainrot images/trick track barabum.png',
  'brainrot images/trilalero tralalima.png',
  'brainrot images/tripi tropi tropa tripa.png',
  'brainrot images/trulimero trulichina.png',
  'brainrot images/tung tung tung sahur.webp',
  'brainrot images/uvanito pecorarito.png',
  'brainrot images/vulpegatto vulpegatto vulpegatto coco.png',
];

tableSelect.addEventListener('change', () => {
  currentNum2 = parseInt(tableSelect.value);
  if (currentNum2) {
    questionBox.classList.remove('hidden');
    generateQuestion();
  } else {
    questionBox.classList.add('hidden');
  }
});

function weightedRandomQuestion(table) {
  const questions = [];
  for (let i = 1; i <= 10; i++) {
    const key = `${i}x${table}`;
    const weight = (stats[key] || 0) + 1;
    questions.push({ num1: i, weight });
  }

  const totalWeight = questions.reduce((sum, q) => sum + q.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const q of questions) {
    if (rand < q.weight) return q.num1;
    rand -= q.weight;
  }

  return Math.floor(Math.random() * 10) + 1;
}

function recordMistake(num1, num2) {
  const key = `${num1}x${num2}`;
  if (!stats[key]) stats[key] = 0;
  stats[key]++;
  localStorage.setItem('questionStats', JSON.stringify(stats));
}

function generateQuestion() {
  message.textContent = '';
  choicesDiv.innerHTML = '';
  successImage.classList.add('hidden');
  wrongAttemptMade = false;

  const num1 = weightedRandomQuestion(currentNum2);
  correctAnswer = num1 * currentNum2;
  questionText.textContent = `Wat is ${num1} × ${currentNum2}?`;

  if (isInputMode) {
    const input = document.createElement('input');
    input.type = 'number';
    input.placeholder = 'Typ je antwoord...';
    input.className = 'styled-input';
    input.autofocus = true;

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const typedValue = parseInt(input.value);
        handleAnswer(input, typedValue, num1, currentNum2);
      }
    });

    choicesDiv.appendChild(input);
    input.focus();
  } else {
    const answers = new Set();
    answers.add(correctAnswer);
    while (answers.size < 3) {
      const wrong = currentNum2 * (Math.floor(Math.random() * 10) + 1);
      if (wrong !== correctAnswer) {
        answers.add(wrong);
      }
    }

    [...answers].sort(() => Math.random() - 0.5).forEach(answer => {
      const btn = document.createElement('div');
      btn.textContent = answer;
      btn.className = 'choice';
      btn.addEventListener('click', () => handleAnswer(btn, answer, num1, currentNum2));
      choicesDiv.appendChild(btn);
    });
  }
}

function handleAnswer(btn, selected, num1, num2) {
  if (selected === correctAnswer) {
    btn.classList.add('correct');
    message.textContent = '🎉 Goed gedaan!';
    disableAllChoices();

    if (!wrongAttemptMade) {
      showRandomSuccessImage();
    } else {
      setTimeout(() => {
        generateQuestion();
      }, 2000);
    }
  } else {
    btn.classList.add('wrong');
    message.textContent = '❌ Probeer het opnieuw!';
    btn.style.pointerEvents = 'none';
    wrongAttemptMade = true;
    recordMistake(num1, num2);
  }
}

function disableAllChoices() {
  document.querySelectorAll('.choice').forEach(choice => {
    choice.style.pointerEvents = 'none';
    if (parseInt(choice.textContent) === correctAnswer) {
      choice.classList.add('correct');
    }
  });
}

function showRandomSuccessImage() {
  const randomIndex = Math.floor(Math.random() * successImages.length);
  const imagePath = successImages[randomIndex];

  successImage.src = imagePath;
  successImage.classList.remove('hidden');
  document.getElementById('overlay').classList.remove('hidden');

  const fileName = imagePath.split('/').pop().replace(/\.(jpg|jpeg|png|webp)$/i, '');
  const soundPath = `sounds/${fileName}.mp3`;
  successSound.src = soundPath;
  successSound.play().catch(err => {
    console.warn(`Could not play sound: ${soundPath}`, err);
  });

  setTimeout(() => {
    successImage.classList.add('hidden');
    document.getElementById('overlay').classList.add('hidden');
    generateQuestion();
  }, 2000);
}

// Stats modal + chart
const showStatsBtn = document.getElementById('showStatsBtn');
const statsModal = document.getElementById('statsModal');
const closeStatsBtn = document.getElementById('closeStatsBtn');
const statsChartCanvas = document.getElementById('statsChart');

let statsChart = null;

showStatsBtn.addEventListener('click', () => {
  if (!currentNum2) {
    alert("Selecteer eerst een tafel.");
    return;
  }

  const currentTable = currentNum2;
  const localStats = JSON.parse(localStorage.getItem('questionStats')) || {};

  const labels = [];
  const data = [];

  for (let num1 = 1; num1 <= 10; num1++) {
    const key = `${num1}x${currentTable}`;
    labels.push(`${num1}×${currentTable}`);
    data.push(localStats[key] || 0);
  }

  if (statsChart) {
    statsChart.destroy();
  }

  statsChart = new Chart(statsChartCanvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: `Aantal fouten voor tafel ${currentTable}`,
        data,
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      }
    }
  });

  statsModal.classList.remove('hidden');
});

closeStatsBtn.addEventListener('click', () => {
  statsModal.classList.add('hidden');
});

function resetStats() {
  const password = prompt("Voer het wachtwoord in om de statistieken te resetten:");

  if (password === "Zombie") {
    localStorage.removeItem('questionStats');
    alert("Statistieken succesvol gereset!");
  } else if (password !== null) {
    alert("Onjuist wachtwoord. Reset geannuleerd.");
  }
}

const bgColorPicker = document.getElementById("bgColorPicker");

// Load saved background color on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedColor = localStorage.getItem("bgColor");
  if (savedColor) {
    document.body.style.backgroundColor = savedColor;
    bgColorPicker.value = savedColor;
  }
});

// Update background color when user selects a new one
bgColorPicker.addEventListener("input", (e) => {
  const color = e.target.value;
  document.body.style.backgroundColor = color;
  localStorage.setItem("bgColor", color);
});

const modeToggle = document.getElementById("modeToggle");
let isInputMode = true;

document.getElementById('modeToggle').addEventListener('change', function () {
  isInputMode = !this.checked; // ✅ Invert: checked = multiple choice
  generateQuestion(); // Regenerate question in new mode
});

