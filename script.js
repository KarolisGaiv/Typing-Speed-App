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

const quoteContainer = document.querySelector(".quote-container");
const userInput = document.querySelector(".input-container");
let timer = document.querySelector(".timer");
const resetBtn = document.querySelector(".reset-btn");
const startOverBtn = document.querySelector(".start-over-btn");

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

// key press events
document.addEventListener("keydown", (e) => {
    if (document.activeElement.type === "textarea") {
        return;
    }

    if (e.key === "Enter") {
        reset();
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
    timer.innerText = timeBank;
    clearInterval(interval);

    interval = setInterval(() => {
        timeBank--;
        timer.innerText = timeBank;

        // stop timer when it reaches 0
        if (timeBank <= 0) {
            clearInterval(interval);
            const accuracy = countAccuracy();
            const wpm = countCorrectWords();
            document.querySelector(".accuracy-counter").innerText = accuracy;
            document.querySelector(".wpm-counter").innerText = wpm;
            localStorageManager.saveTestResult(accuracy, wpm);
            calculateProgress(accuracy, wpm, localStorageManager.getLastTestResult());
        }
    }, 1000);
}

function countAccuracy() {
    return Math.round(((totalSymbols - incorrectSymbols) / totalSymbols) * 100);
}

function countCorrectWords() {
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
}

function startOver() {
    clearInterval(interval);
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

    showQuote();
}

function calculateProgress(currentAccuracy, currentWPM, previousTestResults) {
    const previousAccuracy = previousTestResults.accuracy;
    const previousWPM = previousTestResults.wpm;

    const accuracyProgress = Math.round(((currentAccuracy - previousAccuracy) / previousAccuracy) * 100);

    const wpmProgress = Math.round(((currentWPM - previousWPM) / previousWPM) * 100);



    console.log(`Compared to last game, your accuracy changed by ${accuracyProgress} and WPM changed by ${wpmProgress}`);




    console.log(currentAccuracy);
    console.log(currentWPM);
    console.log(previousTestResults);
}

showQuote();