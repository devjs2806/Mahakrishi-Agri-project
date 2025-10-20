from flask import Blueprint, request, jsonify
from ultralytics import YOLO
import os

pest_bp = Blueprint("pest_bp", __name__, url_prefix="/api")

# ✅ Load models once
model_general = YOLO("models/yolo-pest.pt")
model_rice = YOLO("models/rice-yolo.pt")
model_onion = YOLO("models/yolo-odd.pt")

@pest_bp.route("/pest-detect", methods=["POST"])
def pest_detect():
    file = request.files.get("image")
    crop = request.form.get("crop", "general").lower()

    if not file:
        return jsonify({"error": "No image uploaded"}), 400

    os.makedirs("tmp", exist_ok=True)
    image_path = os.path.join("tmp", file.filename)
    file.save(image_path)

    if crop == "rice":
        model = model_rice
    elif crop == "onion":
        model = model_onion
    else:
        model = model_general

    try:
        results = model.predict(image_path)
        res = results[0]
        detections = [
            {"class": res.names[int(box.cls)], "confidence": round(float(box.conf), 3)}
            for box in res.boxes
        ]
        detections.sort(key=lambda x: x["confidence"], reverse=True)
        return jsonify({"crop": crop, "detections": detections})
    except Exception as e:
        return jsonify({"error": f"Detection failed: {str(e)}"}), 500
