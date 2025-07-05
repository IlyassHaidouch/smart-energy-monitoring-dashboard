import moment from 'moment';
import axios from 'axios';

// Formatage de la date pour l'affichage
// eslint-disable-next-line
const dayVal = moment().format('MMMM Do YYYY');

/**
 * Récupère les données d'utilisation des salles
 * et calcule la consommation totale par salle jusqu'à l'heure/jour/mois actuel
 */
export const fetchRoomUsageData = async (periodType = 'today') => {
  try {
    const response = await axios.get('http://localhost:5000/api/usage-data');
 
    const { 
      today, 
      yesterday, 
      rooms, 
      current_month, 
      previous_month, 
      current_year, 
      previous_year,
      consumption_stats
    } = response.data;
    
    const currentHour = parseInt(moment().format('H'), 10);
    const currentDate = moment();
    const currentDayOfMonth = currentDate.date();
    const currentMonth = currentDate.month() + 1;
    
    let roomTotals = {};
    let totalConsumption = 0;
    let yesterdayConsumption = 0;
    let previousMonthConsumption = 0;
    let previousYearConsumption = 0;
    let predictedConsumption = 0;
    let pastData = [];
    let futureData = [];
    let periodLabel = '';

    // Calculer la consommation d'hier
    if (yesterday && yesterday.data) {
      yesterdayConsumption = parseFloat(
        yesterday.data.reduce((sum, hour) => {
          return sum + Object.values(rooms).reduce((roomSum, room) => {
            return roomSum + (hour[room] || 0);
          }, 0);
        }, 0).toFixed(2)
      );
    }

    // Calculer la consommation du mois précédent
    if (previous_month && previous_month.data) {
      previousMonthConsumption = parseFloat(
        previous_month.data.reduce((sum, day) => {
          return sum + Object.values(rooms).reduce((roomSum, room) => {
            return roomSum + (day[room] || 0);
          }, 0);
        }, 0).toFixed(2)
      );
    }

    // Calculer la consommation de l'année précédente
    if (previous_year && previous_year.data) {
      previousYearConsumption = parseFloat(
        previous_year.data.reduce((sum, month) => {
          return sum + Object.values(rooms).reduce((roomSum, room) => {
            return roomSum + (month[room] || 0);
          }, 0);
        }, 0).toFixed(2)
      );
    }

    switch (periodType.toLowerCase()) {
      case 'today':    
        // Pour today.past, les 24 premières lignes sont pour hier donc 24 to fin est le past d'aujourd'hui
        const hoursTodayPast = today.past.slice(24, 24 + currentHour + 1).filter(hourData => hourData.Heure <= currentHour);
        // Les prédictions sont dans today.future
        const hoursTodayFuture = today.future;   
        // Calcul des totaux par salle
        roomTotals = rooms.reduce((acc, room) => {
          acc[room] = hoursTodayPast.reduce((sum, hour) => sum + (hour[room] || 0), 0);
          return acc;
        }, {});

        totalConsumption = Object.values(roomTotals).reduce((sum, val) => sum + val, 0);
        
        // Calcul de la consommation prédite pour les heures restantes
        const predictedToday = hoursTodayFuture.reduce((sum, hour) => {
          return sum + Object.values(rooms).reduce((roomSum, room) => {
            return roomSum + (hour[room] || 0);
          }, 0);
        }, 0);
        
        // Préparation des données passées
        pastData = hoursTodayPast.map(hour => ({
          time: hour.Heure,
          consumption: Object.values(rooms).reduce((sum, room) => sum + (hour[room] || 0), 0).toFixed(2),
          isPredicted: false
        }));
        
        // Préparation des données futures
        futureData = hoursTodayFuture.map(hour => ({
          time: hour.Heure,
          consumption: Object.values(rooms).reduce((sum, room) => sum + (hour[room] || 0), 0).toFixed(2),
          isPredicted: true
        }));

        
        predictedConsumption = parseFloat(predictedToday.toFixed(2));
        periodLabel = 'Today';
        break;

      case 'month':
        
        // Pour current_month.past, les 31 premières lignes sont pour le mois précédent donc 31 to fin est le past de ce mois
        const daysThisMonthPast = current_month.past.slice(31, 31 + currentDayOfMonth).filter(dayData => dayData.Jour <= currentDayOfMonth);

        // Les prédictions sont dans current_month.future
        const daysThisMonthFuture = current_month.future;
        
        // Calcul des totaux par salle
        roomTotals = rooms.reduce((acc, room) => {
          acc[room] = daysThisMonthPast.reduce((sum, day) => sum + (day[room] || 0), 0);
          return acc;
        }, {});

        totalConsumption = Object.values(roomTotals).reduce((sum, val) => sum + val, 0);
        
        // Calcul de la consommation prédite pour les jours restants
        const predictedMonth = daysThisMonthFuture.reduce((sum, day) => {
          return sum + Object.values(rooms).reduce((roomSum, room) => {
            return roomSum + (day[room] || 0);
          }, 0);
        }, 0);
        
        // Préparation des données passées
        pastData = daysThisMonthPast.map(day => ({
          time: day.Jour,
          consumption: Object.values(rooms).reduce((sum, room) => sum + (day[room] || 0), 0).toFixed(2),
          isPredicted: false
        }));
        
        // Préparation des données futures
        futureData = daysThisMonthFuture.map(day => ({
          time: day.Jour,
          consumption: Object.values(rooms).reduce((sum, room) => sum + (day[room] || 0), 0).toFixed(2),
          isPredicted: true
        }));
        
        predictedConsumption = parseFloat(predictedMonth.toFixed(2));
        periodLabel = 'This Month';
        break;

      case 'year':
        
        // Pour current_year.past, les 12 premières lignes sont pour l'année précédente donc 12 to fin est le past de cette année
        const monthsThisYearPast = current_year.past.slice(12, 12 + currentMonth).filter(monthData => monthData.Mois <= currentMonth);
        // Les prédictions sont dans current_year.future
        const monthsThisYearFuture = current_year.future;
        // Calcul des totaux par salle
        roomTotals = rooms.reduce((acc, room) => {
          acc[room] = monthsThisYearPast.reduce((sum, month) => sum + (month[room] || 0), 0);
          return acc;
        }, {});

        totalConsumption = Object.values(roomTotals).reduce((sum, val) => sum + val, 0);
        
        // Calcul de la consommation prédite pour les mois restants
        const predictedYear = monthsThisYearFuture.reduce((sum, month) => {
          return sum + Object.values(rooms).reduce((roomSum, room) => {
            return roomSum + (month[room] || 0);
          }, 0);
        }, 0);
        
        // Préparation des données passées
        pastData = monthsThisYearPast.map(month => ({
          time: month.Mois,
          consumption: Object.values(rooms).reduce((sum, room) => sum + (month[room] || 0), 0).toFixed(2),
          isPredicted: false
        }));
        
        // Préparation des données futures
        futureData = monthsThisYearFuture.map(month => ({
          time: month.Mois,
          consumption: Object.values(rooms).reduce((sum, room) => sum + (month[room] || 0), 0).toFixed(2),
          isPredicted: true
        }));
        
        predictedConsumption = parseFloat(predictedYear.toFixed(2));
        periodLabel = 'This Year';
        break;

      default:
        throw new Error(`Unknown period type: ${periodType}`);
    }

    // Arrondi et vérification finale
    totalConsumption = parseFloat(totalConsumption.toFixed(2));
    
    return {
      rooms,
      roomTotals,
      roomsCount: rooms.length,
      currentHour: periodType === 'today' ? currentHour : null,
      totalConsumption,
      predictedConsumption,
      pastData,
      futureData,
      periodLabel,
      periodType,
      yesterdayConsumption,
      previousMonthConsumption,
      previousYearConsumption,
      monthlyPrediction: consumption_stats.monthly.current_period_prediction,
      annualPrediction: consumption_stats.annual.current_period_prediction
    };

  } catch (error) {
    console.error(`Erreur dans fetchRoomUsageData (${periodType}):`, error);
    throw error;
  }
};

export default fetchRoomUsageData;