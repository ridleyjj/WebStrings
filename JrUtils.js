
class JrUtils {
    /**
     * Loops a given value between min and max values, such that when it exceeds the max
     * it loops back to the min value
     * @returns The value, constrained and looped.
     */
    static constrainLoop(num, min, max) {
        if (num < min) {
            num += max - min;
        } else if (num > max) {
            num -= max - min;
        }
        return num;
    }
}
