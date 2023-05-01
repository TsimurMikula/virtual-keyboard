import './style.css';
import { keysJSON } from './set-keys';

const CssClasses = {
  HD: 'header',
  TX: 'textarea',
  KB_WR: 'keyboard-wrap',
  KB: 'keyboard',
  KB_K: 'keyboard__key',
  KB_KF: 'keyboard__key_func',
  KB_KA: 'keyboard__key_active',
  KB_CA: 'keyboard__caps_active',
  FT: 'footer',
  KB_C: 'keyboard__caps',
  KB_E: 'keyboard__enter',
  KB_SH: 'keyboard__shift',
  KB_S: 'keyboard__space',
}

let keyEn = [];
let shiftKeyEn = [];
let keyRu = [];
let shiftKeyRu = [];
let keyCode = [];
let group = [];

for (let i = 0; i < keysJSON.length; i++) {
  keyEn.push(keysJSON[i].keyEN);
  keyRu.push(keysJSON[i].keyRU);
  shiftKeyEn.push(keysJSON[i].shiftKeyEN);
  shiftKeyRu.push(keysJSON[i].shiftKeyRU);
  keyCode.push(keysJSON[i].code);
  group.push(keysJSON[i].group);
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
const keyboard = createElement('div', CssClasses.KB);
keyboardWrap.append(keyboard);
document.body.append(keyboardWrap);

const footer = createElement('div', CssClasses.FT);
footer.innerText = `Клавиатура создана в операционной системе Windows.\nДля переключения языка комбинация: левые (ctrl + alt).`;
document.body.append(footer);

function createLayout(arr) {
  while (keyboard.firstChild) {
    keyboard.firstChild.remove();
  } 
  for (let i = 0; i < arr.length; i++) {
    const keyComponent = createKey(arr[i]);
    keyComponent.setAttribute('data-key', arr[i]);
    keyComponent.setAttribute('data-keycode', keyCode[i]);
    keyComponent.setAttribute('data-group', group[i]);
    if (keyComponent.dataset.keycode == 'CapsLock') keyComponent.classList.add(CssClasses.KB_C);
    if (keyComponent.dataset.keycode == 'Enter') keyComponent.classList.add(CssClasses.KB_E);
    if (keyComponent.dataset.key == 'Shift') keyComponent.classList.add(CssClasses.KB_SH);
    if (keyComponent.dataset.keycode == 'Space') keyComponent.classList.add(CssClasses.KB_S);
    if (keyComponent.dataset.group == 'functional') keyComponent.classList.add(CssClasses.KB_KF)
    keyboard.append(keyComponent);
  }
}

let toggleLayout = false;
let toggleShift = false;
let toggleCapsLock = false;

let currLayout = JSON.parse(localStorage.getItem("layout"));

if(!currLayout){
  localStorage.setItem("layout", JSON.stringify(keyEn));
  currLayout = keyEn;
}

createLayout(currLayout);

document.addEventListener('keydown', (e) => {
  if (e.code == 'AltLeft') {
    document.addEventListener('keyup', (e) => {
      if (e.code == 'ControlLeft') {
        toggleLayout = !toggleLayout;
        if (toggleLayout) {
          createLayout(keyRu);
          localStorage.setItem('layout', JSON.stringify(keyRu));
        } if (!toggleLayout) {
          createLayout(keyEn);
          localStorage.setItem('layout', JSON.stringify(keyEn));
        }
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
  document.addEventListener('keyup', (e) => {
    let capsActive = document.querySelector(`[data-keycode = 'CapsLock']`);
    if (e.code == capsActive.dataset.keycode) capsActive.classList.add(CssClasses.KB_CA);  
    if (e.code == capsActive.dataset.keycode && !toggleCapsLock) capsActive.classList.remove(CssClasses.KB_CA);
  })
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
    if (e.code === 'Delete')  {
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

document.addEventListener('keydown', (e) => {
  if (e.code == 'ArrowUp') return textarea.value += '▲';
  if (e.code == 'ArrowLeft') return textarea.value += '◄';
  if (e.code == 'ArrowDown') return textarea.value += '▼';
  if (e.code == 'ArrowRight') return textarea.value += '►';
})  

document.addEventListener('keydown', (e) => {
  if (e.code == 'Tab') return textarea.value += '    ';
})  


keyboard.addEventListener('click', (e) => {
  if (e.target.dataset.key === 'Backspace')  {
    return textarea.value = textarea.value.slice(0, -1);
  }
  if (e.target.dataset.key === 'Tab')  {
    return textarea.value += '    ';
  }
  if (e.target.dataset.key === 'Del') {
    return textarea.value = textarea.value.slice(0, -1);
  } 
  if (e.target.dataset.key === 'CapsLock') {
    if (toggleLayout) {
      toggleCapsLock = !toggleCapsLock;
      toggleCapsLock ? createLayout(shiftKeyRu) : createLayout(keyRu);
      return;
    } else {
      toggleCapsLock = !toggleCapsLock;
      toggleCapsLock ? createLayout(shiftKeyEn) : createLayout(keyEn);
      return;
    }
  }
  if (e.target.dataset.key === 'Enter') {
    return textarea.value += '\n';
  }
  if (e.target.dataset.key === 'Ctrl' || e.target.dataset.key === 'Alt' || e.target.dataset.key === 'Win') {
    return '';
  }
  if (e.target.dataset.key) {
    textarea.value += e.target.dataset.key;
  }
})

keyboard.addEventListener('mousedown', (e) => {
  if (e.target.dataset.key == 'Shift' && !toggleLayout) {
    toggleShift = !toggleShift;
    toggleShift ? createLayout(shiftKeyEn) : createLayout(shiftKeyEn);
  }
  if (e.target.dataset.key == 'Shift' && toggleLayout) {
    toggleShift = !toggleShift;
    toggleShift ? createLayout(shiftKeyRu) : createLayout(shiftKeyRu);
  }  
})
keyboard.addEventListener('mouseup', (e) => {
  if (e.target.dataset.key == 'Shift' && !toggleLayout) {
    toggleShift ? createLayout(keyEn) : createLayout(keyEn);
  }
  if (e.target.dataset.key == 'Shift' && toggleLayout) {
    toggleShift ? createLayout(keyRu) : createLayout(keyRu);
  }  
})

keyboard.addEventListener('mousedown', (e) => {
  let mouseKey = document.querySelector(`[data-key='${e.target.dataset.key}']`)
  if (mouseKey) mouseKey.classList.add(CssClasses.KB_KA);
})
  keyboard.addEventListener('mouseup', (e) => {
    let mouseKey = document.querySelector(`[data-key='${e.target.dataset.key}']`)
    if (mouseKey) mouseKey.classList.remove(CssClasses.KB_KA);
  })






