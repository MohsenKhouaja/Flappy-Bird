var nbofObstacles = 20;
var score = 0;
var obstacleClones = [];
let id2 = null;
let id = null;
let gameIsOver = false;
let gameHasStarted = false;
let collisionid = null;
let scoreincrement = null;
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
  document.body.addEventListener("click", clickHandlebird, false);
  document.body.addEventListener("click", obstacleAnimationclickHandle, false);
  function startGame() {
    if (!gameHasStarted) {
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

  //#region HTMLelements
  var bird = document.getElementById("bird");
  var birdLeft = bird.getBoundingClientRect().left;
  var obstacle = document.getElementsByClassName("obstacle")[0];
  var instruction = document.getElementById("instruction");
  var footer = document.getElementById("footer");
  var scoreText = document.getElementById("score");
  var footerWidth =
    footer.getBoundingClientRect().bottom - footer.getBoundingClientRect().top;
  console.log(footerWidth);
  //#endregion

  let obstaclesAnimating = false;
  function obstacleAnimation() {
    console.log("function called");
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
            GameOver();
            return;
          }
        }, 100);
        clone.dataset.scoreid = setInterval(() => {
          if (clone.getBoundingClientRect().right <= birdLeft) {
            score++;
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
  let translation = 0;
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
  function GameOver() {
    if (!gameIsOver) {
      gameIsOver = true;
      bird.style.transform = `translateY(0px)`;
      let finalScore = score;
      gameHasStarted = false;
      document.body.removeEventListener("click", clickHandlebird);
      document.body.removeEventListener("click", obstacleAnimationclickHandle);
      instruction.innerHTML = "Game Over!";
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
    }
  }
};
