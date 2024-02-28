import { getRandomQuote } from "/api.js";

let isTimerStarted = false;
let incorrectSymbols = 0;
let totalSymbols = 0;
let correctWords = 0;
let correctnessState = [];

const quoteContainer = document.querySelector(".quote-container");
const userInput = document.querySelector(".input-container");
let timer = document.querySelector(".timer");

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
    let timeBank = 10;
    timer.innerText = timeBank;

    let interval = setInterval(() => {
        timeBank--;
        timer.innerText = timeBank;

        // stop timer when it reaches 0
        if (timeBank <= 0) {
            clearInterval(interval);
            document.querySelector(".accuracy-counter").innerText = countAccuracy();
            document.querySelector(".wpm-counter").innerText = countCorrectWords();
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

showQuote();