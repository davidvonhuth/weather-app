import { h, render, Component } from 'preact';
import clothing_style from './clothing-style';
import $ from 'jquery';
import preactLocalStorage from 'preact-localstorage';
import Webcam from 'react-webcam';


export default class ClothesAdder extends Component {
	constructor(props){
		super(props);

        this.state.fetchFrom = this.props.fetchDefaultFrom;
        this.state.myImage = null;

        if (this.props.displayCamera) {
            //this.showCamera();
        }
        else {
            this.state.displayCamera = null;
        }
        this.state.displayInput = null;
    }


    /*
    * purpose: set camera
    *
    * parameter webcam: the camera component
    */
    setRef = (webcam) => {
        this.webcam = webcam;
    }



    /*
    * purpose: take the photo and display
    *          input box, save, cancel, and retake button
    *
    */
    capture = () => {
        const image = this.webcam.getScreenshot();

        // display still photo
        this.setState({displayCamera:<div className = { clothing_style.stillPicture }>
            <img src = {image} />
            </div>
        });

        this.setState({displayInput: <div className = { clothing_style.descInput}>
            <p className = { clothing_style.saveInstruction }> Clothes description </p>
            <input id = "input" style  = "outline: 0;" type="text"/>
            <button className = { clothing_style.saveCancelButton + " " + clothing_style.save }
                    onClick = { () => this.saveImage(image) }>Save</button>
            <button className = { clothing_style.saveCancelButton + " " + clothing_style.cancel }
                    onClick = { () => this.cancelImage() }>Cancel</button>
            <button className = { clothing_style.saveCancelButton + " " + clothing_style.retake }
                    onClick = { () => this.retake() }>Retake</button>
            </div>});
    };

    retake() {
        this.showCamera()
        this.setState({displayInput: null});
        this.capture;

    }

    saveImage(imgSrc) {
        let input = document.getElementById('input');
        let clothingList = preactLocalStorage.getObject(this.state.fetchFrom, "DEFAULT");

        clothingList.srcList.push(imgSrc);
        clothingList.descriptions.push(input.value);

        // save to list of clothes
        preactLocalStorage.setObject(this.state.fetchFrom, clothingList);

        // Remove camera and input from view
        this.setState({displayCamera: null});
        this.setState({displayInput: null});

        this.props.renderParent();

    }

    cancelImage() {
        this.setState({displayCamera: null});
        this.setState({displayInput: null});
    }


    /*
    * purpose: create the WebCam component and set the state to display it
    *
    */
    showCamera = () => {
        const videoConstraints = {
            width: 1280,
            height: 720,
            facingMode: 'user'
        };
        this.setState({displayCamera:<div className = { clothing_style.CameraDiv}>
            <Webcam audio = {false}
                    height = {350}
                    ref = {this.setRef}
                    screenshotFormat = "image/jpeg"
                    width = {350}
                    videoConstraints = { videoConstraints }
            />
                <button class = { clothing_style.captureButton }
                        onClick = { this.capture }> Capture
                </button>
            </div>
        });
    }


    render() {
        let clothingLabel = this.props.label;
        if (!clothingLabel) {
            clothingLabel = "";
        }

        return (
            <div class = { clothing_style.clothingAdder }>
                <img src = "assets/icons/camera.svg" class =  { clothing_style.roundIcon }
                     onClick = {this.showCamera}/>
                <p class =  { clothing_style.clothesAdderText + " " +
                              clothing_style.addClothingLabel } >Add Clothing</p>
                <p class = { clothing_style.clothesAdderText + " " +
                             clothing_style.degreeLowLabel }>Low (°C)</p>
                <div class = { clothing_style.minMaxBox + " " + this.props.currentTheme.minMaxBox } >
                    <p contenteditable="true"
                       class = {clothing_style.minMaxBoxPElt}> 12 </p>
                </div>

                <p class = { clothing_style.clothesAdderText + " " +
                             clothing_style.degreeHighLabel }>High (°C)</p>
                <div class = { clothing_style.minMaxBox + " " + this.props.currentTheme.minMaxBox } >
                    <p contenteditable="true"
                       class = { clothing_style.minMaxBoxPElt }> max </p>
                </div>
                { this.state.displayCamera }
                { this.state.displayInput }
            </div>

        );

    }

}
