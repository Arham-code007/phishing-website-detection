# Phishing URL Detection with Deep Learning

A phishing URL detection system built for my MSc Cyber Security project at Robert Gordon University. It uses a **CNN-BiGRU-Attention** deep learning model to classify URLs as phishing or legitimate in real time, deployed as a Flask API with a Chrome browser extension front end.

## Overview

- Trained and evaluated on a dataset of ~100,000 URLs (50,000 phishing from PhishTank, 50,000 legitimate from Alexa Top sites and a benign URL dataset)
- Benchmarked the deep learning model against traditional ML baselines: Logistic Regression, Random Forest, and Linear SVM
- Deployed as a live Flask API + Chrome extension that checks a typed URL or the current browser tab

## Results

| Model                     | Accuracy | Precision | Recall | F1-score |
|---------------------------|----------|-----------|--------|----------|
| Logistic Regression       | 0.7665   | 0.7782    | 0.7455 | 0.7615   |
| Linear SVM                | 0.7683   | 0.8080    | 0.7038 | 0.7523   |
| Random Forest             | 0.9640   | 0.9708    | 0.9569 | 0.9638   |
| **CNN + BiGRU + Attention** | **0.9900** | **0.9900** | **0.9900** | **0.9900** |

## Tech Stack

- **Modeling:** Python, TensorFlow/Keras (CNN, BiGRU, Attention), scikit-learn (baseline ML models)
- **Backend:** Flask (REST API serving the trained model)
- **Frontend:** Chrome Extension (Manifest V3, JavaScript)
- **Data:** PhishTank, Alexa Top sites, custom feature engineering (20 lexical/URL-based features)

## Project Structure

```
├── app.py                        # Flask API entry point
├── models/
│   ├── final_phishing_model.keras
│   └── url_tokenizer.pkl
├── extension/                    # Chrome extension (popup + background worker)
├── requirements.txt
└── README.md
```

## Setup & Usage

### 1. Flask API

Place the following in a `models/` folder beside `app.py`:
- `final_phishing_model.keras`
- `url_tokenizer.pkl`

Install dependencies:
```bash
pip install -r requirements.txt
```

Run the API:
```bash
python app.py
```

The API runs on `http://127.0.0.1:5000`.

Test it directly:
```bash
curl -X POST http://127.0.0.1:5000/predict -H "Content-Type: application/json" -d "{\"url\": \"https://google.com\"}"
```

### 2. Chrome Extension

**Make sure the Flask API is running first** (`http://127.0.0.1:5000`), then:

1. Open Chrome and go to `chrome://extensions/`
2. Turn on **Developer mode**
3. Click **Load unpacked**
4. Select the `extension` folder

**What it does:**
- Check a manually typed URL via the popup
- Check the currently open tab
- Background worker shows a live badge:
  - `SAFE` — likely legitimate
  - `PHISH` — possible phishing
  - `API` — API not running

## Notes

This was built as an academic project to explore deep learning approaches to phishing detection. It is not production-hardened (e.g. no rate limiting, HTTPS enforcement, or adversarial robustness testing) — see the dissertation for a full discussion of limitations and future work.
