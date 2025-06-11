// login.js
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login");
const signUpButton = document.getElementById("sign-up");
const errorMessage = document.getElementById("error");

function signUp() {
  if (inputIsEmpty()) {
    return;
  }
  var newUser = {
    username: usernameInput.value,
    password: passwordInput.value,
    maxScore: 0,
  };
  var users = JSON.parse(localStorage.getItem("users"));
  if (!users) {
    users = [];
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
  } else if (users.find((user) => user.username === newUser.username)) {
    errorMessage.textContent = "Username already exists!";
    usernameInput.value = "";
    return;
  } else {
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    sessionStorage.setItem("currentUser", JSON.stringify(newUser));
    window.location.href = "../main/index.html";
  }
}

function inputIsEmpty() {
  usernameInput.value = usernameInput.value.trim();
  if (usernameInput.value === "" || passwordInput.value === "") {
    errorMessage.textContent = "Please fill in all fields!";
    return true;
  }
  return false;
}

function checkLoginInput() {
  if (inputIsEmpty()) {
    return;
  }
  var users = JSON.parse(localStorage.getItem("users"));
  if (!users) {
    errorMessage.innerHTML = "User not found!";
  } else {
    var user = users.find(
      (user) =>
        user.username === usernameInput.value &&
        user.password === passwordInput.value
    );
    if (user) {
      window.location.href = "../main/index.html";
    } else {
      errorMessage.textContent = "Invalid username or password!";
      usernameInput.value = "";
      passwordInput.value = "";
    }
    sessionStorage.setItem("currentUser", JSON.stringify(user));
  }
}

function redirectIfLoggedIn() {
  if (JSON.parse(sessionStorage.getItem("currentUser")) !== null) {
    window.location.href = "../main/index.html";
  }
}

window.onload = function () {
  redirectIfLoggedIn();
  loginButton.addEventListener("click", checkLoginInput);
  signUpButton.addEventListener("click", signUp);
};
