class MapGenerator {

  constructor() {
    this.height = 800;
    this.width = 1280;
    this.roomMaxHeight = 7;
    this.roomMaxWidth = 7;
    this.roomMinHeight = 3;
    this.roomMinWidth = 3;
    this.maxRooms = 18;
    this.tileSize = 32;
    this.allTiles = [];

    this.populateWithDefaultTiles();

  }

  getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  populateWithDefaultTiles() {
    for (let x = 0; x <= this.width; x += this.tileSize) {
      for (let y = 0; y <= this.height; y += this.tileSize) {
        this.allTiles.push({left: x, top: y, type: "room", className: "room"})
      }
    }
    this.addRooms();
  }

  growDirection(node) {
    let res = "NW";
    if(node.left > 640 && node.top < 380) {res = "SW"}
    else if(node.left > 640 && node.top > 380) {res = "NW"}
    else if(node.left < 640 && node.top < 380) {res = "SE"}
    else if(node.left < 640 && node.top > 380) {res = "NE"}
    return res;
  }

  changeTile(arr, to) {
    let all = this.allTiles;
    arr.forEach(function(t) {
      all.forEach(function(f) {
        if(f.left === t.left && f.top === t.top) {
          f.type = to;
          f.className = "wall";
        }
      })
    })
  }

  addRooms() {
    for(let i = 0; i < this.maxRooms; i++) {
      let rnd = this.getRandom(200, this.allTiles.length - 200);
      let node = this.allTiles[rnd];
      let dir = this.growDirection(node);
      let neighbours = [];
      let rndWidth = this.getRandom(this.roomMinWidth, this.roomMaxWidth);
      let rndHeight = this.getRandom(this.roomMinHeight, this.roomMaxHeight);
      if(dir === "NW") {
        for (let w = node.left; w > node.left - (rndWidth * this.tileSize); w -= this.tileSize) {
          for (let h = node.top; h > node.top - (rndHeight * this.tileSize); h -= this.tileSize) {
            neighbours.push({left: w, top: h, type: "room"})
          }
        }
      }
      else if(dir === "SW") {
        for (let w = node.left; w > node.left - (rndWidth * this.tileSize); w -= this.tileSize) {
          for (let h = node.top; h < node.top + (rndHeight * this.tileSize); h += this.tileSize) {
            neighbours.push({left: w, top: h, type: "room"})
          }
        }
      }
      else if(dir === "SE") {
        for (let w = node.left; w < node.left + (rndWidth * this.tileSize); w += this.tileSize) {
          for (let h = node.top; h < node.top + (rndHeight * this.tileSize); h += this.tileSize) {
            neighbours.push({left: w, top: h, type: "room"})
          }
        }
      }
      else if(dir === "NE") {
        for (let w = node.left; w < node.left + (rndWidth * this.tileSize); w += this.tileSize) {
          for (let h = node.top; h > node.top - (rndHeight * this.tileSize); h -= this.tileSize) {
            neighbours.push({left: w, top: h, type: "room"})
          }
        }
      }
      this.changeTile(neighbours, "wall")
    }
    this.addPlayer()
  }

  addPlayer() {
    let check = true;
    while(check) {
      let rnd = this.getRandom(1, this.allTiles.length);
      if(this.allTiles[rnd].type === "room") {
        this.allTiles.push({left: this.allTiles[rnd].left, top: this.allTiles[rnd].top, type: "player"});
        check = false;
      }
    }
  }

}


class Main extends React.Component {

  constructor() {
    super();
    this.map_ = new MapGenerator();
    this.state = {m: this.map_.allTiles};

    this.renderMap = this.renderMap.bind(this);
    this.addFog = this.addFog.bind(this);
  }

  renderMap() {
    return this.state.m.map((tile) => {
      if(tile.type === "wall") {
        return <WallTile key={Math.random()} d={tile} size={this.map_.tileSize} />
      }
      else if(tile.type === "room") {
        return <RoomTile key={Math.random()} d={tile} size={this.map_.tileSize} />
      }
      else if(tile.type === "player") {
        return <Player key={Math.random()} d={tile} size={this.map_.tileSize} />
      }
    })
  }

  addFog() {
    return this.state.m.map((tile) => {
      return <AddFog key={Math.random()} d={tile} size={this.map_.tileSize} />
    })
  }

  render() {
    return (
      <div className="container">
        Hi from main
        {this.renderMap()}
        {this.addFog()}
      </div>
    )
  }
}

class Player extends React.Component {

  constructor(props) {
    super(props);

    document.addEventListener("keydown", this.handleKeyDown.bind(this), false);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.updateStyleState = this.updateStyleState.bind(this);
    this.addFog = this.addFog.bind(this);
    this.getNear = this.getNear.bind(this);

    this.status = {
      position: "absolute",
      top: this.props.d.top,
      left: this.props.d.left,
      background: "pink",
      height: this.props.size,
      width: this.props.size,
      zIndex: 100
    };



    this.state = {style: this.status, d: {}, fog: {}, near: {}}
  }

  componentDidMount() {
    let left = document.getElementById(this.state.style.top + "-" + (this.state.style.left - 32) + "-fog");
    left.style.zIndex -= 2;
    let right = document.getElementById(this.state.style.top + "-" + (this.state.style.left + 32) + "-fog");
    right.style.zIndex -= 2;
    let up = document.getElementById((this.state.style.top - 32) + "-" + this.state.style.left + "-fog");
    up.style.zIndex -= 2;
    let down = document.getElementById(this.state.style.top + 32 + "-" + this.state.style.left + "-fog");
    down.style.zIndex -= 2;

    let leftNear = document.getElementById(this.state.style.top + "-" + (this.state.style.left - 32));
    let rightNear = document.getElementById(this.state.style.top + "-" + (this.state.style.left + 32));
    let upNear = document.getElementById((this.state.style.top - 32) + "-" + this.state.style.left);
    let downNear = document.getElementById(this.state.style.top + 32 + "-" + this.state.style.left);

    this.setState({fog: {left: left, right: right, up: up, down: down},
                  near: {left: leftNear, right: rightNear, up: upNear, down: downNear}});

    let underPlayer = document.getElementById(this.props.d.top + "-" + this.props.d.left + "-fog");
    underPlayer.outerHTML = "";

  }

  addFog(left, right, up, down) {
    if(left.className.indexOf("fog") < 0) {left.className += " fog";}
    if(right.className.indexOf("fog") < 0) {right.className += " fog";}
    if(up.className.indexOf("fog") < 0) {up.className += " fog";}
    if(down.className.indexOf("fog") < 0) {down.className += " fog";}
  }

  updateStyleState(object, value, newValue) {
    let s = this.state;
    let target = s[object];
    target[value] += newValue;
    this.setState(s);
    let f = this.getNear();
    this.setState({fog: f[0], near: f[1]});
    //this.addFog(this.state.fog.left, this.state.fog.right, this.state.fog.up, this.state.fog.down)
  }

  handleKeyDown(e) {
    switch(e.key) {
      case "w": if(this.state.near.up.className !== "wall")
      {this.updateStyleState("style", "top", -32)} console.log(this.state); break;
      case "s": if(this.state.near.down.className !== "wall")
      {this.updateStyleState("style", "top", 32)} break;
      case "a": if(this.state.near.left.className !== "wall")
      {this.updateStyleState("style", "left", -32)} break;
      case "d": if(this.state.near.right.className !== "wall")
      {this.updateStyleState("style", "left", 32)} break;
    }
  }

  getNear() {
    let left = document.getElementById(this.state.style.top + "-" + (this.state.style.left - 32) + "-fog");
    left.style.zIndex -= 2;
    let right = document.getElementById(this.state.style.top + "-" + (this.state.style.left + 32) + "-fog");
    right.style.zIndex -= 2;
    let up = document.getElementById((this.state.style.top - 32) + "-" + this.state.style.left + "-fog");
    up.style.zIndex -= 2;
    let down = document.getElementById(this.state.style.top + 32 + "-" + this.state.style.left + "-fog");
    down.style.zIndex -= 2;

    let leftNear = document.getElementById(this.state.style.top + "-" + (this.state.style.left - 32));
    let rightNear = document.getElementById(this.state.style.top + "-" + (this.state.style.left + 32));
    let upNear = document.getElementById((this.state.style.top - 32) + "-" + this.state.style.left);
    let downNear = document.getElementById(this.state.style.top + 32 + "-" + this.state.style.left);

    return [{left: left, right: right, up: up, down: down}, {left: leftNear, right: rightNear, up: upNear, down: downNear}]
  }

  render() {
    let style2 = Object.assign({}, this.state.style);
    return <div className="player" style={style2} id="player"> </div>
  }

}


class WallTile extends React.Component {

  constructor(props) {
    super(props);
    this.style = {
      position: "absolute",
      top: this.props.d.top,
      left: this.props.d.left,
      background: "gray",
      height: this.props.size,
      width: this.props.size,
      zIndex: 98
    }
  }

  render() {
    return <div className={this.props.d.className} style={this.style} id={this.props.d.top + "-" + this.props.d.left}> </div>
  }
}

class RoomTile extends React.Component {

  constructor(props) {
    super(props);
    this.style = {
      position: "absolute",
      top: this.props.d.top,
      left: this.props.d.left,
      background: "#10231f",
      height: this.props.size,
      width: this.props.size,
      zIndex: 98
    }
  }

  render() {
    return <div className={this.props.d.className} style={this.style} id={this.props.d.top + "-" + this.props.d.left}> </div>
  }
}

class AddFog extends React.Component {

  constructor(props) {
    super(props);
    this.style = {
      position: "absolute",
      top: this.props.d.top,
      left: this.props.d.left,
      background: "black",
      opacity: 1,
      height: this.props.size,
      width: this.props.size,
      zIndex: 99
    }
  }

  render() {
    return <div className={"fog_"} style={this.style} id={this.props.d.top + "-" + this.props.d.left + "-fog"}> </div>
  }
}


ReactDOM.render(
  <Main />,
  document.getElementById('mount')
);