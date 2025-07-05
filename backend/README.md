Projet d'Analyse de Consommation Énergétique :

Configuration de l'environnement

Prérequis
Python 3.7 ou supérieur

pip (installé par défaut avec Python)

1. Installation des dépendances
Pour Linux/Mac :
bash
# Créer un environnement virtuel
python3 -m venv venv

# Activer l'environnement
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt
Pour Windows :
cmd
:: Créer un environnement virtuel
python -m venv venv

:: Activer l'environnement
venv\Scripts\activate

:: Installer les dépendances
pip install -r requirements.txt
2. Lancer l'application bash

# Depuis le dossier Backend
python app.py
L'API sera disponible à l'adresse : http://localhost:5000

Structure du projet
Backend/
├── venv/                 # Environnement virtuel (ignoré par Git)
├── data/                 # Données du projet
├── app.py                # Point d'entrée de l'application
├── requirements.txt      # Liste des dépendances
├── config.py             # Fichier de configuration
├── data_loader.py        # Gestion du chargement des données
├── models.py             # Modèles de machine learning
└── predictor.py          # Système de prédiction

Commandes utiles
Description	Commande Linux/Mac	Commande Windows
Activer venv	source venv/bin/activate	venv\Scripts\activate
Quitter venv	deactivate	deactivate
Mettre à jour les dépendances	pip freeze > requirements.txt	pip freeze > requirements.txt
Installer un nouveau package	pip install <package>	pip install <package>
Dépannage
Problèmes courants
Erreur "Module non trouvé"

Vérifiez que l'environnement virtuel est bien activé

Réinstallez les dépendances :

bash
pip install -r requirements.txt --force-reinstall
Problèmes d'activation sous Windows

Essayez cette commande alternative :

cmd
.\venv\Scripts\activate
Problèmes de version Python

Vérifiez votre version :

bash
python --version
Le projet nécessite Python 3.7 ou supérieur

Fonctionnalités
Prédiction de consommation énergétique

Analyse historique des données

API REST pour le frontend

Modèles de machine learning