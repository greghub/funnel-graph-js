/* eslint-disable no-trailing-spaces */
/* global HTMLElement */
import { roundPoint, formatNumber } from './number';
import { createPath, createVerticalPath } from './path';
import {
    generateLegendBackground, getDefaultColors, createSVGElement, setAttrs, removeAttrs
} from './graph';
import generateRandomIdString from './random';

class FunnelGraph {
    constructor(options) {
        this.containerSelector = options.container;
        this.gradientDirection = (options.gradientDirection && options.gradientDirection === 'vertical')
            ? 'vertical'
            : 'horizontal';
        this.direction = (options.direction && options.direction === 'vertical') ? 'vertical' : 'horizontal';
        this.labels = FunnelGraph.getLabels(options);
        this.subLabels = FunnelGraph.getSubLabels(options);
        this.values = FunnelGraph.getValues(options);
        this.percentages = this.createPercentages();
        this.colors = options.data.colors || getDefaultColors(this.is2d() ? this.getSubDataSize() : 2);
        this.displayPercent = options.displayPercent || false;
        this.data = options.data;
        this.height = options.height;
        this.width = options.width;
        this.subLabelValue = options.subLabelValue || 'percent';
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
            points.push(roundPoint(fullDimension * i / size));
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
            points.push(totalValues.map(value => roundPoint((max - value) / max * dimension)));
            // percentages with duplicated last value
            const percentagesFull = this.getPercentages2d();
            const pointsOfFirstPath = points[0];

            for (let i = 1; i < this.getSubDataSize(); i++) {
                const p = points[i - 1];
                const newPoints = [];

                for (let j = 0; j < this.getDataSize(); j++) {
                    newPoints.push(roundPoint(
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
            points.push(values.map(value => roundPoint((max - value) / max * dimension)));
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
            value.textContent = formatNumber(valueNumber);

            const percentageValue = document.createElement('div');
            percentageValue.setAttribute('class', 'label__percentage');
            percentageValue.textContent = `${percentage.toString()}%`;

            labelElement.appendChild(value);
            labelElement.appendChild(title);
            if (this.displayPercent) {
                labelElement.appendChild(percentageValue);
            }

            if (this.is2d()) {
                const segmentPercentages = document.createElement('div');
                segmentPercentages.setAttribute('class', 'label__segment-percentages');
                let percentageList = '<ul class="segment-percentage__list">';

                const twoDimPercentages = this.getPercentages2d();

                this.subLabels.forEach((subLabel, j) => {
                    const subLabelDisplayValue = this.subLabelValue === 'percent'
                        ? `${twoDimPercentages[index][j]}%`
                        : formatNumber(this.values[index][j]);
                    percentageList += `<li>${this.subLabels[j]}:
    <span class="percentage__list-label">${subLabelDisplayValue}</span>
 </li>`;
                });
                percentageList += '</ul>';
                segmentPercentages.innerHTML = percentageList;
                labelElement.appendChild(segmentPercentages);
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
    <div class="svg-funnel-js__subLabel--color"
        style="${generateLegendBackground(this.colors[index], this.gradientDirection)}"></div>
    <div class="svg-funnel-js__subLabel--title">${subLabel}</div>
</div>`;
            });

            subLabelsHolder.innerHTML = subLabelsHTML;
            this.container.appendChild(subLabelsHolder);
        }
    }

    createContainer() {
        if (!this.containerSelector) {
            throw new Error('Container is missing');
        }

        if (typeof this.containerSelector === 'string') {
            this.container = document.querySelector(this.containerSelector);
            if (!this.container) {
                throw new Error(`Container cannot be found (selector: ${this.containerSelector}).`);
            }
        } else if (this.container instanceof HTMLElement) {
            this.container = this.containerSelector;
        } else {
            throw new Error('Container must either be a selector string or an HTMLElement.');
        }

        this.container.classList.add('svg-funnel-js');

        this.graphContainer = document.createElement('div');
        this.graphContainer.classList.add('svg-funnel-js__container');
        this.container.appendChild(this.graphContainer);

        if (this.direction === 'vertical') {
            this.container.classList.add('svg-funnel-js--vertical');
        }
    }

    setValues(v) {
        this.values = v;
        return this;
    }

    setDirection(d) {
        this.direction = d;
        return this;
    }

    setHeight(h) {
        this.height = h;
        return this;
    }

    setWidth(w) {
        this.width = w;
        return this;
    }

    static getValues(options) {
        if (!options.data) {
            return [];
        }

        const { data } = options;

        if (typeof data === 'object') {
            return data.values;
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
            percentages.push(valueSet.map(value => (total === 0 ? 0 : roundPoint(value * 100 / total))));
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
        return values.map(value => (value === 0 ? 0 : roundPoint(value * 100 / max)));
    }

    applyGradient(svg, path, colors, index) {
        const defs = (svg.querySelector('defs') === null)
            ? createSVGElement('defs', svg)
            : svg.querySelector('defs');

        const gradientName = generateRandomIdString(`funnelGradient-${index}-`);

        const gradient = createSVGElement('linearGradient', defs, {
            id: gradientName
        });

        if (this.gradientDirection === 'vertical') {
            setAttrs(gradient, {
                x1: '0',
                x2: '0',
                y1: '0',
                y2: '1'
            });
        }

        const numberOfColors = colors.length;

        for (let i = 0; i < numberOfColors; i++) {
            createSVGElement('stop', gradient, {
                'stop-color': colors[i],
                offset: `${Math.round(100 * i / (numberOfColors - 1))}%`
            });
        }

        setAttrs(path, {
            fill: `url("#${gradientName}")`,
            stroke: `url("#${gradientName}")`
        });
    }

    makeSVG() {
        const svg = createSVGElement('svg', this.graphContainer, {
            width: this.getWidth(),
            height: this.getHeight()
        });

        const valuesNum = this.getCrossAxisPoints().length - 1;
        for (let i = 0; i < valuesNum; i++) {
            const path = createSVGElement('path', svg);

            const color = (this.is2d()) ? this.colors[i] : this.colors;
            const fillMode = (typeof color === 'string' || color.length === 1) ? 'solid' : 'gradient';

            if (fillMode === 'solid') {
                setAttrs(path, {
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
        return this.width || this.graphContainer.clientWidth;
    }

    getHeight() {
        return this.height || this.graphContainer.clientHeight;
    }

    getPathDefinitions() {
        const valuesNum = this.getCrossAxisPoints().length - 1;
        const paths = [];
        for (let i = 0; i < valuesNum; i++) {
            if (this.isVertical()) {
                const X = this.getCrossAxisPoints()[i];
                const XNext = this.getCrossAxisPoints()[i + 1];
                const Y = this.getMainAxisPoints();

                const d = createVerticalPath(i, X, XNext, Y);
                paths.push(d);
            } else {
                const X = this.getMainAxisPoints();
                const Y = this.getCrossAxisPoints()[i];
                const YNext = this.getCrossAxisPoints()[i + 1];

                const d = createPath(i, X, Y, YNext);
                paths.push(d);
            }
        }

        return paths;
    }

    getPathMedian(i) {
        if (this.isVertical()) {
            const cross = this.getCrossAxisPoints()[i];
            const next = this.getCrossAxisPoints()[i + 1];
            const Y = this.getMainAxisPoints();
            const X = [];
            const XNext = [];

            cross.forEach((point, index) => {
                const m = (point + next[index]) / 2;
                X.push(m - 1);
                XNext.push(m + 1);
            });

            return createVerticalPath(i, X, XNext, Y);
        }

        const X = this.getMainAxisPoints();
        const cross = this.getCrossAxisPoints()[i];
        const next = this.getCrossAxisPoints()[i + 1];
        const Y = [];
        const YNext = [];

        cross.forEach((point, index) => {
            const m = (point + next[index]) / 2;
            Y.push(m - 1);
            YNext.push(m + 1);
        });

        return createPath(i, X, Y, YNext);
    }

    drawPaths() {
        const svg = this.getSVG();
        const paths = svg.querySelectorAll('path');
        const definitions = this.getPathDefinitions();

        definitions.forEach((definition, index) => {
            paths[index].setAttribute('d', definition);
        });
    }

    draw() {
        this.createContainer();
        this.makeSVG();

        this.addLabels();

        if (this.is2d()) {
            this.addSubLabels();
        }

        this.drawPaths();
    }

    /*
        Methods
     */

    makeVertical() {
        if (this.direction === 'vertical') return true;

        this.direction = 'vertical';
        this.container.classList.add('svg-funnel-js--vertical');

        const svg = this.getSVG();
        const height = this.getHeight();
        const width = this.getWidth();
        setAttrs(svg, { height, width });

        this.drawPaths();

        return true;
    }

    makeHorizontal() {
        if (this.direction === 'horizontal') return true;

        this.direction = 'horizontal';
        this.container.classList.remove('svg-funnel-js--vertical');

        const svg = this.getSVG();
        const height = this.getHeight();
        const width = this.getWidth();
        setAttrs(svg, { height, width });

        this.drawPaths();

        return true;
    }

    toggleDirection() {
        if (this.direction === 'horizontal') {
            this.makeVertical();
        } else {
            this.makeHorizontal();
        }
    }

    gradientMakeVertical() {
        if (this.gradientDirection === 'vertical') return true;

        this.gradientDirection = 'vertical';
        const gradients = this.graphContainer.querySelectorAll('linearGradient');

        for (let i = 0; i < gradients.length; i++) {
            setAttrs(gradients[i], {
                x1: '0',
                x2: '0',
                y1: '0',
                y2: '1'
            });
        }

        return true;
    }

    gradientMakeHorizontal() {
        if (this.gradientDirection === 'horizontal') return true;

        this.gradientDirection = 'horizontal';
        const gradients = this.graphContainer.querySelectorAll('linearGradient');

        for (let i = 0; i < gradients.length; i++) {
            removeAttrs(gradients[i], 'x1', 'x2', 'y1', 'y2');
        }

        return true;
    }

    gradientToggleDirection() {
        if (this.gradientDirection === 'horizontal') {
            this.gradientMakeVertical();
        } else {
            this.gradientMakeHorizontal();
        }
    }

    updateWidth(w) {
        this.width = w;
        const svg = this.getSVG();
        const width = this.getWidth();
        setAttrs(svg, { width });

        this.drawPaths();

        return true;
    }

    updateHeight(h) {
        this.height = h;
        const svg = this.getSVG();
        const height = this.getHeight();
        setAttrs(svg, { height });

        this.drawPaths();

        return true;
    }

    // @TODO: refactor data update
    updateData(d) {
        const labels = this.container.querySelector('.svg-funnel-js__labels');
        const subLabels = this.container.querySelector('.svg-funnel-js__subLabels');

        if (labels) labels.remove();
        if (subLabels) subLabels.remove();

        this.labels = [];
        this.colors = getDefaultColors(this.is2d() ? this.getSubDataSize() : 2);
        this.values = [];
        this.percentages = [];

        if (typeof d.labels !== 'undefined') {
            this.labels = FunnelGraph.getLabels({ data: d });
        }
        if (typeof d.colors !== 'undefined') {
            this.colors = d.colors || getDefaultColors(this.is2d() ? this.getSubDataSize() : 2);
        }
        if (typeof d.values !== 'undefined') {
            if (Object.prototype.toString.call(d.values[0]) !== Object.prototype.toString.call(this.values[0])) {
                this.container.querySelector('svg').remove();
                this.values = FunnelGraph.getValues({ data: d });
                this.makeSVG();
            } else {
                this.values = FunnelGraph.getValues({ data: d });
            }
            this.drawPaths();
        }
        this.percentages = this.createPercentages();

        this.addLabels();

        if (typeof d.subLabels !== 'undefined') {
            this.subLabels = FunnelGraph.getSubLabels({ data: d });
            this.addSubLabels();
        }
    }

    update(o) {
        if (typeof o.displayPercent !== 'undefined') {
            if (this.displayPercent !== o.displayPercent) {
                if (this.displayPercent === true) {
                    this.container.querySelectorAll('.label__percentage').forEach((label) => {
                        label.remove();
                    });
                } else {
                    this.container.querySelectorAll('.svg-funnel-js__label').forEach((label, index) => {
                        const percentage = this.percentages[index];
                        const percentageValue = document.createElement('div');
                        percentageValue.setAttribute('class', 'label__percentage');

                        if (percentage !== 100) {
                            percentageValue.textContent = `${percentage.toString()}%`;
                            label.appendChild(percentageValue);
                        }
                    });
                }
            }
        }
        if (typeof o.height !== 'undefined') {
            this.updateHeight(o.height);
        }
        if (typeof o.width !== 'undefined') {
            this.updateWidth(o.width);
        }
        if (typeof o.gradientDirection !== 'undefined') {
            if (o.gradientDirection === 'vertical') {
                this.gradientMakeVertical();
            } else if (o.gradientDirection === 'horizontal') {
                this.gradientMakeHorizontal();
            }
        }
        if (typeof o.direction !== 'undefined') {
            if (o.direction === 'vertical') {
                this.makeVertical();
            } else if (o.direction === 'horizontal') {
                this.makeHorizontal();
            }
        }
        if (typeof o.data !== 'undefined') {
            this.updateData(o.data);
        }
    }
}

export default FunnelGraph;
