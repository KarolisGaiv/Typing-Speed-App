const quoteContainer = document.querySelector(".quote-container");

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
    const data = await getRandomQuote();
    quoteContainer.innerText = data;
}

showQuote();