const generateLegendBackground = (color, direction = 'horizontal') => {
    if (typeof color === 'string') {
        return `background-color: ${color}`;
    }

    if (color.length === 1) {
        return `background-color: ${color[0]}`;
    }

    return `background-image: linear-gradient(${direction === 'horizontal'
        ? 'to right, '
        : ''}${color.join(', ')})`;
};

const defaultColors = ['#FF4589', '#FF5050',
    '#05DF9D', '#4FF2FD',
    '#2D9CDB', '#A0BBFF',
    '#FFD76F', '#F2C94C',
    '#FF9A9A', '#FFB178'];

const getDefaultColors = (number) => {
    const colors = [...defaultColors];
    const colorSet = [];

    for (let i = 0; i < number; i++) {
        // get a random color
        const index = Math.abs(Math.round(Math.random() * (colors.length - 1)));
        // push it to the list
        colorSet.push(colors[index]);
        // and remove it, so that it is not chosen again
        colors.splice(index, 1);
    }
    return colorSet;
};

/*
    Used in comparing existing values to value provided on update
    It is limited to comparing arrays on purpose
    Name is slightly unusual, in order not to be confused with Lodash method
 */
const areEqual = (value, newValue) => {
    // If values are not of the same type
    const type = Object.prototype.toString.call(value);
    if (type !== Object.prototype.toString.call(newValue)) return false;
    if (type !== '[object Array]') return false;

    if (value.length !== newValue.length) return false;

    for (let i = 0; i < value.length; i++) {
        if (value[i] !== newValue[i]) return false;
    }

    return true;
};

export { generateLegendBackground, getDefaultColors, areEqual };
