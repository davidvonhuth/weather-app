import { h, render, Component } from 'preact';

//import style from './style';
import $ from 'jquery';
import style from './style';
import Navbar from '../navbar';
import WeatherData from '../WeatherData/WeatherData';
import IconList from '../IconList/IconList';


// home page of application
export default class Home extends Component {
	constructor(props){
		super(props);
		this.state = {
			weatherData: null
		}
	}

	getWeatherData = (weatherDataFromChild) => {
		this.setState({weatherData: weatherDataFromChild});
	}

	passWeatherData = () => {
        this.props.func(this.state.weatherData);
	}

    render() {
        return (
			<div class={ style.container + " " + this.props.currentTheme.background }>
				<Navbar page={ "home" } / >
				<div class={ style.header }>
                    <WeatherData callBackData={ this.getWeatherData.bind(this) }
                                 dataToHourBreakDown = { this.passWeatherData.bind(this) }
                                 currentTheme = {this.props.currentTheme} />
					<IconList weatherData={ this.state.weatherData } home={ true }
                              currentTheme = {this.props.currentTheme} />
				</div>
			</div>
        );
    }


}
