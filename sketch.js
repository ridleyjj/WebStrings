var vibratingStrings = [];

function setup() {
  let cnv = createCanvas(windowWidth, 600);
  
  for (let i = 0; i < 6; i++) {
    vibratingStrings.push(new JrString(createVector(0, height * 0.4 + i * height  * 0.05), width, 3));
  }

  cnv.elt.addEventListener('mouseenter', onMouseEnter);
  cnv.mouseOut(onMouseOut);
}

function draw() {
  background(255);

  for (let i = 0; i < vibratingStrings.length; i++) {
    vibratingStrings[i].draw();
  }
}

function onMouseEnter(event) {
  // compute canvas-local mouse coordinates from the DOM event to avoid relying on p5 mouseX
  const rect = event.target.getBoundingClientRect();
  const cx = event.clientX - rect.left;
  const cy = event.clientY - rect.top;
  for (let i = 0; i < vibratingStrings.length; i++) {
    vibratingStrings[i].resetMousePosition(cx, cy);
  }
}

function onMouseOut(event) {
  for (let i = 0; i < vibratingStrings.length; i++) {
    vibratingStrings[i].mouseAbsent = true;
  }
}
