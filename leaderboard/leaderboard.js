// leaderboard.js
function createUserDiv(user, i) {
  const playerDiv = document.createElement("div");
  playerDiv.className = "player";

  const rankDiv = document.createElement("div");
  rankDiv.className = "rank";
  rankDiv.textContent = i + 2;
  playerDiv.appendChild(rankDiv);

  const avatarDiv = document.createElement("div");
  avatarDiv.className = "avatar";
  avatarDiv.textContent = user.username[0].toUpperCase();
  playerDiv.appendChild(avatarDiv);

  const playerInfoDiv = document.createElement("div");
  playerInfoDiv.className = "player-info";

  const nameDiv = document.createElement("div");
  nameDiv.className = "name";
  nameDiv.textContent = user.username;

  playerInfoDiv.appendChild(nameDiv);
  playerDiv.appendChild(playerInfoDiv);

  const scoreDiv = document.createElement("div");
  scoreDiv.className = "score";
  scoreDiv.textContent = user.maxScore;
  playerDiv.appendChild(scoreDiv);
  return playerDiv;
}

window.onload = function () {
  var leaderboard = document.getElementById("leaderboard");
  var backButton = document.getElementById("back-button");
  backButton.addEventListener("click", function () {
    window.location.href = "../main/index.html";
  });
  var users = JSON.parse(localStorage.getItem("users")) || [];
  if (!(users.length === 0)) {
    users.sort(function (a, b) {
      return b.maxScore - a.maxScore;
    });
    for (let i = 0; i < users.length; i++) {
      const currentUser = users[i];
      if (currentUser.maxScore > 0) {
        const userDiv = createUserDiv(currentUser, i);
        leaderboard.appendChild(userDiv);
      }
    }
  }
};
