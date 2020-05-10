import { h, render, Component } from 'preact';
import style from '../iphone/style';
import breakdownStyle from './breakdown-style'
import Navbar from '../navbar';
import IconList from '../IconList/IconList';
import preactLocalStorage from 'preact-localstorage';


export default class HourBreakdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hourlyWeather: {},
            hourlyArray: []
        }
    }

    componentDidMount() {
        var hourlyWeather = this.getHourlyWeather();
        this.state.hourlyWeather = hourlyWeather;
        var temp_low = 6;
        var temp_average = 9
        var temp_high = 10;

        // hourly array = [hour, reqHat, reqUmbrella]
        var hourlyArray = this.buildHourlyArray(hourlyWeather);
        this.setState({
            hourlyWeather: hourlyWeather,
            hourlyArray: hourlyArray
        });
    }


    /*
    * API call would go in here - data is hard coded as hourly weather
    * costs money from API.
    *
    */
    getHourlyWeather() {
        // api call
        return ({
            temp_min: 1,
            temp_average: 4,
            temp_max: 7,
            // hourly = hour: [temp, rain]
            hourly: {
                '01': [4, 0],
                '02': [4, 0],
                '03': [4, 0],
                '04': [4, 0],
                '05': [2, 5],
                '06': [3, 0],
                '07': [4, 0],
                '08': [3, 0],
                '09': [4, 0],
                '10': [5, 0],
                '11': [6, 2],
                '12': [6, 0],
                '13': [6, 0],
                '14': [7, 0],
                '15': [6, 0],
                '16': [6, 0],
                '17': [5, 4],
                '18': [2, 4],
                '19': [4, 0],
                '20': [4, 0],
                '21': [3, 1],
                '22': [4, 0],
                '23': [4, 0],
                '00': [1, 0]
            }
        });
    }


    /*
    * Build an array of hourly temps and whether they require a hat/umbrella
    *
    */
    buildHourlyArray(hourlyWeather) {
        //var currentHour = 21;
        var currentHour = new Date().getHours();
        var a = [];
        var pos = currentHour-4;
        for (let i = 0; i<9; i++, pos++) {
            if (pos < 0) {
                pos += 24;
            } else if (pos >= 24) {
                pos -= 24;
            }

            if (pos < 10) {
                pos = "0" + pos;
            } else {
                pos = pos + "";
            }
            a[i] = [
                pos,
                this.reqHat(this.state.hourlyWeather.hourly[pos][0]),
                this.reqUmbrella(this.state.hourlyWeather.hourly[pos][1])
            ];
        }

        return a;
    }

    reqHat(temp) {
        return temp <= 3;
    }

    reqUmbrella(rain) {
        return rain > 0;
    }


    render() {
        var hat = <img class={ breakdownStyle.hourlyIcon } src="../../assets/icons/icon-hat.svg"/>;
        var umbrella = <img class={ breakdownStyle.hourlyIcon } src="../../assets/icons/icon-umbrella.svg"/>;

        /*
        * If the hourlyArray is not yet set - don't show any icons (hat/umbrella)
        *
        */
        if (this.state.hourlyArray.length != 0) {
            var showHat = this.state.hourlyArray[4][1];
            var showUmbrella = this.state.hourlyArray[4][2];
        } else {
            var showHat = false;
            var showUmbrella = false;
        }

        return(
            <div class={ style.container }>

                <Navbar page={ "hourBreakdown" } />

                <div class={ breakdownStyle.tempContainerTop }>
                    <div class={ breakdownStyle.lowTemp }>
                        <p> { this.state.hourlyWeather.temp_min }°C </p>
                        <p class={breakdownStyle.tempCaption}> Low </p>
                    </div>
                    <div class={ breakdownStyle.averageTemp }>
                        <p> { this.state.hourlyWeather.temp_average }°C </p>
                        <p class={breakdownStyle.tempCaption}> Average </p>
                    </div>
                    <div class={ breakdownStyle.highTemp }>
                        <p> { this.state.hourlyWeather.temp_max }°C </p>
                        <p class={breakdownStyle.tempCaption}> High </p>
                    </div>
                </div>

                <IconList weatherData={ this.props.weatherData } home={ false }
                          currentTheme = { this.props.currentTheme }/>

                <div >
                    <h3 class={ breakdownStyle.hourlyHeader }>Today's Change</h3>
                    <img class={ breakdownStyle.arrow } src="../../assets/icons/icon-triangle-down.svg"/>
                </div>

                <div class={ breakdownStyle.hourlyContainer }>
                    { this.state.hourlyArray.map((value, index) => {
                        return (
                            <div class = { breakdownStyle.hourlyElement }>
                                <p style= { index == 4 ? "font-weight: bold; color: rgb(55, 55, 55);" : null }> { value[0] } </p>
                                <p> { value[1] ? hat : <span></span>} </p>
                                <p> { value[2] ? umbrella : <span></span> } </p>
                            </div>
                        );
                    })}
                </div>

                <div class={ breakdownStyle.wearNowElementContainer }>
                    { !showHat ? null :
                        <div class = { breakdownStyle.wearNowSubContainer }>
                            <div style="color: black">Hat</div>
                            <div class={ breakdownStyle.wearNowElement }>
                                <img src="../../assets/icons/watchcap.png"/>
                            </div>
                        </div>
                    }
                    { !showUmbrella ? null :
                        <div class = { breakdownStyle.wearNowSubContainer }>
                            <div style="color: black">Umbrella</div>
                            <div class={ breakdownStyle.wearNowElement }>
                                <img src="../../assets/icons/umbrella-yellow.jpg"/>
                            </div>
                        </div>
                    }
                </div>

            </div>
        );
    }

}
