import { fetchRoomUsageData } from '../utils/dashboardHelpers';

/**
 * Crée la configuration du graphique angulaire (angular gauge)
 */
export const createAngularGaugeConfig = async (periodType = 'month') => {
  const { totalConsumption } = await fetchRoomUsageData(periodType);
  
  // Définition des valeurs en fonction de la période
  let value, minRange, maxRange, minColorRange, unit;
  switch(periodType) {
    case 'today':
      value = (totalConsumption / 100).toFixed(3); 
      minRange = "0";
      maxRange = "0.04";
      minColorRange = "0.025";
      unit = "kWh/m²/jour";  
      break;
    case 'month':
      value = (totalConsumption / 100).toFixed(3); 
      minRange = "0";
      maxRange = "1";
      minColorRange = "0.5";
      unit = "kWh/m²/mois";  
      break;
    case 'year':
      value = (totalConsumption / 100).toFixed(2);
      minRange = "0";
      maxRange = "15";
      minColorRange = "10";
      unit = "kWh/m²/an";  
      break;
    default:
      value = "0";
      minRange = "0";
      maxRange = "100";
      minColorRange = "0";
      unit = "m²/Sqft";
  }

  return {
    chart: {
      baseFont: "Nunito Sans",
      setAdaptiveMin: "1",
      baseFontColor: "#FFFFFF",
      chartTopMargin: "0",
      canvasTopMargin: "0",
      chartBottomMargin: "70",
      chartLeftMargin: "10",
      chartRightMargin: "10",
      showTickMarks: "0",
      showTickValues: "0",
      showLimits: "0",
      majorTMAlpha: "0",
      minorTMAlpha: "0",
      pivotFillAlpha: "0",
      showPivotBorder: "0",
      pivotRadius: "0",
      pivotborderthickness: "0",
      gaugeouterradius: "150",
      gaugeInnerradius: "125",
      showGaugeBorder: "0",
      gaugeFillMix: "{light+0}",
      showBorder: "0",
      bgColor: "#1D1B41",
      bgAlpha: "0",
      canvasBgAlpha: "0",
      transposeAnimation: "1"
    },
    annotations: {
      groups: [{
        items: [
          {
            id: "2",
            type: "text",
            text: value,
            align: "center",
            font: "Nunito Sans",
            bold: "1",
            fontSize: "45",
            color: "#FDFDFD",
            x: "$chartcenterX",
            y: "$chartCenterY"
          },
          {
            id: "3",
            type: "text",
            text: unit,
            align: "center",
            font: "Nunito Sans",
            bold: "0",
            fontSize: "25",
            color: "#FDFDFD",
            x: "$chartcenterX",
            y: "$chartCenterY + 45"
          }
        ]
      }]
    },
    colorRange: {
      color: [
        {
          minValue: minColorRange,
          maxValue: value,
          code: "#58E2C2"
        },
        {
          minValue: minRange,
          maxValue: maxRange,
          code: "#48506E"
        }
      ]
    },
    dials: {
      dial: [{
        value: value,
        alpha: "0",
        borderAlpha: "0",
        radius: "0",
        baseRadius: "0",
        rearExtension: "0",
        baseWidth: "0",
        showValue: "0"
      }]
    }
  };
};

// Configuration principale pour FusionCharts
const chartConfigs5 = {
  type: "angulargauge",
  className: "fc-angulargauge",
  id: "mychart5",
  dataFormat: "JSON",
  width: "100%",
  height: "300",
  dataSource: null
};

export default chartConfigs5;