module.exports = () => async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    cano.log.error('-->', err);
    const error = CanoError.handler(err);
    ctx.response.body = error.content;
    ctx.response.status = error.status;
  }
};
