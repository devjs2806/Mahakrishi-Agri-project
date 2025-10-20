import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle
import os

# ============================
# Paths
# ============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "..", "data", "crop_recommendation.csv")
MODEL_PATH = os.path.join(BASE_DIR, "crop_model.pkl")

# ============================
# Load Dataset
# ============================
print("📂 Loading dataset...")
df = pd.read_csv(DATA_PATH)

# Features (N, P, K, temperature, humidity, pH, rainfall)
X = df.drop("label", axis=1)
# Target (crop label)
y = df["label"]

# ============================
# Train-Test Split
# ============================
print("🔀 Splitting data...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ============================
# Train Model
# ============================
print("🌱 Training model (Random Forest)...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# ============================
# Evaluate Model
# ============================
accuracy = model.score(X_test, y_test)
print(f"✅ Model trained successfully! Accuracy: {accuracy:.2f}")

# ============================
# Save Model
# ============================
with open(MODEL_PATH, "wb") as f:
    pickle.dump(model, f)

print(f"💾 Model saved as {MODEL_PATH}")
