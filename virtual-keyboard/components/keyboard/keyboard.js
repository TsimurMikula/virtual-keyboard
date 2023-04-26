import './keyboard.css';

const CssClasses = {
  KB_WR: 'keyboard__wrap'
}

function createComponent(keysJSON) {
  if (!Array.isArray(keysJSON)) {
    throw TypeError('Keyboard error. Keys array is invalid!');
  }

  const component = document.createElement('section');
  component.classList.add(CssClasses.KB_WR);


  return component;
}

export { createComponent };
