import { showQuote, displayProgress, resetElement, updateTimer, toggleButtonStatus, disableElement, enableElement, displayResultsTable, removeClass } from "./ui.js";
import { countAccuracy, countCorrectWords, calculateProgress } from "./utils.js";
import localStorageManager from "./localStorageManager.js";

const defaultTimerDuration = 5;

let timeBank = defaultTimerDuration;
let isTimerStarted = false;
let incorrectSymbols = 0;
let correctWordsCounter = 0;
let correctnessState = [];
let interval;

const quoteContainer = document.querySelector(".quote-container");
const userInput = document.querySelector(".input-container");
const resetBtn = document.querySelector(".reset-btn");
const startOverBtn = document.querySelector(".start-over-btn");
const resultsTableBtn = document.querySelector(".result-table-btn");
const accuracyCounter = document.querySelector(".accuracy-counter");
const progressContainer = document.querySelector(".historical-metrics-container");
const wpmCounter = document.querySelector(".wpm-counter");

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
        correctWordsCounter += quoteContainer.innerText.split(" ").length;
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

function startTimer() {
    toggleButtonStatus(resetBtn);
    updateTimer(timeBank);
    clearInterval(interval);

    interval = setInterval(() => {
        timeBank--;
        updateTimer(timeBank);

        // stop timer when it reaches 0
        if (timeBank === 0) {
            disableElement(userInput);
            clearInterval(interval);
            const accuracy = countAccuracy(incorrectSymbols);
            const wpm = countCorrectWords(correctWordsCounter);
            accuracyCounter.innerText = accuracy;
            wpmCounter.innerText = wpm;
            localStorageManager.saveTestResult(accuracy, wpm);

            if (localStorageManager.loadUserData().length > 1) {
                const previousTestResults = localStorageManager.getLastTestResult();
                const progress = calculateProgress(accuracy, wpm, previousTestResults);
                displayProgress(progress);
            }
        }
    }, 1000);
}



function reset() {
    disableElement(resetBtn);
    enableElement(userInput);

    //reset user input field and also quote display
    userInput.value = "";

    const characterContainers = quoteContainer.querySelectorAll("span");
    characterContainers.forEach(span => {
        span.classList.remove("correct", "incorrect");
    });

    //stop and reset timer
    clearInterval(interval);
    timeBank = defaultTimerDuration;
    updateTimer(defaultTimerDuration);
    isTimerStarted = false;

    //reset global states
    incorrectSymbols = 0;
    correctWordsCounter = 0;
    correctnessState.fill(null);

    resetElement(accuracyCounter);
    resetElement(wpmCounter);

    removeClass(progressContainer, "active");
}

function startOver() {
    clearInterval(interval);
    disableElement(resetBtn);
    enableElement(userInput);
    timeBank = defaultTimerDuration;
    updateTimer(defaultTimerDuration);
    isTimerStarted = false;

    incorrectSymbols = 0;
    correctWordsCounter = 0;
    correctnessState.fill(null);

    resetElement(accuracyCounter);
    resetElement(wpmCounter);
    userInput.value = "";
    removeClass(progressContainer, "active");

    // Remove table wrapper if it exists
    const tableWrapper = document.querySelector(".table-wrapper");
    if (tableWrapper) {
        tableWrapper.remove();
    }

    if (resultsTableBtn.disabled === true) {
        enableElement(resultsTableBtn);
    }

    showQuote();
}

showQuote();
