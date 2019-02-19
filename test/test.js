/* eslint-disable no-undef */
import { roundPoint, formatNumber } from '../src/js/number';
import { createCurves, createVerticalCurves } from '../src/js/path';
import { generateLegendBackground, areEqual } from '../src/js/graph';
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

describe('Add tests for equality method', () => {
    it('can compare one dimensional arrays', () => {
        assert.strictEqual(areEqual([10, 20, 30], [10, 20, 30]), true);
        assert.notStrictEqual(areEqual([10, 20, 31], [10, 20, 30]), true);
        assert.notStrictEqual(areEqual([10, 20, 30, 40], [10, 20, 30]), true);
    });
    it('can compare two dimensional arrays', () => {
        assert.strictEqual(areEqual([
            [10, 20, 30], ['a', 'b', 'c'], [1, 'b', 0]
        ], [
            [10, 20, 30], ['a', 'b', 'c'], [1, 'b', 0]
        ]), true);
        assert.notStrictEqual(areEqual([
            [10, 20, 30], ['a', 'b', 'c'], [1, 'b', 0]
        ], [
            [10, 20, 30], ['a', 'b', 'c'], [1, 'b', 'c']
        ]), true);
    });
});

describe('Add tests for paths', () => {
    const data = {
        labels: ['Impressions', 'Add To Cart', 'Buy'],
        subLabels: ['Direct', 'Social Media', 'Ads', 'Other'],
        colors: [
            ['#FFB178', '#FF78B1', '#FF3C8E'],
            ['#A0BBFF', '#EC77FF'],
            ['#A0F9FF', '#B377FF'],
            '#E478FF'
        ],
        values: [
            [2000, 4000, 6000, 500],
            [3000, 1000, 1700, 600],
            [800, 300, 130, 400]
        ]
    };

    const graph = new FunnelGraph({
        container: '.funnel',
        gradientDirection: 'horizontal',
        data,
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
            [0, 14.9, 26.1, 26.1],
            [9.6, 29.3, 29.9, 29.9],
            [28.8, 34.1, 31.3, 31.3],
            [57.6, 42.3, 31.9, 31.9],
            [60, 45.1, 33.9, 33.9]
        ]);
    });

    it('can update data', () => {
        const updatedData = {
            values: [
                [3500, 3500, 7500],
                [3300, 5400, 5000],
                [600, 600, 6730]
            ]
        };

        graph.values = FunnelGraph.getValues({ data: updatedData });

        assert.deepEqual(graph.getMainAxisPoints(), [0, 30, 60, 90]);
        assert.deepEqual(graph.getCrossAxisPoints(), [
            [0, 1.7, 13.6, 13.6],
            [14.5, 15.3, 16.1, 16.1],
            [29, 37.6, 18.6, 18.6],
            [60, 58.3, 46.4, 46.4]
        ]);
    });
});
