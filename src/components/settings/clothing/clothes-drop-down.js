import { h, render, Component } from 'preact';
import clothing_style from './clothing-style';
import $ from 'jquery';
import preactLocalStorage from 'preact-localstorage';


export default class ClothingDropDown extends Component {
	constructor(props){
		super(props);
        this.state.clothingList = false;
        this.state.arrowClicked = false;

        // store default clothing and perserve the old clothing lists
        if (this.props.defaultClothes) {
            var defaultSrcList =  this.props.defaultClothes.srcList;
            var defaultDescList =  this.props.defaultClothes.descriptions;

            /* check if there were already stored images and include them */
            if (preactLocalStorage.getObject(this.props.localStorageKey, "DEFAULT") != "DEFAULT") {
                var storedObj = preactLocalStorage.getObject(this.props.localStorageKey, "DEFAULT");
                let i;
                let len = defaultSrcList.length;
                // update
                for (i = 0; i < len; i++) {
                    if (storedObj.srcList[i] !=  this.props.defaultClothes.srcList[i]) {
                        storedObj.srcList.push(defaultSrcList[i]);
                        storedObj.descriptions.push(defaultDescList[i]);
                    }
                }

                preactLocalStorage.setObject(this.props.localStorageKey, storedObj);
                this.state.numberOfClothes = storedObj.srcList.length;

            }
            else {
                this.state.numberOfClothes = this.props.defaultClothes.srcList.length;
                preactLocalStorage.setObject(this.props.localStorageKey,
                                             this.props.defaultClothes);
            }
        }
        else {
            if (preactLocalStorage.getObject(this.props.localStorageKey, "DEFAULT") == "DEFAULT") {
                this.state.numberOfClothes = 0;
                let obj = { srcList: [],
                            descriptions: []};
                preactLocalStorage.setObject(this.props.localStorageKey, obj);

            }
            else {
                let obj = preactLocalStorage.getObject(this.props.localStorageKey, "DEFAULT");

                this.state.numberOfClothes = obj.srcList.length;
            }

        }

        /* don't display the delete button before double clicking the image */
        this.state.displayDelete = false;
    }



    dropDown = () => {
        this.setState({arrowClicked: true});
    }



    pullUp = () => {
        this.setState({arrowClicked: false});
        this.setState({clothingList: null});
    }

    /*
    * purpose: return the number of clothes stored in a container
    *
    */
    getNumberOfClothes = () => {
        let obj = preactLocalStorage.getObject(this.props.localStorageKey, "DEFAULT");

        let numStored = obj.srcList.length;
        if (numStored != this.state.numberOfClothes) {
            this.state.numberOfClothes = numStored;
        }

        return this.state.numberOfClothes.toString(10);
    }



    displayDeleteButton() {
        this.setState({ displayDelete: !this.state.displayDelete });
    }


    /*
    * purpose: display the input text field and save/cancel buttons
    *
    * parameter key: the position in the image source list
    */
    deletImage(key) {
        // fetch correct element to delete
        let obj = preactLocalStorage.getObject(this.props.localStorageKey, "DEFAULT");

        let newImageSrcList = [];
        let newDescriptionList = [];
        let oldImageList = obj.srcList;
        let oldDescriptionList = obj.descriptions;


        let i;
        // add to new lists and ignore the key for element to be deleted
        for (i = 0; i < oldImageList.length; i++) {
            if (i != key) {
                newImageSrcList.push(oldImageList[i]);
                newDescriptionList.push(oldDescriptionList[i]);
            }
        }

        // store the new lists in the clothingList object
        obj.srcList = newImageSrcList;
        obj.descriptions = newDescriptionList;
        preactLocalStorage.setObject(this.props.localStorageKey, obj);

        // undisplay delete button and also cause a re render
        this.displayDeleteButton();
    }



    render() {
        let clothingLabel = this.props.label;
        let images;
        let arrowButton;
        let clothingList = null;
        let smoothSlideClassName;

        // check if drop down arrow has been clicked
        if (this.state.arrowClicked) {
            // get the stored images and descriptions
            var obj = preactLocalStorage.getObject(this.props.localStorageKey, "DEFAULT");

            let listOfClothes = obj.srcList;
            let clothesDesc = obj.descriptions;

            /* create the list to be rendered using jsx  */
            clothingList = listOfClothes.map((item, key) => {
                let deleteButton = null;
                let wobbleClass = "";

                // check if the image has been double clicked
                if (this.state.displayDelete) {
                    deleteButton = <button onClick = { () => this.deletImage() }
                            className = { clothing_style.imageDeleteButton }>
                            <p>X</p>
                        </button>

                    // styling that make images wobble
                    wobbleClass = clothing_style.wobble;
                }

                return (<div className = { clothing_style.imageDiv } >
                            <img key = { item }
                                 onDblClick = { () => this.displayDeleteButton() }
                                 src = { item }
                                 alt=""
                                 class = { clothing_style.imgComponent + " " + wobbleClass } />

                            { /* toggle render delete button on double click */ }
                            { this.state.displayDelete ?
                                <button onClick = { () => this.deletImage(key) }
                                        className = { clothing_style.imageDeleteButton }>
                                    <p>X</p>
                                </button> : null }

                            <p class ={ clothing_style.ImageDescription }>
                                { clothesDesc[key] }
                            </p>
                        </div>);
            }); // end of map function

            // create the correct arrpw when the images are dropped down
            arrowButton = <img src = "assets/icons/icon-triangle-up.svg" class = { clothing_style.downArrow }
                               onClick = { this.pullUp } />;

            smoothSlideClassName = clothing_style.clothesColumn;
        } // end if arrowClicked
        else {
            arrowButton = <img src = "assets/icons/icon-triangle-down.svg" class = { clothing_style.downArrow }
                 onClick = { this.dropDown } />

            /* style to hide the list of clothes */
            smoothSlideClassName = clothing_style.hidden;
        }

        return (
                <div class = { clothing_style.clothingSpec }>
                    <span class = { clothing_style.roundIcon }>
                        <img src = "assets/icons/icon-tshirt.svg" class = { clothing_style.clothingIcon } />
                    </span>


                    <div style = "width: 100%">
                    <p class = { clothing_style.clothesLabel }>
                        { clothingLabel + " (" + this.getNumberOfClothes() + ")"}
                    </p>

                    {/* conditional rendering here */}
                    { arrowButton }
                    </div>
                    {/* the list that drops down  */}
                    <div class = { smoothSlideClassName }>
                        <ul class = { clothing_style.clothesColumnList } >
                            { clothingList }
                        </ul>
                    </div>
                </div>

        );

    }

}
