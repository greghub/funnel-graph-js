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
        points.push(FunnelGraph.roundPoint(fullDimension * i / size));
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
          return FunnelGraph.roundPoint((max - value) / max * dimension);
        })); // percentages with duplicated last value

        var percentagesFull = this.getPercentages2d();
        var pointsOfFirstPath = points[0];

        for (var i = 1; i < this.getSubDataSize(); i++) {
          var p = points[i - 1];
          var newPoints = [];

          for (var j = 0; j < this.getDataSize(); j++) {
            newPoints.push(FunnelGraph.roundPoint( // eslint-disable-next-line comma-dangle
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
          return FunnelGraph.roundPoint((_max - value) / _max * dimension);
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
        value.textContent = FunnelGraph.formatNumber(valueNumber);
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
          return FunnelGraph.roundPoint(value * 100 / total);
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
        return FunnelGraph.roundPoint(value * 100 / max);
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
        str += FunnelGraph.createCurves(X[i], Y[i], X[i + 1], Y[i + 1]);
      }

      str += " L".concat(_toConsumableArray(X).pop(), ",").concat(_toConsumableArray(YNext).pop());

      for (var _i = X.length - 1; _i > 0; _i--) {
        str += FunnelGraph.createCurves(X[_i], YNext[_i], X[_i - 1], YNext[_i - 1]);
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
        str += FunnelGraph.createVerticalCurves(X[i], Y[i], X[i + 1], Y[i + 1]);
      }

      str += " L".concat(_toConsumableArray(XNext).pop(), ",").concat(_toConsumableArray(Y).pop());

      for (var _i2 = X.length - 1; _i2 > 0; _i2--) {
        str += FunnelGraph.createVerticalCurves(XNext[_i2], Y[_i2], XNext[_i2 - 1], Y[_i2 - 1]);
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
      return " C".concat(FunnelGraph.roundPoint((x2 + x1) / 2), ",").concat(y1, " ").concat(FunnelGraph.roundPoint((x2 + x1) / 2), ",").concat(y2, " ").concat(x2, ",").concat(y2);
    }
  }, {
    key: "createVerticalCurves",
    value: function createVerticalCurves(x1, y1, x2, y2) {
      return " C".concat(x1, ",").concat(FunnelGraph.roundPoint((y2 + y1) / 2), " ").concat(x2, ",").concat(FunnelGraph.roundPoint((y2 + y1) / 2), " ").concat(x2, ",").concat(y2);
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBO0lBRU0sVzs7O0FBQ0YsdUJBQVksT0FBWixFQUFxQjtBQUFBOztBQUNqQixTQUFLLGVBQUwsQ0FBcUIsT0FBckI7QUFDQSxTQUFLLE1BQUwsR0FBYyxPQUFPLENBQUMsSUFBUixDQUFhLE1BQTNCO0FBQ0EsU0FBSyxpQkFBTCxHQUEwQixPQUFPLENBQUMsaUJBQVIsSUFBNkIsT0FBTyxDQUFDLGlCQUFSLEtBQThCLFVBQTVELEdBQ25CLFVBRG1CLEdBRW5CLFlBRk47QUFHQSxTQUFLLFNBQUwsR0FBa0IsT0FBTyxDQUFDLFNBQVIsSUFBcUIsT0FBTyxDQUFDLFNBQVIsS0FBc0IsVUFBNUMsR0FBMEQsVUFBMUQsR0FBdUUsWUFBeEY7QUFDQSxTQUFLLE1BQUwsR0FBYyxXQUFXLENBQUMsU0FBWixDQUFzQixPQUF0QixDQUFkO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLFdBQVcsQ0FBQyxZQUFaLENBQXlCLE9BQXpCLENBQWpCO0FBQ0EsU0FBSyxNQUFMLEdBQWMsV0FBVyxDQUFDLFNBQVosQ0FBc0IsT0FBdEIsQ0FBZDtBQUNBLFNBQUssV0FBTCxHQUFtQixLQUFLLGlCQUFMLEVBQW5CO0FBQ0EsU0FBSyxjQUFMLEdBQXNCLE9BQU8sQ0FBQyxjQUFSLElBQTBCLEtBQWhEO0FBRUEsU0FBSyxJQUFMO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3dDQThCb0I7QUFDaEIsVUFBTSxJQUFJLEdBQUcsS0FBSyxXQUFMLEVBQWI7QUFDQSxVQUFNLE1BQU0sR0FBRyxFQUFmO0FBQ0EsVUFBTSxhQUFhLEdBQUcsS0FBSyxVQUFMLEtBQW9CLEtBQUssU0FBTCxFQUFwQixHQUF1QyxLQUFLLFFBQUwsRUFBN0Q7O0FBQ0EsV0FBSyxJQUFJLENBQUMsR0FBRyxD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SUFBWSxDQUFuQyxDQUFsQixjQUEyRCxFQUEzRCxjQUFpRSxXQUFXLENBQUMsVUFBWixDQUF1QixDQUFDLEVBQUUsR0FBRyxFQUFOLElBQVksQ0FBbkMsQ0FBakUsY0FBMEcsRUFBMUcsY0FBZ0gsRUFBaEg7QUFDSDs7OzZCQUVlLE8sRUFBUyxVLEVBQVk7QUFDakMsVUFBSSxRQUFPLFVBQVAsTUFBc0IsUUFBMUIsRUFBb0M7QUFDaEMsUUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLFVBQVosRUFBd0IsT0FBeEIsQ0FBZ0MsVUFBQyxHQUFELEVBQVM7QUFDckMsVUFBQSxPQUFPLENBQUMsWUFBUixDQUFxQixHQUFyQixFQUEwQixVQUFVLENBQUMsR0FBRCxDQUFwQztBQUNILFNBRkQ7QUFHSDtBQUNKOzs7Ozs7QUEyS0wsTUFBTSxDQUFDLFdBQVAsR0FBcUIsV0FBckIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKiBlc2xpbnQtZGlzYWJsZSBuby10cmFpbGluZy1zcGFjZXMgKi9cblxuY2xhc3MgRnVubmVsR3JhcGgge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVDb250YWluZXIob3B0aW9ucyk7XG4gICAgICAgIHRoaXMuY29sb3JzID0gb3B0aW9ucy5kYXRhLmNvbG9ycztcbiAgICAgICAgdGhpcy5ncmFkaWVudERpcmVjdGlvbiA9IChvcHRpb25zLmdyYWRpZW50RGlyZWN0aW9uICYmIG9wdGlvbnMuZ3JhZGllbnREaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpXG4gICAgICAgICAgICA/ICd2ZXJ0aWNhbCdcbiAgICAgICAgICAgIDogJ2hvcml6b250YWwnO1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IChvcHRpb25zLmRpcmVjdGlvbiAmJiBvcHRpb25zLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJykgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xuICAgICAgICB0aGlzLmxhYmVscyA9IEZ1bm5lbEdyYXBoLmdldExhYmVscyhvcHRpb25zKTtcbiAgICAgICAgdGhpcy5zdWJMYWJlbHMgPSBGdW5uZWxHcmFwaC5nZXRTdWJMYWJlbHMob3B0aW9ucyk7XG4gICAgICAgIHRoaXMudmFsdWVzID0gRnVubmVsR3JhcGguZ2V0VmFsdWVzKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLnBlcmNlbnRhZ2VzID0gdGhpcy5jcmVhdGVQZXJjZW50YWdlcygpO1xuICAgICAgICB0aGlzLmRpc3BsYXlQZXJjZW50ID0gb3B0aW9ucy5kaXNwbGF5UGVyY2VudCB8fCBmYWxzZTtcblxuICAgICAgICB0aGlzLmRyYXcoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICBBbiBleGFtcGxlIG9mIGEgdHdvLWRpbWVuc2lvbmFsIGZ1bm5lbCBncmFwaFxuICAgICMwLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgICAgICAgICAgICAgIC4uLiMxLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLi4uLlxuICAgICMwKioqKioqKioqKioqKioqKioqKiojMSoqICAgICAgICAgICAgICAgICAgICAjMi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4jMyAoQSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIzIqKioqKioqKioqKioqKioqKioqKioqKioqIzMgKEIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMyKysrKysrKysrKysrKysrKysrKysrKysrKyMzIChDKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKysrKysrKysrKysrKysrKysrK1xuICAgICMwKysrKysrKysrKysrKysrKysrKysjMSsrICAgICAgICAgICAgICAgICAgICAjMi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0jMyAoRClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLS0tLS1cbiAgICAgICAgICAgICAgICAgICAgICAgLS0tIzEtLS0tLS0tLS0tLS0tLS0tXG4gICAgIzAtLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgIE1haW4gYXhpcyBpcyB0aGUgcHJpbWFyeSBheGlzIG9mIHRoZSBncmFwaC5cbiAgICAgSW4gYSBob3Jpem9udGFsIGdyYXBoIGl0J3MgdGhlIFggYXhpcywgYW5kIFkgaXMgdGhlIGNyb3NzIGF4aXMuXG4gICAgIEhvd2V2ZXIgd2UgdXNlIHRoZSBuYW1lcyBcIm1haW5cIiBhbmQgXCJjcm9zc1wiIGF4aXMsXG4gICAgIGJlY2F1c2UgaW4gYSB2ZXJ0aWNhbCBncmFwaCB0aGUgcHJpbWFyeSBheGlzIGlzIHRoZSBZIGF4aXNcbiAgICAgYW5kIHRoZSBjcm9zcyBheGlzIGlzIHRoZSBYIGF4aXMuXG5cbiAgICAgRmlyc3Qgc3RlcCBvZiBkcmF3aW5nIHRoZSBmdW5uZWwgZ3JhcGggaXMgZ2V0dGluZyB0aGUgY29vcmRpbmF0ZXMgb2YgcG9pbnRzLFxuICAgICB0aGF0IGFyZSB1c2VkIHdoZW4gZHJhd2luZyB0aGUgcGF0aHMuXG5cbiAgICAgVGhlcmUgYXJlIDQgcGF0aHMgaW4gdGhlIGV4YW1wbGUgYWJvdmU6IEEsIEIsIEMgYW5kIEQuXG4gICAgIFN1Y2ggZnVubmVsIGhhcyAzIGxhYmVscyBhbmQgMyBzdWJMYWJlbHMuXG4gICAgIFRoaXMgbWVhbnMgdGhhdCB0aGUgbWFpbiBheGlzIGhhcyA0IHBvaW50cyAobnVtYmVyIG9mIGxhYmVscyArIDEpXG4gICAgIE9uZSB0aGUgQVNDSUkgaWxsdXN0cmF0ZWQgZ3JhcGggYWJvdmUsIHRob3NlIHBvaW50cyBhcmUgaWxsdXN0cmF0ZWQgd2l0aCBhICMgc3ltYm9sLlxuXG4gICAgKi9cbiAgICBnZXRNYWluQXhpc1BvaW50cygpIHtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMuZ2V0RGF0YVNpemUoKTtcbiAgICAgICAgY29uc3QgcG9pbnRzID0gW107XG4gICAgICAgIGNvbnN0IGZ1bGxEaW1lbnNpb24gPSB0aGlzLmlzVmVydGljYWwoKSA/IHRoaXMuZ2V0SGVpZ2h0KCkgOiB0aGlzLmdldFdpZHRoKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IHNpemU7IGkrKykge1xuICAgICAgICAgICAgcG9pbnRzLnB1c2goRnVubmVsR3JhcGgucm91bmRQb2ludChmdWxsRGltZW5zaW9uICogaSAvIHNpemUpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcG9pbnRzO1xuICAgIH1cblxuICAgIGdldENyb3NzQXhpc1BvaW50cygpIHtcbiAgICAgICAgY29uc3QgcG9pbnRzID0gW107XG4gICAgICAgIGNvbnN0IGZ1bGxEaW1lbnNpb24gPSB0aGlzLmdldEZ1bGxEaW1lbnNpb24oKTtcbiAgICAgICAgLy8gZ2V0IGhhbGYgb2YgdGhlIGdyYXBoIGNvbnRhaW5lciBoZWlnaHQgb3Igd2lkdGgsIHNpbmNlIGZ1bm5lbCBzaGFwZSBpcyBzeW1tZXRyaWNcbiAgICAgICAgLy8gd2UgdXNlIHRoaXMgd2hlbiBjYWxjdWxhdGluZyB0aGUgXCJBXCIgc2hhcGVcbiAgICAgICAgY29uc3QgZGltZW5zaW9uID0gZnVsbERpbWVuc2lvbiAvIDI7XG4gICAgICAgIGlmICh0aGlzLmlzMmQoKSkge1xuICAgICAgICAgICAgY29uc3QgdG90YWxWYWx1ZXMgPSB0aGlzLmdldFZhbHVlczJkKCk7XG4gICAgICAgICAgICBjb25zdCBtYXggPSBNYXRoLm1heCguLi50b3RhbFZhbHVlcyk7XG5cbiAgICAgICAgICAgIC8vIGR1cGxpY2F0ZSBsYXN0IHZhbHVlXG4gICAgICAgICAgICB0b3RhbFZhbHVlcy5wdXNoKFsuLi50b3RhbFZhbHVlc10ucG9wKCkpO1xuICAgICAgICAgICAgLy8gZ2V0IHBvaW50cyBmb3IgcGF0aCBcIkFcIlxuICAgICAgICAgICAgcG9pbnRzLnB1c2godG90YWxWYWx1ZXMubWFwKHZhbHVlID0+IEZ1bm5lbEdyYXBoLnJvdW5kUG9pbnQoKG1heCAtIHZhbHVlKSAvIG1heCAqIGRpbWVuc2lvbikpKTtcbiAgICAgICAgICAgIC8vIHBlcmNlbnRhZ2VzIHdpdGggZHVwbGljYXRlZCBsYXN0IHZhbHVlXG4gICAgICAgICAgICBjb25zdCBwZXJjZW50YWdlc0Z1bGwgPSB0aGlzLmdldFBlcmNlbnRhZ2VzMmQoKTtcbiAgICAgICAgICAgIGNvbnN0IHBvaW50c09mRmlyc3RQYXRoID0gcG9pbnRzWzBdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMuZ2V0U3ViRGF0YVNpemUoKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcCA9IHBvaW50c1tpIC0gMV07XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3UG9pbnRzID0gW107XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuZ2V0RGF0YVNpemUoKTsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1BvaW50cy5wdXNoKEZ1bm5lbEdyYXBoLnJvdW5kUG9pbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29tbWEtZGFuZ2xlXG4gICAgICAgICAgICAgICAgICAgICAgICBwW2pdICsgKGZ1bGxEaW1lbnNpb24gLSBwb2ludHNPZkZpcnN0UGF0aFtqXSAqIDIpICogKHBlcmNlbnRhZ2VzRnVsbFtqXVtpIC0gMV0gLyAxMDApXG4gICAgICAgICAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGR1cGxpY2F0ZSB0aGUgbGFzdCB2YWx1ZSBhcyBwb2ludHMgIzIgYW5kICMzIGhhdmUgdGhlIHNhbWUgdmFsdWUgb24gdGhlIGNyb3NzIGF4aXNcbiAgICAgICAgICAgICAgICBuZXdQb2ludHMucHVzaChbLi4ubmV3UG9pbnRzXS5wb3AoKSk7XG4gICAgICAgICAgICAgICAgcG9pbnRzLnB1c2gobmV3UG9pbnRzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gYWRkIHBvaW50cyBmb3IgcGF0aCBcIkRcIiwgdGhhdCBpcyBzaW1wbHkgdGhlIFwiaW52ZXJ0ZWRcIiBwYXRoIFwiQVwiXG4gICAgICAgICAgICBwb2ludHMucHVzaChwb2ludHNPZkZpcnN0UGF0aC5tYXAocG9pbnQgPT4gZnVsbERpbWVuc2lvbiAtIHBvaW50KSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBBcyB5b3UgY2FuIHNlZSBvbiB0aGUgdmlzdWFsaXphdGlvbiBhYm92ZSBwb2ludHMgIzIgYW5kICMzIGhhdmUgdGhlIHNhbWUgY3Jvc3MgYXhpcyBjb29yZGluYXRlXG4gICAgICAgICAgICAvLyBzbyB3ZSBkdXBsaWNhdGUgdGhlIGxhc3QgdmFsdWVcbiAgICAgICAgICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLnRoaXMudmFsdWVzKTtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IFsuLi50aGlzLnZhbHVlc10uY29uY2F0KFsuLi50aGlzLnZhbHVlc10ucG9wKCkpO1xuICAgICAgICAgICAgLy8gaWYgdGhlIGdyYXBoIGlzIHNpbXBsZSAobm90IHR3by1kaW1lbnNpb25hbCkgdGhlbiB3ZSBoYXZlIG9ubHkgcGF0aHMgXCJBXCIgYW5kIFwiRFwiXG4gICAgICAgICAgICAvLyB3aGljaCBhcmUgc3ltbWV0cmljLiBTbyB3ZSBnZXQgdGhlIHBvaW50cyBmb3IgXCJBXCIgYW5kIHRoZW4gZ2V0IHBvaW50cyBmb3IgXCJEXCIgYnkgc3VidHJhY3RpbmcgXCJBXCJcbiAgICAgICAgICAgIC8vIHBvaW50cyBmcm9tIGdyYXBoIGNyb3NzIGRpbWVuc2lvbiBsZW5ndGhcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKHZhbHVlcy5tYXAodmFsdWUgPT4gRnVubmVsR3JhcGgucm91bmRQb2ludCgobWF4IC0gdmFsdWUpIC8gbWF4ICogZGltZW5zaW9uKSkpO1xuICAgICAgICAgICAgcG9pbnRzLnB1c2gocG9pbnRzWzBdLm1hcChwb2ludCA9PiBmdWxsRGltZW5zaW9uIC0gcG9pbnQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwb2ludHM7XG4gICAgfVxuXG4gICAgZ2V0R3JhcGhUeXBlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZXMgJiYgdGhpcy52YWx1ZXNbMF0gaW5zdGFuY2VvZiBBcnJheSA/ICcyZCcgOiAnbm9ybWFsJztcbiAgICB9XG5cbiAgICBpczJkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRHcmFwaFR5cGUoKSA9PT0gJzJkJztcbiAgICB9XG5cbiAgICBpc1ZlcnRpY2FsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc7XG4gICAgfVxuXG4gICAgZ2V0RGF0YVNpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlcy5sZW5ndGg7XG4gICAgfVxuXG4gICAgZ2V0U3ViRGF0YVNpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlc1swXS5sZW5ndGg7XG4gICAgfVxuXG4gICAgZ2V0RnVsbERpbWVuc2lvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNWZXJ0aWNhbCgpID8gdGhpcy5nZXRXaWR0aCgpIDogdGhpcy5nZXRIZWlnaHQoKTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZUxlZ2VuZEJhY2tncm91bmQoaW5kZXgpIHtcbiAgICAgICAgY29uc3QgY29sb3IgPSB0aGlzLmNvbG9yc1tpbmRleF07XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb2xvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBgYmFja2dyb3VuZC1jb2xvcjogJHtjb2xvcn1gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbG9yLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIGBiYWNrZ3JvdW5kLWNvbG9yOiAke2NvbG9yWzBdfWA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCgke3RoaXMuZ3JhZGllbnREaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyBcbiAgICAgICAgICAgID8gJ3RvIHJpZ2h0LCAnIFxuICAgICAgICAgICAgOiAnJ30ke2NvbG9yLmpvaW4oJywgJyl9KWA7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldFN1YkxhYmVscyhvcHRpb25zKSB7XG4gICAgICAgIGlmICghb3B0aW9ucy5kYXRhKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgaXMgbWlzc2luZycpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgeyBkYXRhIH0gPSBvcHRpb25zO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZGF0YS5zdWJMYWJlbHMgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gW107XG5cbiAgICAgICAgcmV0dXJuIGRhdGEuc3ViTGFiZWxzO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRMYWJlbHMob3B0aW9ucykge1xuICAgICAgICBpZiAoIW9wdGlvbnMuZGF0YSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEYXRhIGlzIG1pc3NpbmcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gb3B0aW9ucztcblxuICAgICAgICBpZiAodHlwZW9mIGRhdGEubGFiZWxzID09PSAndW5kZWZpbmVkJykgcmV0dXJuIFtdO1xuXG4gICAgICAgIHJldHVybiBkYXRhLmxhYmVscztcbiAgICB9XG5cbiAgICBhZGRMYWJlbHMoKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcblxuICAgICAgICBjb25zdCBob2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaG9sZGVyLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc3ZnLWZ1bm5lbC1qc19fbGFiZWxzJyk7XG5cbiAgICAgICAgdGhpcy5wZXJjZW50YWdlcy5mb3JFYWNoKChwZXJjZW50YWdlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGFiZWxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBsYWJlbEVsZW1lbnQuc2V0QXR0cmlidXRlKCdjbGFzcycsIGBzdmctZnVubmVsLWpzX19sYWJlbCBsYWJlbC0ke2luZGV4ICsgMX1gKTtcblxuICAgICAgICAgICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHRpdGxlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbGFiZWxfX3RpdGxlJyk7XG4gICAgICAgICAgICB0aXRsZS50ZXh0Q29udGVudCA9IHRoaXMubGFiZWxzW2luZGV4XSB8fCAnJztcblxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHZhbHVlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbGFiZWxfX3ZhbHVlJyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHZhbHVlTnVtYmVyID0gdGhpcy5pczJkKCkgPyB0aGlzLmdldFZhbHVlczJkKClbaW5kZXhdIDogdGhpcy52YWx1ZXNbaW5kZXhdO1xuICAgICAgICAgICAgdmFsdWUudGV4dENvbnRlbnQgPSBGdW5uZWxHcmFwaC5mb3JtYXROdW1iZXIodmFsdWVOdW1iZXIpO1xuXG4gICAgICAgICAgICBjb25zdCBwZXJjZW50YWdlVmFsdWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHBlcmNlbnRhZ2VWYWx1ZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2xhYmVsX19wZXJjZW50YWdlJyk7XG5cbiAgICAgICAgICAgIGlmIChwZXJjZW50YWdlICE9PSAxMDApIHtcbiAgICAgICAgICAgICAgICBwZXJjZW50YWdlVmFsdWUudGV4dENvbnRlbnQgPSBgJHtwZXJjZW50YWdlLnRvU3RyaW5nKCl9JWA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxhYmVsRWxlbWVudC5hcHBlbmRDaGlsZCh2YWx1ZSk7XG4gICAgICAgICAgICBsYWJlbEVsZW1lbnQuYXBwZW5kQ2hpbGQodGl0bGUpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZGlzcGxheVBlcmNlbnQpIHtcbiAgICAgICAgICAgICAgICBsYWJlbEVsZW1lbnQuYXBwZW5kQ2hpbGQocGVyY2VudGFnZVZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaG9sZGVyLmFwcGVuZENoaWxkKGxhYmVsRWxlbWVudCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGhvbGRlcik7XG4gICAgfVxuXG4gICAgYWRkU3ViTGFiZWxzKCkge1xuICAgICAgICBpZiAodGhpcy5zdWJMYWJlbHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHN1YkxhYmVsc0hvbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgc3ViTGFiZWxzSG9sZGVyLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc3ZnLWZ1bm5lbC1qc19fc3ViTGFiZWxzJyk7XG5cbiAgICAgICAgICAgIGxldCBzdWJMYWJlbHNIVE1MID0gJyc7XG5cbiAgICAgICAgICAgIHRoaXMuc3ViTGFiZWxzLmZvckVhY2goKHN1YkxhYmVsLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIHN1YkxhYmVsc0hUTUwgKz0gYDxkaXYgY2xhc3M9XCJzdmctZnVubmVsLWpzX19zdWJMYWJlbCBzdmctZnVubmVsLWpzX19zdWJMYWJlbC0ke2luZGV4ICsgMX1cIj5cbiAgICA8ZGl2IGNsYXNzPVwic3ZnLWZ1bm5lbC1qc19fc3ViTGFiZWwtLWNvbG9yXCIgc3R5bGU9XCIke3RoaXMuZ2VuZXJhdGVMZWdlbmRCYWNrZ3JvdW5kKGluZGV4KX1cIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic3ZnLWZ1bm5lbC1qc19fc3ViTGFiZWwtLXRpdGxlXCI+JHtzdWJMYWJlbH08L2Rpdj5cbjwvZGl2PmA7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc3ViTGFiZWxzSG9sZGVyLmlubmVySFRNTCA9IHN1YkxhYmVsc0hUTUw7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChzdWJMYWJlbHNIb2xkZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlQ29udGFpbmVyKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCFvcHRpb25zLmNvbnRhaW5lcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb250YWluZXIgaXMgbWlzc2luZycpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKG9wdGlvbnMuY29udGFpbmVyKTtcbiAgICAgICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc3ZnLWZ1bm5lbC1qcycpO1xuXG4gICAgICAgIHRoaXMuZ3JhcGhDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5ncmFwaENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzdmctZnVubmVsLWpzX19jb250YWluZXInKTtcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5ncmFwaENvbnRhaW5lcik7XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuZGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzdmctZnVubmVsLWpzLS12ZXJ0aWNhbCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGdldFZhbHVlcyhvcHRpb25zKSB7XG4gICAgICAgIGlmICghb3B0aW9ucy5kYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB7IGRhdGEgfSA9IG9wdGlvbnM7XG5cbiAgICAgICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIoZGF0YVswXSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkYXRhLm1hcChpdGVtID0+IGl0ZW0udmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zLmRhdGEudmFsdWVzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGdldFZhbHVlczJkKCkge1xuICAgICAgICBjb25zdCB2YWx1ZXMgPSBbXTtcblxuICAgICAgICB0aGlzLnZhbHVlcy5mb3JFYWNoKCh2YWx1ZVNldCkgPT4ge1xuICAgICAgICAgICAgdmFsdWVzLnB1c2godmFsdWVTZXQucmVkdWNlKChzdW0sIHZhbHVlKSA9PiBzdW0gKyB2YWx1ZSwgMCkpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdmFsdWVzO1xuICAgIH1cblxuICAgIGdldFBlcmNlbnRhZ2VzMmQoKSB7XG4gICAgICAgIGNvbnN0IHBlcmNlbnRhZ2VzID0gW107XG5cbiAgICAgICAgdGhpcy52YWx1ZXMuZm9yRWFjaCgodmFsdWVTZXQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRvdGFsID0gdmFsdWVTZXQucmVkdWNlKChzdW0sIHZhbHVlKSA9PiBzdW0gKyB2YWx1ZSwgMCk7XG4gICAgICAgICAgICBwZXJjZW50YWdlcy5wdXNoKHZhbHVlU2V0Lm1hcCh2YWx1ZSA9PiBGdW5uZWxHcmFwaC5yb3VuZFBvaW50KHZhbHVlICogMTAwIC8gdG90YWwpKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBwZXJjZW50YWdlcztcbiAgICB9XG5cbiAgICBjcmVhdGVQZXJjZW50YWdlcygpIHtcbiAgICAgICAgbGV0IHZhbHVlcyA9IFtdO1xuXG4gICAgICAgIGlmICh0aGlzLmlzMmQoKSkge1xuICAgICAgICAgICAgdmFsdWVzID0gdGhpcy5nZXRWYWx1ZXMyZCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWVzID0gWy4uLnRoaXMudmFsdWVzXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLnZhbHVlcyk7XG4gICAgICAgIHJldHVybiB2YWx1ZXMubWFwKHZhbHVlID0+IEZ1bm5lbEdyYXBoLnJvdW5kUG9pbnQodmFsdWUgKiAxMDAgLyBtYXgpKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlU1ZHRWxlbWVudChlbGVtZW50LCBjb250YWluZXIsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgZWxlbWVudCk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBhdHRyaWJ1dGVzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgRnVubmVsR3JhcGguc2V0QXR0cnMoZWwsIGF0dHJpYnV0ZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb250YWluZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVsO1xuICAgIH1cblxuICAgIHN0YXRpYyByb3VuZFBvaW50KG51bWJlcikge1xuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChudW1iZXIgKiAxMCkgLyAxMDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZm9ybWF0TnVtYmVyKG51bWJlcikge1xuICAgICAgICByZXR1cm4gTnVtYmVyKG51bWJlcikudG9GaXhlZCgpLnJlcGxhY2UoLyhcXGQpKD89KFxcZHszfSkrKD8hXFxkKSkvZywgJyQxLCcpO1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGVDdXJ2ZXMoeDEsIHkxLCB4MiwgeTIpIHtcbiAgICAgICAgcmV0dXJuIGAgQyR7RnVubmVsR3JhcGgucm91bmRQb2ludCgoeDIgKyB4MSkgLyAyKX0sJHt5MX0gJHtGdW5uZWxHcmFwaC5yb3VuZFBvaW50KCh4MiArIHgxKSAvIDIpfSwke3kyfSAke3gyfSwke3kyfWA7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZVZlcnRpY2FsQ3VydmVzKHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgICAgIHJldHVybiBgIEMke3gxfSwke0Z1bm5lbEdyYXBoLnJvdW5kUG9pbnQoKHkyICsgeTEpIC8gMil9ICR7eDJ9LCR7RnVubmVsR3JhcGgucm91bmRQb2ludCgoeTIgKyB5MSkgLyAyKX0gJHt4Mn0sJHt5Mn1gO1xuICAgIH1cblxuICAgIHN0YXRpYyBzZXRBdHRycyhlbGVtZW50LCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYXR0cmlidXRlcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgYXR0cmlidXRlc1trZXldKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXBwbHlHcmFkaWVudChzdmcsIHBhdGgsIGNvbG9ycywgaW5kZXgpIHtcbiAgICAgICAgY29uc3QgZGVmcyA9IChzdmcucXVlcnlTZWxlY3RvcignZGVmcycpID09PSBudWxsKVxuICAgICAgICAgICAgPyBGdW5uZWxHcmFwaC5jcmVhdGVTVkdFbGVtZW50KCdkZWZzJywgc3ZnKVxuICAgICAgICAgICAgOiBzdmcucXVlcnlTZWxlY3RvcignZGVmcycpO1xuICAgICAgICBjb25zdCBncmFkaWVudE5hbWUgPSBgZnVubmVsR3JhZGllbnQtJHtpbmRleH1gO1xuICAgICAgICBjb25zdCBncmFkaWVudCA9IEZ1bm5lbEdyYXBoLmNyZWF0ZVNWR0VsZW1lbnQoJ2xpbmVhckdyYWRpZW50JywgZGVmcywge1xuICAgICAgICAgICAgaWQ6IGdyYWRpZW50TmFtZVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5ncmFkaWVudERpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgICAgICAgRnVubmVsR3JhcGguc2V0QXR0cnMoZ3JhZGllbnQsIHtcbiAgICAgICAgICAgICAgICB4MTogJzAnLFxuICAgICAgICAgICAgICAgIHgyOiAnMCcsXG4gICAgICAgICAgICAgICAgeTE6ICcwJyxcbiAgICAgICAgICAgICAgICB5MjogJzEnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG51bWJlck9mQ29sb3JzID0gY29sb3JzLmxlbmd0aDtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bWJlck9mQ29sb3JzOyBpKyspIHtcbiAgICAgICAgICAgIEZ1bm5lbEdyYXBoLmNyZWF0ZVNWR0VsZW1lbnQoJ3N0b3AnLCBncmFkaWVudCwge1xuICAgICAgICAgICAgICAgICdzdG9wLWNvbG9yJzogY29sb3JzW2ldLFxuICAgICAgICAgICAgICAgIG9mZnNldDogYCR7TWF0aC5yb3VuZCgxMDAgKiBpIC8gKG51bWJlck9mQ29sb3JzIC0gMSkpfSVgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIEZ1bm5lbEdyYXBoLnNldEF0dHJzKHBhdGgsIHtcbiAgICAgICAgICAgIGZpbGw6IGB1cmwoXCIjJHtncmFkaWVudE5hbWV9XCIpYCxcbiAgICAgICAgICAgIHN0cm9rZTogYHVybChcIiMke2dyYWRpZW50TmFtZX1cIilgXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG1ha2VTVkcoKSB7XG4gICAgICAgIGNvbnN0IHN2ZyA9IEZ1bm5lbEdyYXBoLmNyZWF0ZVNWR0VsZW1lbnQoJ3N2ZycsIHRoaXMuZ3JhcGhDb250YWluZXIsIHtcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmdldFdpZHRoKCksXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuZ2V0SGVpZ2h0KClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgdmFsdWVzTnVtID0gdGhpcy5nZXRDcm9zc0F4aXNQb2ludHMoKS5sZW5ndGggLSAxO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlc051bTsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBwYXRoID0gRnVubmVsR3JhcGguY3JlYXRlU1ZHRWxlbWVudCgncGF0aCcsIHN2Zyk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gKHRoaXMuaXMyZCgpKSA/IHRoaXMuY29sb3JzW2ldIDogdGhpcy5jb2xvcnM7XG4gICAgICAgICAgICBjb25zdCBmaWxsTW9kZSA9ICh0eXBlb2YgY29sb3IgPT09ICdzdHJpbmcnIHx8IGNvbG9yLmxlbmd0aCA9PT0gMSkgPyAnc29saWQnIDogJ2dyYWRpZW50JztcblxuICAgICAgICAgICAgaWYgKGZpbGxNb2RlID09PSAnc29saWQnKSB7XG4gICAgICAgICAgICAgICAgRnVubmVsR3JhcGguc2V0QXR0cnMocGF0aCwge1xuICAgICAgICAgICAgICAgICAgICBmaWxsOiBjb2xvcixcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlOiBjb2xvclxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmaWxsTW9kZSA9PT0gJ2dyYWRpZW50Jykge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlHcmFkaWVudChzdmcsIHBhdGgsIGNvbG9yLCBpICsgMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN2Zy5hcHBlbmRDaGlsZChwYXRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ3JhcGhDb250YWluZXIuYXBwZW5kQ2hpbGQoc3ZnKTtcbiAgICB9XG5cbiAgICBnZXRTVkcoKSB7XG4gICAgICAgIGNvbnN0IHN2ZyA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xuXG4gICAgICAgIGlmICghc3ZnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIFNWRyBmb3VuZCBpbnNpZGUgb2YgdGhlIGNvbnRhaW5lcicpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN2ZztcbiAgICB9XG5cbiAgICBnZXRXaWR0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JhcGhDb250YWluZXIuY2xpZW50V2lkdGg7XG4gICAgfVxuXG4gICAgZ2V0SGVpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ncmFwaENvbnRhaW5lci5jbGllbnRIZWlnaHQ7XG4gICAgfVxuXG4gICAgLypcbiAgICAgICAgQSBmdW5uZWwgc2VnbWVudCBpcyBkcmF3IGluIGEgY2xvY2t3aXNlIGRpcmVjdGlvbi5cbiAgICAgICAgUGF0aCAxLTIgaXMgZHJhd24sXG4gICAgICAgIHRoZW4gY29ubmVjdGVkIHdpdGggYSBzdHJhaWdodCB2ZXJ0aWNhbCBsaW5lIDItMyxcbiAgICAgICAgdGhlbiBhIGxpbmUgMy00IGlzIGRyYXcgKHVzaW5nIFlOZXh0IHBvaW50cyBnb2luZyBpbiBiYWNrd2FyZHMgZGlyZWN0aW9uKVxuICAgICAgICB0aGVuIHBhdGggaXMgY2xvc2VkIChjb25uZWN0ZWQgd2l0aCB0aGUgc3RhcnRpbmcgcG9pbnQgMSkuXG5cbiAgICAgICAgMS0tLS0tLS0tLS0+MlxuICAgICAgICBeICAgICAgICAgICB8XG4gICAgICAgIHwgICAgICAgICAgIHZcbiAgICAgICAgNDwtLS0tLS0tLS0tM1xuXG4gICAgICAgIE9uIHRoZSBncmFwaCBvbiBsaW5lIDIwIGl0IHdvcmtzIGxpa2UgdGhpczpcbiAgICAgICAgQSMwLCBBIzEsIEEjMiwgQSMzLCBCIzMsIEIjMiwgQiMxLCBCIzAsIGNsb3NlIHRoZSBwYXRoLlxuXG4gICAgICAgIFBvaW50cyBmb3IgcGF0aCBcIkJcIiBhcmUgcGFzc2VkIGFzIHRoZSBZTmV4dCBwYXJhbS5cbiAgICAgKi9cblxuICAgIGNyZWF0ZVBhdGgoaW5kZXgpIHtcbiAgICAgICAgY29uc3QgWCA9IHRoaXMuZ2V0TWFpbkF4aXNQb2ludHMoKTtcbiAgICAgICAgY29uc3QgWSA9IHRoaXMuZ2V0Q3Jvc3NBeGlzUG9pbnRzKClbaW5kZXhdO1xuICAgICAgICBjb25zdCBZTmV4dCA9IHRoaXMuZ2V0Q3Jvc3NBeGlzUG9pbnRzKClbaW5kZXggKyAxXTtcblxuICAgICAgICBsZXQgc3RyID0gYE0ke1hbMF19LCR7WVswXX1gO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgWC5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgIHN0ciArPSBGdW5uZWxHcmFwaC5jcmVhdGVDdXJ2ZXMoWFtpXSwgWVtpXSwgWFtpICsgMV0sIFlbaSArIDFdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0ciArPSBgIEwke1suLi5YXS5wb3AoKX0sJHtbLi4uWU5leHRdLnBvcCgpfWA7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IFgubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgICAgICAgc3RyICs9IEZ1bm5lbEdyYXBoLmNyZWF0ZUN1cnZlcyhYW2ldLCBZTmV4dFtpXSwgWFtpIC0gMV0sIFlOZXh0W2kgLSAxXSk7XG4gICAgICAgIH1cblxuICAgICAgICBzdHIgKz0gJyBaJztcblxuICAgICAgICByZXR1cm4gc3RyO1xuICAgIH1cblxuICAgIC8qXG4gICAgICAgIEluIGEgdmVydGljYWwgcGF0aCB3ZSBnbyBjb3VudGVyLWNsb2Nrd2lzZVxuXG4gICAgICAgIDE8LS0tLS0tLS0tLTRcbiAgICAgICAgfCAgICAgICAgICAgXlxuICAgICAgICB2ICAgICAgICAgICB8XG4gICAgICAgIDItLS0tLS0tLS0tPjNcbiAgICAgKi9cblxuICAgIGNyZWF0ZVZlcnRpY2FsUGF0aChpbmRleCkge1xuICAgICAgICBjb25zdCBYID0gdGhpcy5nZXRDcm9zc0F4aXNQb2ludHMoKVtpbmRleF07XG4gICAgICAgIGNvbnN0IFhOZXh0ID0gdGhpcy5nZXRDcm9zc0F4aXNQb2ludHMoKVtpbmRleCArIDFdO1xuICAgICAgICBjb25zdCBZID0gdGhpcy5nZXRNYWluQXhpc1BvaW50cygpO1xuXG4gICAgICAgIGxldCBzdHIgPSBgTSR7WFswXX0sJHtZWzBdfWA7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBYLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgc3RyICs9IEZ1bm5lbEdyYXBoLmNyZWF0ZVZlcnRpY2FsQ3VydmVzKFhbaV0sIFlbaV0sIFhbaSArIDFdLCBZW2kgKyAxXSk7XG4gICAgICAgIH1cblxuICAgICAgICBzdHIgKz0gYCBMJHtbLi4uWE5leHRdLnBvcCgpfSwke1suLi5ZXS5wb3AoKX1gO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSBYLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICAgIHN0ciArPSBGdW5uZWxHcmFwaC5jcmVhdGVWZXJ0aWNhbEN1cnZlcyhYTmV4dFtpXSwgWVtpXSwgWE5leHRbaSAtIDFdLCBZW2kgLSAxXSk7XG4gICAgICAgIH1cblxuICAgICAgICBzdHIgKz0gJyBaJztcblxuICAgICAgICByZXR1cm4gc3RyO1xuICAgIH1cblxuICAgIGRyYXcoKSB7XG4gICAgICAgIHRoaXMubWFrZVNWRygpO1xuICAgICAgICBjb25zdCBzdmcgPSB0aGlzLmdldFNWRygpO1xuXG4gICAgICAgIHRoaXMuYWRkTGFiZWxzKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXMyZCgpKSB7XG4gICAgICAgICAgICB0aGlzLmFkZFN1YkxhYmVscygpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGF0aHMgPSBzdmcucXVlcnlTZWxlY3RvckFsbCgncGF0aCcpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGF0aHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGQgPSB0aGlzLmlzVmVydGljYWwoKSA/IHRoaXMuY3JlYXRlVmVydGljYWxQYXRoKGkpIDogdGhpcy5jcmVhdGVQYXRoKGkpO1xuICAgICAgICAgICAgcGF0aHNbaV0uc2V0QXR0cmlidXRlKCdkJywgZCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbndpbmRvdy5GdW5uZWxHcmFwaCA9IEZ1bm5lbEdyYXBoO1xuIl19
