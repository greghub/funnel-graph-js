/* eslint-disable no-undef */
import { roundPoint, formatNumber } from '../src/js/number';

const assert = require('assert');

describe('Test number functions', () => {
    it('round number test', () => {
        assert.equal(roundPoint(19.99999999998), 20);
    });

    it('number format test', () => {
        assert.equal(formatNumber(12500), '12,500');
    });
});
