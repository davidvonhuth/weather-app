import { h, render, Component } from 'preact';
import iphone_style from '../iphone/style';
import style from './settings-style';
import $ from 'jquery';
import Navbar from '../navbar';
import { Link } from 'preact-router/match';

/*
    url settings 
*/
export default class Notifications extends Component {

	constructor(props){
		super(props);
	}


    render() {
        return (
            <div class={ iphone_style.container + " " + this.props.currentTheme.background } >
                <Navbar page = { "settings" } />
                <div class={ iphone_style.header }>
                    <Link href = "/notifications" class = {style.settings}>
                        <p class = {style.settingsOptions}>Notifications</p>
                        <img src = "assets/icons/icon-right-red.svg" class = { style.backArrow } />
                    </Link>
                    <Link href = "/clothing" class = {style.settings}>
                        <p class = {style.settingsOptions}>Clothing</p>
                        <img src = "assets/icons/icon-right-red.svg" class = { style.backArrow } />
                    </Link>
                    <Link href = "/preferences" class = {style.settings}>
                        <p class = {style.settingsOptions}>Preferences</p>
                        <img src = "assets/icons/icon-right-red.svg" class = { style.backArrow } />
                    </Link>
                </div>
                <div class={ iphone_style.details }></div>
            </div>
        );

    }

}
