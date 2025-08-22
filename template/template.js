// Load sounds globally (usable in all games)
let advanceSound = new Audio("../sounds/advance.mp3");
let incorrectSound = new Audio("../sounds/incorrect.mp3");
let demoteSound = new Audio("../sounds/demote.mp3");

// Unlock sounds on first user interaction
function unlockSounds() {
  [advanceSound, incorrectSound, demoteSound].forEach(sound => {
    sound.play().then(() => {
      sound.pause();
      sound.currentTime = 0;
    }).catch(() => {
      // ignore errors here, it’s just warming them up
    });
  });
  window.removeEventListener("click", unlockSounds);
}
window.addEventListener("click", unlockSounds);

// Small wrapper functions to play sounds
function playAdvanceSound() {
  advanceSound.currentTime = 0;
  advanceSound.play();
}

function playIncorrectSound() {
  incorrectSound.currentTime = 0;
  incorrectSound.play();
}

function playDemoteSound() {
  demoteSound.currentTime = 0;
  demoteSound.play();
}

// Load saved background color
window.addEventListener("DOMContentLoaded", () => {
  const savedColor = localStorage.getItem("bgColor");
  if (savedColor) {
    document.body.style.backgroundColor = savedColor;
    bgColorPicker.value = savedColor;
  }

  // Use <title> of page as the heading
  if (document.title) {
    gameTitle.textContent = document.title;
  }

  // Start progress at 0%
  setProgress(0);
});

// Update background color
bgColorPicker.addEventListener("input", (e) => {
  const color = e.target.value;
  document.body.style.backgroundColor = color;
  localStorage.setItem("bgColor", color);
});

// Function to update progress
function setProgress(percent) {
  if (percent < 0) percent = 0;
  if (percent > 100) percent = 100;
  progressBar.style.width = percent + "%";
}

// Function to update level
function setLevel(level) {
  levelDisplay.textContent = "Level " + level;
}

