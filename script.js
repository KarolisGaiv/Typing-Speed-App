const quoteContainer = document.querySelector(".quote-container");
const userInput = document.querySelector(".input-container");

userInput.addEventListener("input", () => {
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

async function getRandomQuote() {
    try {
        const res = await fetch("https://api.quotable.io/quotes/random?minLength=30&maxLength=100");
        if (!res.ok) {
            throw new Error(`Failed to fetch data ${res.status}`);
        }
        const data = await res.json();
        const quote = data[0].content;
        return quote;
    } catch (err) {
        console.log("Error while retreiving data: ", err);
        return "Unable to retrieve quote. Try again later";
    }

}

async function showQuote() {
    const quoteData = await getRandomQuote();
    quoteContainer.innerHTML = "";
    const quoteArray = quoteData.split("");
    quoteArray.forEach(letter => {
        const letterContainer = document.createElement("span");
        letterContainer.innerText = letter;
        quoteContainer.appendChild(letterContainer);
    });
    userInput.value = "";
}



showQuote();