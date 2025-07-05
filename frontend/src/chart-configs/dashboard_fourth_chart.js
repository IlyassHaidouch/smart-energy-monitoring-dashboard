import axios from 'axios';

const applianceNameMap = {
  'heating and ac': 'Chauffage & Climatisation',
  'lighting': 'Éclairage',
  'plug loads': 'Appareils branchés',
  'refrigeration': 'Réfrigération',
  'other': 'Autres',
};


export const fetchApplianceStats = async (periodType = 'today') => {
  try {
    const response = await axios.get('http://localhost:5000/api/appliance-data');
    const appliances = response.data.appliance_categories;
    const now = new Date();
    
    let applianceConsumption = {};
    let totalConsumption = 0;

    switch (periodType) {
      case 'today': {
        const currentHour = now.getHours();
        const pastData = response.data.today.past;

        appliances.forEach(appliance => {
          const apiKey = applianceNameMap[appliance] || appliance;
          
          // Filtrer seulement les heures passées (jusqu'à maintenant)
          const consumption = pastData
            .slice(24, 24+currentHour)
            .reduce((sum, hour) => sum + hour[apiKey], 0);
          
          applianceConsumption[appliance] = parseFloat(consumption.toFixed(2));
          totalConsumption += consumption;
        });
        break;
      }

      case 'month': {
        const currentDay = now.getDate();
        const pastData = response.data.current_month.past;

        appliances.forEach(appliance => {
          
            // Filtrer seulement les jours passés (jusqu'à aujourd'hui)
            const dailyConsumptions = pastData.slice(31, 31 + currentDay).map(day => day[appliance]);
            
            
            const consumption = dailyConsumptions.reduce((sum, dayValue, index) => {
                return sum + dayValue;
            }, 0);
                        
            applianceConsumption[appliance] = parseFloat(consumption.toFixed(2));
            totalConsumption += consumption;
            
    });        
        break;
      }

      case 'year': {
        const currentMonth = now.getMonth() + 1; // Les mois sont 1-12
        const pastData = response.data.current_year.past;

        appliances.forEach(appliance => {
          const apiKey = applianceNameMap[appliance] || appliance;
          
          // Filtrer seulement les mois passés (jusqu'au mois courant)
          const consumption = pastData
            .slice(12, 31+currentMonth)
            .reduce((sum, month) => sum + month[apiKey], 0);
          
          applianceConsumption[appliance] = parseFloat(consumption.toFixed(2));
          totalConsumption += consumption;
        });
        break;
      }

      default:
        throw new Error('Invalid period type specified');
    }

    return {
      applianceConsumption,
      totalConsumption: parseFloat(totalConsumption.toFixed(2)),
      periodType,
      timestamp: now.toISOString()
    };

  } catch (error) {
    console.error(`Error fetching ${periodType} appliance stats:`, error);
    throw error;
  }
};

/**
 * Create chart configuration for appliance consumption
 */
export const createApplianceChartConfig = async (periodType = 'today') => {
  const { applianceConsumption, totalConsumption } = await fetchApplianceStats(periodType);

  // Convert to sorted array for the chart
  const sortedData = Object.entries(applianceConsumption)
    .sort(([, a], [, b]) => b - a) // Tri décroissant
    .map(([label, value]) => {
      const percentage = totalConsumption > 0 
        ? ((value / totalConsumption) * 100).toFixed(1) 
        : '0';
      
      return {
        label,
        value,
        toolText: `${label}: ${value} kWh (${percentage}%)`
      };
    });

  return {
    chart: {
      showBorder: "0",
      showCanvasBorder: "0",
      placeValuesInside: "0",
      yAxisMaxValue:  periodType === 'year' ? 150 : periodType === 'month' ? 20 : periodType === 'today' ? 4 : 0, 
      setAdaptiveYMax: "0",
      showAlternateVGridColor: "0",
      canvasBgAlpha: "0",
      bgColor: "#1D1B41",
      bgAlpha: "0",
      baseFont: "Nunito Sans Light",
      baseFontColor: "#FDFDFD",
      baseFontSize: "14",
      showDivLineValues: "0",
      divLineAlpha: "0",
      showLimits: "0",
      baseFontBold: "0",
      usePlotGradientColor: "0",
      numberSuffix: " kWh",
      paletteColors: " #AB26C2, #9326BF, #7625B9, #5E24B6, #4424B1, #3123AE",
      plotBorderAlpha: "0",
      plotFillAlpha: "100",
      valueFontBold: "1",
      valueFontColor: "#FDFDFD",
      valueFontSize: "13",
      toolTipBgcolor: "#484E69",
      toolTipPadding: "7",
      toolTipBorderRadius: "3",
      toolTipBorderAlpha: "30",
      tooltipBorderThickness: "0.7",
      toolTipColor: "#FDFDFD"
    },
    data: sortedData
  };
};



var chartConfigs4 = {
    type: "bar2d",
    className: "fc-bar2d",
    id: "mychart4",
    dataFormat: "JSON",
    width: "100%",
    height: "300",
    dataSource: null
};

export default chartConfigs4;
