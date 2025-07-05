// IMPORTS : React, FusionCharts, ReactDOM et fonctions utilitaires pour les données
import React from 'react';
import ReactFC from 'react-fusioncharts';
import ReactDOM from 'react-dom';
import {
  fetchRoomUsageDataToday, getUsageTodayConfig,
  fetchRoomUsageDataYesterday, getUsageYesterdayConfig,
  fetchRoomUsageDataThisMonth, getUsageThisMonthConfig,
  fetchRoomUsageDataLastMonth, getUsageLastMonthConfig,
  fetchRoomUsageDataThisYear, getUsageThisYearConfig,
  fetchRoomUsageDataLastYear, getUsageLastYearConfig
} from '../utils/usageHelpers';

class UsageComponent extends React.Component {

  // --- État local du composant : bouton sélectionné, données et pièces
  state = {
    selectedButton: 'u1',
    cDataArr: [],
    rooms: []
  };

  constructor(props) {
    super(props);

    // Liaison des méthodes pour gestion des clics
    this.onClickbutton1 = this.onClickbutton1.bind(this);
    this.onClickbutton2 = this.onClickbutton2.bind(this);
  }

  // --- Fonction exécutée après le montage du composant
  async componentDidMount() {
    // Déclenche le clic sur le bouton initial sélectionné
    document.getElementById(this.state.selectedButton).click();

    // Met à jour les libellés des boutons en fonction de la période sélectionnée
    if (this.props.activePeriod === "today") {
      document.getElementById("u1").innerHTML = "AUJOURD'HUI";
      document.getElementById("u2").innerHTML = "HIER";
    } else if (this.props.activePeriod === "month") {
      document.getElementById("u1").innerHTML = "CE MOIS-CI";
      document.getElementById("u2").innerHTML = "MOIS PRÉCÉDENT";
    } else if (this.props.activePeriod === "year") {
      document.getElementById("u1").innerHTML = "CETTE ANNÉE";
      document.getElementById("u2").innerHTML = "L'ANNÉE DERNIÈRE";
    }
  }

  // --- Gère le clic sur le bouton 1 (période actuelle)
  async onClickbutton1() {
    window.b2selected = false;
    this.setState({ selectedButton: 'u1' });

    // Mises à jour des styles visuels des boutons
    this.updateButtonStyles("u1", "u2");

    try {
      let data;

      // Récupère les données selon la période
      if (this.props.activePeriod === "today") {
        data = await fetchRoomUsageDataToday();
      } else if (this.props.activePeriod === "month") {
        data = await fetchRoomUsageDataThisMonth();
      } else if (this.props.activePeriod === "year") {
        data = await fetchRoomUsageDataThisYear();
      }

      // Met à jour l’état puis affiche le graphique
      this.setState({ cDataArr: data.cDataArr, rooms: data.rooms }, () => {
        let config;
        if (this.props.activePeriod === "today") {
          config = getUsageTodayConfig(this.state.cDataArr, this.state.rooms);
        } else if (this.props.activePeriod === "month") {
          config = getUsageThisMonthConfig(this.state.cDataArr, this.state.rooms);
        } else if (this.props.activePeriod === "year") {
          config = getUsageThisYearConfig(this.state.cDataArr, this.state.rooms);
        }

        this.renderChart(config);
      });
    } catch (error) {
      console.error("Erreur chargement données bouton 1:", error);
    }
  }

  // --- Gère le clic sur le bouton 2 (période précédente)
  async onClickbutton2() {
    window.b2selected = true;
    this.setState({ selectedButton: 'u2' });

    // Mises à jour des styles visuels
    this.updateButtonStyles("u2", "u1");

    try {
      let data;

      // Récupère les données selon la période
      if (this.props.activePeriod === "today") {
        data = await fetchRoomUsageDataYesterday();
        console.log("data", data);
        
      } else if (this.props.activePeriod === "month") {
        data = await fetchRoomUsageDataLastMonth();
      } else if (this.props.activePeriod === "year") {
        data = await fetchRoomUsageDataLastYear();
      }

      // Met à jour l’état puis affiche le graphique
      this.setState({ cDataArr: data.cDataArr, rooms: data.rooms }, () => {
        let config;
        if (this.props.activePeriod === "today") {
          config = getUsageYesterdayConfig(this.state.cDataArr, this.state.rooms);
        } else if (this.props.activePeriod === "month") {
          config = getUsageLastMonthConfig(this.state.cDataArr, this.state.rooms);
        } else if (this.props.activePeriod === "year") {
          config = getUsageLastYearConfig(this.state.cDataArr, this.state.rooms);
        }

        this.renderChart(config);
      });
    } catch (error) {
      console.error("Erreur chargement données bouton 2:", error);
    }
  }

  // --- Met à jour le style des boutons (actif / inactif)
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

  // --- Affiche le graphique dans le conteneur cible
  renderChart(config) {
    const chartconfig = { ...this.props.usagechart, dataSource: config };
    ReactDOM.unmountComponentAtNode(document.getElementById('us-chart-container'));
    ReactDOM.render(<ReactFC {...chartconfig} />, document.getElementById('us-chart-container'));
  }

  // --- Rendu visuel du composant
  render() {
    return (
      <div>
        <div className="container-fluid">
          <div className="row pl-5 pr-5 pt-5 pb-0 time-control">
            <div className="col-xs-6 mr-4 ml-4 pl-1 pr-1" id="u1" onClick={this.onClickbutton1}>
              THIS MONTH
            </div>
            <div className="col-xs-6 mr-4 ml-4 pl-1 pr-1" id="u2" onClick={this.onClickbutton2}>
              LAST MONTH
            </div>
          </div>
        </div>
        <br />
        <div className="res-chart--parent pt-1 pb-5 pr-5 pl-5">
          <div className="res-chart">
            <div id="us-chart-container" className="pl-2 pr-2 pb-3 pt-4" />
          </div>
        </div>
      </div>
    );
  }
}

export default UsageComponent;
