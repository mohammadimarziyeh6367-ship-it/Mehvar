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

let previewSvg = null;

let audioContext = null;


/* =====================================================
   اعداد فارسی
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
   جهت عبارت ریاضی
===================================================== */

function setMathDirection() {

    questionElement.style.direction =
        "ltr";

    questionElement.style.unicodeBidi =
        "isolate";

    questionElement.style.textAlign =
        "center";
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
        audioContext.state ===
        "suspended"
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
        startTime + .02
    );


    gain.gain.exponentialRampToValueAtTime(
        .001,
        startTime + duration
    );


    oscillator.connect(gain);

    gain.connect(
        audioContext.destination
    );


    oscillator.start(
        startTime
    );


    oscillator.stop(
        startTime +
        duration +
        .03
    );
}


function playCorrectSound() {

    initializeAudio();


    playTone(
        523.25,
        .18,
        "sine",
        .09,
        0
    );


    playTone(
        659.25,
        .18,
        "sine",
        .09,
        .13
    );


    playTone(
        783.99,
        .30,
        "sine",
        .10,
        .26
    );
}


function playWrongSound() {

    initializeAudio();


    playTone(
        260,
        .20,
        "triangle",
        .06,
        0
    );


    playTone(
        190,
        .28,
        "triangle",
        .06,
        .18
    );
}


/* =====================================================
   ساخت محور
===================================================== */

function createNumberLine() {

    numberLine.innerHTML = "";


    for (
        let i = 0;
        i <= 20;
        i++
    ) {

        const position =
            4 +
            (i / 20) *
            92;


        const tick =
            document.createElement(
                "div"
            );


        tick.className =
            "tick";


        tick.style.left =
            `${position}%`;


        numberLine.appendChild(
            tick
        );


        const number =
            document.createElement(
                "div"
            );


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
   تولید سؤال
===================================================== */

function generateQuestion() {

    clearDrawing();

    feedback.textContent = "";


    const type =
        randomInt(1, 3);


    /* =================================================
       جمع
    ================================================= */

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

            answer:
                a + b
        };


        questionTypeElement.textContent =
            "جمع";


        questionElement.textContent =
            `${toPersianNumber(a)} + ${toPersianNumber(b)} = ؟`;


        setMathDirection();


        movementInfo.textContent =
            `از ${toPersianNumber(a)} شروع کن و ${toPersianNumber(b)} خانه به راست برو.`;

        return;
    }


    /* =================================================
       تفریق
    ================================================= */

    if (type === 2) {

        /*
          عدد اول همیشه بزرگ‌تر است
        */

        const a =
            randomInt(2, 20);


        const b =
            randomInt(1, a - 1);


        currentQuestion = {

            type: "تفریق",

            start: a,

            operations: [

                {
                    operator: "-",
                    value: b
                }

            ],

            answer:
                a - b
        };


        questionTypeElement.textContent =
            "تفریق";


        questionElement.textContent =
            `${toPersianNumber(a)} − ${toPersianNumber(b)} = ؟`;


        setMathDirection();


        movementInfo.textContent =
            `از ${toPersianNumber(a)} شروع کن و ${toPersianNumber(b)} خانه به چپ برو.`;

        return;
    }


    /* =================================================
       عبارت سه‌تایی
    ================================================= */

    let valid = false;

    let a;
    let b;
    let c;

    let op1;
    let op2;

    let result1;
    let result2;


    while (!valid) {

        a =
            randomInt(3, 15);


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


        result1 =
            op1 === "+"
                ? a + b
                : a - b;


        result2 =
            op2 === "+"
                ? result1 + c
                : result1 - c;


        /*
          هر دو مرحله باید
          داخل محور باشند
        */

        if (
            result1 >= 0 &&
            result1 <= 20 &&
            result2 >= 0 &&
            result2 <= 20
        ) {

            valid = true;
        }
    }


    currentQuestion = {

        type:
            "سه‌عبارتی",

        start:
            a,

        operations: [

            {
                operator:
                    op1,

                value:
                    b
            },

            {
                operator:
                    op2,

                value:
                    c
            }

        ],

        answer:
            result2
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
        `${toPersianNumber(a)} ${visibleOp1} ${toPersianNumber(b)} ${visibleOp2} ${toPersianNumber(c)} = ؟`;


    setMathDirection();


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


    const mobile =
        window.innerWidth <= 600;


    return {

        x:
            numberRect.left +
            numberRect.width / 2 -
            lineRect.left,

        y:
            mobile
                ? 74
                : 88
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
                (x / rect.width) *
                100
            )
        );


    const value =
        Math.round(
            (
                (percent - 4) /
                92
            ) * 20
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


    if (
        drawnMoves.length === 0
    ) {

        return currentQuestion.start;
    }


    return drawnMoves[
        drawnMoves.length - 1
    ].end;
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


        event.preventDefault();


        const value =
            getNumberFromPointer(
                event
            );


        const expectedStart =
            getExpectedNextStart();


        if (
            value !==
            expectedStart
        ) {

            movementInfo.textContent =
                `از عدد ${toPersianNumber(expectedStart)} شروع کن 🌱`;

            return;
        }


        isDrawing = true;

        drawingStart =
            value;


        try {

            numberLine.setPointerCapture(
                event.pointerId
            );

        } catch (error) {}


        createPreview(
            drawingStart,
            event
        );
    }
);


/* =====================================================
   حرکت انگشت
===================================================== */

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


        event.preventDefault();


        const end =
            getNumberFromPointer(
                event
            );


        removePreview();


        isDrawing = false;


        try {

            numberLine.releasePointerCapture(
                event.pointerId
            );

        } catch (error) {}


        if (
            end === drawingStart
        ) {

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


/* =====================================================
   لغو لمس
===================================================== */

numberLine.addEventListener(
    "pointercancel",
    () => {

        removePreview();

        isDrawing = false;

        drawingStart = null;
    }
);


/* =====================================================
   کمان موقت
===================================================== */

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


    const path =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );


    path.classList.add(
        "preview-path"
    );


    previewSvg.appendChild(
        path
    );


    numberLine.appendChild(
        previewSvg
    );


    updatePreview(
        start,
        event
    );
}


function updatePreview(
    start,
    event
) {

    if (!previewSvg) {
        return;
    }


    const startPos =
        getNumberPosition(start);


    const rect =
        numberLine.getBoundingClientRect();


    let currentX =
        event.clientX -
        rect.left;


    currentX =
        Math.max(
            0,
            Math.min(
                rect.width,
                currentX
            )
        );


    const currentValue =
        getNumberFromPointer(
            event
        );


    const endPos =
        getNumberPosition(
            currentValue
        );


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


    const curveHeight =
        Math.min(
            65,
            Math.max(
                25,
                distance * .25
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


function removePreview() {

    if (previewSvg) {

        previewSvg.remove();

        previewSvg = null;
    }
}


/* =====================================================
   ثبت حرکت
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

        start:
            start,

        end:
            end,

        direction:
            direction,

        distance:
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
   رسم کمان نهایی
===================================================== */

function drawMove(
    start,
    end,
    direction,
    distance
) {

    const startPos =
        getNumberPosition(
            start
        );


    const endPos =
        getNumberPosition(
            end
        );


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


    const curveHeight =
        Math.min(
            65,
            Math.max(
                25,
                Math.abs(
                    endPos.x -
                    startPos.x
                ) * .25
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
        `0 0 ${width} ${height}`
    );


    svg.setAttribute(
        "preserveAspectRatio",
        "none"
    );


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
        "arrow" +
        Date.now() +
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


    marker.appendChild(
        head
    );


    defs.appendChild(
        marker
    );


    svg.appendChild(
        defs
    );


    const path =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );


    path.classList.add(
        "curved-path"
    );


    if (
        direction === "left"
    ) {

        path.style.stroke =
            "#62a4e6";
    }


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


    svg.appendChild(
        path
    );


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
   پاک کردن حرکت قبلی
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
            curves.length > 0
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
            dots.length > 0
        ) {

            dots[
                dots.length - 1
            ].remove();
        }


        feedback.textContent = "";


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

        feedback.textContent = "";

        movementInfo.textContent =
            "از عدد مبدأ شروع کن و حرکتت را بکش ✏️";
    }
);


function clearDrawing() {

    drawnMoves = [];


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


    removePreview();
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


        const correctMoves = [];

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

                start:
                    position,

                end:
                    newPosition
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


        let correct = true;


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

                correct = false;

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
   پاسخ صحیح
===================================================== */

function showCorrect() {

    score++;

    scoreElement.textContent =
        toPersianNumber(score);


    /* =========================================
       نمایش جواب نهایی جلوی عبارت
    ========================================= */

    const answer =
        currentQuestion.answer;


    const answerText =
        toPersianNumber(answer);


    /*
      علامت سؤال را با جواب عوض می‌کنیم
    */

    questionElement.textContent =
        questionElement.textContent.replace(
            "؟",
            answerText
        );


    feedback.textContent =
        "آفرین! کاملاً درست انجام دادی 🎉";


    feedback.style.color =
        "#39956c";


    /* صدای موفقیت */

    playCorrectSound();


    /* فشفشه */

    launchFireworks();


    /*
      کمی مکث می‌کنیم تا دانش‌آموز
      جواب را ببیند، سپس سؤال جدید
    */

    setTimeout(
        () => {

            generateQuestion();

        },
        1800
    );
}


/* =====================================================
   پاسخ اشتباه
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
                    `${Math.cos(angle) * distance}px`
                );


                particle.style.setProperty(
                    "--y",
                    `${Math.sin(angle) * distance}px`
                );


                particle.style.animationDelay =
                    `${Math.random() * .18}s`;


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


/* =====================================================
   Enter
===================================================== */

studentNameInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Enter"
        ) {

            startButton.click();
        }
    }
);


/* =====================================================
   اجرای اولیه
===================================================== */

createNumberLine();
