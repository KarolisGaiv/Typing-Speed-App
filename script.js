// import { getRandomQuote } from "/api.js";
import { showQuote } from "./ui.js";
import { countAccuracy, countCorrectWords, calculateProgress } from "./utils.js";
import localStorageManager from "./localStorageManager.js";

const defaultTimerDuration = 5;

let timeBank = defaultTimerDuration;
let isTimerStarted = false;
let incorrectSymbols = 0;
let correctWordsCounter = 0;
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
            const accuracy = countAccuracy(incorrectSymbols);
            const wpm = countCorrectWords(correctWordsCounter);
            document.querySelector(".accuracy-counter").innerText = accuracy;
            document.querySelector(".wpm-counter").innerText = wpm;
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
    correctWordsCounter = 0;
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
    correctWordsCounter = 0;
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
    const table = document.querySelector(".results-table");
    table.classList.toggle("active");
    const tbody = document.querySelector(".results-table tbody");
    tbody.innerHTML = "";

    const data = localStorageManager.loadUserData();
    if (data.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.setAttribute("colspan", "3");
        cell.innerText = "No previous data found";
        row.appendChild(cell);
        tbody.appendChild(row);
    } else {
        data.forEach(testResult => {
            console.log(testResult);
            const row = document.createElement("tr");
            const timeCell = document.createElement("td");
            const accuracyCell = document.createElement("td");
            const wpmCell = document.createElement("td");

            timeCell.innerText = new Date(testResult.time).toLocaleString();
            accuracyCell.innerText = testResult.accuracy;
            wpmCell.innerText = testResult.wpm;

            row.appendChild(timeCell);
            row.appendChild(accuracyCell);
            row.appendChild(wpmCell);
            tbody.appendChild(row);
        });
    }
}

showQuote();
