(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.FunnelGraph = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

module.exports = require('./src/js/main').default;

},{"./src/js/main":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultColors = exports.removeAttrs = exports.setAttrs = exports.createSVGElement = exports.areEqual = exports.getDefaultColors = exports.generateLegendBackground = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var setAttrs = function setAttrs(element, attributes) {
  if (_typeof(attributes) === 'object') {
    Object.keys(attributes).forEach(function (key) {
      element.setAttribute(key, attributes[key]);
    });
  }
};

exports.setAttrs = setAttrs;

var removeAttrs = function removeAttrs(element) {
  for (var _len = arguments.length, attributes = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    attributes[_key - 1] = arguments[_key];
  }

  attributes.forEach(function (attribute) {
    element.removeAttribute(attribute);
  });
};

exports.removeAttrs = removeAttrs;

var createSVGElement = function createSVGElement(element, container, attributes) {
  var el = document.createElementNS('http://www.w3.org/2000/svg', element);

  if (_typeof(attributes) === 'object') {
    setAttrs(el, attributes);
  }

  if (typeof container !== 'undefined') {
    container.appendChild(el);
  }

  return el;
};

exports.createSVGElement = createSVGElement;

var generateLegendBackground = function generateLegendBackground(color) {
  var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'horizontal';

  if (typeof color === 'string') {
    return "background-color: ".concat(color);
  }

  if (color.length === 1) {
    return "background-color: ".concat(color[0]);
  }

  return "background-image: linear-gradient(".concat(direction === 'horizontal' ? 'to right, ' : '').concat(color.join(', '), ")");
};

exports.generateLegendBackground = generateLegendBackground;
var defaultColors = ['#FF4589', '#FF5050', '#05DF9D', '#4FF2FD', '#2D9CDB', '#A0BBFF', '#FFD76F', '#F2C94C', '#FF9A9A', '#FFB178'];
exports.defaultColors = defaultColors;

var getDefaultColors = function getDefaultColors(number) {
  var colors = [].concat(defaultColors);
  var colorSet = [];

  for (var i = 0; i < number; i++) {
    // get a random color
    var index = Math.abs(Math.round(Math.random() * (colors.length - 1))); // push it to the list

    colorSet.push(colors[index]); // and remove it, so that it is not chosen again

    colors.splice(index, 1);
  }

  return colorSet;
};
/*
    Used in comparing existing values to value provided on update
    It is limited to comparing arrays on purpose
    Name is slightly unusual, in order not to be confused with Lodash method
 */


exports.getDefaultColors = getDefaultColors;

var areEqual = function areEqual(value, newValue) {
  // If values are not of the same type
  var type = Object.prototype.toString.call(value);
  if (type !== Object.prototype.toString.call(newValue)) return false;
  if (type !== '[object Array]') return false;
  if (value.length !== newValue.length) return false;

  for (var i = 0; i < value.length; i++) {
    // if the it's a two dimensional array
    var currentType = Object.prototype.toString.call(value[i]);
    if (currentType !== Object.prototype.toString.call(newValue[i])) return false;

    if (currentType === '[object Array]') {
      // if row lengths are not equal then arrays are not equal
      if (value[i].length !== newValue[i].length) return false; // compare each element in the row

      for (var j = 0; j < value[i].length; j++) {
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

exports.areEqual = areEqual;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _number = require("./number");

var _path = require("./path");

var _graph = require("./graph");

var _random = _interopRequireDefault(require("./random"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FunnelGraph =
/*#__PURE__*/
function () {
  function FunnelGraph(options) {
    _classCallCheck(this, FunnelGraph);

    this.containerSelector = options.container;
    this.gradientDirection = options.gradientDirection && options.gradientDirection === 'vertical' ? 'vertical' : 'horizontal';
    this.direction = options.direction && options.direction === 'vertical' ? 'vertical' : 'horizontal';
    this.labels = FunnelGraph.getLabels(options);
    this.subLabels = FunnelGraph.getSubLabels(options);
    this.values = FunnelGraph.getValues(options);
    this.percentages = this.createPercentages();
    this.colors = options.data.colors || (0, _graph.getDefaultColors)(this.is2d() ? this.getSubDataSize() : 2);
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


  _createClass(FunnelGraph, [{
    key: "getMainAxisPoints",
    value: function getMainAxisPoints() {
      var size = this.getDataSize();
      var points = [];
      var fullDimension = this.isVertical() ? this.getHeight() : this.getWidth();

      for (var i = 0; i <= size; i++) {
        points.push((0, _number.roundPoint)(fullDimension * i / size));
      }

      return points;
    }
  }, {
    key: "getCrossAxisPoints",
    value: function getCrossAxisPoints() {
      var points = [];
      var fullDimension = this.getFullDimension(); // get half of the graph container height or width, since funnel shape is symmetric
      // we use this when calculating the "A" shape

      var dimension = fullDimension / 2;

      if (this.is2d()) {
        var totalValues = this.getValues2d();
        var max = Math.max.apply(Math, _toConsumableArray(totalValues)); // duplicate last value

        totalValues.push(_toConsumableArray(totalValues).pop()); // get points for path "A"

        points.push(totalValues.map(function (value) {
          return (0, _number.roundPoint)((max - value) / max * dimension);
        })); // percentages with duplicated last value

        var percentagesFull = this.getPercentages2d();
        var pointsOfFirstPath = points[0];

        for (var i = 1; i < this.getSubDataSize(); i++) {
          var p = points[i - 1];
          var newPoints = [];

          for (var j = 0; j < this.getDataSize(); j++) {
            newPoints.push((0, _number.roundPoint)( // eslint-disable-next-line comma-dangle
            p[j] + (fullDimension - pointsOfFirstPath[j] * 2) * (percentagesFull[j][i - 1] / 100)));
          } // duplicate the last value as points #2 and #3 have the same value on the cross axis


          newPoints.push([].concat(newPoints).pop());
          points.push(newPoints);
        } // add points for path "D", that is simply the "inverted" path "A"


        points.push(pointsOfFirstPath.map(function (point) {
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
          return (0, _number.roundPoint)((_max - value) / _max * dimension);
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
    key: "isVertical",
    value: function isVertical() {
      return this.direction === 'vertical';
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
    key: "getFullDimension",
    value: function getFullDimension() {
      return this.isVertical() ? this.getWidth() : this.getHeight();
    }
  }, {
    key: "addLabels",
    value: function addLabels() {
      var _this = this;

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
        value.textContent = (0, _number.formatNumber)(valueNumber);
        var percentageValue = document.createElement('div');
        percentageValue.setAttribute('class', 'label__percentage');
        percentageValue.textContent = "".concat(percentage.toString(), "%");
        labelElement.appendChild(value);
        labelElement.appendChild(title);

        if (_this.displayPercent) {
          labelElement.appendChild(percentageValue);
        }

        if (_this.is2d()) {
          var segmentPercentages = document.createElement('div');
          segmentPercentages.setAttribute('class', 'label__segment-percentages');
          var percentageList = '<ul class="segment-percentage__list">';

          var twoDimPercentages = _this.getPercentages2d();

          _this.subLabels.forEach(function (subLabel, j) {
            var subLabelDisplayValue = _this.subLabelValue === 'percent' ? "".concat(twoDimPercentages[index][j], "%") : (0, _number.formatNumber)(_this.values[index][j]);
            percentageList += "<li>".concat(_this.subLabels[j], ":\n    <span class=\"percentage__list-label\">").concat(subLabelDisplayValue, "</span>\n </li>");
          });

          percentageList += '</ul>';
          segmentPercentages.innerHTML = percentageList;
          labelElement.appendChild(segmentPercentages);
        }

        holder.appendChild(labelElement);
      });
      this.container.appendChild(holder);
    }
  }, {
    key: "addSubLabels",
    value: function addSubLabels() {
      var _this2 = this;

      if (this.subLabels) {
        var subLabelsHolder = document.createElement('div');
        subLabelsHolder.setAttribute('class', 'svg-funnel-js__subLabels');
        var subLabelsHTML = '';
        this.subLabels.forEach(function (subLabel, index) {
          subLabelsHTML += "<div class=\"svg-funnel-js__subLabel svg-funnel-js__subLabel-".concat(index + 1, "\">\n    <div class=\"svg-funnel-js__subLabel--color\"\n        style=\"").concat((0, _graph.generateLegendBackground)(_this2.colors[index], _this2.gradientDirection), "\"></div>\n    <div class=\"svg-funnel-js__subLabel--title\">").concat(subLabel, "</div>\n</div>");
        });
        subLabelsHolder.innerHTML = subLabelsHTML;
        this.container.appendChild(subLabelsHolder);
      }
    }
  }, {
    key: "createContainer",
    value: function createContainer() {
      if (!this.containerSelector) {
        throw new Error('Container is missing');
      }

      if (typeof this.containerSelector === 'string') {
        this.container = document.querySelector(this.containerSelector);

        if (!this.container) {
          throw new Error("Container cannot be found (selector: ".concat(this.containerSelector, ")."));
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
  }, {
    key: "setValues",
    value: function setValues(v) {
      this.values = v;
      return this;
    }
  }, {
    key: "setDirection",
    value: function setDirection(d) {
      this.direction = d;
      return this;
    }
  }, {
    key: "setHeight",
    value: function setHeight(h) {
      this.height = h;
      return this;
    }
  }, {
    key: "setWidth",
    value: function setWidth(w) {
      this.width = w;
      return this;
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
          return total === 0 ? 0 : (0, _number.roundPoint)(value * 100 / total);
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
        return value === 0 ? 0 : (0, _number.roundPoint)(value * 100 / max);
      });
    }
  }, {
    key: "applyGradient",
    value: function applyGradient(svg, path, colors, index) {
      var defs = svg.querySelector('defs') === null ? (0, _graph.createSVGElement)('defs', svg) : svg.querySelector('defs');
      var gradientName = (0, _random.default)("funnelGradient-".concat(index, "-"));
      var gradient = (0, _graph.createSVGElement)('linearGradient', defs, {
        id: gradientName
      });

      if (this.gradientDirection === 'vertical') {
        (0, _graph.setAttrs)(gradient, {
          x1: '0',
          x2: '0',
          y1: '0',
          y2: '1'
        });
      }

      var numberOfColors = colors.length;

      for (var i = 0; i < numberOfColors; i++) {
        (0, _graph.createSVGElement)('stop', gradient, {
          'stop-color': colors[i],
          offset: "".concat(Math.round(100 * i / (numberOfColors - 1)), "%")
        });
      }

      (0, _graph.setAttrs)(path, {
        fill: "url(\"#".concat(gradientName, "\")"),
        stroke: "url(\"#".concat(gradientName, "\")")
      });
    }
  }, {
    key: "makeSVG",
    value: function makeSVG() {
      var svg = (0, _graph.createSVGElement)('svg', this.graphContainer, {
        width: this.getWidth(),
        height: this.getHeight()
      });
      var valuesNum = this.getCrossAxisPoints().length - 1;

      for (var i = 0; i < valuesNum; i++) {
        var path = (0, _graph.createSVGElement)('path', svg);
        var color = this.is2d() ? this.colors[i] : this.colors;
        var fillMode = typeof color === 'string' || color.length === 1 ? 'solid' : 'gradient';

        if (fillMode === 'solid') {
          (0, _graph.setAttrs)(path, {
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
      return this.width || this.graphContainer.clientWidth;
    }
  }, {
    key: "getHeight",
    value: function getHeight() {
      return this.height || this.graphContainer.clientHeight;
    }
  }, {
    key: "getPathDefinitions",
    value: function getPathDefinitions() {
      var valuesNum = this.getCrossAxisPoints().length - 1;
      var paths = [];

      for (var i = 0; i < valuesNum; i++) {
        if (this.isVertical()) {
          var X = this.getCrossAxisPoints()[i];
          var XNext = this.getCrossAxisPoints()[i + 1];
          var Y = this.getMainAxisPoints();
          var d = (0, _path.createVerticalPath)(i, X, XNext, Y);
          paths.push(d);
        } else {
          var _X = this.getMainAxisPoints();

          var _Y = this.getCrossAxisPoints()[i];
          var YNext = this.getCrossAxisPoints()[i + 1];

          var _d = (0, _path.createPath)(i, _X, _Y, YNext);

          paths.push(_d);
        }
      }

      return paths;
    }
  }, {
    key: "getPathMedian",
    value: function getPathMedian(i) {
      if (this.isVertical()) {
        var _cross = this.getCrossAxisPoints()[i];
        var _next = this.getCrossAxisPoints()[i + 1];

        var _Y2 = this.getMainAxisPoints();

        var _X2 = [];
        var XNext = [];

        _cross.forEach(function (point, index) {
          var m = (point + _next[index]) / 2;

          _X2.push(m - 1);

          XNext.push(m + 1);
        });

        return (0, _path.createVerticalPath)(i, _X2, XNext, _Y2);
      }

      var X = this.getMainAxisPoints();
      var cross = this.getCrossAxisPoints()[i];
      var next = this.getCrossAxisPoints()[i + 1];
      var Y = [];
      var YNext = [];
      cross.forEach(function (point, index) {
        var m = (point + next[index]) / 2;
        Y.push(m - 1);
        YNext.push(m + 1);
      });
      return (0, _path.createPath)(i, X, Y, YNext);
    }
  }, {
    key: "drawPaths",
    value: function drawPaths() {
      var svg = this.getSVG();
      var paths = svg.querySelectorAll('path');
      var definitions = this.getPathDefinitions();
      definitions.forEach(function (definition, index) {
        paths[index].setAttribute('d', definition);
      });
    }
  }, {
    key: "draw",
    value: function draw() {
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

  }, {
    key: "makeVertical",
    value: function makeVertical() {
      if (this.direction === 'vertical') return true;
      this.direction = 'vertical';
      this.container.classList.add('svg-funnel-js--vertical');
      var svg = this.getSVG();
      var height = this.getHeight();
      var width = this.getWidth();
      (0, _graph.setAttrs)(svg, {
        height: height,
        width: width
      });
      this.drawPaths();
      return true;
    }
  }, {
    key: "makeHorizontal",
    value: function makeHorizontal() {
      if (this.direction === 'horizontal') return true;
      this.direction = 'horizontal';
      this.container.classList.remove('svg-funnel-js--vertical');
      var svg = this.getSVG();
      var height = this.getHeight();
      var width = this.getWidth();
      (0, _graph.setAttrs)(svg, {
        height: height,
        width: width
      });
      this.drawPaths();
      return true;
    }
  }, {
    key: "toggleDirection",
    value: function toggleDirection() {
      if (this.direction === 'horizontal') {
        this.makeVertical();
      } else {
        this.makeHorizontal();
      }
    }
  }, {
    key: "gradientMakeVertical",
    value: function gradientMakeVertical() {
      if (this.gradientDirection === 'vertical') return true;
      this.gradientDirection = 'vertical';
      var gradients = this.graphContainer.querySelectorAll('linearGradient');

      for (var i = 0; i < gradients.length; i++) {
        (0, _graph.setAttrs)(gradients[i], {
          x1: '0',
          x2: '0',
          y1: '0',
          y2: '1'
        });
      }

      return true;
    }
  }, {
    key: "gradientMakeHorizontal",
    value: function gradientMakeHorizontal() {
      if (this.gradientDirection === 'horizontal') return true;
      this.gradientDirection = 'horizontal';
      var gradients = this.graphContainer.querySelectorAll('linearGradient');

      for (var i = 0; i < gradients.length; i++) {
        (0, _graph.removeAttrs)(gradients[i], 'x1', 'x2', 'y1', 'y2');
      }

      return true;
    }
  }, {
    key: "gradientToggleDirection",
    value: function gradientToggleDirection() {
      if (this.gradientDirection === 'horizontal') {
        this.gradientMakeVertical();
      } else {
        this.gradientMakeHorizontal();
      }
    }
  }, {
    key: "updateWidth",
    value: function updateWidth(w) {
      this.width = w;
      var svg = this.getSVG();
      var width = this.getWidth();
      (0, _graph.setAttrs)(svg, {
        width: width
      });
      this.drawPaths();
      return true;
    }
  }, {
    key: "updateHeight",
    value: function updateHeight(h) {
      this.height = h;
      var svg = this.getSVG();
      var height = this.getHeight();
      (0, _graph.setAttrs)(svg, {
        height: height
      });
      this.drawPaths();
      return true;
    } // @TODO: refactor data update

  }, {
    key: "updateData",
    value: function updateData(d) {
      var labels = this.container.querySelector('.svg-funnel-js__labels');
      var subLabels = this.container.querySelector('.svg-funnel-js__subLabels');
      if (labels) labels.remove();
      if (subLabels) subLabels.remove();
      this.labels = [];
      this.colors = (0, _graph.getDefaultColors)(this.is2d() ? this.getSubDataSize() : 2);
      this.values = [];
      this.percentages = [];

      if (typeof d.labels !== 'undefined') {
        this.labels = FunnelGraph.getLabels({
          data: d
        });
      }

      if (typeof d.colors !== 'undefined') {
        this.colors = d.colors || (0, _graph.getDefaultColors)(this.is2d() ? this.getSubDataSize() : 2);
      }

      if (typeof d.values !== 'undefined') {
        if (Object.prototype.toString.call(d.values[0]) !== Object.prototype.toString.call(this.values[0])) {
          this.container.querySelector('svg').remove();
          this.values = FunnelGraph.getValues({
            data: d
          });
          this.makeSVG();
        } else {
          this.values = FunnelGraph.getValues({
            data: d
          });
        }

        this.drawPaths();
      }

      this.percentages = this.createPercentages();
      this.addLabels();

      if (typeof d.subLabels !== 'undefined') {
        this.subLabels = FunnelGraph.getSubLabels({
          data: d
        });
        this.addSubLabels();
      }
    }
  }, {
    key: "update",
    value: function update(o) {
      var _this3 = this;

      if (typeof o.displayPercent !== 'undefined') {
        if (this.displayPercent !== o.displayPercent) {
          if (this.displayPercent === true) {
            this.container.querySelectorAll('.label__percentage').forEach(function (label) {
              label.remove();
            });
          } else {
            this.container.querySelectorAll('.svg-funnel-js__label').forEach(function (label, index) {
              var percentage = _this3.percentages[index];
              var percentageValue = document.createElement('div');
              percentageValue.setAttribute('class', 'label__percentage');

              if (percentage !== 100) {
                percentageValue.textContent = "".concat(percentage.toString(), "%");
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
  }], [{
    key: "getSubLabels",
    value: function getSubLabels(options) {
      if (!options.data) {
        throw new Error('Data is missing');
      }

      var data = options.data;
      if (typeof data.subLabels === 'undefined') return [];
      return data.subLabels;
    }
  }, {
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

      if (_typeof(data) === 'object') {
        return data.values;
      }

      return [];
    }
  }]);

  return FunnelGraph;
}();

var _default = FunnelGraph;
exports.default = _default;

},{"./graph":2,"./number":4,"./path":5,"./random":6}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatNumber = exports.roundPoint = void 0;

var roundPoint = function roundPoint(number) {
  return Math.round(number * 10) / 10;
};

exports.roundPoint = roundPoint;

var formatNumber = function formatNumber(number) {
  return Number(number).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

exports.formatNumber = formatNumber;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createVerticalPath = exports.createPath = exports.createVerticalCurves = exports.createCurves = void 0;

var _number = require("./number");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var createCurves = function createCurves(x1, y1, x2, y2) {
  return " C".concat((0, _number.roundPoint)((x2 + x1) / 2), ",").concat(y1, " ") + "".concat((0, _number.roundPoint)((x2 + x1) / 2), ",").concat(y2, " ").concat(x2, ",").concat(y2);
};

exports.createCurves = createCurves;

var createVerticalCurves = function createVerticalCurves(x1, y1, x2, y2) {
  return " C".concat(x1, ",").concat((0, _number.roundPoint)((y2 + y1) / 2), " ") + "".concat(x2, ",").concat((0, _number.roundPoint)((y2 + y1) / 2), " ").concat(x2, ",").concat(y2);
};
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


exports.createVerticalCurves = createVerticalCurves;

var createPath = function createPath(index, X, Y, YNext) {
  var str = "M".concat(X[0], ",").concat(Y[0]);

  for (var i = 0; i < X.length - 1; i++) {
    str += createCurves(X[i], Y[i], X[i + 1], Y[i + 1]);
  }

  str += " L".concat(_toConsumableArray(X).pop(), ",").concat(_toConsumableArray(YNext).pop());

  for (var _i = X.length - 1; _i > 0; _i--) {
    str += createCurves(X[_i], YNext[_i], X[_i - 1], YNext[_i - 1]);
  }

  str += ' Z';
  return str;
};
/*
    In a vertical path we go counter-clockwise

    1<----------4
    |           ^
    v           |
    2---------->3
 */


exports.createPath = createPath;

var createVerticalPath = function createVerticalPath(index, X, XNext, Y) {
  var str = "M".concat(X[0], ",").concat(Y[0]);

  for (var i = 0; i < X.length - 1; i++) {
    str += createVerticalCurves(X[i], Y[i], X[i + 1], Y[i + 1]);
  }

  str += " L".concat(_toConsumableArray(XNext).pop(), ",").concat(_toConsumableArray(Y).pop());

  for (var _i2 = X.length - 1; _i2 > 0; _i2--) {
    str += createVerticalCurves(XNext[_i2], Y[_i2], XNext[_i2 - 1], Y[_i2 - 1]);
  }

  str += ' Z';
  return str;
};

exports.createVerticalPath = createVerticalPath;

},{"./number":4}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var generateRandomIdString = function generateRandomIdString(prefix) {
  return Math.random().toString(36).replace('0.', prefix || '');
};

var _default = generateRandomIdString;
exports.default = _default;

},{}]},{},[1])(1)
});
