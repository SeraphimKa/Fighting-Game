function menuInit() {
  document.querySelector("#menu").style.display = "flex";
  document.querySelector("#start").addEventListener("click", (event) => {
    document.querySelector("#menu").style.display = "none";
    gameLoop();
  });
  //   document.querySelector("#options").addEventListener("click", (event) => {});
  //   document.querySelector("#credits").addEventListener("click", (event) => {});
  //   document.querySelector("#quit").addEventListener("click", (event) => {});
}
