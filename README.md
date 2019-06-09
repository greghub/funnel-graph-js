# FunnelGraph.js 

![npm](https://img.shields.io/npm/v/funnel-graph-js.svg)
[![Build Status](https://travis-ci.org/greghub/funnel-graph-js.svg?branch=master)](https://travis-ci.org/greghub/funnel-graph-js)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/greghub/funnel-graph-js/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/greghub/funnel-graph-js/?branch=master)
![GitHub file size in bytes](https://img.shields.io/github/size/greghub/funnel-graph-js/dist/js/funnel-graph.min.js.svg)
![GitHub](https://img.shields.io/github/license/greghub/funnel-graph-js.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/greghub/funnel-graph-js.svg)
[![Gitter](https://img.shields.io/gitter/room/greghub/funnel-graph-js.svg)](https://gitter.im/funnel-graph-js/community)

Funnel Graph JS is a library for generating a funnel chart. It generates an SVG chart, adds labels, legend and other info.
Some of the features include generating horizontal and vertical funnel charts, applying solid colors and gradients,
possibility to generate a two-dimensional funnel chart. 

<img width="640" src="https://i.imgur.com/3Zw9m2l.jpg" alt="SVG Two Dimensional Funnel Graph">

FunnelGraph.js is also available as a Vue.js component: [Vue Funnel Graph](https://github.com/greghub/vue-funnel-graph-js)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [Methods](#methods)

## Installation

You can get the code by installing the NPM package, loading files from a CDN or downloading the repo. 

#### NPM

Run the following script to install:
```
npm i funnel-graph-js
```

#### CDN

```html
<link rel="stylesheet" type="text/css" href="https://unpkg.com/funnel-graph-js@1.3.9/dist/css/main.min.css">
<link rel="stylesheet" type="text/css" href="https://unpkg.com/funnel-graph-js@1.3.9/dist/css/theme.min.css">

<script src="https://unpkg.com/funnel-graph-js@1.3.9/dist/js/funnel-graph.min.js"></script>
```

#### Download

Download the repo ZIP, add `funnel-graph.js` or `funnel-graph.min.js`, and `main.css` or `main.min.css`.
Optionally add `theme.min.css` to include the styling for labels, legend etc. 
It is recommended to add the theme, to display the chart correctly.

FunnelGraph.js is built in a way that most of the styling is controlled by theme file,
so it is possible to adapt every element to your design. The chart is a SVG element and 
`colors` property of the options controls the colors of the chart.

CSS:
```html
<link rel="stylesheet" type="text/css" href="../dist/css/main.min.css">
<link rel="stylesheet" type="text/css" href="../dist/css/theme.min.css">
```

JS:
```html
<script src="../dist/js/funnel-graph.js"></script>
```

## Usage

```js
var graph = new FunnelGraph({
    container: '.funnel',
    gradientDirection: 'horizontal',
    data: {...},
    displayPercent: true,
    direction: 'horizontal'
});

graph.draw();
```

You can choose how you want to display your data on funnel graph. 
You can display exact numbers, you can display percentages or both.
The library will generate percentages automatically,
taking the largest number as 100% and then calculating 
other numbers as a fraction of the largest number.
For example: 12000, 5700 and 360 will be displayed as 47.5% and 3% 
(100% is skipped in order to avoid redundancy).

Provided values | 12000 | 5700  | 360 |
|---------------|-------|-------|-----|
Display values | 12,000 | 5,700  | 360 |
Calculated percentages |       | 47.5% | 3%  |

If you want to hide percentages you set `displayPercent` to `false`:

```js
{
    displayPercent: false
}
```

You can also display a vertical funnel graph: 
```js
{
    direction: 'vertical'
}
```

If you want to add a solid color to your funnel:
```js
{
    color: '#FF5500'
}
```

And if you want a gradient:
```js
{
    color: ['orange', 'red']
}
```
An array containing only one color will have the same effect
as passing a single color as a string.

If you are using a gradient you can control the gradient direction using:

```js
{
    gradientDirection: 'vertical' // defaults to 'horizontal'
}
```

There are 3 ways to define data for the funnel graph.

The most simple way is do define a data array:

```js
data: [12000, 5700, 360]
```

this will create the data without any titles. However you can still display the values as percentages, as number or both.

If you want to add labels to your numbers pass an array of labels to `data`.

```js
data: {
    labels: ['Impressions', 'Add To Cart', 'Buy'],
    colors: ['orange', 'red'],
    values: [12000, 5700, 360]
},
```

That most explicit way to add data to the funnel graph.


<img width="640" src="https://i.imgur.com/c2qbxGQ.jpg" alt="SVG Funnel Graph">

If using one of those two ways, you can control the graph 
color using `colors` param. Otherwise, the default color will be used. 
And if you are using gradient as color, then you can control
gradient direction with `gradientDirection` param. 
`colors` shall be passed inside `data`, while `gradientDirection` with other options.

```js
data: {
    gradientDirection: 'horizontal'
}
```

Otherwise it defaults to horizontal (left to right).

## Two-dimensional funnel graph

If you want to break down your data into more details,
you can use two-dimensional svg funnel graph. It will
generate a graph like this: 

<img width="640" src="https://i.imgur.com/3Zw9m2l.jpg" alt="SVG Two Dimensional Funnel Graph">


In this example we will add more details to the previous example.
We have Impressions, Add To Cart and Buy data, however this time
we also want to visualize the data sources. So we want to see
the traffic sources, how much of them are direct, from ads
and from social media.

```js
data: {
    labels: ['Impressions', 'Add To Cart', 'Buy'],
    subLabels: ['Direct', 'Social Media', 'Ads'],
    colors: [
        ['#FFB178', '#FF78B1', '#FF3C8E'],
        'red',
        ['blue']
    ],
    values: [
        [2000, 4000, 6000],
        [3000, 1000, 1700],
        [200, 30, 130]
    ]
}
```

In a two-dimensional graph each segment shall have it's own color or gradient.
If using a gradient the `gradientDirection` option will be applied to all of the segments.
However all supported ways of defining colors in a simple funnel graph can be used here as
well and you can have both solid colors and gradients applied to segments of a single graph.
In the above example first segment, "Direct", will have a gradient, 
"Social Media" will have a solid red color, and "Ads" segment will have a solid blue.   

## Options

| Option | Description | Type | Required | Options | Default | Example |
|--------|-------------|------|----------|---------|---------|---------|
| `container` | Selector of the element that will hold the chart | `string` | Yes | | | '.funnel-container' |
| `direction` | Whether the chart visualization is displayed vertically or horizontally | `string` | No | 'vertical', 'horizontal' | 'horizontal' | |
| `gradientDirection` | Whether the gradient applied to the segments of the graph is displayed from top to bottom or from left to right | `string` | No | 'vertical', 'horizontal' | 'horizontal' |
| `displayPercent` | Whether to display the automatically calculated percentage values below the labels | `boolean` | No | `true`, `false` | `true` | |
| `data` | Object containing information about values, labels and colors of the chart | `object` | Yes | | | |
| `width` | Width of the funnel graph | `number` | No | | Container width | 800 |
| `height` | Height of the funnel graph | `number` | No | | Container height | 300 |
| `subLabelValue` | Whether display percentage or real value of segment | `string` | No | `percent`, `raw` | `percent` | 

## Methods

| Method | Description | Example |
|--------|-------------|---------|
| `makeVertical()` | Display chart vertically | |
| `makeHorizontal()` | Display chart horizontally | |
| `toggleDirection()` | Toggle direction of chart | |
| `gradientMakeVertical()` | Display gradient on all sections from top to bottom | |
| `gradientMakeHorizontal()` | Display gradient on all sections from left to right | |
| `gradientToggleDirection()` | Toggle direction of gradient on all sections | |
| `updateHeight()` | Update funnel graph height | |
| `updateWidth()` | Update funnel graph width | |
| `updateData({data})` | Update funnel graph data | ```labels: ['Stage 1', 'Stage 2', 'Stage 3']``` |
| `update({options})` | Update funnel options | ```gradientDirection: 'horizontal', data: {...}, displayPercent: true, direction: 'horizontal', height: 300, width: 500``` |
