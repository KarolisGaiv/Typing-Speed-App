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

export function calculateProgress(currentAccuracy, currentWPM, previousTestResults) {
    const previousAccuracy = previousTestResults.accuracy;
    const previousWPM = previousTestResults.wpm;

    const accuracyProgress = calculatePercentageProgress(currentAccuracy, previousAccuracy);
    const wpmProgress = calculatePercentageProgress(currentWPM, previousWPM);

    return { accuracyProgress, wpmProgress };
}

function calculatePercentageProgress(currentValue, previousValue) {
    if (previousValue === 0) return 0;
    return Math.round(((currentValue - previousValue) / previousValue) * 100);
}