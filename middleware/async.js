
const Async = {
  tryCatchWrap(handler) {
    return async (req, res, next) => {
      try {
        return await handler(req, res);
      } catch (ex) {
        console.log('got here');
        return next(ex);
      }
    };
  },
};

module.exports = Async;
