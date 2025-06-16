const body = document.querySelector("body"),
  sidebar = document.querySelector(".sidebar"),
  toggle = document.querySelector(".toggle"),
  modeSwitch = document.querySelector(".toggle-switch"),
  modeText = document.querySelector(".mode-text"),
  searchBtn = document.querySelector(".search-bar");

modeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark");
  //   document.querySelector(".mode-text").innertext=""

  if (body.classList.contains("dark")) {
    modeText.innerText = " Light Mode ";
  } else modeText.innerText = " Dark Mode ";
});

toggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});

searchBtn.addEventListener("click", () => {
  sidebar.classList.remove("close");
});

document.getElementById("logoutBtn").addEventListener("click", function (e) {
  e.preventDefault(); // Prevent default anchor behavior
  localStorage.removeItem("isLoggedIn"); // or your login key
  localStorage.removeItem("loggedInUser"); // optional, depending on your app
  window.location.href = "../InfoTech Academy/LoginRegister.html"; // Redirect to login page
});
