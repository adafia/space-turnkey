
const Async = {
  tryCatchWrap(handler) {
    return async (req, res, next) => {
      try {
        return await handler(req, res);
      } catch (ex) {
        return next(ex);
      }
    };
  },
};

module.exports = Async;
