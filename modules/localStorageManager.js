function saveTestResult(testAccuracy, testWpm) {
    const time = new Date();
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const day = time.getDate();
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const sec = time.getSeconds();

    const formattedSeconds = sec < 10 ? '0' + sec : sec;

    const formattedTime = `${year}-${month}-${day}, ${hours}:${minutes}:${formattedSeconds}`;

    const result = { "accuracy": testAccuracy, "wpm": testWpm };
    localStorage.setItem(formattedTime, JSON.stringify(result));
}

function loadUserData() {
    let data = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = JSON.parse(localStorage.getItem(key));
        data.push({ time: key, ...value });
    }

    data.sort((a, b) => {
        const dateA = new Date(a.time);
        const dateB = new Date(b.time);
        return dateA - dateB;
    });

    return data;
}

function getLastTestResult() {
    const data = loadUserData();
    return data[data.length - 2];
}

export default { saveTestResult, loadUserData, getLastTestResult };