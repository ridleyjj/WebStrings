class JrString {
    stringStart;
    stringEnd;
    pullPoint;
    isMouseAbove;

    sinRamp = 0; // for oscillating the string
    midPoint;
    maxAmplitude;
    currentAmplitude = 0;
    damping = 0.97;
    minMouseSpeed = 1;
    maxMouseSpeed = 60;

    _absIncrement = 0.1;
    increment = this._absIncrement;

    isVibrating = false;
    isTriggering = false;

    constructor(startPoint, length, thickness = 3) {
        this.thickness = thickness;
        this.stringStart = startPoint.copy();
        this.stringEnd = createVector(startPoint.x + length, startPoint.y);
        this.midPoint = createVector(
            this.stringStart.x + (this.stringEnd.x - this.stringStart.x) * 0.5,
            this.stringStart.y + (this.stringEnd.y - this.stringStart.y) * 0.5
        );
        this.pullPoint = this.midPoint.copy();

        this.maxAmplitude = length * 0.25;

        this.isMouseAbove = this.isPointAboveString(mouseX, mouseY);
    }

    triggerDelay = 100; // ms
    lastTriggerTime = 0;

    triggerString(intensity = 1, direction) {
        if (this.isVibrating && millis() - this.lastTriggerTime < this.triggerDelay) return;

        this.increment = this._absIncrement * (direction ? -1 : 1);
        this.sinRamp = 0;
        this.isVibrating = true;
        this.lastTriggerTime = millis();
        this.isTriggering = true;
        this.triggerTarget = this.maxAmplitude * intensity
    }

    draw() {

        this.calculatePullPoint();

        this.checkForStringTrigger();

        noFill();
        strokeWeight(this.thickness);

        beginShape();
        vertex(this.stringStart.x, this.stringStart.y);
        let test = bezierVertex(this.pullPoint.x, this.pullPoint.y, this.pullPoint.x, this.pullPoint.y, this.stringEnd.x, this.stringEnd.y);
        endShape();
    }

    calculatePullPoint() {
        this.sinRamp += this.increment;
        this.pullPoint.y = this.midPoint.y + sin(this.sinRamp) * this.currentAmplitude;
        if (this.isTriggering) {
            // ramp out to target amplitude
            this.currentAmplitude += 10;
            if (this.currentAmplitude >= this.triggerTarget) {
                this.currentAmplitude = this.triggerTarget;
                this.isTriggering = false;
            }
        } else {
            // dampen
            this.currentAmplitude *= this.damping;
        }
        if (this.currentAmplitude != 0 && this.currentAmplitude < 1) {
            this.currentAmplitude = 0;
            this.isOscillating = false;
        }
    }

    isPointAboveString(x, y) {
        return y < (this.pullPoint.y - this.midPoint.y) * sin((x - this.stringStart.x) * PI / (this.stringEnd.x - this.stringStart.x)) + this.midPoint.y;
    }

    checkForStringTrigger() {
        if (mouseX < this.stringStart.x || mouseX > this.stringEnd.x)
            return; // outside string horizontal bounds

        let mouseSpeedY = constrain(abs(mouseY - pmouseY), this.minMouseSpeed, this.maxMouseSpeed);
        mouseSpeedY -= this.minMouseSpeed;
        mouseSpeedY /= this.maxMouseSpeed; // normalise

        if (mouseSpeedY == 0)
            return; // not moving vertically

        let currentlyAboveString = this.isPointAboveString(mouseX, mouseY);
        let previouslyAboveString = this.isPointAboveString(pmouseX, pmouseY);
        if (currentlyAboveString != previouslyAboveString) {
            this.triggerString(mouseSpeedY, currentlyAboveString);
        }
    }

}