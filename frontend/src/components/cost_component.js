import React from 'react';
import ReactFC from 'react-fusioncharts';
import ReactDOM from 'react-dom';
import moment from 'moment';
import CostTableComponent from './cost_table_component';
import {
  fetchConsumptionStatsByMonth,
  getMonthlyConsumptionChartConfig,
  fetchConsumptionStatsByYear,
  getAnnualConsumptionChartConfig
} from '../utils/usageHelpers';
moment.locale('fr')
class CostComponent extends React.Component {
  state = {
    selectedButton: 'c1',
    categories: [],
    electricityData: [],
    stats: {}
  };

  constructor(props) {
    super(props);
    this.onClickbutton1 = this.onClickbutton1.bind(this);
    this.onClickbutton2 = this.onClickbutton2.bind(this);
  }

  async componentDidMount() {
    document.getElementById(this.state.selectedButton).click();

    if (this.props.activePeriod === "month") {
      document.getElementById("c1").innerHTML = "CE MOIS-CI";
      document.getElementById("c2").innerHTML = "MOIS PRÉCÉDENT";
      document.getElementById("date").innerHTML = moment().format('MMMM YYYY');
    }

    if (this.props.activePeriod === "year") {
      document.getElementById("c1").innerHTML = "CETTE ANNÉE";
      document.getElementById("c2").innerHTML = "L'ANNÉE DERNIÈRE";
    }
  }

  async onClickbutton1() {
    window.b2selected = false;
    this.setState({ selectedButton: 'c1' });
    this.updateButtonStyles("c1", "c2");

    try {
      let data;
      let config;

      if (this.props.activePeriod === "month") {
        data = await fetchConsumptionStatsByMonth();
        config = getMonthlyConsumptionChartConfig(data.categories, data.electricityData, data.monthlyStats);
        
        // Update table values
        const sfmVal = data.monthlyStats.consumedSoFar;
        document.getElementById("co-tablecell-title1").innerHTML = "Consommation actuelle";
        document.getElementById("co-tablecell-value1").innerHTML = `${sfmVal} kWh`;
        document.getElementById("co-tablecell-title2").innerHTML = "Consommation prévue";
        document.getElementById("co-tablecell-value2").innerHTML = `${data.monthlyStats.predicted} kWh`;
        document.getElementById("co-tablecell-title3").innerHTML = "Moyenne mensuelle";
        document.getElementById("co-tablecell-value3").innerHTML = `${data.monthlyStats.average} kWh`;
        document.getElementById("co-tablecell-title4").innerHTML = " ";
        document.getElementById("co-tablecell-value4").innerHTML = " ";
      } else {
        data = await fetchConsumptionStatsByYear();
        config = getAnnualConsumptionChartConfig(data.categories, data.electricityData, data.annualStats);
        
        // Update table values for year view
        document.getElementById("co-tablecell-title1").innerHTML = "Consommation actuelle";
        document.getElementById("co-tablecell-value1").innerHTML = `${data.annualStats.consumedSoFar} kWh`;
        document.getElementById("co-tablecell-title2").innerHTML = "Consommation prévue";
        document.getElementById("co-tablecell-value2").innerHTML = `${data.annualStats.predicted} kWh`;
        document.getElementById("co-tablecell-title3").innerHTML = "Moyenne annuelle";
        document.getElementById("co-tablecell-value3").innerHTML = `${data.annualStats.average} kWh`;
        document.getElementById("co-tablecell-title4").innerHTML = " ";
        document.getElementById("co-tablecell-value4").innerHTML = " ";
      }

      this.setState({
        categories: data.categories,
        electricityData: data.electricityData,
        stats: data.monthlyStats || data.annualStats
      }, () => {
        this.renderChart(config);
      });
    } catch (error) {
      console.error("Error loading button 1 data:", error);
    }
  }

  async onClickbutton2() {
    window.b2selected = true;
    this.setState({ selectedButton: 'c2' });
    this.updateButtonStyles("c2", "c1");

    try {
      let data;
      let config;

      if (this.props.activePeriod === "month") {
        data = await fetchConsumptionStatsByMonth();
        config = getMonthlyConsumptionChartConfig(data.categories, data.electricityData, data.monthlyStats);
        
        const currentMonthIndex = new Date().getMonth();
        const lastMonthIndex = (currentMonthIndex - 1 + 12) % 12;
        const twoMonthsAgoIndex = (currentMonthIndex - 2 + 12) % 12;
        
        const twoMonthsAgoData = data.electricityData[twoMonthsAgoIndex];
        const lastMonthData = data.electricityData[lastMonthIndex];
        
        const monthNames = moment.months();
        document.getElementById("co-tablecell-title1").innerHTML = monthNames[twoMonthsAgoIndex];
        document.getElementById("co-tablecell-value1").innerHTML = `${twoMonthsAgoData.value} kWh`;
        document.getElementById("co-tablecell-title2").innerHTML = monthNames[lastMonthIndex];
        document.getElementById("co-tablecell-value2").innerHTML = `${lastMonthData.value} kWh`;
        
        const savings_value = Math.round((twoMonthsAgoData.value - lastMonthData.value) * 100) / 100;
        if (savings_value < 0) {
          document.getElementById("co-tablecell-title3").innerHTML = "Écart de consommation";
          document.getElementById("co-tablecell-value3").innerHTML = `${Math.abs(savings_value)} kWh<span style='color: #EF5052;'>▼</span>`;
        } else {
          document.getElementById("co-tablecell-title3").innerHTML = "Écart de consommation";
          document.getElementById("co-tablecell-value3").innerHTML = `${savings_value} kWh<span style='color: #B4F9A1;'>▲</span>`;
        }
        
        document.getElementById("co-tablecell-title4").innerHTML = " ";
        document.getElementById("co-tablecell-value4").innerHTML = " ";
        document.getElementById("co-tablecell-title4").style.display = "none";
        document.getElementById("co-tablecell-value4").style.display = "none";
      } else {
        data = await fetchConsumptionStatsByYear();
        config = getAnnualConsumptionChartConfig(data.categories, data.electricityData, data.annualStats);
        
        // Get last two complete years (excluding current year predictions)
        const currentYear = new Date().getFullYear();
        const pastYears = data.categories
          .filter(cat => parseInt(cat.label, 10) < currentYear)
          .sort((a, b) => parseInt(b.label, 10) - parseInt(a.label, 10));

        if (pastYears.length >= 2) {
          const lastYear = pastYears[0].label;
          const yearBeforeLast = pastYears[1].label;
          
          const lastYearIndex = data.categories.findIndex(cat => cat.label === lastYear);
          const yearBeforeLastIndex = data.categories.findIndex(cat => cat.label === yearBeforeLast);
          
          const lastYearData = data.electricityData[lastYearIndex];
          const yearBeforeLastData = data.electricityData[yearBeforeLastIndex];
          
          document.getElementById("co-tablecell-title1").innerHTML = yearBeforeLast;
          document.getElementById("co-tablecell-value1").innerHTML = `${yearBeforeLastData.value} kWh`;
          document.getElementById("co-tablecell-title2").innerHTML = lastYear;
          document.getElementById("co-tablecell-value2").innerHTML = `${lastYearData.value} kWh`;
          
          const savings_value = Math.round((yearBeforeLastData.value - lastYearData.value) * 100) / 100;
          if (savings_value < 0) {
            document.getElementById("co-tablecell-title3").innerHTML = "Écart de consommation";
            document.getElementById("co-tablecell-value3").innerHTML = `${Math.abs(savings_value)} kWh<span style='color: #EF5052;'>▼</span>`;
          } else {
            document.getElementById("co-tablecell-title3").innerHTML = "Écart de consommation";
            document.getElementById("co-tablecell-value3").innerHTML = `${savings_value} kWh<span style='color: #B4F9A1;'>▲</span>`;
          }
          
          document.getElementById("co-tablecell-title4").innerHTML = " ";
          document.getElementById("co-tablecell-value4").innerHTML = " ";
          document.getElementById("co-tablecell-title4").style.display = "none";
          document.getElementById("co-tablecell-value4").style.display = "none";
        }
      }

      this.setState({
        categories: data.categories,
        electricityData: data.electricityData,
        stats: data.monthlyStats || data.annualStats
      }, () => {
        this.renderChart(config);
      });
    } catch (error) {
      console.error("Error loading button 2 data:", error);
    }
  }

  updateButtonStyles(activeId, inactiveId) {
    document.getElementById(inactiveId).style.borderBottom = "none";
    document.getElementById(inactiveId).style.color = "#FDFDFD";
    document.getElementById(inactiveId).style.opacity = "0.5";

    document.getElementById(activeId).style.color = "#FDFDFD";
    document.getElementById(activeId).style.opacity = "1";
    document.getElementById(activeId).style.borderBottom = "solid 2px #FDFDFD";

    document.getElementById(activeId).style.textTransform = "uppercase";
    document.getElementById(inactiveId).style.textTransform = "uppercase";
  }

  renderChart(config) {
    const chartconfig = { ...this.props.costchart, dataSource: config };
    ReactDOM.unmountComponentAtNode(document.getElementById('co-chart-container'));
    ReactDOM.render(<ReactFC {...chartconfig} />, document.getElementById('co-chart-container'));
  }

  render() {
    return (
      <div>
        <div className="container-fluid">
          <div className="container-fluid">
            <div className="row pl-5 pr-5 pt-5 pb-0 time-control">
              <div className="col-xs-6 mr-4 ml-4 pl-1 pr-1" id="c1" onClick={this.onClickbutton1}>
                THIS MONTH
              </div>
              <div className="col-xs-6 mr-4 ml-4 pl-1 pr-1" id="c2" onClick={this.onClickbutton2}>
                LAST MONTH
              </div>
            </div>
          </div>
        </div>
        <br />
        <CostTableComponent />
        <div id="co-chart-container" className="pt-0 pb-3 pr-5 pl-5" />
      </div>
    );
  }
}

export default CostComponent;