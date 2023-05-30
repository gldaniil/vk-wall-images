import curTime from "./getData.js";

// Класс элементов
class Creating {
  constructor({ tag }) {
    this.el = document.createElement(tag);
  }
  appendTo(parent) {
    parent.appendChild(this.el);
  }
  afterTo(parent) {
    parent.after(this.el);
  }
}
class InputElem extends Creating {
  constructor({ id, type, name }) {
    super({ tag: "input" });
    this.el.id = id;
    this.el.type = type;
    this.el.name = name;
  }
}
class LabelElem extends Creating {
  constructor({ htmlFor, textContent }) {
    super({ tag: "label" });
    this.el.htmlFor = htmlFor;
    this.el.textContent = textContent;
  }
}
class ButtonElem extends Creating {
  constructor({ className, value }) {
    super({ tag: "input" });
    this.el.type = "button";
    this.el.value = value;
    this.el.classList.add(className);
  }
}
class DivElem extends Creating {
  constructor({ className }) {
    super({ tag: "div" });
    this.el.classList.add(className);
  }
}
class Message extends DivElem {
  constructor({ className, text }) {
    super({ className });
    this.el.textContent = text;
  }
}
// Отмечаем ранее выбранный переключатель
const checkedLabel = (parent, child) => {
  const result = parent.querySelector(child);
  if (result) {
    result.checked = "true";
  }
};
// "Адрес группы"
const paramsGroup = (parent) => {
  const rowRadio = new DivElem({
    className: "params__group-selector",
  }).el;
  // OwnerID
  new InputElem({
    id: "owner_id",
    type: "radio",
    name: "group",
  }).appendTo(rowRadio);
  new LabelElem({
    htmlFor: "owner_id",
    textContent: "OwnerID",
  }).appendTo(rowRadio);
  // Domain
  new InputElem({
    id: "domain",
    type: "radio",
    name: "group",
  }).appendTo(rowRadio);
  new LabelElem({
    htmlFor: "domain",
    textContent: "Domain",
  }).appendTo(rowRadio);
  if (parent.dataset.prop) checkedLabel(rowRadio, `#${parent.dataset.prop}`);
  return rowRadio;
};
// "Тип записей"
const paramsFilter = (parent) => {
  const prevElem = parent.querySelector(".params__filter-str");
  const rowRadio = new DivElem({
    className: "params__filter-selector",
  }).el;
  // Owner
  new InputElem({
    id: "owner",
    type: "radio",
    name: "filter",
  }).appendTo(rowRadio);
  new LabelElem({
    htmlFor: "owner",
    textContent: "Owner",
  }).appendTo(rowRadio);
  // Others
  new InputElem({
    id: "others",
    type: "radio",
    name: "filter",
  }).appendTo(rowRadio);
  new LabelElem({
    htmlFor: "others",
    textContent: "Others",
  }).appendTo(rowRadio);
  // All
  new InputElem({
    id: "all",
    type: "radio",
    name: "filter",
  }).appendTo(rowRadio);
  new LabelElem({
    htmlFor: "all",
    textContent: "All",
  }).appendTo(rowRadio);
  // Donut
  new InputElem({
    id: "donut",
    type: "radio",
    name: "filter",
  }).appendTo(rowRadio);
  new LabelElem({
    htmlFor: "donut",
    textContent: "Donut",
  }).appendTo(rowRadio);
  prevElem.before(rowRadio);
  checkedLabel(rowRadio, `#${prevElem.value}`);
};
// Результат отправки
const notification = (res) => {
  let msg;
  if (res.status === 200) {
    msg = "Запрос успешно отправлен!";
  } else {
    msg = "Возникла ошибка при отправке запроса!";
  }
  const notif = new Message({
    className: "params__notification",
    text: `${msg}`,
  });
  notif.appendTo(body);
  notif.el.addEventListener("click", (e) => e.target.remove());
};
// Отправка данных запроса на сервер
const sendData = async () => {
  const arr = Object.keys(requestOptions);
  let req = "";
  Object.keys(requestOptions).forEach((el, i) => {
    if (i !== arr.length - 1) {
      req = `${req}${el}=${requestOptions[el]}&`;
    } else {
      req = `${req}${el}=${requestOptions[el]}`;
    }
  });
  await fetch("/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      Allow: "POST",
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(requestOptions),
  })
    .then((response) => notification(response))
    .catch((error) => notification(error));
};

const getInputsWithDataset = () =>
  windowParams.querySelectorAll("input[data-prop]");

const handlerEditor = (e) => {
  const target = e.target;
  // Исключение ненужных кликов внутри окна
  if (
    target.tagName !== "SPAN" &&
    target.tagName !== "INPUT" &&
    target.tagName !== "BUTTON"
  )
    return;

  const saveToLocal = (key, value) => {
    localStorage.setItem(key, value);
  };

  const inputActions = (target) => {
    const parent = Array.from(target.closest("div").children);
    for (const el of parent) {
      if (el.tagName === "DIV" || el.type === "button") {
        el.remove();
        continue;
      }
      el.classList.remove("edit");
      el.disabled = true;
      if (target.value === "Сохранить") {
        el.defaultValue = el.value;
        saveToLocal(el.className.split("__")[1], el.value);
      } else el.value = el.defaultValue;
    }
  };
  // "Изменить?"
  if (target.tagName === "SPAN") {
    const divParent = target.closest("div").nextElementSibling;
    if (divParent.children.length < 3) {
      const inputList = divParent.querySelectorAll("input");
      const input = inputList[inputList.length - 1];

      if (target.className === "params__group-edit") {
        input.before(paramsGroup(input));
      }

      input.classList.add("edit");
      input.value = "";
      input.disabled = false;

      new ButtonElem({
        className: "params__decline",
        value: "Отменить",
      }).afterTo(input);
      new ButtonElem({
        className: "params__accept",
        value: "Сохранить",
      }).afterTo(input);
    }
    return;
  }

  if (target.tagName === "INPUT") {
    // "Сохранить", "Отменить"
    if (target.type === "button") {
      inputActions(target);
      return;
    }
    // Domain, All, Donut и пр.
    if (target.type === "radio") {
      const input = target.closest("div").nextElementSibling;
      if (input.classList.contains("params__filter-str")) {
        input.defaultValue = target.id;
        saveToLocal(`${input.className.split("__")[1]}`, input.value);
        return;
      }
      input.dataset.prop = target.id;
      saveToLocal(`${input.classList[0].split("__")[1]}-p`, input.dataset.prop);
      return;
    }
  }
  // "Выполнить запрос"
  if (target.tagName === "BUTTON") {
    if (checkFieldsRequest(target, getInputsWithDataset())) sendData();
  }
};
// Проверка наличия всех параметров перед отправкой на сервер
const checkFieldsRequest = (target, inputs) => {
  let arr = [];
  for (const el of inputs) {
    if (el.dataset.prop && el.value) {
      requestOptions[el.dataset.prop] = el.value;
    } else {
      arr.push(el);
    }
  }
  if (arr.length !== 0) {
    new Message({
      className: "params__error",
      text: "Отсутствует один (или несколько) параметров!",
    }).afterTo(target);
    setTimeout(() => target.nextElementSibling.remove(), 6000);
  } else return true;
  return false;
};
// Параметры запроса по-умолчанию
const requestOptions = {
  offset: 0,
  count: 1,
  filter: "all",
  v: 5.131,
};
// Тёмная тема
const darkTheme = (target) => {
  target.textContent = "тёмная";
  body.classList.add("dark");
};
// Светлая
const lightTheme = (target) => {
  target.textContent = "светлая";
  body.classList.add("light");
};

const body = document.querySelector("body");
const themeChanger = body.querySelector(".header__theme-change");
// Смена темы при клике на "Тема: { светлая/тёмная }"
themeChanger.addEventListener("click", (e) => {
  if (body.classList.contains("light")) {
    body.classList.remove("light");
    localStorage.setItem("theme", "dark");
    darkTheme(e.target);
  } else {
    body.classList.remove("dark");
    localStorage.setItem("theme", "light");
    lightTheme(e.target);
  }
  e.preventDefault();
});

// Делегирование событий для окна params__window
const windowParams = document.querySelector(".params__window");
windowParams.addEventListener("click", (e) => handlerEditor(e));

const setStorageValues = () => {
  return new Promise((resolve) => {
    if (localStorage.getItem("theme")) {
      localStorage.getItem("theme") === "dark"
        ? darkTheme(themeChanger)
        : lightTheme(themeChanger);
    } else {
      (curTime() > "19:00:00" || curTime() < "09:00:00")
        ? darkTheme(themeChanger)
        : lightTheme(themeChanger);
    }

    for (const el of getInputsWithDataset()) {
      const elKey = el.className.split("__")[1];
      if (localStorage.getItem(`${elKey}`)) {
        if (elKey === "group-id") {
          el.dataset.prop = localStorage.getItem(`${elKey}-p`);
        }
        el.defaultValue = localStorage.getItem(`${elKey}`);
      } else if (elKey === "filter-str") {
        el.defaultValue = "all";
      }
    }
    resolve();
  });
};
// Загружаем из localStorage ранее введенные данные
setStorageValues().then((e) => {
  const preloader = document.querySelector(".preloader");
  preloader.classList.add("hidden");
  preloader.classList.remove("visible");
  setTimeout(() => {
    preloader.remove();
  }, 2000);
});
// Создание переключателей в "Тип записи"
paramsFilter(windowParams);