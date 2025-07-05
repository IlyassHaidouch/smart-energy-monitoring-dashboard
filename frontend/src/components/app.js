import React from 'react';
import OptionList from '../containers/optionlist';
import ChartDetail from '../containers/chart';
import './app.css';

class App extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      activePeriod: 'today'
    };
   }

    componentDidMount() {

      
        var todayElem = document.getElementById('today');
        var monthElem = document.getElementById('month');
        var yearElem = document.getElementById('year');

        monthElem.addEventListener('click', () => {
            monthElem.classList.add("active");
            yearElem.classList.remove("active");
            todayElem.classList.remove("active");
            this.setState({ activePeriod: 'month' });
        });

        yearElem.addEventListener('click', () => {
            monthElem.classList.remove("active");
            yearElem.classList.add("active");
            todayElem.classList.remove("active");
            this.setState({ activePeriod: 'year' });
        });

        todayElem.addEventListener('click', () => {
            monthElem.classList.remove("active");
            yearElem.classList.remove("active");
            todayElem.classList.add("active");
            this.setState({ activePeriod: 'today' });
        });

        document.getElementById('Dashboard').click();
        document.getElementById('month').click();
    }

    componentDidUpdate() {
        //  console.log("app is updated");
    }

    render() {
        return (

            <div>


                <div className="container-fluid">
                    <div className="row flex-xl-nowrap">
                        {/* <!-- sidebar --> */}
                        <div id="nav" className="col-12 col-md-3 col-xl-2 bd-sidebar">
                            <div className="row">
                                <div className="col-md-12 col-8">
                                    <div className="text-sm-left text-md-center logo">FUSiON SMART<span id="beta"> BETA</span></div>
                                </div>
                                <div className="col-md-12 col-4 text-right">
                                    {/* <!-- for menu when screen width is less--> */}
                                    <button className="btn btn-link bd-search-docs-toggle d-md-none p-0 ml-3 collapsed" type="button" data-toggle="collapse" data-target="#bd-docs-nav"
                                        aria-controls="bd-docs-nav" aria-expanded="false" aria-label="Toggle docs navigation">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30" height="30" focusable="false">
                                            <title>Menu</title>
                                            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeMiterlimit="10" d="M4 7h22M4 15h22M4 23h22"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <nav className="collapse bd-links" id="bd-docs-nav">
                                <OptionList />
                            </nav>

                        </div>

                        {/* <!-- sidebar end --> */}
                        <div id="content-body" className="col-12 col-md-9 col-xl-10 pl-4 pr-4 bd-content">
                            {/* <!-- heading row --> */}
                            <div className="row">
                                <div className="col-md-12 pt-4 mt-3"><h2>Tableau de Bord Énergétique </h2></div>
                            </div>
                            {/* <!-- heading row end-->
        
                    <!-- time frame row start --> */}
                            <div className="row mt-3">
                                <div className="col-md-7"><ul className="buttonwrapper">
                                    <li id="today">
                                        <label id="l1">AUJOURD'HUI</label>
                                    </li>
                                    <li id="month" className="active">
                                        <label id="l2">MOIS</label>
                                    </li>
                                    <li id="year">
                                        <label id="l3">ANNÉE</label>
                                    </li>
                                </ul></div>
                                <div className="col-md-5 text-right date-indicator" id="date">Date</div>
                            </div>
                            {/* <!-- time frame row end -->
                    <!-- chart row start -->  */}
                            <div className="row mt-3 db-chart">
                                <div id="parent1" className="col-lg-6 col-xl-4">
                                    <div className="chart-card mb-4">
                                        <div className="chart-title" id="text1">Consommation</div>
                                        <div id="chart1" className="chart"></div>
                                    </div>
                                </div>
                                <div id="parent2" className="col-lg-6 col-xl-4">
                                    <div className="chart-card mb-4">
                                        <div className="chart-title" id="text2">VARIATION DE LA CONSOMMATION</div>
                                        <div id="chart2" className="chart"></div>
                                    </div>
                                </div>
                                <div id="parent3" className="col-lg-6 col-xl-4">
                                    <div className="chart-card mb-4">
                                        <div className="chart-title" id="text3">SUIVI ET PRÉVISION DE CONSOMMATION</div>
                                        <div id="chart3" className="chart"></div>
                                    </div>
                                </div>
                                <div id="parent4" className="col-lg-6 col-xl-4">
                                    <div className="chart-card mb-4">
                                        <div className="chart-title" id="text4">APPAREILS ACTIFS</div>
                                        <div id="chart4" className="chart"></div>
                                    </div>
                                </div>
                                <div id="parent5" className="col-lg-6 col-xl-4">
                                    <div className="chart-card mb-4">
                                        <div className="chart-title" id="text5">INTENSITÉ ÉNERGÉTIQUE</div>
                                        <div id="chart5" className="chart"></div>
                                    </div>
                                </div>
                                <div id="parent6" className="col-lg-6 col-xl-4">
                                    <div className="chart-card mb-4">
                                        <div className="chart-title" id="text6">EMPREINTE CARBONE</div>
                                        <div id="chart6" className="chart">  </div>
                                        <div id="chart7" className="chart"></div>
                                    </div>
                                </div>

                            </div>
                            <ChartDetail activePeriod={this.state.activePeriod} />


                            {/* <!-- chart row end -->

                            
                    <!-- energy tip start --> */}



                    {/* <!-- -->

                             <div className="row">
                                <div className="col-md-12 pb-3">
                                    <span className="footer-text-1">Energy Tip: </span><span className="footer-text-2">On warm days, setting a programmable thermostat to a higher setting when you are not at home can help reduce your energy costs
                            by approximately 10 percent.</span>
                                </div>
                            </div>  
                    <!--  --> */}
                    
                           

                            {/* <!-- energy tip end --> */}

                        </div>
                    </div>
                </div>
            </div>


        );
    }
}

export default App;