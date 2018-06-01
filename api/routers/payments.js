import Router from 'koa-router';
const router = new Router({ prefix: '/payments' });
const { PaymentController } = cano.app.controllers;
const { AuthPolice } = cano.app.policies;

router.get('/', AuthPolice.apikey, PaymentController.get);

module.exports = router
