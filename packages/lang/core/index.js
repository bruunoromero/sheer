const _toConsumableArray = arr => {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
};

module.exports.curry = f => {
  return function currify() {
    const args = Array.prototype.slice.call(arguments);
    return args.length >= f.length
      ? f.apply(null, args)
      : currify.bind(null, ...args);
  };
};
