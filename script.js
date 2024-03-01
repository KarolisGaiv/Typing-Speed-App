import { getRandomQuote } from "/api.js";
import localStorageManager from "./localStorageManager.js";

const defaultTimerDuration = 5;

let timeBank = defaultTimerDuration;
let isTimerStarted = false;
let incorrectSymbols = 0;
let totalSymbols = 0;
let correctWords = 0;
let correctnessState = [];
let interval;

let timer = document.querySelector(".timer");
const quoteContainer = document.querySelector(".quote-container");
const userInput = document.querySelector(".input-container");
const resetBtn = document.querySelector(".reset-btn");
const startOverBtn = document.querySelector(".start-over-btn");
const resultsTableBtn = document.querySelector(".result-table-btn");
const progressContainer = document.querySelector(".historical-metrics-container");

userInput.addEventListener("input", () => {
    //prevent restarting already running timer
    if (!isTimerStarted) {
        startTimer();
        isTimerStarted = true;
    }

    const quote = quoteContainer.querySelectorAll("span");
    const answer = userInput.value.split("");
    let correctAnswer = true;

    if (correctnessState.length !== quote.length) {
        correctnessState = new Array(quote.length).fill(null);
    }

    quote.forEach((letterContainer, index) => {
        const input = answer[index];
        // remove styling for character which was not typed yet
        if (input == null) {
            letterContainer.classList.remove("correct");
            letterContainer.classList.remove("incorrect");
            correctAnswer = false;
        }
        // color correctly typed letter
        else if (input === letterContainer.innerText) {
            letterContainer.classList.add("correct");
            letterContainer.classList.remove("incorrect");
        } else {
            letterContainer.classList.add("incorrect");
            letterContainer.classList.remove("correct");
            correctAnswer = false;
            if (correctnessState[index] !== false) {
                incorrectSymbols++;
                correctnessState[index] = false;
            }
        }
    });

    if (correctAnswer) {
        correctWords += quoteContainer.innerText.split(" ").length;
        showQuote();
    }
});


resetBtn.addEventListener("click", reset);
startOverBtn.addEventListener("click", startOver);
resultsTableBtn.addEventListener("click", displayResultsTable);


// key press events
document.addEventListener("keydown", (e) => {
    // prevent "enter" and "escape" to work when user is entering text
    if (document.activeElement.type === "textarea") {
        return;
    }

    if (e.key === "Enter") {
        // Only call reset() if userInput has some value
        if (userInput.value !== "") {
            reset();
        }
    }

    if (e.key === "Escape") {
        startOver();
    }
});

async function showQuote() {
    quoteContainer.innerHTML = "";
    userInput.value = null;

    const quoteData = await getRandomQuote();
    const quoteArray = quoteData.split("");
    totalSymbols += quoteArray.length;

    quoteArray.forEach(letter => {
        const letterContainer = document.createElement("span");
        letterContainer.innerText = letter;
        quoteContainer.appendChild(letterContainer);
    });
}

function startTimer() {
    resetBtn.disabled = !resetBtn.disabled;
    timer.innerText = timeBank;
    clearInterval(interval);

    interval = setInterval(() => {
        timeBank--;
        timer.innerText = timeBank;

        // stop timer when it reaches 0
        if (timeBank === 0) {
            userInput.disabled = true;
            clearInterval(interval);
            const accuracy = countAccuracy();
            const wpm = countCorrectWords();
            document.querySelector(".accuracy-counter").innerText = accuracy;
            document.querySelector(".wpm-counter").innerText = wpm;
            localStorageManager.saveTestResult(accuracy, wpm);

            if (localStorageManager.loadUserData().length > 1) {
                let test = localStorageManager.loadUserData();
                const previousTestResults = localStorageManager.getLastTestResult();
                const progress = calculateProgress(accuracy, wpm, previousTestResults);
                displayProgress(progress);
            }
        }
    }, 1000);
}

function countAccuracy() {
    return Math.round(((totalSymbols - incorrectSymbols) / totalSymbols) * 100);
}

function countCorrectWords() {
    correctWords = 0;
    let phraseWords = quoteContainer.innerText.split(" ");
    let typedWords = userInput.value.split(" ");

    for (let i = 0; i < typedWords.length; i++) {
        if (phraseWords[i] === typedWords[i]) {
            correctWords++;
        }
    }
    return correctWords;
}

function reset() {
    resetBtn.disabled = true;
    userInput.disabled = false;
    //reset user input field and also quote display
    userInput.value = "";
    const characterContainers = quoteContainer.querySelectorAll("span");
    characterContainers.forEach(span => {
        span.classList.remove("correct", "incorrect");
    });

    //stop and reset timer
    clearInterval(interval);
    timeBank = defaultTimerDuration;
    timer.innerText = defaultTimerDuration;
    isTimerStarted = false;


    //reset global states
    incorrectSymbols = 0;
    correctWords = 0;
    correctnessState.fill(null);

    document.querySelector(".accuracy-counter").innerText = "";
    document.querySelector(".wpm-counter").innerText = "";

    progressContainer.classList.remove("active");
}

function startOver() {
    clearInterval(interval);
    resetBtn.disabled = true;
    userInput.disabled = false;
    timeBank = defaultTimerDuration;
    timer.innerText = defaultTimerDuration;
    isTimerStarted = false;

    incorrectSymbols = 0;
    correctWords = 0;
    totalSymbols = 0;
    correctnessState.fill(null);

    document.querySelector(".accuracy-counter").innerText = "";
    document.querySelector(".wpm-counter").innerText = "";
    userInput.value = "";
    progressContainer.classList.remove("active");

    // Remove table wrapper if it exists
    const tableWrapper = document.querySelector(".table-wrapper");
    if (tableWrapper) {
        tableWrapper.remove();
    }

    if (resultsTableBtn.disabled === true) {
        resultsTableBtn.disabled = false;
    }

    showQuote();
}

function calculateProgress(currentAccuracy, currentWPM, previousTestResults) {
    const previousAccuracy = previousTestResults.accuracy;
    const previousWPM = previousTestResults.wpm;

    const accuracyProgress = calculatePercentageProgress(currentAccuracy, previousAccuracy);
    const wpmProgress = calculatePercentageProgress(currentWPM, previousWPM);

    return { accuracyProgress, wpmProgress };
}

function calculatePercentageProgress(currentValue, previousValue) {
    if (previousValue === 0) return 0;
    return Math.round(((currentValue - previousValue) / previousValue) * 100);
}


function displayProgress(progress) {
    progressContainer.classList.add("active");
    const accuracyContainer = document.querySelector(".accuracy-progress-container");
    const wpmContainer = document.querySelector(".wpm-progress-container");

    accuracyContainer.innerText = `Accuracy: ${progress.accuracyProgress}%`;
    wpmContainer.innerText = `WPM: ${progress.wpmProgress}%`;

    //add styling based on progress results
    function assignClass(container, progressValue) {
        container.classList.remove("increase", "decrease", "neutral");
        return progressValue > 0 ? "increase" : progressValue < 0 ? "decrease" : "neutral";
    }

    accuracyContainer.classList.add(assignClass(accuracyContainer, progress.accuracyProgress));
    wpmContainer.classList.add(assignClass(wpmContainer, progress.wpmProgress));
}

function displayResultsTable() {
    resultsTableBtn.disabled = true;
    const tableWrapper = document.createElement("div");
    tableWrapper.classList.add("table-wrapper");
    document.body.appendChild(tableWrapper);

    const data = localStorageManager.loadUserData();
    if (data.length === 0) {
        tableWrapper.innerHTML = "No previous test results found";
        tableWrapper.classList.add("warning-message");
        return;
    }

    let table = '<table class="results-table"><tr class="test"><th class="column">Time</th><th class="column">Accuracy (%)</th><th class="column">WPM</th></tr>';

    data.forEach(result => {
        const tableRow = `<tr><td>${result.time}</td><td>${result.accuracy}</td><td>${result.wpm}</td></tr>`;
        table += tableRow;
    });

    table += "</table>";
    tableWrapper.innerHTML = table;
}





showQuote();