//JS handling all keyboard inputs
const keys = {};//starts by declaring keys, an empty object which will store all keyboard inputs as properties
//e.g. press 'a' and keys['a'] === true
window.addEventListener('keydown', (e) => {
  keys[e.key] = true;//the listener for when a key is pressed
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;//listener for when a key is released
});
