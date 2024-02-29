function saveTestResult(testAccuracy, testWpm) {
    const time = new Date().toLocaleString();
    const result = { "accuracy": testAccuracy, "wpm": testWpm };
    localStorage.setItem(time, JSON.stringify(result));
}

function loadUserData() {
    let data = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = JSON.parse(localStorage.getItem(key));
        data.push({ time: key, ...value });
    }
    console.log(data);
}

function getLastTestResult() {
    const lastTestResult = localStorage.key(localStorage.length - 1);
    return JSON.parse(localStorage.getItem(lastTestResult));
}

export default { saveTestResult, loadUserData, getLastTestResult };