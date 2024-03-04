import { getRandomQuote } from "./api.js";
import localStorageManager from "./localStorageManager.js";

const quoteContainer = document.querySelector(".quote-container");
const progressContainer = document.querySelector(".historical-metrics-container");
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

export function displayProgress(progress) {
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

export function displayResultsTable() {
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

export function resetElement(element) {
    element.innerText = "";
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

export function removeClass(element, className) {
    element.classList.remove(className);
}