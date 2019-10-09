Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.partial = (function() {
  var _ = typeof Symbol !== 'undefined'
    ? Symbol('skipped argument')
    : 'skipped argument';
  function nonPlaceholders(arg) { return arg !== _; }
  function placeholderToUndefined(arg) { return arg === _ ? undefined : arg; }
  function partial(fn, arity) {
    var args = [];
    var iterations = +arity === arity && arity >= 1 ? arity : fn.length;

    function intermediate() {
      var intermediateArgs = Array.prototype.slice.call(arguments);
      if (!intermediateArgs.length) intermediateArgs = [undefined];
      args = args.reduce(function(_args, arg, index) {
        if (arg === _ && intermediateArgs.length) _args[index] = intermediateArgs.shift();
        return _args;
      }, args).concat(intermediateArgs);
      return args.filter(nonPlaceholders).length >= iterations ? intermediate.value() : intermediate;
    }
    intermediate.value = function() {
      return fn.apply(this, args.map(placeholderToUndefined).slice(0,iterations));
    }.bind(this);
    return intermediate;
  }
  partial._ = _;
  return partial;
})();
