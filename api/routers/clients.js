import Router from 'koa-router';

const router = new Router({ prefix: '/clients' });
const { ClientController } = cano.app.controllers;
const { AuthPolices: { apiKey } } = cano.app.policies;
const isApigateway = apiKey('apiGateway');
const isApigatewayAndUser = apiKey(['apiGateway', 'user']);

router.post('/', isApigateway, ClientController.create);
router.get('/', isApigateway, ClientController.get);
router.get('/:id', isApigatewayAndUser, ClientController.getById);
router.get('/:id/contracts', isApigateway, ClientController.getContracts);
router.put('/:id', isApigateway, ClientController.updateById);
router.delete('/:id', isApigateway, ClientController.deleteById);

module.exports = router;
