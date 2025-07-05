import moment from 'moment';
import 'moment/locale/fr'; // Import de la locale française
import { fetchRoomUsageData } from '../utils/dashboardHelpers';

export const createTimeSeriesChartConfig = async (periodType = 'today') => {
  // Configuration de moment.js en français
  moment.locale('fr');

  const {
    totalConsumption,
    predictedConsumption,
    pastData = [],
    futureData = [],
    currentHour,
    yesterdayConsumption,
    previousMonthConsumption,
    previousYearConsumption,
  } = await fetchRoomUsageData(periodType);

  // Fonction helper pour formater les dates dans les tooltips
  const getDateLabel = (index) => {
    switch (periodType.toLowerCase()) {
      case 'today':
        return moment().hour(index).format('HH:mm');
      case 'month':
        return moment().date(index).format('D MMM');
      case 'year':
        return moment().month(index-1).format('MMM YYYY');
      default:
        return '';
    }
  };

  // Fusionner les données passées et futures en un seul tableau
  const allData = [...pastData, ...futureData].sort((a, b) => a.time - b.time);
  
  // Trouver l'index de transition entre réel et prédit
  const transitionIndex = pastData.length > 0 ? 
    allData.findIndex(item => item.isPredicted) : -1;

  // Fonction pour générer les données du graphique
  const generateChartData = () => {
    let categories = [];
    let realData = [];
    let predictedData = [];
    let currentPosition;
    let labelStep;
    let totalPoints;

    switch (periodType.toLowerCase()) {
      case 'today':
        currentPosition = currentHour;
        labelStep = 4;
        totalPoints = 24;
        
        for (let i = 0; i < totalPoints; i++) {
          const hourLabel = `${i}h`;
          
          if (i === currentHour) {
            categories.push({ 
              label: hourLabel,
              vline: "true", 
              color: "#707C92", 
              dashed: "1", 
              linePosition: "0", 
              labelPosition: "0" 
            });
          } else if (i % labelStep === 0) {
            categories.push({ label: hourLabel });
          } else {
            categories.push({ label: hourLabel, showLabel: "0" });
          }

          // Trouver la donnée correspondante
          const dataPoint = allData.find(d => d.time === i);
          const isPredicted = dataPoint ? dataPoint.isPredicted : false;
          const value = dataPoint ? parseFloat(dataPoint.consumption) : null;

          const dataItem = {
            value: value,
            anchorAlpha: i % labelStep === 0 ? "100" : "0",
            toolText: value !== null ? 
              `${isPredicted ? 'Prédit' : 'Réel'}: ${value} kWh\n${getDateLabel(i)}` : null,
            color: isPredicted ? "#4B53FF" : "#FA394E",
            alpha: isPredicted ? "90" : "100",
            dashed: isPredicted ? "1" : "0"
          };

          if (isPredicted) {
            predictedData.push(dataItem);
            // Ajouter un point vide à la série réelle pour maintenir l'alignement
            realData.push({});
          } else {
            realData.push(dataItem);
            // Ajouter un point vide à la série prédite pour maintenir l'alignement
            predictedData.push({});
          }
        }
        break;

      case 'month':
        currentPosition = moment().date();
        labelStep = 7;
        totalPoints = moment().daysInMonth();
        
        for (let i = 1; i <= totalPoints; i++) {
          const dayLabel = moment().date(i).format('D');
          
          if (i === currentPosition) {
            categories.push({ 
              label: dayLabel,
              vline: "true", 
              color: "#707C92", 
              dashed: "1", 
              linePosition: "0", 
              labelPosition: "0" 
            });
          } else if (i % labelStep === 0 || i === 1) {
            categories.push({ label: dayLabel });
          } else {
            categories.push({ label: dayLabel, showLabel: "0" });
          }

          // Trouver la donnée correspondante
          const dataPoint = allData.find(d => d.time === i);
          const isPredicted = dataPoint ? dataPoint.isPredicted : false;
          const value = dataPoint ? parseFloat(dataPoint.consumption) : null;

          const dataItem = {
            value: value,
            anchorAlpha: (i % labelStep === 0 || i === 1) ? "100" : "0",
            toolText: value !== null ? 
              `${isPredicted ? 'Prédit' : 'Réel'}: ${value} kWh\n${getDateLabel(i)}` : null,
            color: isPredicted ? "#4B53FF" : "#FA394E",
            alpha: isPredicted ? "90" : "100",
            dashed: isPredicted ? "1" : "0"
          };

          if (isPredicted) {
            predictedData.push(dataItem);
            realData.push({});
          } else {
            realData.push(dataItem);
            predictedData.push({});
          }
        }
        break;

      case 'year':
        currentPosition = moment().month() + 1;
        labelStep = 3;
        totalPoints = 12;
        
        for (let i = 1; i <= totalPoints; i++) {
          const monthLabel = moment().month(i-1).format('MMM');
          
          if (i === currentPosition) {
            categories.push({ 
              label: monthLabel,
              vline: "true", 
              color: "#707C92", 
              dashed: "1", 
              linePosition: "0", 
              labelPosition: "0" 
            });
          } else if (i % labelStep === 0 || i === 1) {
            categories.push({ label: monthLabel });
          } else {
            categories.push({ label: monthLabel, showLabel: "0" });
          }

          // Trouver la donnée correspondante
          const dataPoint = allData.find(d => d.time === i);
          const isPredicted = dataPoint ? dataPoint.isPredicted : false;
          const value = dataPoint ? parseFloat(dataPoint.consumption) : null;

          const dataItem = {
            value: value,
            anchorAlpha: (i % labelStep === 0 || i === 1) ? "100" : "0",
            toolText: value !== null ? 
              `${isPredicted ? 'Prédit' : 'Réel'}: ${value} kWh\n${getDateLabel(i)}` : null,
            color: isPredicted ? "#4B53FF" : "#FA394E",
            alpha: isPredicted ? "90" : "100",
            dashed: isPredicted ? "1" : "0"
          };

          if (isPredicted) {
            predictedData.push(dataItem);
            realData.push({});
          } else {
            realData.push(dataItem);
            predictedData.push({});
          }
        }
        break;

      default:
        throw new Error("Type de période non supporté. Utiliser 'today', 'month' ou 'year'");
    }

    return { categories, realData, predictedData };
  };

  const { categories, realData, predictedData } = generateChartData();

  // Calcul de la valeur max de l'axe Y basée sur les données
  const getYAxisMax = () => {
    const allValues = [...realData, ...predictedData]
      .map(d => d.value)
      .filter(v => v !== null && v !== undefined);
    
    if (allValues.length === 0) return 5; // Valeur par défaut si aucune donnée
    
    const maxValue = Math.max(...allValues);
    // Ajouter une marge de 20% au-dessus de la valeur max
    return Math.ceil(maxValue * 1.2);
  };

  const yAxisMax = getYAxisMax();

  // Libellés localisés pour la période précédente
  let previousPeriodLabel, previousPeriodValue;
  switch (periodType.toLowerCase()) {
    case 'today':
      previousPeriodLabel = "Hier";
      previousPeriodValue = yesterdayConsumption;
      break;
    case 'month':
      previousPeriodLabel = "Mois dernier";
      previousPeriodValue = previousMonthConsumption;
      break;
    case 'year':
      previousPeriodLabel = "Année dernière";
      previousPeriodValue = previousYearConsumption;
      break;
    default : console.log(periodType.toLowerCase());
  }

  return {
    chart: {
      showBorder: "0",
      showCanvasBorder: "0",
      showAlternateHGridColor: "0",
      bgColor: "#1D1B41",
      bgAlpha: "0",
      canvasBgAlpha: "0",
      baseFontSize: "13",
      baseFont: "Nunito Sans Light",
      baseFontColor: "#FDFDFD",
      divLineColor: "#2A2D3D",
      divLineThickness: "1",
      showValues: "0",
      showLegend: "0",
      toolTipBgcolor: "#484E69",
      toolTipPadding: "7",
      toolTipBorderRadius: "3",
      toolTipBorderAlpha: "30",
      tooltipBorderThickness: "0.7",
      toolTipColor: "#FDFDFD",
      paletteColors: "#FA394E, #4B53FF",
      usePlotGradientColor: "0",
      yAxisMinValue: "0",
      yAxisMaxValue: yAxisMax.toFixed(2),
      yAxisValuesPadding: "15",
      yAxisName: "kWh",
      yAxisNamePadding: "10",
      plotFillAlpha: "100",
      drawAnchors: "1",
      anchorBgColor: "#FA394E, #4B53FF",
      anchorBorderColor: "#FDFDFD",
      anchorRadius: "4",
      anchorBorderThickness: "1.9",
      showPlotBorder: "0",
      showToolTip: "1",
      canvasTopMargin: "75",
      canvasBottomMargin: "75",
      canvasLeftMargin: "50",
      canvasRightMargin: "30",
      labelDisplay: "ROTATE",
      numberSuffix: " kWh",
      adjustDiv: "0",
      transposeAnimation: "1",
      ...(periodType === 'month' && { labelStep: "7" })
    },
    annotations: {
      groups: [{
        items: [
          // Période précédente
          {
            id: "previous-period-label",
            type: "text",
            text: `${previousPeriodLabel} :`,
            font: "Nunito Sans",
            bold: "0",
            fontSize: "12.5",
            color: "#FDFDFD",
            x: "$canvasStartX-38",
            y: "$canvasStartY - 55"
          },
          {
            id: "previous-period-value",
            type: "text",
            text: `${previousPeriodValue} kWh`,
            font: "Nunito Sans",
            bold: "1",
            fontSize: "12",
            color: "#FDFDFD",
            x: "$canvasStartX + 30",
            y: "$canvasStartY - 55"
          },
          // Données actuelles
          {
            id: "till-now-label",
            type: "text",
            text: "Jusqu'à présent :",
            font: "Nunito Sans",
            bold: "0",
            fontSize: "12.5",
            color: "#FDFDFD",
            x: "$canvasStartX-30",
            y: "$canvasStartY - 35"
          },
          {
            id: "till-now-value",
            type: "text",
            text: `${totalConsumption} kWh`,
            font: "Nunito Sans",
            bold: "1",
            fontSize: "12",
            color: "#FDFDFD",
            x: "$canvasStartX + 45",
            y: "$canvasStartY - 35"
          },
          // Prédiction
          {
            id: "predicted-label",
            type: "text",
            text: "Prédiction:",
            font: "Nunito Sans",
            bold: "0",
            fontSize: "12.5",
            color: "#FDFDFD",
            x: "$canvasEndX - 120",
            y: "$canvasStartY - 35"
          },
          {
            id: "predicted-value",
            type: "text",
            text: `${predictedConsumption} kWh`,
            font: "Nunito Sans",
            bold: "1",
            fontSize: "12",
            color: "#FDFDFD",
            x: "$canvasEndX - 60",
            y: "$canvasStartY - 35"
          },
          // Légende personnalisée
          {
            id: "real-legend",
            type: "rectangle",
            x: "$canvasStartX + 10",
            y: "$canvasEndY + 20",
            tox: "$canvasStartX + 30",
            toy: "$canvasEndY + 30",
            fillcolor: "#FA394E",
            radius: "2"
          },
          {
            id: "real-legend-label",
            type: "text",
            text: "Réel",
            font: "Nunito Sans",
            bold: "0",
            fontSize: "12",
            color: "#FDFDFD",
            x: "$canvasStartX + 40",
            y: "$canvasEndY + 27"
          },
          {
            id: "predicted-legend",
            type: "rectangle",
            x: "$canvasStartX + 90",
            y: "$canvasEndY + 20",
            tox: "$canvasStartX + 110",
            toy: "$canvasEndY + 30",
            fillcolor: "#4B53FF",
            radius: "2"
          },
          {
            id: "predicted-legend-label",
            type: "text",
            text: "Prédit",
            font: "Nunito Sans",
            bold: "0",
            fontSize: "12",
            color: "#FDFDFD",
            x: "$canvasStartX + 120",
            y: "$canvasEndY + 27"
          },
          // Ligne de transition entre réel et prédit
          ...(transitionIndex > -1 ? [{
            id: "transition-line",
            type: "line",
            x: `$categoryStartX + (${transitionIndex} * $categoryWidth) + ($categoryWidth/2)`,
            y: "$canvasStartY",
            tox: `$categoryStartX + (${transitionIndex} * $categoryWidth) + ($categoryWidth/2)`,
            toy: "$canvasEndY",
            color: "#707C92",
            thickness: "1",
            dashed: "1",
            alpha: "60"
          }] : [])
        ]
      }]
    },
    categories: [{ category: categories }],
    dataset: [
      {
        seriesname: "Réel",
        data: realData,
        color: "#FA394E"
      },
      {
        seriesname: "Prédit",
        data: predictedData,
        color: "#4B53FF"
      }
    ]
  };
};

// Configuration de base du graphique
const timeSeriesChartConfig = {
  type: "msarea",
  id: "time-series-chart",
  dataFormat: "JSON",
  width: "100%",
  height: "300",
  dataSource: null
};

export default timeSeriesChartConfig;