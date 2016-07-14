let soundList = [];
let colors = ["green", "red", "yellow", "blue"];
let winRounds = 20;
let maxSoundTime = 1000;
let disconnectTime = 500;
let speed = 100;
let canClick = true;
let playing = false;
let strict = false;
let index = 0;
let mouseDown = 0;
let audioCtx = new (AudioContext || webkitAudioContext)();

function playerButton(e) {
  return playWebAudio(e, canClick)
}

function playWebAudio(e, check) {
  let color = e.target ? e.target.id : e;
  let freq = 0;
  let inter;
  switch(color) {
    case "green":
      freq = 150;
      break;
    case "red":
      freq = 250;
      break;
    case "yellow":
      freq = 350;
      break;
    case "blue":
      freq = 450;
      break
  }

  if(check) {
    let oscillator = audioCtx.createOscillator();
    oscillator.connect(audioCtx.destination);
    oscillator.type = "triangle";
    oscillator.frequency.value = freq;
    oscillator.start(0);
    document.getElementById(color).className = color + "-";

    if(check) {
      setTimeout(function() {
        oscillator.disconnect();
        document.getElementById(color).className = color;

      }, disconnectTime);
    }

    if(canClick) {
      inter = setInterval(function() {
        if(!mouseDown) {
          oscillator.disconnect();
          document.getElementById(color).className = color;
          clearInterval(inter);
        }
      }, speed)
    }

    if(playing && canClick) {
      playerTurn(e);
    }

    setTimeout(function() {
      oscillator.disconnect();
    }, maxSoundTime)
  }
}

let playPromise = function(element, timeout) {
  return new Promise((resolve) => {
    setTimeout(function() {
      playWebAudio(element, true);
      resolve(element)
    }, timeout)
  })
};

function addRandomColorToMemory() {
  let rnd = Math.floor(Math.random() * 4);
  soundList.push(colors[rnd]);
}

function playSounds(add) {
  if(add) {
    addRandomColorToMemory();
  }
  let iProm = soundList.map(function(e, i) {
    canClick = false;
    return playPromise(e, i * 550);
  });
  Promise.all(iProm)
  .then(function(result) {
    console.log(result);
    setTimeout(function() {
      playing = true;
      canClick = true;
      document.getElementById("display").innerHTML = soundList.length.toString();
    }, 550)
  })
  .catch(function(err) {
    console.log("error", err)
  })
}

function goodGuess(playerOption) {
  console.log("good", playerOption, "->", soundList[index]);
  index += 1;
  if(index === soundList.length) {
    if(checkWin()) {
      index = 0;
      return null;
    }
    console.log("adding one more sound");
    index = 0;
    setTimeout(function() {
      playSounds(true);
    }, 1000);
  }
}

function badGuess(playerOption) {
  console.log("wrong", playerOption, "->", soundList[index]);
  document.getElementById("display").innerHTML = "WRONG!";
  index = 0;
  if(strict) {
    console.log('restarting...');
    soundList = [];
    gameLoop();
    return null;
  }
  canClick = false;
  setTimeout(function() {
    document.getElementById("display").innerHTML = soundList.length.toString();
    playSounds();
  }, 1000);
}

function playerTurn(e) {
  let playerOption = e.target ? e.target.id : null;
  if(playerOption === soundList[index]) {
    goodGuess(playerOption)
  }
  else if(playerOption) {
    badGuess(playerOption)
  }
}

function checkWin() {
  if(winRounds === soundList.length) {
    document.getElementById("display").innerHTML = "YOU WON!";
    soundList = [];
    setTimeout(function() {
      playSounds(true);
    }, 3000);
    return true;
  }
}

function strictModeToggle() {
  if(!playing) {
    if(strict) {
      strict = false;
      document.getElementById("strict").style.color = "#5d5d5d"
    } else {
      strict = true;
      document.getElementById("strict").style.color = "#7B1FA2"
    }
  }
}

function gameLoop() {
  setTimeout(function() {
    playSounds(true)
  }, 1000);
}

function startGame() {
  document.getElementById("display").innerHTML = strict ? "STRICT" : "NORMAL";
  document.getElementById("start").innerHTML = "RESTART";
  index = 0;
  soundList = [];
  if(!strict) {
    document.getElementById("strict").style.color = "#5d5d5d";
    document.getElementById("strict").disabled = true;
  }
  gameLoop();
}

window.onload = function() {

  document.body.onmousedown = function() {
    ++mouseDown;
  };
  document.body.onmouseup = function() {
    --mouseDown;
  };

  document.getElementById("green").addEventListener("mousedown", playerButton, false);
  document.getElementById("red").addEventListener("mousedown", playerButton, false);
  document.getElementById("yellow").addEventListener("mousedown", playerButton, false);
  document.getElementById("blue").addEventListener("mousedown", playerButton, false);
  document.getElementById("start").addEventListener("click", startGame, false);
  document.getElementById("strict").addEventListener("click", strictModeToggle, false);

};