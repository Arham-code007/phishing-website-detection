const API_URL = "http://127.0.0.1:5000/predict";

async function scanTab(tabId, url) {
  if (!url) return;

  const blockedSchemes = ["chrome://", "edge://", "about:", "chrome-extension://"];
  if (blockedSchemes.some(prefix => url.startsWith(prefix))) {
    chrome.action.setBadgeText({ tabId, text: "" });
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "API error");

    if (data.label === 1) {
      chrome.action.setBadgeText({ tabId, text: "PHISH" });
      chrome.action.setBadgeBackgroundColor({ tabId, color: "#b91c1c" });
      chrome.action.setTitle({ tabId, title: "Warning: possible phishing URL detected" });
    } else {
      chrome.action.setBadgeText({ tabId, text: "SAFE" });
      chrome.action.setBadgeBackgroundColor({ tabId, color: "#166534" });
      chrome.action.setTitle({ tabId, title: "URL looks legitimate" });
    }
  } catch (e) {
    chrome.action.setBadgeText({ tabId, text: "API" });
    chrome.action.setBadgeBackgroundColor({ tabId, color: "#6b7280" });
    chrome.action.setTitle({ tabId, title: "API offline or unreachable" });
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    scanTab(tabId, tab.url);
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab?.url) {
    scanTab(activeInfo.tabId, tab.url);
  }
});
