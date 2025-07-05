import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import moment from 'moment';
import FusionCharts from 'fusioncharts';
// Load the charts module
import charts from 'fusioncharts/fusioncharts.charts';
import widgets from 'fusioncharts/fusioncharts.widgets';
import powercharts from 'fusioncharts/fusioncharts.powercharts';
import theme from 'fusioncharts/themes/fusioncharts.theme.ocean';
import ReactFC from 'react-fusioncharts';

import chartConfigs1, { createDonutChartConfig} from '../chart-configs/dashboard_first_chart';
import chartConfigs2, { createComparisonChartConfig} from '../chart-configs/dashboard_second_chart';
import chartConfigs3, { createTimeSeriesChartConfig} from '../chart-configs/dashboard_third_chart';
import chartConfigs4, { createApplianceChartConfig} from '../chart-configs/dashboard_fourth_chart';
import chartConfigs5, { createAngularGaugeConfig } from '../chart-configs/dashboard_fifth_chart';
import chartConfigs6 from '../chart-configs/dashboard_sixth_chart';
import chartConfigs7 from '../chart-configs/dashboard_seventh_chart';

import emissionchart, { carbonfootprint_month_data, carbonfootprint_today_data, carbonfootprint_year_data, green_energy_stats_today_data, green_energy_stats_month_data, green_energy_stats_year_data } from '../emissions/emission_data';
import usagechart from '../usage/usage_data1';
import costchart from '../cost/cost_data1';
import UsageComponent from '../components/usage_component';
import EmissionComponent from '../components/emission_component';
import CostComponent from '../components/cost_component';
import AppliancesComponent from '../components/appliances_component';
import appliancechart from '../appliances/appliances_data';

import * as utils from '../utils/utils';
import { pdArr, cdArr, pmArr, cmArr, pyArr, cyArr, pdgeArr, cdgeArr, cmgeArr, pygeArr, cygeArr, pmgeArr } from '../emissions/emission_data';


charts(FusionCharts)
widgets(FusionCharts)
powercharts(FusionCharts)
theme(FusionCharts)

FusionCharts.options.creditLabel = false;



class ChartDetail extends Component {

    componentDidMount() {

        //document.getElementById("month").click();
        
      
    }

    async componentDidUpdate() {
        var t = document.getElementById("today");
        var m = document.getElementById("month");
        var y = document.getElementById("year");


        if (this.props.user.id === 1) {

           document.getElementById("today").style.display = "list-item";
           document.getElementById("month").style.marginLeft = "35px";
           document.getElementById("date").innerHTML = moment().format('MMMM YYYY');

            ReactDOM.unmountComponentAtNode(document.getElementById('chart1'));

            document.getElementById("parent1").setAttribute("class", "col-lg-6 col-xl-4");
            document.getElementById("text1").innerHTML = "Consommation par pièces"

            document.getElementById("Dashboard").setAttribute("class", "left-option active");
            document.getElementById("Cost").setAttribute("class", "left-option");
            document.getElementById("Appliances").setAttribute("class", "left-option");
            document.getElementById("Usage-by-rooms").setAttribute("class", "left-option");
            document.getElementById("Emissions").setAttribute("class", "left-option");

            document.getElementById("bd-docs-nav").setAttribute("class", "bd-links collapse");

            ReactDOM.unmountComponentAtNode(document.getElementById('chart2'));
            document.getElementById("parent2").style.display = "block";
            document.getElementById("parent2").style.width = "auto";
            document.getElementById("parent2").style.height = "auto";

            ReactDOM.unmountComponentAtNode(document.getElementById('chart3'));
            document.getElementById("parent3").style.display = "block";
            document.getElementById("parent3").style.width = "auto";
            document.getElementById("parent3").style.height = "auto";

            ReactDOM.unmountComponentAtNode(document.getElementById('chart4'));
            document.getElementById("parent4").style.display = "block";
            document.getElementById("parent4").style.width = "auto";
            document.getElementById("parent4").style.height = "auto";

            ReactDOM.unmountComponentAtNode(document.getElementById('chart5'));
            document.getElementById("parent5").style.display = "block";
            document.getElementById("parent5").style.width = "auto";
            document.getElementById("parent5").style.height = "auto";

            ReactDOM.unmountComponentAtNode(document.getElementById('chart6'));
            document.getElementById("parent6").style.display = "block";
            document.getElementById("parent6").style.width = "auto";
            document.getElementById("parent6").style.height = "auto";


 
            chartConfigs1.dataSource= await createDonutChartConfig(this.props.activePeriod)
            chartConfigs2.dataSource= await createComparisonChartConfig(this.props.activePeriod)
            chartConfigs3.dataSource= await createTimeSeriesChartConfig(this.props.activePeriod)
            chartConfigs4.dataSource= await createApplianceChartConfig(this.props.activePeriod);
            chartConfigs5.dataSource= await createAngularGaugeConfig(this.props.activePeriod);

            ReactDOM.render(
                <ReactFC {...chartConfigs1} />,
                document.getElementById('chart1'));
            
            ReactDOM.render(
                <ReactFC {...chartConfigs2} />,
                document.getElementById('chart2'));

            ReactDOM.render(
                <ReactFC {...chartConfigs3} />,
                document.getElementById('chart3'));

            ReactDOM.render(
                <ReactFC {...chartConfigs4} />,
                document.getElementById('chart4'));

            ReactDOM.render(
                <ReactFC {...chartConfigs5} />,
                document.getElementById('chart5'));
            ReactDOM.render(
                <ReactFC {...chartConfigs6} />,
                document.getElementById('chart6'));
            
            ReactDOM.render(
                <ReactFC {...chartConfigs7} />,
                document.getElementById('chart7'));

            // logic for today button when the user is on dashboard

            // var t = document.getElementById("today");

            t.onclick = async function () {
                //console.log("response.data", response.data);
                document.getElementById("date").innerHTML = moment().format('MMMM, Do YYYY');

            };


            //logic for month button when the user is on dashboard 
            // var m = document.getElementById("month");

            m.onclick = async function () {
                document.getElementById("date").innerHTML = moment().format('MMMM YYYY');

            };

           
            //logic for year button when the user is on dashboard



            y.onclick = async function () {
                document.getElementById("date").innerHTML = moment().format('YYYY');

            };


        }

        else if (this.props.user.id === 2) {

            utils.disposeChart(FusionCharts, "mychart8")
            document.getElementById("today").style.display = "none";
            document.getElementById("month").style.marginLeft = "0px";
            if (this.props.activePeriod==="today") document.getElementById("month").click();
            ReactDOM.unmountComponentAtNode(document.getElementById('chart1'));

            document.getElementById("Dashboard").setAttribute("class", "left-option");
            document.getElementById("Cost").setAttribute("class", "left-option active");
            document.getElementById("Appliances").setAttribute("class", "left-option");
            document.getElementById("Usage-by-rooms").setAttribute("class", "left-option");
            document.getElementById("Emissions").setAttribute("class", "left-option");

            document.getElementById("bd-docs-nav").setAttribute("class", "bd-links collapse");



            document.getElementById("parent1").setAttribute("class", "chart1-co col-lg-12 col-xl-12");
            document.getElementById("text1").innerHTML = "Consommation";

            ReactDOM.unmountComponentAtNode(document.getElementById('chart2'));

            document.getElementById("parent2").style.display = "none";
            document.getElementById("parent2").style.width = "0px";
            document.getElementById("parent2").style.height = "0px";

            ReactDOM.unmountComponentAtNode(document.getElementById('chart3'));
            document.getElementById("parent3").style.display = "none";
            document.getElementById("parent3").style.width = "0px";
            document.getElementById("parent3").style.height = "0px";

            ReactDOM.unmountComponentAtNode(document.getElementById('chart4'));
            document.getElementById("parent4").style.display = "none";
            document.getElementById("parent4").style.width = "0px";
            document.getElementById("parent4").style.height = "0px";

            ReactDOM.unmountComponentAtNode(document.getElementById('chart5'));
            document.getElementById("parent5").style.display = "none";
            document.getElementById("parent5").style.width = "0px";
            document.getElementById("parent5").style.height = "0px";

            ReactDOM.unmountComponentAtNode(document.getElementById('chart6'));
            document.getElementById("parent6").style.display = "none";
            document.getElementById("parent6").style.width = "0px";
            document.getElementById("parent6").style.height = "0px";

            ReactDOM.unmountComponentAtNode(document.getElementById('chart7'));
            document.getElementById("parent6").style.display = "none";
            document.getElementById("parent6").style.width = "0px";
            document.getElementById("parent6").style.height = "0px";


            ReactDOM.render(
                <CostComponent costchart={costchart} activePeriod={this.props.activePeriod} />,
                document.getElementById('chart1'));

            // Bouton "AUJOURD'HUI"
            t.onclick = async function () {
              window.selectedperiod = "today";
              document.getElementById("date").innerHTML = moment().format('MMMM, Do YYYY');
              document.getElementById("c1").innerHTML = "AUJOURD'HUI";
              document.getElementById("c2").innerHTML = "HIER";
            };

            // Bouton "CE MOIS-CI"
            m.onclick = async function () {
              window.selectedperiod = "month";
              document.getElementById("date").innerHTML = moment().format('MMMM YYYY');
              document.getElementById("c1").innerHTML = "CE MOIS-CI";
              document.getElementById("c2").innerHTML = "MOIS PRÉCÉDENT";
            };

            // Bouton "CETTE ANNÉE"
            y.onclick = async function () {
              window.selectedperiod = "year";
              document.getElementById("date").innerHTML = moment().format('YYYY');
              document.getElementById("c1").innerHTML = "CETTE ANNÉE";
              document.getElementById("c2").innerHTML = "L'ANNÉE DERNIÈRE";
;
            };          


        }

        else if (this.props.user.id === 3) {
            utils.disposeChart(FusionCharts, "mychart12")
            document.getElementById("today").style.display = "list-item";
            document.getElementById("month").style.marginLeft = "35px";
            ReactDOM.unmountComponentAtNode(document.getElementById('chart1'));

            document.getElementById("parent1").setAttribute("class", "chart1-app col-lg-12 col-xl-12");
            document.getElementById("text1").innerHTML = "APPLIANCES";

            document.getElementById("Dashboard").setAttribute("class", "left-option");
            document.getElementById("Cost").setAttribute("class", "left-option");
            document.getElementById("Appliances").setAttribute("class", "left-option active");
            document.getElementById("Usage-by-rooms").setAttribute("class", "left-option");
            document.getElementById("Emissions").setAttribute("class", "left-option");

            document.getElementById("bd-docs-nav").setAttribute("class", "bd-links collapse");


            ReactDOM.unmountComponentAtNode(document.getElementById('chart2'));
            document.getElementById("parent2").style.display = "none";
            document.getElementById("parent2").style.width = "0px";
            document.getElementById("parent2").style.height = "0px";

            ReactDOM.unmountComponentAtNode(document.getElementById('chart3'));
            document.getElementById("parent3").style.display = "none";
            document.getElementById("parent3").style.width = "0px";
            document.getElementById("parent3").style.height = "0px";

            ReactDOM.unmountComponentAtNode(document.getElementById('chart4'));
            document.getElementById("parent4").style.display = "none";
            document.getElementById("parent4").style.width = "0px";
            document.getElementById("parent4").style.height = "0px";

            ReactDOM.unmountComponentAtNode(document.getElementById('chart5'));
            document.getElementById("parent5").style.display = "none";
            document.getElementById("parent5").style.width = "0px";
            document.getElementById("parent5").style.height = "0px";

            ReactDOM.unmountComponentAtNode(document.getElementById('chart6'));
            document.getElementById("parent6").style.display = "none";
            document.getElementById("parent6").style.width = "0px";
            document.getElementById("parent6").style.height = "0px";

            ReactDOM.unmountComponentAtNode(document.getElementById('chart7'));
            document.getElementById("parent6").style.display = "none";
            document.getElementById("parent6").style.width = "0px";
            document.getElementById("parent6").style.height = "0px";

            // to be written

            ReactDOM.render(
                <AppliancesComponent appliancechart={appliancechart} activePeriod={this.props.activePeriod} />,
                document.getElementById('chart1'));

            t.onclick = function () {
                window.selectedperiod = "today";
                document.getElementById("date").innerHTML = moment().format('MMMM, Do YYYY');
            }

            m.onclick = function () {

                window.selectedperiod = "month";
                document.getElementById("date").innerHTML = moment().format('MMMM YYYY');
            }

        

            y.onclick = function () {
                window.selectedperiod = "year";
                document.getElementById("date").innerHTML = moment().format('YYYY');
            }

        }


        else if (this.props.user.id === 4) {

            document.getElementById("today").style.display = "list-item";  
            document.getElementById("month").style.marginLeft = "35px";
            utils.disposeChart(FusionCharts, "mychart9")
            ReactDOM.unmountComponentAtNode(document.getElementById('chart1'));
            //document.getElementById("date").style.display = "none";
            document.getElementById("parent1").setAttribute("class", "chart1-us col-lg-12 col-xl-12");
            document.getElementById("text1").innerHTML = "Consommation énergétique par pièces";

            document.getElementById("Dashboard").setAttribute("class", "left-option");
            document.getElementById("Cost").setAttribute("class", "left-option");
            document.getElementById("Appliances").setAttribute("class", "left-option");
            document.getElementById("Usage-by-rooms").setAttribute("class", "left-option active");
            document.getElementById("Emissions").setAttribute("class", "left-option");

            document.getElementById("bd-docs-nav").setAttribute("class", "bd-links collapse");


            ReactDOM.unmountComponentAtNode(document.getElementById('chart2'));
            document.getElementById("parent2").style.display = "none";
            document.getElementById("parent2").style.width = "0px";
            document.getElementById("parent2").style.height = "0px";

            ReactDOM.unmountComponentAtNode(document.getElementById('chart3'));
            document.getElementById("parent3").style.display = "none";
            document.getElementById("parent3").style.width = "0px";
            document.getElementById("parent3").style.height = "0px";

            ReactDOM.unmountComponentAtNode(document.getElementById('chart4'));
            document.getElementById("parent4").style.display = "none";
            document.getElementById("parent4").style.width = "0px";
            document.getElementById("parent4").style.height = "0px";

            ReactDOM.unmountComponentAtNode(document.getElementById('chart5'));
            document.getElementById("parent5").style.display = "none";
            document.getElementById("parent5").style.width = "0px";
            document.getElementById("parent5").style.height = "0px";

            ReactDOM.unmountComponentAtNode(document.getElementById('chart6'));
            document.getElementById("parent6").style.display = "none";
            document.getElementById("parent6").style.width = "0px";
            document.getElementById("parent6").style.height = "0px";

            ReactDOM.unmountComponentAtNode(document.getElementById('chart7'));
            document.getElementById("parent6").style.display = "none";
            document.getElementById("parent6").style.width = "0px";
            document.getElementById("parent6").style.height = "0px";

            ReactDOM.render(
              <UsageComponent
                usagechart={usagechart}
                activePeriod={this.props.activePeriod}
              />,
              document.getElementById('chart1')
            );

            // Bouton "AUJOURD'HUI"
            t.onclick = async function () {
              window.selectedperiod = "today";
              document.getElementById("date").innerHTML = moment().format('MMMM, Do YYYY');
              document.getElementById("u1").innerHTML = "AUJOURD'HUI";
              document.getElementById("u2").innerHTML = "HIER";
            };

            // Bouton "CE MOIS-CI"
            m.onclick = async function () {
              window.selectedperiod = "month";
              document.getElementById("date").innerHTML = moment().format('MMMM YYYY');
              document.getElementById("u1").innerHTML = "CE MOIS-CI";
              document.getElementById("u2").innerHTML = "MOIS PRÉCÉDENT";
            };

            // Bouton "CETTE ANNÉE"
            y.onclick = async function () {
              window.selectedperiod = "year";
              document.getElementById("date").innerHTML = moment().format('YYYY');
              document.getElementById("u1").innerHTML = "CETTE ANNÉE";
              document.getElementById("u2").innerHTML = "L'ANNÉE DERNIÈRE";
            };

            }

        // Emission Option Logic.

        else if (this.props.user.id === 5) {
            document.getElementById("today").style.display = "list-item";
            document.getElementById("month").style.marginLeft = "35px";
            utils.disposeChart(FusionCharts, "mychart7")
            ReactDOM.unmountComponentAtNode(document.getElementById('chart1'));
            // document.getElementById("date").style.display = "none";
            document.getElementById("parent1").setAttribute("class", "chart1-em col-lg-12 col-xl-12");
            document.getElementById("text1").innerHTML = "EMISSIONS";

            var cper;
            document.getElementById("Dashboard").setAttribute("class", "left-option");
            document.getElementById("Cost").setAttribute("class", "left-option");
            document.getElementById("Appliances").setAttribute("class", "left-option");
            document.getElementById("Usage-by-rooms").setAttribute("class", "left-option");
            document.getElementById("Emissions").setAttribute("class", "left-option active");

            document.getElementById("bd-docs-nav").setAttribute("class", "bd-links collapse");


            ReactDOM.unmountComponentAtNode(document.getElementById('chart2'));
            document.getElementById("parent2").style.display = "none";
            document.getElementById("parent2").style.width = "0px";
            document.getElementById("parent2").style.height = "0px";

            ReactDOM.unmountComponentAtNode(document.getElementById('chart3'));
            document.getElementById("parent3").style.display = "none";
            document.getElementById("parent3").style.width = "0px";
            document.getElementById("parent3").style.height = "0px";

            ReactDOM.unmountComponentAtNode(document.getElementById('chart4'));
            document.getElementById("parent4").style.display = "none";
            document.getElementById("parent4").style.width = "0px";
            document.getElementById("parent4").style.height = "0px";

            ReactDOM.unmountComponentAtNode(document.getElementById('chart5'));
            document.getElementById("parent5").style.display = "none";
            document.getElementById("parent5").style.width = "0px";
            document.getElementById("parent5").style.height = "0px";

            ReactDOM.unmountComponentAtNode(document.getElementById('chart6'));
            document.getElementById("parent6").style.display = "none";
            document.getElementById("parent6").style.width = "0px";
            document.getElementById("parent6").style.height = "0px";


            //utils.disposeChart('mychart7');
            ReactDOM.render(

                <EmissionComponent emissionchart={emissionchart} />,
                document.getElementById('chart1'));

            // logic for today button       
            // var t1 = document.getElementById("today");


            t.onclick = function () {
                window.selectedperiod = "today";
                document.getElementById("date").innerHTML = moment().format('MMMM, Do YYYY');
                if (window.b2selected) {
                    var cpCalc = 0;
                    for (var i = 0; i < pdgeArr.length; i++) {
                        cpCalc = cpCalc + pdgeArr[i];
                    }

                    // so far today kpi
                    // eslint-disable-next-line
                    var cHour = parseInt(moment().format('H'));
                    var sftCalc = 0;
                    // eslint-disable-next-line
                    for (var i = 0; i < cHour; i++) {
                        sftCalc = sftCalc + cdgeArr[i];
                    }

                    // predicted today kpi

                    var ptcpCalc = 0;
                    // eslint-disable-next-line
                    for (var i = 0; i < cdgeArr.length; i++) {
                        ptcpCalc = ptcpCalc + cdgeArr[i];
                    }

                    // emisson change kpi

                    if (ptcpCalc > cpCalc) {
                        var cper = Math.round(([(ptcpCalc / cpCalc) * 100] - 100) * 100) / 100;
                        document.getElementById("em-tablecell-value4").innerHTML = cper + "% <span style='color: #B4F9A1;'>▲</span>";
                    } else if (ptcpCalc < cpCalc) {
                        cper = Math.round((100 - [(ptcpCalc / cpCalc) * 100]) * 100) / 100;
                        document.getElementById("em-tablecell-value4").innerHTML = cper + "% <span style='color: #EF5052;'>▼</span>";
                    }

                    var emtoday2 = green_energy_stats_today_data;
                    FusionCharts.items['mychart7'].setJSONData(emtoday2);


                    document.getElementById("em-tablecell-title1").innerHTML = moment().subtract(1, 'day').format('MMMM D');
                    document.getElementById("em-tablecell-value1").innerHTML = Math.round(cpCalc * 100) / 100 + "   kWh";

                    document.getElementById("em-tablecell-title2").innerHTML = "So Far Today";
                    document.getElementById("em-tablecell-value2").innerHTML = Math.round(sftCalc * 100) / 100 + "   kWh";

                    document.getElementById("em-tablecell-title3").innerHTML = "Predicted Today";
                    document.getElementById("em-tablecell-value3").innerHTML = Math.round(ptcpCalc * 100) / 100 + "   kWh";

                    document.getElementById("em-tablecell-title4").innerHTML = "Change in Emissions";
                }
                else {
                    var emtoday = carbonfootprint_today_data;
                    FusionCharts.items['mychart7'].setJSONData(emtoday);


                    cpCalc = 0;
                    // eslint-disable-next-line
                    for (var i = 0; i < pdArr.length; i++) {
                        cpCalc = cpCalc + pdArr[i];
                    }

                    // so far today kpi
                    // eslint-disable-next-line
                    var cHour = parseInt(moment().format('H'));
                    sftCalc = 0;
                    // eslint-disable-next-line
                    for (var i = 0; i < cHour; i++) {
                        sftCalc = sftCalc + pdArr[i];
                    }

                    ptcpCalc = 0;
                    // eslint-disable-next-line
                    for (var i = 0; i < cdArr.length; i++) {
                        ptcpCalc = ptcpCalc + cdArr[i];
                    }


                    // emisson change kpi

                    if (ptcpCalc > cpCalc) {
                        cper = Math.round(([(ptcpCalc / cpCalc) * 100] - 100) * 100) / 100;
                        document.getElementById("em-tablecell-value4").innerHTML = cper + "% <span style='color: #EF5052;'>▲</span>";
                    } else if (ptcpCalc < cpCalc) {
                        cper = Math.round((100 - [(ptcpCalc / cpCalc) * 100]) * 100) / 100;
                        document.getElementById("em-tablecell-value4").innerHTML = cper + "% <span style='color: #B4F9A1;'>▼</span>";
                    }


                    document.getElementById("em-tablecell-title1").innerHTML = moment().subtract(1, 'day').format('MMMM D');
                    document.getElementById("em-tablecell-value1").innerHTML = Math.round(cpCalc * 100) / 100 + "  kg";

                    document.getElementById("em-tablecell-title2").innerHTML = "So Far Today";
                    document.getElementById("em-tablecell-value2").innerHTML = Math.round(sftCalc * 100) / 100 + "  kg";

                    document.getElementById("em-tablecell-title3").innerHTML = "Predicted Today";
                    document.getElementById("em-tablecell-value3").innerHTML = Math.round(ptcpCalc * 100) / 100 + "  kg";

                    document.getElementById("em-tablecell-title4").innerHTML = "Change in Emissions";


                }
            };

            // logic for month

            // var m1 = document.getElementById("month");

            m.onclick = function () {

                window.selectedperiod = "month";
                document.getElementById("date").innerHTML = moment().format('MMMM YYYY');

                if (window.b2selected) {

                    var cpCalc = 0;
                    // eslint-disable-next-line
                    for (var i = 0; i < moment().subtract(1, 'month').daysInMonth(); i++) {
                        cpCalc = cpCalc + pmgeArr[i];
                    }

                    // so far this month kpi
                    // eslint-disable-next-line
                    var cDate = parseInt(moment().format('D'));
                    var sfmCalc = 0;
                    // eslint-disable-next-line
                    for (var i = 0; i < cDate; i++) {
                        sfmCalc = sfmCalc + cmgeArr[i];
                    }


                    // predicted this month kpi

                    var pmcpCalc = 0;
                    // eslint-disable-next-line
                    for (var i = 0; i < moment().daysInMonth(); i++) {
                        pmcpCalc = pmcpCalc + cmgeArr[i];
                    }


                    // emisson change kpi

                    if (pmcpCalc > cpCalc) {
                        var cper = Math.round(([(pmcpCalc / cpCalc) * 100] - 100) * 100) / 100;
                        document.getElementById("em-tablecell-value4").innerHTML = cper + "% <span style='color: #B4F9A1;'>▲</span>";
                    } else if (pmcpCalc < cpCalc) {
                        cper = Math.round((100 - [(pmcpCalc / cpCalc) * 100]) * 100) / 100;
                        document.getElementById("em-tablecell-value4").innerHTML = cper + "% <span style='color: #EF5052;'>▼</span>";
                    }

                    var emmonth2 = green_energy_stats_month_data;
                    FusionCharts.items['mychart7'].setJSONData(emmonth2);

                    document.getElementById("em-tablecell-title1").innerHTML = moment().subtract(1, 'month').format('MMMM');
                    document.getElementById("em-tablecell-value1").innerHTML = Math.round(cpCalc * 100) / 100 + "   kWh";

                    document.getElementById("em-tablecell-title2").innerHTML = "So Far This Month";
                    document.getElementById("em-tablecell-value2").innerHTML = Math.round(sfmCalc * 100) / 100 + "   kWh"

                    document.getElementById("em-tablecell-title3").innerHTML = "Predicted This Month";
                    document.getElementById("em-tablecell-value3").innerHTML = Math.round(pmcpCalc * 100) / 100 + "  kWh"

                    document.getElementById("em-tablecell-title4").innerHTML = "Change in Emissions";

                }
                else {
                    var emmonth = carbonfootprint_month_data;

                    // last month's kpi

                    cpCalc = 0;
                    // eslint-disable-next-line
                    for (var i = 0; i < moment().subtract(1, 'month').daysInMonth(); i++) {
                        cpCalc = cpCalc + pmArr[i];
                    }

                    // so far this month kpi
                    // eslint-disable-next-line
                    var cDate = parseInt(moment().format('D'));
                    sfmCalc = 0;
                    // eslint-disable-next-line
                    for (var i = 0; i < cDate; i++) {
                        sfmCalc = sfmCalc + cmArr[i];
                    }


                    // predicted this month kpi

                    pmcpCalc = 0;
                    // eslint-disable-next-line
                    for (var i = 0; i < moment().daysInMonth(); i++) {
                        pmcpCalc = pmcpCalc + cmArr[i];
                    }


                    // emisson change kpi

                    if (pmcpCalc > cpCalc) {
                        cper = Math.round(([(pmcpCalc / cpCalc) * 100] - 100) * 100) / 100;
                        document.getElementById("em-tablecell-value4").innerHTML = cper + "% <span style='color: #EF5052;'>▲</span>"
                    } else if (pmcpCalc < cpCalc) {
                        cper = Math.round((100 - [(pmcpCalc / cpCalc) * 100]) * 100) / 100;
                        document.getElementById("em-tablecell-value4").innerHTML = cper + "% <span style='color: #B4F9A1;'>▼</span>"
                    }



                    FusionCharts.items['mychart7'].setJSONData(emmonth);



                    document.getElementById("em-tablecell-title1").innerHTML = moment().subtract(1, 'month').format('MMMM');
                    document.getElementById("em-tablecell-value1").innerHTML = Math.round(cpCalc * 100) / 100 + "  kg";

                    document.getElementById("em-tablecell-title2").innerHTML = "So Far This Month";
                    document.getElementById("em-tablecell-value2").innerHTML = Math.round(sfmCalc * 100) / 100 + "  kg"

                    document.getElementById("em-tablecell-title3").innerHTML = "Predicted This Month";
                    document.getElementById("em-tablecell-value3").innerHTML = Math.round(pmcpCalc * 100) / 100 + "  kg"

                    document.getElementById("em-tablecell-title4").innerHTML = "Change in Emissions";

                }
            };

        


            //logic for year

            // var y1 = document.getElementById("year");

            y.onclick = function () {
                window.selectedperiod = "year";
                document.getElementById("date").innerHTML = moment().format('YYYY');
                if (window.b2selected) {

                    var cpCalc = 0;
                    for (var i = 0; i < pygeArr.length; i++) {
                        cpCalc = cpCalc + pygeArr[i];
                    }


                    // so far this year kpi
                    // eslint-disable-next-line
                    var cMonth = parseInt(moment().format('M'));
                    var sfyCalc = 0;
                    // eslint-disable-next-line
                    for (var i = 0; i < cMonth; i++) {
                        sfyCalc = sfyCalc + cygeArr[i];
                    }


                    // predicted this year kpi

                    var pycpCalc = 0;
                    // eslint-disable-next-line
                    for (var i = 0; i < 12; i++) {
                        pycpCalc = pycpCalc + cygeArr[i];
                    }


                    // emisson change kpi

                    if (pycpCalc > cpCalc) {
                        cper = Math.round(([(pycpCalc / cpCalc) * 100] - 100) * 100) / 100;
                        document.getElementById("em-tablecell-value4").innerHTML = cper + "% <span style='color: #B4F9A1;'>▲</span>";
                    } else if (pycpCalc < cpCalc) {
                        cper = Math.round((100 - [(pycpCalc / cpCalc) * 100]) * 100) / 100;
                        document.getElementById("em-tablecell-value4").innerHTML = cper + "% <span style='color: #EF5052;'>▼</span>";
                    }

                    var emyear2 = green_energy_stats_year_data;
                    FusionCharts.items['mychart7'].setJSONData(emyear2);

                    document.getElementById("em-tablecell-title1").innerHTML = moment().subtract(1, 'year').format('YYYY');
                    document.getElementById("em-tablecell-value1").innerHTML = Math.round(cpCalc * 100) / 100 + "  kWh";

                    document.getElementById("em-tablecell-title2").innerHTML = "So Far This Year";
                    document.getElementById("em-tablecell-value2").innerHTML = Math.round(sfyCalc * 100) / 100 + "  kWh";

                    document.getElementById("em-tablecell-title3").innerHTML = "Predicted This Year";
                    document.getElementById("em-tablecell-value3").innerHTML = Math.round(pycpCalc * 100) / 100 + "  kWh";

                    document.getElementById("em-tablecell-title4").innerHTML = "Change in Emissions";
                }
                else {
                    var emyear = carbonfootprint_year_data;

                    // last year's kpi

                    cpCalc = 0;
                    // eslint-disable-next-line
                    for (var i = 0; i < pyArr.length; i++) {
                        cpCalc = cpCalc + pyArr[i];
                    }


                    // so far this year kpi
                    // eslint-disable-next-line
                    cMonth = parseInt(moment().format('M'));
                    sfyCalc = 0;
                    // eslint-disable-next-line
                    for (var i = 0; i < cMonth; i++) {
                        sfyCalc = sfyCalc + cyArr[i];
                    }


                    // predicted this year kpi

                    pycpCalc = 0;
                    // eslint-disable-next-line
                    for (var i = 0; i < 12; i++) {
                        pycpCalc = pycpCalc + cyArr[i];
                    }


                    // emisson change kpi

                    if (pycpCalc > cpCalc) {
                        cper = Math.round(([(pycpCalc / cpCalc) * 100] - 100) * 100) / 100;
                        document.getElementById("em-tablecell-value4").innerHTML = cper + "% <span style='color: #EF5052;'>▲</span>"
                    } else if (pycpCalc < cpCalc) {
                        cper = Math.round((100 - [(pycpCalc / cpCalc) * 100]) * 100) / 100;
                        document.getElementById("em-tablecell-value4").innerHTML = cper + "% <span style='color: #B4F9A1;'>▼</span>"
                    }


                    FusionCharts.items['mychart7'].setJSONData(emyear);

                    document.getElementById("em-tablecell-title1").innerHTML = moment().subtract(1, 'year').format('YYYY');
                    document.getElementById("em-tablecell-value1").innerHTML = Math.round(cpCalc * 100) / 100 + "  kg";

                    document.getElementById("em-tablecell-title2").innerHTML = "So Far This Year";
                    document.getElementById("em-tablecell-value2").innerHTML = Math.round(sfyCalc * 100) / 100 + "  kg";

                    document.getElementById("em-tablecell-title3").innerHTML = "Predicted This Year";
                    document.getElementById("em-tablecell-value3").innerHTML = Math.round(pycpCalc * 100) / 100 + "  kg";

                    document.getElementById("em-tablecell-title4").innerHTML = "Change in Emissions";
                }
            };



        }

        else {
            var defaultElement = (
                <div>

                    <h2>{this.props.user.name}</h2>

                </div>
            );
            ReactDOM.unmountComponentAtNode(document.getElementById('chart1'));
            ReactDOM.unmountComponentAtNode(document.getElementById('chart2'));

            // utils.disposeChart('mychart7');

            ReactDOM.render(
                defaultElement,
                document.getElementById('chart1'));
        }
    }


    render() {
        return (
            <div></div>
        );

    }
}

// "state.activeUser" is set in reducers/index.js
function mapStateToProps(state) {
    return {
        user: state.activeUser
    };
}

export default connect(mapStateToProps)(ChartDetail);
