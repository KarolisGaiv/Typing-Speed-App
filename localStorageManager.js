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
    return data;
}

function getLastTestResult() {
    const lastTestResult = localStorage.key(localStorage.length - 1);
    console.log(JSON.parse(localStorage.getItem(lastTestResult)));
    return JSON.parse(localStorage.getItem(lastTestResult));
}

export default { saveTestResult, loadUserData, getLastTestResult };