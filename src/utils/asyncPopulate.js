/* eslint-disable no-underscore-dangle */
module.exports = function asyncPopulate(target, source) {
  if (typeof target !== 'object') {
    return Promise.reject(new Error('Invalid target passed'));
  }
  if (typeof source !== 'object') {
    return Promise.reject(new Error('Invalid source passed'));
  }

  const promises = Object.keys(source).map(attr => {
    let promise;
    if (Array.isArray(source[attr])) {
      target[attr] = [];
      promise = asyncPopulate(target[attr], source[attr]);
    } else if (source[attr] === null) {
      target[attr] = null;
    } else if (typeof source[attr] === 'object' && !source[attr]._bsontype) {
      target[attr] = target[attr] || {};
      promise = asyncPopulate(target[attr], source[attr]);
    } else if (typeof source[attr] === 'function') {
      promise = Promise.resolve(source[attr]()).then(v => { target[attr] = v; });
    } else {
      promise = Promise.resolve(source[attr]).then(v => { target[attr] = v; });
    }
    return promise;
  });
  return Promise.all(promises);
};
/* eslint-enable no-underscore-dangle */
