import Router from 'koa-router';

const router = new Router({ prefix: '/tags' });
const { TagController } = cano.app.controllers;
const { AuthPolices: { apiKey } } = cano.app.policies;
const isApigateway = apiKey('apiGateway');

router.post('/', isApigateway, TagController.create);
router.get('/', isApigateway, TagController.get);
router.put('/:id', isApigateway, TagController.updateById);
router.delete('/:id', isApigateway, TagController.deleteById);

module.exports = router;
