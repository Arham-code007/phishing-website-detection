# Chrome Extension

## Load extension
1. Open Chrome
2. Go to `chrome://extensions/`
3. Turn on **Developer mode**
4. Click **Load unpacked**
5. Select the `extension` folder

## Before using
Run the Flask API first on:
`http://127.0.0.1:5000`

## What it does
- Popup can check a typed URL
- Popup can check the current tab
- Background worker shows a badge:
  - `SAFE` = likely legitimate
  - `PHISH` = possible phishing
  - `API` = API not running
