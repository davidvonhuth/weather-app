import { h, render, Component } from 'preact';
import clothing_style from './clothing-style';
import $ from 'jquery';
import preactLocalStorage from 'preact-localstorage';
import Webcam from 'react-webcam';


export default class CustomClothesAdder extends Component {
	constructor(props){
		super(props);

        this.state.displayInput = null;
    }


    /*
    * purpose: display the input text field and save/cancel buttons
    *
    */
    displayContainerDesc = () => {
        this.setState({displayInput: <div className = { clothing_style.descInput}>
            <p className = { clothing_style.saveInstruction }> Clothing category </p>
            <input id = "input" style  = "outline: 0;" type="text"/>
            <button className = { clothing_style.saveCancelButton + " " + clothing_style.save }
                    onClick = { () => this.createContainer() }>Save</button>
            <button className = { clothing_style.saveCancelButton + " " + clothing_style.cancel }
                    onClick = { () => this.cancelCreate() }>Cancel</button>
            </div>});
    };


    /*
    * purpose: get the input from the user
    *
    */
    createContainer() {
        let input = document.getElementById('input');

        this.props.addCustomContainer(input.value);
        this.setState({displayInput: null});

    }


    cancelCreate() {
        this.setState({displayInput: null});
    }



    render() {
        let clothingLabel = this.props.label;
        if (!clothingLabel) {
            clothingLabel = "";
        }

        return (
            <div>
            <div id = { clothing_style.customTopDiv }>
                    <p class = { clothing_style.customLabel }> Custom Clothes </p>
                    <img src = "assets/icons/add-clothes.svg" class =  { clothing_style.customCameraIcon }
                                                         onClick = { this.displayContainerDesc }/>
                    <p class =  { clothing_style.clothesAdderText + " " +
                                  clothing_style.addCustomLabel } >Add Clothing</p>
            </div>
            { this.state.displayInput }
            </div>

        );

    }

}
