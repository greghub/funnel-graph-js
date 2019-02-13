/* eslint-disable no-undef */
import { roundPoint, formatNumber } from '../src/js/number';
import { createCurves, createVerticalCurves } from '../src/js/path';
import { generateLegendBackground } from '../src/js/graph';
import FunnelGraph from '../src/js/index';

const assert = require('assert');

describe('Test number functions', () => {
    it('round number test', () => {
        assert.equal(roundPoint(19.99999999998), 20);
    });

    it('number format test', () => {
        assert.equal(formatNumber(12500), '12,500');
    });
});

describe('Add tests for paths', () => {
    it('can create points for curves', () => {
        assert.equal(createCurves(0, 0, 6, 2), ' C3,0 3,2 6,2');
    });

    it('can create points for vertical curves', () => {
        assert.equal(createVerticalCurves(0, 0, 6, 2), ' C0,1 6,1 6,2');
    });
});

describe('Add tests for background color generator', () => {
    it('can generate a solid background', () => {
        assert.equal(generateLegendBackground('red'), 'background-color: red');
    });

    it('can generate a solid background from an array with single element', () => {
        assert.equal(generateLegendBackground(['red']), 'background-color: red');
    });

    it('can generate a gradient background', () => {
        assert.equal(
            generateLegendBackground(['red', 'orange']),
            'background-image: linear-gradient(to right, red, orange)'
        );
    });

    it('can generate a vertical gradient background', () => {
        assert.equal(
            generateLegendBackground(['red', 'orange'], 'vertical'),
            'background-image: linear-gradient(red, orange)'
        );
    });
});

describe('Add tests for paths', () => {
    let dataExample1 = {
        colors: ['#FFB178', '#FF3C8E'],
        values: [12000, 5700, 360]
    };

    let dataExample2 = {
        labels: ['Impressions', 'Add To Cart', 'Buy'],
        colors: ['#FFB178', '#FF3C8E'],
        values: [12000, 5700, 360]
    };

    let dataExample3 = {
        labels: ['Impressions', 'Add To Cart', 'Buy'],
        subLabels: ['Direct', 'Social Media', 'Ads'],
        colors: [
            ['#FFB178', '#FF78B1', '#FF3C8E'],
            ['#A0BBFF', '#EC77FF'],
            ['#A0F9FF', '#B377FF'],
        ],
        values: [
            [2000, 4000, 6000],
            [3000, 1000, 1000],
            [800, 300, 100]
        ]
    };

    var graph = new FunnelGraph({
        container: '.funnel',
        gradientDirection: 'horizontal',
        data: dataExample3,
        displayPercent: true,
        direction: 'horizontal',
        width: 90,
        height: 60
    });

    it('can create main axis points for curves', () => {
        assert.deepEqual(graph.getMainAxisPoints(), [0, 30, 60, 90]);
    });

    it('can create main axis points for curves', () => {
        assert.deepEqual(graph.getCrossAxisPoints(), [
            [0, 17.5, 27, 27],
            [10, 32.5, 31, 31],
            [30, 37.5, 32.5, 32.5],
            [60, 42.5, 33, 33]
        ]);
    });
});
