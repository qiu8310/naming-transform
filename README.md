# naming-transform


## Doc

```js
/**
 *
 * 将 source 中的 Object 的 keys 的命名风格全部转换成指定的 naming 命名风格
 *
 * @param  {Object} srouce                      要处理的对象
 * @param  {Number} [options.deep = 0]          处理的深度
 *
 * @param  {String|Function} [options.naming = 'camel']
 *         命名风格，支持 camel, kebab, snake，或自定义方法
 *
 *         如果指定了函数，函数得到的参数会是 (key, deep, currentObject)，函数需要返回 newKey
 *         如果函数返回 false，则忽略更新此时的 key，
 *
 * @return {Object}  转化后的对象，原对象不会被破坏
 */

```

## Usage

```js

const transform = require('naming-transform');

// default transform to camelCase
transform({foo_bar: 'x'}); // => {fooBar: 'x'}

// transform to snakeCase
transform({'foo bar': 'x'}, {naming: 'snake'}); // => {foo_bar: 'x'}

// support `deep` option, default will transform all nested object
transform({a_b: {b_c: 'x'}});  // => {aB: {bC: 'x'}}
transform({a_b: {b_c: 'x'}}, {deep: 1}); // => {aB: {b_c: 'x'}}

```


## Other useful tools

### defensive

保证当 key 不存在，而直接取时，报出错误

[creating-defensive-objects-with-es6-proxies](https://www.nczonline.net/blog/2014/04/22/creating-defensive-objects-with-es6-proxies/)


### typeSafe

保证 key 上的 value 的类型不会变

[creating-type-safe-properties-with-ecmascript-6-proxies](https://www.nczonline.net/blog/2014/04/29/creating-type-safe-properties-with-ecmascript-6-proxies/)
