class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {pos: []};
    this.getLocation();

    this.mapPos = this.mapPos.bind(this);
    this.changeState = this.changeState.bind(this);
  }

  changeState(s) {
    this.setState({pos: [s]})
  }

  getLocation() {
    let a = this.changeState.bind(this);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, handleError);
    } else {
      handleError()
    }

    function showPosition(p) {
      a(p.coords.latitude + "," + p.coords.longitude);
    }

    function handleError() {
      $.get("http://ipinfo.io", function(response) {
        a(response.loc)
      }, "jsonp");
    }
  }

  mapPos() {
    return this.state.pos.map((p) => {
      return <GetWeather key={p} d={p} />
    })
  }

  render() {
    return (
      <div className="main-container">
        {this.mapPos()}
      </div>
    )
  }
}

class GetWeather extends React.Component {

  constructor(props) {
    super(props);
    this.state = {loc: []};

    this.getWeather = this.getWeather.bind(this);
    this.displayWeather = this.displayWeather.bind(this);
  }

  getWeather() {
    if(this.state.loc.length === 0) {
      let url = "http://api.openweathermap.org/data/2.5/weather?";
      let key = "&units=metric&APPID=9d0f72dd5fb7dd34e656ca611e65145a";
      if(this.props.d.length >=1) {
        let lat = this.props.d.split(",")[0];
        let lon = this.props.d.split(",")[1];
        this.serve = $.get(url + "lat=" + lat + "&lon=" + lon + key, function(response) {
          this.setState({loc: [response]})
        }.bind(this));
      }
    }
  }

  displayWeather() {
    return this.state.loc.map((l) => {
      return <DisplayWeather key={Math.random()} d={l} />
    })
  }

  render() {
    return (
      <div>
        {this.getWeather()}
        {this.displayWeather()}
      </div>
    )
  }
}

class DisplayWeather extends React.Component {

  constructor(props) {
    super(props);
    console.log(this.props.d);

    this.changeBg = this.changeBg.bind(this);
  }

  changeBg() {
    let con = this.props.d.weather[0].icon.substring(0, 2);
    let o = {
      "01": "http://i.imgbox.com/XWVEvHmU.jpg",
      "02": "http://i.imgbox.com/uwNB7sHL.jpg",
      "03": "http://i.imgbox.com/Y8yZvZew.jpg",
      "04": "http://i.imgbox.com/kLXrWGAg.jpg",
      "09": "http://i.imgbox.com/nD3imis8.jpg",
      "10": "http://i.imgbox.com/M6I7VKe0.jpg",
      "11": "http://i.imgbox.com/mr41xwvh.jpg",
      "13": "http://i.imgbox.com/SGxCuIUT.jpg",
      "50": "http://i.imgbox.com/tOAd9JMa.jpg"
    };
    $("body").css("background-image", "url(" + o[con] + ")")
  }

  render() {
    return (
      <div className="container">
        <div className="weather">
          {this.changeBg()}
          <div className="location">
            {this.props.d.name}
          </div>
          <MainData key={Math.random()} d={this.props.d.main} />
          <div className="descriptions">
            <CloudsPercentage key={Math.random()} d={this.props.d.clouds.all} />
            <WeatherDescription key={Math.random()} d={this.props.d.weather[0]} />
            <Wind key={Math.random()} d={this.props.d.wind} />
            {this.props.d.rain ? <Rain key={Math.random()} d={this.props.d.rain} /> : null}
          </div>
        </div>
      </div>
    )
  }

}

class MainData extends React.Component {

  constructor() {
    super();
    this.state = {units: "C"};

    this.allData = this.allData.bind(this);
    this.changeUnits = this.changeUnits.bind(this);
  }

  changeUnits() {
    if(this.state.units === "C") {
      this.setState({units: "F"})
    } else {
      this.setState({units: "C"})
    }
  }

  allData() {
    return (
      <div>
        <div className="single-info">
          <button className="units" onClick={this.changeUnits} >
            {this.state.units === "C" ? Math.round(this.props.d.temp) : Math.round(this.props.d.temp * 9 / 5 + 32)} {this.state.units}
          </button>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="main-data">
        {this.allData()}
      </div>
    )
  }
}

const CloudsPercentage = props => (
  <div className="desc">
    Clouds: {props.d} %
  </div>
);
const Rain = props => (
  <div className="desc">
    Rain Quantity: {Object.keys(props.d)[0]} - {props.d[Object.keys(props.d)[0]]}
  </div>
);
const WeatherDescription = props => (
  <div className="desc">
    {props.d.main}: {props.d.description}
  </div>
);
const Wind = props => (
  <div className="desc">
    Wind: {"deg " + props.d.deg} {" speed " + props.d.speed}
  </div>
);




ReactDOM.render(<App />, document.getElementById('app'));