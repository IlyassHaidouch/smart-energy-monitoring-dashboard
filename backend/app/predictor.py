from datetime import datetime
import pandas as pd
from data_loader import DataLoader
from models import UsagePredictorModels
from config import ROOMS
import numpy as np

class UsagePredictor:
    def __init__(self):
        self.data_loader = DataLoader()
        
        # Deux ensembles de modèles distincts
        self.usage_models = UsagePredictorModels(model_type='rooms')
        self.appliance_models = UsagePredictorModels(model_type='appliances')
        
        # Suivi de l'état d'entraînement
        self.trained = {
            'usage': {
                'daily': False,
                'monthly': False,
                'yearly': False
            },
            'appliances': {
                'daily': False,
                'monthly': False,
                'yearly': False
            }
        }
    
    def _train_if_needed(self, time_period, data_type='usage'):
        """Vérifie et effectue l'entraînement si nécessaire"""
        if not self.trained[data_type][time_period]:
            success = self.train_models(time_period, data_type)
            if not success:
                print(f"Échec de l'entraînement pour {data_type}/{time_period}")
            return success
        return True
    
    def train_models(self, time_period, data_type='usage'):
        """Entraîne les modèles pour un type de données spécifique"""
        print(f"Entraînement des modèles pour {data_type}/{time_period}...")
        
        current_time = datetime.now()
        time_col = ROOMS['time_columns'][time_period]
        
        # Déterminer la valeur courante selon la période
        if time_period == 'daily':
            current_value = current_time.hour
        elif time_period == 'monthly':
            current_value = current_time.day
        else:  # yearly
            current_value = current_time.month
        
        # Charger les données historiques
        past, _ = self.data_loader.load_data(time_period, current_value, data_type)
        if past is None or past.empty:
            print(f"Aucune donnée disponible pour l'entraînement ({data_type}/{time_period})")
            return False
        
        # Préparer les données d'entraînement
        X = past[time_col].values.reshape(-1, 1)
        
        try:
            if data_type == 'usage':
                y_data = {room: past[room] for room in ROOMS['rooms'] if room in past}
                self.usage_models.train(time_period, X, y_data)
            else:
                y_data = {appliance: past[appliance] for appliance in ROOMS['appliances'] if appliance in past}
                self.appliance_models.train(time_period, X, y_data)
            
            self.trained[data_type][time_period] = True
            print(f"Modèles entraînés avec succès ({data_type}/{time_period})")
            return True
            
        except Exception as e:
            print(f"Erreur lors de l'entraînement ({data_type}/{time_period}): {str(e)}")
            return False
    
    def get_predictions(self, time_period, current_value, data_type='usage'):
        """Obtient les prédictions pour une période donnée"""
        print(f"Génération de prédictions pour {data_type}/{time_period}...")
        
        if not self._train_if_needed(time_period, data_type):
            print("Impossible de générer des prédictions - entraînement échoué")
            return None, None
            
        # Charger les données
        past, future = self.data_loader.load_data(time_period, current_value, data_type)
        if past is None or future is None:
            print("Données non disponibles pour la prédiction")
            return None, None
        
        time_col = ROOMS['time_columns'][time_period]
        X_future = future[time_col].values.reshape(-1, 1)
        
        # Obtenir les prédictions
        try:
            if data_type == 'usage':
                predictions = self.usage_models.predict(time_period, X_future)
                columns = ROOMS['rooms']
            else:
                predictions = self.appliance_models.predict(time_period, X_future)
                columns = ROOMS['appliances']
            
            # Appliquer les prédictions
            future_pred = future.copy()
            for col in columns:
                if col in future_pred and col in predictions:
                    future_pred[col] = predictions[col]
            
            return past, future_pred
            
        except Exception as e:
            print(f"Erreur lors de la prédiction: {str(e)}")
            return past, future.copy()  # Retourne les données non modifiées
    
    def get_historical_data(self, time_period, data_type='usage'):
        """Obtient les données historiques sans prédictions"""
        print(f"Récupération des données historiques ({data_type}/{time_period})")
        return self.data_loader.load_historical_data(time_period, data_type)
    
    def get_consumption_stats(self, time_period):
        """Get consumption statistics (so far and predicted) for monthly/annual data"""
        current_time = datetime.now()
        
        if time_period == 'monthly':
            current_month = current_time.month
            current_value = current_time.day
            consumption_data = self.data_loader.load_consumption_data('monthly')
            if consumption_data is None:
                return None
            
            # Completed months (january to february if current month is march)
            completed_months = consumption_data[consumption_data['Mois'] < current_month]
            all_periods = completed_months.to_dict('records')

            # Calculate current month's consumption (march)
            current_month_data = self.data_loader.load_historical_data('monthly')
            if current_month_data is None:
                return None
            
            # Real consumption so far this month
            so_far = current_month_data[current_month_data['Jour'] <= current_value][ROOMS['rooms']].sum().sum()
            
            # Predict rest of current month
            _, future_current_month = self.get_predictions('monthly', current_value)
            if future_current_month is None:
                predicted_current = so_far
            else:
                predicted_current = so_far + future_current_month[ROOMS['rooms']].sum().sum()

            # Predictions for future months (april to december)
            future_months = []
            future_months_data = consumption_data[consumption_data['Mois'] > current_month]
            
            if not future_months_data.empty:
                # Use file data if available
                for _, row in future_months_data.iterrows():
                    future_month = {
                        'month': int(row['Mois']),
                        'year': current_time.year,
                        'predicted_consumption': float(row['Consommation'])
                    }
                    future_months.append(future_month)
            else:
                # If no data, use historical average with trend
                last_12_months = consumption_data.tail(12)['Consommation'].values
                if len(last_12_months) > 0:
                    avg_consumption = consumption_data['Consommation'].mean()
                    avg_growth = (last_12_months[-1] - last_12_months[0]) / len(last_12_months) if len(last_12_months) > 1 else 0
                    
                    for month_num in range(current_month + 1, 13):
                        future_month = {
                            'month': month_num,
                            'year': current_time.year,
                            'predicted_consumption': float(avg_consumption + (avg_growth * (month_num - current_month)))
                        }
                        future_months.append(future_month)

            # Previous month consumption (february if current month is march)
            last_month = consumption_data[consumption_data['Mois'] == (current_month - 1 if current_month > 1 else 12)]
            last_month_consumption = last_month['Consommation'].values[0] if not last_month.empty else 0

            return {
                'so_far': float(so_far),  # Real consumption so far this month
                'predicted': float(predicted_current),  # Total predicted for current month
                'last_period': float(last_month_consumption),  # Previous month consumption
                'average': float(consumption_data['Consommation'].mean()),  # Historical average
                'all_periods': all_periods,  # Completed months data (january to february)
                'future_predictions': future_months,  # Future months predictions (april to december)
                'current_period_prediction': {
                    'month': current_month,
                    'year': current_time.year,
                    'predicted_consumption': float(predicted_current),
                    'days_so_far': current_value,
                    'days_remaining': 31 - current_value  # Approximation
                }  # Current month detailed prediction
            }
        
        elif time_period == 'annual':
            current_year = current_time.year
            current_month = current_time.month
            consumption_data = self.data_loader.load_consumption_data('annual')
            if consumption_data is None:
                return None

            # Completed years (all years before current year)
            completed_years = consumption_data[consumption_data['Annee'] < current_year]
            all_periods = completed_years.to_dict('records')

            # Calculate current year's consumption
            current_year_data = self.data_loader.load_historical_data('yearly')
            if current_year_data is None:
                return None
            
            # Real consumption so far this year
            so_far = current_year_data[current_year_data['Mois'] <= current_month][ROOMS['rooms']].sum().sum()
            
            # Predict rest of year
            _, future_current_year = self.get_predictions('yearly', current_month)
            if future_current_year is None:
                predicted_current = so_far
            else:
                predicted_current = so_far + future_current_year[ROOMS['rooms']].sum().sum()

            # Predictions for future years
            future_years = []
            future_years_data = consumption_data[consumption_data['Annee'] > current_year]
            
            if not future_years_data.empty:
                # Use file data if available
                for _, row in future_years_data.iterrows():
                    future_year = {
                        'year': int(row['Annee']),
                        'predicted_consumption': float(row['Consommation'])
                    }
                    future_years.append(future_year)
            else:
                # If no data, use historical average with trend
                last_5_years = consumption_data.tail(5)['Consommation'].values
                if len(last_5_years) > 0:
                    avg_consumption = consumption_data['Consommation'].mean()
                    avg_growth = (last_5_years[-1] - last_5_years[0]) / len(last_5_years) if len(last_5_years) > 1 else 0
                    
                    for i in range(1, 6):  # Predict next 5 years
                        future_year = {
                            'year': current_year + i,
                            'predicted_consumption': float(avg_consumption + (avg_growth * i))
                        }
                        future_years.append(future_year)

            # Previous year consumption
            last_year = consumption_data[consumption_data['Annee'] == (current_year - 1)]
            last_year_consumption = last_year['Consommation'].values[0] if not last_year.empty else 0

            return {
                'so_far': float(so_far),  # Real consumption so far this year
                'predicted': float(predicted_current),  # Total predicted for current year
                'last_period': float(last_year_consumption),  # Previous year consumption
                'average': float(consumption_data['Consommation'].mean()),  # Historical average
                'all_periods': all_periods,  # Completed years data
                'future_predictions': future_years,  # Future years predictions
                'current_period_prediction': {
                    'year': current_year,
                    'predicted_consumption': float(predicted_current),
                    'months_so_far': current_month,
                    'months_remaining': 12 - current_month
                }  # Current year detailed prediction
            }
        
        return None