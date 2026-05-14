let questions = [
  {
    question: "Who does this artist play for?",
    options: ["Day6", "N.Flying", "can't be blue", "CNBLUE"],
    answer: "Day6",
    video: "assets/video/wonpil.mp4"
  },
  {
    question: "Who is the artist for this song?",
    options: ["Jo Yuri", "Kim Chaewon", "Choi Yena", "The JoYuriz"],
    answer: "Choi Yena",
    video: "assets/video/yena.mp4" 
  },
  {
    question: "What do the five members represent in the music video?",
    options: ["Different timelines", "Rival versions of themselves", "One single person's emotions", "Dream characters"],
    answer: "One single person's emotions",
    video: "assets/video/txt.mp4",
    startTime: 18
  },
  {
    question: "How many members in GOT7 are Korean?",
    options: ["4", "5", "6", "7"],
    answer: "4",
    video: "assets/video/got7.mp4",
  },
  {
    question: "Why does the video repeatedly return to nearly identical visual sequences?",
    options: ["To present different perspectives of the same moment", "To highlight subtle changes in the environment over time", "To reinforce the song's rhythmic structure through visual repetition", "To mirror the cyclical nature of the character's emotional state"],
    answer: "To mirror the cyclical nature of the character's emotional state",
    video: "assets/video/natori.mp4",
  },
  {
    question: "What OST is this track from?",
    options: ["Fate/GO", "Wuthering Waves", "GODDESS OF VICTORY: NIKKE", "Honkai Star Rail"],
    answer: "GODDESS OF VICTORY: NIKKE",
    video: "assets/video/nikke.mp4",
  },
  {
    question: "ZEROBASEONE's (In Bloom) references a melody from which song?",
    options: ["Tears for Fears – Head Over Heels", "A-ha – Take On Me", "Alphaville – Forever Young", "New Order – Bizarre Love Triangle"],
    answer: "A-ha – Take On Me",
    video: "assets/video/zb1.mp4",
  },
  {
    question: "How many members are in TripleS?",
    options: ["6", "10", "12", "24"],
    answer: "24",
    video: "assets/video/triples.mp4",
  },
  {
    question: "What is the central emotional theme expressed in DAY6's INSIDE OUT??",
    options: ["A confident declaration of moving on without regret", "A reflection on achieving personal success and fame", "The struggle of hiding true feelings while wanting to be emotionally honest", "A celebration of falling in love at first sight"],
    answer: "The struggle of hiding true feelings while wanting to be emotionally honest",
    video: "assets/video/day6.mp4",
  },
  {
    question: "Which ENHYPEN member most frequently delivers the opening line in their title tracks?",
    options: ["Jungwon", "Heeseung", "Ni-ki", "Sunoo"],
    answer: "Heeseung",
    video: "assets/video/enhypen.mp4",
  },
];

let currentQuestion = 0, score = 0, buttons = [];
let startBtn, restartBtn, volSlider;
let startScreen = true, gameOver = false, victory = false, showCorrectScreen = false;
let showIncorrectScreen = false;
let shakeFrames = 0, videoFade = 0;
// CHANGE 1: added victoryMusic variable
let gameOverMusic, correctSound, incorrectSound, victoryMusic;
let vDrawW = 0, vDrawH = 0, vCenterY = 0;
let restartBtnVisible = false;
let optionBtnsVisible = false;
let galaxyStars = [];
let correctParticles = [];
let correctAnimFrame = 0;
let incorrectParticles = [];
let incorrectAnimFrame = 0;
let incorrectChant = "";
let chantMessages = [
  "오빠!! ◆ 사랑해!!",
  "최고야!! ◆ 대박!!",
  "화이팅!! ◆ 멋있어!!",
  "너무 좋아!! ◆ 짱이야!!"
];
let incorrectMessages = [
  "아이고!! ◆ 틀렸어!!",
  "아쉽다!! ◆ 다시 해!!",
  "으악!! ◆ 아깝다!!",
  "노력해!! ◆ 화이팅!!"
];
let currentChant = "";

let victoryParticles = [];
let victoryAnimFrame = 0;

let vid;
let gameOverGif;

function preload() {
  loadSound('assets/video/someday.mp3',
    function(s) { gameOverMusic = s; },
    function(e) { console.warn('someday.mp3 not found'); }
  );
  loadSound('assets/video/correct.mp3',
    function(s) { correctSound = s; },
    function(e) { console.warn('correct.mp3 not found'); }
  );
  loadSound('assets/video/incorrect.mp3',
    function(s) { incorrectSound = s; },
    function(e) { console.warn('incorrect.mp3 not found'); }
  );
  // CHANGE 2: load victory music — put your file at assets/video/victory.mp3
  loadSound('assets/video/victory.mp3',
    function(s) { victoryMusic = s; },
    function(e) { console.warn('victory.mp3 not found'); }
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  colorMode(HSB, 360, 255, 255);

  vid = document.createElement("video");
  vid.setAttribute("playsinline", "");
  vid.setAttribute("crossorigin", "anonymous");
  vid.style.display = "none";
  vid.loop = true;
  document.body.appendChild(vid);

  gameOverGif = document.createElement("img");
  gameOverGif.src = "assets/video/gameover.gif";
  gameOverGif.style.position = "fixed";
  gameOverGif.style.display = "none";
  gameOverGif.style.width = "200px";
  gameOverGif.style.height = "200px";
  gameOverGif.style.imageRendering = "pixelated";
  gameOverGif.style.zIndex = "1000";
  gameOverGif.style.transform = "translateX(-50%)";
  document.body.appendChild(gameOverGif);

  volSlider = createSlider(0, 1, 0.1, 0.01);
  volSlider.style('z-index', '999');
  volSlider.hide();

  startBtn = createButton("START");
  styleMainButton(startBtn);
  startBtn.mousePressed(startGame);

  restartBtn = createButton("RESTART");
  styleMainButton(restartBtn);
  restartBtn.mousePressed(restartGame);
  restartBtn.hide();

  createOptionButtons();
  repositionUI();
  hideButtons();

  for (let i = 0; i < 180; i++) {
    galaxyStars.push({
      x: random(windowWidth),
      y: random(windowHeight),
      size: random(0.8, 3.2),
      twinkle: random(TWO_PI),
      twinkleSpeed: random(0.01, 0.04),
      r: random(180, 255),
      g: random(160, 220),
      b: 255
    });
  }
}

function draw() {
  colorMode(RGB, 255);
  background(5, 3, 18);

  noStroke();
  fill(80, 40, 160, 12);
  ellipse(width * 0.3, height * 0.4, width * 0.6, height * 0.5);
  fill(40, 10, 120, 10);
  ellipse(width * 0.7, height * 0.6, width * 0.5, height * 0.4);

  for (let i = 0; i < galaxyStars.length; i++) {
    let s = galaxyStars[i];
    s.twinkle += s.twinkleSpeed;
    let alpha = 120 + 120 * sin(s.twinkle);
    fill(s.r, s.g, s.b, alpha);
    noStroke();
    ellipse(s.x, s.y, s.size, s.size);
  }
  colorMode(HSB, 360, 255, 255);

  if (!startScreen && !gameOver && !victory && !showCorrectScreen && !showIncorrectScreen) {
    drawCenteredVideo();
    vid.volume = volSlider.value();

    colorMode(RGB, 255);
    fill(200, 180, 255);
    noStroke();
    textSize(max(14, width * 0.015));
    text("🔊 " + floor(volSlider.value() * 100) + "%", width / 2, vCenterY + (vDrawH / 2) + 40);
    colorMode(HSB, 360, 255, 255);
  }

  handleTransitions();

  if (startScreen) {
    drawStartScreen();
  } else if (showCorrectScreen) {
    drawCorrectScreen();
  } else if (showIncorrectScreen) {
    drawIncorrectScreen();
  } else if (gameOver) {
    drawGameOver();
  } else if (victory) {
    drawVictory();
  } else {
    drawBandInstruments();
    drawQuestionBox();
    if (!optionBtnsVisible) {
      showButtons();
      repositionUI();
    }
  }
}

// --- CORE GAME LOGIC ---
function checkAnswer(i) {
  let selected = questions[currentQuestion].options[i];
  let correct = questions[currentQuestion].answer;

  if (selected === correct) {
    if (correctSound) { correctSound.setVolume(0.1); correctSound.play(); }
    score++;
    showCorrectScreen = true;
    hideButtons();
    volSlider.hide();
    killVideo();
    currentChant = chantMessages[floor(random(chantMessages.length))];
    correctParticles = [];
    correctAnimFrame = 0;
    spawnCorrectParticles();

    setTimeout(() => {
      showCorrectScreen = false;
      volSlider.show();
      nextQuestion();
    }, 1200);

  } else {
    if (incorrectSound) { incorrectSound.setVolume(0.1); incorrectSound.play(); }
    showIncorrectScreen = true;
    hideButtons();
    volSlider.hide();
    killVideo();
    incorrectChant = incorrectMessages[floor(random(incorrectMessages.length))];
    incorrectParticles = [];
    incorrectAnimFrame = 0;
    spawnIncorrectParticles();
    shakeFrames = 20;

    setTimeout(() => {
      showIncorrectScreen = false;
      gameOver = true;
      if (gameOverMusic && !gameOverMusic.isPlaying()) {
        gameOverMusic.setVolume(0.5);
        gameOverMusic.play();
      }
    }, 1400);
  }
}

function killVideo() {
  videoFade = 0;
  vid.onloadedmetadata = null;
  vid.oncanplay = null;
  vid.onseeked = null;
  vid.pause();
  vid.removeAttribute("src");
}

function loadQuestion() {
  let q = questions[currentQuestion];

  vid.onloadedmetadata = null;
  vid.oncanplay = null;
  vid.onseeked = null;
  vid.pause();
  vid.removeAttribute("src");

  vid.onloadedmetadata = null;
  vid.oncanplay = null;
  vid.onseeked = null;

  vid.src = q.video;
  vid.volume = volSlider.value();
  vid.loop = true;

  if (q.startTime) {
    vid.oncanplay = () => {
      vid.oncanplay = null;
      if (!gameOver && !victory && !startScreen) {
        vid.play().then(() => {
          vid.currentTime = q.startTime;
          videoFade = 255;
        }).catch(err => {
          if (err.name !== "AbortError") console.warn("Play error:", err);
        });
      }
    };
  } else {
    vid.oncanplay = () => {
      vid.oncanplay = null;
      if (!gameOver && !victory && !startScreen) {
        vid.play().then(() => {
          videoFade = 255;
        }).catch(err => {
          if (err.name !== "AbortError") console.warn("Play error:", err);
        });
      }
    };
  }

  for (let i = 0; i < buttons.length; i++) buttons[i].html(q.options[i]);
  optionBtnsVisible = false;
  repositionUI();
}

function shuffleQuestions() {
  for (let i = questions.length - 1; i > 0; i--) {
    let j = floor(random(i + 1));
    let temp = questions[i];
    questions[i] = questions[j];
    questions[j] = temp;
  }
}

function restartGame() {
  currentQuestion = 0;
  score = 0;
  gameOver = false;
  victory = false;
  startScreen = true;
  showIncorrectScreen = false;
  incorrectParticles = [];
  restartBtnVisible = false;
  victoryParticles = [];
  victoryAnimFrame = 0;

  if (gameOverMusic && gameOverMusic.isPlaying()) gameOverMusic.stop();
  if (correctSound && correctSound.isPlaying()) correctSound.stop();
  if (incorrectSound && incorrectSound.isPlaying()) incorrectSound.stop();
  // CHANGE 3a: stop victory music on restart
  if (victoryMusic && victoryMusic.isPlaying()) victoryMusic.stop();

  gameOverGif.style.display = "none";

  restartBtn.hide();
  startBtn.show();
  volSlider.hide();
  hideButtons();
  shuffleQuestions();
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion >= questions.length) {
    victory = true;
    killVideo();
  } else {
    loadQuestion();
  }
}

// --- LAYOUT & DRAWING ---
function repositionUI() {
  if (!volSlider) return;

  let playerW = width * 0.6;
  let playerH = height * 0.35;
  vCenterY = height * 0.4;

  let vW = (vid && vid.videoWidth > 0) ? vid.videoWidth : 16;
  let vH = (vid && vid.videoHeight > 0) ? vid.videoHeight : 9;
  let ratio = Math.min(playerW / vW, playerH / vH);
  vDrawW = vW * ratio;
  vDrawH = vH * ratio;

  volSlider.size(vDrawW * 0.5);
  volSlider.position(width / 2 - volSlider.width / 2, vCenterY + (vDrawH / 2) + 55);

  let mainW = max(200, width * 0.2);
  let mainH = max(60, height * 0.1);
  startBtn.size(mainW, mainH);
  startBtn.position(width / 2 - mainW / 2, height * 0.70);
  restartBtn.size(mainW, mainH);
  restartBtn.position(width / 2 - mainW / 2, height * 0.8);

  let gap = width * 0.02;
  let optW = width * 0.35;
  let optH = height * 0.07;
  let startY = height * 0.72;

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].size(optW, optH);
    let col = i % 2;
    let row = floor(i / 2);
    let x = (width / 2) - optW - (gap / 2) + (col * (optW + gap));
    let y = startY + (row * (optH + gap));
    buttons[i].position(x, y);
  }
}

function drawCenteredVideo() {
  if (vid && vid.readyState >= 2 && vid.src !== "") {
    push();
    colorMode(RGB, 255);
    let bs = 150 + 80 * sin(frameCount * 0.04);
    stroke(bs * 0.5, bs * 0.3, 255, 200);
    strokeWeight(2);
    fill(5, 3, 18);
    rect(width / 2, vCenterY, vDrawW + 10, vDrawH + 10, 10);
    colorMode(HSB, 360, 255, 255);
    drawingContext.drawImage(vid, width / 2 - vDrawW / 2, vCenterY - vDrawH / 2, vDrawW, vDrawH);
    pop();
  }
}

function drawQuestionBox() {
  let x = width / 2, y = height * 0.15, w = width * 0.8, h = height * 0.12;
  colorMode(RGB, 255);
  fill(20, 8, 50, 220); rect(x, y, w, h, 20);
  let shimmer = 180 + 60 * sin(frameCount * 0.04);
  stroke(shimmer * 0.6, shimmer * 0.4, 255, 200);
  strokeWeight(1.5); noFill(); rect(x, y, w, h, 20);
  noStroke(); fill(220, 200, 255);
  colorMode(HSB, 360, 255, 255);
  textSize(min(28, width * 0.03));
  text(questions[currentQuestion].question, x, y, w * 0.9, h * 0.9);
}

// --- BAND INSTRUMENTS ---
function drawBandInstruments() {
  let cx = width / 2;
  let cy = vCenterY;
  let float = sin(frameCount * 0.03) * 6;

  colorMode(RGB, 255);

  push();
  translate(cx - vDrawW / 2 - 120, cy - 130 + float);
  rotate(radians(-35));
  drawGuitar();
  pop();

  push();
  translate(cx - vDrawW / 2 - 80, cy + 60 - float);
  rotate(radians(35));
  drawBass();
  pop();

  push();
  translate(cx + vDrawW / 2 + 120, cy - 100 + float);
  drawKeyboard();
  pop();

  push();
  translate(cx + vDrawW / 2 + 80, cy + 70 - float);
  scale(0.72);
  drawDrums();
  pop();

  colorMode(HSB, 360, 255, 255);
}

function drawGuitar() {
  fill(160, 80, 220); noStroke();
  ellipse(0, 10, 44, 50);
  ellipse(0, -10, 36, 38);
  fill(130, 60, 190);
  rect(0, 0, 22, 14, 4);
  fill(200, 160, 255); stroke(150, 100, 220); strokeWeight(1);
  rect(0, -52, 10, 52, 3);
  fill(180, 120, 240); noStroke();
  ellipse(0, -80, 14, 18);
  fill(30, 10, 60); noStroke();
  ellipse(0, 10, 14, 14);
  stroke(220, 200, 255); strokeWeight(0.7);
  for (let i = -3; i <= 3; i += 2) line(i, -75, i, 28);
  stroke(180, 140, 255); strokeWeight(1);
  for (let y = -65; y < -20; y += 12) line(-5, y, 5, y);
  noStroke();
}

function drawBass() {
  fill(100, 60, 200); noStroke();
  ellipse(0, 14, 50, 56);
  ellipse(0, -12, 40, 42);
  fill(80, 40, 170);
  rect(0, 0, 24, 16, 4);
  fill(190, 150, 255); stroke(140, 90, 210); strokeWeight(1);
  rect(0, -62, 11, 62, 3);
  fill(160, 100, 230); noStroke();
  rect(0, -90, 14, 16, 3);
  fill(20, 5, 50); noStroke();
  ellipse(0, 14, 16, 16);
  stroke(210, 190, 255); strokeWeight(0.8);
  for (let i = -4; i <= 4; i += 3) line(i, -85, i, 34);
  noStroke();
}

function drawKeyboard() {
  colorMode(RGB, 255);
  fill(40, 20, 90); stroke(160, 120, 255); strokeWeight(1);
  rect(0, 0, 80, 32, 6);
  fill(42, 16, 96); stroke(153, 102, 255); strokeWeight(0.8);
  quad(-40, -16, 40, -16, 36, -28, -38, -28);
  noStroke(); fill(224, 212, 255);
  let kw = 9, kh = 22, startX = -30;
  for (let i = 0; i < 7; i++) rect(startX + i * (kw + 1.5), 5, kw, kh, 2);
  fill(18, 8, 40);
  let blackPos = [0, 1, 3, 4, 5];
  for (let b of blackPos) rect(startX + b * (kw + 1.5) + (kw / 2) + 1, -1, 6, 14, 2);
  fill(58, 24, 112); stroke(119, 68, 187); strokeWeight(0.8);
  ellipse(-50, 6, 10, 16);
  fill(153, 102, 255); noStroke();
  ellipse(-50, 6, 4, 8);
  fill(102, 51, 204);
  rect(-36, -28, 74, 3, 1.5);
  fill(204, 136, 255);
  rect(-36, -28, 20, 3, 1.5);
}

function drawDrums() {
  colorMode(RGB, 255);

  stroke(119, 85, 170); strokeWeight(1.2);
  line(-54, 95, -54, 28);
  line(-54, 95, -62, 108);
  line(-54, 95, -46, 108);
  line(-28, 95, -10, 18);
  line(-10, 18, -16, 28);
  line(52, 95, 52, 20);
  line(52, 20, 44, 28);

  noStroke(); fill(58, 16, 144);
  ellipse(0, 80, 92, 92);
  fill(80, 40, 168); ellipse(0, 80, 76, 76);
  fill(112, 64, 192); ellipse(0, 80, 52, 52);
  fill(144, 96, 216); ellipse(0, 80, 28, 28);
  stroke(102, 68, 170); strokeWeight(2);
  line(-38, 118, -44, 130); line(38, 118, 44, 130);
  noStroke(); fill(68, 51, 170);
  ellipse(-44, 132, 8, 4); ellipse(44, 132, 8, 4);

  fill(136, 68, 208); stroke(102, 34, 176); strokeWeight(1.2);
  ellipse(0, 96, 44, 18);
  noStroke(); fill(102, 48, 184);
  rect(0, 103, 44, 14, 2);
  fill(119, 48, 192); stroke(85, 16, 160); strokeWeight(1);
  ellipse(0, 110, 44, 16);
  stroke(204, 170, 255); strokeWeight(0.6);
  line(-18, 110, 18, 110); line(-18, 112, 18, 112);
  stroke(102, 68, 170); strokeWeight(1);
  line(-10, 118, -18, 130); line(10, 118, 18, 130);

  fill(136, 64, 208); stroke(102, 34, 176); strokeWeight(1);
  ellipse(-22, 42, 36, 14);
  noStroke(); fill(110, 48, 184);
  rect(-22, 51, 36, 18, 2);
  fill(112, 48, 192); stroke(80, 16, 168); strokeWeight(0.8);
  ellipse(-22, 60, 36, 14);
  stroke(136, 85, 204); strokeWeight(1.2);
  line(-22, 42, -22, 30);

  fill(136, 64, 208); stroke(102, 34, 176); strokeWeight(1);
  ellipse(22, 38, 32, 14);
  noStroke(); fill(110, 48, 184);
  rect(22, 46, 32, 17, 2);
  fill(112, 48, 192); stroke(80, 16, 168); strokeWeight(0.8);
  ellipse(22, 55, 32, 12);
  stroke(136, 85, 204); strokeWeight(1.2);
  line(22, 38, 22, 26);

  fill(112, 48, 184); stroke(80, 32, 160); strokeWeight(1);
  ellipse(60, 72, 40, 16);
  noStroke(); fill(90, 32, 168);
  rect(60, 87, 40, 30, 2);
  fill(96, 32, 168); stroke(64, 16, 160); strokeWeight(0.8);
  ellipse(60, 102, 40, 16);
  stroke(102, 68, 170); strokeWeight(1.2);
  line(44, 102, 42, 118); line(76, 102, 78, 118);

  noStroke(); fill(212, 170, 48); stroke(170, 136, 16); strokeWeight(1);
  ellipse(-54, 24, 40, 10);
  fill(200, 152, 32); stroke(160, 120, 8); strokeWeight(1);
  ellipse(-54, 28, 40, 10);

  fill(212, 170, 48); stroke(170, 136, 16); strokeWeight(1);
  ellipse(-10, 14, 48, 12);
  noStroke(); fill(184, 136, 32);
  ellipse(-10, 14, 12, 6);

  fill(200, 152, 32); stroke(160, 120, 8); strokeWeight(1);
  ellipse(52, 18, 44, 10);
  noStroke(); fill(170, 120, 16);
  ellipse(52, 18, 10, 5);

  noStroke();
}

// --- UI HELPERS ---
function startGame() {
  userStartAudio();
  startScreen = false;
  startBtn.hide();
  volSlider.show();
  shuffleQuestions();
  loadQuestion();
}

function createOptionButtons() {
  for (let i = 0; i < 4; i++) {
    let btn = createButton("");
    styleOptionButton(btn);
    btn.mousePressed(() => checkAnswer(i));
    btn.touchStarted(() => { checkAnswer(i); return false; });
    buttons.push(btn);
  }
}

function hideButtons() {
  optionBtnsVisible = false;
  for (let b of buttons) b.hide();
}

function showButtons() {
  if (!startScreen && !gameOver && !victory && !showCorrectScreen && !showIncorrectScreen) {
    optionBtnsVisible = true;
    for (let b of buttons) b.show();
  }
}

function styleOptionButton(btn) {
  btn.style("border-radius", "8px");
  btn.style("font-size", "1.2vw");
  btn.style("background", "linear-gradient(135deg,#4a1a8a,#7b3fd4)");
  btn.style("color", "#e8d5ff");
  btn.style("border", "1px solid #9966ff");
  btn.style("cursor", "pointer");
  btn.style("text-shadow", "0 0 8px #cc99ff");
}

function styleMainButton(btn) {
  btn.style("border-radius", "12px");
  btn.style("font-size", "1.8vw");
  btn.style("background", "linear-gradient(135deg,#2a0a5a,#6a2ac4)");
  btn.style("color", "#e8d5ff");
  btn.style("border", "1px solid #9966ff");
  btn.style("cursor", "pointer");
  btn.style("text-shadow", "0 0 10px #cc99ff");
}

function handleTransitions() {
  if (videoFade > 0) {
    fill(0, 0, 0, videoFade);
    rect(width / 2, height / 2, width, height);
    videoFade -= 15;
  }
  if (shakeFrames > 0) {
    translate(random(-5, 5), random(-5, 5));
    shakeFrames--;
  }
}

// --- START SCREEN ---
function drawStartScreen() {
  colorMode(RGB, 255);

  let pulse = 0.5 + 0.5 * sin(frameCount * 0.03);
  noStroke();
  fill(80, 40, 160, 18 + 10 * pulse);
  ellipse(width * 0.28, height * 0.38, width * 0.5, height * 0.45);
  fill(40, 10, 120, 14 + 8 * pulse);
  ellipse(width * 0.72, height * 0.58, width * 0.42, height * 0.38);

  fill(153, 102, 255, 180);
  textSize(width * 0.012);
  text("✦  ART 75  ✦", width / 2, height * 0.24);

  textSize(width * 0.05);
  fill(232, 213, 255);
  text("TIMMY'S", width / 2, height * 0.31);
  text("Playlist Test", width / 2, height * 0.39);

  let dw = width * 0.15;
  stroke(153, 102, 255, 100); strokeWeight(1);
  line(width / 2 - dw, height * 0.49, width / 2 + dw, height * 0.49);
  noStroke();

  fill(196, 168, 240, 180);
  textSize(width * 0.014);
  text("Can you answer all the trivia in one go?", width / 2, height * 0.535);

  let chips = ["One chance", "10 songs", "Trivia about song/artist"];
  let chipW = width * 0.14, chipH = height * 0.038, chipGap = width * 0.16;
  for (let i = 0; i < chips.length; i++) {
    let cx = width / 2 + (i - 1) * chipGap;
    let cy = height * 0.595;
    fill(90, 40, 160, 55);
    stroke(123, 63, 212, 80); strokeWeight(0.8);
    rect(cx, cy, chipW, chipH, 20);
    noStroke();
    fill(196, 168, 240, 200);
    textSize(width * 0.011);
    text(chips[i], cx, cy);
  }

  let noteSyms = ["♪", "♫", "♪", "♫"];
  for (let i = 0; i < noteSyms.length; i++) {
    let nx = width * 0.36 + i * width * 0.09;
    let ny = height * 0.88 + sin(frameCount * 0.04 + i * 1.1) * 7;
    fill(123, 63, 212, 100);
    textSize(width * 0.018);
    text(noteSyms[i], nx, ny);
  }

  colorMode(HSB, 360, 255, 255);
}

// --- GAME OVER ---
function drawGameOver() {
  if (!restartBtnVisible) {
    restartBtn.show();
    volSlider.hide();
    restartBtnVisible = true;

    gameOverGif.style.display = "block";
    gameOverGif.style.left = "50%";
    gameOverGif.style.top = (height * 0.52) + "px";
    gameOverGif.style.transform = "translateX(-50%)";
  }

  colorMode(RGB, 255);
  fill(220, 150, 255);
  textSize(width * 0.05);
  text("GAME OVER", width / 2, height * 0.4);
  colorMode(HSB, 360, 255, 255);
}

// --- VICTORY SCREEN ---
function drawVictory() {
  if (!restartBtnVisible) {
    restartBtn.show();
    volSlider.hide();
    restartBtnVisible = true;
    victoryParticles = [];
    victoryAnimFrame = 0;
    spawnVictoryParticles();
    // CHANGE 3b: play victory music the moment the victory screen appears
    if (victoryMusic && !victoryMusic.isPlaying()) {
      victoryMusic.setVolume(0.3);
      victoryMusic.play();
    }
  }

  victoryAnimFrame++;

  for (let i = victoryParticles.length - 1; i >= 0; i--) {
    let p = victoryParticles[i];
    if (victoryAnimFrame < p.delay) continue;
    p.y -= p.speed;
    p.x += p.drift;
    p.life -= 0.012;
    if (p.life <= 0) { victoryParticles.splice(i, 1); continue; }

    push();
    colorMode(RGB, 255);
    let palettes = [
      [255, 220, 80], [220, 180, 255], [180, 230, 255],
      [255, 180, 220], [255, 255, 255], [160, 255, 200], [255, 200, 100]
    ];
    let rgb = palettes[floor(random(palettes.length))];
    fill(rgb[0], rgb[1], rgb[2], p.life * 255);
    noStroke();
    textSize(p.size);
    textAlign(CENTER, CENTER);
    text(p.sym, p.x, p.y);
    colorMode(HSB, 360, 255, 255);
    pop();
  }

  if (victoryAnimFrame % 5 === 0 && victoryParticles.length < 60) {
    victoryParticles.push(makeVictoryParticle());
  }

  push();
  colorMode(RGB, 255);
  let scl = min(1.0, 0.4 + victoryAnimFrame * 0.04);
  translate(width / 2, height * 0.32);
  scale(scl);
  textAlign(CENTER, CENTER);
  textSize(width * 0.1);
  for (let dx = -4; dx <= 4; dx += 4) {
    for (let dy = -4; dy <= 4; dy += 4) {
      fill(120, 40, 220, 160);
      text("YOU WIN!", dx, dy);
    }
  }
  let shimmer = 200 + 55 * sin(victoryAnimFrame * 0.08);
  fill(shimmer, shimmer * 0.85, 80);
  text("YOU WIN!", 0, 0);
  pop();

  push();
  colorMode(RGB, 255);
  let scoreAlpha = min(255, max(0, (victoryAnimFrame - 15) * 14));
  textAlign(CENTER, CENTER);
  noStroke();
  fill(30, 10, 70, scoreAlpha * 0.85);
  rect(width / 2, height * 0.5, width * 0.38, height * 0.1, 16);
  stroke(200, 170, 255, scoreAlpha);
  strokeWeight(1.5);
  noFill();
  rect(width / 2, height * 0.5, width * 0.38, height * 0.1, 16);
  noStroke();
  fill(255, 230, 120, scoreAlpha);
  textSize(max(18, width * 0.03));
  text("FINAL SCORE: " + score + " / " + questions.length, width / 2, height * 0.5);
  pop();

  push();
  colorMode(RGB, 255);
  let chantAlpha = min(255, max(0, (victoryAnimFrame - 25) * 12));
  fill(200, 180, 255, chantAlpha);
  textSize(max(16, width * 0.022));
  textAlign(CENTER, CENTER);
  noStroke();
  text("✦  최고야!! 대박!! 짱이야!!  ✦", width / 2, height * 0.62);
  fill(160, 140, 220, chantAlpha);
  textSize(max(12, width * 0.015));
  text("you're a true expert!", width / 2, height * 0.69);
  colorMode(HSB, 360, 255, 255);
  pop();
}

function spawnVictoryParticles() {
  for (let i = 0; i < 40; i++) {
    victoryParticles.push(makeVictoryParticle(i * 1.2));
  }
}

function makeVictoryParticle(delay = 0) {
  let symbols = ["★", "✦", "♥", "✿", "♪", "✩", "◆", "♡", "☆", "🏆", "✨"];
  return {
    x: random(width),
    y: height + random(40),
    sym: random(symbols),
    size: random(20, 52),
    speed: random(2, 6),
    drift: random(-2, 2),
    life: 1.0,
    delay: delay
  };
}

// --- CORRECT SCREEN ---
let pinkCols = [
  [160, 100, 255], [140, 80, 255], [180, 130, 255],
  [200, 160, 255], [255, 255, 255], [170, 110, 255]
];

function makeParticle() {
  let symbols = ["♥","★","✦","♡","☆","✿","♪","✩"];
  return {
    x: random(width),
    y: height + random(30),
    sym: random(symbols),
    col: random(pinkCols),
    size: random(18, 42),
    speed: random(3, 7),
    drift: random(-1.5, 1.5),
    life: 1.0,
    delay: 0
  };
}

function spawnCorrectParticles() {
  correctParticles = [];
  for (let i = 0; i < 50; i++) {
    let p = makeParticle();
    p.delay = i * 1.5;
    correctParticles.push(p);
  }
}

function drawCorrectScreen() {
  correctAnimFrame++;

  for (let i = correctParticles.length - 1; i >= 0; i--) {
    let p = correctParticles[i];
    if (correctAnimFrame < p.delay) continue;
    p.y -= p.speed;
    p.x += p.drift;
    p.life -= 0.008;
    if (p.life <= 0) { correctParticles.splice(i, 1); continue; }

    push();
    colorMode(RGB, 255);
    let alpha = p.life * 255;
    let palettes = [
      [180, 130, 255], [210, 180, 255], [140, 80, 240],
      [220, 200, 255], [255, 255, 255], [160, 100, 255],
      [100, 180, 255], [200, 160, 255]
    ];
    let rgb = palettes[floor(random(palettes.length))];
    fill(rgb[0], rgb[1], rgb[2], alpha);
    noStroke();
    textSize(p.size);
    textAlign(CENTER, CENTER);
    text(p.sym, p.x, p.y);
    colorMode(HSB, 360, 255, 255);
    pop();
  }

  if (correctAnimFrame % 3 === 0 && correctParticles.length < 70) {
    correctParticles.push(makeParticle());
  }

  let scl = min(1.0, 0.4 + correctAnimFrame * 0.05);
  push();
  colorMode(RGB, 255);
  translate(width / 2, height * 0.44);
  scale(scl);
  textAlign(CENTER, CENTER);
  textSize(width * 0.09);
  fill(80, 20, 160, 180);
  for (let dx = -3; dx <= 3; dx += 3) {
    for (let dy = -3; dy <= 3; dy += 3) {
      text("CORRECT!", dx, dy);
    }
  }
  fill(230, 210, 255);
  text("CORRECT!", 0, 0);
  colorMode(HSB, 360, 255, 255);
  pop();

  push();
  colorMode(RGB, 255);
  let chantAlpha = min(255, max(0, (correctAnimFrame - 10) * 18));
  fill(200, 180, 255, chantAlpha);
  textSize(max(16, width * 0.022));
  textAlign(CENTER, CENTER);
  noStroke();
  text(currentChant, width / 2, height * 0.58);
  let ptAlpha = min(255, max(0, (correctAnimFrame - 16) * 18));
  fill(160, 130, 240, ptAlpha);
  textSize(max(13, width * 0.016));
  text("+1 point  ✦", width / 2, height * 0.64);
  colorMode(HSB, 360, 255, 255);
  pop();
}

// --- INCORRECT SCREEN ---
function spawnIncorrectParticles() {
  incorrectParticles = [];
  let symbols = ["✗", "×", "!", "?", "✘", "★", "☆", "♡"];
  for (let i = 0; i < 50; i++) {
    incorrectParticles.push({
      x: random(width),
      y: height + random(30),
      sym: random(symbols),
      size: random(18, 42),
      speed: random(3, 7),
      drift: random(-1.5, 1.5),
      life: 1.0,
      delay: i * 1.5
    });
  }
}

function drawIncorrectScreen() {
  incorrectAnimFrame++;

  for (let i = incorrectParticles.length - 1; i >= 0; i--) {
    let p = incorrectParticles[i];
    if (incorrectAnimFrame < p.delay) continue;
    p.y -= p.speed;
    p.x += p.drift;
    p.life -= 0.008;
    if (p.life <= 0) { incorrectParticles.splice(i, 1); continue; }

    push();
    colorMode(RGB, 255);
    let palettes = [
      [255, 80, 80], [255, 140, 60], [255, 100, 120],
      [255, 60, 60], [255, 200, 100], [255, 80, 140]
    ];
    let rgb = palettes[floor(random(palettes.length))];
    fill(rgb[0], rgb[1], rgb[2], p.life * 255);
    noStroke();
    textSize(p.size);
    textAlign(CENTER, CENTER);
    text(p.sym, p.x, p.y);
    colorMode(HSB, 360, 255, 255);
    pop();
  }

  if (incorrectAnimFrame % 3 === 0 && incorrectParticles.length < 70) {
    let sym2 = ["✗","×","!","?","✘","★","☆","♡"];
    incorrectParticles.push({
      x: random(width), y: height + random(30),
      sym: random(sym2), size: random(18, 42),
      speed: random(3, 7), drift: random(-1.5, 1.5),
      life: 1.0, delay: 0
    });
  }

  let scl = min(1.0, 0.4 + incorrectAnimFrame * 0.05);
  push();
  colorMode(RGB, 255);
  translate(width / 2, height * 0.44);
  scale(scl);
  textAlign(CENTER, CENTER);
  textSize(width * 0.09);
  fill(100, 10, 10, 180);
  for (let dx = -3; dx <= 3; dx += 3) {
    for (let dy = -3; dy <= 3; dy += 3) {
      text("WRONG!", dx, dy);
    }
  }
  fill(255, 150, 160);
  text("WRONG!", 0, 0);
  colorMode(HSB, 360, 255, 255);
  pop();

  push();
  colorMode(RGB, 255);
  let chantAlpha = min(255, max(0, (incorrectAnimFrame - 10) * 18));
  fill(255, 180, 180, chantAlpha);
  textSize(max(16, width * 0.022));
  textAlign(CENTER, CENTER);
  noStroke();
  text(incorrectChant, width / 2, height * 0.58);
  let ptAlpha = min(255, max(0, (incorrectAnimFrame - 16) * 18));
  fill(220, 130, 130, ptAlpha);
  textSize(max(13, width * 0.016));
  text("score: " + score + "  ✦", width / 2, height * 0.64);
  colorMode(HSB, 360, 255, 255);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  repositionUI();
}