import { h, render, Component } from 'preact';
import iphone_style from '../iphone/style';
import $ from 'jquery';
import style from './settings-style';
import preactLocalStorage from 'preact-localstorage';

import Navbar from '../navbar';

export default class Notifications extends Component {
	constructor(props){
		super(props);
		this.state = {
			hourList: this.getHourList(),
			minuteList: this.getMinuteList(),
			morningAlarmSet: this.getCurrentAlarmState("morning"),
			eveningAlarmSet: this.getCurrentAlarmState("evening")
		}
    }

    /*
    * purpose: create a list of hours to be displayed in the select drop down
    *
    */
	getHourList() {
		var hours = [];
		let i;
		for (i = 0; i < 24; i++) {
			if (i < 10) {
				hours.push("0" + i);
			}
			else {
				hours.push(i);
			}
		}
		var timeList = hours.map((hour) => {
			return (<option value = { hour }> { hour} </option>);
		});
		return timeList;
	}


    /*
    * purpose: create a list of minutes to be displayed in the select drop down
    *
    */
	getMinuteList() {
		var minutes = [];
		let i = 0;
		for (i; i < 60; i+=5) {
			if (i < 10) {
				minutes.push("0" + i);
			}
			else {
				minutes.push(i);
			}
		}
		let timeList = minutes.map((minute) => {
			return (<option value = { minute }> { minute } </option>);
		});
		return timeList;
	}

	getCurrentAlarmState(button) {
		return preactLocalStorage.getObject(button, false);
	}


	handleStatusClick(buttonClicked) {
		if (buttonClicked == "morning") {
			this.setState({
				morningAlarmSet: !this.state.morningAlarmSet
			});
			preactLocalStorage.setObject("morning", this.state.morningAlarmSet);
		} else {
			this.setState({
				eveningAlarmSet: !this.state.eveningAlarmSet
			});
			preactLocalStorage.setObject("evening", this.state.eveningAlarmSet);
		}
	}

    render() {
        return (
            <div class={ iphone_style.container + " " + this.props.currentTheme.background  }>
                <Navbar page = { "notifications" } />
                <div class={ iphone_style.header }>

                <table>
                <tr class = {style.table}><th></th><th>Status (on/off)</th><th>Time of alarm</th></tr>
                <tr class = {style.notificationHeadings}>
                    <td class = { style.tableCol1 }>Morning Alert</td>
                    <td><label class = {style.switch}>
                        <input type = "checkbox" onClick={() => this.handleStatusClick("morning") }/>
                        <span class = {style.slider}></span>
                    </label></td>
					{ this.state.morningAlarmSet ?
						<td>
		                    <div>
		                    <select class = { style.selectElements }>
		                        { this.state.hourList }
		                    </select>

		                    <select class = { style.selectElements }>
		                        { this.state.minuteList }
		                    </select>
		                    </div>
		                </td> :
						<td>
							<div>
							<select class = { style.selectElementsGreyedOut } disabled>
								{ this.state.hourList }
							</select>

							<select class = { style.selectElementsGreyedOut } disabled>
								{ this.state.minuteList }
							</select>
							</div>
						</td>
					}

                </tr>

                <tr class = {style.notificationHeadings}>
                    <td class = { style.tableCol1 }>Evening Alert</td>
                    <td><label class = {style.switch}>
                        <input type = "checkbox" onClick={() => this.handleStatusClick("evening") }/>
                        <span class = {style.slider}></span>
                    </label></td>

					{ this.state.eveningAlarmSet ?
						<td>
							<div>
							<select class = { style.selectElements }>
								{ this.state.hourList }
							</select>

							<select class = { style.selectElements }>
								{ this.state.minuteList }
							</select>
							</div>
						</td> :
						<td>
							<div>
							<select class = { style.selectElementsGreyedOut } disabled>
								{ this.state.hourList }
							</select>

							<select class = { style.selectElementsGreyedOut } disabled>
								{ this.state.minuteList }
							</select>
							</div>
						</td>
					}

                </tr>
                <tr class = {style.notificationHeadings}>
                <td class = { style.tableCol1 }>Change in <br/> clothing Alert</td>
                <td><label class = {style.switch}>
                    <input type = "checkbox" />
                    <span class = {style.slider}></span>
                    </label></td>
                    </tr>
                </table>
                </div>
                <div class={ iphone_style.details }></div>
            </div>
        );

    }

}
