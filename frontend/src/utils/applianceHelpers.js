import axios from 'axios';
import moment from 'moment';

const applianceNameMap = {
  'heating and ac': 'Chauffage & Climatisation',
  'lighting': 'Éclairage',
  'plug loads': 'Appareils branchés',
  'refrigeration': 'Réfrigération',
  'other': 'Autres',
};

// Fonction pour récupérer les données horaires (0h-23h)
export const fetchApplianceStatsByDay = async (applianceType, isPreviousPeriod = false) => {
  try {
    const response = await axios.get('http://localhost:5000/api/appliance-data');
    const apiKey = applianceNameMap[applianceType] || applianceType;
    
    const categories = Array.from({length: 24}, (_, i) => ({
      label: `${i}h`
    }));

    let applianceArray, dailyStats;
    const currentHour = new Date().getHours();

    if (isPreviousPeriod) {
      // Hier - données complètes
      const yesterday_data = response.data.yesterday.data;
      applianceArray = Array(24).fill(0);
      yesterday_data.forEach(hourData => {
        const hour = hourData.Heure;
        applianceArray[hour] = hourData[apiKey];
      });

      const yesterdayTotal = yesterday_data.reduce((sum, hour) => sum + hour[apiKey], 0);
      const averageYesterday = yesterdayTotal / yesterday_data.length;

      dailyStats = {
        average: parseFloat(averageYesterday.toFixed(2)),
        lastPeriod: parseFloat(yesterdayTotal.toFixed(2)),
        predicted: 0,
        consumedSoFar: parseFloat(yesterdayTotal.toFixed(2)) // Total de la journée précédente
      };
    } else {
      // Aujourd'hui - passé + prédictions
      const past_data = response.data.today.past;
      const future_predictions = response.data.today.future;
      const allData = [...past_data, ...future_predictions].sort((a, b) => a.Heure - b.Heure);

      applianceArray = Array(24).fill(0);
      allData.forEach(hourData => {
        const hour = hourData.Heure;
        applianceArray[hour] = hourData[apiKey];
      });

      const yesterdayTotal = response.data.yesterday.data.reduce((sum, hour) => sum + hour[apiKey], 0);
      const todayTotal = applianceArray.reduce((sum, hour) => sum + hour, 0);
      const consumedUntilNow = past_data.reduce((sum, hour) => sum + hour[apiKey], 0)-yesterdayTotal;
      
      const averageToday = todayTotal / 24;

      dailyStats = {
        average: parseFloat(averageToday.toFixed(2)),
        lastPeriod: parseFloat(yesterdayTotal.toFixed(2)),
        predicted: parseFloat(todayTotal.toFixed(2)),
        consumedSoFar: parseFloat(consumedUntilNow.toFixed(2)) // Seulement les heures écoulées aujourd'hui
      };
    }

    const applianceData = [];
    for (let i = 0; i < 24; i++) {
      const isFuture = !isPreviousPeriod && i >= currentHour;
      applianceData.push({
        value: parseFloat(applianceArray[i].toFixed(2)),
        toolText: isFuture 
          ? `<div><i>Prédiction: ${applianceArray[i].toFixed(2)} kWh</i></div>`
          : `<div>${applianceArray[i].toFixed(2)} kWh</div>`,
        ...(isFuture ? { alpha: "35", dashed: "1" } : {})
      });
    }

    return { 
      categories,
      applianceData,
      applianceType,
      dailyStats
    };
  } catch (error) {
    console.error(`Error fetching daily stats for ${applianceType}:`, error);
    throw error;
  }
};

// Fonction pour récupérer les données par jour du mois (1-31)
export const fetchApplianceStatsByMonth = async (applianceType, isPreviousPeriod = false) => {
  try {
    const response = await axios.get('http://localhost:5000/api/appliance-data');
    const apiKey = applianceNameMap[applianceType] || applianceType;

    const daysInMonth = isPreviousPeriod 
      ? response.data.previous_month.data.length 
      : moment().daysInMonth();
    const categories = Array.from({length: daysInMonth}, (_, i) => ({
      label: (i + 1).toString()
    }));

    let applianceArray, monthlyStats;
    const currentDay = new Date().getDate();

    if (isPreviousPeriod) {
      // Mois précédent - données complètes
      const previous_month_data = response.data.previous_month.data;
      applianceArray = Array(daysInMonth).fill(0);
      previous_month_data.forEach(dayData => {
        const dayIndex = dayData.Jour - 1;
        if (dayIndex >= 0 && dayIndex < daysInMonth) {
          applianceArray[dayIndex] = dayData[apiKey];
        }
      });

      const previousMonthTotal = previous_month_data.reduce((sum, day) => sum + day[apiKey], 0);
      const averagePrevMonth = previousMonthTotal / previous_month_data.length;

      monthlyStats = {
        average: parseFloat(averagePrevMonth.toFixed(2)),
        lastPeriod: parseFloat(previousMonthTotal.toFixed(2)),
        predicted: 0,
        consumedSoFar: parseFloat(previousMonthTotal.toFixed(2)) // Total du mois précédent
      };
    } else {
      // Ce mois-ci - passé + prédictions
      const pastDaysData = response.data.current_month.past;
      const futureDaysData = response.data.current_month.future;
      const allDaysData = [...pastDaysData, ...futureDaysData].sort((a, b) => a.Jour - b.Jour);
      
      applianceArray = Array(daysInMonth).fill(0);
      allDaysData.forEach(dayData => {
        const dayIndex = dayData.Jour - 1;
        if (dayIndex >= 0 && dayIndex < daysInMonth) {
          applianceArray[dayIndex] = dayData[apiKey];
        }
      });

      const previousMonthTotal = response.data.previous_month.data.reduce((sum, day) => sum + day[apiKey], 0);
      const currentMonthTotal = applianceArray.reduce((sum, day) => sum + day, 0);
      const consumedUntilNow = pastDaysData.reduce((sum, day) => sum + day[apiKey], 0)-previousMonthTotal;
      
      const averageCurrentMonth = currentMonthTotal / daysInMonth;

      monthlyStats = {
        average: parseFloat(averageCurrentMonth.toFixed(2)),
        lastPeriod: parseFloat(previousMonthTotal.toFixed(2)),
        predicted: parseFloat(currentMonthTotal.toFixed(2)),
        consumedSoFar: parseFloat(consumedUntilNow.toFixed(2)) // Seulement les jours écoulés ce mois-ci
      };
    }

    const applianceData = [];
    for (let i = 0; i < daysInMonth; i++) {
      const isFuture = !isPreviousPeriod && (i+1) > currentDay;
      applianceData.push({
        value: parseFloat(applianceArray[i].toFixed(2)),
        toolText: isFuture 
          ? `<div><i>Prédiction: ${applianceArray[i].toFixed(2)} kWh</i></div>`
          : `<div>${applianceArray[i].toFixed(2)} kWh</div>`,
        ...(isFuture ? { alpha: "35", dashed: "1" } : {})
      });
    }

    return { 
      categories,
      applianceData,
      applianceType,
      monthlyStats
    };
  } catch (error) {
    console.error(`Error fetching monthly stats for ${applianceType}:`, error);
    throw error;
  }
};

// Fonction pour récupérer les données mensuelles (Jan-Dec)
export const fetchApplianceStatsByYear = async (applianceType, isPreviousPeriod = false) => {
  try {
    const response = await axios.get('http://localhost:5000/api/appliance-data');
    const apiKey = applianceNameMap[applianceType] || applianceType;

    const monthNames = moment.monthsShort();
    const categories = monthNames.map(month => ({
      label: month
    }));

    let applianceArray, annualStats;
    const currentMonth = new Date().getMonth() + 1; // +1 car les mois sont 1-12

    if (isPreviousPeriod) {
      // Année précédente - données complètes
      const previous_year_data = response.data.previous_year.data;
      applianceArray = Array(12).fill(0);
      previous_year_data.forEach(monthData => {
        const monthIndex = monthData.Mois - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          applianceArray[monthIndex] = monthData[apiKey];
        }
      });

      const previousYearTotal = previous_year_data.reduce((sum, month) => sum + month[apiKey], 0);
      const averagePrevYear = previousYearTotal / previous_year_data.length;

      annualStats = {
        average: parseFloat(averagePrevYear.toFixed(2)),
        lastPeriod: parseFloat(previousYearTotal.toFixed(2)),
        predicted: 0,
        consumedSoFar: parseFloat(previousYearTotal.toFixed(2)) // Total de l'année précédente
      };
    } else {
      // Cette année - passé + prédictions
      const pastMonthsData = response.data.current_year.past;
      const futureMonthsData = response.data.current_year.future;
      const allMonthsData = [...pastMonthsData, ...futureMonthsData].sort((a, b) => a.Mois - b.Mois);

      applianceArray = Array(12).fill(0);
      allMonthsData.forEach(monthData => {
        const monthIndex = monthData.Mois - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          applianceArray[monthIndex] = monthData[apiKey];
        }
      });

      const previousYearTotal = response.data.previous_year.data.reduce((sum, month) => sum + month[apiKey], 0);
      const currentYearTotal = applianceArray.reduce((sum, month) => sum + month, 0);
      const consumedUntilNow = pastMonthsData.reduce((sum, month) => sum + month[apiKey], 0)-previousYearTotal;
      
      const averageCurrentYear = currentYearTotal / 12;

      annualStats = {
        average: parseFloat(averageCurrentYear.toFixed(2)),
        lastPeriod: parseFloat(previousYearTotal.toFixed(2)),
        predicted: parseFloat(currentYearTotal.toFixed(2)),
        consumedSoFar: parseFloat(consumedUntilNow.toFixed(2)) // Seulement les mois écoulés cette année
      };
    }

    const applianceData = [];
    for (let i = 0; i < 12; i++) {
      const isFuture = !isPreviousPeriod && (i+1) >= currentMonth;
      applianceData.push({
        value: parseFloat(applianceArray[i].toFixed(2)),
        toolText: isFuture 
          ? `<div><i>Prédiction: ${applianceArray[i].toFixed(2)} kWh</i></div>`
          : `<div>${applianceArray[i].toFixed(2)} kWh</div>`,
        ...(isFuture ? { alpha: "35", dashed: "1" } : {})
      });
    }

    return { 
      categories,
      applianceData,
      applianceType,
      annualStats
    };
  } catch (error) {
    console.error(`Error fetching yearly stats for ${applianceType}:`, error);
    throw error;
  }
};
// Configuration du graphique journalier (heures)
export const getDailyApplianceChartConfig = (categories, applianceData, applianceType, dailyStats) => {
  const displayNameMap = applianceNameMap;
  const displayName = displayNameMap[applianceType];

  return {
    chart: {
      bgColor: "#1D1B41",
      bgAlpha: "0",
      canvasBgAlpha: "0",
      showBorder: "0",
      showCanvasBorder: "0",
      showValues: "0",
      placeValuesInside: "0",
      valueFontColor: "#FDFDFD",
      valueFontSize: "14",
      valuePosition: "top",
      showAlternateHGridColor: "0",
      legendBgAlpha: "0",
      usePlotGradientColor: "0",
      paletteColors: "#48DFBA",
      drawCustomLegendIcon: "1",
      baseFontSize: "14",
      baseFontColor: "#FDFDFD",
      showPlotBorder: "0",
      baseFont: "Nunito Sans",
      legendBorderAlpha: "0",
      numberPrefix: "",
      numberSuffix: " kWh",
      toolTipBgcolor: "#484E69",
      toolTipPadding: "5",
      toolTipBorderRadius: "2",
      toolTipBorderAlpha: "30",
      tooltipBorderThickness: "0.7",
      toolTipColor: "#FDFDFD",
      showXAxisLine: "1",
      showYAxisLine: "1",
      xAxisLineColor: "#9092A4",
      yAxisLineColor: "#9092A4",
      xAxisLineThickness: "1.5",
      yAxisLineThickness: "1.5",
      divLineColor: "#414761",
      divLineAlpha: "100",
      divLineThickness: "1.5",
      divLineDashed: "1",
      divLineDashGap: "2",
      divlineDashLen: "3",
      labelDisplay: "ROTATE",
      scrollHeight: "8",
      scrollColor: "#FDFDFD",
      flatScrollBars: "1",
      scrollShowButtons: "0",
      chartLeftMargin: "0",
      chartRightMargin: "0",
      canvasLeftMargin: "0",
      canvasRightMargin: "0",
      plotSpacePercent: "70",
      rotateLabels: "1",
      rotateYAxisName: "0",
      yAxisNameWidth: "30",
      xAxisName: "Heures",
      showShadow: "0",
      animation: "1"
    },
    categories: [
      {
        category: categories
      }
    ],
    dataset: [
      {
        seriesname: `${displayName} (horaire)`,
        data: applianceData.map((item, index) => {
          const isPredicted = item.alpha === "35";
          return {
            ...item,
            ...(isPredicted ? {
              color: "#48DFBA",
              alpha: "35",
              dashed: "1"
            } : {})
          };
        })
      }
    ],
    trendlines: [
      {
        line: [
          {
            startValue: dailyStats.average.toFixed(2),
            color: "#FDFDFD",
            thickness: "1",
            alpha: "50",
            dashed: "1",
            dashGap: "2",
            dashLen: "3",
            valueOnRight: "1",
            displayValue: `Moyenne: ${dailyStats.average.toFixed(2)} kWh`,
            tooltext: `Moyenne horaire: ${dailyStats.average.toFixed(2)} kWh`
          }
        ]
      }
    ]
  };
};

// Configuration du graphique mensuel (jours)
export const getMonthlyApplianceChartConfig = (categories, applianceData, applianceType, monthlyStats) => {
  const displayNameMap = applianceNameMap;
  const displayName = displayNameMap[applianceType] || applianceType;

  return {
    chart: {
      bgColor: "#1D1B41",
      bgAlpha: "0",
      canvasBgAlpha: "0",
      showBorder: "0",
      showCanvasBorder: "0",
      showValues: "0",
      placeValuesInside: "0",
      valueFontColor: "#FDFDFD",
      valueFontSize: "14",
      valuePosition: "top",
      showAlternateHGridColor: "0",
      legendBgAlpha: "0",
      usePlotGradientColor: "0",
      paletteColors: "#48DFBA",
      drawCustomLegendIcon: "1",
      baseFontSize: "14",
      baseFontColor: "#FDFDFD",
      showPlotBorder: "0",
      baseFont: "Nunito Sans",
      legendBorderAlpha: "0",
      numberPrefix: "",
      numberSuffix: " kWh",
      toolTipBgcolor: "#484E69",
      toolTipPadding: "5",
      toolTipBorderRadius: "2",
      toolTipBorderAlpha: "30",
      tooltipBorderThickness: "0.7",
      toolTipColor: "#FDFDFD",
      showXAxisLine: "1",
      showYAxisLine: "1",
      xAxisLineColor: "#9092A4",
      yAxisLineColor: "#9092A4",
      xAxisLineThickness: "1.5",
      yAxisLineThickness: "1.5",
      divLineColor: "#414761",
      divLineAlpha: "100",
      divLineThickness: "1.5",
      divLineDashed: "1",
      divLineDashGap: "2",
      divlineDashLen: "3",
      labelDisplay: "ROTATE",
      scrollHeight: "8",
      scrollColor: "#FDFDFD",
      flatScrollBars: "1",
      scrollShowButtons: "0",
      chartLeftMargin: "0",
      chartRightMargin: "0",
      canvasLeftMargin: "0",
      canvasRightMargin: "0",
      plotSpacePercent: "70",
      rotateLabels: "1",
      rotateYAxisName: "0",
      yAxisNameWidth: "30",
      xAxisName: "Jours",
      showShadow: "0",
      animation: "1"
    },
    categories: [
      {
        category: categories
      }
    ],
    dataset: [
      {
        seriesname: `${displayName} (quotidien)`,
        data: applianceData.map((item, index) => {
          const isPredicted = item.alpha === "35";
          return {
            ...item,
            ...(isPredicted ? {
              color: "#48DFBA",
              alpha: "35",
              dashed: "1"
            } : {})
          };
        })
      }
    ],
    trendlines: [
      {
        line: [
          {
            startValue: monthlyStats.average.toFixed(2),
            color: "#FDFDFD",
            thickness: "1",
            alpha: "50",
            dashed: "1",
            dashGap: "2",
            dashLen: "3",
            valueOnRight: "1",
            displayValue: `Moyenne: ${monthlyStats.average.toFixed(2)} kWh`,
            tooltext: `Moyenne journalière: ${monthlyStats.average.toFixed(2)} kWh`
          }
        ]
      }
    ]
  };
};

// Configuration du graphique annuel (mois)
export const getAnnualApplianceChartConfig = (categories, applianceData, applianceType, annualStats) => {
  const displayNameMap = applianceNameMap;
  const displayName = displayNameMap[applianceType] || applianceType;

  return {
    chart: {
      bgColor: "#1D1B41",
      bgAlpha: "0",
      canvasBgAlpha: "0",
      showBorder: "0",
      showCanvasBorder: "0",
      showValues: "0",
      placeValuesInside: "0",
      valueFontColor: "#FDFDFD",
      valueFontSize: "14",
      valuePosition: "top",
      showAlternateHGridColor: "0",
      legendBgAlpha: "0",
      usePlotGradientColor: "0",
      paletteColors: "#48DFBA",
      drawCustomLegendIcon: "1",
      baseFontSize: "14",
      baseFontColor: "#FDFDFD",
      showPlotBorder: "0",
      baseFont: "Nunito Sans",
      legendBorderAlpha: "0",
      numberPrefix: "",
      numberSuffix: " kWh",
      toolTipBgcolor: "#484E69",
      toolTipPadding: "5",
      toolTipBorderRadius: "2",
      toolTipBorderAlpha: "30",
      tooltipBorderThickness: "0.7",
      toolTipColor: "#FDFDFD",
      showXAxisLine: "1",
      showYAxisLine: "1",
      xAxisLineColor: "#9092A4",
      yAxisLineColor: "#9092A4",
      xAxisLineThickness: "1.5",
      yAxisLineThickness: "1.5",
      divLineColor: "#414761",
      divLineAlpha: "100",
      divLineThickness: "1.5",
      divLineDashed: "1",
      divLineDashGap: "2",
      divlineDashLen: "3",
      labelDisplay: "ROTATE",
      scrollHeight: "8",
      scrollColor: "#FDFDFD",
      flatScrollBars: "1",
      scrollShowButtons: "0",
      chartLeftMargin: "0",
      chartRightMargin: "0",
      canvasLeftMargin: "0",
      canvasRightMargin: "0",
      plotSpacePercent: "70",
      rotateLabels: "1",
      rotateYAxisName: "0",
      yAxisNameWidth: "30",
      xAxisName: "Mois",
      showShadow: "0",
      animation: "1"
    },
    categories: [
      {
        category: categories
      }
    ],
    dataset: [
      {
        seriesname: `${displayName} (mensuel)`,
        data: applianceData.map((item, index) => {
          const isPredicted = item.alpha === "35";
          return {
            ...item,
            ...(isPredicted ? {
              color: "#48DFBA",
              alpha: "35",
              dashed: "1"
            } : {})
          };
        })
      }
    ],
    trendlines: [
      {
        line: [
          {
            startValue: annualStats.average.toFixed(2),
            color: "#FDFDFD",
            thickness: "1",
            alpha: "50",
            dashed: "1",
            dashGap: "2",
            dashLen: "3",
            valueOnRight: "1",
            displayValue: `Moyenne: ${annualStats.average.toFixed(2)} kWh`,
            tooltext: `Moyenne mensuelle: ${annualStats.average.toFixed(2)} kWh`
          }
        ]
      }
    ]
  };
};