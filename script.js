const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");

const studentNameInput = document.getElementById("studentName");
const startButton = document.getElementById("startButton");

const playerName = document.getElementById("playerName");
const scoreElement = document.getElementById("score");

const questionTypeElement = document.getElementById("questionType");
const expressionElement = document.getElementById("expression");
const answerInput = document.getElementById("answerInput");

const numberLine = document.getElementById("numberLine");

const undoButton = document.getElementById("undoButton");
const clearButton = document.getElementById("clearButton");
const checkButton = document.getElementById("checkButton");

const feedback = document.getElementById("feedback");
const fireworkContainer =
    document.getElementById("fireworkContainer");


/* ================================
   وضعیت بازی
================================ */

let score = 0;
let currentQuestion = null;
let drawnMoves = [];

let isDrawing = false;
let drawingStart = null;

let previewSvg = null;

let audioContext = null;


/* ================================
   تبدیل عدد
================================ */

function toPersianNumber(value) {

    const digits = "۰۱۲۳۴۵۶۷۸۹";

    return String(value).replace(
        /\d/g,
        d => digits[d]
    );
}


function toEnglishNumber(value) {

    const persian = "۰۱۲۳۴۵۶۷۸۹";
    const arabic = "٠١٢٣٤٥٦٧٨٩";

    return String(value)
        .replace(
            /[۰-۹]/g,
            d => persian.indexOf(d)
        )
        .replace(
            /[٠-٩]/g,
            d => arabic.indexOf(d)
        );
}


/* ================================
   عدد تصادفی
================================ */

function randomInt(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}


/* ================================
   صدا
================================ */

function initializeAudio() {

    if (!audioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (AudioContext) {
            audioContext = new AudioContext();
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

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    const startTime =
        audioContext.currentTime + delay;

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
    gain.connect(audioContext.destination);

    oscillator.start(startTime);

    oscillator.stop(
        startTime + duration + 0.03
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


/* ================================
   ساخت محور ۰ تا ۲۰
================================ */

function createNumberLine() {

    numberLine.innerHTML = "";

    for (let i = 0; i <= 20; i++) {

        const position =
            4 + (i / 20) * 92;

        const tick =
            document.createElement("div");

        tick.className = "tick";
        tick.style.left = `${position}%`;

        numberLine.appendChild(tick);


        const number =
            document.createElement("div");

        number.className = "number";

        number.dataset.value = i;

        number.textContent =
            toPersianNumber(i);

        number.style.left =
            `${position}%`;

        numberLine.appendChild(number);
    }
}


/* ================================
   پاک کردن جواب
================================ */

function resetAnswer() {

    answerInput.value = "";

    answerInput.classList.remove(
        "correct",
        "wrong"
    );
}


/* ================================
   ساخت سؤال
================================ */

function generateQuestion() {

    clearDrawing();

    feedback.textContent = "";

    resetAnswer();


    const type = randomInt(1, 3);


    /* --------------------------------
       جمع
       
       مثال:
       ۷ + ۵

       مسیر:
       ۰ → ۷ → ۱۲
    -------------------------------- */

    if (type === 1) {

        const a = randomInt(1, 15);

        const b =
            randomInt(1, 20 - a);

        currentQuestion = {

            type: "جمع",

            start: 0,

            operations: [

                {
                    operator: "+",
                    value: a
                },

                {
                    operator: "+",
                    value: b
                }

            ],

            answer: a + b
        };


        questionTypeElement.textContent =
            "جمع";


        expressionElement.textContent =
            `${toPersianNumber(a)} + ${toPersianNumber(b)}`;

        return;
    }


    /* --------------------------------
       تفریق

       مثال:
       ۱۷ − ۱۲

       مسیر:
       ۰ → ۱۷ → ۵
    -------------------------------- */

    if (type === 2) {

        const a = randomInt(2, 20);

        const b =
            randomInt(1, a - 1);

        currentQuestion = {

            type: "تفریق",

            start: 0,

            operations: [

                {
                    operator: "+",
                    value: a
                },

                {
                    operator: "-",
                    value: b
                }

            ],

            answer: a - b
        };


        questionTypeElement.textContent =
            "تفریق";


        expressionElement.textContent =
            `${toPersianNumber(a)} − ${toPersianNumber(b)}`;

        return;
    }


    /* --------------------------------
       سه عبارتی

       مثال:
       ۵ + ۷ − ۳

       مسیر:
       ۰ → ۵ → ۱۲ → ۹
    -------------------------------- */

    let a;
    let b;
    let c;

    let op1;
    let op2;

    let p1;
    let p2;

    let valid = false;


    while (!valid) {

        a = randomInt(1, 12);

        b = randomInt(1, 8);

        c = randomInt(1, 8);


        const combinations = [

            ["+", "+"],
            ["+", "-"],
            ["-", "+"],
            ["-", "-"]

        ];


        const selected =
            combinations[
                randomInt(
                    0,
                    combinations.length - 1
                )
            ];


        op1 = selected[0];
        op2 = selected[1];


        /*
           حرکت اول همیشه
           از صفر به a
        */

        p1 = a;


        /*
           حرکت دوم
        */

        if (op1 === "+") {
            p1 = a + b;
        } else {
            p1 = a - b;
        }


        /*
           حرکت سوم
        */

        if (op2 === "+") {
            p2 = p1 + c;
        } else {
            p2 = p1 - c;
        }


        if (
            p1 >= 0 &&
            p1 <= 20 &&
            p2 >= 0 &&
            p2 <= 20
        ) {

            valid = true;
        }
    }


    currentQuestion = {

        type: "سه‌عبارتی",

        start: 0,

        operations: [

            {
                operator: "+",
                value: a
            },

            {
                operator: op1,
                value: b
            },

            {
                operator: op2,
                value: c
            }

        ],

        answer: p2
    };


    questionTypeElement.textContent =
        "جمع و تفریق";


    const visibleOp1 =
        op1 === "+" ? "+" : "−";

    const visibleOp2 =
        op2 === "+" ? "+" : "−";


    expressionElement.textContent =
        `${toPersianNumber(a)} ${visibleOp1} ${toPersianNumber(b)} ${visibleOp2} ${toPersianNumber(c)}`;
}


/* ================================
   پیدا کردن موقعیت عدد
================================ */

function getNumberPosition(value) {

    const number =
        numberLine.querySelector(
            `.number[data-value="${value}"]`
        );

    if (!number) return null;


    const lineRect =
        numberLine.getBoundingClientRect();

    const numberRect =
        number.getBoundingClientRect();


    const mobile =
        window.innerWidth <= 600;


    return {

        x:
            numberRect.left +
            numberRect.width / 2 -
            lineRect.left,

        y:
            mobile ? 74 : 88
    };
}


/* ================================
   پیدا کردن عدد زیر انگشت
================================ */

function getNumberFromPointer(event) {

    const rect =
        numberLine.getBoundingClientRect();

    const x =
        event.clientX - rect.left;


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
            ((percent - 4) / 92) * 20
        );


    return Math.max(
        0,
        Math.min(
            20,
            value
        )
    );
}


/* ================================
   نقطه شروع حرکت بعدی
================================ */

function getExpectedStart() {

    if (!currentQuestion) {
        return 0;
    }


    if (drawnMoves.length === 0) {
        return 0;
    }


    return drawnMoves[
        drawnMoves.length - 1
    ].end;
}


/* ================================
   شروع کشیدن
================================ */

numberLine.addEventListener(
    "pointerdown",
    event => {

        if (!currentQuestion) return;

        event.preventDefault();


        const value =
            getNumberFromPointer(event);


        const expected =
            getExpectedStart();


        if (value !== expected) {

            return;
        }


        isDrawing = true;

        drawingStart = value;


        try {

            numberLine.setPointerCapture(
                event.pointerId
            );

        } catch (e) {}


        createPreview(
            drawingStart,
            event
        );
    }
);


/* ================================
   حرکت انگشت
================================ */

numberLine.addEventListener(
    "pointermove",
    event => {

        if (
            !isDrawing ||
            drawingStart === null
        ) {
            return;
        }

        event.preventDefault();


        updatePreview(
            drawingStart,
            event
        );
    }
);


/* ================================
   پایان حرکت
================================ */

numberLine.addEventListener(
    "pointerup",
    event => {

        if (
            !isDrawing ||
            drawingStart === null
        ) {
            return;
        }


        event.preventDefault();


        const end =
            getNumberFromPointer(event);


        removePreview();


        isDrawing = false;


        try {

            numberLine.releasePointerCapture(
                event.pointerId
            );

        } catch (e) {}


        if (end === drawingStart) {

            drawingStart = null;

            return;
        }


        addMove(
            drawingStart,
            end
        );


        drawingStart = null;
    }
);


/* ================================
   لغو حرکت
================================ */

numberLine.addEventListener(
    "pointercancel",
    () => {

        removePreview();

        isDrawing = false;

        drawingStart = null;
    }
);


/* ================================
   پیش‌نمایش کمان
================================ */

function createPreview(
    start,
    event
) {

    removePreview();


    previewSvg =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );


    previewSvg.classList.add(
        "drawing-preview"
    );


    previewSvg.setAttribute(
        "viewBox",
        `0 0 ${numberLine.clientWidth} ${numberLine.clientHeight}`
    );


    previewSvg.setAttribute(
        "preserveAspectRatio",
        "none"
    );


    const path =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );


    previewSvg.appendChild(path);

    numberLine.appendChild(
        previewSvg
    );


    updatePreview(
        start,
        event
    );
}


/* ================================
   به‌روزرسانی کمان
================================ */

function updatePreview(
    start,
    event
) {

    if (!previewSvg) return;


    const startPos =
        getNumberPosition(start);


    const current =
        getNumberFromPointer(event);


    const endPos =
        getNumberPosition(current);


    if (
        !startPos ||
        !endPos
    ) {
        return;
    }


    const distance =
        Math.abs(
            endPos.x -
            startPos.x
        );


    const curve =
        Math.min(
            65,
            Math.max(
                25,
                distance * 0.25
            )
        );


    const middleX =
        (
            startPos.x +
            endPos.x
        ) / 2;


    const middleY =
        startPos.y - curve;


    const path =
        previewSvg.querySelector(
            "path"
        );


    path.setAttribute(
        "d",
        `M ${startPos.x} ${startPos.y}
         Q ${middleX} ${middleY}
         ${endPos.x} ${endPos.y}`
    );
}


/* ================================
   حذف پیش‌نمایش
================================ */

function removePreview() {

    if (previewSvg) {

        previewSvg.remove();

        previewSvg = null;
    }
}


/* ================================
   ثبت حرکت
================================ */

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

        start: start,

        end: end,

        direction: direction,

        distance: distance
    });


    drawMove(
        start,
        end,
        direction,
        distance
    );
}


/* ================================
   رسم کمان
================================ */

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


    const width =
        numberLine.clientWidth;

    const height =
        numberLine.clientHeight;


    const curve =
        Math.min(
            65,
            Math.max(
                25,
                Math.abs(
                    endPos.x -
                    startPos.x
                ) * 0.25
            )
        );


    const middleX =
        (
            startPos.x +
            endPos.x
        ) / 2;


    const middleY =
        startPos.y - curve;


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
        `0 0 ${width} ${height}`
    );


    svg.setAttribute(
        "preserveAspectRatio",
        "none"
    );


    /* ------------------------------
       فلش کوچک و ظریف
    ------------------------------ */

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


    const markerId =
        "arrow_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .slice(2);


    marker.setAttribute(
        "id",
        markerId
    );


    marker.setAttribute(
        "markerWidth",
        "7"
    );


    marker.setAttribute(
        "markerHeight",
        "7"
    );


    marker.setAttribute(
        "refX",
        "6"
    );


    marker.setAttribute(
        "refY",
        "3.5"
    );


    marker.setAttribute(
        "orient",
        "auto"
    );


    const head =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );


    head.setAttribute(
        "d",
        "M 0 0 L 7 3.5 L 0 7 Z"
    );


    head.setAttribute(
        "fill",
        direction === "right"
            ? "#ed7097"
            : "#62a4e6"
    );


    marker.appendChild(head);

    defs.appendChild(marker);

    svg.appendChild(defs);


    /* ------------------------------
       منحنی
    ------------------------------ */

    const path =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );


    path.classList.add(
        "curved-path"
    );


    path.setAttribute(
        "d",
        `M ${startPos.x} ${startPos.y}
         Q ${middleX} ${middleY}
         ${endPos.x} ${endPos.y}`
    );


    path.setAttribute(
        "marker-end",
        `url(#${markerId})`
    );


    svg.appendChild(path);


    /* ------------------------------
       مقدار حرکت
    ------------------------------ */

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
        direction === "right"
            ? `+${toPersianNumber(distance)}`
            : `−${toPersianNumber(distance)}`;


    svg.appendChild(text);


    numberLine.appendChild(svg);


    /* ------------------------------
       نقطه شروع
    ------------------------------ */

    const dot =
        document.createElement("div");


    dot.className =
        "start-dot";


    dot.style.left =
        `${startPos.x}px`;


    dot.style.top =
        `${startPos.y}px`;


    numberLine.appendChild(dot);
}


/* ================================
   حذف آخرین حرکت
================================ */

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


        if (curves.length) {

            curves[
                curves.length - 1
            ].remove();
        }


        const dots =
            numberLine.querySelectorAll(
                ".start-dot"
            );


        if (dots.length) {

            dots[
                dots.length - 1
            ].remove();
        }
    }
);


/* ================================
   پاک کردن همه حرکت‌ها
================================ */

clearButton.addEventListener(
    "click",
    () => {

        clearDrawing();

        feedback.textContent = "";

        answerInput.value = "";

        answerInput.classList.remove(
            "correct",
            "wrong"
        );
    }
);


function clearDrawing() {

    drawnMoves = [];


    numberLine
        .querySelectorAll(
            ".curved-move"
        )
        .forEach(
            element =>
                element.remove()
        );


    numberLine
        .querySelectorAll(
            ".start-dot"
        )
        .forEach(
            element =>
                element.remove()
        );


    removePreview();
}


/* ================================
   بررسی پاسخ
================================ */

checkButton.addEventListener(
    "click",
    () => {

        if (!currentQuestion) {
            return;
        }


        /* مسیر صحیح */

        const correctMoves = [];

        let position =
            0;


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

                start:
                    position,

                end:
                    newPosition
            });


            position =
                newPosition;
        }


        /* تعداد حرکت‌ها */

        if (
            drawnMoves.length !==
            correctMoves.length
        ) {

            showWrong(
                "مسیر را کامل روی محور بکش 🌱"
            );

            return;
        }


        /* بررسی مسیر */

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

                showWrong(
                    "مسیر روی محور درست نیست؛ دوباره امتحان کن 🌱"
                );

                return;
            }
        }


        /* بررسی عدد داخل کادر */

        const raw =
            answerInput.value.trim();


        if (raw === "") {

            showWrong(
                "جوابت را در کادر بنویس 🌷"
            );

            return;
        }


        const userAnswer =
            Number(
                toEnglishNumber(raw)
            );


        if (
            userAnswer !==
            currentQuestion.answer
        ) {

            answerInput.classList.remove(
                "correct"
            );

            answerInput.classList.add(
                "wrong"
            );


            showWrong(
                "عدد جواب درست نیست؛ دوباره روی محور نگاه کن 🌱"
            );

            return;
        }


        /* همه چیز صحیح است */

        answerInput.classList.remove(
            "wrong"
        );

        answerInput.classList.add(
            "correct"
        );


        showCorrect();
    }
);


/* ================================
   درست
================================ */

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
        1800
    );
}


/* ================================
   غلط
================================ */

function showWrong(message) {

    feedback.textContent =
        message;

    feedback.style.color =
        "#d65b70";

    playWrongSound();
}


/* ================================
   فشفشه
================================ */

function launchFireworks() {

    fireworkContainer.innerHTML = "";


    const colors = [

        "#ff5c8a",
        "#ffd166",
        "#55c2ff",
        "#8bd450",
        "#a875ff",
        "#ff8c42"

    ];


    const centers = [

        { x: "25%", y: "32%" },
        { x: "50%", y: "25%" },
        { x: "75%", y: "35%" },
        { x: "40%", y: "55%" },
        { x: "65%", y: "52%" }

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
                    randomInt(70, 190);


                particle.style.setProperty(
                    "--x",
                    `${Math.cos(angle) * distance}px`
                );


                particle.style.setProperty(
                    "--y",
                    `${Math.sin(angle) * distance}px`
                );


                particle.style.animationDelay =
                    `${Math.random() * 0.18}s`;


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


/* ================================
   شروع بازی
================================ */

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


        score = 0;


        scoreElement.textContent =
            toPersianNumber(0);


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


/* ================================
   Enter
================================ */

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


/* ================================
   شروع اولیه
================================ */

createNumberLine();
