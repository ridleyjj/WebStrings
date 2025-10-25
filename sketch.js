var vibratingStrings = [];
var cnv;

function setup() {
  cnv = createCanvas(windowWidth, 600);
  
  for (let i = 0; i < 6; i++) {
    vibratingStrings.push(new JrString(createVector(0, height * 0.4 + i * height  * 0.05), width, 3));
  }

  cnv.elt.addEventListener('mouseenter', onMouseEnter);
  cnv.mouseOut(onMouseOut);
}

function touchMoved(event) {
  // stop the default scrolling behavior on mobile
  event.preventDefault();
}

function draw() {
  background(255);

  for (let i = 0; i < vibratingStrings.length; i++) {
    vibratingStrings[i].draw();
  }
}

function onMouseEnter(event) {
  setMousePositionForAllStrings(event.clientX, event.clientY);
}

function touchStarted(event) {
  if (!event.touches || event.touches.length == 0) return;

  let touch = event.touches[0];
  setMousePositionForAllStrings(touch.clientX, touch.clientY);
}

function setMousePositionForAllStrings(x, y) {
  // compute canvas-local mouse coordinates from the DOM event to avoid relying on p5 mouseX
  const rect = cnv.elt.getBoundingClientRect();
  const cx = x - rect.left;
  const cy = y - rect.top;
  for (let i = 0; i < vibratingStrings.length; i++) {
    vibratingStrings[i].resetMousePosition(cx, cy);
  }
}

function touchEnded() {
  setMouseAbsentForAllStrings();
}

function onMouseOut(event) {
  setMouseAbsentForAllStrings();
}

function setMouseAbsentForAllStrings() {
  for (let i = 0; i < vibratingStrings.length; i++) {
    vibratingStrings[i].mouseAbsent = true;
  }
}
