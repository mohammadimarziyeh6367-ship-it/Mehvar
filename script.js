/* =========================================================
   بازی «الگوی منظم» | ریاضی پایه اول
   ========================================================= */


/* =========================================================
   تنظیمات
   ========================================================= */

const TOTAL_COLUMNS = 21;

let studentName = "";
let currentStage = 0;
let score = 0;

let selectedTool = null;

let currentCells = [];
let repeatCells = [];

let selectedShapeAnswer = null;

let audioContext = null;


/* =========================================================
   رنگ ها
   ========================================================= */

const COLORS = {
  green: "#58c86b",
  blue: "#42a5f5",
  yellow: "#ffd84d",
  red: "#ef5350",
  pink: "#ff73ad",
  purple: "#9c64e8",
  white: "#ffffff"
};


/* =========================================================
   تعریف مراحل
   ========================================================= */

const stages = [

  /* -----------------------------------------
     مرحله 1
  ----------------------------------------- */

  {
    type: "color",
    pattern: ["green", "green", "red"],
    blanks: [6, 7, 8, 9, 10, 11],
    instruction:
      "الگوی تکرارشونده را ادامه بده. سپس الگویی را که پیدا کردی، یک بار در سمت راست رسم کن."
  },


  /* -----------------------------------------
     مرحله 2
  ----------------------------------------- */

  {
    type: "color",
    pattern: ["blue", "yellow"],
    blanks: [5, 6, 7, 8, 9, 10, 11, 12],
    instruction:
      "الگوی تکرارشونده را ادامه بده. سپس الگویی را که پیدا کردی، یک بار در سمت راست رسم کن."
  },


  /* -----------------------------------------
     مرحله 3
  ----------------------------------------- */

  {
    type: "color",
    pattern: ["green", "red", "red"],
    blanks: [6, 7, 8, 9, 10, 11, 12],
    instruction:
      "الگوی تکرارشونده را پیدا کن و ادامه بده. سپس الگو را یک بار در سمت راست رسم کن."
  },


  /* -----------------------------------------
     مرحله 4
  ----------------------------------------- */

  {
    type: "color",
    pattern: ["yellow", "blue", "green"],
    blanks: [6, 7, 8, 9, 10, 11, 12],
    instruction:
      "الگوی تکرارشونده را پیدا کن و ادامه بده. سپس الگو را یک بار در سمت راست رسم کن."
  },


  /* -----------------------------------------
     مرحله 5
  ----------------------------------------- */

  {
    type: "color",
    pattern: ["red", "red", "yellow"],
    blanks: [6, 7, 8, 9, 10, 11, 12],
    instruction:
      "الگوی تکرارشونده را پیدا کن و ادامه بده. سپس الگو را یک بار در سمت راست رسم کن."
  },


  /* -----------------------------------------
     مرحله 6
  ----------------------------------------- */

  {
    type: "color",
    pattern: ["green", "blue", "blue"],
    blanks: [6, 7, 8, 9, 10, 11, 12],
    instruction:
      "الگوی تکرارشونده را پیدا کن و ادامه بده. سپس الگو را یک بار در سمت راست رسم کن."
  },


  /* -----------------------------------------
     مرحله 7
  ----------------------------------------- */

  {
    type: "color",
    pattern: ["pink", "yellow", "pink"],
    blanks: [6, 7, 8, 9, 10, 11, 12],
    instruction:
      "الگوی تکرارشونده را پیدا کن و ادامه بده. سپس الگو را یک بار در سمت راست رسم کن."
  },


  /* -----------------------------------------
     مرحله 8
  ----------------------------------------- */

  {
    type: "color",
    pattern: ["purple", "green", "yellow", "green"],
    blanks: [8, 9, 10, 11, 12, 13, 14],
    instruction:
      "الگوی تکرارشونده را پیدا کن و الگو را ادامه بده. سپس الگو را یک بار در سمت راست رسم کن."
  },


  /* -----------------------------------------
     مرحله 9
  ----------------------------------------- */

  {
    type: "shape",
    pattern: ["circle", "circle", "triangle", "circle", "circle", "triangle"],
    blanks: [6, 7, 8, 9, 10, 11, 12, 13],
    instruction:
      "الگوی تکرارشونده را پیدا کن و الگو را ادامه بده."
  },


  /* -----------------------------------------
     مرحله 10
     سوال حذف شکل
  ----------------------------------------- */

  {
    type: "remove",
    shapes: [
      "circle",
      "circle",
      "square",
      "circle",
      "circle",
      "triangle",
      "circle"
    ],
    answer: 5,
    instruction:
      "کدام شکل را حذف کنیم تا الگو منظم شود؟"
  },


  /* -----------------------------------------
     مرحله 11
  ----------------------------------------- */

  {
    type: "shape",
    pattern: [
      "star",
      "star",
      "heart",
      "star",
      "star",
      "heart"
    ],
    blanks: [6, 7, 8, 9, 10, 11, 12, 13],
    instruction:
      "الگوی تکرارشونده را پیدا کن و الگو را ادامه بده."
  },


  /* -----------------------------------------
     مرحله 12
     سوال حذف شکل
  ----------------------------------------- */

  {
    type: "remove",
    shapes: [
      "triangle",
      "triangle",
      "circle",
      "triangle",
      "triangle",
      "square",
      "triangle"
    ],
    answer: 5,
    instruction:
      "کدام شکل را حذف کنیم تا الگو منظم شود؟"
  },


  /* -----------------------------------------
     مرحله 13
     شطرنجی
  ----------------------------------------- */

  {
    type: "checker",
    rows: [
      {
        pattern: ["green", "white"],
        blanks: [6, 7, 8, 9, 10, 11, 12]
      }
    ],
    instruction:
      "الگو را پیدا کن و سپس ادامه بده. الگوی تکرارشونده را در پایین یک بار تکرار کن."
  },


  /* -----------------------------------------
     مرحله 14
     شطرنجی
  ----------------------------------------- */

  {
    type: "checker",
    rows: [
      {
        pattern: ["white", "green", "white", "red"],
        blanks: [8, 9, 10, 11, 12, 13, 14]
      }
    ],
    instruction:
      "الگو را پیدا کن و سپس ادامه بده. الگوی تکرارشونده را در پایین یک بار تکرار کن."
  },


  /* -----------------------------------------
     مرحله 15
     شطرنجی
  ----------------------------------------- */

  {
    type: "checker",
    rows: [
      {
        pattern: ["green", "white"],
        blanks: [7, 8, 9, 10, 11, 12, 13]
      }
    ],
    instruction:
      "الگو را پیدا کن و سپس ادامه بده. الگوی تکرارشونده را در پایین یک بار تکرار کن."
  },


  /* -----------------------------------------
     مرحله 16
     چالش پایانی
  ----------------------------------------- */

  {
    type: "color",
    pattern: ["green", "white", "red", "white"],
    blanks: [8, 9, 10, 11, 12, 13, 14],
    instruction:
      "چالش آخر! الگوی تکرارشونده را پیدا کن و الگو را ادامه بده. سپس یک بار الگو را در سمت راست رسم کن."
  }

];


/* =========================================================
   ابزارهای صفحه
   ========================================================= */

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const finishScreen = document.getElementById("finishScreen");

const studentNameInput = document.getElementById("studentName");
const startBtn = document.getElementById("startBtn");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const stageCounter = document.getElementById("stageCounter");

const instruction = document.getElementById("instruction");

const taskArea = document.getElementById("taskArea");

const repeatBox = document.getElementById("repeatBox");
const repeatArea = document.getElementById("repeatArea");

const paletteBox = document.getElementById("paletteBox");
const palette = document.getElementById("palette");

const checkBtn = document.getElementById("checkBtn");
const clearBtn = document.getElementById("clearBtn");

const feedback = document.getElementById("feedback");

const restartBtn = document.getElementById("restartBtn");

const finishText = document.getElementById("finishText");
const finalScore = document.getElementById("finalScore");


/* =========================================================
   شروع صدا
   ========================================================= */

function initAudio() {

  if (!audioContext) {

    const AudioCtx =
      window.AudioContext ||
      window.webkitAudioContext;

    if (AudioCtx) {
      audioContext = new AudioCtx();
    }

  }

}


/* =========================================================
   صدای کوتاه
   ========================================================= */

function playTone(
  frequency = 500,
  duration = 0.09,
  type = "sine",
  volume = 0.045
) {

  try {

    initAudio();

    if (!audioContext) return;

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const oscillator =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();

    oscillator.type = type;

    oscillator.frequency.value =
      frequency;

    gain.gain.setValueAtTime(
      volume,
      audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();

    oscillator.stop(
      audioContext.currentTime + duration
    );

  } catch (e) {}

}


/* =========================================================
   صدای کلیک
   ========================================================= */

function playClick() {

  playTone(
    620,
    0.07,
    "sine",
    0.035
  );

}


/* =========================================================
   صدای درست
   ========================================================= */

function playCorrect() {

  playTone(523, 0.10, "sine", 0.05);

  setTimeout(() => {
    playTone(659, 0.10, "sine", 0.05);
  }, 100);

  setTimeout(() => {
    playTone(784, 0.18, "sine", 0.05);
  }, 210);

}


/* =========================================================
   صدای اشتباه
   ========================================================= */

function playWrong() {

  playTone(
    190,
    0.15,
    "sawtooth",
    0.035
  );

  setTimeout(() => {

    playTone(
      140,
      0.13,
      "sawtooth",
      0.03
    );

  }, 120);

}


/* =========================================================
   نام شکل ها
   ========================================================= */

const shapeInfo = {

  circle: {
    symbol: "●",
    color: "#42a5f5"
  },

  square: {
    symbol: "■",
    color: "#ffd84d"
  },

  triangle: {
    symbol: "▲",
    color: "#ef5350"
  },

  star: {
    symbol: "★",
    color: "#ffb52e"
  },

  heart: {
    symbol: "♥",
    color: "#ff73ad"
  },

  diamond: {
    symbol: "◆",
    color: "#58c86b"
  }

};


/* =========================================================
   ساخت خانه رنگی
   ========================================================= */

function createColorCell(
  color,
  editable,
  index,
  containerType = "main"
) {

  const cell =
    document.createElement("div");

  cell.className =
    "pattern-cell " +
    (editable ? "editable" : "locked");

  cell.dataset.index = index;

  cell.dataset.container =
    containerType;

  if (color) {

    cell.classList.add(
      "cell-" + color
    );

    cell.dataset.color = color;

  } else {

    cell.classList.add(
      "cell-white"
    );

    cell.dataset.color = "";

  }

  cell.addEventListener(
    "click",
    () => {

      if (!editable) return;

      if (!selectedTool) return;

      playClick();

      if (selectedTool === "eraser") {

        cell.dataset.color = "";

        cell.className =
          "pattern-cell editable cell-white";

      } else {

        cell.dataset.color =
          selectedTool;

        cell.className =
          "pattern-cell editable cell-" +
          selectedTool;

      }

    }
  );

  return cell;
}


/* =========================================================
   ساخت پالت رنگ
   ========================================================= */

function createColorPalette() {

  palette.innerHTML = "";

  const colors = [
    "green",
    "red",
    "blue",
    "yellow",
    "pink",
    "purple"
  ];

  colors.forEach(color => {

    const item =
      document.createElement("button");

    item.type = "button";

    item.className =
      "palette-item";

    item.style.background =
      COLORS[color];

    item.dataset.tool = color;

    item.setAttribute(
      "aria-label",
      color
    );

    item.addEventListener(
      "click",
      () => {

        selectedTool = color;

        document
          .querySelectorAll(".palette-item")
          .forEach(x =>
            x.classList.remove("selected")
          );

        item.classList.add("selected");

        playClick();

      }
    );

    palette.appendChild(item);

  });


  /* پاک کن */

  const eraser =
    document.createElement("button");

  eraser.type = "button";

  eraser.className =
    "palette-item eraser";

  eraser.textContent = "⌫";

  eraser.dataset.tool =
    "eraser";

  eraser.addEventListener(
    "click",
    () => {

      selectedTool = "eraser";

      document
        .querySelectorAll(".palette-item")
        .forEach(x =>
          x.classList.remove("selected")
        );

      eraser.classList.add("selected");

      playClick();

    }
  );

  palette.appendChild(eraser);
}


/* =========================================================
   ساخت پالت شکل
   ========================================================= */

function createShapePalette() {

  palette.innerHTML = "";

  const shapes = [
    "circle",
    "square",
    "triangle",
    "star",
    "heart",
    "diamond"
  ];

  shapes.forEach(shape => {

    const item =
      document.createElement("button");

    item.type = "button";

    item.className =
      "palette-item";

    item.style.background = "#fff";

    item.innerHTML =
      `<span style="
        color:${shapeInfo[shape].color};
        font-size:25px;
      ">${shapeInfo[shape].symbol}</span>`;

    item.dataset.tool =
      shape;

    item.addEventListener(
      "click",
      () => {

        selectedTool = shape;

        document
          .querySelectorAll(".palette-item")
          .forEach(x =>
            x.classList.remove("selected")
          );

        item.classList.add("selected");

        playClick();

      }
    );

    palette.appendChild(item);

  });


  /* پاک کن */

  const eraser =
    document.createElement("button");

  eraser.type = "button";

  eraser.className =
    "palette-item eraser";

  eraser.textContent = "⌫";

  eraser.addEventListener(
    "click",
    () => {

      selectedTool = "eraser";

      document
        .querySelectorAll(".palette-item")
        .forEach(x =>
          x.classList.remove("selected")
        );

      eraser.classList.add("selected");

      playClick();

    }
  );

  palette.appendChild(eraser);
}


/* =========================================================
   ساخت جدول اصلی
   ========================================================= */

function createMainColorGrid(stage) {

  taskArea.innerHTML = "";

  const wrap =
    document.createElement("div");

  wrap.className =
    "task-wrap";

  const grid =
    document.createElement("div");

  grid.className =
    "pattern-grid";

  currentCells = [];

  for (
    let i = 0;
    i < TOTAL_COLUMNS;
    i++
  ) {

    const patternIndex =
      i % stage.pattern.length;

    const shouldBeBlank =
      stage.blanks.includes(i);

    let color = null;

    if (!shouldBeBlank) {

      color =
        stage.pattern[patternIndex];

    }

    const cell =
      createColorCell(
        color,
        shouldBeBlank,
        i,
        "main"
      );

    grid.appendChild(cell);

    currentCells.push(cell);

  }

  wrap.appendChild(grid);

  taskArea.appendChild(wrap);

  createColorPalette();

  createRepeatGrid(stage.pattern);
}


/* =========================================================
   ساخت جدول شکل
   ========================================================= */

function createShapeGrid(stage) {

  taskArea.innerHTML = "";

  const wrap =
    document.createElement("div");

  wrap.className =
    "task-wrap";

  const grid =
    document.createElement("div");

  grid.className =
    "pattern-grid";

  currentCells = [];

  for (
    let i = 0;
    i < TOTAL_COLUMNS;
    i++
  ) {

    const patternIndex =
      i % stage.pattern.length;

    const shouldBeBlank =
      stage.blanks.includes(i);

    const cell =
      document.createElement("div");

    cell.className =
      "pattern-cell " +
      (shouldBeBlank
        ? "editable"
        : "locked");

    cell.dataset.index = i;

    if (!shouldBeBlank) {

      const shape =
        stage.pattern[patternIndex];

      cell.dataset.shape =
        shape;

      cell.innerHTML =
        `<span style="
          color:${shapeInfo[shape].color};
          font-size:clamp(12px,3vw,38px);
          line-height:1;
        ">${shapeInfo[shape].symbol}</span>`;

    } else {

      cell.dataset.shape = "";

      cell.classList.add(
        "cell-white"
      );

      cell.addEventListener(
        "click",
        () => {

          if (!selectedTool) return;

          playClick();

          if (
            selectedTool ===
            "eraser"
          ) {

            cell.innerHTML = "";

            cell.dataset.shape =
              "";

          } else {

            const shape =
              selectedTool;

            cell.dataset.shape =
              shape;

            cell.innerHTML =
              `<span style="
                color:${shapeInfo[shape].color};
                font-size:clamp(12px,3vw,38px);
                line-height:1;
              ">${shapeInfo[shape].symbol}</span>`;

          }

        }
      );

    }

    grid.appendChild(cell);

    currentCells.push(cell);

  }

  wrap.appendChild(grid);

  taskArea.appendChild(wrap);

  createShapePalette();

  repeatBox.classList.add("hidden");
}


/* =========================================================
   ساخت جدول تکرار
   دقیقاً ۶ خانه
   ========================================================= */

function createRepeatGrid(pattern) {

  repeatBox.classList.remove("hidden");

  repeatArea.innerHTML = "";

  repeatCells = [];

  for (
    let i = 0;
    i < 6;
    i++
  ) {

    const cell =
      document.createElement("div");

    cell.className =
      "repeat-cell";

    cell.dataset.index =
      i;

    cell.dataset.value =
      "";

    cell.addEventListener(
      "click",
      () => {

        if (!selectedTool) return;

        playClick();

        if (
          selectedTool ===
          "eraser"
        ) {

          cell.dataset.value =
            "";

          cell.className =
            "repeat-cell";

        } else {

          const value =
            selectedTool;

          cell.dataset.value =
            value;

          if (
            COLORS[value]
          ) {

            cell.className =
              "repeat-cell cell-" +
              value;

          } else {

            cell.className =
              "repeat-cell";

            cell.innerHTML =
              `<span style="
                color:${shapeInfo[value].color};
                font-size:28px;
              ">${shapeInfo[value].symbol}</span>`;

          }

        }

      }
    );

    repeatArea.appendChild(cell);

    repeatCells.push(cell);

  }
}


/* =========================================================
   ساخت سوال حذف شکل
   ========================================================= */

function createRemoveStage(stage) {

  taskArea.innerHTML = "";

  repeatBox.classList.add("hidden");

  paletteBox.classList.add("hidden");

  const row =
    document.createElement("div");

  row.className =
    "shape-row";

  selectedShapeAnswer = null;

  stage.shapes.forEach(
    (shape, index) => {

      const option =
        document.createElement("div");

      option.className =
        "shape-option";

      option.dataset.index =
        index;

      option.innerHTML =
        `<span style="
          color:${shapeInfo[shape].color};
          font-size:clamp(25px,6vw,60px);
          line-height:1;
        ">${shapeInfo[shape].symbol}</span>`;

      option.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".shape-option"
            )
            .forEach(x =>
              x.classList.remove(
                "selected"
              )
            );

          option.classList.add(
            "selected"
          );

          selectedShapeAnswer =
            index;

          playClick();

        }
      );

      row.appendChild(option);

    }
  );

  taskArea.appendChild(row);
}


/* =========================================================
   ساخت مرحله شطرنجی
   ========================================================= */

function createCheckerStage(stage) {

  taskArea.innerHTML = "";

  repeatBox.classList.add("hidden");

  paletteBox.classList.remove("hidden");

  currentCells = [];

  stage.rows.forEach(
    (rowData, rowIndex) => {

      const wrap =
        document.createElement("div");

      wrap.className =
        "task-wrap";

      const grid =
        document.createElement("div");

      grid.className =
        "pattern-grid";

      for (
        let i = 0;
        i < TOTAL_COLUMNS;
        i++
      ) {

        const shouldBeBlank =
          rowData.blanks.includes(i);

        const patternIndex =
          i % rowData.pattern.length;

        const color =
          shouldBeBlank
            ? null
            : rowData.pattern[
                patternIndex
              ];

        const cell =
          createColorCell(
            color,
            shouldBeBlank,
            i,
            "checker-" + rowIndex
          );

        grid.appendChild(cell);

        currentCells.push({
          cell,
          expected:
            rowData.pattern[
              patternIndex
            ]
        });

      }

      wrap.appendChild(grid);

      taskArea.appendChild(wrap);

    }
  );

  createColorPalette();
}


/* =========================================================
   پاک کردن پاسخ مرحله
   ========================================================= */

function clearCurrentAnswer() {

  playClick();

  const stage =
    stages[currentStage];

  if (
    stage.type ===
    "remove"
  ) {

    selectedShapeAnswer = null;

    document
      .querySelectorAll(
        ".shape-option"
      )
      .forEach(x =>
        x.classList.remove(
          "selected"
        )
      );

    feedback.textContent = "";

    return;
  }


  if (
    stage.type ===
    "checker"
  ) {

    currentCells.forEach(
      item => {

        if (
          item.cell.classList
            .contains("editable")
        ) {

          item.cell.dataset.color =
            "";

          item.cell.className =
            "pattern-cell editable cell-white";

        }

      }
    );

    feedback.textContent = "";

    return;
  }


  currentCells.forEach(
    cell => {

      if (
        cell.classList
          .contains("editable")
      ) {

        if (
          stage.type ===
          "shape"
        ) {

          cell.dataset.shape =
            "";

          cell.innerHTML = "";

        } else {

          cell.dataset.color =
            "";

          cell.className =
            "pattern-cell editable cell-white";

        }

      }

    }
  );


  repeatCells.forEach(
    cell => {

      cell.dataset.value =
        "";

      cell.className =
        "repeat-cell";

      cell.innerHTML =
        "";

    }
  );

  feedback.textContent = "";
}


/* =========================================================
   بررسی رنگ
   ========================================================= */

function checkColorStage(stage) {

  let correct = true;

  currentCells.forEach(
    cell => {

      const index =
        Number(
          cell.dataset.index
        );

      if (
        !stage.blanks.includes(
          index
        )
      ) {
        return;
      }

      const expected =
        stage.pattern[
          index %
          stage.pattern.length
        ];

      const actual =
        cell.dataset.color;

      if (actual !== expected) {
        correct = false;
      }

    }
  );


  /* بررسی الگوی سمت راست */

  const unitLength =
    stage.pattern.length;

  for (
    let i = 0;
    i < 6;
    i++
  ) {

    const actual =
      repeatCells[i]
        .dataset.value;

    if (i < unitLength) {

      if (
        actual !==
        stage.pattern[i]
      ) {

        correct = false;

      }

    } else {

      if (actual !== "") {

        correct = false;

      }

    }

  }

  return correct;
}


/* =========================================================
   بررسی شکل
   ========================================================= */

function checkShapeStage(stage) {

  for (
    const cell of currentCells
  ) {

    const index =
      Number(
        cell.dataset.index
      );

    if (
      !stage.blanks.includes(
        index
      )
    ) {
      continue;
    }

    const expected =
      stage.pattern[
        index %
        stage.pattern.length
      ];

    if (
      cell.dataset.shape !==
      expected
    ) {

      return false;

    }

  }

  return true;
}


/* =========================================================
   بررسی شطرنجی
   ========================================================= */

function checkCheckerStage(stage) {

  let correct = true;

  currentCells.forEach(
    item => {

      const cell =
        item.cell;

      if (
        !cell.classList
          .contains("editable")
      ) {
        return;
      }

      if (
        cell.dataset.color !==
        item.expected
      ) {

        correct = false;

      }

    }
  );

  return correct;
}


/* =========================================================
   بررسی سوال حذف
   ========================================================= */

function checkRemoveStage(stage) {

  return (
    selectedShapeAnswer ===
    stage.answer
  );

}


/* =========================================================
   بررسی کلی
   ========================================================= */

function checkAnswer() {

  const stage =
    stages[currentStage];

  let correct = false;


  if (
    stage.type ===
    "color"
  ) {

    correct =
      checkColorStage(stage);

  }


  else if (
    stage.type ===
    "shape"
  ) {

    correct =
      checkShapeStage(stage);

  }


  else if (
    stage.type ===
    "remove"
  ) {

    correct =
      checkRemoveStage(stage);

  }


  else if (
    stage.type ===
    "checker"
  ) {

    correct =
      checkCheckerStage(stage);

  }


  if (correct) {

    score++;

    playCorrect();

    feedback.innerHTML =
      `🌟 آفرین ${studentName || "قهرمان"}! خیلی خوب الگو را پیدا کردی!`;

    feedback.style.color =
      "#21a454";

    taskArea.classList.add(
      "success-animation"
    );

    setTimeout(() => {

      taskArea.classList.remove(
        "success-animation"
      );

    }, 600);

  } else {

    playWrong();

    feedback.innerHTML =
      "🌱 اشکالی ندارد! دوباره با دقت به تکرار الگو نگاه کن.";

    feedback.style.color =
      "#e34c86";

  }

}


/* =========================================================
   نمایش مرحله
   ========================================================= */

function renderStage() {

  const stage =
    stages[currentStage];

  instruction.textContent =
    stage.instruction;

  feedback.textContent =
    "";

  selectedTool = null;

  selectedShapeAnswer = null;

  repeatCells = [];

  currentCells = [];


  paletteBox.classList.remove(
    "hidden"
  );


  if (
    stage.type ===
    "color"
  ) {

    createMainColorGrid(
      stage
    );

  }


  else if (
    stage.type ===
    "shape"
  ) {

    createShapeGrid(
      stage
    );

  }


  else if (
    stage.type ===
    "remove"
  ) {

    createRemoveStage(
      stage
    );

  }


  else if (
    stage.type ===
    "checker"
  ) {

    createCheckerStage(
      stage
    );

  }


  stageCounter.textContent =
    `مرحله ${currentStage + 1} از ${stages.length}`;


  prevBtn.disabled =
    currentStage === 0;

  nextBtn.disabled =
    currentStage ===
    stages.length - 1;


  /* دکمه بررسی */

  checkBtn.classList.remove(
    "hidden"
  );

}


/* =========================================================
   رفتن به مرحله بعد
   ========================================================= */

function nextStage() {

  if (
    currentStage <
    stages.length - 1
  ) {

    currentStage++;

    renderStage();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  } else {

    showFinish();

  }

}


/* =========================================================
   مرحله قبل
   ========================================================= */

function previousStage() {

  if (
    currentStage > 0
  ) {

    currentStage--;

    renderStage();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }

}


/* =========================================================
   پایان بازی
   ========================================================= */

function showFinish() {

  gameScreen.classList.add(
    "hidden"
  );

  finishScreen.classList.remove(
    "hidden"
  );

  finishText.innerHTML =
    `خیلی خوب پیش رفتی، <strong>${studentName || "قهرمان کوچولو"}</strong>!`;

  finalScore.textContent =
    `امتیاز: ${score} از ${stages.length} 🌟`;

  playCorrect();

}


/* =========================================================
   شروع بازی
   ========================================================= */

function startGame() {

  initAudio();

  studentName =
    studentNameInput.value.trim();

  if (!studentName) {

    studentName =
      "قهرمان کوچولو";

  }

  score = 0;

  currentStage = 0;

  startScreen.classList.add(
    "hidden"
  );

  finishScreen.classList.add(
    "hidden"
  );

  gameScreen.classList.remove(
    "hidden"
  );

  renderStage();

}


/* =========================================================
   شروع مجدد
   ========================================================= */

function restartGame() {

  score = 0;

  currentStage = 0;

  finishScreen.classList.add(
    "hidden"
  );

  startScreen.classList.remove(
    "hidden"
  );

}


/* =========================================================
   رویدادها
   ========================================================= */

startBtn.addEventListener(
  "click",
  startGame
);

prevBtn.addEventListener(
  "click",
  () => {

    playClick();

    previousStage();

  }
);

nextBtn.addEventListener(
  "click",
  () => {

    playClick();

    nextStage();

  }
);

checkBtn.addEventListener(
  "click",
  checkAnswer
);

clearBtn.addEventListener(
  "click",
  clearCurrentAnswer
);

restartBtn.addEventListener(
  "click",
  restartGame
);


/* Enter برای شروع */

studentNameInput.addEventListener(
  "keydown",
  event => {

    if (
      event.key ===
      "Enter"
    ) {

      startGame();

    }

  }
);
