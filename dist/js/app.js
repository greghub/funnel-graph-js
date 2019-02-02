"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* eslint-disable no-trailing-spaces */
var SVGFunnel =
/*#__PURE__*/
function () {
  function SVGFunnel(options) {
    _classCallCheck(this, SVGFunnel);

    this.createContainer(options);
    this.color = options.data.colors || '#FFB178';
    this.fillMode = _typeof(this.color) === 'object' ? 'gradient' : 'solid';
    this.gradientDirection = options.gradientDirection && options.gradientDirection === 'vertical' ? 'vertical' : 'horizontal';
    this.direction = options.direction && options.direction === 'vertical' ? 'vertical' : 'horizontal';
    this.labels = SVGFunnel.getLabels(options);
    this.values = SVGFunnel.getValues(options);
    this.percentages = this.createPercentages();
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


  _createClass(SVGFunnel, [{
    key: "getMainAxisPoints",
    value: function getMainAxisPoints() {
      var size = this.getDataSize();
      var points = [];
      var dimension = this.direction === 'vertical' ? this.getHeight() : this.getWidth();

      for (var i = 0; i <= size; i++) {
        points.push(SVGFunnel.roundPoint(dimension * i / size));
      }

      return points;
    }
  }, {
    key: "getCrossAxisPoints",
    value: function getCrossAxisPoints() {
      var points = [];
      var fullDimension = this.direction === 'vertical' ? this.getWidth() : this.getHeight(); // get half of the graph container height or width, since funnel shape is symmetric
      // we use this when calculating the "A" shape

      var dimension = fullDimension / 2;

      if (this.is2d()) {
        var totalValues = this.getValues2d();
        var max = Math.max.apply(Math, _toConsumableArray(totalValues)); // duplicate last value

        totalValues.push(_toConsumableArray(totalValues).pop()); // get points for path "A"

        points.push(totalValues.map(function (value) {
          return SVGFunnel.roundPoint((max - value) / max * dimension);
        }));
        var percentagesW = this.getPercentages2d().map(function (percentages) {
          return _toConsumableArray(percentages).concat(_toConsumableArray(percentages).pop());
        });
        percentagesW.push(_toConsumableArray(percentagesW).pop());
        var pZero = points[0];

        for (var i = 1; i < this.getSubDataSize(); i++) {
          var p = points[i - 1];
          var newPoints = [];

          for (var j = 0; j < p.length; j++) {
            newPoints.push(SVGFunnel.roundPoint( // eslint-disable-next-line comma-dangle
            p[j] + (fullDimension - pZero[j] * 2) * (percentagesW[j][i - 1] / 100)));
          }

          points.push(newPoints);
        } // add points for path "D"


        points.push(points[0].map(function (point) {
          return fullDimension - point;
        }));
      } else {
        // As you can see on the visualization above points #2 and #3 have the same cross axis coordinate
        // so we duplicate the last value
        var _max = Math.max.apply(Math, _toConsumableArray(this.values));

        var values = _toConsumableArray(this.values).concat(_toConsumableArray(this.values).pop()); // if the graph is simple (not two-dimensional) then we have only paths "A" and "D"
        // which are symmetric. So we get the points for "A" and then get points for "D" by subtracting "A"
        // points from graph cross dimension length


        points.push(values.map(function (value) {
          return SVGFunnel.roundPoint((_max - value) / _max * dimension);
        }));
        points.push(points[0].map(function (point) {
          return fullDimension - point;
        }));
      }

      return points;
    }
  }, {
    key: "getGraphType",
    value: function getGraphType() {
      return this.values && this.values[0] instanceof Array ? '2d' : 'normal';
    }
  }, {
    key: "is2d",
    value: function is2d() {
      return this.getGraphType() === '2d';
    }
  }, {
    key: "getDataSize",
    value: function getDataSize() {
      return this.values.length;
    }
  }, {
    key: "getSubDataSize",
    value: function getSubDataSize() {
      return this.values[0].length;
    }
  }, {
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
        var valueNumber = _this.is2d() ? _this.getValues2d()[index] : _this.values[index];
        value.textContent = SVGFunnel.formatNumber(valueNumber);
        var percentageValue = document.createElement('div');
        percentageValue.setAttribute('class', 'label__percentage');

        if (percentage !== 100) {
          percentageValue.textContent = "".concat(percentage.toString(), "%");
        }

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
    key: "getValues2d",
    value: function getValues2d() {
      var values = [];
      this.values.forEach(function (valueSet) {
        values.push(valueSet.reduce(function (sum, value) {
          return sum + value;
        }, 0));
      });
      return values;
    }
  }, {
    key: "getPercentages2d",
    value: function getPercentages2d() {
      var percentages = [];
      this.values.forEach(function (valueSet) {
        var total = valueSet.reduce(function (sum, value) {
          return sum + value;
        }, 0);
        percentages.push(valueSet.map(function (value) {
          return SVGFunnel.roundPoint(value * 100 / total);
        }));
      });
      return percentages;
    }
  }, {
    key: "createPercentages",
    value: function createPercentages() {
      var values = [];

      if (this.is2d()) {
        values = this.getValues2d();
      } else {
        values = _toConsumableArray(this.values);
      }

      var max = Math.max.apply(Math, _toConsumableArray(values));
      return values.map(function (value) {
        return SVGFunnel.roundPoint(value * 100 / max);
      });
    }
  }, {
    key: "applyGradient",
    value: function applyGradient(svg, path, colors, index) {
      var defs = svg.querySelector('defs') === null ? SVGFunnel.createSVGElement('defs', svg) : svg.querySelector('defs');
      var gradientName = "funnelGradient-".concat(index);
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
      } //
      // SVGFunnel.setAttrs(path, {
      //     fill: `url("#${gradientName}")`,
      //     stroke: `url("#${gradientName}")`,
      // });


      SVGFunnel.setAttrs(path, {
        fill: 'none',
        stroke: "#".concat(Array.from({
          length: 6
        }, function () {
          return Math.floor(Math.random() * 16).toString(16);
        }).join(''))
      });
    }
  }, {
    key: "makeSVG",
    value: function makeSVG() {
      var svg = SVGFunnel.createSVGElement('svg', this.container, {
        width: this.getWidth(),
        height: this.getHeight()
      });
      var valuesNum = this.getCrossAxisPoints().length;

      for (var i = 0; i < valuesNum; i++) {
        var path = SVGFunnel.createSVGElement('path', svg);

        if (this.fillMode === 'solid') {
          SVGFunnel.setAttrs(path, {
            fill: this.color,
            stroke: this.color
          });
        } else if (this.fillMode === 'gradient') {
          var colors = this.color;
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
      var X = this.getMainAxisPoints();
      paths.forEach(function (path, index) {
        var Y = _this2.getCrossAxisPoints()[index]; // const d = this.direction === 'vertical'
        //     ? SVGFunnel.createVerticalPath(X, Y, width)
        //     : SVGFunnel.createPath(X, Y, height);


        var d = SVGFunnel.createLine(X, Y);
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
      if (typeof data.labels === 'undefined') return [];
      return data.labels;
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
        return options.data.values;
      }

      return [];
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
    key: "formatNumber",
    value: function formatNumber(number) {
      return Number(number).toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
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
    /*
    +----------->
    ^           |
    |           |
    <-----------v
     */

  }, {
    key: "createPath",
    value: function createPath(X, Y, height) {
      var d = 'M';
      var i = 0;

      for (i; i < X.length; i++) {
        if (i === 0) {
          d += "".concat(X[i], ",").concat(Y[i]);
        } else {
          d += " C".concat((X[i] + X[i - 1]) / 2, ",").concat(Y[i - 1], " ");
          d += "".concat((X[i] + X[i - 1]) / 2, ",").concat(Y[i], " ");
          d += "".concat(X[i], ",").concat(Y[i]);
        }
      }

      d += " v".concat(SVGFunnel.roundPoint(height - Y[Y.length - 1] * 2), " M");

      for (i = X.length - 1; i >= 0; i--) {
        if (i === X.length - 1) {
          d += "".concat(X[i], ",").concat(height - Y[i]);
        } else {
          d += " C".concat((X[i] + X[i + 1]) / 2, ",").concat(height - Y[i + 1], " ");
          d += "".concat((X[i] + X[i + 1]) / 2, ",").concat(height - Y[i], " ");
          d += "".concat(X[i], ",").concat(height - Y[i]);
        }
      }

      d += " L".concat(X[0], ",").concat(Y[0]);
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
  }, {
    key: "createLine",
    value: function createLine(X, Y) {
      var str = 'M';

      for (var i = 0; i < X.length; i++) {
        str += " ".concat(X[i], ",").concat(Y[i]);
      }

      return str;
    }
  }]);

  return SVGFunnel;
}();

window.SVGFunnel = SVGFunnel;