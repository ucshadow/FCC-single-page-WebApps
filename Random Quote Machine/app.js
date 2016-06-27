let quotes = [
  {"Lord Jaraxxus": "Trifling Gnome! Your arrogance will be your undoing! You face Jaraxxus! Eredar Lord of the Burning Legion!"},
  {Ozruk: "Break yourselves upon my body"},
  {"Durumu the Forgotten": "Looks like you couldn't keep up. Pity."},
  {"Arthas, the Lich King": "Here I stand, a lion before the lambs, and they do not fear. They cannot fear."},
  {"Professor Putricide": "Just an ordinary gas cloud. But watch out, because that's no ordinary gas cloud!"},
  {"Yogg-Saron": "I am the lucid dream. The monster in your nightmares. The fiend of a thousand faces! Cower before my true form! Bow down before the god of death"},
  {Thorim: "YOU! I remember you...in the mountains!"},
  {"Shade of Aran": "I am not some simple jester; I AM NIELAS ARAN!"},
  {"Prince Malchezaar": "All realities, all dimensions are open to me"},
  {"Watchkeeper Gargolmar": "HEAL ME, QUICKLY!"},
  {"Sha of Pride": "COME! Face me! Give in to your pride! Show me your...'greatness!'"}
];

class App extends React.Component {

  render() {
    return (
      <div className="main-container">
        <Welcome />
        <Quote />
      </div>
    )
  }
}


const Welcome = props => (

  <div className="demo-card-wide mdl-card mdl-shadow--3dp">
    <div className="mdl-card__title">
      <h2 className="mdl-card__title-text">
        Welcome to my World of Warcraft quote generator. Press the button for a random quote!
      </h2>
    </div>
  </div>
);

class Quote extends React.Component {

  constructor() {
    super();
    this.state = {q: this.getQuote()};
    this.getQuote = this.getQuote.bind(this);
    this.newQuote = this.newQuote.bind(this);
  }

  getQuote() {
    let rnd = Math.floor(Math.random() * quotes.length);
    let q = quotes[rnd];
    let author, quote;
    for(let key in q) {
      author = key;
      quote = q[key];
    }
    return [author, quote];
  }

  newQuote() {
    let tryQuote = this.getQuote();
    while(tryQuote[1] === this.state.q[1]) {
      tryQuote = this.getQuote();
    }
    this.setState({q: tryQuote})
  }

  render() {
    return (
      <div className="demo-card-square mdl-card mdl-shadow--3dp">
        <div className="mdl-card__title mdl-card--expand">
          <h2 className="mdl-card__title-text" id="quote-text">
            {this.state.q[1]}
          </h2>
        </div>
        <div className="mdl-card__supporting-text">
          {this.state.q[0]}
        </div>
        <div className="mdl-card__actions mdl-card--border">
          <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent"
                  onClick={this.newQuote}
          >
            NEW QUOTE
          </button>
          <Tweet quote={this.state.q}/>
        </div>
      </div>
    )
  }
}

class Tweet extends React.Component {

  constructor() {
    super();
    this.sendTweet = this.sendTweet.bind(this);
  }

  sendTweet() {
  }

  render() {
    return (
      <a href={"https://twitter.com/intent/tweet?text=" + this.props.quote[1] + " -- " + this.props.quote[0]} >
        <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
                id="tweet"
                onClick={this.sendTweet}>
          TWEET
        </button>
      </a>
    )
  }
}




ReactDOM.render(<App />, document.getElementById('app'));