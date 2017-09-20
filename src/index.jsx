
/** Used to match words to create compound words. */
var reWords = (function() {
  var upper = '[A-Z\\xc0-\\xd6\\xd8-\\xde]',
      lower = '[a-z\\xdf-\\xf6\\xf8-\\xff]+';

  return RegExp(upper + '+(?=' + upper + lower + ')|' + upper + '?' + lower + '|' + upper + '+|[0-9]+', 'g');
}());

function wrap(str, fn) {
  return str.match(reWords).reduce(fn, '');
}

let transformers = {
  camel(str) {
    return wrap(str, (result, word, index) => {
      let fn = index ? 'toUpperCase' : 'toLowerCase';
      return result + word.charAt(0)[fn]() + word.slice(1);
    });
  },
  capCamel: function (str) {
    return wrap(str, (result, word, index) => {
      return result + word.charAt(0).toUpperCase() + word.slice(1);
    });
  },
  upper: function (str) {
    return wrap(str, (result, word, index) => {
      return result + (index ? '_' : '') + word.toUpperCase();
    });
  },
  kebab(str) {
    return wrap(str, (result, word, index) => {
      return result + (index ? '-' : '') + word.toLowerCase();
    });
  },
  snake(str) {
    return wrap(str, (result, word, index) => {
      return result + (index ? '_' : '') + word.toLowerCase();
    });
  }
};
transformers.cap = capCamel; // 为了向后兼容

let {camel, cap, kebab, snake, capCamel, upper} = transformers;
export {camel, cap, kebab, snake, capCamel, upper};

/**
 *
 * 将 source 中的 Object 的 keys 的命名风格全部转换成指定的 naming 命名风格
 *
 * @param  {Object} source                      要处理的对象
 * @param  {Number} [options.deep = 0]          处理的深度
 *
 * @param  {String|Function} [options.naming = 'camel']
 *         命名风格，支持 camel, cap, kebab, snake，或自定义方法
 *
 *         如果指定了函数，函数得到的参数会是 (key, deep, currentObject)，函数需要返回 newKey
 *         如果函数返回 false，则忽略更新此时的 key，
 *
 * @return {Object}  转化后的对象，原对象不会被破坏
 */
export default function (source, {deep = 0, naming = 'camel', stringify = false} = {}) {
  if (stringify && typeof source === 'string') {
    return transform(source, naming, deep, null);
  }
  return walk(source, deep, naming);
}

function walk(node, deep, naming) {
  let result = node;

  if (isObject(node)) {
    result = {};
    for (let key in node) {
      if (node.hasOwnProperty(key)) {
        result[transform(key, naming, deep, node)] =
          deep === 1 ?
          node[key] :
          walk(node[key], deep > 1 ? deep - 1 : deep, naming);
      }
    }
  } else if (isArray(node)) {
    result = [];
    for (let i = 0; i < node.length; i++) {
      result.push(walk(node[i], deep, naming));
    }
  }

  return result;
}

export function transform(key, naming, deep, currentObject) {
  if (typeof naming === 'string' && naming in transformers) {
    return transformers[naming](key);
  } else if (typeof naming === 'function') {
    let newKey = naming(key, deep, currentObject);
    if (!newKey) return key;
    if (typeof newKey === 'string') return newKey;
    throw new Error('Transform naming function should return a valid string value!');
  }
  throw new Error('Not supported transform naming type, only support `string` and `function`');
}

function getType(target) {
  return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}
function isArray(target) {
  return getType(target) === 'array';
}
function isObject(target) {
  return getType(target) === 'object';
}



