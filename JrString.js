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
    mouseAbsent = false;

    constructor(startPoint, length, thickness = 3) {
        this.thickness = thickness;
        this.stringStart = startPoint.copy();
        this.stringEnd = createVector(startPoint.x + length, startPoint.y);
        this.midPoint = createVector(
            this.stringStart.x + (this.stringEnd.x - this.stringStart.x) * 0.5,
            this.stringStart.y + (this.stringEnd.y - this.stringStart.y) * 0.5
        );
        this.pullPoint = this.midPoint.copy();

        this.maxAmplitude = length * 0.12;

        this.resetMousePosition();
    }

    /**
     * Reset mouse tracking for this string.
     * If x,y are provided they should be canvas-local coordinates (same space as p5 mouseX/mouseY).
     * This avoids relying on p5's mouseX being updated when using DOM mouseenter events.
     */
    resetMousePosition(x, y) {
        const mx = (typeof x === 'number') ? x : mouseX;
        const my = (typeof y === 'number') ? y : mouseY;
        this.isMouseAbove = this.isPointAboveString(mx, my);
        this.mouseAbsent = false;
    }

    triggerDelay = 100; // ms
    lastTriggerTime = 0;

    triggerString(intensity = 1, direction) {
        if (this.isVibrating && millis() - this.lastTriggerTime < this.triggerDelay) return;

        this.pullPoint.x = mouseX;

        this.increment = this._absIncrement * (direction ? -1 : 1);
        this.sinRamp = 0;
        this.isVibrating = true;
        this.lastTriggerTime = millis();
        this.isTriggering = true;
        this.triggerTarget = constrain(this.currentAmplitude + (this.maxAmplitude * intensity), 0, this.maxAmplitude);
    }

    draw() {

        this.calculatePullPoint();

        this.checkForStringTrigger();

        noFill();
        strokeWeight(this.thickness);

        beginShape();
        vertex(this.stringStart.x, this.stringStart.y);
        bezierVertex(this.pullPoint.x, this.pullPoint.y, this.pullPoint.x, this.pullPoint.y, this.stringEnd.x, this.stringEnd.y);
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
        const p0 = this.stringStart;
        const p1 = this.pullPoint;
        const p2 = this.stringEnd;

        return JrQuadraticHelpers.isPointAboveQuadraticBezier(x, y, p0, p1, p2);
    }

    checkForStringTrigger() {
        if (this.mouseAbsent) {
            return;
        }

        if (mouseX < this.stringStart.x || mouseX > this.stringEnd.x)
            return; // outside string horizontal bounds

        let mouseSpeedY = constrain(abs(mouseY - pmouseY), this.minMouseSpeed, this.maxMouseSpeed);
        mouseSpeedY -= this.minMouseSpeed;
        mouseSpeedY /= this.maxMouseSpeed; // normalise

        if (mouseSpeedY == 0)
            return; // not moving vertically

        let currentlyAboveString = this.isPointAboveString(mouseX, mouseY);
        let previouslyAboveString = this.isMouseAbove;
        if (currentlyAboveString != previouslyAboveString) {
            this.triggerString(mouseSpeedY, currentlyAboveString);
        }

        this.isMouseAbove = currentlyAboveString;
    }
}