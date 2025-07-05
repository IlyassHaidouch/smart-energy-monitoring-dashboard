import pandas as pd

def validate_data(df):
    """Valide que les données ont le bon format"""
    required_columns = [
        'Heure', 'Chambre Principale', 'Chambre 1', 
        'Salon', 'Séjour', 'Cuisine', 'Garage', 'Autres'
    ]
    
    if not all(col in df.columns for col in required_columns):
        return False
    
    if not all(isinstance(h, int) for h in df['Heure']):
        return False
    
    if not all((df[col] >= 0).all() and (df[col] <= 1).all() 
               for col in required_columns[1:]):
        return False
    
    return True