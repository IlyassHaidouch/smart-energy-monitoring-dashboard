from sklearn.ensemble import RandomForestRegressor
import numpy as np
from config import ROOMS

class UsagePredictorModels:
    def __init__(self, model_type='rooms'):
        """Initialise avec le type de modèle (rooms ou appliances)"""
        self.model_type = model_type
        self.models = {
            'daily': self._init_models(),
            'monthly': self._init_models(),
            'yearly': self._init_models()
        }
    
    def _init_models(self):
        """Initialise les modèles en fonction du type"""
        if self.model_type == 'rooms':
            return {room: RandomForestRegressor() for room in ROOMS['rooms']}
        else:
            return {appliance: RandomForestRegressor() for appliance in ROOMS['appliances']}
    
    def train(self, time_period, X, y_data):
        """Entraîne les modèles pour une période spécifique"""
        for name, model in self.models[time_period].items():
            if name in y_data:
                y = y_data[name]
                if len(y) > 0:  # Ne former que si des données existent
                    model.fit(X, y)
    
    def predict(self, time_period, X):
        """Prédit la consommation pour une période spécifique"""
        predictions = {}
        for name, model in self.models[time_period].items():
            try:
                pred = model.predict(X)
                predictions[name] = np.clip(pred, 0, None)  # Pas de valeurs négatives
            except:
                # Retourne des zéros si le modèle n'est pas formé
                predictions[name] = np.zeros(X.shape[0])
        return predictions