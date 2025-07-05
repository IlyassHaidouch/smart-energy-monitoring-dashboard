import React from 'react';
import ReactFC from 'react-fusioncharts';
import ReactDOM from 'react-dom';
import './app.css';
import {
  fetchApplianceStatsByDay,
  getDailyApplianceChartConfig,
  fetchApplianceStatsByMonth,
  getMonthlyApplianceChartConfig,
  fetchApplianceStatsByYear,
  getAnnualApplianceChartConfig
} from '../utils/applianceHelpers.js';

class AppliancesComponent extends React.Component {
  state = {
    selectedButton: 'a1',
    categories: [],
    applianceData: [],
    stats: {},
    selectedUsage: 'heating and ac'
  };

  constructor(props) {
    super(props);
    this.onClickbutton1 = this.onClickbutton1.bind(this);
    this.onClickbutton2 = this.onClickbutton2.bind(this);
    this.onUsageChange = this.onUsageChange.bind(this);
  }

  async componentDidMount() {
    document.getElementById(this.state.selectedButton).click();

    if (this.props.activePeriod === "today") {
      document.getElementById("a1").innerHTML = "AUJOURD'HUI";
      document.getElementById("a2").innerHTML = "HIER";
    }

    if (this.props.activePeriod === "month") {
      document.getElementById("a1").innerHTML = "CE MOIS-CI";
      document.getElementById("a2").innerHTML = "MOIS PRÉCÉDENT";
    }

    if (this.props.activePeriod === "year") {
      document.getElementById("a1").innerHTML = "CETTE ANNÉE";
      document.getElementById("a2").innerHTML = "L'ANNÉE DERNIÈRE";
    }
  }

  async onClickbutton1() {
    window.b2selected = false;
    this.setState({ selectedButton: 'a1' });
    this.updateButtonStyles("a1", "a2");

    try {
      let data;
      let config;

      if (this.props.activePeriod === "today") {
        data = await fetchApplianceStatsByDay(this.state.selectedUsage, false);
        config = getDailyApplianceChartConfig(data.categories, data.applianceData, this.state.selectedUsage, data.dailyStats);
      } 
      else if (this.props.activePeriod === "month") {
        data = await fetchApplianceStatsByMonth(this.state.selectedUsage, false);
        config = getMonthlyApplianceChartConfig(data.categories, data.applianceData, this.state.selectedUsage, data.monthlyStats);
      } 
      else {
        data = await fetchApplianceStatsByYear(this.state.selectedUsage, false);
        config = getAnnualApplianceChartConfig(data.categories, data.applianceData, this.state.selectedUsage, data.annualStats);
      }

      this.setState({
        categories: data.categories,
        applianceData: data.applianceData,
        stats: data.dailyStats || data.monthlyStats || data.annualStats
      }, () => {
        this.renderChart(config);
      });
    } catch (error) {
      console.error("Error loading button 1 data:", error);
    }
  }

  async onClickbutton2() {
    window.b2selected = true;
    this.setState({ selectedButton: 'a2' });
    this.updateButtonStyles("a2", "a1");

    try {
      let data;
      let config;

      if (this.props.activePeriod === "today") {
        data = await fetchApplianceStatsByDay(this.state.selectedUsage, true);
        config = getDailyApplianceChartConfig(data.categories, data.applianceData, this.state.selectedUsage, data.dailyStats);
      } 
      else if (this.props.activePeriod === "month") {
        data = await fetchApplianceStatsByMonth(this.state.selectedUsage, true);
        config = getMonthlyApplianceChartConfig(data.categories, data.applianceData, this.state.selectedUsage, data.monthlyStats);
      } 
      else {
        data = await fetchApplianceStatsByYear(this.state.selectedUsage, true);
        config = getAnnualApplianceChartConfig(data.categories, data.applianceData, this.state.selectedUsage, data.annualStats);
      }

      this.setState({
        categories: data.categories,
        applianceData: data.applianceData,
        stats: data.dailyStats || data.monthlyStats || data.annualStats
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

  onUsageChange(e) {
    const selectedUsage = e.currentTarget.value.toString().toLowerCase();
    this.setState({ selectedUsage }, () => {
      document.getElementById(this.state.selectedButton).click();
    });
  }

  renderChart(config) {
    const chartconfig = { ...this.props.appliancechart, dataSource: config };
    ReactDOM.unmountComponentAtNode(document.getElementById('app-chart-container'));
    ReactDOM.render(<ReactFC {...chartconfig} />, document.getElementById('app-chart-container'));
  }

  render() {
    const { selectedButton, stats } = this.state;
    let displayValue = "0 kWh";
    let displayTitle = "Consommation";

    if (stats) {
      if (selectedButton === 'a1') {
        displayValue = `${stats.consumedSoFar ? stats.consumedSoFar.toFixed(2) : '0.00'} kWh`;
        if (this.props.activePeriod === "today") {
          displayTitle = "Consommation aujourd'hui";
        } else if (this.props.activePeriod === "month") {
          displayTitle = "Consommation ce mois-ci";
        } else {
          displayTitle = "Consommation cette année";
        }
      } else {
        displayValue = `${stats.lastPeriod ? stats.lastPeriod.toFixed(2) : '0.00'} kWh`;
        if (this.props.activePeriod === "today") {
          displayTitle = "Consommation hier";
        } else if (this.props.activePeriod === "month") {
          displayTitle = "Consommation mois précédent";
        } else {
          displayTitle = "Consommation année dernière";
        }
      }
    }

    return (
      <div>
        <div className="container-fluid">
          <div className="row pl-5 pr-5 pt-5 pb-0 mb-4 time-control">
            <div className="col-xs-6 mr-4 ml-4 pl-1 pr-1" id="a1" onClick={this.onClickbutton1}>
              {this.props.activePeriod === "today" ? "AUJOURD'HUI" : 
               this.props.activePeriod === "month" ? "CE MOIS-CI" : "CETTE ANNÉE"}
            </div>
            <div className="col-xs-6 mr-4 ml-4 pl-1 pr-1" id="a2" onClick={this.onClickbutton2}>
              {this.props.activePeriod === "today" ? "HIER" : 
               this.props.activePeriod === "month" ? "MOIS PRÉCÉDENT" : "L'ANNÉE DERNIÈRE"}
            </div>
          </div>
          <div className="row pl-5 pr-5 pt-0 pb-0">
            <div className="col-xl-4 offset-xl-4 col-lg-6 mb-3 text-center">
              <label className="label-info" style={{ fontSize: '14px', marginBottom: '5px', opacity: 0.8 }}>Consommation par: &nbsp;</label>
              <select 
                id="appliance-select" 
                onChange={this.onUsageChange} 
                value={this.state.selectedUsage}
              >
                <option value="heating and ac">Chauffage & Climatisation</option>
                <option value="lighting">Éclairage</option>
                <option value="plug loads">Appareils branchés</option>
                <option value="refrigeration">Réfrigération</option>
                <option value="other">Autres</option>
              </select>
            </div>
            <div className="col-xl-4 col-lg-6">
              <div id="usage-power-info" className="card-block">
                <div>
                  <p className="t-head" style={{ fontSize: '14px', marginBottom: '5px', opacity: 0.8 }}>
                    {displayTitle}
                  </p>
                  <p id="stats" className="t-head" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {displayValue}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <div id="app-chart-container" className="pt-3 pb-3 pr-5 pl-5" />
      </div>
    );
  }
}

export default AppliancesComponent;