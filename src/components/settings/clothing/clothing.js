import { h, render, Component } from 'preact';
import iphone_style from '../../iphone/style';
import clothing_style from './clothing-style';
import $ from 'jquery';

import Navbar from '../../navbar';
import ClothingContainer from './clothing-container.js';
import CustomClothesAdder from './custom-clothes-adder.js';
import preactLocalStorage from 'preact-localstorage';


/*
    url: settings/clothing

    contain the rows with drop down lists and the rows with camera and clothing
    adders
    and the custom clothing     
*/
export default class Clothing extends Component {
	constructor(props){
		super(props);

        /* check if there are not any custom made clothing containers */
        if (preactLocalStorage.getObject("customContainers", "DEFAULT") == "DEFAULT") {
            let obj = {labelList: [],
                       storageNames: []};
            preactLocalStorage.setObject("customContainers", obj);
        }
        //preactLocalStorage.clear();

        // TODO add delete button of custom containers for now use this ONCE
        // to delete containers
        //preactLocalStorage.clear();
        this.state.update = false;

    }


    /*
    * purpose: add the label of the container and storage name of the photos
    *          created with the label
    *
    * parameter label: the name of the custom clothing added by the user
    */
    addClothingContainer = (label) => {
        let obj = preactLocalStorage.getObject("customContainers", "DEFAULT");
        let list = obj.labelList;
        let localStorageName = "local" + label;

        obj.labelList.push(label);
        obj.storageNames.push(localStorageName);
        preactLocalStorage.setObject("customContainers", obj);

        this.setState({update: !this.state.update});
    }



    render() {
        // hard coded default clothes

        /* t-shirt list */
        var tshirtList = { srcList: ["assets/icons/tshirt-black.jpg"],
                           descriptions: ["Black - Van"] };
        var tshirtLabel = "T-Shirt";
        var localStorageTShirts = "tshirts";

        /* end t-shirt list */

        /* jumper list */
        var jumperList = { srcList: ["assets/icons/brown-jumper.jpg",
                                     "assets/icons/green-jumper.jpeg"],
                           descriptions: ["Brown - Superdry",
                                          "Green - Stussy"] };
        var jumperLabel = "Jumper";
        var localStorageJumpers = "jumpers";

        /* end jumper list */


        /* trouser list */
        var trouserList = { srcList: ["assets/icons/red-trousers.jpg",
                                     "assets/icons/beige-trousers.jpeg"],
                           descriptions: ["Red - Van",
                                          "Beige - Rubinacci"] };
        var trouserLabel = "Trouser";
        var localStorageTrousers = "trousers";

        /* end trouser list */

        /* shorts list */
        var shortsList = { srcList: ["assets/icons/shorts-beige.jpg"],
                           descriptions: ["Beige - Van"] };
        var shortsLabel = "Shorts";
        var localStorageShorts = "shorts";

        /* end shorts list */


        /* get list of custom containers */
        var containers = preactLocalStorage.getObject("customContainers", "DEFAULT");

        let containerLabels = containers.labelList;
        let storageNames = containers.storageNames;

        let arrLength = containerLabels.length;

        /* create the custom containers found in storage */
        var listOfCustomContainers = containerLabels.map((item, key) => {
                let camera = false;
                // show camera of last clothingContainer
                if (key == arrLength - 1) {
                    camera = true;
                }

                return ( <ClothingContainer label = { item }
                                            clothesObjName = { storageNames[key] }
                                            displayCamera = { camera }
                                            currentTheme = {this.props.currentTheme} />
                        )});

        return (
            <div class={ iphone_style.container + " " + this.props.currentTheme.background  }>
                <Navbar page = { "clothing" } />
                <div class={ iphone_style.header }>
                    <div id = { clothing_style.topDiv }>
                        <p class = { clothing_style.top }> Default Clothes </p>
                    </div>
                    <ClothingContainer defaultClothes = { tshirtList }
                                       label = { tshirtLabel }
                                       clothesObjName = { localStorageTShirts }
                                       currentTheme = {this.props.currentTheme}/>

                    <ClothingContainer defaultClothes = { jumperList }
                                       label = { jumperLabel }
                                       clothesObjName = { localStorageJumpers }
                                       currentTheme = {this.props.currentTheme}/>

                    <ClothingContainer defaultClothes = { trouserList }
                                       label = { trouserLabel }
                                       clothesObjName = { localStorageTrousers }
                                       currentTheme = {this.props.currentTheme}/>

                    <ClothingContainer defaultClothes = { shortsList }
                                       label = { shortsLabel }
                                       clothesObjName = { localStorageShorts }
                                       currentTheme = {this.props.currentTheme}/>



                    <CustomClothesAdder addCustomContainer = { this.addClothingContainer } />
                    { listOfCustomContainers }
                </div>

            </div>
        );

    }

}
