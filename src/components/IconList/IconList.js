import { h, render, Component } from 'preact';
import style from '../iphone/style';
import preactLocalStorage from 'preact-localstorage';

export default class IconList extends Component {
    constructor(props) {
        super(props);
    }



    /*
    * purpose: return the icons to use for today, tomorrow or hour break down
    *
    */
    getIcons() {
        if (this.props.home) {
            let srcPath = "../../assets/icons/";

            /* icons to use for the today page */
            var icons = {
                tshirt: {descriptions: ["T-Shirt"], srcList: [srcPath + "icon-tshirt.svg"]},
                jumper: {descriptions: ["Jumper"], srcList: [srcPath + "icon-jumper.svg"]},
                jacket: {descriptions: ["Jacket"], srcList: [srcPath + "icon-jacket.svg"]},
                pants: {descriptions: ["Pants"], srcList: [srcPath + "icon-pants.svg"]},
                shorts: {descriptions: ["Shorts"], srcList: [srcPath + "icon-shorts.svg"]},
                hat: {descriptions: ["Hat"], srcList: [srcPath + "icon-hat2.svg"]},
                umbrella: {descriptions: ["Umbrella"], srcList: [srcPath + "icon-umbrella2.svg"]}
            }

        } else {

            let srcPath = "../../assets/icons/";

            // get lists of clothing (fetch more dynamically in the future
            //                        not only from default clothes
            let tshirts = preactLocalStorage.getObject("tshirts", "DEFAULT");
            let jumpers = preactLocalStorage.getObject("jumpers", "DEFAULT");
            let trousers = preactLocalStorage.getObject("trousers", "DEFAULT");
            let shorts = preactLocalStorage.getObject("shorts", "DEFAULT");

            var icons = {
                tshirt: tshirts,
                jumper: jumpers,
                jacket: {descriptions: ["Jacket"], srcList: [srcPath + "leather-brown.jpg"]},
                pants: trousers,
                shorts: shorts,
                hat: {descriptions: ["Hat"], srcList: [srcPath + "watchcap.png"]},
                umbrella: {descriptions: ["Umbrella"], srcList: [srcPath + "umbrella-yellow.jpg"]}
            }

        }
        return icons;
    }



    /*
    * purpose: return an object of what clothes to wear and what clothes
    *          to take with you
    *          (for now take the last item in the list of default clothes)
    *
    * parameter items: the images and descriptions to be used as icons
    */
    getToTakeAndToWear(items) {
        let data = this.props.weatherData;

        let listLength = items.tshirt.descriptions.length - 1;
        let toWear = [[items.tshirt.descriptions[listLength], items.tshirt.srcList[listLength]]];
        let toTake = [];
        let isWet = data.desc.includes("rain", "drizzle", "snow", "sleet", "overcast") ? true : false;

        if (data.temp <= 18) {
            listLength = items.pants.descriptions.length - 1;
            toWear.push([items.pants.descriptions[listLength], items.pants.srcList[listLength]]);


            listLength = items.jumper.descriptions.length - 1;
            toWear.push([items.jumper.descriptions[listLength], items.jumper.srcList[listLength]]);

            if (data.temp <= 11 || data.wind > 13) {
                toWear.push([items.jacket.descriptions[0], items.jacket.srcList[0]]);
            } else {
                toTake.push([items.jacket.descriptions[0], items.jacket.srcList[0]]);
            }
            if (data.temp <= 3) {
                toWear.push([items.hat.descriptions[0], items.hat.srcList[0]]);
            } else {
                toTake.push([items.hat.descriptions[0], items.hat.srcList[0]]);
            }
        } else {
            listLength = items.shorts.descriptions.length - 1;
            toWear.push([items.shorts.descriptions[listLength], items.shorts.srcList[listLength]]);
        }

        if (data.rain > 1 || isWet)
            toTake.push([items.umbrella.descriptions[0], items.umbrella.srcList[0]]);

        return ({
            toTake: toTake,
            toWear: toWear
        });
    }


    render() {
        if (!this.props.weatherData) {
            return <span>Loading...</span>;
        } else {
            var items = this.getToTakeAndToWear(this.getIcons());
            var toWear = items.toWear;
            var toTake = items.toTake;

            let whatToWearText = "";
            let whatToTakeText = "";
            if (this.props.weatherData.page == "today") {
                whatToWearText = "What to wear today";
                whatToTakeText = "What to take with you today";
            }
            else if (this.props.weatherData.page == "tomorrow") {
                whatToWearText = "What to wear tomorrow";
                whatToTakeText = "What to take with you tomorrow";
            }
            else if (this.props.weatherData.page == "hourbreakdown") {
                whatToWearText = "Today's Outfit";
            }

            else if (this.props.weatherData.page == "nextWeek") {
                whatToWearText = "Most used item this week";
            }

            return (

                <div>
                    <h3 class={ style.iconHeader }>{ whatToWearText }</h3>
                    <div class={ style.iconContainer }>
                        {toWear.map((value) => {
                            return (
                                <div class={this.props.home ? style.inside : style.imageInside}>
                                    <div class={this.props.home ? style.iconBackground +
                                                " " + this.props.currentTheme.iconBackground  : style.imageIconBackground}>
                                        <img class={this.props.home ? style.iconImg : style.imageIconImg} src={value[1]}/>
                                    </div>
                                    <figcaption class={style.iconCaption}>{value[0]}</figcaption>
                                </div>
                            );
                        })}
                    </div>

                    { toTake.length == 0 || !this.props.home ? null : <h3 class={ style.iconHeader }> { whatToTakeText } </h3> }
                    <div class={ style.iconContainer }>
                        {!this.props.home || this.props.weatherData.page == "nextWeek" ? null : toTake.map((value) => {
                            return (
                                <div class={style.inside}>
                                    <div class={style.iconBackground + " " + this.props.currentTheme.iconBackground}>
                                        <img class={style.iconImg} src={value[1]}/>
                                    </div>
                                    <figcaption class={style.iconCaption}>{value[0]}</figcaption>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }
    }
}
