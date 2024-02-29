function saveTestResult(testAccuracy, testWpm) {
    const time = new Date().toLocaleString();
    const result = { "accuracy": testAccuracy, "wpm": testWpm };
    localStorage.setItem(time, JSON.stringify(result));
}

function loadUserData() {
    return;
    const userData = JSON.parse(localStorage.getItem("testNumber"));
    console.log(userData);
}

export default { saveTestResult, loadUserData };