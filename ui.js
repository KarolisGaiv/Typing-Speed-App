import { getRandomQuote } from "./api.js";

const quoteContainer = document.querySelector(".quote-container");
let timer = document.querySelector(".timer");

export async function showQuote() {
    quoteContainer.innerHTML = "";

    const quoteData = await getRandomQuote();
    const quoteArray = quoteData.split("");

    quoteArray.forEach(letter => {
        const letterContainer = document.createElement("span");
        letterContainer.innerText = letter;
        quoteContainer.appendChild(letterContainer);
    });
}

export function updateTimer(timeBank) {
    timer.innerText = timeBank;
}

export function toggleButtonStatus(button) {
    button.disabled = !button.disabled;
}

export function disableElement(element) {
    element.disabled = true;
}

export function enableElement(element) {
    element.disabled = false;
}