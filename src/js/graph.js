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

export { generateLegendBackground };
