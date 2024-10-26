document.getElementById('clearDataBtn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "clearData" }, (response) => {
        const messageDiv = document.getElementById('message');
        if (response.status === "success") {
            messageDiv.textContent = response.message;
        } else {
            messageDiv.textContent = "Error clearing data!";
        }
    });
});
