/* =====================================================
   بازی «محور اعداد»
   مناسب کلاس اول
   نسخه نهایی
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
   سیستم صدا
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
    type = "sine",
    volume = 0.08,
    delay = 0
) {

    initializeAudio();

    if (!audioContext) {
        return;
    }

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();

    const startTime =
        audioContext.currentTime +
        delay;

    oscillator.type =
        type;

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

    if (!numberLine) {
        return;
    }

    numberLine.innerHTML = "";

    for (
        let i = 0;
        i <= 20;
        i++
    ) {

        const position =
            4 + (i / 20) * 92;


        /* خطک کوچک */

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
   ساخت سؤال
===================================================== */

function generateQuestion() {

    clearDrawing();

    resetAnswer();

    if (feedback) {
        feedback.textContent = "";
    }


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


        firstResult =
            a;


        if (op1 === "+") {

            firstResult =
                a + b;

        } else {

            firstResult =
                a - b;
        }


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

        start:
            0,

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
   جواب
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
   اندازه واقعی محور
===================================================== */

function getLineSize() {

    const rect =
        numberLine.getBoundingClientRect();

    return {

        width:
            rect.width,

        height:
            rect.height
    };
}


/* =====================================================
   موقعیت واقعی عدد روی محور
   بدون عدد ثابت برای ارتفاع
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


    /*
       مرکز افقی عدد
    */

    const x =
        numberRect.left +
        numberRect.width / 2 -
        lineRect.left;


    /*
       مهم‌ترین قسمت:
       موقعیت عمودی از خود محور
       و از CSS واقعی گرفته می‌شود.
    */

    const axisLine =
        getComputedStyle(
            numberLine,
            "::before"
        );


    let axisTop =
        parseFloat(
            axisLine.top
        );


    /*
       اگر مرورگر مقدار مناسبی نداد،
       خط محور را از موقعیت تیک‌ها
       پیدا می‌کنیم.
    */

    if (
        !Number.isFinite(axisTop)
    ) {

        const tick =
            numberLine.querySelector(
                `.tick`
            );

        if (tick) {

            const tickRect =
                tick.getBoundingClientRect();

            axisTop =
                tickRect.top -
                lineRect.top +
                tickRect.height / 2;
        }
    }


    /*
       مسیر روی خود خط افقی محور قرار می‌گیرد.
    */

    const y =
        axisTop +
        2;


    return {

        x:
            x,

        y:
            y
    };
}


/* =====================================================
   تبدیل انگشت به عدد
===================================================== */

function getNumberFromPointer(event) {

    const rect =
        numberLine.getBoundingClientRect();


    const x =
        event.clientX -
        rect.left;


    const percent =
        Math.max(
            4,
            Math.min(
                96,
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
   مبدأ حرکت بعدی
===================================================== */

function getExpectedStart() {

    if (!currentQuestion) {
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


        const expected =
            getExpectedStart();


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
   ساخت پیش‌نمایش
===================================================== */

function createPreview(
    start,
    event
) {

    removePreview();


    const size =
        getLineSize();


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
        `0 0 ${size.width} ${size.height}`
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
            getLineSize().height * 0.32,
            Math.max(
                20,
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
   رسم کمان
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


    const size =
        getLineSize();


    const curve =
        Math.min(
            size.height * 0.32,
            Math.max(
                20,
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


    /*
       ارتفاع واقعی محور
    */

    svg.setAttribute(
        "viewBox",
        `0 0 ${size.width} ${size.height}`
    );


    svg.setAttribute(
        "preserveAspectRatio",
        "none"
    );


    /* =================================================
       فلش
    ================================================= */

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
        "6"
    );


    marker.setAttribute(
        "markerHeight",
        "6"
    );


    marker.setAttribute(
        "refX",
        "5"
    );


    marker.setAttribute(
        "refY",
        "3"
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
        "M 0 0 L 6 3 L 0 6 Z"
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


    /* =================================================
       مسیر منحنی
    ================================================= */

    const path =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );


    path.classList.add(
        "curved-path"
    );


    /*
       برای اینکه CSS بتواند
       رنگ حرکت چپ را تشخیص دهد.
    */

    if (
        direction === "left"
    ) {

        svg.classList.add(
            "left"
        );
    }


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


    /* =================================================
       مقدار حرکت
    ================================================= */

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


    /* =================================================
       نقطه شروع
    ================================================= */

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
   پاک کردن همه
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

    if (!currentQuestion) {
        return;
    }


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


    /* تعداد حرکت */

    if (
        drawnMoves.length !==
        correctMoves.length
    ) {

        showWrong(
            "مسیر را کامل روی محور بکش 🌱"
        );

        return;
    }


    /* بررسی حرکت‌ها */

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


    /* بررسی جواب */

    if (!answerInput) {
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
            toPersianNumber(score);
    }


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


/* =====================================================
   پاسخ غلط
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

    if (!fireworkContainer) {
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


            /*
               بعد از ظاهر شدن صفحه بازی،
               اندازه واقعی محور را دوباره
               محاسبه می‌کنیم.
            */

            requestAnimationFrame(
                () => {

                    createNumberLine();

                    generateQuestion();

                }
            );
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
   اصلاح اندازه هنگام چرخاندن گوشی
===================================================== */

window.addEventListener(
    "resize",
    () => {

        if (!numberLine) {
            return;
        }


        /*
           اگر کودک هنوز چیزی نکشیده،
           فقط محور را دوباره تنظیم می‌کنیم.
        */

        if (
            drawnMoves.length === 0
        ) {

            createNumberLine();

            return;
        }


        /*
           اگر حرکت‌هایی وجود دارد،
           دوباره همان حرکت‌ها را
           با اندازه جدید رسم می‌کنیم.
        */

        const savedMoves =
            [...drawnMoves];


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


        requestAnimationFrame(
            () => {

                savedMoves.forEach(
                    move => {

                        drawMove(
                            move.start,
                            move.end,
                            move.direction,
                            move.distance
                        );
                    }
                );
            }
        );
    }
);


/* =====================================================
   اجرای اولیه
===================================================== */

if (numberLine) {

    createNumberLine();
}
