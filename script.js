import uiManager from "./modules/ui.js";
import { inputHandler, resetGame, startOverGame } from "./modules/gameLogic.js";

const quoteContainer = document.querySelector(".quote-container");
const userInput = document.querySelector(".input-container");
const resetBtn = document.querySelector(".reset-btn");
const startOverBtn = document.querySelector(".start-over-btn");
const resultsTableBtn = document.querySelector(".result-table-btn");

userInput.addEventListener("input", () => {
    const quoteSpans = quoteContainer.querySelectorAll("span");
    const quote = [];
    for (let i = 0; i < quoteSpans.length; i++) {
        quote.push(quoteSpans[i].innerText);
    }
    inputHandler(userInput.value, quote);
});

resetBtn.addEventListener("click", resetGame);
startOverBtn.addEventListener("click", startOverGame);
resultsTableBtn.addEventListener("click", uiManager.displayResultsTable);

document.addEventListener("keydown", (e) => {
    // prevent "enter" and "escape" to work when user is entering text
    if (document.activeElement.type === "textarea") {
        return;
    }
    if (e.key === "Enter" && userInput.value !== "") {
        resetGame();
    }
    if (e.key === "Escape") {
        startOverGame();
    }
});

uiManager.showQuote();