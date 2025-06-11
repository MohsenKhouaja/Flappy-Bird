var nbofObstacles = 1000;
var score = 0;
var obstacleClones = [];
let id2 = null;
let id = null;
let gameIsOver = false;
let gameHasStarted = false;
let collisionid = null;
let scoreincrement = null;
let translation = 0;

function removeObstacleAnimation() {
  for (let i = 0; i < obstacleAnimations.length; i++) {
    const animation = obstacleAnimations[i];

    // If it exists, cancel it
    if (animation) {
      animation.cancel(); // Stops and removes the animation
    }

    // Remove the data attribute
    if (obstacleClones[i]) {
      obstacleClones[i].removeAttribute("data-animation");
    }
  }
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isColliding(obj1, obj2) {
  const rect1 = obj1.getBoundingClientRect();
  const rect2 = obj2.getBoundingClientRect();

  return !(
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom ||
    rect1.right < rect2.left ||
    rect1.left > rect2.right
  );
}

window.onload = function () {
  //#region HTMLelements
  var bird = document.getElementById("bird");
  var birdLeft = bird.getBoundingClientRect().left;
  var obstacle = document.getElementsByClassName("obstacle")[0];
  var instruction = document.getElementById("instruction");
  var footer = document.getElementById("footer");
  var scoreText = document.getElementById("score");
  var div = document.getElementById("right-header");
  var RightHeaderGreeting = document.getElementById("greeting");
  var footerWidth =
    footer.getBoundingClientRect().bottom - footer.getBoundingClientRect().top;
  console.log(footerWidth);
  //#endregion

  document.body.addEventListener("click", clickHandlebird, false);
  document.body.addEventListener("click", obstacleAnimationclickHandle, false);

  //#region startGame

  function ChangeHeaderUIGameStart() {
    var RestartButton = document.getElementById("restart");
    var LeaderboardButton = document.getElementById("leaderboard");
    div.removeChild(RestartButton);
    div.removeChild(LeaderboardButton);
    div.appendChild(RightHeaderGreeting);
    scoreText.innerHTML = "Score = 0";
    startGame();
  }
  function startGame() {
    if (!gameHasStarted) {
      bird.style.transform = `translateY(0px)`;
      translation = 0;
      document.body.addEventListener("click", clickHandlebird, false);
      document.body.addEventListener(
        "click",
        obstacleAnimationclickHandle,
        false
      );
      obstaclesAnimating = false;
      obstacleAnimation();
      console.log("game started");
      gameHasStarted = true;
      obstacleClones = [];
      score = 0;
      id2 = null;
      id = null;
      gameIsOver = false;
      collisionid = null;
      scoreincrement = null;
      obstacleAnimationStarted = false;
    }
  }

  function clickHandlebird() {
    if (!gameHasStarted) {
      startGame();
      birdFall();
    } else {
      birdJump();
    }
  }
  let obstacleAnimationStarted = false;
  function obstacleAnimationclickHandle() {
    if (!obstacleAnimationStarted) {
      obstacleAnimation();
      obstacleAnimationStarted = true;
    }
  }

  let obstaclesAnimating = false;
  function obstacleAnimation() {
    console.log("obstacle animatio");
    instruction.innerHTML = "";
    var container = document.body;
    if (!obstaclesAnimating) {
      /* so the obstacles animate only once */ obstaclesAnimating = true;
      /* each obstacle with it's own collison detection and destruction */
      for (var i = 0; i < nbofObstacles; i++) {
        console.log("function executing");
        const clone = obstacle.cloneNode(true);
        clone.classList.add("obstacle-clone"); // Add a special class
        container.appendChild(clone);
        obstacleClones.push(clone);
        collisionid = setInterval(() => {
          if (
            (isColliding(clone.children[0], bird) ||
              isColliding(clone.children[1], bird) ||
              isColliding(footer, bird)) &&
            !gameIsOver
          ) {
            console.log("game over");
            GameOver(false);
            return;
          }
        }, 100);
        clone.dataset.scoreid = setInterval(() => {
          if (clone.getBoundingClientRect().right <= birdLeft) {
            score++;
            if (score === nbofObstacles) {
              GameOver(true);
            }
            if (!gameIsOver) scoreText.innerHTML = `Score = ${score}`;
            clearInterval(clone.dataset.scoreid);
          }
        }, 300);
        let currentTop = parseInt(getComputedStyle(clone).top);
        let newTop = currentTop + getRandomInt(-200, 200);
        console.log("Original top from CSS:", currentTop);
        clone.style.top = `${newTop}px`;
        clone.dataset.animation = clone.animate(
          [
            { transform: "translateX(1500px)" },
            { transform: "translateX(-2000px)" },
          ],
          { duration: 7000, easing: "linear", delay: i * 2000 }
        );
        obstacleClones.push(clone.dataset.animation);
        clone.dataset.animation.onfinish = () => {
          clone.remove();
          clearInterval(collisionid);
        };
      }
    }
  }

  //#region  birdMouvement
  /* bird movement */
  function birdFall() {
    console.log("birdFall called"); // Debug output
    if (id) clearInterval(id);
    id = setInterval(fallframe, 6);
    function fallframe() {
      translation += 1.5;
      bird.style.transform = `translateY(${translation}px)`;
    }
  }
  function birdJump() {
    if (id) clearInterval(id);
    if (id2) clearInterval(id2);

    let jumpStart = Date.now();
    let jumpDuration = 130;
    let jumpHeight = 6;

    id2 = setInterval(() => {
      const top = bird.getBoundingClientRect().top;
      if (top <= footerWidth) {
        clearInterval(id2);
        birdFall();
      }
      let elapsed = Date.now() - jumpStart;
      let progress = elapsed / jumpDuration;
      if (progress >= 1) progress = 1;
      translation -= jumpHeight * (1 - Math.pow(1 - progress, 2));
      bird.style.transform = `translateY(${translation}px)`;
      if (progress === 1) {
        clearInterval(id2);
        birdFall();
      }
    }, 5);
  }
  //#endregion

  //#region Game Over
  function changeHeaderUIGameOver() {
    div.removeChild(RightHeaderGreeting);
    const RestartButton = document
      .getElementById("button-template")
      .content.firstElementChild.cloneNode(true);
    RestartButton.textContent = "Restart";
    RestartButton.id = "restart";
    div.appendChild(RestartButton);
    const LeaderboardButton = document
      .getElementById("button-template")
      .content.firstElementChild.cloneNode(true);
    LeaderboardButton.textContent = "Leaderboard";
    LeaderboardButton.id = "leaderboard";
    div.appendChild(LeaderboardButton);
  }
  function GameOver(win) {
    let message = "";
    if (win) {
      message = "You win!";
    } else {
      message = "Game Over";
    }
    if (!gameIsOver) {
      gameIsOver = true;
      bird.style.transform = `translateY(0px)`;
      let finalScore = score;
      gameHasStarted = false;
      document.body.removeEventListener("click", clickHandlebird);
      document.body.removeEventListener("click", obstacleAnimationclickHandle);
      instruction.innerHTML = message;
      clearInterval(id);
      clearInterval(id2);
      clearInterval(scoreincrement);

      // Remove all obstacle elements from the body
      document.querySelectorAll(".obstacle-clone").forEach((clone) => {
        clone.remove();
      });
      // Clear the obstacleClones array
      obstacleClones = [];

      // Also remove the original obstacle if it exists
      const originalObstacle = document.getElementById("obstacle");
      if (originalObstacle && originalObstacle.parentNode) {
        originalObstacle.parentNode.removeChild(originalObstacle);
      }
      console.log(finalScore);
      scoreText.innerHTML = `Score = ${finalScore}`;
      changeHeaderUIGameOver();
      var RestartButton = document.getElementById("restart");
      RestartButton.addEventListener("click", ChangeHeaderUIGameStart);
    }
  }
};
