from flask import Blueprint, request, jsonify
import requests
from config import Config

weather_bp = Blueprint('weather', __name__, url_prefix='/weather')

@weather_bp.route('/get', methods=['GET'])
def get_weather():
    location = request.args.get('location')
    url = f"http://api.openweathermap.org/data/2.5/weather?q={location}&appid={Config.OPENWEATHER_API_KEY}&units=metric"
    response = requests.get(url)
    return jsonify(response.json())
