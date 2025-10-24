class JrQuadraticHelpers {
    // --- Quadratic bezier helpers ---
    static quadraticBezierAt(t, p0, p1, p2) {
        // returns scalar value (x or y) of quadratic bezier at t
        const mt = 1 - t;
        return mt * mt * p0 + 2 * mt * t * p1 + t * t * p2;
    }

    static solveQuadratic(a, b, c) {
        // returns array of real roots for a*t^2 + b*t + c = 0
        const eps = 1e-12;
        if (Math.abs(a) < eps) {
            if (Math.abs(b) < eps) return []; // degenerate
            return [-c / b];
        }
        const disc = b * b - 4 * a * c;
        if (disc < -eps) return [];
        if (Math.abs(disc) < eps) return [-b / (2 * a)];
        const sd = Math.sqrt(Math.max(0, disc));
        return [(-b + sd) / (2 * a), (-b - sd) / (2 * a)];
    }

    static bezierTForX(x, x0, x1, x2) {
        // Solve for t in x(t) = x, where x(t) = (1-t)^2 x0 + 2(1-t)t x1 + t^2 x2
        // Rearranged: A t^2 + B t + C = 0
        const A = x0 - 2 * x1 + x2;
        const B = 2 * (x1 - x0);
        const C = x0 - x;
        const roots = JrQuadraticHelpers.solveQuadratic(A, B, C);
        // Filter to real roots within [0,1] (allow small epsilon)
        const eps = 1e-8;
        const ts = [];
        for (let i = 0; i < roots.length; i++) {
            const t = roots[i];
            if (t >= -eps && t <= 1 + eps) ts.push(Math.max(0, Math.min(1, t)));
        }
        return ts;
    }

    /**
     * Returns whether point (x,y) is above the quadratic bezier defined by points p0, p1, p2
     * (treats y in p5 canvas terms where y=0 is top of canvas)
     * p0/p1/p2 can be objects with x,y or arrays [x,y]
     * @returns boolean
     */
    static isPointAboveQuadraticBezier(x, y, p0, p1, p2) {
        const x0 = (p0.x !== undefined) ? p0.x : p0[0];
        const y0 = (p0.y !== undefined) ? p0.y : p0[1];
        const x1 = (p1.x !== undefined) ? p1.x : p1[0];
        const y1 = (p1.y !== undefined) ? p1.y : p1[1];
        const x2 = (p2.x !== undefined) ? p2.x : p2[0];
        const y2 = (p2.y !== undefined) ? p2.y : p2[1];

        let ts = JrQuadraticHelpers.bezierTForX(x, x0, x1, x2);
        let curveY;
        if (ts.length > 0) {
            let best = ts[0];
            for (let i = 1; i < ts.length; i++) {
                if (Math.abs(ts[i] - 0.5) < Math.abs(best - 0.5)) best = ts[i];
            }
            curveY = JrQuadraticHelpers.quadraticBezierAt(best, y0, y1, y2);
        } else {
            // fallback sampling
            let bestT = 0;
            let bestDx = Infinity;
            const steps = 200;
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const xt = JrQuadraticHelpers.quadraticBezierAt(t, x0, x1, x2);
                const dx = Math.abs(xt - x);
                if (dx < bestDx) {
                    bestDx = dx;
                    bestT = t;
                }
            }
            curveY = JrQuadraticHelpers.quadraticBezierAt(bestT, y0, y1, y2);
        }
        return y < curveY;
    }

}