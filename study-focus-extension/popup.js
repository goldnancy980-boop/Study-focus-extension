document.addEventListener("DOMContentLoaded", () => {
    const timerDisplay = document.getElementById("timer");
    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");
    // Select the new dropdown
    const timeSelector = document.getElementById("timeSelector");

    function updateTimerUI() {
        chrome.storage.local.get(["endTime"], (data) => {
            if (!data.endTime) {
                // If no active timer, show default based on selected dropdown value
                timerDisplay.textContent = `${timeSelector.value}:00`;
                return;
            }

            const timeLeft = data.endTime - Date.now();
            if (timeLeft <= 0) {
                timerDisplay.textContent = "00:00";
            } else {
                const mins = Math.floor(timeLeft / 60000);
                const secs = Math.floor((timeLeft % 60000) / 1000);
                timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
            }
        });
    }

    startBtn.addEventListener("click", () => {
        // Get the value from the dropdown
        const duration = parseInt(timeSelector.value);
        // Send the duration to background.js
        chrome.runtime.sendMessage({ action: "startTimer", minutes: duration });
    });

    stopBtn.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "stopTimer" });
    });

    setInterval(updateTimerUI, 1000);
    updateTimerUI();
});