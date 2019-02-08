(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateLegendBackground = void 0;

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

},{}],2:[function(require,module,exports){
"use strict";

var _number = require("./number");

var _path = require("./path");

var _graph = require("./graph");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

    this.createContainer(options);
    this.colors = options.data.colors;
    this.gradientDirection = options.gradientDirection && options.gradientDirection === 'vertical' ? 'vertical' : 'horizontal';
    this.direction = options.direction && options.direction === 'vertical' ? 'vertical' : 'horizontal';
    this.labels = FunnelGraph.getLabels(options);
    this.subLabels = FunnelGraph.getSubLabels(options);
    this.values = FunnelGraph.getValues(options);
    this.percentages = this.createPercentages();
    this.displayPercent = options.displayPercent || false;
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
        value.textContent = (0, _number.formatNumber)(valueNumber);
        var percentageValue = document.createElement('div');
        percentageValue.setAttribute('class', 'label__percentage');

        if (percentage !== 100) {
          percentageValue.textContent = "".concat(percentage.toString(), "%");
        }

        labelElement.appendChild(value);
        labelElement.appendChild(title);

        if (_this.displayPercent) {
          labelElement.appendChild(percentageValue);
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
          subLabelsHTML += "<div class=\"svg-funnel-js__subLabel svg-funnel-js__subLabel-".concat(index + 1, "\">\n    <div class=\"svg-funnel-js__subLabel--color\" \n        style=\"").concat((0, _graph.generateLegendBackground)(_this2.colors[index], _this2.gradientDirection), "\"></div>\n    <div class=\"svg-funnel-js__subLabel--title\">").concat(subLabel, "</div>\n</div>");
        });
        subLabelsHolder.innerHTML = subLabelsHTML;
        this.container.appendChild(subLabelsHolder);
      }
    }
  }, {
    key: "createContainer",
    value: function createContainer(options) {
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
          return (0, _number.roundPoint)(value * 100 / total);
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
        return (0, _number.roundPoint)(value * 100 / max);
      });
    }
  }, {
    key: "applyGradient",
    value: function applyGradient(svg, path, colors, index) {
      var defs = svg.querySelector('defs') === null ? FunnelGraph.createSVGElement('defs', svg) : svg.querySelector('defs');
      var gradientName = "funnelGradient-".concat(index);
      var gradient = FunnelGraph.createSVGElement('linearGradient', defs, {
        id: gradientName
      });

      if (this.gradientDirection === 'vertical') {
        FunnelGraph.setAttrs(gradient, {
          x1: '0',
          x2: '0',
          y1: '0',
          y2: '1'
        });
      }

      var numberOfColors = colors.length;

      for (var i = 0; i < numberOfColors; i++) {
        FunnelGraph.createSVGElement('stop', gradient, {
          'stop-color': colors[i],
          offset: "".concat(Math.round(100 * i / (numberOfColors - 1)), "%")
        });
      }

      FunnelGraph.setAttrs(path, {
        fill: "url(\"#".concat(gradientName, "\")"),
        stroke: "url(\"#".concat(gradientName, "\")")
      });
    }
  }, {
    key: "makeSVG",
    value: function makeSVG() {
      var svg = FunnelGraph.createSVGElement('svg', this.graphContainer, {
        width: this.getWidth(),
        height: this.getHeight()
      });
      var valuesNum = this.getCrossAxisPoints().length - 1;

      for (var i = 0; i < valuesNum; i++) {
        var path = FunnelGraph.createSVGElement('path', svg);
        var color = this.is2d() ? this.colors[i] : this.colors;
        var fillMode = typeof color === 'string' || color.length === 1 ? 'solid' : 'gradient';

        if (fillMode === 'solid') {
          FunnelGraph.setAttrs(path, {
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
      return this.graphContainer.clientWidth;
    }
  }, {
    key: "getHeight",
    value: function getHeight() {
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

  }, {
    key: "createPath",
    value: function createPath(index) {
      var X = this.getMainAxisPoints();
      var Y = this.getCrossAxisPoints()[index];
      var YNext = this.getCrossAxisPoints()[index + 1];
      var str = "M".concat(X[0], ",").concat(Y[0]);

      for (var i = 0; i < X.length - 1; i++) {
        str += (0, _path.createCurves)(X[i], Y[i], X[i + 1], Y[i + 1]);
      }

      str += " L".concat(_toConsumableArray(X).pop(), ",").concat(_toConsumableArray(YNext).pop());

      for (var _i = X.length - 1; _i > 0; _i--) {
        str += (0, _path.createCurves)(X[_i], YNext[_i], X[_i - 1], YNext[_i - 1]);
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

  }, {
    key: "createVerticalPath",
    value: function createVerticalPath(index) {
      var X = this.getCrossAxisPoints()[index];
      var XNext = this.getCrossAxisPoints()[index + 1];
      var Y = this.getMainAxisPoints();
      var str = "M".concat(X[0], ",").concat(Y[0]);

      for (var i = 0; i < X.length - 1; i++) {
        str += (0, _path.createVerticalCurves)(X[i], Y[i], X[i + 1], Y[i + 1]);
      }

      str += " L".concat(_toConsumableArray(XNext).pop(), ",").concat(_toConsumableArray(Y).pop());

      for (var _i2 = X.length - 1; _i2 > 0; _i2--) {
        str += (0, _path.createVerticalCurves)(XNext[_i2], Y[_i2], XNext[_i2 - 1], Y[_i2 - 1]);
      }

      str += ' Z';
      return str;
    }
  }, {
    key: "draw",
    value: function draw() {
      this.makeSVG();
      var svg = this.getSVG();
      this.addLabels();

      if (this.is2d()) {
        this.addSubLabels();
      }

      var paths = svg.querySelectorAll('path');

      for (var i = 0; i < paths.length; i++) {
        var d = this.isVertical() ? this.createVerticalPath(i) : this.createPath(i);
        paths[i].setAttribute('d', d);
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
        FunnelGraph.setAttrs(el, attributes);
      }

      if (typeof container !== 'undefined') {
        container.appendChild(el);
      }

      return el;
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
  }]);

  return FunnelGraph;
}();

window.FunnelGraph = FunnelGraph;

},{"./graph":1,"./number":3,"./path":4}],3:[function(require,module,exports){
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
  return Number(number).toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

exports.formatNumber = formatNumber;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createVerticalCurves = exports.createCurves = void 0;

var _number = require("./number");

var createCurves = function createCurves(x1, y1, x2, y2) {
  return " C".concat((0, _number.roundPoint)((x2 + x1) / 2), ",").concat(y1, " ") + "".concat((0, _number.roundPoint)((x2 + x1) / 2), ",").concat(y2, " ").concat(x2, ",").concat(y2);
};

exports.createCurves = createCurves;

var createVerticalCurves = function createVerticalCurves(x1, y1, x2, y2) {
  return " C".concat(x1, ",").concat((0, _number.roundPoint)((y2 + y1) / 2), " ") + "".concat(x2, ",").concat((0, _number.roundPoint)((y2 + y1) / 2), " ").concat(x2, ",").concat(y2);
};

exports.createVerticalCurves = createVerticalCurves;

},{"./number":3}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvZ3JhcGguanMiLCJzcmMvanMvaW5kZXguanMiLCJzcmMvanMvbnVtYmVyLmpzIiwic3JjL2pzL3BhdGguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0FDQUEsSUFBTSx3QkFBd0IsR0FBRyxTQUEzQix3QkFBMkIsQ0FBQyxLQUFELEVBQXFDO0FBQUEsTUFBN0IsU0FBNkIsdUVBQWpCLFlBQWlCOztBQUNsRSxNQUFJLE9BQU8sS0FBUCxLQUFpQixRQUFyQixFQUErQjtBQUMzQix1Q0FBNEIsS0FBNUI7QUFDSDs7QUFFRCxNQUFJLEtBQUssQ0FBQyxNQUFOLEtBQWlCLENBQXJCLEVBQXdCO0FBQ3BCLHVDQUE0QixLQUFLLENBQUMsQ0FBRCxDQUFqQztBQUNIOztBQUVELHFEQUE0QyxTQUFTLEtBQUssWUFBZCxHQUN0QyxZQURzQyxHQUV0QyxFQUZOLFNBRVcsS0FBSyxDQUFDLElBQU4sQ0FBVyxJQUFYLENBRlg7QUFHSCxDQVpEOzs7Ozs7O0FDQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVNLFc7OztBQUNGLHVCQUFZLE9BQVosRUFBcUI7QUFBQTs7QUFDakIsU0FBSyxlQUFMLENBQXFCLE9BQXJCO0FBQ0EsU0FBSyxNQUFMLEdBQWMsT0FBTyxDQUFDLElBQVIsQ0FBYSxNQUEzQjtBQUNBLFNBQUssaUJBQUwsR0FBMEIsT0FBTyxDQUFDLGlCQUFSLElBQTZCLE9BQU8sQ0FBQyxpQkFBUixLQUE4QixVQUE1RCxHQUNuQixVQURtQixHQUVuQixZQUZOO0FBR0EsU0FBSyxTQUFMLEdBQWtCLE9BQU8sQ0FBQyxTQUFSLElBQXFCLE9BQU8sQ0FBQyxTQUFSLEtBQXNCLFVBQTVDLEdBQTBELFVBQTFELEdBQXVFLFlBQXhGO0FBQ0EsU0FBSyxNQUFMLEdBQWMsV0FBVyxDQUFDLFNBQVosQ0FBc0IsT0FBdEIsQ0FBZDtBQUNBLFNBQUssU0FB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RCxFQUFLLEVBQUwsRUFBUyxFQUFULEVBQWEsRUFBYjtBQUFBLFNBQW9CLFlBQUssd0JBQVcsQ0FBQyxFQUFFLEdBQUcsRUFBTixJQUFZLENBQXZCLENBQUwsY0FBa0MsRUFBbEMsbUJBQ2hDLHdCQUFXLENBQUMsRUFBRSxHQUFHLEVBQU4sSUFBWSxDQUF2QixDQURnQyxjQUNILEVBREcsY0FDRyxFQURILGNBQ1MsRUFEVCxDQUFwQjtBQUFBLENBQXJCOzs7O0FBR0EsSUFBTSxvQkFBb0IsR0FBRyxTQUF2QixvQkFBdUIsQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLEVBQVQsRUFBYSxFQUFiO0FBQUEsU0FBb0IsWUFBSyxFQUFMLGNBQVcsd0JBQVcsQ0FBQyxFQUFFLEdBQUcsRUFBTixJQUFZLENBQXZCLENBQVgsbUJBQ3hDLEVBRHdDLGNBQ2xDLHdCQUFXLENBQUMsRUFBRSxHQUFHLEVBQU4sSUFBWSxDQUF2QixDQURrQyxjQUNMLEVBREssY0FDQyxFQURELENBQXBCO0FBQUEsQ0FBN0IiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBnZW5lcmF0ZUxlZ2VuZEJhY2tncm91bmQgPSAoY29sb3IsIGRpcmVjdGlvbiA9ICdob3Jpem9udGFsJykgPT4ge1xuICAgIGlmICh0eXBlb2YgY29sb3IgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBgYmFja2dyb3VuZC1jb2xvcjogJHtjb2xvcn1gO1xuICAgIH1cblxuICAgIGlmIChjb2xvci5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIGBiYWNrZ3JvdW5kLWNvbG9yOiAke2NvbG9yWzBdfWA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoJHtkaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJ1xuICAgICAgICA/ICd0byByaWdodCwgJ1xuICAgICAgICA6ICcnfSR7Y29sb3Iuam9pbignLCAnKX0pYDtcbn07XG5cbmV4cG9ydCB7IGdlbmVyYXRlTGVnZW5kQmFja2dyb3VuZCB9O1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdHJhaWxpbmctc3BhY2VzICovXG5pbXBvcnQgeyByb3VuZFBvaW50LCBmb3JtYXROdW1iZXIgfSBmcm9tICcuL251bWJlcic7XG5pbXBvcnQgeyBjcmVhdGVDdXJ2ZXMsIGNyZWF0ZVZlcnRpY2FsQ3VydmVzIH0gZnJvbSAnLi9wYXRoJztcbmltcG9ydCB7IGdlbmVyYXRlTGVnZW5kQmFja2dyb3VuZCB9IGZyb20gJy4vZ3JhcGgnO1xuXG5jbGFzcyBGdW5uZWxHcmFwaCB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICB0aGlzLmNyZWF0ZUNvbnRhaW5lcihvcHRpb25zKTtcbiAgICAgICAgdGhpcy5jb2xvcnMgPSBvcHRpb25zLmRhdGEuY29sb3JzO1xuICAgICAgICB0aGlzLmdyYWRpZW50RGlyZWN0aW9uID0gKG9wdGlvbnMuZ3JhZGllbnREaXJlY3Rpb24gJiYgb3B0aW9ucy5ncmFkaWVudERpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJylcbiAgICAgICAgICAgID8gJ3ZlcnRpY2FsJ1xuICAgICAgICAgICAgOiAnaG9yaXpvbnRhbCc7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gKG9wdGlvbnMuZGlyZWN0aW9uICYmIG9wdGlvbnMuZGlyZWN0aW9uID09PSAndmVydGljYWwnKSA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XG4gICAgICAgIHRoaXMubGFiZWxzID0gRnVubmVsR3JhcGguZ2V0TGFiZWxzKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLnN1YkxhYmVscyA9IEZ1bm5lbEdyYXBoLmdldFN1YkxhYmVscyhvcHRpb25zKTtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSBGdW5uZWxHcmFwaC5nZXRWYWx1ZXMob3B0aW9ucyk7XG4gICAgICAgIHRoaXMucGVyY2VudGFnZXMgPSB0aGlzLmNyZWF0ZVBlcmNlbnRhZ2VzKCk7XG4gICAgICAgIHRoaXMuZGlzcGxheVBlcmNlbnQgPSBvcHRpb25zLmRpc3BsYXlQZXJjZW50IHx8IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgIEFuIGV4YW1wbGUgb2YgYSB0d28tZGltZW5zaW9uYWwgZnVubmVsIGdyYXBoXG4gICAgIzAuLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICAgICAgICAgICAgICAgLi4uIzEuLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uLi4uXG4gICAgIzAqKioqKioqKioqKioqKioqKioqKiMxKiogICAgICAgICAgICAgICAgICAgICMyLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiMzIChBKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjMioqKioqKioqKioqKioqKioqKioqKioqKiojMyAoQilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIzIrKysrKysrKysrKysrKysrKysrKysrKysrIzMgKEMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICArKysrKysrKysrKysrKysrKysrXG4gICAgIzArKysrKysrKysrKysrKysrKysrKyMxKysgICAgICAgICAgICAgICAgICAgICMyLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSMzIChEKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tLS0tLVxuICAgICAgICAgICAgICAgICAgICAgICAtLS0jMS0tLS0tLS0tLS0tLS0tLS1cbiAgICAjMC0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgTWFpbiBheGlzIGlzIHRoZSBwcmltYXJ5IGF4aXMgb2YgdGhlIGdyYXBoLlxuICAgICBJbiBhIGhvcml6b250YWwgZ3JhcGggaXQncyB0aGUgWCBheGlzLCBhbmQgWSBpcyB0aGUgY3Jvc3MgYXhpcy5cbiAgICAgSG93ZXZlciB3ZSB1c2UgdGhlIG5hbWVzIFwibWFpblwiIGFuZCBcImNyb3NzXCIgYXhpcyxcbiAgICAgYmVjYXVzZSBpbiBhIHZlcnRpY2FsIGdyYXBoIHRoZSBwcmltYXJ5IGF4aXMgaXMgdGhlIFkgYXhpc1xuICAgICBhbmQgdGhlIGNyb3NzIGF4aXMgaXMgdGhlIFggYXhpcy5cblxuICAgICBGaXJzdCBzdGVwIG9mIGRyYXdpbmcgdGhlIGZ1bm5lbCBncmFwaCBpcyBnZXR0aW5nIHRoZSBjb29yZGluYXRlcyBvZiBwb2ludHMsXG4gICAgIHRoYXQgYXJlIHVzZWQgd2hlbiBkcmF3aW5nIHRoZSBwYXRocy5cblxuICAgICBUaGVyZSBhcmUgNCBwYXRocyBpbiB0aGUgZXhhbXBsZSBhYm92ZTogQSwgQiwgQyBhbmQgRC5cbiAgICAgU3VjaCBmdW5uZWwgaGFzIDMgbGFiZWxzIGFuZCAzIHN1YkxhYmVscy5cbiAgICAgVGhpcyBtZWFucyB0aGF0IHRoZSBtYWluIGF4aXMgaGFzIDQgcG9pbnRzIChudW1iZXIgb2YgbGFiZWxzICsgMSlcbiAgICAgT25lIHRoZSBBU0NJSSBpbGx1c3RyYXRlZCBncmFwaCBhYm92ZSwgdGhvc2UgcG9pbnRzIGFyZSBpbGx1c3RyYXRlZCB3aXRoIGEgIyBzeW1ib2wuXG5cbiAgICAqL1xuICAgIGdldE1haW5BeGlzUG9pbnRzKCkge1xuICAgICAgICBjb25zdCBzaXplID0gdGhpcy5nZXREYXRhU2l6ZSgpO1xuICAgICAgICBjb25zdCBwb2ludHMgPSBbXTtcbiAgICAgICAgY29uc3QgZnVsbERpbWVuc2lvbiA9IHRoaXMuaXNWZXJ0aWNhbCgpID8gdGhpcy5nZXRIZWlnaHQoKSA6IHRoaXMuZ2V0V2lkdGgoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gc2l6ZTsgaSsrKSB7XG4gICAgICAgICAgICBwb2ludHMucHVzaChyb3VuZFBvaW50KGZ1bGxEaW1lbnNpb24gKiBpIC8gc2l6ZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwb2ludHM7XG4gICAgfVxuXG4gICAgZ2V0Q3Jvc3NBeGlzUG9pbnRzKCkge1xuICAgICAgICBjb25zdCBwb2ludHMgPSBbXTtcbiAgICAgICAgY29uc3QgZnVsbERpbWVuc2lvbiA9IHRoaXMuZ2V0RnVsbERpbWVuc2lvbigpO1xuICAgICAgICAvLyBnZXQgaGFsZiBvZiB0aGUgZ3JhcGggY29udGFpbmVyIGhlaWdodCBvciB3aWR0aCwgc2luY2UgZnVubmVsIHNoYXBlIGlzIHN5bW1ldHJpY1xuICAgICAgICAvLyB3ZSB1c2UgdGhpcyB3aGVuIGNhbGN1bGF0aW5nIHRoZSBcIkFcIiBzaGFwZVxuICAgICAgICBjb25zdCBkaW1lbnNpb24gPSBmdWxsRGltZW5zaW9uIC8gMjtcbiAgICAgICAgaWYgKHRoaXMuaXMyZCgpKSB7XG4gICAgICAgICAgICBjb25zdCB0b3RhbFZhbHVlcyA9IHRoaXMuZ2V0VmFsdWVzMmQoKTtcbiAgICAgICAgICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLnRvdGFsVmFsdWVzKTtcblxuICAgICAgICAgICAgLy8gZHVwbGljYXRlIGxhc3QgdmFsdWVcbiAgICAgICAgICAgIHRvdGFsVmFsdWVzLnB1c2goWy4uLnRvdGFsVmFsdWVzXS5wb3AoKSk7XG4gICAgICAgICAgICAvLyBnZXQgcG9pbnRzIGZvciBwYXRoIFwiQVwiXG4gICAgICAgICAgICBwb2ludHMucHVzaCh0b3RhbFZhbHVlcy5tYXAodmFsdWUgPT4gcm91bmRQb2ludCgobWF4IC0gdmFsdWUpIC8gbWF4ICogZGltZW5zaW9uKSkpO1xuICAgICAgICAgICAgLy8gcGVyY2VudGFnZXMgd2l0aCBkdXBsaWNhdGVkIGxhc3QgdmFsdWVcbiAgICAgICAgICAgIGNvbnN0IHBlcmNlbnRhZ2VzRnVsbCA9IHRoaXMuZ2V0UGVyY2VudGFnZXMyZCgpO1xuICAgICAgICAgICAgY29uc3QgcG9pbnRzT2ZGaXJzdFBhdGggPSBwb2ludHNbMF07XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5nZXRTdWJEYXRhU2l6ZSgpOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwID0gcG9pbnRzW2kgLSAxXTtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdQb2ludHMgPSBbXTtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5nZXREYXRhU2l6ZSgpOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3UG9pbnRzLnB1c2gocm91bmRQb2ludChcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb21tYS1kYW5nbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHBbal0gKyAoZnVsbERpbWVuc2lvbiAtIHBvaW50c09mRmlyc3RQYXRoW2pdICogMikgKiAocGVyY2VudGFnZXNGdWxsW2pdW2kgLSAxXSAvIDEwMClcbiAgICAgICAgICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gZHVwbGljYXRlIHRoZSBsYXN0IHZhbHVlIGFzIHBvaW50cyAjMiBhbmQgIzMgaGF2ZSB0aGUgc2FtZSB2YWx1ZSBvbiB0aGUgY3Jvc3MgYXhpc1xuICAgICAgICAgICAgICAgIG5ld1BvaW50cy5wdXNoKFsuLi5uZXdQb2ludHNdLnBvcCgpKTtcbiAgICAgICAgICAgICAgICBwb2ludHMucHVzaChuZXdQb2ludHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBhZGQgcG9pbnRzIGZvciBwYXRoIFwiRFwiLCB0aGF0IGlzIHNpbXBseSB0aGUgXCJpbnZlcnRlZFwiIHBhdGggXCJBXCJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKHBvaW50c09mRmlyc3RQYXRoLm1hcChwb2ludCA9PiBmdWxsRGltZW5zaW9uIC0gcG9pbnQpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEFzIHlvdSBjYW4gc2VlIG9uIHRoZSB2aXN1YWxpemF0aW9uIGFib3ZlIHBvaW50cyAjMiBhbmQgIzMgaGF2ZSB0aGUgc2FtZSBjcm9zcyBheGlzIGNvb3JkaW5hdGVcbiAgICAgICAgICAgIC8vIHNvIHdlIGR1cGxpY2F0ZSB0aGUgbGFzdCB2YWx1ZVxuICAgICAgICAgICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4udGhpcy52YWx1ZXMpO1xuICAgICAgICAgICAgY29uc3QgdmFsdWVzID0gWy4uLnRoaXMudmFsdWVzXS5jb25jYXQoWy4uLnRoaXMudmFsdWVzXS5wb3AoKSk7XG4gICAgICAgICAgICAvLyBpZiB0aGUgZ3JhcGggaXMgc2ltcGxlIChub3QgdHdvLWRpbWVuc2lvbmFsKSB0aGVuIHdlIGhhdmUgb25seSBwYXRocyBcIkFcIiBhbmQgXCJEXCJcbiAgICAgICAgICAgIC8vIHdoaWNoIGFyZSBzeW1tZXRyaWMuIFNvIHdlIGdldCB0aGUgcG9pbnRzIGZvciBcIkFcIiBhbmQgdGhlbiBnZXQgcG9pbnRzIGZvciBcIkRcIiBieSBzdWJ0cmFjdGluZyBcIkFcIlxuICAgICAgICAgICAgLy8gcG9pbnRzIGZyb20gZ3JhcGggY3Jvc3MgZGltZW5zaW9uIGxlbmd0aFxuICAgICAgICAgICAgcG9pbnRzLnB1c2godmFsdWVzLm1hcCh2YWx1ZSA9PiByb3VuZFBvaW50KChtYXggLSB2YWx1ZSkgLyBtYXggKiBkaW1lbnNpb24pKSk7XG4gICAgICAgICAgICBwb2ludHMucHVzaChwb2ludHNbMF0ubWFwKHBvaW50ID0+IGZ1bGxEaW1lbnNpb24gLSBwb2ludCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBvaW50cztcbiAgICB9XG5cbiAgICBnZXRHcmFwaFR5cGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlcyAmJiB0aGlzLnZhbHVlc1swXSBpbnN0YW5jZW9mIEFycmF5ID8gJzJkJyA6ICdub3JtYWwnO1xuICAgIH1cblxuICAgIGlzMmQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEdyYXBoVHlwZSgpID09PSAnMmQnO1xuICAgIH1cblxuICAgIGlzVmVydGljYWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJztcbiAgICB9XG5cbiAgICBnZXREYXRhU2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzLmxlbmd0aDtcbiAgICB9XG5cbiAgICBnZXRTdWJEYXRhU2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzWzBdLmxlbmd0aDtcbiAgICB9XG5cbiAgICBnZXRGdWxsRGltZW5zaW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc1ZlcnRpY2FsKCkgPyB0aGlzLmdldFdpZHRoKCkgOiB0aGlzLmdldEhlaWdodCgpO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRTdWJMYWJlbHMob3B0aW9ucykge1xuICAgICAgICBpZiAoIW9wdGlvbnMuZGF0YSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEYXRhIGlzIG1pc3NpbmcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gb3B0aW9ucztcblxuICAgICAgICBpZiAodHlwZW9mIGRhdGEuc3ViTGFiZWxzID09PSAndW5kZWZpbmVkJykgcmV0dXJuIFtdO1xuXG4gICAgICAgIHJldHVybiBkYXRhLnN1YkxhYmVscztcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0TGFiZWxzKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCFvcHRpb25zLmRhdGEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRGF0YSBpcyBtaXNzaW5nJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB7IGRhdGEgfSA9IG9wdGlvbnM7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBkYXRhLmxhYmVscyA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiBbXTtcblxuICAgICAgICByZXR1cm4gZGF0YS5sYWJlbHM7XG4gICAgfVxuXG4gICAgYWRkTGFiZWxzKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG5cbiAgICAgICAgY29uc3QgaG9sZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGhvbGRlci5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3N2Zy1mdW5uZWwtanNfX2xhYmVscycpO1xuXG4gICAgICAgIHRoaXMucGVyY2VudGFnZXMuZm9yRWFjaCgocGVyY2VudGFnZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbGFiZWxFbGVtZW50LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBgc3ZnLWZ1bm5lbC1qc19fbGFiZWwgbGFiZWwtJHtpbmRleCArIDF9YCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0aXRsZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2xhYmVsX190aXRsZScpO1xuICAgICAgICAgICAgdGl0bGUudGV4dENvbnRlbnQgPSB0aGlzLmxhYmVsc1tpbmRleF0gfHwgJyc7XG5cbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB2YWx1ZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2xhYmVsX192YWx1ZScpO1xuXG4gICAgICAgICAgICBjb25zdCB2YWx1ZU51bWJlciA9IHRoaXMuaXMyZCgpID8gdGhpcy5nZXRWYWx1ZXMyZCgpW2luZGV4XSA6IHRoaXMudmFsdWVzW2luZGV4XTtcbiAgICAgICAgICAgIHZhbHVlLnRleHRDb250ZW50ID0gZm9ybWF0TnVtYmVyKHZhbHVlTnVtYmVyKTtcblxuICAgICAgICAgICAgY29uc3QgcGVyY2VudGFnZVZhbHVlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBwZXJjZW50YWdlVmFsdWUuc2V0QXR0cmlidXRlKCdjbGFzcycsICdsYWJlbF9fcGVyY2VudGFnZScpO1xuXG4gICAgICAgICAgICBpZiAocGVyY2VudGFnZSAhPT0gMTAwKSB7XG4gICAgICAgICAgICAgICAgcGVyY2VudGFnZVZhbHVlLnRleHRDb250ZW50ID0gYCR7cGVyY2VudGFnZS50b1N0cmluZygpfSVgO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsYWJlbEVsZW1lbnQuYXBwZW5kQ2hpbGQodmFsdWUpO1xuICAgICAgICAgICAgbGFiZWxFbGVtZW50LmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmRpc3BsYXlQZXJjZW50KSB7XG4gICAgICAgICAgICAgICAgbGFiZWxFbGVtZW50LmFwcGVuZENoaWxkKHBlcmNlbnRhZ2VWYWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGhvbGRlci5hcHBlbmRDaGlsZChsYWJlbEVsZW1lbnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChob2xkZXIpO1xuICAgIH1cblxuICAgIGFkZFN1YkxhYmVscygpIHtcbiAgICAgICAgaWYgKHRoaXMuc3ViTGFiZWxzKSB7XG4gICAgICAgICAgICBjb25zdCBzdWJMYWJlbHNIb2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHN1YkxhYmVsc0hvbGRlci5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3N2Zy1mdW5uZWwtanNfX3N1YkxhYmVscycpO1xuXG4gICAgICAgICAgICBsZXQgc3ViTGFiZWxzSFRNTCA9ICcnO1xuXG4gICAgICAgICAgICB0aGlzLnN1YkxhYmVscy5mb3JFYWNoKChzdWJMYWJlbCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBzdWJMYWJlbHNIVE1MICs9IGA8ZGl2IGNsYXNzPVwic3ZnLWZ1bm5lbC1qc19fc3ViTGFiZWwgc3ZnLWZ1bm5lbC1qc19fc3ViTGFiZWwtJHtpbmRleCArIDF9XCI+XG4gICAgPGRpdiBjbGFzcz1cInN2Zy1mdW5uZWwtanNfX3N1YkxhYmVsLS1jb2xvclwiIFxuICAgICAgICBzdHlsZT1cIiR7Z2VuZXJhdGVMZWdlbmRCYWNrZ3JvdW5kKHRoaXMuY29sb3JzW2luZGV4XSwgdGhpcy5ncmFkaWVudERpcmVjdGlvbil9XCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInN2Zy1mdW5uZWwtanNfX3N1YkxhYmVsLS10aXRsZVwiPiR7c3ViTGFiZWx9PC9kaXY+XG48L2Rpdj5gO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHN1YkxhYmVsc0hvbGRlci5pbm5lckhUTUwgPSBzdWJMYWJlbHNIVE1MO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoc3ViTGFiZWxzSG9sZGVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUNvbnRhaW5lcihvcHRpb25zKSB7XG4gICAgICAgIGlmICghb3B0aW9ucy5jb250YWluZXIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29udGFpbmVyIGlzIG1pc3NpbmcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihvcHRpb25zLmNvbnRhaW5lcik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3N2Zy1mdW5uZWwtanMnKTtcblxuICAgICAgICB0aGlzLmdyYXBoQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuZ3JhcGhDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc3ZnLWZ1bm5lbC1qc19fY29udGFpbmVyJyk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZ3JhcGhDb250YWluZXIpO1xuXG4gICAgICAgIGlmIChvcHRpb25zLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc3ZnLWZ1bm5lbC1qcy0tdmVydGljYWwnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBnZXRWYWx1ZXMob3B0aW9ucykge1xuICAgICAgICBpZiAoIW9wdGlvbnMuZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgeyBkYXRhIH0gPSBvcHRpb25zO1xuXG4gICAgICAgIGlmIChkYXRhIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKGRhdGFbMF0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGF0YS5tYXAoaXRlbSA9PiBpdGVtLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5kYXRhLnZhbHVlcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBnZXRWYWx1ZXMyZCgpIHtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gW107XG5cbiAgICAgICAgdGhpcy52YWx1ZXMuZm9yRWFjaCgodmFsdWVTZXQpID0+IHtcbiAgICAgICAgICAgIHZhbHVlcy5wdXNoKHZhbHVlU2V0LnJlZHVjZSgoc3VtLCB2YWx1ZSkgPT4gc3VtICsgdmFsdWUsIDApKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICB9XG5cbiAgICBnZXRQZXJjZW50YWdlczJkKCkge1xuICAgICAgICBjb25zdCBwZXJjZW50YWdlcyA9IFtdO1xuXG4gICAgICAgIHRoaXMudmFsdWVzLmZvckVhY2goKHZhbHVlU2V0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0b3RhbCA9IHZhbHVlU2V0LnJlZHVjZSgoc3VtLCB2YWx1ZSkgPT4gc3VtICsgdmFsdWUsIDApO1xuICAgICAgICAgICAgcGVyY2VudGFnZXMucHVzaCh2YWx1ZVNldC5tYXAodmFsdWUgPT4gcm91bmRQb2ludCh2YWx1ZSAqIDEwMCAvIHRvdGFsKSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcGVyY2VudGFnZXM7XG4gICAgfVxuXG4gICAgY3JlYXRlUGVyY2VudGFnZXMoKSB7XG4gICAgICAgIGxldCB2YWx1ZXMgPSBbXTtcblxuICAgICAgICBpZiAodGhpcy5pczJkKCkpIHtcbiAgICAgICAgICAgIHZhbHVlcyA9IHRoaXMuZ2V0VmFsdWVzMmQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlcyA9IFsuLi50aGlzLnZhbHVlc107XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtYXggPSBNYXRoLm1heCguLi52YWx1ZXMpO1xuICAgICAgICByZXR1cm4gdmFsdWVzLm1hcCh2YWx1ZSA9PiByb3VuZFBvaW50KHZhbHVlICogMTAwIC8gbWF4KSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZVNWR0VsZW1lbnQoZWxlbWVudCwgY29udGFpbmVyLCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsIGVsZW1lbnQpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgYXR0cmlidXRlcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIEZ1bm5lbEdyYXBoLnNldEF0dHJzKGVsLCBhdHRyaWJ1dGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgY29udGFpbmVyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBlbDtcbiAgICB9XG5cbiAgICBzdGF0aWMgc2V0QXR0cnMoZWxlbWVudCwgYXR0cmlidXRlcykge1xuICAgICAgICBpZiAodHlwZW9mIGF0dHJpYnV0ZXMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShrZXksIGF0dHJpYnV0ZXNba2V5XSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFwcGx5R3JhZGllbnQoc3ZnLCBwYXRoLCBjb2xvcnMsIGluZGV4KSB7XG4gICAgICAgIGNvbnN0IGRlZnMgPSAoc3ZnLnF1ZXJ5U2VsZWN0b3IoJ2RlZnMnKSA9PT0gbnVsbClcbiAgICAgICAgICAgID8gRnVubmVsR3JhcGguY3JlYXRlU1ZHRWxlbWVudCgnZGVmcycsIHN2ZylcbiAgICAgICAgICAgIDogc3ZnLnF1ZXJ5U2VsZWN0b3IoJ2RlZnMnKTtcbiAgICAgICAgY29uc3QgZ3JhZGllbnROYW1lID0gYGZ1bm5lbEdyYWRpZW50LSR7aW5kZXh9YDtcbiAgICAgICAgY29uc3QgZ3JhZGllbnQgPSBGdW5uZWxHcmFwaC5jcmVhdGVTVkdFbGVtZW50KCdsaW5lYXJHcmFkaWVudCcsIGRlZnMsIHtcbiAgICAgICAgICAgIGlkOiBncmFkaWVudE5hbWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMuZ3JhZGllbnREaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgICAgICAgIEZ1bm5lbEdyYXBoLnNldEF0dHJzKGdyYWRpZW50LCB7XG4gICAgICAgICAgICAgICAgeDE6ICcwJyxcbiAgICAgICAgICAgICAgICB4MjogJzAnLFxuICAgICAgICAgICAgICAgIHkxOiAnMCcsXG4gICAgICAgICAgICAgICAgeTI6ICcxJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBudW1iZXJPZkNvbG9ycyA9IGNvbG9ycy5sZW5ndGg7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1iZXJPZkNvbG9yczsgaSsrKSB7XG4gICAgICAgICAgICBGdW5uZWxHcmFwaC5jcmVhdGVTVkdFbGVtZW50KCdzdG9wJywgZ3JhZGllbnQsIHtcbiAgICAgICAgICAgICAgICAnc3RvcC1jb2xvcic6IGNvbG9yc1tpXSxcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IGAke01hdGgucm91bmQoMTAwICogaSAvIChudW1iZXJPZkNvbG9ycyAtIDEpKX0lYFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBGdW5uZWxHcmFwaC5zZXRBdHRycyhwYXRoLCB7XG4gICAgICAgICAgICBmaWxsOiBgdXJsKFwiIyR7Z3JhZGllbnROYW1lfVwiKWAsXG4gICAgICAgICAgICBzdHJva2U6IGB1cmwoXCIjJHtncmFkaWVudE5hbWV9XCIpYFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBtYWtlU1ZHKCkge1xuICAgICAgICBjb25zdCBzdmcgPSBGdW5uZWxHcmFwaC5jcmVhdGVTVkdFbGVtZW50KCdzdmcnLCB0aGlzLmdyYXBoQ29udGFpbmVyLCB7XG4gICAgICAgICAgICB3aWR0aDogdGhpcy5nZXRXaWR0aCgpLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmdldEhlaWdodCgpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHZhbHVlc051bSA9IHRoaXMuZ2V0Q3Jvc3NBeGlzUG9pbnRzKCkubGVuZ3RoIC0gMTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZXNOdW07IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcGF0aCA9IEZ1bm5lbEdyYXBoLmNyZWF0ZVNWR0VsZW1lbnQoJ3BhdGgnLCBzdmcpO1xuXG4gICAgICAgICAgICBjb25zdCBjb2xvciA9ICh0aGlzLmlzMmQoKSkgPyB0aGlzLmNvbG9yc1tpXSA6IHRoaXMuY29sb3JzO1xuICAgICAgICAgICAgY29uc3QgZmlsbE1vZGUgPSAodHlwZW9mIGNvbG9yID09PSAnc3RyaW5nJyB8fCBjb2xvci5sZW5ndGggPT09IDEpID8gJ3NvbGlkJyA6ICdncmFkaWVudCc7XG5cbiAgICAgICAgICAgIGlmIChmaWxsTW9kZSA9PT0gJ3NvbGlkJykge1xuICAgICAgICAgICAgICAgIEZ1bm5lbEdyYXBoLnNldEF0dHJzKHBhdGgsIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsbDogY29sb3IsXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZTogY29sb3JcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsbE1vZGUgPT09ICdncmFkaWVudCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGx5R3JhZGllbnQoc3ZnLCBwYXRoLCBjb2xvciwgaSArIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzdmcuYXBwZW5kQ2hpbGQocGF0aCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdyYXBoQ29udGFpbmVyLmFwcGVuZENoaWxkKHN2Zyk7XG4gICAgfVxuXG4gICAgZ2V0U1ZHKCkge1xuICAgICAgICBjb25zdCBzdmcgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcblxuICAgICAgICBpZiAoIXN2Zykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBTVkcgZm91bmQgaW5zaWRlIG9mIHRoZSBjb250YWluZXInKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdmc7XG4gICAgfVxuXG4gICAgZ2V0V2lkdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdyYXBoQ29udGFpbmVyLmNsaWVudFdpZHRoO1xuICAgIH1cblxuICAgIGdldEhlaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JhcGhDb250YWluZXIuY2xpZW50SGVpZ2h0O1xuICAgIH1cblxuICAgIC8qXG4gICAgICAgIEEgZnVubmVsIHNlZ21lbnQgaXMgZHJhdyBpbiBhIGNsb2Nrd2lzZSBkaXJlY3Rpb24uXG4gICAgICAgIFBhdGggMS0yIGlzIGRyYXduLFxuICAgICAgICB0aGVuIGNvbm5lY3RlZCB3aXRoIGEgc3RyYWlnaHQgdmVydGljYWwgbGluZSAyLTMsXG4gICAgICAgIHRoZW4gYSBsaW5lIDMtNCBpcyBkcmF3ICh1c2luZyBZTmV4dCBwb2ludHMgZ29pbmcgaW4gYmFja3dhcmRzIGRpcmVjdGlvbilcbiAgICAgICAgdGhlbiBwYXRoIGlzIGNsb3NlZCAoY29ubmVjdGVkIHdpdGggdGhlIHN0YXJ0aW5nIHBvaW50IDEpLlxuXG4gICAgICAgIDEtLS0tLS0tLS0tPjJcbiAgICAgICAgXiAgICAgICAgICAgfFxuICAgICAgICB8ICAgICAgICAgICB2XG4gICAgICAgIDQ8LS0tLS0tLS0tLTNcblxuICAgICAgICBPbiB0aGUgZ3JhcGggb24gbGluZSAyMCBpdCB3b3JrcyBsaWtlIHRoaXM6XG4gICAgICAgIEEjMCwgQSMxLCBBIzIsIEEjMywgQiMzLCBCIzIsIEIjMSwgQiMwLCBjbG9zZSB0aGUgcGF0aC5cblxuICAgICAgICBQb2ludHMgZm9yIHBhdGggXCJCXCIgYXJlIHBhc3NlZCBhcyB0aGUgWU5leHQgcGFyYW0uXG4gICAgICovXG5cbiAgICBjcmVhdGVQYXRoKGluZGV4KSB7XG4gICAgICAgIGNvbnN0IFggPSB0aGlzLmdldE1haW5BeGlzUG9pbnRzKCk7XG4gICAgICAgIGNvbnN0IFkgPSB0aGlzLmdldENyb3NzQXhpc1BvaW50cygpW2luZGV4XTtcbiAgICAgICAgY29uc3QgWU5leHQgPSB0aGlzLmdldENyb3NzQXhpc1BvaW50cygpW2luZGV4ICsgMV07XG5cbiAgICAgICAgbGV0IHN0ciA9IGBNJHtYWzBdfSwke1lbMF19YDtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IFgubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBzdHIgKz0gY3JlYXRlQ3VydmVzKFhbaV0sIFlbaV0sIFhbaSArIDFdLCBZW2kgKyAxXSk7XG4gICAgICAgIH1cblxuICAgICAgICBzdHIgKz0gYCBMJHtbLi4uWF0ucG9wKCl9LCR7Wy4uLllOZXh0XS5wb3AoKX1gO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSBYLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICAgIHN0ciArPSBjcmVhdGVDdXJ2ZXMoWFtpXSwgWU5leHRbaV0sIFhbaSAtIDFdLCBZTmV4dFtpIC0gMV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RyICs9ICcgWic7XG5cbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG5cbiAgICAvKlxuICAgICAgICBJbiBhIHZlcnRpY2FsIHBhdGggd2UgZ28gY291bnRlci1jbG9ja3dpc2VcblxuICAgICAgICAxPC0tLS0tLS0tLS00XG4gICAgICAgIHwgICAgICAgICAgIF5cbiAgICAgICAgdiAgICAgICAgICAgfFxuICAgICAgICAyLS0tLS0tLS0tLT4zXG4gICAgICovXG5cbiAgICBjcmVhdGVWZXJ0aWNhbFBhdGgoaW5kZXgpIHtcbiAgICAgICAgY29uc3QgWCA9IHRoaXMuZ2V0Q3Jvc3NBeGlzUG9pbnRzKClbaW5kZXhdO1xuICAgICAgICBjb25zdCBYTmV4dCA9IHRoaXMuZ2V0Q3Jvc3NBeGlzUG9pbnRzKClbaW5kZXggKyAxXTtcbiAgICAgICAgY29uc3QgWSA9IHRoaXMuZ2V0TWFpbkF4aXNQb2ludHMoKTtcblxuICAgICAgICBsZXQgc3RyID0gYE0ke1hbMF19LCR7WVswXX1gO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgWC5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgIHN0ciArPSBjcmVhdGVWZXJ0aWNhbEN1cnZlcyhYW2ldLCBZW2ldLCBYW2kgKyAxXSwgWVtpICsgMV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RyICs9IGAgTCR7Wy4uLlhOZXh0XS5wb3AoKX0sJHtbLi4uWV0ucG9wKCl9YDtcblxuICAgICAgICBmb3IgKGxldCBpID0gWC5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XG4gICAgICAgICAgICBzdHIgKz0gY3JlYXRlVmVydGljYWxDdXJ2ZXMoWE5leHRbaV0sIFlbaV0sIFhOZXh0W2kgLSAxXSwgWVtpIC0gMV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RyICs9ICcgWic7XG5cbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG5cbiAgICBkcmF3KCkge1xuICAgICAgICB0aGlzLm1ha2VTVkcoKTtcbiAgICAgICAgY29uc3Qgc3ZnID0gdGhpcy5nZXRTVkcoKTtcblxuICAgICAgICB0aGlzLmFkZExhYmVscygpO1xuXG4gICAgICAgIGlmICh0aGlzLmlzMmQoKSkge1xuICAgICAgICAgICAgdGhpcy5hZGRTdWJMYWJlbHMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBhdGhzID0gc3ZnLnF1ZXJ5U2VsZWN0b3JBbGwoJ3BhdGgnKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdGhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBkID0gdGhpcy5pc1ZlcnRpY2FsKCkgPyB0aGlzLmNyZWF0ZVZlcnRpY2FsUGF0aChpKSA6IHRoaXMuY3JlYXRlUGF0aChpKTtcbiAgICAgICAgICAgIHBhdGhzW2ldLnNldEF0dHJpYnV0ZSgnZCcsIGQpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG53aW5kb3cuRnVubmVsR3JhcGggPSBGdW5uZWxHcmFwaDtcbiIsImNvbnN0IHJvdW5kUG9pbnQgPSBudW1iZXIgPT4gTWF0aC5yb3VuZChudW1iZXIgKiAxMCkgLyAxMDtcbmNvbnN0IGZvcm1hdE51bWJlciA9IG51bWJlciA9PiBOdW1iZXIobnVtYmVyKS50b0ZpeGVkKCkucmVwbGFjZSgvKFxcZCkoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCAnJDEsJyk7XG5cbmV4cG9ydCB7IHJvdW5kUG9pbnQsIGZvcm1hdE51bWJlciB9O1xuIiwiaW1wb3J0IHsgcm91bmRQb2ludCB9IGZyb20gJy4vbnVtYmVyJztcblxuY29uc3QgY3JlYXRlQ3VydmVzID0gKHgxLCB5MSwgeDIsIHkyKSA9PiBgIEMke3JvdW5kUG9pbnQoKHgyICsgeDEpIC8gMil9LCR7eTF9IGBcbiAgICArIGAke3JvdW5kUG9pbnQoKHgyICsgeDEpIC8gMil9LCR7eTJ9ICR7eDJ9LCR7eTJ9YDtcblxuY29uc3QgY3JlYXRlVmVydGljYWxDdXJ2ZXMgPSAoeDEsIHkxLCB4MiwgeTIpID0+IGAgQyR7eDF9LCR7cm91bmRQb2ludCgoeTIgKyB5MSkgLyAyKX0gYFxuICAgICsgYCR7eDJ9LCR7cm91bmRQb2ludCgoeTIgKyB5MSkgLyAyKX0gJHt4Mn0sJHt5Mn1gO1xuXG5leHBvcnQgeyBjcmVhdGVDdXJ2ZXMsIGNyZWF0ZVZlcnRpY2FsQ3VydmVzIH07XG4iXX0=
