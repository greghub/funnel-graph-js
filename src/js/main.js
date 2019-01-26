class SVGFunnel {
    constructor(options) {
        this.createContainer(options);
        this.color = options.color || '#2FA3C7';
        this.fillMode = (typeof this.color === 'object') ? 'gradient' : 'solid';
        this.gradientId = this.container.dataset.gradient || 'funnelGradient';
        this.gradientDirection = (options.gradientDirection && options.gradientDirection === 'vertical') ? 'vertical' : 'horizontal';
        this.direction = (options.direction && options.direction === 'vertical') ? 'vertical' : 'horizontal';
        this.labels = SVGFunnel.getLabels(options);
        this.values = SVGFunnel.getValues(options);
        this.createPercentages(this.values);
        this.colors = SVGFunnel.createColors(options.data);
        this.draw();
    }

    static getLabels(options) {
        if (!options.data) {
            throw new Error('Data is missing');
        }

        const { data } = options;

        if (data instanceof Array) {
            if (Number.isInteger(data[0])) {
                return [];
            }
            return data.map(item => item.label);
        }
        if (typeof data === 'object') {
            return Object.keys(options.data);
        }

        return [];
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
            value.textContent = this.values[index];

            const percentageValue = document.createElement('div');
            percentageValue.setAttribute('class', 'label__percentage');
            percentageValue.textContent = `${percentage.toString()}%`;

            labelElement.appendChild(title);
            labelElement.appendChild(value);
            labelElement.appendChild(percentageValue);

            holder.appendChild(labelElement);
        });

        this.container.appendChild(holder);
    }

    createContainer(options) {
        if (!options.container) {
            throw new Error('Container is missing');
        }

        this.container = document.querySelector(options.container);
        this.container.classList.add('svg-funnel-js');

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
            return Object.values(options.data);
        }

        return [];
    }

    createPercentages(values) {
        const max = Math.max(...values);

        this.percentages = values.map(percent => SVGFunnel.roundPoint(percent * 100 / max));

        return this.percentages;
    }

    static createColors(values) {
        return values.map(value => value.color);
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

    static setAttrs(element, attributes) {
        if (typeof attributes === 'object') {
            Object.keys(attributes).forEach((key) => {
                element.setAttribute(key, attributes[key]);
            });
        }
    }

    applyGradient(svg, path, colors, index) {
        const defs = (svg.querySelector('defs') === null) ? SVGFunnel.createSVGElement('defs', svg) : svg.querySelector('defs');
        const gradientName = this.gradientId + index;
        const gradient = SVGFunnel.createSVGElement('linearGradient', defs, {
            id: gradientName,
        });

        if (this.gradientDirection === 'vertical') {
            SVGFunnel.setAttrs(gradient, {
                x1: '0',
                x2: '0',
                y1: '0',
                y2: '1',
            });
        }

        const numberOfColors = colors.length;

        for (let i = 0; i < numberOfColors; i++) {
            SVGFunnel.createSVGElement('stop', gradient, {
                'stop-color': colors[i],
                offset: `${Math.round(100 * i / (numberOfColors - 1))}%`,
            });
        }

        SVGFunnel.setAttrs(path, {
            fill: `url("#${gradientName}")`,
            stroke: `url("#${gradientName}")`,
        });
    }

    makeSVG() {
        const svg = SVGFunnel.createSVGElement('svg', this.container, {
            width: this.getWidth(),
            height: this.getHeight(),
        });

        const valuesNum = this.values.length;
        for (let i = 0; i < valuesNum; i++) {
            const path = SVGFunnel.createSVGElement('path', svg);

            if (this.fillMode === 'solid') {
                SVGFunnel.setAttrs(path, {
                    fill: this.color,
                    stroke: this.color,
                });
            } else if (this.fillMode === 'gradient') {
                const colors = this.colors[i];
                this.applyGradient(svg, path, colors, i + 1);
            }

            svg.appendChild(path);
        }

        this.container.appendChild(svg);
    }

    getSVG() {
        const svg = this.container.querySelector('svg');

        if (!svg) {
            throw new Error('No SVG found inside of the container');
        }

        return svg;
    }

    getWidth() {
        return this.container.clientWidth;
    }

    getHeight() {
        return this.container.clientHeight;
    }

    getYPoints() {
        const dimension = this.direction === 'vertical' ? this.getWidth() / 2 : this.getHeight() / 2;
        const percentages = this.percentages.concat(this.percentages[this.percentages.length - 1]);
        return percentages.map(percent => SVGFunnel.roundPoint((100 - percent) / 100 * dimension));
    }

    getXPoints() {
        const YLength = this.percentages.length + 1;
        const XPoints = [];
        const dimension = this.direction === 'vertical' ? this.getHeight() : this.getWidth();
        for (let i = 0; i < YLength; i++) {
            XPoints.push(SVGFunnel.roundPoint(dimension * i / (YLength - 1)));
        }
        return XPoints;
    }

    static createVerticalPath(X, Y, width) {
        let d = 'M';
        let i = 0;

        for (i; i < X.length; i++) {
            if (i === 0) {
                d += `${X[i]},${Y[i]}`;
            } else {
                d += ` C${Y[i - 1]},${(X[i] + X[i - 1]) / 2} `;
                d += `${Y[i]},${(X[i] + X[i - 1]) / 2} `;
                d += `${Y[i]},${X[i]}`;
            }
        }

        d += ` h${SVGFunnel.roundPoint(width - Y[Y.length - 1] * 2)} M`;

        for (i = X.length - 1; i >= 0; i--) {
            if (i === X.length - 1) {
                d += `${width - Y[i]},${X[i]}`;
            } else {
                d += ` C${width - Y[i + 1]},${(X[i] + X[i + 1]) / 2} `;
                d += `${width - Y[i]},${(X[i] + X[i + 1]) / 2} `;
                d += `${width - Y[i]},${X[i]}`;
            }
        }

        d += ` L${X[0]},${Y[0]}`;

        return d;
    }

    static createPath(X, Y, height, offset = 0, k = 1) {
        let d = 'M';
        let i = 0;

        for (i; i < X.length; i++) {
            if (i === 0) {
                d += `${X[i]},${Y[i] * k + offset}`;
            } else {
                d += ` C${(X[i] + X[i - 1]) / 2},${Y[i - 1] * k + offset} `;
                d += `${(X[i] + X[i - 1]) / 2},${Y[i] * k + offset} `;
                d += `${X[i]},${Y[i] * k + offset}`;
            }
        }

        d += ` v${SVGFunnel.roundPoint(height - (Y[Y.length - 1] * k + offset) * 2)} M`;

        for (i = X.length - 1; i >= 0; i--) {
            if (i === X.length - 1) {
                d += `${X[i]},${height - (Y[i] * k + offset)}`;
            } else {
                d += ` C${(X[i] + X[i + 1]) / 2},${height - (Y[i + 1] * k + offset)} `;
                d += `${(X[i] + X[i + 1]) / 2},${height - (Y[i] * k + offset)} `;
                d += `${X[i]},${height - (Y[i] * k + offset)}`;
            }
        }

        d += ` L${X[0]},${Y[0] * k + offset}`;

        return d;
    }

    static createPathAnimation(X, Y, height) {
        let d = 'M';
        let i = 0;
        const center = SVGFunnel.roundPoint(height / 2);

        for (i; i < X.length; i++) {
            if (i === 0) {
                d += `${X[i]},${center}`;
            } else {
                d += ` C${(X[i] + X[i - 1]) / 2},${center} `;
                d += `${(X[i] + X[i - 1]) / 2},${center} `;
                d += `${X[i]},${center}`;
            }
        }

        d += ' v0 M';

        for (i = X.length - 1; i >= 0; i--) {
            if (i === X.length - 1) {
                d += `${X[i]},${center}`;
            } else {
                d += ` C${(X[i] + X[i + 1]) / 2},${center} `;
                d += `${(X[i] + X[i + 1]) / 2},${center} `;
                d += `${X[i]},${center}`;
            }
        }

        d += ` L${X[0]},${center}`;

        return d;
    }

    draw() {
        this.makeSVG();
        const svg = this.getSVG();

        this.addLabels();

        const paths = svg.querySelectorAll('path');
        const height = this.getHeight();
        const width = this.getWidth();
        const X = this.getXPoints();
        const Y = this.getYPoints();

        paths.forEach((path, index) => {
            let offset = 0;
            let heightNew = height;
            if (index === 1) {
                heightNew = height / 2;
                offset = height / 4;
            }
            if (index === 2) {
                heightNew = height / 4;
                offset = height * 3 / 8;
            }
            const d = this.direction === 'vertical' ? SVGFunnel.createVerticalPath(X, Y, width) : SVGFunnel.createPath(X, Y, height, offset, heightNew / height);
            path.setAttribute('d', d);
        });
    }
}

window.SVGFunnel = SVGFunnel;
