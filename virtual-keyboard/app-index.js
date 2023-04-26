import './style.css';
import { keysJSON } from './keys';
import { createComponent } from './components/keyboard/keyboard';
 
const keyboard = createComponent(keysJSON);
document.body.append(keyboard);
