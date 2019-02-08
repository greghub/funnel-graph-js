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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvZ3JhcGguanMiLCJzcmMvanMvbWFpbi5qcyIsInNyYy9qcy9udW1iZXIuanMiLCJzcmMvanMvcGF0aC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUNBQSxJQUFNLHdCQUF3QixHQUFHLFNBQTNCLHdCQUEyQixDQUFDLEtBQUQsRUFBcUM7QUFBQSxNQUE3QixTQUE2Qix1RUFBakIsWUFBaUI7O0FBQ2xFLE1BQUksT0FBTyxLQUFQLEtBQWlCLFFBQXJCLEVBQStCO0FBQzNCLHVDQUE0QixLQUE1QjtBQUNIOztBQUVELE1BQUksS0FBSyxDQUFDLE1BQU4sS0FBaUIsQ0FBckIsRUFBd0I7QUFDcEIsdUNBQTRCLEtBQUssQ0FBQyxDQUFELENBQWpDO0FBQ0g7O0FBRUQscURBQTRDLFNBQVMsS0FBSyxZQUFkLEdBQ3RDLFlBRHNDLEdBRXRDLEVBRk4sU0FFVyxLQUFLLENBQUMsSUFBTixDQUFXLElBQVgsQ0FGWDtBQUdILENBWkQ7Ozs7Ozs7QUNDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRU0sVzs7O0FBQ0YsdUJBQVksT0FBWixFQUFxQjtBQUFBOztBQUNqQixTQUFLLGVBQUwsQ0FBcUIsT0FBckI7QUFDQSxTQUFLLE1BQUwsR0FBYyxPQUFPLENBQUMsSUFBUixDQUFhLE1BQTNCO0FBQ0EsU0FBSyxpQkFBTCxHQUEwQixPQUFPLENBQUMsaUJBQVIsSUFBNkIsT0FBTyxDQUFDLGlCQUFSLEtBQThCLFVBQTVELEdBQ25CLFVBRG1CLEdBRW5CLFlBRk47QUFHQSxTQUFLLFNBQUwsR0FBa0IsT0FBTyxDQUFDLFNBQVIsSUFBcUIsT0FBTyxDQUFDLFNBQVIsS0FBc0IsVUFBNUMsR0FBMEQsVUFBMUQsR0FBdUUsWUFBeEY7QUFDQSxTQUFLLE1BQUwsR0FBYyxXQUFXLENBQUMsU0FBWixDQUFzQixPQUF0QixDQUFkO0FBQ0EsU0FBSyxTQUFM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LFlBQWUsQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLEVBQVQsRUFBYSxFQUFiO0FBQUEsU0FBb0IsWUFBSyx3QkFBVyxDQUFDLEVBQUUsR0FBRyxFQUFOLElBQVksQ0FBdkIsQ0FBTCxjQUFrQyxFQUFsQyxtQkFDaEMsd0JBQVcsQ0FBQyxFQUFFLEdBQUcsRUFBTixJQUFZLENBQXZCLENBRGdDLGNBQ0gsRUFERyxjQUNHLEVBREgsY0FDUyxFQURULENBQXBCO0FBQUEsQ0FBckI7Ozs7QUFHQSxJQUFNLG9CQUFvQixHQUFHLFNBQXZCLG9CQUF1QixDQUFDLEVBQUQsRUFBSyxFQUFMLEVBQVMsRUFBVCxFQUFhLEVBQWI7QUFBQSxTQUFvQixZQUFLLEVBQUwsY0FBVyx3QkFBVyxDQUFDLEVBQUUsR0FBRyxFQUFOLElBQVksQ0FBdkIsQ0FBWCxtQkFDeEMsRUFEd0MsY0FDbEMsd0JBQVcsQ0FBQyxFQUFFLEdBQUcsRUFBTixJQUFZLENBQXZCLENBRGtDLGNBQ0wsRUFESyxjQUNDLEVBREQsQ0FBcEI7QUFBQSxDQUE3QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IGdlbmVyYXRlTGVnZW5kQmFja2dyb3VuZCA9IChjb2xvciwgZGlyZWN0aW9uID0gJ2hvcml6b250YWwnKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBjb2xvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGBiYWNrZ3JvdW5kLWNvbG9yOiAke2NvbG9yfWA7XG4gICAgfVxuXG4gICAgaWYgKGNvbG9yLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gYGJhY2tncm91bmQtY29sb3I6ICR7Y29sb3JbMF19YDtcbiAgICB9XG5cbiAgICByZXR1cm4gYGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCgke2RpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnXG4gICAgICAgID8gJ3RvIHJpZ2h0LCAnXG4gICAgICAgIDogJyd9JHtjb2xvci5qb2luKCcsICcpfSlgO1xufTtcblxuZXhwb3J0IHsgZ2VuZXJhdGVMZWdlbmRCYWNrZ3JvdW5kIH07XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby10cmFpbGluZy1zcGFjZXMgKi9cbmltcG9ydCB7IHJvdW5kUG9pbnQsIGZvcm1hdE51bWJlciB9IGZyb20gJy4vbnVtYmVyJztcbmltcG9ydCB7IGNyZWF0ZUN1cnZlcywgY3JlYXRlVmVydGljYWxDdXJ2ZXMgfSBmcm9tICcuL3BhdGgnO1xuaW1wb3J0IHsgZ2VuZXJhdGVMZWdlbmRCYWNrZ3JvdW5kIH0gZnJvbSAnLi9ncmFwaCc7XG5cbmNsYXNzIEZ1bm5lbEdyYXBoIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlQ29udGFpbmVyKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLmNvbG9ycyA9IG9wdGlvbnMuZGF0YS5jb2xvcnM7XG4gICAgICAgIHRoaXMuZ3JhZGllbnREaXJlY3Rpb24gPSAob3B0aW9ucy5ncmFkaWVudERpcmVjdGlvbiAmJiBvcHRpb25zLmdyYWRpZW50RGlyZWN0aW9uID09PSAndmVydGljYWwnKVxuICAgICAgICAgICAgPyAndmVydGljYWwnXG4gICAgICAgICAgICA6ICdob3Jpem9udGFsJztcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSAob3B0aW9ucy5kaXJlY3Rpb24gJiYgb3B0aW9ucy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJztcbiAgICAgICAgdGhpcy5sYWJlbHMgPSBGdW5uZWxHcmFwaC5nZXRMYWJlbHMob3B0aW9ucyk7XG4gICAgICAgIHRoaXMuc3ViTGFiZWxzID0gRnVubmVsR3JhcGguZ2V0U3ViTGFiZWxzKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLnZhbHVlcyA9IEZ1bm5lbEdyYXBoLmdldFZhbHVlcyhvcHRpb25zKTtcbiAgICAgICAgdGhpcy5wZXJjZW50YWdlcyA9IHRoaXMuY3JlYXRlUGVyY2VudGFnZXMoKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5UGVyY2VudCA9IG9wdGlvbnMuZGlzcGxheVBlcmNlbnQgfHwgZmFsc2U7XG5cbiAgICAgICAgdGhpcy5kcmF3KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgQW4gZXhhbXBsZSBvZiBhIHR3by1kaW1lbnNpb25hbCBmdW5uZWwgZ3JhcGhcbiAgICAjMC4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgICAgICAgICAgICAgICAuLi4jMS4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi4uLi5cbiAgICAjMCoqKioqKioqKioqKioqKioqKioqIzEqKiAgICAgICAgICAgICAgICAgICAgIzIuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIzMgKEEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMyKioqKioqKioqKioqKioqKioqKioqKioqKiMzIChCKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjMisrKysrKysrKysrKysrKysrKysrKysrKysjMyAoQylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsrKysrKysrKysrKysrKysrKytcbiAgICAjMCsrKysrKysrKysrKysrKysrKysrIzErKyAgICAgICAgICAgICAgICAgICAgIzItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIzMgKEQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0tLS0tXG4gICAgICAgICAgICAgICAgICAgICAgIC0tLSMxLS0tLS0tLS0tLS0tLS0tLVxuICAgICMwLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICBNYWluIGF4aXMgaXMgdGhlIHByaW1hcnkgYXhpcyBvZiB0aGUgZ3JhcGguXG4gICAgIEluIGEgaG9yaXpvbnRhbCBncmFwaCBpdCdzIHRoZSBYIGF4aXMsIGFuZCBZIGlzIHRoZSBjcm9zcyBheGlzLlxuICAgICBIb3dldmVyIHdlIHVzZSB0aGUgbmFtZXMgXCJtYWluXCIgYW5kIFwiY3Jvc3NcIiBheGlzLFxuICAgICBiZWNhdXNlIGluIGEgdmVydGljYWwgZ3JhcGggdGhlIHByaW1hcnkgYXhpcyBpcyB0aGUgWSBheGlzXG4gICAgIGFuZCB0aGUgY3Jvc3MgYXhpcyBpcyB0aGUgWCBheGlzLlxuXG4gICAgIEZpcnN0IHN0ZXAgb2YgZHJhd2luZyB0aGUgZnVubmVsIGdyYXBoIGlzIGdldHRpbmcgdGhlIGNvb3JkaW5hdGVzIG9mIHBvaW50cyxcbiAgICAgdGhhdCBhcmUgdXNlZCB3aGVuIGRyYXdpbmcgdGhlIHBhdGhzLlxuXG4gICAgIFRoZXJlIGFyZSA0IHBhdGhzIGluIHRoZSBleGFtcGxlIGFib3ZlOiBBLCBCLCBDIGFuZCBELlxuICAgICBTdWNoIGZ1bm5lbCBoYXMgMyBsYWJlbHMgYW5kIDMgc3ViTGFiZWxzLlxuICAgICBUaGlzIG1lYW5zIHRoYXQgdGhlIG1haW4gYXhpcyBoYXMgNCBwb2ludHMgKG51bWJlciBvZiBsYWJlbHMgKyAxKVxuICAgICBPbmUgdGhlIEFTQ0lJIGlsbHVzdHJhdGVkIGdyYXBoIGFib3ZlLCB0aG9zZSBwb2ludHMgYXJlIGlsbHVzdHJhdGVkIHdpdGggYSAjIHN5bWJvbC5cblxuICAgICovXG4gICAgZ2V0TWFpbkF4aXNQb2ludHMoKSB7XG4gICAgICAgIGNvbnN0IHNpemUgPSB0aGlzLmdldERhdGFTaXplKCk7XG4gICAgICAgIGNvbnN0IHBvaW50cyA9IFtdO1xuICAgICAgICBjb25zdCBmdWxsRGltZW5zaW9uID0gdGhpcy5pc1ZlcnRpY2FsKCkgPyB0aGlzLmdldEhlaWdodCgpIDogdGhpcy5nZXRXaWR0aCgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBzaXplOyBpKyspIHtcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKHJvdW5kUG9pbnQoZnVsbERpbWVuc2lvbiAqIGkgLyBzaXplKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBvaW50cztcbiAgICB9XG5cbiAgICBnZXRDcm9zc0F4aXNQb2ludHMoKSB7XG4gICAgICAgIGNvbnN0IHBvaW50cyA9IFtdO1xuICAgICAgICBjb25zdCBmdWxsRGltZW5zaW9uID0gdGhpcy5nZXRGdWxsRGltZW5zaW9uKCk7XG4gICAgICAgIC8vIGdldCBoYWxmIG9mIHRoZSBncmFwaCBjb250YWluZXIgaGVpZ2h0IG9yIHdpZHRoLCBzaW5jZSBmdW5uZWwgc2hhcGUgaXMgc3ltbWV0cmljXG4gICAgICAgIC8vIHdlIHVzZSB0aGlzIHdoZW4gY2FsY3VsYXRpbmcgdGhlIFwiQVwiIHNoYXBlXG4gICAgICAgIGNvbnN0IGRpbWVuc2lvbiA9IGZ1bGxEaW1lbnNpb24gLyAyO1xuICAgICAgICBpZiAodGhpcy5pczJkKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHRvdGFsVmFsdWVzID0gdGhpcy5nZXRWYWx1ZXMyZCgpO1xuICAgICAgICAgICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4udG90YWxWYWx1ZXMpO1xuXG4gICAgICAgICAgICAvLyBkdXBsaWNhdGUgbGFzdCB2YWx1ZVxuICAgICAgICAgICAgdG90YWxWYWx1ZXMucHVzaChbLi4udG90YWxWYWx1ZXNdLnBvcCgpKTtcbiAgICAgICAgICAgIC8vIGdldCBwb2ludHMgZm9yIHBhdGggXCJBXCJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKHRvdGFsVmFsdWVzLm1hcCh2YWx1ZSA9PiByb3VuZFBvaW50KChtYXggLSB2YWx1ZSkgLyBtYXggKiBkaW1lbnNpb24pKSk7XG4gICAgICAgICAgICAvLyBwZXJjZW50YWdlcyB3aXRoIGR1cGxpY2F0ZWQgbGFzdCB2YWx1ZVxuICAgICAgICAgICAgY29uc3QgcGVyY2VudGFnZXNGdWxsID0gdGhpcy5nZXRQZXJjZW50YWdlczJkKCk7XG4gICAgICAgICAgICBjb25zdCBwb2ludHNPZkZpcnN0UGF0aCA9IHBvaW50c1swXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLmdldFN1YkRhdGFTaXplKCk7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBwb2ludHNbaSAtIDFdO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1BvaW50cyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmdldERhdGFTaXplKCk7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBuZXdQb2ludHMucHVzaChyb3VuZFBvaW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbW1hLWRhbmdsZVxuICAgICAgICAgICAgICAgICAgICAgICAgcFtqXSArIChmdWxsRGltZW5zaW9uIC0gcG9pbnRzT2ZGaXJzdFBhdGhbal0gKiAyKSAqIChwZXJjZW50YWdlc0Z1bGxbal1baSAtIDFdIC8gMTAwKVxuICAgICAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBkdXBsaWNhdGUgdGhlIGxhc3QgdmFsdWUgYXMgcG9pbnRzICMyIGFuZCAjMyBoYXZlIHRoZSBzYW1lIHZhbHVlIG9uIHRoZSBjcm9zcyBheGlzXG4gICAgICAgICAgICAgICAgbmV3UG9pbnRzLnB1c2goWy4uLm5ld1BvaW50c10ucG9wKCkpO1xuICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKG5ld1BvaW50cyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGFkZCBwb2ludHMgZm9yIHBhdGggXCJEXCIsIHRoYXQgaXMgc2ltcGx5IHRoZSBcImludmVydGVkXCIgcGF0aCBcIkFcIlxuICAgICAgICAgICAgcG9pbnRzLnB1c2gocG9pbnRzT2ZGaXJzdFBhdGgubWFwKHBvaW50ID0+IGZ1bGxEaW1lbnNpb24gLSBwb2ludCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gQXMgeW91IGNhbiBzZWUgb24gdGhlIHZpc3VhbGl6YXRpb24gYWJvdmUgcG9pbnRzICMyIGFuZCAjMyBoYXZlIHRoZSBzYW1lIGNyb3NzIGF4aXMgY29vcmRpbmF0ZVxuICAgICAgICAgICAgLy8gc28gd2UgZHVwbGljYXRlIHRoZSBsYXN0IHZhbHVlXG4gICAgICAgICAgICBjb25zdCBtYXggPSBNYXRoLm1heCguLi50aGlzLnZhbHVlcyk7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBbLi4udGhpcy52YWx1ZXNdLmNvbmNhdChbLi4udGhpcy52YWx1ZXNdLnBvcCgpKTtcbiAgICAgICAgICAgIC8vIGlmIHRoZSBncmFwaCBpcyBzaW1wbGUgKG5vdCB0d28tZGltZW5zaW9uYWwpIHRoZW4gd2UgaGF2ZSBvbmx5IHBhdGhzIFwiQVwiIGFuZCBcIkRcIlxuICAgICAgICAgICAgLy8gd2hpY2ggYXJlIHN5bW1ldHJpYy4gU28gd2UgZ2V0IHRoZSBwb2ludHMgZm9yIFwiQVwiIGFuZCB0aGVuIGdldCBwb2ludHMgZm9yIFwiRFwiIGJ5IHN1YnRyYWN0aW5nIFwiQVwiXG4gICAgICAgICAgICAvLyBwb2ludHMgZnJvbSBncmFwaCBjcm9zcyBkaW1lbnNpb24gbGVuZ3RoXG4gICAgICAgICAgICBwb2ludHMucHVzaCh2YWx1ZXMubWFwKHZhbHVlID0+IHJvdW5kUG9pbnQoKG1heCAtIHZhbHVlKSAvIG1heCAqIGRpbWVuc2lvbikpKTtcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKHBvaW50c1swXS5tYXAocG9pbnQgPT4gZnVsbERpbWVuc2lvbiAtIHBvaW50KSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcG9pbnRzO1xuICAgIH1cblxuICAgIGdldEdyYXBoVHlwZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzICYmIHRoaXMudmFsdWVzWzBdIGluc3RhbmNlb2YgQXJyYXkgPyAnMmQnIDogJ25vcm1hbCc7XG4gICAgfVxuXG4gICAgaXMyZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0R3JhcGhUeXBlKCkgPT09ICcyZCc7XG4gICAgfVxuXG4gICAgaXNWZXJ0aWNhbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlyZWN0aW9uID09PSAndmVydGljYWwnO1xuICAgIH1cblxuICAgIGdldERhdGFTaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZXMubGVuZ3RoO1xuICAgIH1cblxuICAgIGdldFN1YkRhdGFTaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZXNbMF0ubGVuZ3RoO1xuICAgIH1cblxuICAgIGdldEZ1bGxEaW1lbnNpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzVmVydGljYWwoKSA/IHRoaXMuZ2V0V2lkdGgoKSA6IHRoaXMuZ2V0SGVpZ2h0KCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldFN1YkxhYmVscyhvcHRpb25zKSB7XG4gICAgICAgIGlmICghb3B0aW9ucy5kYXRhKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgaXMgbWlzc2luZycpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgeyBkYXRhIH0gPSBvcHRpb25zO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZGF0YS5zdWJMYWJlbHMgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gW107XG5cbiAgICAgICAgcmV0dXJuIGRhdGEuc3ViTGFiZWxzO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRMYWJlbHMob3B0aW9ucykge1xuICAgICAgICBpZiAoIW9wdGlvbnMuZGF0YSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEYXRhIGlzIG1pc3NpbmcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gb3B0aW9ucztcblxuICAgICAgICBpZiAodHlwZW9mIGRhdGEubGFiZWxzID09PSAndW5kZWZpbmVkJykgcmV0dXJuIFtdO1xuXG4gICAgICAgIHJldHVybiBkYXRhLmxhYmVscztcbiAgICB9XG5cbiAgICBhZGRMYWJlbHMoKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcblxuICAgICAgICBjb25zdCBob2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaG9sZGVyLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc3ZnLWZ1bm5lbC1qc19fbGFiZWxzJyk7XG5cbiAgICAgICAgdGhpcy5wZXJjZW50YWdlcy5mb3JFYWNoKChwZXJjZW50YWdlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGFiZWxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBsYWJlbEVsZW1lbnQuc2V0QXR0cmlidXRlKCdjbGFzcycsIGBzdmctZnVubmVsLWpzX19sYWJlbCBsYWJlbC0ke2luZGV4ICsgMX1gKTtcblxuICAgICAgICAgICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHRpdGxlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbGFiZWxfX3RpdGxlJyk7XG4gICAgICAgICAgICB0aXRsZS50ZXh0Q29udGVudCA9IHRoaXMubGFiZWxzW2luZGV4XSB8fCAnJztcblxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHZhbHVlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbGFiZWxfX3ZhbHVlJyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHZhbHVlTnVtYmVyID0gdGhpcy5pczJkKCkgPyB0aGlzLmdldFZhbHVlczJkKClbaW5kZXhdIDogdGhpcy52YWx1ZXNbaW5kZXhdO1xuICAgICAgICAgICAgdmFsdWUudGV4dENvbnRlbnQgPSBmb3JtYXROdW1iZXIodmFsdWVOdW1iZXIpO1xuXG4gICAgICAgICAgICBjb25zdCBwZXJjZW50YWdlVmFsdWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHBlcmNlbnRhZ2VWYWx1ZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2xhYmVsX19wZXJjZW50YWdlJyk7XG5cbiAgICAgICAgICAgIGlmIChwZXJjZW50YWdlICE9PSAxMDApIHtcbiAgICAgICAgICAgICAgICBwZXJjZW50YWdlVmFsdWUudGV4dENvbnRlbnQgPSBgJHtwZXJjZW50YWdlLnRvU3RyaW5nKCl9JWA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxhYmVsRWxlbWVudC5hcHBlbmRDaGlsZCh2YWx1ZSk7XG4gICAgICAgICAgICBsYWJlbEVsZW1lbnQuYXBwZW5kQ2hpbGQodGl0bGUpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZGlzcGxheVBlcmNlbnQpIHtcbiAgICAgICAgICAgICAgICBsYWJlbEVsZW1lbnQuYXBwZW5kQ2hpbGQocGVyY2VudGFnZVZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaG9sZGVyLmFwcGVuZENoaWxkKGxhYmVsRWxlbWVudCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGhvbGRlcik7XG4gICAgfVxuXG4gICAgYWRkU3ViTGFiZWxzKCkge1xuICAgICAgICBpZiAodGhpcy5zdWJMYWJlbHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHN1YkxhYmVsc0hvbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgc3ViTGFiZWxzSG9sZGVyLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc3ZnLWZ1bm5lbC1qc19fc3ViTGFiZWxzJyk7XG5cbiAgICAgICAgICAgIGxldCBzdWJMYWJlbHNIVE1MID0gJyc7XG5cbiAgICAgICAgICAgIHRoaXMuc3ViTGFiZWxzLmZvckVhY2goKHN1YkxhYmVsLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIHN1YkxhYmVsc0hUTUwgKz0gYDxkaXYgY2xhc3M9XCJzdmctZnVubmVsLWpzX19zdWJMYWJlbCBzdmctZnVubmVsLWpzX19zdWJMYWJlbC0ke2luZGV4ICsgMX1cIj5cbiAgICA8ZGl2IGNsYXNzPVwic3ZnLWZ1bm5lbC1qc19fc3ViTGFiZWwtLWNvbG9yXCIgXG4gICAgICAgIHN0eWxlPVwiJHtnZW5lcmF0ZUxlZ2VuZEJhY2tncm91bmQodGhpcy5jb2xvcnNbaW5kZXhdLCB0aGlzLmdyYWRpZW50RGlyZWN0aW9uKX1cIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic3ZnLWZ1bm5lbC1qc19fc3ViTGFiZWwtLXRpdGxlXCI+JHtzdWJMYWJlbH08L2Rpdj5cbjwvZGl2PmA7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc3ViTGFiZWxzSG9sZGVyLmlubmVySFRNTCA9IHN1YkxhYmVsc0hUTUw7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChzdWJMYWJlbHNIb2xkZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlQ29udGFpbmVyKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCFvcHRpb25zLmNvbnRhaW5lcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb250YWluZXIgaXMgbWlzc2luZycpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKG9wdGlvbnMuY29udGFpbmVyKTtcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc3ZnLWZ1bm5lbC1qcycpO1xuXG4gICAgICAgIHRoaXMuZ3JhcGhDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5ncmFwaENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzdmctZnVubmVsLWpzX19jb250YWluZXInKTtcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5ncmFwaENvbnRhaW5lcik7XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuZGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzdmctZnVubmVsLWpzLS12ZXJ0aWNhbCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGdldFZhbHVlcyhvcHRpb25zKSB7XG4gICAgICAgIGlmICghb3B0aW9ucy5kYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB7IGRhdGEgfSA9IG9wdGlvbnM7XG5cbiAgICAgICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIoZGF0YVswXSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkYXRhLm1hcChpdGVtID0+IGl0ZW0udmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zLmRhdGEudmFsdWVzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGdldFZhbHVlczJkKCkge1xuICAgICAgICBjb25zdCB2YWx1ZXMgPSBbXTtcblxuICAgICAgICB0aGlzLnZhbHVlcy5mb3JFYWNoKCh2YWx1ZVNldCkgPT4ge1xuICAgICAgICAgICAgdmFsdWVzLnB1c2godmFsdWVTZXQucmVkdWNlKChzdW0sIHZhbHVlKSA9PiBzdW0gKyB2YWx1ZSwgMCkpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdmFsdWVzO1xuICAgIH1cblxuICAgIGdldFBlcmNlbnRhZ2VzMmQoKSB7XG4gICAgICAgIGNvbnN0IHBlcmNlbnRhZ2VzID0gW107XG5cbiAgICAgICAgdGhpcy52YWx1ZXMuZm9yRWFjaCgodmFsdWVTZXQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRvdGFsID0gdmFsdWVTZXQucmVkdWNlKChzdW0sIHZhbHVlKSA9PiBzdW0gKyB2YWx1ZSwgMCk7XG4gICAgICAgICAgICBwZXJjZW50YWdlcy5wdXNoKHZhbHVlU2V0Lm1hcCh2YWx1ZSA9PiByb3VuZFBvaW50KHZhbHVlICogMTAwIC8gdG90YWwpKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBwZXJjZW50YWdlcztcbiAgICB9XG5cbiAgICBjcmVhdGVQZXJjZW50YWdlcygpIHtcbiAgICAgICAgbGV0IHZhbHVlcyA9IFtdO1xuXG4gICAgICAgIGlmICh0aGlzLmlzMmQoKSkge1xuICAgICAgICAgICAgdmFsdWVzID0gdGhpcy5nZXRWYWx1ZXMyZCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWVzID0gWy4uLnRoaXMudmFsdWVzXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLnZhbHVlcyk7XG4gICAgICAgIHJldHVybiB2YWx1ZXMubWFwKHZhbHVlID0+IHJvdW5kUG9pbnQodmFsdWUgKiAxMDAgLyBtYXgpKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlU1ZHRWxlbWVudChlbGVtZW50LCBjb250YWluZXIsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgZWxlbWVudCk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBhdHRyaWJ1dGVzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgRnVubmVsR3JhcGguc2V0QXR0cnMoZWwsIGF0dHJpYnV0ZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb250YWluZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVsO1xuICAgIH1cblxuICAgIHN0YXRpYyBzZXRBdHRycyhlbGVtZW50LCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYXR0cmlidXRlcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgYXR0cmlidXRlc1trZXldKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXBwbHlHcmFkaWVudChzdmcsIHBhdGgsIGNvbG9ycywgaW5kZXgpIHtcbiAgICAgICAgY29uc3QgZGVmcyA9IChzdmcucXVlcnlTZWxlY3RvcignZGVmcycpID09PSBudWxsKVxuICAgICAgICAgICAgPyBGdW5uZWxHcmFwaC5jcmVhdGVTVkdFbGVtZW50KCdkZWZzJywgc3ZnKVxuICAgICAgICAgICAgOiBzdmcucXVlcnlTZWxlY3RvcignZGVmcycpO1xuICAgICAgICBjb25zdCBncmFkaWVudE5hbWUgPSBgZnVubmVsR3JhZGllbnQtJHtpbmRleH1gO1xuICAgICAgICBjb25zdCBncmFkaWVudCA9IEZ1bm5lbEdyYXBoLmNyZWF0ZVNWR0VsZW1lbnQoJ2xpbmVhckdyYWRpZW50JywgZGVmcywge1xuICAgICAgICAgICAgaWQ6IGdyYWRpZW50TmFtZVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5ncmFkaWVudERpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgICAgICAgRnVubmVsR3JhcGguc2V0QXR0cnMoZ3JhZGllbnQsIHtcbiAgICAgICAgICAgICAgICB4MTogJzAnLFxuICAgICAgICAgICAgICAgIHgyOiAnMCcsXG4gICAgICAgICAgICAgICAgeTE6ICcwJyxcbiAgICAgICAgICAgICAgICB5MjogJzEnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG51bWJlck9mQ29sb3JzID0gY29sb3JzLmxlbmd0aDtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bWJlck9mQ29sb3JzOyBpKyspIHtcbiAgICAgICAgICAgIEZ1bm5lbEdyYXBoLmNyZWF0ZVNWR0VsZW1lbnQoJ3N0b3AnLCBncmFkaWVudCwge1xuICAgICAgICAgICAgICAgICdzdG9wLWNvbG9yJzogY29sb3JzW2ldLFxuICAgICAgICAgICAgICAgIG9mZnNldDogYCR7TWF0aC5yb3VuZCgxMDAgKiBpIC8gKG51bWJlck9mQ29sb3JzIC0gMSkpfSVgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIEZ1bm5lbEdyYXBoLnNldEF0dHJzKHBhdGgsIHtcbiAgICAgICAgICAgIGZpbGw6IGB1cmwoXCIjJHtncmFkaWVudE5hbWV9XCIpYCxcbiAgICAgICAgICAgIHN0cm9rZTogYHVybChcIiMke2dyYWRpZW50TmFtZX1cIilgXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG1ha2VTVkcoKSB7XG4gICAgICAgIGNvbnN0IHN2ZyA9IEZ1bm5lbEdyYXBoLmNyZWF0ZVNWR0VsZW1lbnQoJ3N2ZycsIHRoaXMuZ3JhcGhDb250YWluZXIsIHtcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmdldFdpZHRoKCksXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuZ2V0SGVpZ2h0KClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgdmFsdWVzTnVtID0gdGhpcy5nZXRDcm9zc0F4aXNQb2ludHMoKS5sZW5ndGggLSAxO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlc051bTsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBwYXRoID0gRnVubmVsR3JhcGguY3JlYXRlU1ZHRWxlbWVudCgncGF0aCcsIHN2Zyk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gKHRoaXMuaXMyZCgpKSA/IHRoaXMuY29sb3JzW2ldIDogdGhpcy5jb2xvcnM7XG4gICAgICAgICAgICBjb25zdCBmaWxsTW9kZSA9ICh0eXBlb2YgY29sb3IgPT09ICdzdHJpbmcnIHx8IGNvbG9yLmxlbmd0aCA9PT0gMSkgPyAnc29saWQnIDogJ2dyYWRpZW50JztcblxuICAgICAgICAgICAgaWYgKGZpbGxNb2RlID09PSAnc29saWQnKSB7XG4gICAgICAgICAgICAgICAgRnVubmVsR3JhcGguc2V0QXR0cnMocGF0aCwge1xuICAgICAgICAgICAgICAgICAgICBmaWxsOiBjb2xvcixcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlOiBjb2xvclxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWxsTW9kZSA9PT0gJ2dyYWRpZW50Jykge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlHcmFkaWVudChzdmcsIHBhdGgsIGNvbG9yLCBpICsgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN2Zy5hcHBlbmRDaGlsZChwYXRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ3JhcGhDb250YWluZXIuYXBwZW5kQ2hpbGQoc3ZnKTtcbiAgICB9XG5cbiAgICBnZXRTVkcoKSB7XG4gICAgICAgIGNvbnN0IHN2ZyA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xuXG4gICAgICAgIGlmICghc3ZnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIFNWRyBmb3VuZCBpbnNpZGUgb2YgdGhlIGNvbnRhaW5lcicpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN2ZztcbiAgICB9XG5cbiAgICBnZXRXaWR0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JhcGhDb250YWluZXIuY2xpZW50V2lkdGg7XG4gICAgfVxuXG4gICAgZ2V0SGVpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ncmFwaENvbnRhaW5lci5jbGllbnRIZWlnaHQ7XG4gICAgfVxuXG4gICAgLypcbiAgICAgICAgQSBmdW5uZWwgc2VnbWVudCBpcyBkcmF3IGluIGEgY2xvY2t3aXNlIGRpcmVjdGlvbi5cbiAgICAgICAgUGF0aCAxLTIgaXMgZHJhd24sXG4gICAgICAgIHRoZW4gY29ubmVjdGVkIHdpdGggYSBzdHJhaWdodCB2ZXJ0aWNhbCBsaW5lIDItMyxcbiAgICAgICAgdGhlbiBhIGxpbmUgMy00IGlzIGRyYXcgKHVzaW5nIFlOZXh0IHBvaW50cyBnb2luZyBpbiBiYWNrd2FyZHMgZGlyZWN0aW9uKVxuICAgICAgICB0aGVuIHBhdGggaXMgY2xvc2VkIChjb25uZWN0ZWQgd2l0aCB0aGUgc3RhcnRpbmcgcG9pbnQgMSkuXG5cbiAgICAgICAgMS0tLS0tLS0tLS0+MlxuICAgICAgICBeICAgICAgICAgICB8XG4gICAgICAgIHwgICAgICAgICAgIHZcbiAgICAgICAgNDwtLS0tLS0tLS0tM1xuXG4gICAgICAgIE9uIHRoZSBncmFwaCBvbiBsaW5lIDIwIGl0IHdvcmtzIGxpa2UgdGhpczpcbiAgICAgICAgQSMwLCBBIzEsIEEjMiwgQSMzLCBCIzMsIEIjMiwgQiMxLCBCIzAsIGNsb3NlIHRoZSBwYXRoLlxuXG4gICAgICAgIFBvaW50cyBmb3IgcGF0aCBcIkJcIiBhcmUgcGFzc2VkIGFzIHRoZSBZTmV4dCBwYXJhbS5cbiAgICAgKi9cblxuICAgIGNyZWF0ZVBhdGgoaW5kZXgpIHtcbiAgICAgICAgY29uc3QgWCA9IHRoaXMuZ2V0TWFpbkF4aXNQb2ludHMoKTtcbiAgICAgICAgY29uc3QgWSA9IHRoaXMuZ2V0Q3Jvc3NBeGlzUG9pbnRzKClbaW5kZXhdO1xuICAgICAgICBjb25zdCBZTmV4dCA9IHRoaXMuZ2V0Q3Jvc3NBeGlzUG9pbnRzKClbaW5kZXggKyAxXTtcblxuICAgICAgICBsZXQgc3RyID0gYE0ke1hbMF19LCR7WVswXX1gO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgWC5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgIHN0ciArPSBjcmVhdGVDdXJ2ZXMoWFtpXSwgWVtpXSwgWFtpICsgMV0sIFlbaSArIDFdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0ciArPSBgIEwke1suLi5YXS5wb3AoKX0sJHtbLi4uWU5leHRdLnBvcCgpfWA7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IFgubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgICAgICAgc3RyICs9IGNyZWF0ZUN1cnZlcyhYW2ldLCBZTmV4dFtpXSwgWFtpIC0gMV0sIFlOZXh0W2kgLSAxXSk7XG4gICAgICAgIH1cblxuICAgICAgICBzdHIgKz0gJyBaJztcblxuICAgICAgICByZXR1cm4gc3RyO1xuICAgIH1cblxuICAgIC8qXG4gICAgICAgIEluIGEgdmVydGljYWwgcGF0aCB3ZSBnbyBjb3VudGVyLWNsb2Nrd2lzZVxuXG4gICAgICAgIDE8LS0tLS0tLS0tLTRcbiAgICAgICAgfCAgICAgICAgICAgXlxuICAgICAgICB2ICAgICAgICAgICB8XG4gICAgICAgIDItLS0tLS0tLS0tPjNcbiAgICAgKi9cblxuICAgIGNyZWF0ZVZlcnRpY2FsUGF0aChpbmRleCkge1xuICAgICAgICBjb25zdCBYID0gdGhpcy5nZXRDcm9zc0F4aXNQb2ludHMoKVtpbmRleF07XG4gICAgICAgIGNvbnN0IFhOZXh0ID0gdGhpcy5nZXRDcm9zc0F4aXNQb2ludHMoKVtpbmRleCArIDFdO1xuICAgICAgICBjb25zdCBZID0gdGhpcy5nZXRNYWluQXhpc1BvaW50cygpO1xuXG4gICAgICAgIGxldCBzdHIgPSBgTSR7WFswXX0sJHtZWzBdfWA7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBYLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgc3RyICs9IGNyZWF0ZVZlcnRpY2FsQ3VydmVzKFhbaV0sIFlbaV0sIFhbaSArIDFdLCBZW2kgKyAxXSk7XG4gICAgICAgIH1cblxuICAgICAgICBzdHIgKz0gYCBMJHtbLi4uWE5leHRdLnBvcCgpfSwke1suLi5ZXS5wb3AoKX1gO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSBYLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICAgIHN0ciArPSBjcmVhdGVWZXJ0aWNhbEN1cnZlcyhYTmV4dFtpXSwgWVtpXSwgWE5leHRbaSAtIDFdLCBZW2kgLSAxXSk7XG4gICAgICAgIH1cblxuICAgICAgICBzdHIgKz0gJyBaJztcblxuICAgICAgICByZXR1cm4gc3RyO1xuICAgIH1cblxuICAgIGRyYXcoKSB7XG4gICAgICAgIHRoaXMubWFrZVNWRygpO1xuICAgICAgICBjb25zdCBzdmcgPSB0aGlzLmdldFNWRygpO1xuXG4gICAgICAgIHRoaXMuYWRkTGFiZWxzKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXMyZCgpKSB7XG4gICAgICAgICAgICB0aGlzLmFkZFN1YkxhYmVscygpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGF0aHMgPSBzdmcucXVlcnlTZWxlY3RvckFsbCgncGF0aCcpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGF0aHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGQgPSB0aGlzLmlzVmVydGljYWwoKSA/IHRoaXMuY3JlYXRlVmVydGljYWxQYXRoKGkpIDogdGhpcy5jcmVhdGVQYXRoKGkpO1xuICAgICAgICAgICAgcGF0aHNbaV0uc2V0QXR0cmlidXRlKCdkJywgZCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbndpbmRvdy5GdW5uZWxHcmFwaCA9IEZ1bm5lbEdyYXBoO1xuIiwiY29uc3Qgcm91bmRQb2ludCA9IG51bWJlciA9PiBNYXRoLnJvdW5kKG51bWJlciAqIDEwKSAvIDEwO1xuY29uc3QgZm9ybWF0TnVtYmVyID0gbnVtYmVyID0+IE51bWJlcihudW1iZXIpLnRvRml4ZWQoKS5yZXBsYWNlKC8oXFxkKSg/PShcXGR7M30pKyg/IVxcZCkpL2csICckMSwnKTtcblxuZXhwb3J0IHsgcm91bmRQb2ludCwgZm9ybWF0TnVtYmVyIH07XG4iLCJpbXBvcnQgeyByb3VuZFBvaW50IH0gZnJvbSAnLi9udW1iZXInO1xuXG5jb25zdCBjcmVhdGVDdXJ2ZXMgPSAoeDEsIHkxLCB4MiwgeTIpID0+IGAgQyR7cm91bmRQb2ludCgoeDIgKyB4MSkgLyAyKX0sJHt5MX0gYFxuICAgICsgYCR7cm91bmRQb2ludCgoeDIgKyB4MSkgLyAyKX0sJHt5Mn0gJHt4Mn0sJHt5Mn1gO1xuXG5jb25zdCBjcmVhdGVWZXJ0aWNhbEN1cnZlcyA9ICh4MSwgeTEsIHgyLCB5MikgPT4gYCBDJHt4MX0sJHtyb3VuZFBvaW50KCh5MiArIHkxKSAvIDIpfSBgXG4gICAgKyBgJHt4Mn0sJHtyb3VuZFBvaW50KCh5MiArIHkxKSAvIDIpfSAke3gyfSwke3kyfWA7XG5cbmV4cG9ydCB7IGNyZWF0ZUN1cnZlcywgY3JlYXRlVmVydGljYWxDdXJ2ZXMgfTtcbiJdfQ==
