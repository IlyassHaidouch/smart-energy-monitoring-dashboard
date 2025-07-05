import moment from 'moment';
import { fetchRoomUsageData } from '../utils/dashboardHelpers';

/**
 * Creates configuration for comparison column chart
 */
export const createComparisonChartConfig = async (periodType = 'month') => {
  const {
    totalConsumption,
    yesterdayConsumption,
    previousMonthConsumption,
    previousYearConsumption
  } = await fetchRoomUsageData(periodType);

  // Helper to calculate percentage change
  const calculateChange = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Format values based on period type
  let currentLabel, previousLabel, currentValue, previousValue, change, changeText, changeColor;

  switch (periodType.toLowerCase()) {
    case 'today':
      currentLabel = moment().format('MMM D');
      previousLabel = moment().subtract(1, 'day').format('MMM D');
      currentValue = totalConsumption;
      previousValue = yesterdayConsumption;
      change = calculateChange(currentValue, previousValue);
      changeColor = change >= 0 ? '#E8506B' : '#B4F9A1';
      break;

    case 'month':
      currentLabel = moment().format('MMM');
      previousLabel = moment().subtract(1, 'month').format('MMM');
      currentValue = totalConsumption;
      previousValue = previousMonthConsumption;
      change = calculateChange(currentValue, previousValue);
      changeColor = change >= 0 ? '#E8506B' : '#B4F9A1';
      break;

    case 'year':
      currentLabel = moment().format('YYYY');
      previousLabel = moment().subtract(1, 'year').format('YYYY');
      currentValue = totalConsumption;
      previousValue = previousYearConsumption;
      change = calculateChange(currentValue, previousValue);
      changeColor = change >= 0 ? '#E8506B' : '#B4F9A1';
      break;

    default:
      throw new Error("Type de période non supporté. Utilisez 'today', 'month' ou 'year'");
  }

  return {
    chart: {
      showBorder: "0",
      showCanvasBorder: "0",
      showAlternateHGridColor: "0",
      bgColor: "#1D1B41",
      bgAlpha: "0",
      canvasBgAlpha: "0",
      baseFontSize: "14",
      baseFont: "Nunito Sans Regular",
      baseFontColor: "#FDFDFD",
      divLineThickness: "2",
      numberPrefix: "",
      showLimits: "0",
      showDivLineValues: "0",
      paletteColors: "#58E2C2",
      usePlotGradientColor: "0",
      divLineColor: "#979797",
      divLineDashed: "1",
      divLineDashLen: "5",
      valueFontSize: "15",
      canvasRightMargin: "200",
      canvasLeftMargin: "35",
      canvasBottomMargin: "60",
      canvasTopMargin: "60",
      toolTipBgcolor: "#484E69",
      toolTipPadding: "7",
      toolTipBorderRadius: "3",
      toolTipBorderAlpha: "30",
      tooltipBorderThickness: "0.7",
      toolTipColor: "#FDFDFD",
      numberSuffix: " kWh",
      transposeAnimation: "1",
      ...(periodType === 'month' && { yAxisMaxValue: "150" }),
      ...(periodType === 'year' && { 
        yAxisMaxValue: "1500",
        decimals: "1",
        formatNumberScale: "0"
      })
    },
    annotations: {
      groups: [{
        autoscale: "1",
        items: [{
          id: "indicator",
          type: "text",
          text: `${change >= 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(2)}%`,
          color: changeColor,
          fontSize: "30",
          x: "$canvasEndX + 100",
          y: "$canvasheight/2 - 40"
        }, {
          id: "indicator",
          type: "text",
          text: changeText,
          color: "#FDFDFD",
          fontSize: "14",
          x: "$canvasEndX + 100",
          y: "$canvasheight/2 - 15"
        }]
      }]
    },
    data: [{
      label: previousLabel,
      value: previousValue.toFixed(2),
      alpha: "55"
    }, {
      label: currentLabel,
      value: currentValue.toFixed(2)
    }]
  };
};

// Configuration principale pour FusionCharts
const chartConfigs2 = {
  type: "Column2d",
  id: "mychart2",
  dataFormat: "JSON",
  width: "100%",
  height: "300",
  dataSource: null // Will be populated dynamically
};

export default chartConfigs2;