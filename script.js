const startScreen =
  document.getElementById("startScreen");

const gameScreen =
  document.getElementById("gameScreen");

const studentNameInput =
  document.getElementById("studentName");

const startButton =
  document.getElementById("startButton");

const playerName =
  document.getElementById("playerName");

const scoreElement =
  document.getElementById("score");

const questionTypeElement =
  document.getElementById("questionType");

const questionElement =
  document.getElementById("question");

const numberLine =
  document.getElementById("numberLine");

const movementInfo =
  document.getElementById("movementInfo");

const undoButton =
  document.getElementById("undoButton");

const clearButton =
  document.getElementById("clearButton");

const checkButton =
  document.getElementById("checkButton");

const feedback =
  document.getElementById("feedback");

const fireworkContainer =
  document.getElementById("fireworkContainer");


/* =====================================================
   وضعیت بازی
===================================================== */

let score = 0;

let currentQuestion = null;

let drawnMoves = [];

let isDrawing = false;

let drawingStart = null;

let audioContext = null;


/* =====================================================
   تبدیل عدد به فارسی
===================================================== */

function toPersianNumber(value) {

  const numbers =
    "۰۱۲۳۴۵۶۷۸۹";

  return String(value).replace(
    /\d/g,
    digit => numbers[digit]
  );
}


/* =====================================================
   عدد تصادفی
===================================================== */

function randomInt(min, max) {

  return Math.floor(
    Math.random() *
      (max - min + 1)
  ) + min;
}


/* =====================================================
   صدا
===================================================== */

function initializeAudio() {

  if (!audioContext) {

    const AudioContext =
      window.AudioContext ||
      window.webkitAudioContext;

    if (AudioContext) {

      audioContext =
        new AudioContext();
    }
  }

  if (
    audioContext &&
    audioContext.state === "suspended"
  ) {

    audioContext.resume();
  }
}


function playTone(
  frequency,
  duration,
  type,
  volume,
  delay
) {

  if (!audioContext) return;

  const oscillator =
    audioContext.createOscillator();

  const gain =
    audioContext.createGain();

  oscillator.type =
    type;

  oscillator.frequency.value =
    frequency;

  const startTime =
    audioContext.currentTime +
    delay;

  gain.gain.setValueAtTime(
    0,
    startTime
  );

  gain.gain.linearRampToValueAtTime(
    volume,
    startTime + 0.02
  );

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    startTime + duration
  );

  oscillator.connect(gain);

  gain.connect(
    audioContext.destination
  );

  oscillator.start(startTime);

  oscillator.stop(
    startTime +
    duration +
    0.03
  );
}


function playCorrectSound() {

  initializeAudio();

  playTone(
    523.25,
    0.18,
    "sine",
    0.09,
    0
  );

  playTone(
    659.25,
    0.18,
    "sine",
    0.09,
    0.13
  );

  playTone(
    783.99,
    0.30,
    "sine",
    0.10,
    0.26
  );
}


function playWrongSound() {

  initializeAudio();

  playTone(
    260,
    0.20,
    "triangle",
    0.06,
    0
  );

  playTone(
    190,
    0.28,
    "triangle",
    0.06,
    0.18
  );
}


/* =====================================================
   محور ۰ تا ۲۰
===================================================== */

function createNumberLine() {

  numberLine.innerHTML = "";

  for (
    let i = 0;
    i <= 20;
    i++
  ) {

    const position =
      2.4 +
      (i / 20) * 95.2;


    const tick =
      document.createElement("div");

    tick.className =
      "tick";

    tick.style.left =
      `${position}%`;

    numberLine.appendChild(
      tick
    );


    const number =
      document.createElement("div");

    number.className =
      "number";

    number.dataset.value =
      i;

    number.textContent =
      toPersianNumber(i);

    number.style.left =
      `${position}%`;

    numberLine.appendChild(
      number
    );
  }
}


/* =====================================================
   ساخت سؤال
===================================================== */

function generateQuestion() {

  clearDrawing();

  feedback.textContent =
    "";

  const type =
    randomInt(1, 3);


  /* جمع */

  if (type === 1) {

    const a =
      randomInt(0, 15);

    const b =
      randomInt(1, 20 - a);


    currentQuestion = {

      type: "جمع",

      start: a,

      operations: [

        {
          operator: "+",
          value: b
        }

      ],

      answer: a + b
    };


    questionTypeElement.textContent =
      "جمع";


    questionElement.textContent =
      `${toPersianNumber(a)}
       + ${toPersianNumber(b)}
       = ؟`;


    movementInfo.textContent =
      `از ${toPersianNumber(a)}
       شروع کن و
       ${toPersianNumber(b)}
       خانه به راست برو.`;

    return;
  }


  /* تفریق */

  if (type === 2) {

    const a =
      randomInt(1, 20);

    const b =
      randomInt(1, a);


    currentQuestion = {

      type: "تفریق",

      start: a,

      operations: [

        {
          operator: "-",
          value: b
        }

      ],

      answer: a - b
    };


    questionTypeElement.textContent =
      "تفریق";


    questionElement.textContent =
      `${toPersianNumber(a)}
       − ${toPersianNumber(b)}
       = ؟`;


    movementInfo.textContent =
      `از ${toPersianNumber(a)}
       شروع کن و
       ${toPersianNumber(b)}
       خانه به چپ برو.`;

    return;
  }


  /* سه عبارتی */

  let a;
  let b;
  let c;

  let op1;
  let op2;

  let answer;

  let valid =
    false;


  while (!valid) {

    a =
      randomInt(2, 15);

    b =
      randomInt(1, 7);

    c =
      randomInt(1, 7);


    const combinations = [

      ["+", "-"],

      ["-", "+"],

      ["+", "+"],

      ["-", "-"]

    ];


    const selected =
      combinations[
        randomInt(
          0,
          combinations.length - 1
        )
      ];


    op1 =
      selected[0];

    op2 =
      selected[1];


    let result =
      a;


    result =
      op1 === "+"
        ? result + b
        : result - b;


    result =
      op2 === "+"
        ? result + c
        : result - c;


    if (
      result >= 0 &&
      result <= 20
    ) {

      answer =
        result;

      valid =
        true;
    }
  }


  currentQuestion = {

    type: "سه‌عبارتی",

    start: a,

    operations: [

      {
        operator: op1,
        value: b
      },

      {
        operator: op2,
        value: c
      }

    ],

    answer: answer
  };


  questionTypeElement.textContent =
    "جمع و تفریق";


  const visibleOp1 =
    op1 === "+"
      ? "+"
      : "−";

  const visibleOp2 =
    op2 === "+"
      ? "+"
      : "−";


  questionElement.textContent =
    `${toPersianNumber(a)}
     ${visibleOp1}
     ${toPersianNumber(b)}
     ${visibleOp2}
     ${toPersianNumber(c)}
     = ؟`;


  movementInfo.textContent =
    "حرکت‌ها را به ترتیب عبارت روی محور رسم کن.";
}


/* =====================================================
   موقعیت عدد
===================================================== */

function getNumberPosition(value) {

  const number =
    numberLine.querySelector(
      `.number[data-value="${value}"]`
    );

  if (!number) {
    return null;
  }


  const lineRect =
    numberLine.getBoundingClientRect();

  const numberRect =
    number.getBoundingClientRect();


  return {

    x:
      numberRect.left +
      numberRect.width / 2 -
      lineRect.left,

    y:
      numberLine.clientWidth < 500
        ? 76
        : 85
  };
}


/* =====================================================
   تبدیل لمس به عدد
===================================================== */

function getNumberFromPointer(event) {

  const rect =
    numberLine.getBoundingClientRect();

  const x =
    event.clientX -
    rect.left;


  const percent =
    Math.max(
      0,
      Math.min(
        100,
        (x / rect.width) * 100
      )
    );


  const value =
    Math.round(
      ((percent - 2.4) / 95.2) *
      20
    );


  return Math.max(
    0,
    Math.min(
      20,
      value
    )
  );
}


/* =====================================================
   مبدأ حرکت بعدی
===================================================== */

function getExpectedNextStart() {

  if (!currentQuestion) {
    return 0;
  }


  let position =
    currentQuestion.start;


  for (
    const move
    of drawnMoves
  ) {

    position =
      move.end;
  }


  return position;
}


/* =====================================================
   شروع کشیدن
===================================================== */

numberLine.addEventListener(
  "pointerdown",
  event => {

    if (!currentQuestion) {
      return;
    }


    const value =
      getNumberFromPointer(event);


    const expectedStart =
      getExpectedNextStart();


    if (
      value !== expectedStart
    ) {

      movementInfo.textContent =
        `از عدد
        ${toPersianNumber(expectedStart)}
        شروع کن 🌱`;

      return;
    }


    isDrawing =
      true;

    drawingStart =
      value;


    try {

      numberLine.setPointerCapture(
        event.pointerId
      );

    } catch (error) {}
  }
);


/* =====================================================
   پایان کشیدن
===================================================== */

numberLine.addEventListener(
  "pointerup",
  event => {

    if (
      !isDrawing ||
      drawingStart === null
    ) {
      return;
    }


    const end =
      getNumberFromPointer(event);


    isDrawing =
      false;


    try {

      numberLine.releasePointerCapture(
        event.pointerId
      );

    } catch (error) {}


    if (
      end === drawingStart
    ) {

      drawingStart =
        null;

      return;
    }


    addMove(
      drawingStart,
      end
    );


    drawingStart =
      null;
  }
);


numberLine.addEventListener(
  "pointercancel",
  () => {

    isDrawing =
      false;

    drawingStart =
      null;
  }
);


/* =====================================================
   افزودن حرکت
===================================================== */

function addMove(
  start,
  end
) {

  const direction =
    end > start
      ? "right"
      : "left";


  const distance =
    Math.abs(
      end - start
    );


  drawnMoves.push({

    start,
    end,
    direction,
    distance
  });


  drawMove(
    start,
    end,
    direction,
    distance
  );


  movementInfo.textContent =
    "حرکت ثبت شد ✏️ اگر اشتباه بود، پاکش کن.";
}


/* =====================================================
   رسم کمان منحنی
===================================================== */

function drawMove(
  start,
  end,
  direction,
  distance
) {

  const startPos =
    getNumberPosition(start);

  const endPos =
    getNumberPosition(end);


  if (
    !startPos ||
    !endPos
  ) {
    return;
  }


  const distanceX =
    Math.abs(
      endPos.x -
      startPos.x
    );


  const curveHeight =
    Math.min(
      65,
      Math.max(
        35,
        distanceX * 0.25
      )
    );


  const middleX =
    (
      startPos.x +
      endPos.x
    ) / 2;


  const middleY =
    startPos.y -
    curveHeight;


  const svg =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );


  svg.classList.add(
    "curved-move",
    direction
  );


  svg.setAttribute(
    "viewBox",
    `0 0
     ${numberLine.clientWidth}
     150`
  );


  const path =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );


  path.setAttribute(
    "d",
    `M ${startPos.x}
       ${startPos.y}
       Q ${middleX}
         ${middleY}
         ${endPos.x}
         ${endPos.y}`
  );


  path.classList.add(
    "curved-path"
  );


  /* فلش */

  const markerId =
    `arrow-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;


  const defs =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "defs"
    );


  const marker =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "marker"
    );


  marker.setAttribute(
    "id",
    markerId
  );

  marker.setAttribute(
    "markerWidth",
    "10"
  );

  marker.setAttribute(
    "markerHeight",
    "10"
  );

  marker.setAttribute(
    "refX",
    "8"
  );

  marker.setAttribute(
    "refY",
    "4"
  );

  marker.setAttribute(
    "orient",
    "auto"
  );


  const arrowHead =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );


  arrowHead.setAttribute(
    "d",
    "M0,0 L0,8 L10,4 Z"
  );


  arrowHead.setAttribute(
    "fill",
    direction === "right"
      ? "#ed7097"
      : "#62a4e6"
  );


  marker.appendChild(
    arrowHead
  );

  defs.appendChild(
    marker
  );

  svg.appendChild(
    defs
  );


  path.setAttribute(
    "marker-end",
    `url(#${markerId})`
  );


  svg.appendChild(
    path
  );


  /* عدد حرکت */

  const text =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );


  text.setAttribute(
    "x",
    middleX
  );


  text.setAttribute(
    "y",
    middleY - 7
  );


  text.setAttribute(
    "text-anchor",
    "middle"
  );


  text.textContent =
    `${
      direction === "right"
        ? "+"
        : "−"
    }${toPersianNumber(distance)}`;


  svg.appendChild(
    text
  );


  numberLine.appendChild(
    svg
  );


  /* نقطه شروع */

  const dot =
    document.createElement(
      "div"
    );


  dot.className =
    "start-dot";


  dot.style.left =
    `${startPos.x}px`;


  dot.style.top =
    `${startPos.y}px`;


  numberLine.appendChild(
    dot
  );
}


/* =====================================================
   پاک کردن آخرین حرکت
===================================================== */

undoButton.addEventListener(
  "click",
  () => {

    if (
      drawnMoves.length === 0
    ) {
      return;
    }


    drawnMoves.pop();


    const curves =
      numberLine.querySelectorAll(
        ".curved-move"
      );


    if (
      curves.length
    ) {

      curves[
        curves.length - 1
      ].remove();
    }


    const dots =
      numberLine.querySelectorAll(
        ".start-dot"
      );


    if (
      dots.length
    ) {

      dots[
        dots.length - 1
      ].remove();
    }


    movementInfo.textContent =
      "حرکت قبلی پاک شد؛ دوباره بکش ✏️";
  }
);


/* =====================================================
   پاک کردن همه
===================================================== */

clearButton.addEventListener(
  "click",
  () => {

    clearDrawing();

    feedback.textContent =
      "";

    movementInfo.textContent =
      "از عدد مبدأ شروع کن و حرکتت را بکش ✏️";
  }
);


function clearDrawing() {

  drawnMoves =
    [];


  numberLine
    .querySelectorAll(
      ".curved-move"
    )
    .forEach(
      item => item.remove()
    );


  numberLine
    .querySelectorAll(
      ".start-dot"
    )
    .forEach(
      item => item.remove()
    );
}


/* =====================================================
   بررسی پاسخ
===================================================== */

checkButton.addEventListener(
  "click",
  () => {

    if (!currentQuestion) {
      return;
    }


    const correctMoves =
      [];


    let position =
      currentQuestion.start;


    for (
      const operation
      of currentQuestion.operations
    ) {

      const newPosition =
        operation.operator === "+"
          ? position +
            operation.value
          : position -
            operation.value;


      correctMoves.push({

        start: position,

        end: newPosition
      });


      position =
        newPosition;
    }


    if (
      drawnMoves.length !==
      correctMoves.length
    ) {

      showWrong(
        "هنوز همه حرکت‌ها را نکشیدی 🌱"
      );

      return;
    }


    let correct =
      true;


    for (
      let i = 0;
      i < correctMoves.length;
      i++
    ) {

      if (
        drawnMoves[i].start !==
          correctMoves[i].start ||

        drawnMoves[i].end !==
          correctMoves[i].end
      ) {

        correct =
          false;

        break;
      }
    }


    if (correct) {

      showCorrect();

    } else {

      showWrong(
        "اشکالی ندارد؛ مسیرت را دوباره بررسی کن 💪"
      );
    }
  }
);


/* =====================================================
   درست
===================================================== */

function showCorrect() {

  score++;


  scoreElement.textContent =
    toPersianNumber(score);


  feedback.textContent =
    "آفرین! کاملاً درست انجام دادی 🎉";


  feedback.style.color =
    "#39956c";


  playCorrectSound();

  launchFireworks();


  setTimeout(
    () => {

      generateQuestion();

    },
    1600
  );
}


/* =====================================================
   غلط
===================================================== */

function showWrong(message) {

  feedback.textContent =
    message;


  feedback.style.color =
    "#d65b70";


  playWrongSound();
}


/* =====================================================
   فشفشه
===================================================== */

function launchFireworks() {

  fireworkContainer.innerHTML =
    "";


  const colors = [

    "#ff5c8a",
    "#ffd166",
    "#55c2ff",
    "#8bd450",
    "#a875ff",
    "#ff8c42"

  ];


  const centers = [

    {
      x: "25%",
      y: "32%"
    },

    {
      x: "50%",
      y: "25%"
    },

    {
      x: "75%",
      y: "35%"
    },

    {
      x: "40%",
      y: "55%"
    },

    {
      x: "65%",
      y: "52%"
    }

  ];


  centers.forEach(
    center => {

      for (
        let i = 0;
        i < 24;
        i++
      ) {

        const particle =
          document.createElement(
            "div"
          );


        particle.className =
          "firework-particle";


        particle.style.left =
          center.x;

        particle.style.top =
          center.y;


        particle.style.background =
          colors[
            randomInt(
              0,
              colors.length - 1
            )
          ];


        const angle =
          Math.random() *
          Math.PI *
          2;


        const distance =
          randomInt(
            70,
            190
          );


        particle.style.setProperty(
          "--x",
          `${
            Math.cos(angle) *
            distance
          }px`
        );


        particle.style.setProperty(
          "--y",
          `${
            Math.sin(angle) *
            distance
          }px`
        );


        particle.style.animationDelay =
          `${
            Math.random() *
            0.18
          }s`;


        fireworkContainer.appendChild(
          particle
        );
      }
    }
  );


  setTimeout(
    () => {

      fireworkContainer.innerHTML =
        "";

    },
    1300
  );
}


/* =====================================================
   شروع بازی
===================================================== */

startButton.addEventListener(
  "click",
  () => {

    initializeAudio();


    const name =
      studentNameInput.value.trim();


    if (!name) {

      studentNameInput.focus();

      studentNameInput.placeholder =
        "اول نام زیبایت را بنویس 🌷";

      return;
    }


    playerName.textContent =
      name;


    score =
      0;


    scoreElement.textContent =
      toPersianNumber(score);


    startScreen.classList.add(
      "hidden"
    );


    gameScreen.classList.remove(
      "hidden"
    );


    createNumberLine();

    generateQuestion();
  }
);


/* =====================================================
   Enter
===================================================== */

studentNameInput.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Enter"
    ) {

      startButton.click();
    }
  }
);


/* =====================================================
   اجرای اولیه
===================================================== */

createNumberLine();
