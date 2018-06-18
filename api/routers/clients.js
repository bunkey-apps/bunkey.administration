import Router from 'koa-router';

const router = new Router({ prefix: '/clients' });
const { ClientController } = cano.app.controllers;
const { AuthPolices: { apiKey } } = cano.app.policies;
const isApigateway = apiKey('apiGateway');

router.post('/', isApigateway, ClientController.create);
router.get('/', isApigateway, ClientController.get);
router.get('/:id', isApigateway, ClientController.getById);
router.put('/:id', isApigateway, ClientController.updateById);
router.delete('/:id', isApigateway, ClientController.deleteById);

module.exports = router;
