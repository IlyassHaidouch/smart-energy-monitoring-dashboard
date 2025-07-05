import pandas as pd
from pathlib import Path
from datetime import datetime
from config import ROOMS

class DataLoader:
    def __init__(self):
        self.data_dir = Path(__file__).parent / 'data'
        self.rooms = ROOMS['rooms']
        self.appliances = ROOMS['appliances']
        self.time_columns = ROOMS['time_columns']
        
    def _load_csv(self, filename):
        try:
            df = pd.read_csv(self.data_dir / filename)
            time_col = self._get_time_column(filename)
            if time_col in df.columns:
                df[time_col] = pd.to_numeric(df[time_col], errors='coerce')
            return df
        except FileNotFoundError:
            print(f"Fichier non trouvé: {filename}")
            return None
        except Exception as e:
            print(f"Erreur chargement {filename}: {e}")
            return None
    
    def _get_time_column(self, filename):
        if 'today' in filename or 'yesterday' in filename:
            return self.time_columns['daily']
        elif 'month' in filename:
            return self.time_columns['monthly']
        elif 'year' in filename:
            return self.time_columns['yearly']
        return 'Heure'
    
    def load_data(self, time_period, current_time_value, data_type='usage'):
        """Charge les données d'usage ou d'appareils"""
        suffix = '_appliance_usage.csv' if data_type == 'appliances' else '_usage.csv'
        
        if time_period == 'daily':
            df_current = self._load_csv(f'today{suffix}')
            df_previous = self._load_csv(f'yesterday{suffix}')
        elif time_period == 'monthly':
            df_current = self._load_csv(f'current_month{suffix}')
            df_previous = self._load_csv(f'previous_month{suffix}')
        elif time_period == 'yearly':
            df_current = self._load_csv(f'current_year{suffix}')
            df_previous = self._load_csv(f'previous_year{suffix}')
        else:
            return None, None
            
        if df_current is None or df_previous is None:
            return None, None
            
        time_col = self.time_columns[time_period]
        past = pd.concat([df_previous, df_current[df_current[time_col] < current_time_value]])
        future = df_current[df_current[time_col] >= current_time_value]
        
        return past, future
    
    def load_historical_data(self, time_period, data_type='usage'):
        """Charge les données historiques"""
        suffix = '_appliance_usage.csv' if data_type == 'appliances' else '_usage.csv'
        
        if time_period == 'daily':
            filename = f'yesterday{suffix}'
        elif time_period == 'monthly':
            filename = f'previous_month{suffix}'
        elif time_period == 'yearly':
            filename = f'previous_year{suffix}'
        else:
            return None
            
        return self._load_csv(filename)
    
    def load_consumption_data(self, time_period):
        """Charge les données de consommation agrégées"""
        if time_period == 'monthly':
            filename = 'monthly_consumption.csv'
        elif time_period == 'annual':
            filename = 'annual_consumption.csv'
        else:
            return None
            
        return self._load_csv(filename)