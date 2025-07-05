// utils/usageHelpers.js
import axios from 'axios';
import moment from 'moment';

export const fetchRoomUsageDataToday = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/usage-data');
    const { today, rooms } = response.data;

    const past_data = today.past;
    const future_predictions = today.future;
    const allData = [...past_data, ...future_predictions].sort((a, b) => a.Heure - b.Heure);

    const roomArrays = {};
    rooms.forEach(room => {
      roomArrays[room] = Array(24).fill(0);
    });

    allData.forEach(hourData => {
      const hour = hourData.Heure;
      rooms.forEach(room => {
        roomArrays[room][hour] = hourData[room];
      });
    });

    const cDataArr = [];
    const currentHour = parseInt(moment().format('H'),10);

    for (let i = 0; i < 24; i++) {
      const isFuture = i >= currentHour;
      const alpha = isFuture ? "35" : undefined;
      const toolText = isFuture ? "<div><i>Prédite: $rowLabel<br>$columnLabel: $dataValue</i></div>" : undefined;

      rooms.forEach((room, idx) => {
        cDataArr.push({
          rowid: idx.toString(),
          columnid: i.toString(),
          value: parseFloat(roomArrays[room][i]).toFixed(2).toString(),
          ...(isFuture ? { alpha, toolText } : {})
        });
      });
    }

    return { cDataArr, rooms };

  } catch (error) {
    console.error("Erreur dans fetchRoomUsageDataToday:", error);
    throw error;
  }
};


export const getUsageTodayConfig = (cDataArr, rooms) => {
  const clr1 = "#0C6C7F", clr2 = "#1E7E9E", clr3 = "#39ADBD", clr4 = "#98CEC2", clr5 = "#BAE0CF";

  const cRowArr = rooms.map((label, i) => ({ id: i.toString(), label }));
  const cColumnArr = Array.from({ length: 24 }, (_, i) => ({ id: i.toString(), label: `${i} hrs` }));

  return {
    chart: {
      bgColor: "#1D1B41",
      bgAlpha: "0",
      canvasBgAlpha: "0",
      showBorder: "0",
      showCanvasBorder: "0",
      baseFontColor: "#FDFDFD",
      baseFontSize: "14",
      baseFont: "Nunito Sans Light",
      baseFontBold: "0",
      showLegend: "1",
      legendBgAlpha: "0",
      legendBorderAlpha: "0",
      drawCustomLegendIcon: "1",
      legendItemFontSize: "18",
      showValues: "0",
      plotBorderColor: "#FDFDFD",
      xAxisLabelsOnTop: "1",
      toolTipBgcolor: "#484E69",
      toolTipColor: "#FDFDFD",
      plotToolText: "$rowLabel<br>$columnLabel: $dataValue",
      numberSuffix: " kWh",
      legendPosition: "bottom"
    },
    rows: { row: cRowArr },
    columns: { column: cColumnArr },
    dataset: [{ data: cDataArr }],
    colorrange: {
      gradient: "0",
      minValue: "0",
      code: clr1,
      color: [
        { code: clr1, minValue: "0", maxValue: "0.04", label: "0 - 0.04kWh" },
        { code: clr2, minValue: "0.04", maxValue: "0.12", label: "0.04 - 0.12kWh" },
        { code: clr3, minValue: "0.12", maxValue: "0.16", label: "0.12 - 0.16kWh" },
        { code: clr4, minValue: "0.16", maxValue: "0.20", label: "0.16 - 0.20kWh" },
        { code: clr5, minValue: "0.20", maxValue: "3", label: ">0.04kWh" }
      ]
    }
  };
};



export const fetchRoomUsageDataYesterday = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/usage-data');
    const { yesterday, rooms } = response.data;
    const past_data = yesterday.data;

    const allData = past_data.sort((a, b) => a.Heure - b.Heure);

    const roomArrays = {};
    rooms.forEach(room => {
      roomArrays[room] = Array(24).fill(0);
    });

    allData.forEach(hourData => {
      const hour = hourData.Heure;
      rooms.forEach(room => {
        const value = hourData[room];
        roomArrays[room][hour] = value;
      });
    });

    const cDataArr = [];

    for (let i = 0; i < 24; i++) {
      rooms.forEach((room, idx) => {
        const val = roomArrays[room][i];
        cDataArr.push({
          rowid: idx.toString(),
          columnid: i.toString(),
          value: val.toString()
        });
      });
    }

    return { cDataArr, rooms };

  } catch (error) {
     console.log("error", error);
    return { cDataArr: [], rooms: [] }; 
  }
};

export const getUsageYesterdayConfig = (cDataArr, rooms) => {
  //  const { cDataArrYesterday,rooms } = this.state;
  const clr1 = "#0C6C7F", clr2 = "#1E7E9E", clr3 = "#39ADBD", clr4 = "#98CEC2", clr5 = "#BAE0CF";
  const rowArr = rooms;
  const cRowArr = rowArr.map((label, i) => ({ id: i.toString(), label }));
  const cColumnArr = Array.from({ length: 24 }, (_, i) => ({ id: i.toString(), label: `${i} hrs` }));

  return {
    
    chart: {
    bgColor: "#1D1B41",
    bgAlpha: "0",
    canvasBgAlpha: "0",
    showBorder: "0",
    showCanvasBorder: "0",
    baseFontColor: "#FDFDFD",
    baseFontSize: "14",
    baseFont: "Nunito Sans Light",
    baseFontBold: "0",
    showLegend: "1",

    legendBgAlpha: "0",
    legendBorderAlpha: "0",
    drawCustomLegendIcon: "1",
    legendItemFontSize: "18",
    legendIconBorderThickness: "0",
    legendIconBorderAlpha: "0",
    showValues: "0",
    plotBorderColor: "#FDFDFD",
    plotBorderAlpha: "50",
    plotBorderThickness: "0.3",
    xAxisLabelsOnTop: "1",
    toolTipBgcolor: "#484E69",
    toolTipPadding: "5",
    toolTipBorderRadius: "2",
    toolTipBorderAlpha: "30",
    tooltipBorderThickness: "0.7",
    toolTipColor: "#FDFDFD",
    plotToolText: "$rowLabel<br>$columnLabel: $dataValue",
    numberSuffix: " kWh",
    labelDisplay: "ROTATE",
    legendPosition: "bottom",
    chartLeftMargin: "0",
    chartRightMargin: "0",
    canvasLeftMargin: "0",
    canvasRightMargin: "0",
    chartBottomMargin: "0",
    canvasBottomMargin: "0"
  },
    rows: {
      row: cRowArr
    },
    columns: {
      column: cColumnArr
    },
    dataset: [
      {
        data: cDataArr
      }
    ],
    colorrange: {
      gradient: "0",
      minValue: "0",
      code: clr1,
      color: [
        { code: clr1, minValue: "0", maxValue: "0.04", label: "0 - 0.04kWh" },
        { code: clr2, minValue: "0.04", maxValue: "0.12", label: "0.04 - 0.12kWh" },
        { code: clr3, minValue: "0.12", maxValue: "0.16", label: "0.12 - 0.16kWh" },
        { code: clr4, minValue: "0.16", maxValue: "0.20", label: "0.16 - 0.20kWh" },
        { code: clr5, minValue: "0.20", maxValue: "3", label: ">0.04kWh" }
      ]
    }
  };
  
};



export const fetchRoomUsageDataThisMonth = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/usage-data');
    const { current_month, rooms } = response.data;
    const past_data = current_month.past; // tableau des jours passés
    const future_predictions = current_month.future; // tableau des jours futurs

    // Concaténation et tri par jour (jour : 1..31)
    const allData = [...past_data, ...future_predictions].sort((a, b) => a.Jour - b.Jour);

    // Initialiser tableau vide par room et jours du mois
    const daysInMonth = moment().daysInMonth();
    const roomArrays = {};
    rooms.forEach(room => {
      roomArrays[room] = Array(daysInMonth).fill(0);
    });
    

    // Remplir roomArrays avec les données reçues
    allData.forEach(dayData => {
      const dayIndex = dayData.Jour-1; // Jour 1 => index 0
       
      rooms.forEach(room => {
        roomArrays[room][dayIndex] = dayData[room];
      });
    });

    // Construire tableau cDataArr pour le graphique
    const cDataArr = [];
    const currentDay = parseInt(moment().format('D'),10);

    for (let i = 0; i < daysInMonth; i++) {
      const isFuture = i + 1 > currentDay; // jours futurs après aujourd'hui
      const alpha = isFuture ? "35" : undefined;
      const toolText = isFuture ? "<div><i>Prédite: $rowLabel<br>$columnLabel: $dataValue</i></div>" : undefined;

      rooms.forEach((room, idx) => {
        cDataArr.push({
          rowid: idx.toString(),
          columnid: i.toString(),
          value: parseFloat(roomArrays[room][i]).toFixed(2).toString(),
          ...(isFuture ? { alpha, toolText } : {})
        });
      });
    }
    return { cDataArr, rooms };
  } catch (error) {
    console.error("Error fetching month usage data:", error);
    this.setState({ loadingMonth: false });
  }
};

export const getUsageThisMonthConfig = (cDataArr, rooms) => {
  //const { cDataArrMonth,rooms } = this.state;
  const rowArr = rooms;
  const clr1 = "#0C6C7F";
  const clr2 = "#1E7E9E";
  const clr3 = "#39ADBD";
  const clr4 = "#98CEC2";
  const clr5 = "#BAE0CF";

  const cRowArr = rowArr.map((label, i) => ({ id: i.toString(), label }));
  const daysInMonth = moment().daysInMonth();
  const cColumnArr = Array.from({ length: daysInMonth }, (_, i) => ({ id: i.toString(), label: `${moment().format('MMM')} ${i + 1}` }));

  return {
    chart: {
      bgColor: "#1D1B41",
      bgAlpha: "0",
      canvasBgAlpha: "0",
      showBorder: "0",
      showCanvasBorder: "0",
      baseFontColor: "#FDFDFD",
      baseFontSize: "14",
      baseFont: "Nunito Sans Light",
      baseFontBold: "0",
      showLegend: "1",
      legendBgAlpha: "0",
      legendBorderAlpha: "0",
      drawCustomLegendIcon: "1",
      legendItemFontSize: "18",
      legendIconBorderThickness: "0",
      legendIconBorderAlpha: "0",
      showValues: "0",
      plotBorderColor: "#FDFDFD",
      plotBorderAlpha: "50",
      plotBorderThickness: "0.3",
      xAxisLabelsOnTop: "1",
      toolTipBgcolor: "#484E69",
      toolTipPadding: "5",
      toolTipBorderRadius: "2",
      toolTipBorderAlpha: "30",
      tooltipBorderThickness: "0.7",
      toolTipColor: "#FDFDFD",
      plotToolText: "$rowLabel<br>$columnLabel: $dataValue",
      numberSuffix: " kWh",
      labelDisplay: "ROTATE",
      legendPosition: "bottom",
      chartLeftMargin: "0",
      chartRightMargin: "0",
      canvasLeftMargin: "0",
      canvasRightMargin: "0",
      chartBottomMargin: "0",
      canvasBottomMargin: "0"
    },
    rows: {
      row: cRowArr
    },
    columns: {
      column: cColumnArr
    },
    dataset: [
      {
        data: cDataArr
      }
    ],
    colorrange: {
      gradient: "0",
      minValue: "0",
      code: clr1,
      color: [
        { code: clr1, minValue: "0", maxValue: "0.2", label: "0 - 0.2kWh" },
        { code: clr2, minValue: "0.2", maxValue: "0.4", label: "0.2 - 0.4kWh" },
        { code: clr3, minValue: "0.4", maxValue: "0.6", label: "0.4 - 0.6kWh" },
        { code: clr4, minValue: "0.6", maxValue: "0.8", label: "0.6 - 0.8kWh" },
        { code: clr5, minValue: "0.8", maxValue: "2", label: ">0.8kWh" }
      ]
    }
  };
};



export const fetchRoomUsageDataLastMonth = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/usage-data');
    const { previous_month, rooms } = response.data;
    const daysInMonth = moment().subtract(1, 'months').daysInMonth();
    const past_data = previous_month.data; // Données sans prédictions
    const allData = past_data.sort((a, b) => a.Heure - b.Heure);

    const roomArrays = {};
    rooms.forEach(room => {
      roomArrays[room] = Array(24).fill(0);
    });

    allData.forEach(jourData => {
      const jour = jourData.Jour-1;
      rooms.forEach(room => {
        roomArrays[room][jour] = jourData[room];
      });
    });

    const cDataArr = [];
    for (let i = 0; i < daysInMonth; i++) {
      rooms.forEach((room, idx) => {
        cDataArr.push({
          rowid: idx.toString(),
          columnid: i.toString(),
          value: roomArrays[room][i].toString()
        });
      });
    }



    /*
    this.setState({
      cDataArrLastMonth: newCDataArr,
      loading: false,rooms: rooms
    });*/
    return { cDataArr, rooms };
  } catch (error) {
    console.error("Error fetching last month's data:", error);
    this.setState({ loading: false });
  }
};






export const getUsageLastMonthConfig = (cDataArr, rooms) => {
  //const { cDataArrLastMonth,rooms } = this.state;
  const rowArr = rooms;
const clr1 = "#0C6C7F";
  const clr2 = "#1E7E9E";
  const clr3 = "#39ADBD";
  const clr4 = "#98CEC2";
  const clr5 = "#BAE0CF";

  const cRowArr = rowArr.map((label, i) => ({ id: i.toString(), label }));
  const daysInMonth = moment().subtract(1, 'months').daysInMonth();
  const cColumnArr = Array.from({ length: daysInMonth }, (_, i) => ({ id: i.toString(), label: `${moment().format('MMM')} ${i + 1}` }));

  return {
    chart: {
      bgColor: "#1D1B41",
      bgAlpha: "0",
      canvasBgAlpha: "0",
      showBorder: "0",
      showCanvasBorder: "0",
      baseFontColor: "#FDFDFD",
      baseFontSize: "14",
      baseFont: "Nunito Sans Light",
      baseFontBold: "0",
      showLegend: "1",
      legendBgAlpha: "0",
      legendBorderAlpha: "0",
      drawCustomLegendIcon: "1",
      legendItemFontSize: "18",
      legendIconBorderThickness: "0",
      legendIconBorderAlpha: "0",
      showValues: "0",
      plotBorderColor: "#FDFDFD",
      plotBorderAlpha: "50",
      plotBorderThickness: "0.3",
      xAxisLabelsOnTop: "1",
      toolTipBgcolor: "#484E69",
      toolTipPadding: "5",
      toolTipBorderRadius: "2",
      toolTipBorderAlpha: "30",
      tooltipBorderThickness: "0.7",
      toolTipColor: "#FDFDFD",
      plotToolText: "$rowLabel<br>$columnLabel: $dataValue",
      numberSuffix: " kWh",
      labelDisplay: "ROTATE",
      legendPosition: "bottom",
      chartLeftMargin: "0",
      chartRightMargin: "0",
      canvasLeftMargin: "0",
      canvasRightMargin: "0",
      chartBottomMargin: "0",
      canvasBottomMargin: "0"
    },
    rows: {
      row: cRowArr
    },
    columns: {
      column: cColumnArr
    },
    dataset: [
      {
        data: cDataArr
      }
    ],
    colorrange: {
      gradient: "0",
      minValue: "0",
      code: clr1,
      color: [
        { code: clr1, minValue: "0", maxValue: "0.2", label: "0 - 0.2kWh" },
        { code: clr2, minValue: "0.2", maxValue: "0.4", label: "0.2 - 0.4kWh" },
        { code: clr3, minValue: "0.4", maxValue: "0.6", label: "0.4 - 0.6kWh" },
        { code: clr4, minValue: "0.6", maxValue: "0.8", label: "0.6 - 0.8kWh" },
        { code: clr5, minValue: "0.8", maxValue: "2", label: ">0.8kWh" }
      ]
    }
  };
};


export const fetchRoomUsageDataThisYear = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/usage-data');
    const { current_year, rooms } = response.data;
    const past_data = current_year.past;
    const future_predictions = current_year.future;

    const allData = [...past_data, ...future_predictions].sort((a, b) => a.Heure - b.Heure);

    const roomArrays = {};
    const monthsInYear = 12;
    rooms.forEach(room => {
      roomArrays[room] = Array(monthsInYear).fill(0);
    });

    allData.forEach(monthData => {
      const monthIndex = monthData.Mois - 1; // Mois 1 => index 0
      rooms.forEach(room => {
        roomArrays[room][monthIndex] = monthData[room];
      });
    });

    const cDataArr = [];
    const currentMonth = parseInt(moment().format('M'),10); // Mois courant

    for (let i = 0; i < monthsInYear; i++) {
      const isFuture = i + 1 >= currentMonth;
      const alpha = isFuture ? "35" : undefined;
      const toolText = isFuture ? "<div><i>Prédite: $rowLabel<br>$columnLabel: $dataValue</i></div>" : undefined;

      rooms.forEach((room, idx) => {
        cDataArr.push({
          rowid: idx.toString(),
          columnid: i.toString(),
          value: roomArrays[room][i].toFixed(2).toString(),
          ...(isFuture ? { alpha, toolText } : {})
        });
      });
    }
    return { cDataArr, rooms };
    //this.setState({ cDataArrYear: newCDataArr, loadingYear: false,rooms: rooms });
  } catch (error) {
    console.error("Error fetching year usage data:", error);
    this.setState({ loadingYear: false });
  }
};


export const getUsageThisYearConfig   = (cDataArr, rooms) => {
  //const { cDataArrYear,rooms } = this.state;
  const rowArr = rooms;
  const clr1 = "#0C6C7F";
  const clr2 = "#1E7E9E";
  const clr3 = "#39ADBD";
  const clr4 = "#98CEC2";
  const clr5 = "#BAE0CF";

  const cRowArr = rowArr.map((label, i) => ({ id: i.toString(), label }));
  const cColumnArr = Array.from({ length: 12 }, (_, i) => ({ id: i.toString(), label: moment().month(i).format('MMM') }));

  return {
    chart: {
    bgColor: "#1D1B41",
    bgAlpha: "0",
    canvasBgAlpha: "0",
    showBorder: "0",
    showCanvasBorder: "0",
    baseFontColor: "#FDFDFD",
    baseFontSize: "14",
    baseFont: "Nunito Sans Light",
    baseFontBold: "0",
    showLegend: "1",
  
    legendBgAlpha: "0",
    legendBorderAlpha: "0",
    drawCustomLegendIcon: "1",
    legendItemFontSize: "18",
    legendIconBorderThickness: "0",
    legendIconBorderAlpha: "0",
    showValues: "0",
    plotBorderColor: "#D8D8D8",
    plotBorderAlpha: "30",
    plotBorderThickness: "0.7",
    xAxisLabelsOnTop: "1",
    toolTipBgcolor: "#484E69",
    toolTipPadding: "5",
    toolTipBorderRadius: "2",
    toolTipBorderAlpha: "30",
    tooltipBorderThickness: "0.7",
    toolTipColor: "#FDFDFD",
    plotToolText: "$rowLabel<br>$columnLabel: $dataValue",
    numberSuffix: " kWh",
    legendPosition: "bottom",
    chartLeftMargin: "0",
    chartRightMargin: "0",
    canvasLeftMargin: "0",
    canvasRightMargin: "0",
    chartBottomMargin: "0",
    canvasBottomMargin: "0"
  },
    rows: {
      row: cRowArr
    },
    columns: {
      column: cColumnArr
    },
    dataset: [
      {
        data: cDataArr
      }
    ],
    colorrange: {
      gradient: "0",
      minValue: "0",
      code: clr1,
      color: [
        { code: clr1, minValue: "0", maxValue: "4", label: "0 - 4kWh" },
        { code: clr2, minValue: "4", maxValue: "8", label: "4 - 8kWh" },
        { code: clr3, minValue: "8", maxValue: "14", label: "8 - 14kWh" },
        { code: clr4, minValue: "14", maxValue: "20", label: "14 - 20kWh" },
        { code: clr5, minValue: "20", maxValue: "40", label: ">20kWh" }
      ]
    }
  };
};


export const fetchRoomUsageDataLastYear = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/usage-data');
    const { previous_year, rooms } = response.data;
    const past_data = previous_year.data;

    const allData = [...past_data].sort((a, b) => a.Heure - b.Heure);

    const roomArrays = {};
    const monthsInYear = 12;
    rooms.forEach(room => {
      roomArrays[room] = Array(monthsInYear).fill(0);
    });

    allData.forEach(monthData => {
      const monthIndex = monthData.Mois - 1; // Mois 1 => index 0
      rooms.forEach(room => {
        roomArrays[room][monthIndex] = monthData[room];
      });
    });

    const cDataArr = [];

    for (let i = 0; i < monthsInYear; i++) {
      rooms.forEach((room, idx) => {
        cDataArr.push({
          rowid: idx.toString(),
          columnid: i.toString(),
          value: roomArrays[room][i].toString()
        });
      });
    }

    return { cDataArr, rooms };

  } catch (error) {
    console.error("Error fetching last year usage data:", error);
  }
};


export const getUsageLastYearConfig = (cDataArr, rooms) => {
  const rowArr = rooms;
  const clr1 = "#0C6C7F";
  const clr2 = "#1E7E9E";
  const clr3 = "#39ADBD";
  const clr4 = "#98CEC2";
  const clr5 = "#BAE0CF";

  const cRowArr = rowArr.map((label, i) => ({ id: i.toString(), label }));
  const cColumnArr = Array.from({ length: 12 }, (_, i) => ({
    id: i.toString(),
    label: moment().month(i).format('MMM')
  }));

  return {
    chart: {
      bgColor: "#1D1B41",
      bgAlpha: "0",
      canvasBgAlpha: "0",
      showBorder: "0",
      showCanvasBorder: "0",
      baseFontColor: "#FDFDFD",
      baseFontSize: "14",
      baseFont: "Nunito Sans Light",
      baseFontBold: "0",
      showLegend: "1",
      legendBgAlpha: "0",
      legendBorderAlpha: "0",
      drawCustomLegendIcon: "1",
      legendItemFontSize: "18",
      legendIconBorderThickness: "0",
      legendIconBorderAlpha: "0",
      showValues: "0",
      plotBorderColor: "#D8D8D8",
      plotBorderAlpha: "30",
      plotBorderThickness: "0.7",
      xAxisLabelsOnTop: "1",
      toolTipBgcolor: "#484E69",
      toolTipPadding: "5",
      toolTipBorderRadius: "2",
      toolTipBorderAlpha: "30",
      tooltipBorderThickness: "0.7",
      toolTipColor: "#FDFDFD",
      plotToolText: "$rowLabel<br>$columnLabel: $dataValue",
      numberSuffix: " kWh",
      legendPosition: "bottom",
      chartLeftMargin: "0",
      chartRightMargin: "0",
      canvasLeftMargin: "0",
      canvasRightMargin: "0",
      chartBottomMargin: "0",
      canvasBottomMargin: "0"
    },
    rows: {
      row: cRowArr
    },
    columns: {
      column: cColumnArr
    },
    dataset: [
      {
        data: cDataArr
      }
    ],
    colorrange: {
      gradient: "0",
      minValue: "0",
      code: clr1,
      color: [
        { code: clr1, minValue: "0", maxValue: "4", label: "0 - 4kWh" },
        { code: clr2, minValue: "4", maxValue: "8", label: "4 - 8kWh" },
        { code: clr3, minValue: "8", maxValue: "14", label: "8 - 14kWh" },
        { code: clr4, minValue: "14", maxValue: "20", label: "14 - 20kWh" },
        { code: clr5, minValue: "20", maxValue: "40", label: ">20kWh" }
      ]
    }
  };
};

export const fetchConsumptionStatsByMonth = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/usage-data');
    const { monthly } = response.data.consumption_stats;


    const {current_month,rooms} = response.data;
    const currentDate = moment();
    const currentDayOfMonth = currentDate.date();
    let roomTotals = {};
    let totalConsumption = 0;
    const daysThisMonth = current_month.past
      .slice(31, 31 + currentDayOfMonth) // Prendre uniquement les jours du mois courant
      .filter(dayData => dayData.Jour <= currentDayOfMonth);
    roomTotals = rooms.reduce((acc, room) => {
      acc[room] = daysThisMonth.reduce((sum, day) => sum + (day[room] || 0), 0);
      return acc;
    }, {});
    totalConsumption = Object.values(roomTotals).reduce((sum, val) => sum + val, 0);
  

    const monthNames = moment.monthsShort();
    // Prepare categories (all months)
    const catArr = monthNames.map((month, index) => ({
      label: month
    }));
    
    // Prepare data for past months
    const pastMonthsData = monthly.all_periods.map(monthData => ({
      value: parseFloat(monthData.Consommation.toFixed(2)), // Convertir en nombre après toFixed
      toolText: `<div>Électricité: ${monthData.Consommation.toFixed(2)} kWh</div>`
    }));
    
    // Prepare data for current month (predicted)
    const currentMonthIndex = new Date().getMonth(); // 0-based
    const currentMonthPrediction = {
      value: parseFloat(monthly.current_period_prediction.predicted_consumption.toFixed(2)),
      toolText: `<div>Prédiction: ${monthly.current_period_prediction.predicted_consumption.toFixed(2)} kWh</div>`,
      alpha: "35",
      dashed: "1"
    };
    
    // Combine all data in correct order
    const electricityDataArr = [...pastMonthsData];
    electricityDataArr[currentMonthIndex] = currentMonthPrediction;
    for (const prediction of monthly.future_predictions) {
      electricityDataArr[prediction.month - 1] = {
        value: parseFloat(prediction.predicted_consumption.toFixed(2)),
        toolText: `<div><i>Prédiction: ${prediction.predicted_consumption.toFixed(2)} kWh</i></div>`,
        alpha: "35",
        dashed: "1"
      };
    }
    
    const monthlyStats = {
      average: parseFloat(monthly.average.toFixed(2)),
      lastPeriod: parseFloat(monthly.last_period.toFixed(2)),
      predicted: parseFloat(monthly.predicted.toFixed(2)),
      consumedSoFar: parseFloat(totalConsumption.toFixed(2)),
      currentPeriodPrediction: {
        ...monthly.current_period_prediction,
        predicted_consumption: parseFloat(monthly.current_period_prediction.predicted_consumption.toFixed(2))
      }
    };
    
    return { 
      categories: catArr,
      electricityData: electricityDataArr,
      monthlyStats
    };
    
  } catch (error) {
    console.error("Error fetching monthly consumption stats:", error);
    throw error;
  }
};

export const getMonthlyConsumptionChartConfig = (categories, electricityData, monthlyStats) => {
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
        seriesname: "Consommation mensuelle",
        data: electricityData.map((item, index) => {
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
            tooltext: `Moyenne mensuelle: ${monthlyStats.average.toFixed(2)} kWh`
          }
        ]
      }
    ]
  };
};

export const fetchConsumptionStatsByYear = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/usage-data');
    const { annual } = response.data.consumption_stats;


    const {current_month,current_year,rooms} = response.data;
    const currentDate = moment();
    const currentDayOfMonth = currentDate.date();
      const currentMonth = currentDate.month() + 1;
    let roomTotals = {};
    let totalConsumption = 0;
    const monthsThisYear = current_year.past
          .slice(12, 12 + currentMonth) // Prendre uniquement les mois de l'année courante
          .filter(monthData => monthData.Mois <= currentMonth);
        
        // Pour le mois courant, nous devons utiliser les jours passés
        const daysInCurrentMonth = current_month.past
          .slice(31, 31 + currentDayOfMonth)
          .filter(dayData => dayData.Jour <= currentDayOfMonth);

        roomTotals = rooms.reduce((acc, room) => {
          // Somme des mois complets (mois précédents)
          const monthsSum = monthsThisYear
            .filter(month => month.Mois < currentMonth)
            .reduce((sum, month) => sum + (month[room] || 0), 0);
          
          // Somme des jours passés du mois courant
          const daysSum = daysInCurrentMonth.reduce((sum, day) => sum + (day[room] || 0), 0);
          
          acc[room] = monthsSum + daysSum;
          return acc;
        }, {});

        totalConsumption = Object.values(roomTotals).reduce((sum, val) => sum + val, 0);
    
    // Prepare categories (past years + current year + future predictions)
    const years = annual.all_periods.map(y => y.Annee)
      .concat(annual.future_predictions.map(y => y.year))
      .concat([annual.current_period_prediction.year]);
    
    const uniqueYears = [...new Set(years)].sort();
    const catArr = uniqueYears.map(year => ({
      label: year.toString()
    }));
    
    // Prepare data for past years
    const pastYearsData = annual.all_periods.map(yearData => ({
      value: parseFloat(yearData.Consommation.toFixed(2)),
      toolText: `<div>Électricité: ${yearData.Consommation.toFixed(2)} kWh</div>`
    }));
    
    // Prepare data for current year (predicted)
    const currentYearPrediction = {
      value: parseFloat(annual.current_period_prediction.predicted_consumption.toFixed(2)),
      toolText: `<div>Prédiction: ${annual.current_period_prediction.predicted_consumption.toFixed(2)} kWh</div>`,
      alpha: "35",
      dashed: "1"
    };
    
    // Combine all data in correct order
    const electricityDataArr = [...pastYearsData];
    
    // Find index of current year in categories
    const currentYearIndex = uniqueYears.indexOf(annual.current_period_prediction.year);
    if (currentYearIndex !== -1) {
      electricityDataArr[currentYearIndex] = currentYearPrediction;
    }
    
    // Add future predictions
    annual.future_predictions.forEach(prediction => {
      const index = uniqueYears.indexOf(prediction.year);
      if (index !== -1) {
        electricityDataArr[index] = {
          value: parseFloat(prediction.predicted_consumption.toFixed(2)),
          toolText: `<div><i>Prédiction: ${prediction.predicted_consumption.toFixed(2)} kWh</i></div>`,
          alpha: "35",
          dashed: "1"
        };
      }
    });
    
    const annualStats = {
      average: parseFloat(annual.average.toFixed(2)),
      lastPeriod: parseFloat(annual.last_period.toFixed(2)),
      predicted: parseFloat(annual.predicted.toFixed(2)),
      consumedSoFar: parseFloat(totalConsumption.toFixed(2)),
      currentPeriodPrediction: {
        ...annual.current_period_prediction,
        predicted_consumption: parseFloat(annual.current_period_prediction.predicted_consumption.toFixed(2))
      }
    };
    
    return { 
      categories: catArr,
      electricityData: electricityDataArr,
      annualStats
    };
    
  } catch (error) {
    console.error("Error fetching annual consumption stats:", error);
    throw error;
  }
};

export const getAnnualConsumptionChartConfig = (categories, electricityData, annualStats) => {
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
      xAxisName: "Année",
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
        seriesname: "Consommation annuelle",
        data: electricityData.map((item, index) => {
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
            tooltext: `Moyenne annuelle: ${annualStats.average.toFixed(2)} kWh`
          }
        ]
      }
    ]
  };
};