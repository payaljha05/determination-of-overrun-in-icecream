// =============================
// JS for Ice Cream Overrun Experiment with Step-by-Step Translate, Animation & Speech
// =============================

const cupEmpty = document.getElementById("cup-empty");
const cupFilled = document.getElementById("cup-filled");
const cupFrozen = document.getElementById("cup-frozen");
const mixBowl = document.getElementById("mix-bowl");
const spatula = document.getElementById("spatula");
const freezer = document.getElementById("freezer");
const freezerImg = document.getElementById("freezer-img");
const scaleDisplay = document.getElementById("scale-display");
const powerBtn = document.getElementById("power-btn");
const tareBtn = document.getElementById("tare-btn");
const instructionBox = document.getElementById("instruction-box");
const resultBox = document.getElementById("result-box");

let step = 1;
let isOn = false;
let isTare = false;
let freezing = false;
let weightA = 20;
let weightMix = 100;
let weightFrozen = 70;
let spatulaCount = 0;

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function speak(text) {
  const msg = new SpeechSynthesisUtterance();
  msg.text = text;
  msg.rate = 1;
  speechSynthesis.speak(msg);
}

function stepInstruction(step) {
  const instructions = {
    1: "Click ON button to power the weighing machine.",
    2: "Click empty bowl to place on weighing machine.",
    3: "Click TARE button to zero the scale.",
    4: "Click spatula to transfer mix into cup three times.",
    5: "Click freezer to open the door.",
    6: "Click filled cup to place inside freezer.",
    7: "Freezing in progress. Click freezer to close the door.",
    8: "Freezing complete. Click freezer to open the door.",
    9: "Click frozen bowl to place it on weighing machine.",
    10: "Weigh the frozen mix.",
    11: "Overrun calculated."
  };

  instructionBox.innerText = instructions[step] || "";
  speak(instructions[step] || "");
}

// === EVENT LISTENERS ===

powerBtn.addEventListener("click", () => {
  if (step !== 1) return;
  isOn = true;
  scaleDisplay.innerText = "0.00";
  step = 2;
  stepInstruction(step);
});

tareBtn.addEventListener("click", () => {
  if (!isOn || step !== 3) return;
  isTare = true;
  scaleDisplay.innerText = "0.00";
  step = 4;
  stepInstruction(step);
});

cupEmpty.addEventListener("click", async () => {
  if (step !== 2) return;
  cupEmpty.style.transform = "translate(43vw, -15vh)";
  await delay(1000);
  scaleDisplay.innerText = `${weightA}`;
  step = 3;
  stepInstruction(step);
});

spatula.addEventListener("click", async () => {
  if (step !== 4) return;

  spatula.style.transform = "translate(-8vw, -8vh)";
  await delay(800);

  for (let i = 1; i <= 3; i++) {
    spatula.style.transform = "translate(18vw, -20vh)";
    await delay(1000);

    if (i === 1) {
      cupEmpty.querySelector("img").src = "images/mix_bowl1.png";
    } else if (i === 2) {
      cupEmpty.querySelector("img").src = "images/mix_bowl2.png";
    } else {
      cupEmpty.querySelector("img").src = "images/bowl_mix.png";
      mixBowl.querySelector("img").src = "images/mix_bowl2.png";
    }

    spatula.style.transform = "translate(-8vw, -8vh)";
    await delay(1000);
  }

  spatula.style.transform = "translate(2vw, 0vh)";
  await delay(1000);

  step = 5;
  stepInstruction(step);
});

freezer.addEventListener("click", async () => {
  if (step === 5) {
    freezerImg.src = "images/freezer_open.png";
    step = 6;
    stepInstruction(step);
  } else if (step === 7) {
    freezerImg.src = "images/freezer_closed.png";
    startFreezingCountdown(20);
    step = 8;
  } else if (step === 8) {
    freezerImg.src = "images/freezer_open.png";
    cupFrozen.style.display = "block";
    cupFrozen.style.transform = "translate(10vw, -30vh)";
    step = 9;
    stepInstruction(step);
  }
});

cupEmpty.addEventListener("click", async () => {
  if (step !== 6) return;
  cupEmpty.style.transform = "translate(-25vw, -15vh)";
  await delay(3000);
  cupEmpty.style.display = "none";
  step = 7;
  stepInstruction(step);
});

cupFrozen.addEventListener("click", async () => {
  if (step !== 9) return;
  cupFrozen.style.transform = "translate(77vw, -20vh)";
  await delay(1000);
  scaleDisplay.innerText = `${weightFrozen}`;
  step = 10;
  stepInstruction(step);
  await delay(1000);
  calculateOverrun();
  step = 11;
  stepInstruction(step);
});

function startFreezingCountdown(duration) {
  let time = duration;
  const timer = setInterval(() => {
    instructionBox.innerText = `Freezing... ${(10 * time / duration).toFixed(1)} mins elapsed (30x speed)`;
    time--;
    if (time < 0) {
      clearInterval(timer);
      instructionBox.innerText = "Freezing done. Click freezer to open it.";
      speak("Freezing done. Click freezer to open it.");
    }
  }, 1000);
}

function calculateOverrun() {
  const overrun = ((weightMix - weightFrozen) / weightFrozen) * 100;
  resultBox.innerText = `Overrun = ${overrun.toFixed(2)}%`;
  resultBox.style.display = "block";
  speak(`Overrun is ${overrun.toFixed(2)} percent.`);
}
