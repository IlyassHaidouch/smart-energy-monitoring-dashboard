from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime
from predictor import UsagePredictor
import traceback
from config import ROOMS
import numpy as np

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

predictor = UsagePredictor()

def convert_numpy_types(obj):
    """Convertit les types numpy en types Python natifs pour la sérialisation JSON"""
    if isinstance(obj, (np.integer, np.floating)):
        return int(obj) if isinstance(obj, np.integer) else float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {k: convert_numpy_types(v) for k, v in obj.items()}
    elif isinstance(obj, (list, tuple)):
        return [convert_numpy_types(item) for item in obj]
    return obj

@app.route('/api/usage-data', methods=['GET'])
def get_usage_data():
    try:
        current_time = datetime.now()
        
        # Get predictions for room usage
        past_today, future_today = predictor.get_predictions('daily', current_time.hour)
        past_month, future_month = predictor.get_predictions('monthly', current_time.day)
        past_year, future_year = predictor.get_predictions('yearly', current_time.month)

        # Load historical data
        yesterday_data = predictor.get_historical_data('daily')
        previous_month_data = predictor.get_historical_data('monthly')
        previous_year_data = predictor.get_historical_data('yearly')
        
        # Get consumption stats
        monthly_stats = predictor.get_consumption_stats('monthly')
        annual_stats = predictor.get_consumption_stats('annual')

        response = {
            'today': {
                'past': past_today.to_dict('records') if past_today is not None else [],
                'future': future_today.to_dict('records') if future_today is not None else []
            },
            'yesterday': {
                'data': yesterday_data.to_dict('records') if yesterday_data is not None else []
            },
            'current_month': {
                'past': past_month.to_dict('records') if past_month is not None else [],
                'future': future_month.to_dict('records') if future_month is not None else []
            },
            'previous_month': {
                'data': previous_month_data.to_dict('records') if previous_month_data is not None else []
            },
            'current_year': {
                'past': past_year.to_dict('records') if past_year is not None else [],
                'future': future_year.to_dict('records') if future_year is not None else []
            },
            'previous_year': {
                'data': previous_year_data.to_dict('records') if previous_year_data is not None else []
            },
            'rooms': ROOMS['rooms'],
            'consumption_stats': convert_numpy_types({
                'monthly': monthly_stats if monthly_stats is not None else {},
                'annual': annual_stats if annual_stats is not None else {}
            })
        }

        return jsonify(convert_numpy_types(response))

    except Exception as e:
        print("Error in get_usage_data:", e)
        traceback.print_exc()
        return jsonify({"error": "Internal server error", "message": str(e)}), 500

@app.route('/api/appliance-data', methods=['GET'])
def get_appliance_data():
    try:
        current_time = datetime.now()
        
        # Get predictions for appliances
        past_today_app, future_today_app = predictor.get_predictions(
            'daily', current_time.hour, 'appliances')
        past_month_app, future_month_app = predictor.get_predictions(
            'monthly', current_time.day, 'appliances')
        past_year_app, future_year_app = predictor.get_predictions(
            'yearly', current_time.month, 'appliances')

        # Load historical appliance data
        yesterday_app = predictor.get_historical_data('daily', 'appliances')
        prev_month_app = predictor.get_historical_data('monthly', 'appliances')
        prev_year_app = predictor.get_historical_data('yearly', 'appliances')

        response = {
            'today': {
                'past': past_today_app.to_dict('records') if past_today_app is not None else [],
                'future': future_today_app.to_dict('records') if future_today_app is not None else []
            },
            'yesterday': {
                'data': yesterday_app.to_dict('records') if yesterday_app is not None else []
            },
            'current_month': {
                'past': past_month_app.to_dict('records') if past_month_app is not None else [],
                'future': future_month_app.to_dict('records') if future_month_app is not None else []
            },
            'previous_month': {
                'data': prev_month_app.to_dict('records') if prev_month_app is not None else []
            },
            'current_year': {
                'past': past_year_app.to_dict('records') if past_year_app is not None else [],
                'future': future_year_app.to_dict('records') if future_year_app is not None else []
            },
            'previous_year': {
                'data': prev_year_app.to_dict('records') if prev_year_app is not None else []
            },
            'appliance_categories': ROOMS['appliances']
        }

        return jsonify(convert_numpy_types(response))

    except Exception as e:
        print("Error in get_appliance_data:", e)
        traceback.print_exc()
        return jsonify({"error": "Internal server error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)