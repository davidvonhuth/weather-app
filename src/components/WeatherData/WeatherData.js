import { h, render, Component } from 'preact';
import style from '../iphone/style';
import style_iphone from '../button/style_iphone';
import week_style from './week_style';
import $ from 'jquery';
import { Link } from 'preact-router/match';
import { route } from 'preact-router';


export default class WeatherData extends Component {
    constructor(props) {
        super(props);
        this.state.temp = "";
        this.state.rain = "0";
        this.state.page = "today";
        this.state.cond = "";
        this.fetchWeatherData();
    }

    fetchWeatherData = () => {
		// API URL with a structure of : ttp://api.wunderground.com/api/key/feature/q/country-code/city.json
        var url;
        if (this.state.page == "today") {
            url = "http://api.openweathermap.org/data/2.5/weather?id=2643743&units=metric&APPID=e6060c98d79ce6c6335e8d94c2b0045b";
            $.ajax({
                url: url,
                dataType: "jsonp",
                success : this.parseResponse,
                error : function(req, err){ console.log('API call failed ' + err); }
            })
        }
        else if (this.state.page == "tomorrow") {
            url = "http://api.openweathermap.org/data/2.5/forecast?q=London&units=metric&appid=e6060c98d79ce6c6335e8d94c2b0045b";
            $.ajax({
                url: url,
                dataType: "jsonp",
                success : this.parseResponseTomorrow,
                error : function(req, err){ console.log('API call failed ' + err); }
            })

        }
        else {
            url = "http://api.openweathermap.org/data/2.5/forecast?q=London&units=metric&appid=e6060c98d79ce6c6335e8d94c2b0045b";
            $.ajax({
                url: url,
                dataType: "jsonp",
                success : this.parseResponseNextWeek,
                error : function(req, err){ console.log('API call failed ' + err); }
            })
        }
	}

    /*
    * purpose: return the day from today + offset
    *
    *
    * parameter offset: the number of days in the future
    */
    getDay(offset) {
        var date = new Date();

        date.setDate(date.getDate() + offset);
        var day = date.toISOString();

        day = day.substring(0, 10);

        return day;

    }


    /*
    * purpose: read the pass json file and return to other components
    *          via call back functions (tomorrow tab data)
    *
    * parameter parsed_json: the number of days in the future
    */
    parseResponseTomorrow = (parsed_json) => {

        // find the date of tomorrow
        var tomorrowString = this.getDay(1);

        // 9am weather lookup
        let dateMatcher = tomorrowString + " 09:00:00";

        let i;
        let indexFound;
        for (i = 0; i < parsed_json.list.length; i++) {
            if (parsed_json.list[i].dt_txt == dateMatcher) {
                indexFound = i;
            }
        }
        var foundRecord = parsed_json.list[indexFound];


        var src = "http://openweathermap.org/img/wn/"+foundRecord['weather']['0']['icon']+"@2x.png";
        var location = parsed_json['city']['name'];
        var country = parsed_json['city']['country'];
        var temp_c = Math.round(foundRecord['main']['temp']) +"°C";
        //var temp_feel ="Real Feel "+  Math.round(foundRecord['main']['feels_like'])+"°C";
        var temp_feel = foundRecord['main']['feels_like'];
        var conditions = foundRecord['weather']['0']['description'];
        var rainfall = (foundRecord['rain'] == undefined) ? 0 : foundRecord['rain']['3h'];
        var windSpeed = foundRecord['wind']['speed'];

        // set states for fields so they could be rendered later on
        this.setState({
            desc: conditions,
            imgSrc: src,
            locate: location +", "+country,
            temp: temp_c,
            real: temp_feel,
            cond : conditions,
            rain : rainfall,
            wind : windSpeed,
        });

        //temp_min: Math.round(this.state.temp_min),
        //temp_max: Math.round(this.state.temp_max)
        var data = {
            desc: this.state.cond,
            imgSrc: src,
            locate: location +", "+country,
            temp: this.state.real,
            rain : this.state.rain,
            wind : this.state.wind,
            page: this.state.page
        };

        this.state.data = data;

        //var pageHourBreakDown = "hourbreakdown";
        this.props.callBackData(data);
        this.props.dataToHourBreakDown(this.state.toHourBreakDown);
    }


    /*
    * purpose: read the pass json file and return to other components
    *          via call back functions (today tab data)
    *
    * parameter parsed_json: the number of days in the future
    */
    parseResponse = (parsed_json) => {

        var src = "http://openweathermap.org/img/wn/"+parsed_json['weather']['0']['icon']+"@2x.png";
        var location = parsed_json['name'];
        var country = parsed_json['sys']['country']
        var temp_c = Math.round(parsed_json['main']['temp'])+"°C";
        //var temp_feel ="Real Feel "+  Math.round(parsed_json['main']['feels_like'])+"°C";
        var temp_feel = parsed_json['main']['feels_like'];
        var conditions = parsed_json['weather']['0']['description'];
        var rainfall = (parsed_json['rain'] == undefined) ? 0 : parsed_json['rain']['3h'];
        var windSpeed = parsed_json['wind']['speed'];
        var temp_min = parsed_json['main']['temp_min'];
        var temp_max = parsed_json['main']['temp_max'];


        // set states for fields so they could be rendered later on
        this.setState({
            imgSrc: src,
            locate: location +", "+country,
            temp: temp_c,
            real: temp_feel,
            cond : conditions,
            rain : rainfall,
            wind : windSpeed,
            temp_min : temp_min,
            temp_max : temp_max
        });

        // Return data to IconList to determine clothing items
        //this.state.page = "hourbreakdown"
        var data = {
            desc: this.state.cond,
            temp: this.state.real,
            rain: this.state.rain,
            wind: this.state.wind,
            page: this.state.page,
            temp_min: Math.round(this.state.temp_min),
            temp_max: Math.round(this.state.temp_max)
        }

        this.state.data = data;
        this.state.toHourBreakDown = data;
        this.props.callBackData(data);

        this.props.dataToHourBreakDown(data);
    }




    /*
    * purpose: read the pass json file and return to other components
    *          via call back functions (next week tab data)
    *
    * parameter parsed_json: the number of days in the future
    */
    parseResponseNextWeek = (parsed_json) => {
        // map from date string to array position of days array in
        // render function
        var dayToArrPos = {Mon: 0,
                           Tue: 1,
                           Wed: 2,
                           Thu: 3,
                           Fri: 4,
                           Sat: 5,
                           Sun: 6};

        var currDate = new Date();

        var currDay = currDate.toDateString().substring(0, 3);

        var startPos = dayToArrPos[currDay];


        // create array of days 2 days from today up to 5 days from now
        // need other api call to get more days (not in free version)
        let followingDaysData = [this.getDay(2), this.getDay(3), this.getDay(4),
                                 this.getDay(5)];

        // append 09:00:00 to each element
        followingDaysData = followingDaysData.map((item) => {
            return item + " 09:00:00";
        })



        let i;
        let indexFound;
        let currDayNotFound = 0;
        let records = [];

        // fetch 09:00am data from the 5 following days;
        for (i = 0; i < parsed_json.list.length; i++) {
            if (parsed_json.list[i].dt_txt == followingDaysData[currDayNotFound]) {
                indexFound = i;
                records.push(parsed_json.list[i]);
                currDayNotFound++;
            }
        }

        var src_list = [];
        var temp_feel_list = [];
        var temp_c_list = [];
        var country = parsed_json['city']['country'];
        var location = parsed_json['city']['name'];

        // create lists of data for each future day from the above created records
        for (i = 0; i < records.length; i++) {
            src_list.push("http://openweathermap.org/img/wn/"+records[i]['weather']['0']['icon']+"@2x.png");
            temp_feel_list.push(Math.round(records[i]['main']['feels_like']));
            temp_c_list.push(Math.round(records[i]['main']['temp']));
        }

        // Return data to IconList to determine clothing items
        // Should be data of most used items TODO in the future
        this.props.callBackData({
            desc: this.state.cond,
            temp: this.state.real,
            rain: this.state.rain,
            wind: this.state.wind,
            page: this.state.page
        });

        this.setState({
            imgSrc: src_list,
            currDay: startPos,
            locate: location +", "+country,
            temp: temp_c_list,
            real: temp_feel_list,
        });
    }



    switchDay = (day) => {
        this.setState({page: day});
        this.fetchWeatherData();
    }
    /*
    * purpose: called when the hour break down button is clicked
    *          pass data to other components
    *
    */
    passWeatherData = () => {
        route("/hourbreakdown");

        var to = "hourbreakdown";
        this.state.toHourBreakDown.page = to;

        /* callBackData sets the state of the Home component */
        this.props.callBackData(this.state.toHourBreakDown);

        /* dataToHourBreakDown calls passWeatherData in the Home component */
        this.props.dataToHourBreakDown(this.state.toHourBreakDown);

    }

    render() {
        var classToday;
        var classTomorrow;
        var classNextWeek;
        var dayList;
        if (this.state.page == "today") {
            classToday = style.todayOn;
        } else {
            classToday = style.todayOff;
        }
        if (this.state.page == "tomorrow") {
            classTomorrow = style.tomorrowOn;
        } else {
            classTomorrow = style.tomorrowOff;
        }
        if (this.state.page == "nextWeek") {
            classNextWeek = style.nextWeekOn;

            var days = ["Monday", "Tuesday", "Wednesday",
                        "Thursday", "Friday", "Saturday", "Sunday"];

            // wrap around 4 days since we don't have data for all future days
            // we lack 3 days
            dayList = days.map((item, key) => {
                var startDay = this.state.currDay + 2;
                var temps = this.state.temp;
                var real_feels = this.state.real;
                var sources = this.state.imgSrc;
                var numDays = sources.length; // same as real_feels and temps
                var srcStart = 0;
                return (<div className = { week_style.weatherRowDiv }>
                            <p className = { week_style.day }> { days[(startDay + key) % 7] } </p>
                            <img key = { item }
                                 className = { week_style.weekImage }
                                 src ={ sources[(srcStart + key) % numDays] } />
                            <div className = { week_style.degrees }>
                            <span className = { week_style.spanOne }>
                                { temps[(srcStart + key) % numDays] }
                             </span>
                            <span className = { week_style.spanTwo }>
                                { real_feels[(srcStart + key) % numDays] }
                            </span>
                            </div>
                        </div>)
            });

        }
        else {
            classNextWeek = style.nextWeekOff;
        }
        const tempStyles = this.state.temp ? `${style.temperature} ${style.filled}` : style.temperature;


        /* conditional rendering based on what tab has been clicked occur below
           i.e this.state.page != "nextWeek" ?
        */
        return(
            <div class = { style.swoop + " " + this.props.currentTheme.swoopColor }>
                <div>
                    <button class = { classToday } onClick = {() => { this.switchDay("today") }} >Today</button>
                    <button class = { classTomorrow } onClick = {() => { this.switchDay("tomorrow") }} >Tomorrow</button>
                    <button class = { classNextWeek } onClick = {() => { this.switchDay("nextWeek") }}>Next Week</button>
                </div>
                <div class={ style.city }>{ this.state.locate }</div>

                { this.state.page != "nextWeek" ?
                <div>
					 <img class={style.image} src = {this.state.imgSrc} />
				</div> : <div className = { week_style.dayListContainer }>{ dayList } </div> }

                { this.state.page != "nextWeek" ?
                <p><span class={ tempStyles }>{ this.state.temp } </span></p> : null }

                { this.state.page != "nextWeek" ?
                <div class={ style.conditions }>{ this.state.cond }</div> : null }
                {/*{ this.state.page != "nextWeek" ?*/}
                { this.state.page == "today" ?
                <div class = { style.hourBreakDownButtonContainer }>
                    <button class = { style.hourBreakdownButton } onClick={ this.passWeatherData }>Hour Breakdown<span style="color: rgb(247, 199, 36)">  ></span></button>
                </div> :
                <div class = { style.hourBreakDownButtonContainer }>
                    <button class = { style.hourBreakdownButtonInvisible }></button>
                </div>
                }

            </div>
        );
    }
}
