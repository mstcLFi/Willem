const tableSelect = document.getElementById('tableSelect');
const questionBox = document.getElementById('questionBox');
const questionText = document.getElementById('questionText');
const choicesDiv = document.getElementById('choices');
const message = document.getElementById('message');
const successImage = document.getElementById('successImage');
const successSound = document.getElementById('successSound');

let currentNum2 = null;
let correctAnswer = null;

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

function generateQuestion() {
  message.textContent = '';
  choicesDiv.innerHTML = '';
  successImage.classList.add('hidden');

  const num1 = Math.floor(Math.random() * 10) + 1;
  correctAnswer = num1 * currentNum2;
  questionText.textContent = `Wat is ${num1} × ${currentNum2}?`;

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
    btn.addEventListener('click', () => handleAnswer(btn, answer));
    choicesDiv.appendChild(btn);
  });
}

function handleAnswer(btn, selected) {
  if (selected === correctAnswer) {
    btn.classList.add('correct');
    message.textContent = '🎉 Goed gedaan!';
    showRandomSuccessImage();
    disableAllChoices();

    setTimeout(() => {
      generateQuestion();
    }, 2000);
  } else {
    btn.classList.add('wrong');
    message.textContent = '❌ Probeer het opnieuw!';
    btn.style.pointerEvents = 'none';
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

  // Show image
  const successImage = document.getElementById('successImage');
  const overlay = document.getElementById('overlay');
  successImage.src = imagePath;
  successImage.classList.remove('hidden');
  overlay.classList.remove('hidden');

  // Derive sound path
  const fileName = imagePath.split('/').pop().replace(/\.(jpg|jpeg|png|webp)$/i, '');
  const soundPath = `sounds/${fileName}.mp3`;

  // Play sound
  const successSound = document.getElementById('successSound');
  successSound.src = soundPath;
  successSound.play().catch(err => {
    console.warn(`Could not play sound: ${soundPath}`, err);
  });

  // Hide after delay and move to next question
  setTimeout(() => {
    successImage.classList.add('hidden');
    overlay.classList.add('hidden');
    generateQuestion();
  }, 2000);
}


