import { h, render, Component } from 'preact';
import clothing_style from './clothing-style';
import $ from 'jquery';
import ClothingDropDown from './clothes-drop-down.js';
import ClothesAdder from './clothes-adder.js';


export default class ClothingContainer extends Component {
	constructor(props){
		super(props);
        this.state.renderAgain = false;
    }


    reRender = () => {
        this.setState({renderAgain: !this.state.renderAgain});

    }

    render() {
        return (
            <div class = { clothing_style.container }>
                <ClothingDropDown label = { this.props.label }
                                  defaultClothes = { this.props.defaultClothes }
                                  isClothingListUpdated = { this.state.renderAgain }
                                  localStorageKey = { this.props.clothesObjName } />

                <ClothesAdder fetchDefaultFrom = { this.props.clothesObjName }
                              renderParent = { this.reRender }
                              displayCamera = { this.props.displayCamera }
                              currentTheme = {this.props.currentTheme} />
            </div>
        );

    }

}
