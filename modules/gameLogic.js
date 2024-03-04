import uiManager from "./ui.js";
import { countAccuracy, countCorrectWords, calculateProgress } from "./utils.js";
import localStorageManager from "./localStorageManager.js";

const DEFAULTDURATION = 60;

let timeBank = DEFAULTDURATION;
let isTimerStarted = false;
let incorrectSymbols = 0;
let correctWordsCounter = 0;
let correctnessState = [];
let interval;

const resetBtn = document.querySelector(".reset-btn");
const userInput = document.querySelector(".input-container");

export function inputHandler(userInputValue, quote) {
    if (!isTimerStarted) {
        startTimer();
        isTimerStarted = true;
    }

    const answer = userInputValue.split("");
    let correctAnswer = true;

    if (correctnessState.length !== quote.length) {
        correctnessState = new Array(quote.length).fill(null);
    }

    quote.forEach((letter, index) => {
        const inputSymbol = answer[index];
        const letterContainer = document.querySelectorAll(".quote-container span")[index];

        if (inputSymbol == null) {
            letterContainer.classList.remove("correct", "incorrect");
            correctAnswer = false;
        } else if (inputSymbol === letter) {
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
        correctWordsCounter += quote.split(" ").length;
        correctnessState.fill(null);
    }
}


export function startTimer() {
    uiManager.enableElement(resetBtn);
    uiManager.updateTimer(timeBank);
    clearInterval(interval);

    interval = setInterval(() => {
        timeBank--;
        uiManager.updateTimer(timeBank);

        if (timeBank === 0) {
            stopGame();
        }
    }, 1000);
}

export function stopGame() {
    uiManager.disableElement(userInput);
    isTimerStarted = false;
    clearInterval(interval);

    const accuracy = countAccuracy(incorrectSymbols);
    const wpm = countCorrectWords(correctWordsCounter);

    localStorageManager.saveTestResult(accuracy, wpm);
    uiManager.updateResults(accuracy, wpm);

    if (localStorageManager.loadUserData().length > 1) {
        const previousTestResults = localStorageManager.getLastTestResult();
        const progress = calculateProgress(accuracy, wpm, previousTestResults);
        uiManager.displayProgress(progress);
    }
}

export function resetGame() {
    resetGameState();
    uiManager.resetUI();
}

export function startOverGame() {
    clearInterval(interval);
    resetGameState();
    uiManager.resetUI();
    uiManager.showQuote();
}

function resetGameState() {
    userInput.value = "";
    clearInterval(interval);
    timeBank = DEFAULTDURATION;
    isTimerStarted = false;
    incorrectSymbols = 0;
    correctWordsCounter = 0;
    correctnessState = [];
    uiManager.updateTimer(timeBank);
}

