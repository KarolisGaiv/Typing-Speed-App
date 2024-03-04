import { getRandomQuote } from "../api/api.js";
import localStorageManager from "./localStorageManager.js";

const quoteContainer = document.querySelector(".quote-container");
const userInput = document.querySelector(".input-container");
const progressContainer = document.querySelector(".historical-metrics-container");
const accuracyCounter = document.querySelector(".accuracy-counter");
const wpmCounter = document.querySelector(".wpm-counter");
const resetBtn = document.querySelector(".reset-btn");
let timer = document.querySelector(".timer");

async function showQuote() {
    quoteContainer.innerHTML = "";

    const quoteData = await getRandomQuote();
    const quoteArray = quoteData.split("");

    quoteArray.forEach(letter => {
        const letterContainer = document.createElement("span");
        letterContainer.innerText = letter;
        quoteContainer.appendChild(letterContainer);
    });
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

function resetUI() {
    const characterContainers = quoteContainer.querySelectorAll("span");
    enableElement(userInput);
    characterContainers.forEach(span => {
        span.classList.remove("correct", "incorrect");
    });

    resetElement(accuracyCounter);
    resetElement(wpmCounter);
    removeClass(progressContainer, "active");
    toggleButtonStatus(resetBtn);
}

function resetElement(element) {
    element.innerText = "";
}

function updateTimer(timeBank) {
    timer.innerText = timeBank;
}

function toggleButtonStatus(button) {
    button.disabled = !button.disabled;
}

function disableElement(element) {
    element.disabled = true;
}

function enableElement(element) {
    element.disabled = false;
}

function removeClass(element, className) {
    element.classList.remove(className);
}

function updateResults(accuracy, wpm) {
    accuracyCounter.innerText = accuracy;
    wpmCounter.innerText = wpm;
}

export default { showQuote, displayProgress, resetElement, updateTimer, toggleButtonStatus, disableElement, enableElement, displayResultsTable, removeClass, updateResults, resetUI };