import Router from 'koa-router';

const router = new Router({ prefix: '/payments' });
const { PaymentController } = cano.app.controllers;
const { AuthPolices: { apiKey } } = cano.app.policies;
const isApigateway = apiKey('apiGateway');

router.get('/', isApigateway, PaymentController.get);

module.exports = router;
