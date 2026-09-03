import sys
import json
import joblib
import pandas as pd

model = joblib.load("models/revivepay_model.joblib")

payment = json.loads(sys.stdin.read())

df = pd.DataFrame([payment])

probability = model.predict_proba(df)[0][1]

print(json.dumps({
    "recoveryProbability": float(probability)
}))