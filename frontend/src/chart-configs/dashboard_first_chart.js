import moment from 'moment';
import {
  fetchRoomUsageData
} from '../utils/dashboardHelpers';

// Formatage de la date pour l'affichage
// eslint-disable-next-line
const dayVal = moment().format('MMMM Do YYYY');



/**
 * Génère une palette de couleurs dynamique en fonction du nombre d'éléments
 */
const generateColorPalette = (count) => {
  const baseColors = [
    '#58E2C2', '#F7E53B', '#FFA07A', '#20B2AA', '#778899',
    '#9370DB', '#FF6347', '#3CB371', '#FFD700', '#CD5C5C',
    '#4682B4', '#9ACD32', '#DA70D6', '#5F9EA0', '#D2691E',
    '#1E90FF', '#32CD32', '#FF69B4', '#8A2BE2', '#FF8C00'
  ];

  if (count <= baseColors.length) {
    return baseColors.slice(0, count).join(', ');
  }

  // Génération de couleurs HSL harmonieuses pour les grands nombres
  return Array.from({ length: count }, (_, i) => {
    const hue = Math.floor((i * 360) / count);
    return `hsl(${hue}, 70%, 60%)`;
  }).join(', ');
};

/**
 * Crée la configuration du graphique à secteurs
 */
export const createDonutChartConfig = async (periodType = 'today') => {
  const {roomTotals, totalConsumption, roomsCount } = await fetchRoomUsageData(periodType);

  return {
    chart: {
      showBorder: "0",
      showShadow: "0",
      use3DLighting: "0",
      showLabels: "0",
      showValues: "0",
      paletteColors: generateColorPalette(roomsCount),
      bgColor: "#1D1B41",
      bgAlpha: "0",
      canvasBgAlpha: "0",
      doughnutRadius: "75",
      pieRadius: "95",
      plotBorderAlpha: "0",
      toolTipBgcolor: "#484E69",
      toolTipPadding: "7",
      toolTipBorderRadius: "3",
      toolTipBorderAlpha: "30",
      tooltipBorderThickness: "0.7",
      toolTipColor: "#FDFDFD",
      baseFont: "Nunito Sans",
      baseFontSize: "14",
      baseFontColor: "#FDFDFD",
      showLegend: "1",
      legendShadow: "0",
      legendBorderAlpha: "0",
      drawCustomLegendIcon: "1",
      legendBgAlpha: "0",
      chartTopMargin: "-10",
      canvasTopMargin: "-10",
      chartBottomMargin: "20",
      canvasBottomMargin: "20",
      legendNumColumns: roomsCount > 5 ? "2" : "1",
      legendPosition: "RIGHT",
      defaultCenterLabel: `Total<br>${totalConsumption.toFixed(2)} kWh`,
      centerLabel: "$label<br>$value",
      centerLabelBold: "1",
      centerLabelFontSize: "20",
      enableRotation: "0",
      transposeAnimation: "1",
      plotToolText: `<div>$label<br> $percentValue</div>`,
      numberPrefix: "",
      numberSuffix: " kWh"
    },
    data: Object.entries(roomTotals).map(([label, value]) => ({
      label,
      value: value.toFixed(2)
    })),

  };
};

// Configuration principale pour FusionCharts
const chartConfigs1 = {
  type: "doughnut2d",
  className: "fc-doughnut2d", 
  dataFormat: "JSON",
  width: "100%",
  height: "300",
  id: "mychart1",
  dataSource: null
};

export default chartConfigs1;