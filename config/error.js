module.exports = () => async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const error = CanoError.handler(err);
    cano.log.error('-->', error.content);
    ctx.response.body = error.content;
    ctx.response.status = error.status;
  }
};
