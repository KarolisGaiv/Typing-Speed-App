const quoteContainer = document.querySelector(".quote-container");
const userInput = document.querySelector(".input-container");


export function countAccuracy(totalSymbols, incorrectSymbols) {
    return Math.round(((totalSymbols - incorrectSymbols) / totalSymbols) * 100);
}

export function countCorrectWords(correctWordsCounter) {
    let phraseWords = quoteContainer.innerText.split(" ");
    let typedWords = userInput.value.split(" ");

    for (let i = 0; i < typedWords.length; i++) {
        if (phraseWords[i] === typedWords[i]) {
            correctWordsCounter++;
        }
    }
    return correctWordsCounter;
}