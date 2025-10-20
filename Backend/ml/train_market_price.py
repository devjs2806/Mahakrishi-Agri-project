import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
import os

# Paths
DATA_PATH = os.path.join("data", "mandi_prices.csv")
MODEL_PATH = os.path.join("ml", "market_price_model.pkl")

print("Loading dataset...")
df = pd.read_csv(DATA_PATH)

# Clean column names
df.columns = df.columns.str.strip().str.lower()

print("Columns:", df.columns.tolist())
print(df.head())

# Rename important columns to match our pipeline
df = df.rename(columns={
    "commodity": "crop",
    "district_name": "region",   # use district as "region"
    "arrivals_in_qtl": "arrival",
    "modal_price": "price"
})

# Keep only necessary columns
df = df[["crop", "region", "arrival", "price"]]

# Drop missing values
df = df.dropna()

# Encode categorical values
label_encoders = {}
for col in ["crop", "region"]:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

# Features & target
X = df[["crop", "region", "arrival"]]
y = df["price"]

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Training model...")
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
print("Test MSE:", mse)

# Save model + encoders
joblib.dump({"model": model, "encoders": label_encoders}, MODEL_PATH)
print("✅ Model saved to", MODEL_PATH)
