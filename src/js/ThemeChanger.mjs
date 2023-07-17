import { getTime } from "./datetime.js";

export default class ThemeChanger {
  #dark = "dark";
  #light = "light";
  constructor(selector) {
    this.name = document.querySelector(selector);
  }
  addEvent() {
    this.name.addEventListener("click", (e) => {
      e.preventDefault();
      if (e.target.textContent === "светлая") {
        localStorage.setItem("theme", this.#dark);
        this.#theme(this.#dark, "тёмная");
      } else {
        localStorage.setItem("theme", this.#light);
        this.#theme(this.#light, "светлая");
      }
    });
  }
  #theme(color, text) {
    document.body.className = color;
    this.name.textContent = text;
  }
  localTheme() {
    const storedTheme = localStorage.getItem("theme");
    const time = getTime();
    if (storedTheme) {
      this.#theme(
        storedTheme,
        storedTheme === this.#dark ? "тёмная" : "светлая"
      );
    } else {
      const isNight = time > "19:00:00" || time < "09:00:00";
      this.#theme(
        isNight ? this.#dark : this.#light,
        isNight ? "тёмная" : "светлая"
      );
    }
    this.addEvent();
  }
}
