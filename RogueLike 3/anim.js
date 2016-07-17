class MapGenerator {

  constructor(level) {
    this.level = level;
    this.height = 800;
    this.width = 1280;
    this.roomMaxHeight = 7;
    this.roomMaxWidth = 7;
    this.roomMinHeight = 3;
    this.roomMinWidth = 3;
    this.maxRooms = 18;
    this.tileSize = 24;
    this.allTiles = [];
    this.maxEnemies = 12 + this.level;
    this.minEnemies = 5 + this.level;
    this.bossLevel = 4;


    this.weapons = [
      {name: "Pointed Stick", luck: 5, weaponDamage: 6, life: 10},
      {name: "Giant Rock", luck: 7, weaponDamage: 7, life: 20},
      {name: "Rusty Sword", luck: 10, weaponDamage: 10, life: 30},
      {name: "Blunt Hammer", luck: 15, weaponDamage: 15, life: 40}
    ];

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
    this.addDoorToNextLevel();
    this.addWeapon();
    this.addLife();
    this.addBoss();
  }

  addPlayer() {
    let check = true;
    while (check) {
      let rnd = this.getRandom(1, this.allTiles.length);
      if (this.allTiles[rnd].type === "room") {
        this.allTiles.push({
          left: this.allTiles[rnd].left, top: this.allTiles[rnd].top, type: "player",
          stats: {life: 100, maxLife: 100, power: 10, luck: 10, weapon: "fist", xp: 0, level: 1, weaponDamage: 5}
        });
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
        if (this.allTiles[rnd].type === "room" && this.allTiles[rnd].type !== "enemy") {
          this.allTiles[rnd] = {
            left: this.allTiles[rnd].left,
            top: this.allTiles[rnd].top,
            type: "enemy",
            className: "enemy",
            id: this.allTiles[rnd].top + "-" + this.allTiles[rnd].left,
            stats: {
              life: (this.getRandom(20, 40)) * this.level,
              power: this.getRandom(3, 7) + (this.level * 2),
              xp: 20 * this.level
            }
          };
          check = false;
        }
      }
    }
  }

  addWeapon() {
    let check = true;
    while (check) {
      let rnd = this.getRandom(1, this.allTiles.length);
      if (this.allTiles[rnd].type === "room" && this.allTiles[rnd].type !== "enemy") {
        this.allTiles[rnd] = {
          left: this.allTiles[rnd].left,
          top: this.allTiles[rnd].top,
          type: "weapon",
          className: "weapon",
          id: this.allTiles[rnd].top + "-" + this.allTiles[rnd].left,
          stats: {
            life: this.weapons[this.level - 1].life || 0,
            weaponDamage: this.weapons[this.level - 1].weaponDamage || 0,
            luck: this.weapons[this.level - 1].luck || 0,
            weapon: this.weapons[this.level - 1].name
          }
        };
        check = false;
      }
    }
  }

  addLife() {
    let check = true;
    while (check) {
      let rnd = this.getRandom(1, this.allTiles.length);
      if (this.allTiles[rnd].type === "room" && this.allTiles[rnd].type !== "enemy"
        && this.allTiles[rnd].type !== "weapon" && this.allTiles[rnd].type !== "life") {
        this.allTiles[rnd] = {
          left: this.allTiles[rnd].left,
          top: this.allTiles[rnd].top,
          type: "life",
          className: "life",
          id: this.allTiles[rnd].top + "-" + this.allTiles[rnd].left,
          stats: {
            life: 30 * this.level / 2
          }
        };
        check = false;
      }
    }
  }

  addBoss() {
    if (this.level === this.bossLevel) {
      let check = true;
      while (check) {
        let rnd = this.getRandom(1, this.allTiles.length);
        if (this.allTiles[rnd].type === "room" && this.allTiles[rnd].type !== "enemy"
          && this.allTiles[rnd].type !== "weapon" && this.allTiles[rnd].type !== "life") {
          this.allTiles[rnd] = {
            left: this.allTiles[rnd].left,
            top: this.allTiles[rnd].top,
            type: "boss",
            className: "boss",
            id: this.allTiles[rnd].top + "-" + this.allTiles[rnd].left,
            stats: {
              life: 999,
              power: 60
            }
          };
          check = false;
        }
      }
    }
  }

  addDoorToNextLevel() {
    this.allTiles[0] = {left: 0, top: 0, id: "0-0", className: "enemy", type: "enemy", stats: {life: this.level}}
  }

}

function prettySort(arr) {
  let world = [];
  let enemies = [];
  let player;
  let weapon;
  let life;
  let boss = null;
  arr.forEach(function (e) {
    if (e.type === "room" || e.type === "wall") {
      world.push(e);
    }
    else if (e.type === "enemy") {
      enemies.push(e)
    }
    else if (e.type === "player") {
      player = e;
    }
    else if (e.type === "life") {
      life = e;
    }
    else if (e.type === "boss") {
      boss = e;
    }
    else {
      weapon = e;
    }
  });
  return {world: world, enemies: enemies, player: player, weapon: weapon, life: life, boss: boss}
}


class Main extends React.Component {

  constructor() {
    super();
    this.data = new MapGenerator(1);
    this.state = prettySort(this.data.allTiles);

    this.renderMap = this.renderMap.bind(this);
    this.addFog = this.addFog.bind(this);
    this.changeLevel = this.changeLevel.bind(this);
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
    return this.data.allTiles.map((tile) => {
      if (tile.type !== "player") {
        return <AddFog key={Math.random()} d={tile} size={this.data.tileSize}/>
      }
    })
  }

  changeLevel(nextLevel) {
    this.setState(nextLevel);
  }

  render() {
    console.log("main state", this.state);
    return (
      <div className="container">
        Hi from main/
        {this.renderMap()}
        <Game d={{
        enemies: this.state.enemies,
        player: this.state.player,
        weapon: this.state.weapon,
        life: this.state.life,
        boss: this.state.boss,
        tileSize: this.data.tileSize,
        near: [],
        fog: []}}
              change={this.changeLevel}/>
        {this.addFog()}
      </div>
    )
  }
}


class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.props.d;

    console.log(this.props.d);

    this.updateState = this.updateState.bind(this);
    this.renderEnemies = this.renderEnemies.bind(this);
    this.getNear = this.getNear.bind(this);
    this.duel = this.duel.bind(this);
    this.changeLevel = this.changeLevel.bind(this);
    this.pickWeapon = this.pickWeapon.bind(this);
    this.pickLife = this.pickLife.bind(this);
    this.remainingEnemies = this.remainingEnemies.bind(this);
    this.finalFight = this.finalFight.bind(this);
    this.youDied = this.youDied.bind(this);
  }

  componentDidMount() {
    this.getNear();
  }

  changeLevel() {
    let player = this.state.player;
    let newLevel = prettySort(new MapGenerator(this.state.enemies[0].stats.life + 1).allTiles);
    let newPlayerPosition = newLevel.player;
    newLevel.player = player;
    newLevel.player.top = newPlayerPosition.top;
    newLevel.player.left = newPlayerPosition.left;
    this.props.change(newLevel);
    this.setState({
      enemies: newLevel.enemies,
      player: newLevel.player,
      weapon: newLevel.weapon,
      life: newLevel.life,
      boss: newLevel.boss,
      tileSize: this.props.d.tileSize,
      near: []
    });
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
      return <Enemy key={Math.random()} d={enemy} size={this.props.d.tileSize}/>
    })
  }

  getNear() {
    let leftNear = document.getElementById(this.state.player.top + "-" + (this.state.player.left - this.state.tileSize));
    let rightNear = document.getElementById(this.state.player.top + "-" + (this.state.player.left + this.state.tileSize));
    let upNear = document.getElementById((this.state.player.top - this.state.tileSize) + "-" + this.state.player.left);
    let downNear = document.getElementById(this.state.player.top + this.state.tileSize + "-" + this.state.player.left);

    let t = [];
    let player = this.state.player;
    let fogTileNumber = 2;
    let size = this.state.tileSize;

    for (let x = player.top - size * fogTileNumber; x <= player.top + size * fogTileNumber; x += size) {
      for (let y = player.left - size * fogTileNumber; y <= player.left + size * fogTileNumber; y += size) {
        let f = document.getElementById(x + "-" + y + "-fog");
        t.push(f);
      }
    }
    this.setState({near: {up: upNear, down: downNear, left: leftNear, right: rightNear}, fog: t})
  }

  pickWeapon(direction) {
    let player = this.state.player;
    let weapon = this.state.weapon;
    let near = this.state.near;

    player.stats.maxLife += weapon.stats.life;
    player.stats.luck += weapon.stats.luck;
    player.stats.weaponDamage += weapon.stats.weaponDamage;
    player.stats.weapon = weapon.stats.weapon;

    weapon.className = "room";
    near[direction].className = "room";
    this.setState({player: player, near: near})
  }

  pickLife(direction) {
    let player = this.state.player;
    let life = this.state.life;
    let near = this.state.near;

    if (player.stats.maxLife - player.stats.life <= life.stats.life) {
      life.stats.life = player.stats.maxLife - player.stats.life;
    }

    player.stats.life += life.stats.life;

    life.className = "room";
    near[direction].className = "room";
    this.setState({player: player, near: near})
  }

  randomizeDamage(dmg) {
    return dmg + Math.floor(Math.random() * (dmg / 4)) + 1;
  }

  youDied() {
    console.log("YOU DIED!")
  }

  finalFight() {

    // toDo Update state after fight -- !! --

    let enemy = this.state.boss;
    let player = this.state.player;
    let critChance = this.willPlayerCrit(player.stats.luck);
    enemy.stats.life -= Math.round(this.randomizeDamage(player.stats.power + player.stats.weaponDamage) * critChance);
    player.stats.life -= this.randomizeDamage(enemy.stats.power);
    if (enemy.stats.life <= 0) {
      console.log("YOU WON!")
    }
    if (player.stats.life <= 0) {
      return this.youDied();
    }
  }

  duel(e, direction, type) {
    if (type === "weapon") {
      return this.pickWeapon(direction);
    }
    else if (type === "life") {
      return this.pickLife(direction);
    }
    else if (type === "boss") {
      return this.finalFight();
    }
    if (e === "0-0") {
      this.changeLevel();
    } else {
      let enemyIndex = null;
      let allEnemies = this.state.enemies;
      let near = this.state.near;
      let enemy = allEnemies.find(function (element, index) {
        enemyIndex = index;
        return element.id === e
      });
      let enemyXpValue = enemy.stats.xp;
      let player = this.state.player;
      let critChance = this.willPlayerCrit(player.stats.luck);
      enemy.stats.life -= Math.round(this.randomizeDamage(player.stats.power + player.stats.weaponDamage) * critChance);
      player.stats.life -= this.randomizeDamage(enemy.stats.power);
      if (enemy.stats.life <= 0) {
        enemy.className = "room";
        near[direction].className = "room";
        player.stats.xp += enemyXpValue;
        if (player.stats.xp >= 100 * player.stats.level) {
          player = this.levelUp(player)
        }
      }
      allEnemies[enemyIndex] = enemy;
      this.setState({player: player, enemies: allEnemies, near: near});
    }
  }

  levelUp(player) {
    let remainingXp = player.stats.xp - 100 * player.stats.level;
    player.stats.level += 1;
    player.stats.xp = remainingXp;
    player.stats.power += 2 * player.stats.level;
    player.stats.luck += 3 * player.stats.level;
    player.stats.maxLife += 20 * player.stats.level;
    player.stats.life = player.stats.maxLife;
    return player;
  }

  willPlayerCrit(chance) {
    let rnd = Math.floor((Math.random() * 100) + 1);
    return (rnd <= chance ? 1.5 : 1);
  }

  remainingEnemies() {
    let res = 0;
    this.state.enemies.forEach(function (e) {
      if (e.className === "enemy") {
        res += 1
      }
    });
    return res;
  }

  render() {
    return (
      <div>
        <HandleMovement press={this.updateState} player={this.state.player}
                        near={this.state.near}
                        duel={this.duel}
                        fog={this.state.fog}
                        tileSize={this.state.tileSize}/>
        <Player key={Math.random()} d={this.state.player} size={this.props.d.tileSize}/>
        {this.renderEnemies()}
        <Weapon d={this.state.weapon} size={this.props.d.tileSize}/>
        <Life d={this.state.life} size={this.props.d.tileSize}/>
        <Boss d={this.state.boss} size={this.props.d.tileSize}/>
        <div className="status">
          Map Level: {this.state.enemies[0].stats.life},
          Hero Level: {this.state.player.stats.level},
          XP: {this.state.player.stats.xp} / {100 * this.state.player.stats.level} {" "}
          Weapon: {this.state.player.stats.weapon},
          Enemies: {this.remainingEnemies()}
        </div>
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
      <div className="player" style={this.state.style} id="player">
        <div className="enemy-info" style={{height: this.props.size, width: this.props.size}}>
          <span className="enemy-hp">
            {this.props.d.stats.life}
          </span>
          <span className="enemy-power">
            {this.props.d.stats.power + this.props.d.stats.weaponDamage}
          </span>
        </div>
      </div>
    )
  }

}


class HandleMovement extends React.Component {

  constructor(props) {
    super(props);

    this.removeFog = this.removeFog.bind(this);

    window.addEventListener("keydown", this.handleKeyDown.bind(this), false);
  }

  removeFog() {
    if (this.props.fog.length >= 1) {
      this.props.fog.forEach(function (e) {
        if (e) {
          e.style.zIndex -= 2;
        }
      })
    }
  }

  handleKeyDown(e) {
    e.preventDefault();
    switch (e.key) {

      case "w":
        if (this.props.near.up && this.props.near.up.className !== "wall") {
          if (this.props.near.up.className === "room") {
            this.props.press("player", "top", -this.props.tileSize)
          }
          else {
            let id = this.props.near.up.id;
            this.props.duel(id, "up", this.props.near.up.className);
          }
        }
        break;
      case "s":
        if (this.props.near.down && this.props.near.down.className !== "wall") {
          if (this.props.near.down.className === "room") {
            this.props.press("player", "top", this.props.tileSize)
          }
          else {
            let id = this.props.near.down.id;
            this.props.duel(id, "down", this.props.near.down.className);
          }
        }
        break;
      case "a":
        if (this.props.near.left && this.props.near.left.className !== "wall") {
          if (this.props.near.left.className === "room") {
            this.props.press("player", "left", -this.props.tileSize)
          }
          else {
            let id = this.props.near.left.id;
            this.props.duel(id, "left", this.props.near.left.className);
          }
        }
        break;
      case "d":
        if (this.props.near.right && this.props.near.right.className !== "wall") {
          if (this.props.near.right.className === "room") {
            this.props.press("player", "left", this.props.tileSize)
          }
          else {
            let id = this.props.near.right.id;
            this.props.duel(id, "right", this.props.near.right.className);
          }
        }
        break;
    }
  }

  render() {
    this.removeFog();
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

  render() {
    let alive = {
      position: "absolute",
      top: this.props.d.top,
      left: this.props.d.left,
      background: "orange",
      height: this.props.size,
      width: this.props.size,
      zIndex: 98
    };

    let dead = {
      position: "absolute",
      top: this.props.d.top,
      left: this.props.d.left,
      background: "#10231f",
      height: this.props.size,
      width: this.props.size,
      zIndex: 98
    };

    let door = {
      position: "absolute",
      top: this.props.d.top,
      left: this.props.d.left,
      background: "purple",
      height: this.props.size,
      width: this.props.size,
      zIndex: 98,
      color: "white"
    };

    return (
      <div className={this.props.d.className}
           style={this.props.d.id === "0-0" ? door : this.props.d.stats.life > 0 ? alive : dead}
           id={this.props.d.id}>
        <div className="enemy-info" style={{height: this.props.size, width: this.props.size}}>
          <span className="enemy-hp">
            {this.props.d.id === "0-0" ?
            "l: " + this.props.d.stats.life :
              this.props.d.stats.life > 0 ? this.props.d.stats.life : null}
          </span>
          <span className="enemy-power">
            {this.props.d.id === "0-0" ?
              null : this.props.d.stats.life > 0 ? this.props.d.stats.power : null}
          </span>
        </div>
      </div>
    )
  }
}

class Weapon extends React.Component {

  render() {
    let style = {
      position: "absolute",
      top: this.props.d.top,
      left: this.props.d.left,
      background: "red",
      height: this.props.size,
      width: this.props.size,
      zIndex: 98
    };

    let dead = {
      position: "absolute",
      top: this.props.d.top,
      left: this.props.d.left,
      background: "#10231f",
      height: this.props.size,
      width: this.props.size,
      zIndex: 98
    };
    return <span className={this.props.d.className}
                 style={this.props.d.className === "weapon" ? style : dead}
                 id={this.props.d.top + "-" + this.props.d.left}>
      <span className="life-info">
        {this.props.d.className === "weapon" ? this.props.d.stats.weaponDamage : null}
      </span>
    </span>
  }
}

class Life extends React.Component {


  render() {
    let style = {
      position: "absolute",
      top: this.props.d.top,
      left: this.props.d.left,
      background: "green",
      height: this.props.size,
      width: this.props.size,
      zIndex: 98
    };

    let dead = {
      position: "absolute",
      top: this.props.d.top,
      left: this.props.d.left,
      background: "#10231f",
      height: this.props.size,
      width: this.props.size,
      zIndex: 98
    };
    return <span className={this.props.d.className}
                 style={this.props.d.className === "life" ? style : dead}
                 id={this.props.d.top + "-" + this.props.d.left}>
      <span className="life-info">
        {this.props.d.className === "life" ? this.props.d.stats.life : null}
      </span>
    </span>
  }
}

class Boss extends React.Component {

  render() {
    if (this.props.d) {
      let alive = {
        position: "absolute",
        top: this.props.d.top,
        left: this.props.d.left,
        background: "yellow",
        height: this.props.size,
        width: this.props.size,
        zIndex: 98
      };

      let dead = {
        position: "absolute",
        top: this.props.d.top,
        left: this.props.d.left,
        background: "#10231f",
        height: this.props.size,
        width: this.props.size,
        zIndex: 98
      };
      return (
        <div className={this.props.d.className}
             style={this.props.d.stats.life > 0 ? alive : dead}
             id={this.props.d.id}>
          <div className="enemy-info" style={{height: this.props.size, width: this.props.size}}>
            <span className="enemy-hp">
              {this.props.d.stats.life > 0 ? this.props.d.stats.life : null}
            </span>
            <span className="enemy-power">
              {this.props.d.stats.life > 0 ? this.props.d.stats.power : null}
            </span>
          </div>
        </div>
      )
    }
    else {
      return null;
    }
  }
}

class AddFog extends React.Component {

  render() {
    let style = {
      position: "absolute",
      top: this.props.d.top,
      left: this.props.d.left,
      background: "black",
      opacity: 0.5,
      height: this.props.size,
      width: this.props.size,
      zIndex: 99
    };
    return <div className={"fog_"} style={style} id={this.props.d.top + "-" + this.props.d.left + "-fog"}></div>
  }
}


ReactDOM.render(
  <Main />,
  document.getElementById('mount')
);