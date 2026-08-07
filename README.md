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
  - 
# Flask API
## Files expected
Put these in a `models/` folder beside `app.py`:
- `final_phishing_model.keras`
- `url_tokenizer.pkl`

## Install
```bash
pip install -r requirements.txt
```

## Run
```bash
python app.py
```

## Test
```bash
curl -X POST http://127.0.0.1:5000/predict -H "Content-Type: application/json" -d "{\"url\": \"https://google.com\"}"
```
