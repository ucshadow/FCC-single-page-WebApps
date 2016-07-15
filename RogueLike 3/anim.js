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
    this.maxEnemies = 8;
    this.minEnemies = 2;

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
    if (node.left > 640 && node.top < 380) {
      res = "SW"
    }
    else if (node.left > 640 && node.top > 380) {
      res = "NW"
    }
    else if (node.left < 640 && node.top < 380) {
      res = "SE"
    }
    else if (node.left < 640 && node.top > 380) {
      res = "NE"
    }
    return res;
  }

  changeTile(arr, to) {
    let all = this.allTiles;
    arr.forEach(function (t) {
      all.forEach(function (f) {
        if (f.left === t.left && f.top === t.top) {
          f.type = to;
          f.className = "wall";
        }
      })
    })
  }

  addRooms() {
    for (let i = 0; i < this.maxRooms; i++) {
      let rnd = this.getRandom(200, this.allTiles.length - 200);
      let node = this.allTiles[rnd];
      let dir = this.growDirection(node);
      let neighbours = [];
      let rndWidth = this.getRandom(this.roomMinWidth, this.roomMaxWidth);
      let rndHeight = this.getRandom(this.roomMinHeight, this.roomMaxHeight);
      if (dir === "NW") {
        for (let w = node.left; w > node.left - (rndWidth * this.tileSize); w -= this.tileSize) {
          for (let h = node.top; h > node.top - (rndHeight * this.tileSize); h -= this.tileSize) {
            neighbours.push({left: w, top: h, type: "room"})
          }
        }
      }
      else if (dir === "SW") {
        for (let w = node.left; w > node.left - (rndWidth * this.tileSize); w -= this.tileSize) {
          for (let h = node.top; h < node.top + (rndHeight * this.tileSize); h += this.tileSize) {
            neighbours.push({left: w, top: h, type: "room"})
          }
        }
      }
      else if (dir === "SE") {
        for (let w = node.left; w < node.left + (rndWidth * this.tileSize); w += this.tileSize) {
          for (let h = node.top; h < node.top + (rndHeight * this.tileSize); h += this.tileSize) {
            neighbours.push({left: w, top: h, type: "room"})
          }
        }
      }
      else if (dir === "NE") {
        for (let w = node.left; w < node.left + (rndWidth * this.tileSize); w += this.tileSize) {
          for (let h = node.top; h > node.top - (rndHeight * this.tileSize); h -= this.tileSize) {
            neighbours.push({left: w, top: h, type: "room"})
          }
        }
      }
      this.changeTile(neighbours, "wall")
    }
    this.addPlayer();
    this.addEnemy();
  }

  addPlayer() {
    let check = true;
    while (check) {
      let rnd = this.getRandom(1, this.allTiles.length);
      if (this.allTiles[rnd].type === "room") {
        this.allTiles.push({left: this.allTiles[rnd].left, top: this.allTiles[rnd].top, type: "player",
        stats: {life: 100, power: 10, luck: 23, weapon: 0}});
        check = false;
      }
    }
  }

  addEnemy() {
    let enemyCount = this.getRandom(this.minEnemies, this.maxEnemies);
    for (let i = 0; i < enemyCount; i++) {
      let check = true;
      while (check) {
        let rnd = this.getRandom(1, this.allTiles.length);
        if (this.allTiles[rnd].type === "room") {
          this.allTiles[rnd] = {
            left: this.allTiles[rnd].left,
            top: this.allTiles[rnd].top,
            type: "enemy",
            className: "enemy",
            id: this.allTiles[rnd].top + "-" + this.allTiles[rnd].left,
            stats: {life: 20, power: 5}
          };
          check = false;
        }
      }
    }
  }

}

function prettySort (arr) {
  let world = [];
  let enemies = [];
  let player;
  arr.forEach(function(e) {
    if(e.type === "room" || e.type === "wall") {
      world.push(e);
    }
    else if(e.type === "enemy") {
      enemies.push(e)
    }
    else if(e.type === "player") {
      player = e;
    }
  });
  return {world: world, enemies: enemies, player: player}
}



class Main extends React.Component {

  constructor() {
    super();
    this.data = new MapGenerator();
    this.state = prettySort(this.data.allTiles);

    this.renderMap = this.renderMap.bind(this);
    this.addFog = this.addFog.bind(this);
  }

  renderMap() {
    return this.state.world.map((tile) => {
      if (tile.type === "wall") {
        return <WallTile key={Math.random()} d={tile} size={this.data.tileSize}/>
      }
      else if (tile.type === "room") {
        return <RoomTile key={Math.random()} d={tile} size={this.data.tileSize}/>
      }
    })
  }

  addFog() {
    return this.state.m.map((tile) => {
      return <AddFog key={Math.random()} d={tile} size={this.data.tileSize}/>
    })
  }

  render() {
    console.log(this.state);
    return (
      <div className="container">
        Hi from main/
        {this.renderMap()}
        <Game d={{enemies: this.state.enemies, player: this.state.player, tileSize: this.data.tileSize, near: []}} />
      </div>
    )
  }
}


class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.props.d;

    this.updateState = this.updateState.bind(this);
    this.renderEnemies = this.renderEnemies.bind(this);
    this.getNear = this.getNear.bind(this);
    this.duel = this.duel.bind(this);
  }

  componentDidMount() {
    this.getNear();
  }

  updateState(key, item, value) {
    let state = this.state;
    state[key][item] += value;
    this.setState(state);
    this.getNear();
  }


  renderEnemies() {
    return this.state.enemies.map((enemy) => {
      return <Enemy key={Math.random()} d={enemy} size={this.props.d.tileSize} />
    })
  }

  getNear() {
    let leftNear = document.getElementById(this.state.player.top + "-" + (this.state.player.left - 32));
    let rightNear = document.getElementById(this.state.player.top + "-" + (this.state.player.left + 32));
    let upNear = document.getElementById((this.state.player.top - 32) + "-" + this.state.player.left);
    let downNear = document.getElementById(this.state.player.top + 32 + "-" + this.state.player.left);
    this.setState({near : {up: upNear, down: downNear, left: leftNear, right: rightNear}})
  }

  duel(e, direction) {
    let enemyIndex = null;
    let allEnemies = this.state.enemies;
    let near = this.state.near;
    let enemy = allEnemies.find(function(element, index) {
      enemyIndex = index;
      return element.id === e
    });
    let player = this.state.player;
    enemy.stats.life -= player.stats.power;
    player.stats.life -= enemy.stats.power;
    if(enemy.stats.life <= 0 ) {
      enemy.className = "room";
      near[direction].className = "room"
    }
    allEnemies[enemyIndex] = enemy;
    this.setState({player: player, enemies: allEnemies, near: near});
  }

  render() {
    return (
      <div>
        <HandleMovement press={this.updateState} player={this.state.player} near={this.state.near} duel={this.duel}/>
        <Player key={Math.random()} d={this.state.player} size={this.props.d.tileSize} />
        {this.renderEnemies()}
      </div>
    )
  }
}

class Player extends React.Component {

  constructor(props) {
    super(props);

    this.style = {
      position: "absolute",
      top: this.props.d.top,
      left: this.props.d.left,
      background: "pink",
      height: this.props.size,
      width: this.props.size,
      zIndex: 100
    };

    this.state = {style: this.style}
  }

  render() {
    return (
      <div className="player" style={this.state.style} id="player"> {this.props.d.stats.life} </div>
    )
  }

}


class HandleMovement extends React.Component {

  constructor(props) {
    super(props);
    window.addEventListener("keydown", this.handleKeyDown.bind(this), false);
  }

  handleKeyDown(e) {

    switch (e.key) {
      case "w":
        if (this.props.near.up.className !== "wall") {
          if(this.props.near.up.className === "enemy") {
            let id = this.props.near.up.id;
            this.props.duel(id, "up");
          } else {
            this.props.press("player", "top", -32)
          }
        }
        break;
      case "s":
        if (this.props.near.down.className !== "wall") {
          if(this.props.near.down.className === "enemy") {
            let id = this.props.near.down.id;
            this.props.duel(id, "down");
          } else {
            this.props.press("player", "top", 32)
          }
        }
        break;
      case "a":
        if (this.props.near.left.className !== "wall") {
          if(this.props.near.left.className === "enemy") {
            let id = this.props.near.left.id;
            this.props.duel(id, "left");
          } else {
            this.props.press("player", "left", -32)
          }
        }
        break;
      case "d":
        if (this.props.near.right.className !== "wall") {
          if(this.props.near.right.className === "enemy") {
            let id = this.props.near.right.id;
            this.props.duel(id, "right");
          } else {
            this.props.press("player", "left", 32)
          }
        }
        break;
    }
  }

  render() {
    return null;
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

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <span className={this.props.d.className} style={this.style}
                id={this.props.d.top + "-" + this.props.d.left}> </span>
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
    return <span className={this.props.d.className} style={this.style}
                id={this.props.d.top + "-" + this.props.d.left}> </span>
  }
}

class Enemy extends React.Component {

  constructor(props) {
    super(props);
    this.alive = {
      position: "absolute",
      top: this.props.d.top,
      left: this.props.d.left,
      background: "orange",
      height: this.props.size,
      width: this.props.size,
      zIndex: 98
    };

    this.dead = {
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
    return <div className={this.props.d.className}
                style={this.props.d.stats.life > 0 ? this.alive : this.dead}
                id={this.props.d.id}>
      {this.props.d.stats.life > 0 ? this.props.d.stats.life : null}</div>
  }
}


ReactDOM.render(
  <Main />,
  document.getElementById('mount')
);