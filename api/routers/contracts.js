import Router from 'koa-router';
const router = new Router({ prefix: '/contracts' });
const { ContractController, PaymentController } = cano.app.controllers;
const { AuthPolice } = cano.app.policies;

router.post('/', AuthPolice.apikey, ContractController.create);
router.get('/', AuthPolice.apikey, ContractController.get);

router.get('/:id', AuthPolice.apikey, ContractController.getById);
router.put('/:id', AuthPolice.apikey, ContractController.updateById);
router.delete('/:id', AuthPolice.apikey,  ContractController.deleteById);

router.post('/:contract/payments', AuthPolice.apikey, PaymentController.create);
router.put('/:contract/payments/:id', AuthPolice.apikey, PaymentController.updateById);
router.delete('/:contract/payments/:id', AuthPolice.apikey, PaymentController.deleteById);

module.exports = router
