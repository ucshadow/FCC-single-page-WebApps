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
        <Search />
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
        Welcome to my Wikipeda Article Viewer! Click for a random article
      </a>
    </div>
  </div>
);

class Search extends React.Component {
  constructor() {
    super();
    this.state = {data: []};

    this.handleChange = this.handleChange.bind(this);
    this.parseData = this.parseData.bind(this);
    this.changeState = this.changeState.bind(this);
  }

  handleChange(e) {
    if(e.charCode === 13) {
      let term = e.target.value;
      this.getWikiData(term);
    }
  }

  changeState(n) {
    this.setState({data: n})
  }

  getWikiData(t) {
    let out = this.changeState;
    let url = "http://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=9&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=" + t + "&callback=?";
    $.ajax({
      url: url,
      dataType: "json",
      success: function(res) {
        let l = [];
        let pages = res.query.pages;
        for(let i in pages) {
          l.push(pages[i])
        }
        console.log(l);
        out(l);
      }
    });
  }

  parseData() {
    return this.state.data.map((page) => {
      return <SinglePage key={page.pageid} d={page} />
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
        <div  className="result-holder">
          {this.parseData()}
        </div>
      </div>
    )
  }
}

class SinglePage extends React.Component {

  constructor() {
    super()

  }

  render() {
    return (
      <div className="demo-list-action mdl-list single-row">
        <div className="mdl-list__item">
          <span className="mdl-list__item-primary-content">
            {this.props.d.thumbnail ?
              <img src={this.props.d.thumbnail.source} className="material-icons mdl-list__item-avatar" /> :
              <i className="material-icons mdl-list__item-avatar">class</i>}
            <span>{this.props.d.extract}</span>
          </span>
          <a className="mdl-list__item-secondary-action"
             href={"https://en.wikipedia.org/?curid=" + this.props.d.pageid} target="_blank">
            <i className="material-icons">visibility</i>
          </a>
        </div>
      </div>
    )
  }
}


ReactDOM.render(<App />, document.getElementById('app'));