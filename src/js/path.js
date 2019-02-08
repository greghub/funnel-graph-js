import { roundPoint } from './number';

const createCurves = (x1, y1, x2, y2) => ` C${roundPoint((x2 + x1) / 2)},${y1} `
    + `${roundPoint((x2 + x1) / 2)},${y2} ${x2},${y2}`;

const createVerticalCurves = (x1, y1, x2, y2) => ` C${x1},${roundPoint((y2 + y1) / 2)} `
    + `${x2},${roundPoint((y2 + y1) / 2)} ${x2},${y2}`;

export { createCurves, createVerticalCurves };
