import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.layers import Layer
import tensorflow as tf
import pickle
import re


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.environ.get(
    "MODEL_PATH",
    os.path.join(BASE_DIR, "notebooks", "models", "final_phishing_model.keras")
)

TOKENIZER_PATH = os.environ.get(
    "TOKENIZER_PATH",
    os.path.join(BASE_DIR, "notebooks", "models", "url_tokenizer.pkl")
)

MAX_LEN = int(os.environ.get("MAX_LEN", 200))

class AttentionLayer(Layer):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def build(self, input_shape):
        self.W = self.add_weight(
            name="att_weight",
            shape=(input_shape[-1], 1),
            initializer="glorot_uniform",
            trainable=True
        )
        self.b = self.add_weight(
            name="att_bias",
            shape=(input_shape[1], 1),
            initializer="zeros",
            trainable=True
        )
        super().build(input_shape)

    def call(self, x):
        e = tf.keras.backend.tanh(tf.keras.backend.dot(x, self.W) + self.b)
        a = tf.keras.backend.softmax(e, axis=1)
        output = x * a
        return tf.keras.backend.sum(output, axis=1)


app = Flask(__name__)
CORS(app)

model = load_model(
    MODEL_PATH,
    custom_objects={"AttentionLayer": AttentionLayer},
    compile=False
)

with open(TOKENIZER_PATH, "rb") as f:
    tokenizer = pickle.load(f)


def normalize_url(url: str) -> str:
    url = str(url).strip().lower()
    if not re.match(r"^https?://", url):
        url = "https://" + url
    return url


def predict_single_url(url: str):
    clean_url = normalize_url(url)
    seq = tokenizer.texts_to_sequences([clean_url])
    padded = pad_sequences(seq, maxlen=MAX_LEN, padding="post", truncating="post")
    prob = float(model.predict(padded, verbose=0)[0][0])
    label = 1 if prob >= 0.5 else 0

    return {
        "url": clean_url,
        "phishing_probability": round(prob, 6),
        "prediction": "phishing" if label == 1 else "legitimate",
        "label": label,
    }


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Phishing URL Detection API is running.",
        "endpoint": "/predict",
        "method": "POST",
        "payload_example": {"url": "https://google.com"}
    })


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True) or {}
    url = data.get("url", "")

    if not url or not str(url).strip():
        return jsonify({"error": "Please provide a URL in JSON, e.g. {'url': 'https://google.com'}"}), 400

    try:
        result = predict_single_url(url)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)