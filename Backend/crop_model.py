import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
import os

# Path to dataset
DATA_PATH = os.path.join("data", "crop_recommendation.csv")

# Load dataset
data = pd.read_csv(DATA_PATH)

# Features and labels
X = data.drop("label", axis=1)
y = data["label"]

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))

# Save model
MODEL_PATH = "crop_recommendation_model.pkl"
joblib.dump(model, MODEL_PATH)
print(f"Model saved as {MODEL_PATH}")
