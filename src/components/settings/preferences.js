import { h, render, Component } from 'preact';
import iphone_style from '../iphone/style';
import $ from 'jquery';
//import '../../../node_modules/bootstrap/scss/bootstrap';
//import '../../../node_modules/popper.js/dist/popper';
import blueTheme from '../blueTheme';
import greenTheme from '../greenTheme';
import lilacTheme from '../lilacTheme';
import Navbar from '../navbar';
import testCSS from '../testCSS';

import style from './preferences-style';


export default class Preferences extends Component {
	constructor(props){
		super(props);
        this.state.arrowClicked = false;
        this.state.activeTheme = this.props.currentTheme;
    }


    /*
    * purpose: send the stylesheet to the other components via
    *          props changeTheme
    *
    * parameter theme: the passed style sheet object
    */
    setActiveTheme = (theme) => {
        this.props.changeTheme(theme);
        this.setState({arrowClicked: !this.state.arrowClicked});
        this.setState({activeTheme: theme});
    }


    dropDown = () => {
        this.setState({arrowClicked: !this.state.arrowClicked});
    }

    render() {
        var list = null;
        var srcToArrow;
        if (this.state.arrowClicked) {

            /* list of various themes that are included abover */
            var colorSchemes = [blueTheme, greenTheme, lilacTheme];

            /* create list of colors that get dropped down */
            list = colorSchemes.map((item, key) => {
                return (
                        <div className= { item.colorContainer }
                             onClick = { () => this.setActiveTheme(colorSchemes[key]) }>
                             <div className = { colorSchemes[key].colorOne }> </div>
                             <div className = { colorSchemes[key].colorTwo }> </div>
                        </div>
                );
            });

            // have correct arrow
            srcToArrow = "assets/icons/drop-down-arrow.svg";

        }
        else {
            srcToArrow = "assets/icons/up-arrow.svg";
        }


        return (
            <div class={ iphone_style.container + " " + this.props.currentTheme.background }>
                <Navbar page = { "preferences" } />
                <div class={ iphone_style.header }>
                    <div class = { style.container }>
                        <p class = { style.visualText }>Visual preferences</p>
                        <div class = { style.categories }>
                            <div className= { this.state.activeTheme.colorContainer }
                                 onClick = { this.dropDown } >
                                 <div className = { this.state.activeTheme.colorOne }> </div>
                                 <div className = { this.state.activeTheme.colorTwo }> </div>
                                 <img src = { srcToArrow } style = "width: 20px; height: 20px;"/>
                            </div>
                        </div>
                        <div className = { style.listContainer }>
                            { list }
                        </div>
                    </div>
                </div>
            </div>
        );


    }




}
