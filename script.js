import { getRandomQuote } from "/api.js";

let isTimerStarted = false;
let totalWords = 0;

const quoteContainer = document.querySelector(".quote-container");
const userInput = document.querySelector(".input-container");
let timer = document.querySelector(".timer");

userInput.addEventListener("input", () => {
    if (!isTimerStarted) {
        startTimer();
        isTimerStarted = true;
    }

    const quote = quoteContainer.querySelectorAll("span");
    const answer = userInput.value.split("");
    let correctAnswer = true;

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
        }
    });

    if (correctAnswer) {
        showQuote();
    }
});

async function showQuote() {
    const quoteData = await getRandomQuote();
    quoteContainer.innerHTML = "";
    const quoteArray = quoteData.split("");
    quoteArray.forEach(letter => {
        const letterContainer = document.createElement("span");
        letterContainer.innerText = letter;
        quoteContainer.appendChild(letterContainer);
    });
    userInput.value = null;
}

function startTimer() {
    let timeBank = 60;
    timer.innerText = timeBank;

    let interval = setInterval(() => {
        timeBank--;
        timer.innerText = timeBank;

        // stop timer when it reaches 0
        if (timeBank <= 0) {
            clearInterval(interval);
        }
    }, 1000);
}


showQuote();