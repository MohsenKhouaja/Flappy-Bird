let id2 = null;
let id = null;
let collisionid = null;
window.onload = function () {
  document.body.addEventListener("click", start);

  var animating = false;
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function start() {
    var obstacle = document.getElementsByClassName("obstacle")[0];
    var nbofCopies = 20;
    var container = document.body;
    if (!animating) {
      animating = true;
      for (var i = 0; i < nbofCopies; i++) {
        const clone = obstacle.cloneNode(true);
        container.appendChild(clone);
        collisionid = setInterval(() => {
          if (
            isColliding(clone.children[0], bird) ||
            isColliding(clone.children[1], bird)
          ) {
            clearInterval(id2);
            clearInterval(id);
            clearInterval(collisionid);
          }
        }, 100);
        let currentTop = parseInt(getComputedStyle(clone).top);
        let newTop = currentTop + getRandomInt(-200, 200);
        console.log("Original top from CSS:", currentTop);
        clone.style.top = `${newTop}px`;
        var animation = clone.animate(
          [
            { transform: "translateX(1500px)" },
            { transform: "translateX(-2000px)" },
          ],
          { duration: 7000, easing: "linear", delay: i * 2000 }
        );
        animation.onfinish = () => {
          clone.remove();
          clearInterval(collisionid);
        };
      }
    }
  }
  document.body.addEventListener("click", clickHandle);
  let started = false;
  function clickHandle() {
    if (!started) {
      birdFall();
      started = true;
    } else {
      birdJump();
    }
  }

  var bird = document.getElementById("bird");
  let translation = 0;
  function birdFall() {
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
};

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
