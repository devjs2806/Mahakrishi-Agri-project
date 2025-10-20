from flask import Blueprint, request, jsonify
from extensions import db
from models import Crops

crops_bp = Blueprint('crops', __name__, url_prefix='/crops')

@crops_bp.route('/get_suggestions', methods=['POST'])
def get_crop_suggestions():
    data = request.json
    soil = data.get('soil_type')
    season = data.get('season')
    region = data.get('region')
    
    crops = Crops.query.filter_by(soil_type=soil, season=season, region=region).all()
    return jsonify([c.name for c in crops])
