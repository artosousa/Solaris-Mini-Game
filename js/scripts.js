const wrapper = document.getElementById('wrapper');
const restartLink = document.getElementById('restart');
const anim = document.querySelector('.pot');
const counter = document.getElementById('counter');
const marker = document.getElementById('marker');
const startBtn = document.getElementById('start');
const gameDisp = document.getElementById('game');
const endMessage = document.getElementById('message');
const messageCopy = document.getElementById('message-copy');
const logo = document.getElementById('logo');
const firstLogo = document.getElementById('first-logo');
const secondLogo = document.getElementById('second-logo');
const thirdLogo = document.getElementById('third-logo');
const display = document.getElementById('time');
const clicksNumber = document.getElementById('click-number');
const attemptNumber = document.getElementById('attempts-number');
const shutter = document.getElementById('share');
const points = document.querySelectorAll('.point');
const totalHacks = document.getElementById('total-hacks');

let disabled = false;

let attempts = 0;
let clicks = 0;

let timerInt = null;
let fiveMinutes = 60 / 7.5 ;

function getPositions(elem) {
  const left = elem.offsetLeft;
  const width = elem.offsetWidth;
  return [left, left + width];
}

function comparePositions(p1, p2) {
  const r1 = p1[0] < p2[0] ? p1 : p2;
  const r2 = p1[0] < p2[0] ? p2 : p1;
  return r1[1] > r2[0] || r1[0] === r2[0];
}

function overlaps(a, b) {
  const pos1 = getPositions(a);
  const pos2 = getPositions(b);
  return comparePositions(pos1, pos2);
}

function setCountAndAnimation() {
  const seconds = animDur + 's';
  anim.style.WebkitAnimationDuration = seconds;
  anim.style.animationDuration = seconds;
}

function resetScore(){
  for (var i = 0; i < points.length; i++) {
    points[i].classList.remove('fill')
  }
}

function checkHit(event) {
  if(!disabled){
    clicks++;
    clicksNumber.innerHTML =  clicks;
    
    if (overlaps(marker, anim)) {
      animDur = animDur - 0.5;
      count++;

      anim.classList.add('success');
      setTimeout(function(){
        anim.classList.remove('success');
      },100);
      setCountAndAnimation();
      changeMarkerPos();

      switch(count)
      {
        case 1: 
          firstPoint.classList.add("fill");
          break;
        case 2:
          secondPoint.classList.add("fill");
          break;
        case 3:
          thirdPoint.classList.add("fill");
          endGame(false);
          break;
        default:
          break;
      }
    }else{
      anim.classList.add('failed');
      setTimeout(function(){
        anim.classList.remove('failed');
      },100);
    }

    disabled = true;
    setTimeout(function(){
      disabled = false;
    },800);
  }
}

let count;
let animDur;

function resizeLogo(){
  logo.classList.add("logo-scale-active");
  logo.addEventListener("transitionend", startGame());

}

function checkKeyPressed(e) {
  if (e.keyCode == "32") {
    checkHit();
  }
}

function startGame() {
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    animDur = 2;
  }else{
    animDur = 1.5;
  }
  if(navigator.appVersion.indexOf("Edge") != -1){
    animDur = 0.85;
  }

  attempts++;

  let getContributions = getCookie('totalContribution') / maxContribution * 100;
  hackBar.style.width = getContributions + '%';

  clicksNumber.innerHTML =  clicks;
  attemptNumber.innerHTML =  attempts;

  startBtn.style.display = 'none';
  
  startTimer(fiveMinutes, display);

  setTimeout(function(){
    count = 0;
    
    setCountAndAnimation();
    changeMarkerPos();
    resetScore();

    totalHacks.style.marginTop = "0px";
    totalHacks.classList.remove('hide');

    endMessage.style.display = 'none';
    gameDisp.style.display = 'block';
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      document.addEventListener('touchstart', checkHit);
    }else{
      document.addEventListener('mousedown', checkHit);
      document.addEventListener('keypress', checkKeyPressed);
    }
  }, 500);

}

function endGame(gameOver) {
  if(!gameOver){
    if(attempts < 2){
      messageCopy.innerHTML = clicks + " clicks to hack the jammer with " + display.textContent + " seconds remaing & it took you " + attempts + " ATTEMPT";
    }else{
      messageCopy.innerHTML = clicks + " clicks to hack the jammer with " + display.textContent + " seconds remaing & it took you " + attempts + " ATTEMPTS";
    }

    attempts = 0;
    clicks = 0;

    completions++;
    setCookie('totalContribution', completions, 31);

  } else {
    messageCopy.innerHTML = "OH NO, YOU RAN OUT OF TIME";
  }

  totalHacks.style.marginTop = "-140px";
  endMessage.style.display = 'block';
  gameDisp.style.display = 'none';

  clearInterval(timerInt);
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    document.removeEventListener('touchstart', checkHit);
  }else{
    document.removeEventListener('mousedown', checkHit);
    document.removeEventListener('keypress', checkKeyPressed);
  }
  
}

function changeMarkerPos() {
  const markerParams = marker.offsetWidth + 100;
  const width = wrapper.offsetWidth - markerParams;
  const left = Math.random() * width;
  marker.style.left = left + 'px';
}

startBtn.addEventListener('click', resizeLogo);
restartLink.addEventListener('click', startGame);

function startTimer(duration, display) {
  let timer = duration, seconds;

  timerInt = setInterval(function () {
    seconds = parseInt(timer % 60, 10);
    seconds = seconds < 10 ? "0" + seconds : seconds;
    display.textContent = "00" + ":" + seconds;
      if (--timer < 0) {
        endGame(true);
      }
  }, 1000);
}

function hideGlitch(){
  firstLogo.classList.add('no-animate');
  secondLogo.classList.add('hide');
  thirdLogo.classList.add('hide');
  restartLink.classList.add('hide');
  shutter.classList.add('hide');
}

function addGlitch(){
  firstLogo.classList.remove('no-animate');
  secondLogo.classList.remove('hide');
  thirdLogo.classList.remove('hide');
  restartLink.classList.remove('hide');
  shutter.classList.remove('hide');
}

function takeImg(){
  hideGlitch();
  let cropX = wrapper.getBoundingClientRect().left - 50,
      cropY = wrapper.getBoundingClientRect().top - 50;
  html2canvas(document.body, {
    width: wrapper.offsetWidth + 100,
    height: wrapper.offsetHeight + 50,
    x: cropX,
    y: cropY,
    backgroundColor: '#f49f00'
  }).then(function(canvas) {
    addGlitch();
    var a = document.createElement('a'); 
    a.href = canvas.toDataURL("image/png");
    a.download = 'hack.png';
    a.click();
  });
  
}

shutter.addEventListener('click', takeImg);

//TOTAL ATTEMPTS COOKIES

const contributeNumber = document.getElementById('contribute-number');
const hackBar = document.getElementById('contribute-bar');
const maxContribution = 20;
let completions = 0;

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  document.getElementById(vignette).style.display = none;
}