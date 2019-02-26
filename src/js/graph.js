const setAttrs = (element, attributes) => {
    if (typeof attributes === 'object') {
        Object.keys(attributes).forEach((key) => {
            element.setAttribute(key, attributes[key]);
        });
    }
};

const removeAttrs = (element, ...attributes) => {
    attributes.forEach((attribute) => {
        element.removeAttribute(attribute);
    });
};

const createSVGElement = (element, container, attributes) => {
    const el = document.createElementNS('http://www.w3.org/2000/svg', element);

    if (typeof attributes === 'object') {
        setAttrs(el, attributes);
    }

    if (typeof container !== 'undefined') {
        container.appendChild(el);
    }

    return el;
};

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
        // if the it's a two dimensional array
        const currentType = Object.prototype.toString.call(value[i]);
        if (currentType !== Object.prototype.toString.call(newValue[i])) return false;
        if (currentType === '[object Array]') {
            // if row lengths are not equal then arrays are not equal
            if (value[i].length !== newValue[i].length) return false;
            // compare each element in the row
            for (let j = 0; j < value[i].length; j++) {
                if (value[i][j] !== newValue[i][j]) {
                    return false;
                }
            }
        } else if (value[i] !== newValue[i]) {
            // if it's a one dimensional array element
            return false;
        }
    }

    return true;
};

export {
    generateLegendBackground, getDefaultColors, areEqual, createSVGElement, setAttrs, removeAttrs, defaultColors
};
