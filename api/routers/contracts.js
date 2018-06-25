import Router from 'koa-router';

const router = new Router({ prefix: '/contracts' });
const { ContractController, PaymentController } = cano.app.controllers;
const { AuthPolices: { apiKey } } = cano.app.policies;
const isApigateway = apiKey('apiGateway');

router.post('/', isApigateway, ContractController.create);
router.get('/', isApigateway, ContractController.get);

router.get('/:id', isApigateway, ContractController.getById);
router.put('/:id', isApigateway, ContractController.updateById);
router.delete('/:id', isApigateway, ContractController.deleteById);

router.post('/:contract/payments', isApigateway, PaymentController.create);
router.get('/:contract/payments', isApigateway, PaymentController.getByContract);
router.put('/:contract/payments/:id', isApigateway, PaymentController.updateById);
router.delete('/:contract/payments/:id', isApigateway, PaymentController.deleteById);

module.exports = router;
