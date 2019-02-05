/* eslint-disable no-trailing-spaces */

class SVGFunnel {
    constructor(options) {
        this.createContainer(options);
        this.colors = options.data.colors;
        this.gradientDirection = (options.gradientDirection && options.gradientDirection === 'vertical')
            ? 'vertical'
            : 'horizontal';
        this.direction = (options.direction && options.direction === 'vertical') ? 'vertical' : 'horizontal';
        this.labels = SVGFunnel.getLabels(options);
        this.subLabels = SVGFunnel.getSubLabels(options);
        this.values = SVGFunnel.getValues(options);
        this.percentages = this.createPercentages();
        this.displayPercent = options.displayPercent || false;

        this.draw();
    }

    /**
    An example of a two-dimensional funnel graph
    #0..................
                       ...#1................
                                           ......
    #0********************#1**                    #2.........................#3 (A)
                              *******************
                                                  #2*************************#3 (B)
                                                  #2+++++++++++++++++++++++++#3 (C)
                              +++++++++++++++++++
    #0++++++++++++++++++++#1++                    #2-------------------------#3 (D)
                                           ------
                       ---#1----------------
    #0-----------------

     Main axis is the primary axis of the graph.
     In a horizontal graph it's the X axis, and Y is the cross axis.
     However we use the names "main" and "cross" axis,
     because in a vertical graph the primary axis is the Y axis
     and the cross axis is the X axis.

     First step of drawing the funnel graph is getting the coordinates of points,
     that are used when drawing the paths.

     There are 4 paths in the example above: A, B, C and D.
     Such funnel has 3 labels and 3 subLabels.
     This means that the main axis has 4 points (number of labels + 1)
     One the ASCII illustrated graph above, those points are illustrated with a # symbol.

    */
    getMainAxisPoints() {
        const size = this.getDataSize();
        const points = [];
        const fullDimension = this.isVertical() ? this.getHeight() : this.getWidth();
        for (let i = 0; i <= size; i++) {
            points.push(SVGFunnel.roundPoint(fullDimension * i / size));
        }
        return points;
    }

    getCrossAxisPoints() {
        const points = [];
        const fullDimension = this.getFullDimension();
        // get half of the graph container height or width, since funnel shape is symmetric
        // we use this when calculating the "A" shape
        const dimension = fullDimension / 2;
        if (this.is2d()) {
            const totalValues = this.getValues2d();
            const max = Math.max(...totalValues);

            // duplicate last value
            totalValues.push([...totalValues].pop());
            // get points for path "A"
            points.push(totalValues.map(value => SVGFunnel.roundPoint((max - value) / max * dimension)));
            // percentages with duplicated last value
            const percentagesFull = this.getPercentages2d();
            const pointsOfFirstPath = points[0];

            for (let i = 1; i < this.getSubDataSize(); i++) {
                const p = points[i - 1];
                const newPoints = [];

                for (let j = 0; j < this.getDataSize(); j++) {
                    newPoints.push(SVGFunnel.roundPoint(
                        // eslint-disable-next-line comma-dangle
                        p[j] + (fullDimension - pointsOfFirstPath[j] * 2) * (percentagesFull[j][i - 1] / 100)
                    ));
                }

                // duplicate the last value as points #2 and #3 have the same value on the cross axis
                newPoints.push([...newPoints].pop());
                points.push(newPoints);
            }

            // add points for path "D", that is simply the "inverted" path "A"
            points.push(pointsOfFirstPath.map(point => fullDimension - point));
        } else {
            // As you can see on the visualization above points #2 and #3 have the same cross axis coordinate
            // so we duplicate the last value
            const max = Math.max(...this.values);
            const values = [...this.values].concat([...this.values].pop());
            // if the graph is simple (not two-dimensional) then we have only paths "A" and "D"
            // which are symmetric. So we get the points for "A" and then get points for "D" by subtracting "A"
            // points from graph cross dimension length
            points.push(values.map(value => SVGFunnel.roundPoint((max - value) / max * dimension)));
            points.push(points[0].map(point => fullDimension - point));
        }

        return points;
    }

    getGraphType() {
        return this.values && this.values[0] instanceof Array ? '2d' : 'normal';
    }

    is2d() {
        return this.getGraphType() === '2d';
    }

    isVertical() {
        return this.direction === 'vertical';
    }

    getDataSize() {
        return this.values.length;
    }

    getSubDataSize() {
        return this.values[0].length;
    }

    getFullDimension() {
        return this.isVertical() ? this.getWidth() : this.getHeight();
    }

    generateLegendBackground(index) {
        const color = this.colors[index];

        if (typeof color === 'string') {
            return `background-color: ${color}`;
        }

        if (color.length === 1) {
            return `background-color: ${color[0]}`;
        }

        return `background-image: linear-gradient(${this.gradientDirection === 'horizontal' 
            ? 'to right, ' 
            : ''}${color.join(', ')})`;
    }

    static getSubLabels(options) {
        if (!options.data) {
            throw new Error('Data is missing');
        }

        const { data } = options;

        if (typeof data.subLabels === 'undefined') return [];

        return data.subLabels;
    }

    static getLabels(options) {
        if (!options.data) {
            throw new Error('Data is missing');
        }

        const { data } = options;

        if (typeof data.labels === 'undefined') return [];

        return data.labels;
    }

    addLabels() {
        this.container.style.position = 'relative';

        const holder = document.createElement('div');
        holder.setAttribute('class', 'svg-funnel-js__labels');

        this.percentages.forEach((percentage, index) => {
            const labelElement = document.createElement('div');
            labelElement.setAttribute('class', `svg-funnel-js__label label-${index + 1}`);

            const title = document.createElement('div');
            title.setAttribute('class', 'label__title');
            title.textContent = this.labels[index] || '';

            const value = document.createElement('div');
            value.setAttribute('class', 'label__value');

            const valueNumber = this.is2d() ? this.getValues2d()[index] : this.values[index];
            value.textContent = SVGFunnel.formatNumber(valueNumber);

            const percentageValue = document.createElement('div');
            percentageValue.setAttribute('class', 'label__percentage');

            if (percentage !== 100) {
                percentageValue.textContent = `${percentage.toString()}%`;
            }

            labelElement.appendChild(value);
            labelElement.appendChild(title);
            if (this.displayPercent) {
                labelElement.appendChild(percentageValue);
            }

            holder.appendChild(labelElement);
        });

        this.container.appendChild(holder);
    }

    addSubLabels() {
        if (this.subLabels) {
            const subLabelsHolder = document.createElement('div');
            subLabelsHolder.setAttribute('class', 'svg-funnel-js__subLabels');

            let subLabelsHTML = '';

            this.subLabels.forEach((subLabel, index) => {
                subLabelsHTML += `<div class="svg-funnel-js__subLabel svg-funnel-js__subLabel-${index + 1}">
    <div class="svg-funnel-js__subLabel--color" style="${this.generateLegendBackground(index)}"></div>
    <div class="svg-funnel-js__subLabel--title">${subLabel}</div>
</div>`;
            });

            subLabelsHolder.innerHTML = subLabelsHTML;
            this.container.appendChild(subLabelsHolder);
        }
    }

    createContainer(options) {
        if (!options.container) {
            throw new Error('Container is missing');
        }

        this.container = document.querySelector(options.container);
        this.container.classList.add('svg-funnel-js');

        this.graphContainer = document.createElement('div');
        this.graphContainer.classList.add('svg-funnel-js__container');
        this.container.appendChild(this.graphContainer);

        if (options.direction === 'vertical') {
            this.container.classList.add('svg-funnel-js--vertical');
        }
    }

    static getValues(options) {
        if (!options.data) {
            return [];
        }

        const { data } = options;

        if (data instanceof Array) {
            if (Number.isInteger(data[0])) {
                return data;
            }
            return data.map(item => item.value);
        }
        if (typeof data === 'object') {
            return options.data.values;
        }

        return [];
    }

    getValues2d() {
        const values = [];

        this.values.forEach((valueSet) => {
            values.push(valueSet.reduce((sum, value) => sum + value, 0));
        });

        return values;
    }

    getPercentages2d() {
        const percentages = [];

        this.values.forEach((valueSet) => {
            const total = valueSet.reduce((sum, value) => sum + value, 0);
            percentages.push(valueSet.map(value => SVGFunnel.roundPoint(value * 100 / total)));
        });

        return percentages;
    }

    createPercentages() {
        let values = [];

        if (this.is2d()) {
            values = this.getValues2d();
        } else {
            values = [...this.values];
        }

        const max = Math.max(...values);
        return values.map(value => SVGFunnel.roundPoint(value * 100 / max));
    }

    static createSVGElement(element, container, attributes) {
        const el = document.createElementNS('http://www.w3.org/2000/svg', element);

        if (typeof attributes === 'object') {
            SVGFunnel.setAttrs(el, attributes);
        }

        if (typeof container !== 'undefined') {
            container.appendChild(el);
        }

        return el;
    }

    static roundPoint(number) {
        return Math.round(number * 10) / 10;
    }

    static formatNumber(number) {
        return Number(number).toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

    static createCurves(x1, y1, x2, y2) {
        return ` C${SVGFunnel.roundPoint((x2 + x1) / 2)},${y1} ${SVGFunnel.roundPoint((x2 + x1) / 2)},${y2} ${x2},${y2}`;
    }

    static createVerticalCurves(x1, y1, x2, y2) {
        return ` C${x1},${SVGFunnel.roundPoint((y2 + y1) / 2)} ${x2},${SVGFunnel.roundPoint((y2 + y1) / 2)} ${x2},${y2}`;
    }

    static setAttrs(element, attributes) {
        if (typeof attributes === 'object') {
            Object.keys(attributes).forEach((key) => {
                element.setAttribute(key, attributes[key]);
            });
        }
    }

    applyGradient(svg, path, colors, index) {
        const defs = (svg.querySelector('defs') === null)
            ? SVGFunnel.createSVGElement('defs', svg)
            : svg.querySelector('defs');
        const gradientName = `funnelGradient-${index}`;
        const gradient = SVGFunnel.createSVGElement('linearGradient', defs, {
            id: gradientName
        });

        if (this.gradientDirection === 'vertical') {
            SVGFunnel.setAttrs(gradient, {
                x1: '0',
                x2: '0',
                y1: '0',
                y2: '1'
            });
        }

        const numberOfColors = colors.length;

        for (let i = 0; i < numberOfColors; i++) {
            SVGFunnel.createSVGElement('stop', gradient, {
                'stop-color': colors[i],
                offset: `${Math.round(100 * i / (numberOfColors - 1))}%`
            });
        }

        SVGFunnel.setAttrs(path, {
            fill: `url("#${gradientName}")`,
            stroke: `url("#${gradientName}")`
        });
    }

    makeSVG() {
        const svg = SVGFunnel.createSVGElement('svg', this.graphContainer, {
            width: this.getWidth(),
            height: this.getHeight()
        });

        const valuesNum = this.getCrossAxisPoints().length - 1;
        for (let i = 0; i < valuesNum; i++) {
            const path = SVGFunnel.createSVGElement('path', svg);

            const color = (this.is2d()) ? this.colors[i] : this.colors;
            const fillMode = (typeof color === 'string' || color.length === 1) ? 'solid' : 'gradient';

            if (fillMode === 'solid') {
                SVGFunnel.setAttrs(path, {
                    fill: color,
                    stroke: color
                });
            } else if (fillMode === 'gradient') {
                this.applyGradient(svg, path, color, i + 1);
            }

            svg.appendChild(path);
        }

        this.graphContainer.appendChild(svg);
    }

    getSVG() {
        const svg = this.container.querySelector('svg');

        if (!svg) {
            throw new Error('No SVG found inside of the container');
        }

        return svg;
    }

    getWidth() {
        return this.graphContainer.clientWidth;
    }

    getHeight() {
        return this.graphContainer.clientHeight;
    }

    /*
        A funnel segment is draw in a clockwise direction.
        Path 1-2 is drawn,
        then connected with a straight vertical line 2-3,
        then a line 3-4 is draw (using YNext points going in backwards direction)
        then path is closed (connected with the starting point 1).

        1---------->2
        ^           |
        |           v
        4<----------3

        On the graph on line 20 it works like this:
        A#0, A#1, A#2, A#3, B#3, B#2, B#1, B#0, close the path.

        Points for path "B" are passed as the YNext param.
     */

    createPath(index) {
        const X = this.getMainAxisPoints();
        const Y = this.getCrossAxisPoints()[index];
        const YNext = this.getCrossAxisPoints()[index + 1];

        let str = `M${X[0]},${Y[0]}`;

        for (let i = 0; i < X.length - 1; i++) {
            str += SVGFunnel.createCurves(X[i], Y[i], X[i + 1], Y[i + 1]);
        }

        str += ` L${[...X].pop()},${[...YNext].pop()}`;

        for (let i = X.length - 1; i > 0; i--) {
            str += SVGFunnel.createCurves(X[i], YNext[i], X[i - 1], YNext[i - 1]);
        }

        str += ' Z';

        return str;
    }

    /*
        In a vertical path we go counter-clockwise

        1<----------4
        |           ^
        v           |
        2---------->3
     */

    createVerticalPath(index) {
        const X = this.getCrossAxisPoints()[index];
        const XNext = this.getCrossAxisPoints()[index + 1];
        const Y = this.getMainAxisPoints();

        let str = `M${X[0]},${Y[0]}`;

        for (let i = 0; i < X.length - 1; i++) {
            str += SVGFunnel.createVerticalCurves(X[i], Y[i], X[i + 1], Y[i + 1]);
        }

        str += ` L${[...XNext].pop()},${[...Y].pop()}`;

        for (let i = X.length - 1; i > 0; i--) {
            str += SVGFunnel.createVerticalCurves(XNext[i], Y[i], XNext[i - 1], Y[i - 1]);
        }

        str += ' Z';

        return str;
    }

    draw() {
        this.makeSVG();
        const svg = this.getSVG();

        this.addLabels();

        if (this.is2d()) {
            this.addSubLabels();
        }

        const paths = svg.querySelectorAll('path');

        for (let i = 0; i < paths.length; i++) {
            const d = this.isVertical() ? this.createVerticalPath(i) : this.createPath(i);
            paths[i].setAttribute('d', d);
        }
    }
}

window.SVGFunnel = SVGFunnel;
