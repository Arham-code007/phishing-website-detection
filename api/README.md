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
