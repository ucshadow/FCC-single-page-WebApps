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
        <Calculator />
      </div>
    )
  }
}


class Calculator extends React.Component {
  
  constructor() {
    super();
    this.state = {total: ""};

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    let allowed = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "+", "*", "/"];
    let t = this.state.total;
    let val = e.target.innerHTML[1];
    let res = document.getElementById("res");
    if(allowed.indexOf(e.target.innerHTML[1])) {
      this.setState({total: t + val})
    }
    console.log(this.state.total);
  }
  
  render() {
    return (
      <div className="calc" >
        <div className="result">
          <h2 className="reh1"  id="res" >{this.state.total}</h2>
        </div>
        <div className="buttons">
          <div className="key" id="clear" onClick={(e) => this.handleClick(e)}> CLR </div>
          <div className="key" id="backspace" onClick={(e) => this.handleClick(e)}> {"<-"} </div>
          <div className="key" id="percent" onClick={(e) => this.handleClick(e)}> % </div>
          <div className="key" id="divide" onClick={(e) => this.handleClick(e)} > / </div>
          <div className="key" id="k7" onClick={(e) => this.handleClick(e)}> 7 </div>
          <div className="key" id="k8" onClick={(e) => this.handleClick(e)}> 8 </div>
          <div className="key" id="k9" onClick={(e) => this.handleClick(e)}> 9 </div>
          <div className="key" id="multiply" onClick={(e) => this.handleClick(e)}> * </div>
          <div className="key" id="k4" onClick={(e) => this.handleClick(e)}> 4 </div>
          <div className="key" id="k5" onClick={(e) => this.handleClick(e)}> 5 </div>
          <div className="key" id="k6" onClick={(e) => this.handleClick(e)}> 6 </div>
          <div className="key" id="minus" onClick={(e) => this.handleClick(e)}> - </div>
          <div className="key" id="k1" onClick={(e) => this.handleClick(e)}> 1 </div>
          <div className="key" id="k2" onClick={(e) => this.handleClick(e)}> 2 </div>
          <div className="key" id="k3" onClick={(e) => this.handleClick(e)}> 3 </div>
          <div className="key" id="eq" onClick={(e) => this.handleClick(e)}> = </div>
          <div className="key" id="k0" onClick={(e) => this.handleClick(e)}> 0 </div>
          <div className="key" id="emp1" onClick={(e) => this.handleClick(e)}> . </div>
          <div className="key" id="emp" onClick={(e) => this.handleClick(e)}>   </div>

        </div>
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


ReactDOM.render(<App />, document.getElementById('app'));