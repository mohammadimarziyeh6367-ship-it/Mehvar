/* =====================================================
   بازی «محور اعداد»
   مناسب کلاس اول
   ===================================================== */


/* =====================================================
   گرفتن عناصر HTML
   ===================================================== */

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

const expressionElement =
    document.getElementById("expression");

const answerInput =
    document.getElementById("answerInput");

const numberLine =
    document.getElementById("numberLine");

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


/* =====================================================
   سیستم صدا
   ===================================================== */

let audioContext = null;


/* =====================================================
   تبدیل اعداد
   ===================================================== */

function toPersianNumber(value) {

    const digits =
        "۰۱۲۳۴۵۶۷۸۹";

    return String(value).replace(
        /\d/g,
        digit => digits[digit]
    );
}


function toEnglishNumber(value) {

    const persian =
        "۰۱۲۳۴۵۶۷۸۹";

    const arabic =
        "٠١٢٣٤٥٦٧٨٩";

    return String(value)
        .replace(
            /[۰-۹]/g,
            digit =>
                persian.indexOf(digit)
        )
        .replace(
            /[٠-٩]/g,
            digit =>
                arabic.indexOf(digit)
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
   فعال کردن صدا
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


/* =====================================================
   ساخت یک نت
   ===================================================== */

function playTone(
    frequency,
    duration,
    type = "sine",
    volume = 0.08,
    delay = 0
) {

    if (!audioContext) {

        initializeAudio();
    }


    if (!audioContext) {
        return;
    }


    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();


    oscillator.type =
        type;


    const startTime =
        audioContext.currentTime +
        delay;


    oscillator.frequency.setValueAtTime(
        frequency,
        startTime
    );


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


    oscillator.start(
        startTime
    );


    oscillator.stop(
        startTime +
        duration +
        0.05
    );
}


/* =====================================================
   صدای پاسخ صحیح
   ===================================================== */

function playCorrectSound() {

    initializeAudio();


    playTone(
        523.25,
        0.18,
        "sine",
        0.10,
        0
    );


    playTone(
        659.25,
        0.18,
        "sine",
        0.10,
        0.13
    );


    playTone(
        783.99,
        0.28,
        "sine",
        0.11,
        0.26
    );


    playTone(
        1046.50,
        0.35,
        "sine",
        0.09,
        0.42
    );
}


/* =====================================================
   صدای پاسخ اشتباه
   ===================================================== */

function playWrongSound() {

    initializeAudio();


    playTone(
        300,
        0.18,
        "triangle",
        0.07,
        0
    );


    playTone(
        220,
        0.28,
        "triangle",
        0.06,
        0.17
    );
}


/* =====================================================
   ساخت محور ۰ تا ۲۰
   ===================================================== */

function createNumberLine() {

    numberLine.innerHTML = "";


    for (
        let i = 0;
        i <= 20;
        i++
    ) {

        /*
           فاصله از لبه‌ها کمی بیشتر است
           تا محور از صفحه بیرون نزند.
        */

        const position =
            4 +
            (i / 20) * 92;


        /* خط کوچک روی محور */

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


        /* عدد */

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
   ساخت سؤال جدید
   ===================================================== */

function generateQuestion() {

    clearDrawing();

    feedback.textContent = "";

    resetAnswer();


    /*
       ۱ = جمع
       ۲ = تفریق
       ۳ = سه عبارتی
    */

    const type =
        randomInt(1, 3);


    /* =================================================
       جمع
       
       مثال:
       ۷ + ۵

       حرکت:
       ۰ → ۷ → ۱۲
       ================================================= */

    if (type === 1) {

        const a =
            randomInt(1, 15);

        const b =
            randomInt(
                1,
                20 - a
            );


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

            answer:
                a + b
        };


        questionTypeElement.textContent =
            "جمع";


        expressionElement.textContent =
            `${toPersianNumber(a)} + ${toPersianNumber(b)}`;

        return;
    }


    /* =================================================
       تفریق
       
       مثال:
       ۱۷ − ۱۲

       حرکت:
       ۰ → ۱۷ → ۵
       ================================================= */

    if (type === 2) {

        const a =
            randomInt(2, 20);

        const b =
            randomInt(
                1,
                a - 1
            );


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

            answer:
                a - b
        };


        questionTypeElement.textContent =
            "تفریق";


        expressionElement.textContent =
            `${toPersianNumber(a)} − ${toPersianNumber(b)}`;

        return;
    }


    /* =================================================
       سه عبارتی

       مثال:
       ۵ + ۷ − ۳

       حرکت:
       ۰ → ۵ → ۱۲ → ۹
       ================================================= */

    let a;
    let b;
    let c;

    let op1;
    let op2;

    let firstResult;
    let finalResult;

    let valid = false;


    while (!valid) {

        a =
            randomInt(1, 12);

        b =
            randomInt(1, 8);

        c =
            randomInt(1, 8);


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


        op1 =
            selected[0];

        op2 =
            selected[1];


        /*
           حرکت اول:
           صفر → a
        */

        firstResult =
            a;


        /*
           حرکت دوم
        */

        if (op1 === "+") {

            firstResult =
                a + b;

        } else {

            firstResult =
                a - b;
        }


        /*
           حرکت سوم
        */

        if (op2 === "+") {

            finalResult =
                firstResult + c;

        } else {

            finalResult =
                firstResult - c;
        }


        if (
            firstResult >= 0 &&
            firstResult <= 20 &&
            finalResult >= 0 &&
            finalResult <= 20
        ) {

            valid = true;
        }
    }


    currentQuestion = {

        type:
            "سه‌عبارتی",

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

        answer:
            finalResult
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


    expressionElement.textContent =
        `${toPersianNumber(a)} ${visibleOp1} ${toPersianNumber(b)} ${visibleOp2} ${toPersianNumber(c)}`;
}


/* =====================================================
   پاک کردن کادر جواب
   ===================================================== */

function resetAnswer() {

    if (!answerInput) {
        return;
    }


    answerInput.value = "";


    answerInput.classList.remove(
        "correct",
        "wrong"
    );
}


/* =====================================================
   پیدا کردن موقعیت عدد روی محور
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
            numberLine.clientHeight *
            0.72
    };
}


/* =====================================================
   تبدیل محل انگشت به عدد
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
   پیدا کردن مبدأ حرکت بعدی
   ===================================================== */

function getExpectedStart() {

    if (
        !currentQuestion
    ) {

        return 0;
    }


    if (
        drawnMoves.length === 0
    ) {

        return 0;
    }


    return drawnMoves[
        drawnMoves.length - 1
    ].end;
}


/* =====================================================
   شروع کشیدن با انگشت
   ===================================================== */

numberLine.addEventListener(
    "pointerdown",
    event => {

        if (
            !currentQuestion
        ) {

            return;
        }


        event.preventDefault();


        const value =
            getNumberFromPointer(
                event
            );


        const expected =
            getExpectedStart();


        /*
           کودک حتماً باید
           از مبدأ درست شروع کند.
        */

        if (
            value !== expected
        ) {

            feedback.textContent =
                `از ${toPersianNumber(expected)} شروع کن 🌱`;

            feedback.style.color =
                "#d65b70";

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


        /*
           اگر کودک همان عدد را انتخاب کرد
           حرکت ثبت نشود.
        */

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


/* =====================================================
   لغو کشیدن
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
   ساخت پیش‌نمایش منحنی
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


    previewSvg.setAttribute(
        "preserveAspectRatio",
        "none"
    );


    const path =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
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


/* =====================================================
   به‌روزرسانی پیش‌نمایش
   ===================================================== */

function updatePreview(
    start,
    event
) {

    if (!previewSvg) {
        return;
    }


    const startPos =
        getNumberPosition(
            start
        );


    const current =
        getNumberFromPointer(
            event
        );


    const endPos =
        getNumberPosition(
            current
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


    const curve =
        Math.min(
            60,
            Math.max(
                22,
                distance * 0.22
            )
        );


    const middleX =
        (
            startPos.x +
            endPos.x
        ) / 2;


    const middleY =
        startPos.y -
        curve;


    const path =
        previewSvg.querySelector(
            "path"
        );


    path.setAttribute(
        "d",
        `
        M ${startPos.x} ${startPos.y}
        Q ${middleX} ${middleY}
          ${endPos.x} ${endPos.y}
        `
    );
}


/* =====================================================
   حذف پیش‌نمایش
   ===================================================== */

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
}


/* =====================================================
   رسم کمان واقعی
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


    const curve =
        Math.min(
            60,
            Math.max(
                22,
                Math.abs(
                    endPos.x -
                    startPos.x
                ) * 0.22
            )
        );


    const middleX =
        (
            startPos.x +
            endPos.x
        ) / 2;


    const middleY =
        startPos.y -
        curve;


    const svg =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );


    svg.classList.add(
        "curved-move"
    );


    svg.setAttribute(
        "viewBox",
        `0 0 ${width} ${height}`
    );


    svg.setAttribute(
        "preserveAspectRatio",
        "none"
    );


    /* ---------------------------------
       فلش ظریف
       --------------------------------- */

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


    marker.appendChild(
        head
    );


    defs.appendChild(
        marker
    );


    svg.appendChild(
        defs
    );


    /* ---------------------------------
       منحنی
       --------------------------------- */

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
        `
        M ${startPos.x} ${startPos.y}
        Q ${middleX} ${middleY}
          ${endPos.x} ${endPos.y}
        `
    );


    path.setAttribute(
        "marker-end",
        `url(#${markerId})`
    );


    svg.appendChild(
        path
    );


    /* ---------------------------------
       نمایش مقدار حرکت
       --------------------------------- */

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


    svg.appendChild(
        text
    );


    numberLine.appendChild(
        svg
    );


    /* ---------------------------------
       نقطه مبدأ
       --------------------------------- */

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

if (undoButton) {

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


            feedback.textContent =
                "";
        }
    );
}


/* =====================================================
   پاک کردن همه حرکت‌ها
   ===================================================== */

if (clearButton) {

    clearButton.addEventListener(
        "click",
        () => {

            clearDrawing();

            feedback.textContent =
                "";

            resetAnswer();
        }
    );
}


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


/* =====================================================
   بررسی پاسخ
   ===================================================== */

if (checkButton) {

    checkButton.addEventListener(
        "click",
        checkAnswer
    );
}


function checkAnswer() {

    if (
        !currentQuestion
    ) {

        return;
    }


    /*
       ساخت مسیر صحیح
    */

    const correctMoves = [];

    let position = 0;


    for (
        const operation
        of currentQuestion.operations
    ) {

        let newPosition;


        if (
            operation.operator === "+"
        ) {

            newPosition =
                position +
                operation.value;

        } else {

            newPosition =
                position -
                operation.value;
        }


        correctMoves.push({

            start:
                position,

            end:
                newPosition
        });


        position =
            newPosition;
    }


    /*
       بررسی تعداد حرکت‌ها
    */

    if (
        drawnMoves.length !==
        correctMoves.length
    ) {

        showWrong(
            "مسیر را کامل روی محور بکش 🌱"
        );

        return;
    }


    /*
       بررسی تک تک حرکت‌ها
    */

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
                "مسیرت را دوباره بررسی کن 🌱"
            );

            return;
        }
    }


    /*
       بررسی جواب داخل کادر
    */

    if (
        !answerInput
    ) {

        return;
    }


    const raw =
        answerInput.value.trim();


    if (
        raw === ""
    ) {

        showWrong(
            "جوابت را داخل کادر بنویس 🌷"
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
            "عدد جواب درست نیست؛ دوباره محور را نگاه کن 🌱"
        );

        return;
    }


    /*
       همه چیز صحیح است
    */

    answerInput.classList.remove(
        "wrong"
    );


    answerInput.classList.add(
        "correct"
    );


    showCorrect();
}


/* =====================================================
   پاسخ صحیح
   ===================================================== */

function showCorrect() {

    score++;


    if (scoreElement) {

        scoreElement.textContent =
            toPersianNumber(
                score
            );
    }


    feedback.textContent =
        "آفرین! کاملاً درست انجام دادی 🎉";


    feedback.style.color =
        "#39956c";


    playCorrectSound();


    launchFireworks();


    /*
       بعد از تمام شدن فشفشه
       سؤال جدید می‌آید.
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
   فشفشه نورافشانی
   ===================================================== */

function launchFireworks() {

    if (
        !fireworkContainer
    ) {

        return;
    }


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


/* =====================================================
   شروع بازی
   ===================================================== */

if (startButton) {

    startButton.addEventListener(
        "click",
        () => {

            /*
               مهم:
               صدا همین‌جا فعال می‌شود،
               چون این کلیک مستقیم کاربر است.
            */

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
}


/* =====================================================
   شروع با Enter
   ===================================================== */

if (studentNameInput) {

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
}


/* =====================================================
   اجرای اولیه
   ===================================================== */

createNumberLine();
