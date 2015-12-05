/* global describe, context, it */

import should from 'should';
import trans from '../src/index';


describe('index', () => {

  context('option naming', () => {
    it('should default transform to camelCase', () => {
      should.deepEqual(trans({'Are you': 'x'}), {areYou: 'x'});
    });

    it('should transform to kebabCase', () => {
      should.deepEqual(
        trans({'aa bb': 'ab', 'bbCC': 'bc', 'cc__dd': 'cd'}, {naming: 'kebab'}),
        {'aa-bb': 'ab', 'bb-cc': 'bc', 'cc-dd': 'cd'}
      );
    });

    it('should transform to snakeCase', () => {
      should.deepEqual(
        trans({encodeURLComp: 'x'}, {naming: 'snake'}),
        {'encode_url_comp': 'x'}
      );
    });

    it('should transform to capCase', () => {
      should.deepEqual(
        trans({encodeURLComp: 'x'}, {naming: 'cap'}),
        {'EncodeURLComp': 'x'}
      );
    });

    it('should support custom naming', () => {
      should.deepEqual(
        trans({a: 'b', c: 'd'}, {naming: (key) => key + key}),
        {aa: 'b', cc: 'd'}
      );
    });

    it('should transform string node', () => {
      trans('a-b-c').should.eql('aBC');
    });
  });

  context('option deep', () => {
    it('should transform all deep target', () => {
      should.deepEqual(
        trans({'a b': 'x', 'b c': {'c d': 'x'}}),
        {aB: 'x', bC: {cD: 'x'}}
      );
    });
    it('should transform specified deep', () => {
      should.deepEqual(
        trans({'a b': 'x', 'b c': {'c d': 'x'}}, {deep: 1}),
        {aB: 'x', bC: {'c d': 'x'}}
      );
    });
  });

  context('source', () => {
    it('should support array object', () => {
      should.deepEqual(
        trans([1, {'a b': 'ab'}]),
        [1, {aB: 'ab'}]
      );
    });
  });

});
