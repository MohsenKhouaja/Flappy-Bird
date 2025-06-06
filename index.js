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
      var animation = clone.animate(
        [
          { transform: "translateX(2000px)" },
          { transform: "translateX(-2000px)" },
        ],
        { duration: 6000, easing: "linear", delay: i * 2000 }
      );
      animation.onfinish = () => clone.remove();
    }
  }
}
