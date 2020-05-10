import { h, render, Component } from 'preact';
import style from './style';
import style_iphone from '../button/style_iphone';
import $ from 'jquery';
import Button from '../button';

import Router from 'preact-router';
import Home from '../home';
import HourBreakdown from '../HourBreakdown/HourBreakdown.js';
import Settings from '../settings/settings.js';
import Notifications from '../settings/notifications.js';
import Clothing from '../settings/clothing/clothing.js';
import Preferences from '../settings/preferences.js';
import blueTheme from '../blueTheme';

import { route } from 'preact-router';

export default class Iphone extends Component {
	constructor(props){
		super(props);

		this.state.weatherData = null;
		this.state.currentTheme = blueTheme;
	}



    /*
    * purpose: set the current weather data that will be sent as props
    *          to other components
    * parameter weatherDataFromChild: the data passed from WeatherData component
    */
	passData = (weatherDataFromChild) => {
		this.setState({weatherData: weatherDataFromChild});
	}




    /*
    * purpose: set the theme of all components
    *
    */
    setNewTheme = (newTheme) => {
		this.setState({currentTheme: newTheme});
	}


	render() {
		return (
            <div>
                <Router>
                    <Home path = "/" func= { this.passData } currentTheme = {this.state.currentTheme} />
                    <HourBreakdown path = "/hourbreakdown" weatherData = { this.state.weatherData }
                                                           currentTheme = {this.state.currentTheme} />
                    <Settings path = "/settings" currentTheme = {this.state.currentTheme}/>
					<Notifications path = "/notifications" currentTheme = {this.state.currentTheme} />
                    <Clothing path = "/clothing" currentTheme = {this.state.currentTheme}/>
                    <Preferences path = "/preferences" currentTheme = {this.state.currentTheme} changeTheme = {this.setNewTheme} />

                </Router>
			</div>
		);
		}
	}
