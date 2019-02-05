(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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
    this.colors = options.data.colors;
    this.gradientDirection = options.gradientDirection && options.gradientDirection === 'vertical' ? 'vertical' : 'horizontal';
    this.direction = options.direction && options.direction === 'vertical' ? 'vertical' : 'horizontal';
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


  _createClass(SVGFunnel, [{
    key: "getMainAxisPoints",
    value: function getMainAxisPoints() {
      var size = this.getDataSize();
      var points = [];
      var fullDimension = this.isVertical() ? this.getHeight() : this.getWidth();

      for (var i = 0; i <= size; i++) {
        points.push(SVGFunnel.roundPoint(fullDimension * i / size));
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
          return SVGFunnel.roundPoint((max - value) / max * dimension);
        })); // percentages with duplicated last value

        var percentagesFull = this.getPercentages2d();
        var pointsOfFirstPath = points[0];

        for (var i = 1; i < this.getSubDataSize(); i++) {
          var p = points[i - 1];
          var newPoints = [];

          for (var j = 0; j < this.getDataSize(); j++) {
            newPoints.push(SVGFunnel.roundPoint( // eslint-disable-next-line comma-dangle
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
    key: "generateLegendBackground",
    value: function generateLegendBackground(index) {
      var color = this.colors[index];

      if (typeof color === 'string') {
        return "background-color: ".concat(color);
      }

      if (color.length === 1) {
        return "background-color: ".concat(color[0]);
      }

      return "background-image: linear-gradient(".concat(this.gradientDirection === 'horizontal' ? 'to right, ' : '').concat(color.join(', '), ")");
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
          subLabelsHTML += "<div class=\"svg-funnel-js__subLabel svg-funnel-js__subLabel-".concat(index + 1, "\">\n    <div class=\"svg-funnel-js__subLabel--color\" style=\"").concat(_this2.generateLegendBackground(index), "\"></div>\n    <div class=\"svg-funnel-js__subLabel--title\">").concat(subLabel, "</div>\n</div>");
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
      }

      SVGFunnel.setAttrs(path, {
        fill: "url(\"#".concat(gradientName, "\")"),
        stroke: "url(\"#".concat(gradientName, "\")")
      });
    }
  }, {
    key: "makeSVG",
    value: function makeSVG() {
      var svg = SVGFunnel.createSVGElement('svg', this.graphContainer, {
        width: this.getWidth(),
        height: this.getHeight()
      });
      var valuesNum = this.getCrossAxisPoints().length - 1;

      for (var i = 0; i < valuesNum; i++) {
        var path = SVGFunnel.createSVGElement('path', svg);
        var color = this.is2d() ? this.colors[i] : this.colors;
        var fillMode = typeof color === 'string' || color.length === 1 ? 'solid' : 'gradient';

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
        str += SVGFunnel.createCurves(X[i], Y[i], X[i + 1], Y[i + 1]);
      }

      str += " L".concat(_toConsumableArray(X).pop(), ",").concat(_toConsumableArray(YNext).pop());

      for (var _i = X.length - 1; _i > 0; _i--) {
        str += SVGFunnel.createCurves(X[_i], YNext[_i], X[_i - 1], YNext[_i - 1]);
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
        str += SVGFunnel.createVerticalCurves(X[i], Y[i], X[i + 1], Y[i + 1]);
      }

      str += " L".concat(_toConsumableArray(XNext).pop(), ",").concat(_toConsumableArray(Y).pop());

      for (var _i2 = X.length - 1; _i2 > 0; _i2--) {
        str += SVGFunnel.createVerticalCurves(XNext[_i2], Y[_i2], XNext[_i2 - 1], Y[_i2 - 1]);
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
    key: "createCurves",
    value: function createCurves(x1, y1, x2, y2) {
      return " C".concat(SVGFunnel.roundPoint((x2 + x1) / 2), ",").concat(y1, " ").concat(SVGFunnel.roundPoint((x2 + x1) / 2), ",").concat(y2, " ").concat(x2, ",").concat(y2);
    }
  }, {
    key: "createVerticalCurves",
    value: function createVerticalCurves(x1, y1, x2, y2) {
      return " C".concat(x1, ",").concat(SVGFunnel.roundPoint((y2 + y1) / 2), " ").concat(x2, ",").concat(SVGFunnel.roundPoint((y2 + y1) / 2), " ").concat(x2, ",").concat(y2);
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

  return SVGFunnel;
}();

window.SVGFunnel = SVGFunnel;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBO0lBRU0sUzs7O0FBQ0YscUJBQVksT0FBWixFQUFxQjtBQUFBOztBQUNqQixTQUFLLGVBQUwsQ0FBcUIsT0FBckI7QUFDQSxTQUFLLE1BQUwsR0FBYyxPQUFPLENBQUMsSUFBUixDQUFhLE1BQTNCO0FBQ0EsU0FBSyxpQkFBTCxHQUEwQixPQUFPLENBQUMsaUJBQVIsSUFBNkIsT0FBTyxDQUFDLGlCQUFSLEtBQThCLFVBQTVELEdBQ25CLFVBRG1CLEdBRW5CLFlBRk47QUFHQSxTQUFLLFNBQUwsR0FBa0IsT0FBTyxDQUFDLFNBQVIsSUFBcUIsT0FBTyxDQUFDLFNBQVIsS0FBc0IsVUFBNUMsR0FBMEQsVUFBMUQsR0FBdUUsWUFBeEY7QUFDQSxTQUFLLE1BQUwsR0FBYyxTQUFTLENBQUMsU0FBVixDQUFvQixPQUFwQixDQUFkO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLFNBQVMsQ0FBQyxZQUFWLENBQXVCLE9BQXZCLENBQWpCO0FBQ0EsU0FBSyxNQUFMLEdBQWMsU0FBUyxDQUFDLFNBQVYsQ0FBb0IsT0FBcEIsQ0FBZDtBQUNBLFNBQUssV0FBTCxHQUFtQixLQUFLLGlCQUFMLEVBQW5CO0FBQ0EsU0FBSyxjQUFMLEdBQXNCLE9BQU8sQ0FBQyxjQUFSLElBQTBCLEtBQWhEO0FBRUEsU0FBSyxJQUFMO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3dDQThCb0I7QUFDaEIsVUFBTSxJQUFJLEdBQUcsS0FBSyxXQUFMLEVBQWI7QUFDQSxVQUFNLE1BQU0sR0FBRyxFQUFmO0FBQ0EsVUFBTSxhQUFhLEdBQUcsS0FBSyxVQUFMLEtBQW9CLEtBQUssU0FBTCxFQUFwQixHQUF1QyxLQUFLLFFBQUwsRUFBN0Q7O0FBQ0EsV0FBSyxJQUFJLENBQUMsR0FBRyxD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QVksQ0FBakMsQ0FBbEIsY0FBeUQsRUFBekQsY0FBK0QsU0FBUyxDQUFDLFVBQVYsQ0FBcUIsQ0FBQyxFQUFFLEdBQUcsRUFBTixJQUFZLENBQWpDLENBQS9ELGNBQXNHLEVBQXRHLGNBQTRHLEVBQTVHO0FBQ0g7Ozs2QkFFZSxPLEVBQVMsVSxFQUFZO0FBQ2pDLFVBQUksUUFBTyxVQUFQLE1BQXNCLFFBQTFCLEVBQW9DO0FBQ2hDLFFBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxVQUFaLEVBQXdCLE9BQXhCLENBQWdDLFVBQUMsR0FBRCxFQUFTO0FBQ3JDLFVBQUEsT0FBTyxDQUFDLFlBQVIsQ0FBcUIsR0FBckIsRUFBMEIsVUFBVSxDQUFDLEdBQUQsQ0FBcEM7QUFDSCxTQUZEO0FBR0g7QUFDSjs7Ozs7O0FBMktMLE1BQU0sQ0FBQyxTQUFQLEdBQW1CLFNBQW5CIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdHJhaWxpbmctc3BhY2VzICovXG5cbmNsYXNzIFNWR0Z1bm5lbCB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICB0aGlzLmNyZWF0ZUNvbnRhaW5lcihvcHRpb25zKTtcbiAgICAgICAgdGhpcy5jb2xvcnMgPSBvcHRpb25zLmRhdGEuY29sb3JzO1xuICAgICAgICB0aGlzLmdyYWRpZW50RGlyZWN0aW9uID0gKG9wdGlvbnMuZ3JhZGllbnREaXJlY3Rpb24gJiYgb3B0aW9ucy5ncmFkaWVudERpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJylcbiAgICAgICAgICAgID8gJ3ZlcnRpY2FsJ1xuICAgICAgICAgICAgOiAnaG9yaXpvbnRhbCc7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gKG9wdGlvbnMuZGlyZWN0aW9uICYmIG9wdGlvbnMuZGlyZWN0aW9uID09PSAndmVydGljYWwnKSA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XG4gICAgICAgIHRoaXMubGFiZWxzID0gU1ZHRnVubmVsLmdldExhYmVscyhvcHRpb25zKTtcbiAgICAgICAgdGhpcy5zdWJMYWJlbHMgPSBTVkdGdW5uZWwuZ2V0U3ViTGFiZWxzKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLnZhbHVlcyA9IFNWR0Z1bm5lbC5nZXRWYWx1ZXMob3B0aW9ucyk7XG4gICAgICAgIHRoaXMucGVyY2VudGFnZXMgPSB0aGlzLmNyZWF0ZVBlcmNlbnRhZ2VzKCk7XG4gICAgICAgIHRoaXMuZGlzcGxheVBlcmNlbnQgPSBvcHRpb25zLmRpc3BsYXlQZXJjZW50IHx8IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuZHJhdygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgIEFuIGV4YW1wbGUgb2YgYSB0d28tZGltZW5zaW9uYWwgZnVubmVsIGdyYXBoXG4gICAgIzAuLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICAgICAgICAgICAgICAgLi4uIzEuLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uLi4uXG4gICAgIzAqKioqKioqKioqKioqKioqKioqKiMxKiogICAgICAgICAgICAgICAgICAgICMyLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiMzIChBKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjMioqKioqKioqKioqKioqKioqKioqKioqKiojMyAoQilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIzIrKysrKysrKysrKysrKysrKysrKysrKysrIzMgKEMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICArKysrKysrKysrKysrKysrKysrXG4gICAgIzArKysrKysrKysrKysrKysrKysrKyMxKysgICAgICAgICAgICAgICAgICAgICMyLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSMzIChEKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tLS0tLVxuICAgICAgICAgICAgICAgICAgICAgICAtLS0jMS0tLS0tLS0tLS0tLS0tLS1cbiAgICAjMC0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgTWFpbiBheGlzIGlzIHRoZSBwcmltYXJ5IGF4aXMgb2YgdGhlIGdyYXBoLlxuICAgICBJbiBhIGhvcml6b250YWwgZ3JhcGggaXQncyB0aGUgWCBheGlzLCBhbmQgWSBpcyB0aGUgY3Jvc3MgYXhpcy5cbiAgICAgSG93ZXZlciB3ZSB1c2UgdGhlIG5hbWVzIFwibWFpblwiIGFuZCBcImNyb3NzXCIgYXhpcyxcbiAgICAgYmVjYXVzZSBpbiBhIHZlcnRpY2FsIGdyYXBoIHRoZSBwcmltYXJ5IGF4aXMgaXMgdGhlIFkgYXhpc1xuICAgICBhbmQgdGhlIGNyb3NzIGF4aXMgaXMgdGhlIFggYXhpcy5cblxuICAgICBGaXJzdCBzdGVwIG9mIGRyYXdpbmcgdGhlIGZ1bm5lbCBncmFwaCBpcyBnZXR0aW5nIHRoZSBjb29yZGluYXRlcyBvZiBwb2ludHMsXG4gICAgIHRoYXQgYXJlIHVzZWQgd2hlbiBkcmF3aW5nIHRoZSBwYXRocy5cblxuICAgICBUaGVyZSBhcmUgNCBwYXRocyBpbiB0aGUgZXhhbXBsZSBhYm92ZTogQSwgQiwgQyBhbmQgRC5cbiAgICAgU3VjaCBmdW5uZWwgaGFzIDMgbGFiZWxzIGFuZCAzIHN1YkxhYmVscy5cbiAgICAgVGhpcyBtZWFucyB0aGF0IHRoZSBtYWluIGF4aXMgaGFzIDQgcG9pbnRzIChudW1iZXIgb2YgbGFiZWxzICsgMSlcbiAgICAgT25lIHRoZSBBU0NJSSBpbGx1c3RyYXRlZCBncmFwaCBhYm92ZSwgdGhvc2UgcG9pbnRzIGFyZSBpbGx1c3RyYXRlZCB3aXRoIGEgIyBzeW1ib2wuXG5cbiAgICAqL1xuICAgIGdldE1haW5BeGlzUG9pbnRzKCkge1xuICAgICAgICBjb25zdCBzaXplID0gdGhpcy5nZXREYXRhU2l6ZSgpO1xuICAgICAgICBjb25zdCBwb2ludHMgPSBbXTtcbiAgICAgICAgY29uc3QgZnVsbERpbWVuc2lvbiA9IHRoaXMuaXNWZXJ0aWNhbCgpID8gdGhpcy5nZXRIZWlnaHQoKSA6IHRoaXMuZ2V0V2lkdGgoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gc2l6ZTsgaSsrKSB7XG4gICAgICAgICAgICBwb2ludHMucHVzaChTVkdGdW5uZWwucm91bmRQb2ludChmdWxsRGltZW5zaW9uICogaSAvIHNpemUpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcG9pbnRzO1xuICAgIH1cblxuICAgIGdldENyb3NzQXhpc1BvaW50cygpIHtcbiAgICAgICAgY29uc3QgcG9pbnRzID0gW107XG4gICAgICAgIGNvbnN0IGZ1bGxEaW1lbnNpb24gPSB0aGlzLmdldEZ1bGxEaW1lbnNpb24oKTtcbiAgICAgICAgLy8gZ2V0IGhhbGYgb2YgdGhlIGdyYXBoIGNvbnRhaW5lciBoZWlnaHQgb3Igd2lkdGgsIHNpbmNlIGZ1bm5lbCBzaGFwZSBpcyBzeW1tZXRyaWNcbiAgICAgICAgLy8gd2UgdXNlIHRoaXMgd2hlbiBjYWxjdWxhdGluZyB0aGUgXCJBXCIgc2hhcGVcbiAgICAgICAgY29uc3QgZGltZW5zaW9uID0gZnVsbERpbWVuc2lvbiAvIDI7XG4gICAgICAgIGlmICh0aGlzLmlzMmQoKSkge1xuICAgICAgICAgICAgY29uc3QgdG90YWxWYWx1ZXMgPSB0aGlzLmdldFZhbHVlczJkKCk7XG4gICAgICAgICAgICBjb25zdCBtYXggPSBNYXRoLm1heCguLi50b3RhbFZhbHVlcyk7XG5cbiAgICAgICAgICAgIC8vIGR1cGxpY2F0ZSBsYXN0IHZhbHVlXG4gICAgICAgICAgICB0b3RhbFZhbHVlcy5wdXNoKFsuLi50b3RhbFZhbHVlc10ucG9wKCkpO1xuICAgICAgICAgICAgLy8gZ2V0IHBvaW50cyBmb3IgcGF0aCBcIkFcIlxuICAgICAgICAgICAgcG9pbnRzLnB1c2godG90YWxWYWx1ZXMubWFwKHZhbHVlID0+IFNWR0Z1bm5lbC5yb3VuZFBvaW50KChtYXggLSB2YWx1ZSkgLyBtYXggKiBkaW1lbnNpb24pKSk7XG4gICAgICAgICAgICAvLyBwZXJjZW50YWdlcyB3aXRoIGR1cGxpY2F0ZWQgbGFzdCB2YWx1ZVxuICAgICAgICAgICAgY29uc3QgcGVyY2VudGFnZXNGdWxsID0gdGhpcy5nZXRQZXJjZW50YWdlczJkKCk7XG4gICAgICAgICAgICBjb25zdCBwb2ludHNPZkZpcnN0UGF0aCA9IHBvaW50c1swXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLmdldFN1YkRhdGFTaXplKCk7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBwb2ludHNbaSAtIDFdO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1BvaW50cyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmdldERhdGFTaXplKCk7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBuZXdQb2ludHMucHVzaChTVkdGdW5uZWwucm91bmRQb2ludChcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb21tYS1kYW5nbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHBbal0gKyAoZnVsbERpbWVuc2lvbiAtIHBvaW50c09mRmlyc3RQYXRoW2pdICogMikgKiAocGVyY2VudGFnZXNGdWxsW2pdW2kgLSAxXSAvIDEwMClcbiAgICAgICAgICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gZHVwbGljYXRlIHRoZSBsYXN0IHZhbHVlIGFzIHBvaW50cyAjMiBhbmQgIzMgaGF2ZSB0aGUgc2FtZSB2YWx1ZSBvbiB0aGUgY3Jvc3MgYXhpc1xuICAgICAgICAgICAgICAgIG5ld1BvaW50cy5wdXNoKFsuLi5uZXdQb2ludHNdLnBvcCgpKTtcbiAgICAgICAgICAgICAgICBwb2ludHMucHVzaChuZXdQb2ludHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBhZGQgcG9pbnRzIGZvciBwYXRoIFwiRFwiLCB0aGF0IGlzIHNpbXBseSB0aGUgXCJpbnZlcnRlZFwiIHBhdGggXCJBXCJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKHBvaW50c09mRmlyc3RQYXRoLm1hcChwb2ludCA9PiBmdWxsRGltZW5zaW9uIC0gcG9pbnQpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEFzIHlvdSBjYW4gc2VlIG9uIHRoZSB2aXN1YWxpemF0aW9uIGFib3ZlIHBvaW50cyAjMiBhbmQgIzMgaGF2ZSB0aGUgc2FtZSBjcm9zcyBheGlzIGNvb3JkaW5hdGVcbiAgICAgICAgICAgIC8vIHNvIHdlIGR1cGxpY2F0ZSB0aGUgbGFzdCB2YWx1ZVxuICAgICAgICAgICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4udGhpcy52YWx1ZXMpO1xuICAgICAgICAgICAgY29uc3QgdmFsdWVzID0gWy4uLnRoaXMudmFsdWVzXS5jb25jYXQoWy4uLnRoaXMudmFsdWVzXS5wb3AoKSk7XG4gICAgICAgICAgICAvLyBpZiB0aGUgZ3JhcGggaXMgc2ltcGxlIChub3QgdHdvLWRpbWVuc2lvbmFsKSB0aGVuIHdlIGhhdmUgb25seSBwYXRocyBcIkFcIiBhbmQgXCJEXCJcbiAgICAgICAgICAgIC8vIHdoaWNoIGFyZSBzeW1tZXRyaWMuIFNvIHdlIGdldCB0aGUgcG9pbnRzIGZvciBcIkFcIiBhbmQgdGhlbiBnZXQgcG9pbnRzIGZvciBcIkRcIiBieSBzdWJ0cmFjdGluZyBcIkFcIlxuICAgICAgICAgICAgLy8gcG9pbnRzIGZyb20gZ3JhcGggY3Jvc3MgZGltZW5zaW9uIGxlbmd0aFxuICAgICAgICAgICAgcG9pbnRzLnB1c2godmFsdWVzLm1hcCh2YWx1ZSA9PiBTVkdGdW5uZWwucm91bmRQb2ludCgobWF4IC0gdmFsdWUpIC8gbWF4ICogZGltZW5zaW9uKSkpO1xuICAgICAgICAgICAgcG9pbnRzLnB1c2gocG9pbnRzWzBdLm1hcChwb2ludCA9PiBmdWxsRGltZW5zaW9uIC0gcG9pbnQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwb2ludHM7XG4gICAgfVxuXG4gICAgZ2V0R3JhcGhUeXBlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZXMgJiYgdGhpcy52YWx1ZXNbMF0gaW5zdGFuY2VvZiBBcnJheSA/ICcyZCcgOiAnbm9ybWFsJztcbiAgICB9XG5cbiAgICBpczJkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRHcmFwaFR5cGUoKSA9PT0gJzJkJztcbiAgICB9XG5cbiAgICBpc1ZlcnRpY2FsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc7XG4gICAgfVxuXG4gICAgZ2V0RGF0YVNpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlcy5sZW5ndGg7XG4gICAgfVxuXG4gICAgZ2V0U3ViRGF0YVNpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlc1swXS5sZW5ndGg7XG4gICAgfVxuXG4gICAgZ2V0RnVsbERpbWVuc2lvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNWZXJ0aWNhbCgpID8gdGhpcy5nZXRXaWR0aCgpIDogdGhpcy5nZXRIZWlnaHQoKTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZUxlZ2VuZEJhY2tncm91bmQoaW5kZXgpIHtcbiAgICAgICAgY29uc3QgY29sb3IgPSB0aGlzLmNvbG9yc1tpbmRleF07XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb2xvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBgYmFja2dyb3VuZC1jb2xvcjogJHtjb2xvcn1gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbG9yLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIGBiYWNrZ3JvdW5kLWNvbG9yOiAke2NvbG9yWzBdfWA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCgke3RoaXMuZ3JhZGllbnREaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyBcbiAgICAgICAgICAgID8gJ3RvIHJpZ2h0LCAnIFxuICAgICAgICAgICAgOiAnJ30ke2NvbG9yLmpvaW4oJywgJyl9KWA7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldFN1YkxhYmVscyhvcHRpb25zKSB7XG4gICAgICAgIGlmICghb3B0aW9ucy5kYXRhKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgaXMgbWlzc2luZycpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgeyBkYXRhIH0gPSBvcHRpb25zO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZGF0YS5zdWJMYWJlbHMgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gW107XG5cbiAgICAgICAgcmV0dXJuIGRhdGEuc3ViTGFiZWxzO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRMYWJlbHMob3B0aW9ucykge1xuICAgICAgICBpZiAoIW9wdGlvbnMuZGF0YSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEYXRhIGlzIG1pc3NpbmcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gb3B0aW9ucztcblxuICAgICAgICBpZiAodHlwZW9mIGRhdGEubGFiZWxzID09PSAndW5kZWZpbmVkJykgcmV0dXJuIFtdO1xuXG4gICAgICAgIHJldHVybiBkYXRhLmxhYmVscztcbiAgICB9XG5cbiAgICBhZGRMYWJlbHMoKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcblxuICAgICAgICBjb25zdCBob2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaG9sZGVyLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc3ZnLWZ1bm5lbC1qc19fbGFiZWxzJyk7XG5cbiAgICAgICAgdGhpcy5wZXJjZW50YWdlcy5mb3JFYWNoKChwZXJjZW50YWdlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGFiZWxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBsYWJlbEVsZW1lbnQuc2V0QXR0cmlidXRlKCdjbGFzcycsIGBzdmctZnVubmVsLWpzX19sYWJlbCBsYWJlbC0ke2luZGV4ICsgMX1gKTtcblxuICAgICAgICAgICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHRpdGxlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbGFiZWxfX3RpdGxlJyk7XG4gICAgICAgICAgICB0aXRsZS50ZXh0Q29udGVudCA9IHRoaXMubGFiZWxzW2luZGV4XSB8fCAnJztcblxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHZhbHVlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbGFiZWxfX3ZhbHVlJyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHZhbHVlTnVtYmVyID0gdGhpcy5pczJkKCkgPyB0aGlzLmdldFZhbHVlczJkKClbaW5kZXhdIDogdGhpcy52YWx1ZXNbaW5kZXhdO1xuICAgICAgICAgICAgdmFsdWUudGV4dENvbnRlbnQgPSBTVkdGdW5uZWwuZm9ybWF0TnVtYmVyKHZhbHVlTnVtYmVyKTtcblxuICAgICAgICAgICAgY29uc3QgcGVyY2VudGFnZVZhbHVlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBwZXJjZW50YWdlVmFsdWUuc2V0QXR0cmlidXRlKCdjbGFzcycsICdsYWJlbF9fcGVyY2VudGFnZScpO1xuXG4gICAgICAgICAgICBpZiAocGVyY2VudGFnZSAhPT0gMTAwKSB7XG4gICAgICAgICAgICAgICAgcGVyY2VudGFnZVZhbHVlLnRleHRDb250ZW50ID0gYCR7cGVyY2VudGFnZS50b1N0cmluZygpfSVgO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsYWJlbEVsZW1lbnQuYXBwZW5kQ2hpbGQodmFsdWUpO1xuICAgICAgICAgICAgbGFiZWxFbGVtZW50LmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmRpc3BsYXlQZXJjZW50KSB7XG4gICAgICAgICAgICAgICAgbGFiZWxFbGVtZW50LmFwcGVuZENoaWxkKHBlcmNlbnRhZ2VWYWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGhvbGRlci5hcHBlbmRDaGlsZChsYWJlbEVsZW1lbnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChob2xkZXIpO1xuICAgIH1cblxuICAgIGFkZFN1YkxhYmVscygpIHtcbiAgICAgICAgaWYgKHRoaXMuc3ViTGFiZWxzKSB7XG4gICAgICAgICAgICBjb25zdCBzdWJMYWJlbHNIb2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHN1YkxhYmVsc0hvbGRlci5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3N2Zy1mdW5uZWwtanNfX3N1YkxhYmVscycpO1xuXG4gICAgICAgICAgICBsZXQgc3ViTGFiZWxzSFRNTCA9ICcnO1xuXG4gICAgICAgICAgICB0aGlzLnN1YkxhYmVscy5mb3JFYWNoKChzdWJMYWJlbCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBzdWJMYWJlbHNIVE1MICs9IGA8ZGl2IGNsYXNzPVwic3ZnLWZ1bm5lbC1qc19fc3ViTGFiZWwgc3ZnLWZ1bm5lbC1qc19fc3ViTGFiZWwtJHtpbmRleCArIDF9XCI+XG4gICAgPGRpdiBjbGFzcz1cInN2Zy1mdW5uZWwtanNfX3N1YkxhYmVsLS1jb2xvclwiIHN0eWxlPVwiJHt0aGlzLmdlbmVyYXRlTGVnZW5kQmFja2dyb3VuZChpbmRleCl9XCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInN2Zy1mdW5uZWwtanNfX3N1YkxhYmVsLS10aXRsZVwiPiR7c3ViTGFiZWx9PC9kaXY+XG48L2Rpdj5gO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHN1YkxhYmVsc0hvbGRlci5pbm5lckhUTUwgPSBzdWJMYWJlbHNIVE1MO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoc3ViTGFiZWxzSG9sZGVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUNvbnRhaW5lcihvcHRpb25zKSB7XG4gICAgICAgIGlmICghb3B0aW9ucy5jb250YWluZXIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29udGFpbmVyIGlzIG1pc3NpbmcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihvcHRpb25zLmNvbnRhaW5lcik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3N2Zy1mdW5uZWwtanMnKTtcblxuICAgICAgICB0aGlzLmdyYXBoQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuZ3JhcGhDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc3ZnLWZ1bm5lbC1qc19fY29udGFpbmVyJyk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZ3JhcGhDb250YWluZXIpO1xuXG4gICAgICAgIGlmIChvcHRpb25zLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc3ZnLWZ1bm5lbC1qcy0tdmVydGljYWwnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBnZXRWYWx1ZXMob3B0aW9ucykge1xuICAgICAgICBpZiAoIW9wdGlvbnMuZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgeyBkYXRhIH0gPSBvcHRpb25zO1xuXG4gICAgICAgIGlmIChkYXRhIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKGRhdGFbMF0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGF0YS5tYXAoaXRlbSA9PiBpdGVtLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5kYXRhLnZhbHVlcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBnZXRWYWx1ZXMyZCgpIHtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gW107XG5cbiAgICAgICAgdGhpcy52YWx1ZXMuZm9yRWFjaCgodmFsdWVTZXQpID0+IHtcbiAgICAgICAgICAgIHZhbHVlcy5wdXNoKHZhbHVlU2V0LnJlZHVjZSgoc3VtLCB2YWx1ZSkgPT4gc3VtICsgdmFsdWUsIDApKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICB9XG5cbiAgICBnZXRQZXJjZW50YWdlczJkKCkge1xuICAgICAgICBjb25zdCBwZXJjZW50YWdlcyA9IFtdO1xuXG4gICAgICAgIHRoaXMudmFsdWVzLmZvckVhY2goKHZhbHVlU2V0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0b3RhbCA9IHZhbHVlU2V0LnJlZHVjZSgoc3VtLCB2YWx1ZSkgPT4gc3VtICsgdmFsdWUsIDApO1xuICAgICAgICAgICAgcGVyY2VudGFnZXMucHVzaCh2YWx1ZVNldC5tYXAodmFsdWUgPT4gU1ZHRnVubmVsLnJvdW5kUG9pbnQodmFsdWUgKiAxMDAgLyB0b3RhbCkpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHBlcmNlbnRhZ2VzO1xuICAgIH1cblxuICAgIGNyZWF0ZVBlcmNlbnRhZ2VzKCkge1xuICAgICAgICBsZXQgdmFsdWVzID0gW107XG5cbiAgICAgICAgaWYgKHRoaXMuaXMyZCgpKSB7XG4gICAgICAgICAgICB2YWx1ZXMgPSB0aGlzLmdldFZhbHVlczJkKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZXMgPSBbLi4udGhpcy52YWx1ZXNdO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4udmFsdWVzKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlcy5tYXAodmFsdWUgPT4gU1ZHRnVubmVsLnJvdW5kUG9pbnQodmFsdWUgKiAxMDAgLyBtYXgpKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlU1ZHRWxlbWVudChlbGVtZW50LCBjb250YWluZXIsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgZWxlbWVudCk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBhdHRyaWJ1dGVzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgU1ZHRnVubmVsLnNldEF0dHJzKGVsLCBhdHRyaWJ1dGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgY29udGFpbmVyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBlbDtcbiAgICB9XG5cbiAgICBzdGF0aWMgcm91bmRQb2ludChudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQobnVtYmVyICogMTApIC8gMTA7XG4gICAgfVxuXG4gICAgc3RhdGljIGZvcm1hdE51bWJlcihudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIE51bWJlcihudW1iZXIpLnRvRml4ZWQoKS5yZXBsYWNlKC8oXFxkKSg/PShcXGR7M30pKyg/IVxcZCkpL2csICckMSwnKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlQ3VydmVzKHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgICAgIHJldHVybiBgIEMke1NWR0Z1bm5lbC5yb3VuZFBvaW50KCh4MiArIHgxKSAvIDIpfSwke3kxfSAke1NWR0Z1bm5lbC5yb3VuZFBvaW50KCh4MiArIHgxKSAvIDIpfSwke3kyfSAke3gyfSwke3kyfWA7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZVZlcnRpY2FsQ3VydmVzKHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgICAgIHJldHVybiBgIEMke3gxfSwke1NWR0Z1bm5lbC5yb3VuZFBvaW50KCh5MiArIHkxKSAvIDIpfSAke3gyfSwke1NWR0Z1bm5lbC5yb3VuZFBvaW50KCh5MiArIHkxKSAvIDIpfSAke3gyfSwke3kyfWA7XG4gICAgfVxuXG4gICAgc3RhdGljIHNldEF0dHJzKGVsZW1lbnQsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhdHRyaWJ1dGVzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyaWJ1dGVzW2tleV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhcHBseUdyYWRpZW50KHN2ZywgcGF0aCwgY29sb3JzLCBpbmRleCkge1xuICAgICAgICBjb25zdCBkZWZzID0gKHN2Zy5xdWVyeVNlbGVjdG9yKCdkZWZzJykgPT09IG51bGwpXG4gICAgICAgICAgICA/IFNWR0Z1bm5lbC5jcmVhdGVTVkdFbGVtZW50KCdkZWZzJywgc3ZnKVxuICAgICAgICAgICAgOiBzdmcucXVlcnlTZWxlY3RvcignZGVmcycpO1xuICAgICAgICBjb25zdCBncmFkaWVudE5hbWUgPSBgZnVubmVsR3JhZGllbnQtJHtpbmRleH1gO1xuICAgICAgICBjb25zdCBncmFkaWVudCA9IFNWR0Z1bm5lbC5jcmVhdGVTVkdFbGVtZW50KCdsaW5lYXJHcmFkaWVudCcsIGRlZnMsIHtcbiAgICAgICAgICAgIGlkOiBncmFkaWVudE5hbWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMuZ3JhZGllbnREaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgICAgICAgIFNWR0Z1bm5lbC5zZXRBdHRycyhncmFkaWVudCwge1xuICAgICAgICAgICAgICAgIHgxOiAnMCcsXG4gICAgICAgICAgICAgICAgeDI6ICcwJyxcbiAgICAgICAgICAgICAgICB5MTogJzAnLFxuICAgICAgICAgICAgICAgIHkyOiAnMSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbnVtYmVyT2ZDb2xvcnMgPSBjb2xvcnMubGVuZ3RoO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtYmVyT2ZDb2xvcnM7IGkrKykge1xuICAgICAgICAgICAgU1ZHRnVubmVsLmNyZWF0ZVNWR0VsZW1lbnQoJ3N0b3AnLCBncmFkaWVudCwge1xuICAgICAgICAgICAgICAgICdzdG9wLWNvbG9yJzogY29sb3JzW2ldLFxuICAgICAgICAgICAgICAgIG9mZnNldDogYCR7TWF0aC5yb3VuZCgxMDAgKiBpIC8gKG51bWJlck9mQ29sb3JzIC0gMSkpfSVgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIFNWR0Z1bm5lbC5zZXRBdHRycyhwYXRoLCB7XG4gICAgICAgICAgICBmaWxsOiBgdXJsKFwiIyR7Z3JhZGllbnROYW1lfVwiKWAsXG4gICAgICAgICAgICBzdHJva2U6IGB1cmwoXCIjJHtncmFkaWVudE5hbWV9XCIpYFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBtYWtlU1ZHKCkge1xuICAgICAgICBjb25zdCBzdmcgPSBTVkdGdW5uZWwuY3JlYXRlU1ZHRWxlbWVudCgnc3ZnJywgdGhpcy5ncmFwaENvbnRhaW5lciwge1xuICAgICAgICAgICAgd2lkdGg6IHRoaXMuZ2V0V2lkdGgoKSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5nZXRIZWlnaHQoKVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCB2YWx1ZXNOdW0gPSB0aGlzLmdldENyb3NzQXhpc1BvaW50cygpLmxlbmd0aCAtIDE7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWVzTnVtOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSBTVkdGdW5uZWwuY3JlYXRlU1ZHRWxlbWVudCgncGF0aCcsIHN2Zyk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gKHRoaXMuaXMyZCgpKSA/IHRoaXMuY29sb3JzW2ldIDogdGhpcy5jb2xvcnM7XG4gICAgICAgICAgICBjb25zdCBmaWxsTW9kZSA9ICh0eXBlb2YgY29sb3IgPT09ICdzdHJpbmcnIHx8IGNvbG9yLmxlbmd0aCA9PT0gMSkgPyAnc29saWQnIDogJ2dyYWRpZW50JztcblxuICAgICAgICAgICAgaWYgKGZpbGxNb2RlID09PSAnc29saWQnKSB7XG4gICAgICAgICAgICAgICAgU1ZHRnVubmVsLnNldEF0dHJzKHBhdGgsIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsbDogY29sb3IsXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZTogY29sb3JcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlsbE1vZGUgPT09ICdncmFkaWVudCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGx5R3JhZGllbnQoc3ZnLCBwYXRoLCBjb2xvciwgaSArIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzdmcuYXBwZW5kQ2hpbGQocGF0aCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdyYXBoQ29udGFpbmVyLmFwcGVuZENoaWxkKHN2Zyk7XG4gICAgfVxuXG4gICAgZ2V0U1ZHKCkge1xuICAgICAgICBjb25zdCBzdmcgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcblxuICAgICAgICBpZiAoIXN2Zykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBTVkcgZm91bmQgaW5zaWRlIG9mIHRoZSBjb250YWluZXInKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdmc7XG4gICAgfVxuXG4gICAgZ2V0V2lkdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdyYXBoQ29udGFpbmVyLmNsaWVudFdpZHRoO1xuICAgIH1cblxuICAgIGdldEhlaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JhcGhDb250YWluZXIuY2xpZW50SGVpZ2h0O1xuICAgIH1cblxuICAgIC8qXG4gICAgICAgIEEgZnVubmVsIHNlZ21lbnQgaXMgZHJhdyBpbiBhIGNsb2Nrd2lzZSBkaXJlY3Rpb24uXG4gICAgICAgIFBhdGggMS0yIGlzIGRyYXduLFxuICAgICAgICB0aGVuIGNvbm5lY3RlZCB3aXRoIGEgc3RyYWlnaHQgdmVydGljYWwgbGluZSAyLTMsXG4gICAgICAgIHRoZW4gYSBsaW5lIDMtNCBpcyBkcmF3ICh1c2luZyBZTmV4dCBwb2ludHMgZ29pbmcgaW4gYmFja3dhcmRzIGRpcmVjdGlvbilcbiAgICAgICAgdGhlbiBwYXRoIGlzIGNsb3NlZCAoY29ubmVjdGVkIHdpdGggdGhlIHN0YXJ0aW5nIHBvaW50IDEpLlxuXG4gICAgICAgIDEtLS0tLS0tLS0tPjJcbiAgICAgICAgXiAgICAgICAgICAgfFxuICAgICAgICB8ICAgICAgICAgICB2XG4gICAgICAgIDQ8LS0tLS0tLS0tLTNcblxuICAgICAgICBPbiB0aGUgZ3JhcGggb24gbGluZSAyMCBpdCB3b3JrcyBsaWtlIHRoaXM6XG4gICAgICAgIEEjMCwgQSMxLCBBIzIsIEEjMywgQiMzLCBCIzIsIEIjMSwgQiMwLCBjbG9zZSB0aGUgcGF0aC5cblxuICAgICAgICBQb2ludHMgZm9yIHBhdGggXCJCXCIgYXJlIHBhc3NlZCBhcyB0aGUgWU5leHQgcGFyYW0uXG4gICAgICovXG5cbiAgICBjcmVhdGVQYXRoKGluZGV4KSB7XG4gICAgICAgIGNvbnN0IFggPSB0aGlzLmdldE1haW5BeGlzUG9pbnRzKCk7XG4gICAgICAgIGNvbnN0IFkgPSB0aGlzLmdldENyb3NzQXhpc1BvaW50cygpW2luZGV4XTtcbiAgICAgICAgY29uc3QgWU5leHQgPSB0aGlzLmdldENyb3NzQXhpc1BvaW50cygpW2luZGV4ICsgMV07XG5cbiAgICAgICAgbGV0IHN0ciA9IGBNJHtYWzBdfSwke1lbMF19YDtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IFgubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBzdHIgKz0gU1ZHRnVubmVsLmNyZWF0ZUN1cnZlcyhYW2ldLCBZW2ldLCBYW2kgKyAxXSwgWVtpICsgMV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RyICs9IGAgTCR7Wy4uLlhdLnBvcCgpfSwke1suLi5ZTmV4dF0ucG9wKCl9YDtcblxuICAgICAgICBmb3IgKGxldCBpID0gWC5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XG4gICAgICAgICAgICBzdHIgKz0gU1ZHRnVubmVsLmNyZWF0ZUN1cnZlcyhYW2ldLCBZTmV4dFtpXSwgWFtpIC0gMV0sIFlOZXh0W2kgLSAxXSk7XG4gICAgICAgIH1cblxuICAgICAgICBzdHIgKz0gJyBaJztcblxuICAgICAgICByZXR1cm4gc3RyO1xuICAgIH1cblxuICAgIC8qXG4gICAgICAgIEluIGEgdmVydGljYWwgcGF0aCB3ZSBnbyBjb3VudGVyLWNsb2Nrd2lzZVxuXG4gICAgICAgIDE8LS0tLS0tLS0tLTRcbiAgICAgICAgfCAgICAgICAgICAgXlxuICAgICAgICB2ICAgICAgICAgICB8XG4gICAgICAgIDItLS0tLS0tLS0tPjNcbiAgICAgKi9cblxuICAgIGNyZWF0ZVZlcnRpY2FsUGF0aChpbmRleCkge1xuICAgICAgICBjb25zdCBYID0gdGhpcy5nZXRDcm9zc0F4aXNQb2ludHMoKVtpbmRleF07XG4gICAgICAgIGNvbnN0IFhOZXh0ID0gdGhpcy5nZXRDcm9zc0F4aXNQb2ludHMoKVtpbmRleCArIDFdO1xuICAgICAgICBjb25zdCBZID0gdGhpcy5nZXRNYWluQXhpc1BvaW50cygpO1xuXG4gICAgICAgIGxldCBzdHIgPSBgTSR7WFswXX0sJHtZWzBdfWA7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBYLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgc3RyICs9IFNWR0Z1bm5lbC5jcmVhdGVWZXJ0aWNhbEN1cnZlcyhYW2ldLCBZW2ldLCBYW2kgKyAxXSwgWVtpICsgMV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RyICs9IGAgTCR7Wy4uLlhOZXh0XS5wb3AoKX0sJHtbLi4uWV0ucG9wKCl9YDtcblxuICAgICAgICBmb3IgKGxldCBpID0gWC5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XG4gICAgICAgICAgICBzdHIgKz0gU1ZHRnVubmVsLmNyZWF0ZVZlcnRpY2FsQ3VydmVzKFhOZXh0W2ldLCBZW2ldLCBYTmV4dFtpIC0gMV0sIFlbaSAtIDFdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0ciArPSAnIFonO1xuXG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuXG4gICAgZHJhdygpIHtcbiAgICAgICAgdGhpcy5tYWtlU1ZHKCk7XG4gICAgICAgIGNvbnN0IHN2ZyA9IHRoaXMuZ2V0U1ZHKCk7XG5cbiAgICAgICAgdGhpcy5hZGRMYWJlbHMoKTtcblxuICAgICAgICBpZiAodGhpcy5pczJkKCkpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkU3ViTGFiZWxzKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwYXRocyA9IHN2Zy5xdWVyeVNlbGVjdG9yQWxsKCdwYXRoJyk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXRocy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgZCA9IHRoaXMuaXNWZXJ0aWNhbCgpID8gdGhpcy5jcmVhdGVWZXJ0aWNhbFBhdGgoaSkgOiB0aGlzLmNyZWF0ZVBhdGgoaSk7XG4gICAgICAgICAgICBwYXRoc1tpXS5zZXRBdHRyaWJ1dGUoJ2QnLCBkKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxud2luZG93LlNWR0Z1bm5lbCA9IFNWR0Z1bm5lbDtcbiJdfQ==
