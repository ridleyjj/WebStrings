var vibratingStrings = [];

function setup() {
  createCanvas(windowWidth, 600);
  
  for (let i = 0; i < 6; i++) {
    vibratingStrings.push(new JrString(createVector(0, height * 0.4 + i * height  * 0.05), width, 3));
  }
}

function draw() {
  background(255);

  for (let i = 0; i < vibratingStrings.length; i++) {
    vibratingStrings[i].draw();
  }
}
