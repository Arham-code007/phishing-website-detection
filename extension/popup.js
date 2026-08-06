const API_URL = "http://127.0.0.1:5000/predict";

const resultDiv = document.getElementById("result");
const urlInput = document.getElementById("urlInput");
const checkBtn = document.getElementById("checkBtn");
const tabBtn = document.getElementById("tabBtn");

function renderResult(data) {
  const klass = data.label === 1 ? "phish" : "safe";
  resultDiv.innerHTML = `
    <div><strong>URL:</strong> ${data.url}</div>
    <div><strong>Prediction:</strong> <span class="${klass}">${data.prediction.toUpperCase()}</span></div>
    <div><strong>Phishing probability:</strong> ${Number(data.phishing_probability).toFixed(4)}</div>
  `;
}

function renderError(message) {
  resultDiv.innerHTML = `<span class="phish">${message}</span>`;
}

async function checkUrl(url) {
  try {
    resultDiv.innerHTML = `<span class="muted">Checking...</span>`;
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ url })
    });

    const data = await response.json();

    if (!response.ok) {
      renderError(data.error || "Request failed.");
      return;
    }
    renderResult(data);
  } catch (err) {
    renderError("Could not connect to API. Start Flask on http://127.0.0.1:5000");
  }
}

checkBtn.addEventListener("click", async () => {
  const url = urlInput.value.trim();
  if (!url) {
    renderError("Enter a URL first.");
    return;
  }
  await checkUrl(url);
});

tabBtn.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url || tab.url.startsWith("chrome://") || tab.url.startsWith("edge://")) {
    renderError("This page cannot be scanned.");
    return;
  }
  urlInput.value = tab.url;
  await checkUrl(tab.url);
});
