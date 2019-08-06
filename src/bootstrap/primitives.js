module.exports = () => {
  extend(Number.prototype);
};

const extend = (proto) => {
  proto.add = function(other) {
    return this + other;
  };
};
