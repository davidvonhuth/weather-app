import { h, render, Component } from 'preact';
import style from './style';
import { Link } from 'preact-router/match';

export default class Navbar extends Component {

	constructor(props){
		super(props);
	}

	render() {
        let logo;
        let button;
        let backLink;

        /*
            render navigation bar based on what page the app is on
        */

        if (this.props.page == "home") {
            logo = <img src ="assets/icons/dressapp-logo.svg" id = {style.dressappLogo}/>;

            button = <Link href = "/settings"> <img src = "assets/icons/settings-unactive.png"
                     class = { style.settingSizes } /></Link>
            backLink = null;
        }
        else if (this.props.page == "settings") {
            //logo = <p style = "height: 10px;">Settings</p>;
            logo = <p class = { style.text }>Settings</p>;
            button = <Link href = "/"> <img src = "assets/icons/settings-active.png"
                     class = { style.settingSizes } /></Link>
            backLink = <Link href="/"><img src="assets/icons/back-button.svg"
                   class = { style.back }/></Link>;

        }
        else if (this.props.page == "notifications") {
            //logo = <p style = "height: 10px;">Settings</p>;
            logo = <p class = { style.text }>Notifications</p>;
            button = <Link href = "/"> <img src = "assets/icons/settings-active.png"
                     class = { style.settingSizes } /></Link>
            backLink = <Link href="/settings"><img src="assets/icons/back-button.svg"
                   class = { style.back }/></Link>;

        }
        else if (this.props.page == "clothing") {
            //logo = <p style = "height: 10px;">Settings</p>;
            logo = <p class = { style.text }>Clothing</p>;
            button = <Link href = "/"> <img src = "assets/icons/settings-active.png"
                     class = { style.settingSizes } /></Link>
            backLink = <Link href="/settings"><img src="assets/icons/back-button.svg"
                   class = { style.back }/></Link>;

        }
        else if (this.props.page == "preferences") {
            //logo = <p style = "height: 10px;">Settings</p>;
            logo = <p class = { style.text }>Preferences</p>;
            button = <Link href = "/"> <img src = "assets/icons/settings-active.png"
                     class = { style.settingSizes } /></Link>
            backLink = <Link href="/settings"><img src="assets/icons/back-button.svg"
                   class = { style.back }/></Link>;
	   	}
		else if (this.props.page == "hourBreakdown") {
		   //logo = <p style = "height: 10px;">Settings</p>;
		   logo = <p class = { style.text }>Breakdown</p>;
		   button = <Link href = "/settings"> <img src = "assets/icons/settings-unactive.png"
					class = { style.settingSizes } /></Link>
			backLink = <Link href="/"><img src="assets/icons/back-button.svg"
                   class = { style.back }/></Link>;
		}


		return (
                <nav class = {style.navbar }>
                    <ol class = {style.listStyle}>
                        { backLink }
                        { logo }
                        { button }
                    </ol>
                </nav>

// + " " + this.props.currentTheme.background
		);
	}
}
