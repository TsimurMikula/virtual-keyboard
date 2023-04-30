import './style.css';
import { keysJSON } from './set-keys';

const CssClasses = {
  HD: 'header',
  TX: 'textarea',
  KB_WR: 'keyboard-wrap',
  WR: 'wrap',
  KB: 'keyboard',
  KB_K: 'keyboard__key',
  KB_KA: 'keyboard__key_active',
  FT: 'footer'
}

let keyEn = [];
let shiftKeyEn = [];
let keyRu = [];
let shiftKeyRu = [];
let keyCode = [];

for (let i = 0; i < keysJSON.length; i++) {
  keyEn.push(keysJSON[i].keyEN);
}
for (let i = 0; i < keysJSON.length; i++) {
  keyRu.push(keysJSON[i].keyRU);
}
for (let i = 0; i < keysJSON.length; i++) {
  shiftKeyEn.push(keysJSON[i].shiftKeyEN);
}
for (let i = 0; i < keysJSON.length; i++) {
  shiftKeyRu.push(keysJSON[i].shiftKeyRU);
}
for (let i = 0; i < keysJSON.length; i++) {
  keyCode.push(keysJSON[i].code);
}

function createElement (tagName, className) {
  const KBCreate = document.createElement(tagName);
  KBCreate.classList.add(className);
  return KBCreate;
}

function createKey(key) {
  const keyCreate = createElement('div', CssClasses.KB_K);
  keyCreate.textContent = key;
  return keyCreate;
}

const header = createElement('div', CssClasses.HD);
header.textContent = 'Виртуальная клавиатура';
document.body.append(header);

const textarea = createElement('textarea', CssClasses.TX);
textarea.setAttribute('autofocus', 'true');
document.body.append(textarea);

const keyboardWrap = createElement('section', CssClasses.KB_WR);
const wrap = createElement('div', CssClasses.WR);
keyboardWrap.append(wrap);
const keyboard = createElement('div', CssClasses.KB);
wrap.append(keyboard);
document.body.append(keyboardWrap);

const footer = createElement('div', CssClasses.FT);
footer.textContent = 'Клавиатура создана в операционной системе Windows. Для переключения языка комбинация: левые ctrl + alt.';
document.body.append(footer);

function createLayout(arr) {
  while (keyboard.firstChild) {
    keyboard.firstChild.remove();
  } 
  for (let i = 0; i < arr.length; i++) {
      const keyComponent = createKey(arr[i]);
      keyComponent.setAttribute('data-key', arr[i]);
      keyComponent.setAttribute('data-keycode', keyCode[i]);
      keyboard.append(keyComponent);
  }
}

let toggleLayout = false;
let toggleShift = false;
let toggleCapsLock = false;
createLayout(keyEn);

document.addEventListener('keydown', (e) => {
  if (e.code == 'AltLeft') {
    document.addEventListener('keyup', (e) => {
      if (e.code == 'ControlLeft') {
        toggleLayout = !toggleLayout;
        toggleLayout ? createLayout(keyRu) : createLayout(keyEn);
      }
    })
    toggleLayout = false;
  }
})

document.addEventListener('keydown', (e) => {
  if (e.code == 'CapsLock') {
    document.addEventListener('keyup', (e) => {
      if (e.code == 'CapsLock') {
        if (toggleLayout) {
          toggleCapsLock = !toggleCapsLock;
          toggleCapsLock ? createLayout(shiftKeyRu) : createLayout(keyRu);
        } else {
          toggleCapsLock = !toggleCapsLock;
          toggleCapsLock ? createLayout(shiftKeyEn) : createLayout(keyEn);
        }
      }
    })
    toggleCapsLock = false;
  }
})

document.addEventListener('keydown', (e) => {
  if (e.code == 'ShiftLeft' && !toggleLayout || e.code == 'ShiftRight' && !toggleLayout) {
    toggleShift = !toggleShift;
    toggleShift ? createLayout(shiftKeyEn) : createLayout(shiftKeyEn);
  }
  if (e.code == 'ShiftLeft' && toggleLayout || e.code == 'ShiftRight' && toggleLayout) {
    toggleShift = !toggleShift;
    toggleShift ? createLayout(shiftKeyRu) : createLayout(shiftKeyRu);
  }
})
document.addEventListener('keyup', (e) => {
  if (e.code == 'ShiftLeft' && !toggleLayout || e.code == 'ShiftRight' && !toggleLayout) {
    toggleShift ? createLayout(keyEn) : createLayout(keyEn);
  }
  if (e.code == 'ShiftLeft' && toggleLayout || e.code == 'ShiftRight' && toggleLayout) {
    toggleShift ? createLayout(keyRu) : createLayout(keyRu);
  }
})

document.addEventListener('keydown', (e) => {
  let keyActiveK = document.querySelector(`[data-keycode='${e.code}']`);
  if (keyActiveK) {
    keyActiveK.classList.add(CssClasses.KB_KA);
    if (e.key.length < 2) textarea.value += e.key;
    e.preventDefault();
    if (e.code === 'Backspace')  {
      return textarea.value = textarea.value.slice(0, -1);
    }
    if (e.code === 'Enter') {
      return textarea.value += '\n';
    }
  }
})
document.addEventListener('keyup', (e) => {
  let keyActiveK = document.querySelector(`[data-keycode='${e.code}']`);
  if (keyActiveK) keyActiveK.classList.remove(CssClasses.KB_KA);
})




keyboard.addEventListener('click', (e) => {
  if (e.target.dataset.key === 'Backspace')  {
    return textarea.value = textarea.value.slice(0, -1);
  }
  /* if (e.target.dataset.key === 'Del') {
    return textarea.value = textarea.value.slice(0, -1) + textarea.value.slice(0, -1);
  }  */
  if (e.target.dataset.key === 'Tab')  {
    return textarea.value = textarea.value.slice(textarea.value.length, 0, '    ');
  }
  if (e.target.dataset.key === 'Enter') {
    return textarea.value += '\n';
  }
  if (e.target.dataset.key) {
    textarea.value += e.target.dataset.key;
  }
})






