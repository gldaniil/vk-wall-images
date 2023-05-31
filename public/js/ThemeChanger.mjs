export default class ThemeChanger {
  constructor(selector) {
    this.selector = selector;
  }
  addEvent() {
    document
      .querySelector(this.selector)
      .addEventListener("click", (e) => {
        e.preventDefault();
        if (e.target.textContent === "светлая") {
          localStorage.setItem("theme", "dark");
          this.#darkTheme.bind(e.target)();
        } else {
          localStorage.setItem("theme", "light");
          this.#lightTheme.bind(e.target)();
        }
      });
  }
  #darkTheme() {
    this.textContent = "тёмная";
    document.body.className = "dark";
    console.log(this)
  }
  #lightTheme() {
    this.textContent = "светлая";
    document.body.className = "light";
  }
}
