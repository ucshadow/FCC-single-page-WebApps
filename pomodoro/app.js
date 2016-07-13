$(document).ready(function() {

  let to = 20;
  let from = 100;
  let date = new Date(null);
  let workTime = 25 * 60;
  let pauseTime = 5 * 60;
  let track = workTime;
  let trackPause = pauseTime;
  let running = false;

  let work;
  let pause;

  function red() {
    date = new Date(null);
    let timer = $('.timer');
    $('.green').css('height', from - 80 / workTime + '%');
    date.setSeconds(track);
    timer.text(date.toISOString().substr(14, 5));
    track -= 1;
    from -= 80 / workTime;
    if(from < to) {
      timer.text('');
      clearInterval(work);
      from = 100;
      track = workTime;
      pause = setInterval(green, 1000);
    }
  }

  function green() {
    date = new Date(null);
    let timer = $('.timer');
    $('.green').css('height', to + 80 / pauseTime + '%');
    date.setSeconds(trackPause);
    timer.text(date.toISOString().substr(14, 5));
    trackPause -= 1;
    to += 80 / pauseTime;
    if(to > from) {
      timer.text('');
      to = 20;
      trackPause = pauseTime;
      work = setInterval(red, 1000);
      clearInterval(pause);
    }
  }

  $('#start').on('click', function() {
    if(!running) {
      work = setInterval(red, 1000);
      running = true;
    }
  });

  $('#stop').on('click', function() {
    if(work) {clearInterval(work)}
    if(pause) {clearInterval(pause)}
    $('.green').css('height', '225px');
    $('.timer').text('');
    from = 100;
    to = 20;
    workTime = $('#workTime').text() * 60;
    pauseTime = $('#pauseTime').text() * 60;
    track = workTime;
    trackPause = pauseTime;
    running = false;
  });

  $('#wPlus').on('click', function() {
    if(!running){
      document.getElementById('workTime').innerHTML = (workTime / 60 + 1).toString();
      workTime += 60;
      track = workTime;
    }
  });

  $('#w-').on('click', function() {
    if(!running) {
      if(workTime >= 120) {
        document.getElementById('workTime').innerHTML = (workTime / 60 - 1).toString();
        workTime -= 60;
        track = workTime;
      }
    }

  });

  $('#pPlus').on('click', function() {
    if(!running) {
      document.getElementById('pauseTime').innerHTML = (pauseTime / 60 + 1).toString();
      pauseTime += 60;
      trackPause = pauseTime;
    }
  });

  $('#p-').on('click', function() {
    if(!running) {
      if(pauseTime >= 120) {
        document.getElementById('pauseTime').innerHTML = (pauseTime / 60 - 1).toString();
        pauseTime -= 60;
        trackPause = pauseTime;
      }
    }
  });

});