"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SVGFunnel =
/*#__PURE__*/
function () {
  function SVGFunnel(options) {
    _classCallCheck(this, SVGFunnel);

    this.createContainer(options);
    this.color = options.color || '#2FA3C7';
    this.fillMode = _typeof(this.color) === 'object' ? 'gradient' : 'solid';
    this.gradientId = this.container.dataset.gradient || 'funnelGradient';
    this.gradientDirection = options.gradientDirection && options.gradientDirection === 'vertical' ? 'vertical' : 'horizontal';
    this.direction = options.direction && options.direction === 'vertical' ? 'vertical' : 'horizontal';
    this.labels = SVGFunnel.getLabels(options);
    this.values = SVGFunnel.getValues(options);
    this.createPercentages(this.values);
    this.colors = SVGFunnel.createColors(options.data);
    this.draw();
  }

  _createClass(SVGFunnel, [{
    key: "addLabels",
    value: function addLabels() {
      var _this = this;

      this.container.style.position = 'relative';
      var holder = document.createElement('div');
      holder.setAttribute('class', 'svg-funnel-js__labels');
      this.percentages.forEach(function (percentage, index) {
        var labelElement = document.createElement('div');
        labelElement.setAttribute('class', "svg-funnel-js__label label-".concat(index + 1));
        var title = document.createElement('div');
        title.setAttribute('class', 'label__title');
        title.textContent = _this.labels[index] || '';
        var value = document.createElement('div');
        value.setAttribute('class', 'label__value');
        value.textContent = _this.values[index];
        var percentageValue = document.createElement('div');
        percentageValue.setAttribute('class', 'label__percentage');
        percentageValue.textContent = "".concat(percentage.toString(), "%");
        labelElement.appendChild(title);
        labelElement.appendChild(value);
        labelElement.appendChild(percentageValue);
        holder.appendChild(labelElement);
      });
      this.container.appendChild(holder);
    }
  }, {
    key: "createContainer",
    value: function createContainer(options) {
      if (!options.container) {
        throw new Error('Container is missing');
      }

      this.container = document.querySelector(options.container);
      this.container.classList.add('svg-funnel-js');

      if (options.direction === 'vertical') {
        this.container.classList.add('svg-funnel-js--vertical');
      }
    }
  }, {
    key: "createPercentages",
    value: function createPercentages(values) {
      var max = Math.max.apply(Math, _toConsumableArray(values));
      this.percentages = values.map(function (percent) {
        return SVGFunnel.roundPoint(percent * 100 / max);
      });
      return this.percentages;
    }
  }, {
    key: "applyGradient",
    value: function applyGradient(svg, path, colors, index) {
      var defs = svg.querySelector('defs') === null ? SVGFunnel.createSVGElement('defs', svg) : svg.querySelector('defs');
      var gradientName = this.gradientId + index;
      var gradient = SVGFunnel.createSVGElement('linearGradient', defs, {
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

      var numberOfColors = colors.length;

      for (var i = 0; i < numberOfColors; i++) {
        SVGFunnel.createSVGElement('stop', gradient, {
          'stop-color': colors[i],
          offset: "".concat(Math.round(100 * i / (numberOfColors - 1)), "%")
        });
      }

      SVGFunnel.setAttrs(path, {
        fill: "url(\"#".concat(gradientName, "\")"),
        stroke: "url(\"#".concat(gradientName, "\")")
      });
    }
  }, {
    key: "makeSVG",
    value: function makeSVG() {
      var svg = SVGFunnel.createSVGElement('svg', this.container, {
        width: this.getWidth(),
        height: this.getHeight()
      });
      var valuesNum = this.values.length;

      for (var i = 0; i < valuesNum; i++) {
        var path = SVGFunnel.createSVGElement('path', svg);

        if (this.fillMode === 'solid') {
          SVGFunnel.setAttrs(path, {
            fill: this.color,
            stroke: this.color
          });
        } else if (this.fillMode === 'gradient') {
          var colors = this.colors[i];
          this.applyGradient(svg, path, colors, i + 1);
        }

        svg.appendChild(path);
      }

      this.container.appendChild(svg);
    }
  }, {
    key: "getSVG",
    value: function getSVG() {
      var svg = this.container.querySelector('svg');

      if (!svg) {
        throw new Error('No SVG found inside of the container');
      }

      return svg;
    }
  }, {
    key: "getWidth",
    value: function getWidth() {
      return this.container.clientWidth;
    }
  }, {
    key: "getHeight",
    value: function getHeight() {
      return this.container.clientHeight;
    }
  }, {
    key: "getYPoints",
    value: function getYPoints() {
      var dimension = this.direction === 'vertical' ? this.getWidth() / 2 : this.getHeight() / 2;
      var percentages = this.percentages.concat(this.percentages[this.percentages.length - 1]);
      return percentages.map(function (percent) {
        return SVGFunnel.roundPoint((100 - percent) / 100 * dimension);
      });
    }
  }, {
    key: "getXPoints",
    value: function getXPoints() {
      var YLength = this.percentages.length + 1;
      var XPoints = [];
      var dimension = this.direction === 'vertical' ? this.getHeight() : this.getWidth();

      for (var i = 0; i < YLength; i++) {
        XPoints.push(SVGFunnel.roundPoint(dimension * i / (YLength - 1)));
      }

      return XPoints;
    }
  }, {
    key: "draw",
    value: function draw() {
      var _this2 = this;

      this.makeSVG();
      var svg = this.getSVG();
      this.addLabels();
      var paths = svg.querySelectorAll('path');
      var height = this.getHeight();
      var width = this.getWidth();
      var X = this.getXPoints();
      var Y = this.getYPoints();
      paths.forEach(function (path, index) {
        var offset = 0;
        var heightNew = height;

        if (index === 1) {
          heightNew = height / 2;
          offset = height / 4;
        }

        if (index === 2) {
          heightNew = height / 4;
          offset = height * 3 / 8;
        }

        var d = _this2.direction === 'vertical' ? SVGFunnel.createVerticalPath(X, Y, width) : SVGFunnel.createPath(X, Y, height, offset, heightNew / height);
        path.setAttribute('d', d);
      });
    }
  }], [{
    key: "getLabels",
    value: function getLabels(options) {
      if (!options.data) {
        throw new Error('Data is missing');
      }

      var data = options.data;

      if (data instanceof Array) {
        if (Number.isInteger(data[0])) {
          return [];
        }

        return data.map(function (item) {
          return item.label;
        });
      }

      if (_typeof(data) === 'object') {
        return Object.keys(options.data);
      }

      return [];
    }
  }, {
    key: "getValues",
    value: function getValues(options) {
      if (!options.data) {
        return [];
      }

      var data = options.data;

      if (data instanceof Array) {
        if (Number.isInteger(data[0])) {
          return data;
        }

        return data.map(function (item) {
          return item.value;
        });
      }

      if (_typeof(data) === 'object') {
        return Object.values(options.data);
      }

      return [];
    }
  }, {
    key: "createColors",
    value: function createColors(values) {
      return values.map(function (value) {
        return value.color;
      });
    }
  }, {
    key: "createSVGElement",
    value: function createSVGElement(element, container, attributes) {
      var el = document.createElementNS('http://www.w3.org/2000/svg', element);

      if (_typeof(attributes) === 'object') {
        SVGFunnel.setAttrs(el, attributes);
      }

      if (typeof container !== 'undefined') {
        container.appendChild(el);
      }

      return el;
    }
  }, {
    key: "roundPoint",
    value: function roundPoint(number) {
      return Math.round(number * 10) / 10;
    }
  }, {
    key: "setAttrs",
    value: function setAttrs(element, attributes) {
      if (_typeof(attributes) === 'object') {
        Object.keys(attributes).forEach(function (key) {
          element.setAttribute(key, attributes[key]);
        });
      }
    }
  }, {
    key: "createVerticalPath",
    value: function createVerticalPath(X, Y, width) {
      var d = 'M';
      var i = 0;

      for (i; i < X.length; i++) {
        if (i === 0) {
          d += "".concat(X[i], ",").concat(Y[i]);
        } else {
          d += " C".concat(Y[i - 1], ",").concat((X[i] + X[i - 1]) / 2, " ");
          d += "".concat(Y[i], ",").concat((X[i] + X[i - 1]) / 2, " ");
          d += "".concat(Y[i], ",").concat(X[i]);
        }
      }

      d += " h".concat(SVGFunnel.roundPoint(width - Y[Y.length - 1] * 2), " M");

      for (i = X.length - 1; i >= 0; i--) {
        if (i === X.length - 1) {
          d += "".concat(width - Y[i], ",").concat(X[i]);
        } else {
          d += " C".concat(width - Y[i + 1], ",").concat((X[i] + X[i + 1]) / 2, " ");
          d += "".concat(width - Y[i], ",").concat((X[i] + X[i + 1]) / 2, " ");
          d += "".concat(width - Y[i], ",").concat(X[i]);
        }
      }

      d += " L".concat(X[0], ",").concat(Y[0]);
      return d;
    }
  }, {
    key: "createPath",
    value: function createPath(X, Y, height) {
      var offset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var k = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
      var d = 'M';
      var i = 0;

      for (i; i < X.length; i++) {
        if (i === 0) {
          d += "".concat(X[i], ",").concat(Y[i] * k + offset);
        } else {
          d += " C".concat((X[i] + X[i - 1]) / 2, ",").concat(Y[i - 1] * k + offset, " ");
          d += "".concat((X[i] + X[i - 1]) / 2, ",").concat(Y[i] * k + offset, " ");
          d += "".concat(X[i], ",").concat(Y[i] * k + offset);
        }
      }

      d += " v".concat(SVGFunnel.roundPoint(height - (Y[Y.length - 1] * k + offset) * 2), " M");

      for (i = X.length - 1; i >= 0; i--) {
        if (i === X.length - 1) {
          d += "".concat(X[i], ",").concat(height - (Y[i] * k + offset));
        } else {
          d += " C".concat((X[i] + X[i + 1]) / 2, ",").concat(height - (Y[i + 1] * k + offset), " ");
          d += "".concat((X[i] + X[i + 1]) / 2, ",").concat(height - (Y[i] * k + offset), " ");
          d += "".concat(X[i], ",").concat(height - (Y[i] * k + offset));
        }
      }

      d += " L".concat(X[0], ",").concat(Y[0] * k + offset);
      return d;
    }
  }, {
    key: "createPathAnimation",
    value: function createPathAnimation(X, Y, height) {
      var d = 'M';
      var i = 0;
      var center = SVGFunnel.roundPoint(height / 2);

      for (i; i < X.length; i++) {
        if (i === 0) {
          d += "".concat(X[i], ",").concat(center);
        } else {
          d += " C".concat((X[i] + X[i - 1]) / 2, ",").concat(center, " ");
          d += "".concat((X[i] + X[i - 1]) / 2, ",").concat(center, " ");
          d += "".concat(X[i], ",").concat(center);
        }
      }

      d += ' v0 M';

      for (i = X.length - 1; i >= 0; i--) {
        if (i === X.length - 1) {
          d += "".concat(X[i], ",").concat(center);
        } else {
          d += " C".concat((X[i] + X[i + 1]) / 2, ",").concat(center, " ");
          d += "".concat((X[i] + X[i + 1]) / 2, ",").concat(center, " ");
          d += "".concat(X[i], ",").concat(center);
        }
      }

      d += " L".concat(X[0], ",").concat(center);
      return d;
    }
  }]);

  return SVGFunnel;
}();

window.SVGFunnel = SVGFunnel;