let streams = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas",
"brunofin", "comster404", "BeyondTheSummit"];
let info = "https://api.twitch.tv/kraken/channels/";
let isLive = "https://api.twitch.tv/kraken/streams/";


class App extends React.Component {

  componentDidMount() {
    componentHandler.upgradeDom();
  }

  componentDidUpdate() {
    componentHandler.upgradeDom();
  }

  render() {
    return (
      <div className="main-container">
        <Welcome />
        <Add />
        <GetStreams />
      </div>
    )
  }
}


const Welcome = props => (

  <div className="demo-card-wide mdl-card mdl-shadow--3dp">
    <div className="mdl-card__title">
      <a className="mdl-card__title-text"
         href="https://en.wikipedia.org/wiki/Special:Random"
         style={{textDecoration: "none"}}
         target="_blank">
        Welcome to my Twitch TV API usage example page
      </a>
    </div>
  </div>
);


class GetStreams extends React.Component {

  constructor() {
    super();

    this.mapStreams = this.mapStreams.bind(this);
  }

  mapStreams() {
    return streams.map((s) => {
      return <SingleStream key={Math.random()} d={s} />
    })
  }

  render() {
    return(
      <ul className="mdl-list">
        {this.mapStreams()}
      </ul>
    )
  }
}

class Add extends React.Component {

  constructor() {
    super();
    this.state = {data: []};

    this.handleChange = this.handleChange.bind(this);
    this.parseData = this.parseData.bind(this);
  }

  handleChange(e) {
    if(e.charCode === 13) {
      let term = e.target.value;
      let currentData = this.state.data;
      currentData.push(term);
      this.setState({data: currentData})
    }
  }

  parseData() {
    return this.state.data.map((s) => {
      return <SingleStream key={Math.random()} d={s} />
    })
  }

  render() {
    return (
      <div>
        <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable" id="search-field">
          <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="search-text">
            <i className="material-icons" style={{color: "#ff4081"}}>search</i>
          </label>
          <div className="mdl-textfield__expandable-holder">
            <input className="mdl-textfield__input" type="text" id="search-text" onKeyPress={this.handleChange} />
            <label className="mdl-textfield__label" htmlFor="sample-expandable">Expandable Input</label>
          </div>
        </div>
        {this.parseData()}
      </div>
    )
  }

}


class SingleStream extends React.Component {

  constructor(props) {
    super(props);
    this.state = {stream: []};

    this.getStream = this.getStream.bind(this);
    this.getStream();
  }

  getStream() {
    let user = this.props.d;
    let request = $.when(
      $.get(info + user), $.get(isLive + user)
    ).then(function(r1, r2) {
      if(r1) {
        this.setState({stream: [r1, r2]});
        console.log(this.state.stream)
      }
    }.bind(this))
  }

  render() {
    return (
      <li className="single-row mdl-list__item">
        <span className="mdl-list__item-primary-content">
          {this.state.stream.length >= 1 ?
          <img className="material-icons  mdl-list__item-avatar" src={this.state.stream[0][0].logo} /> :
          <i className="material-icons  mdl-list__item-avatar">person</i>}
          {this.state.stream.length >= 1 ? this.state.stream[0][0].display_name : this.props.d + " Closed or no account"}
        </span>
        {this.state.stream.length >= 1 ?
          <span class="mdl-list__item-secondary-info">{
            this.state.stream[1][0].stream ?
            this.state.stream[1][0].stream.game + " - " + this.state.stream[1][0].stream.viewers :
              null
          }</span> : null
        }
        {this.state.stream.length >= 1 ?
          <a className="mdl-list__item-secondary-action"
             href={this.state.stream.length >= 1 ? this.state.stream[0][0].url : "#"} target="_blank">
            <i className="material-icons" style={
            this.state.stream[1][0].stream ? {color: "red"} : {color: "black"}
            }>visibility</i>
          </a> : null
        }
      </li>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));