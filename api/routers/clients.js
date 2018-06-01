import Router from 'koa-router';
const router = new Router({ prefix: '/clients' });
const { ClientController } = cano.app.controllers;
const { AuthPolice } = cano.app.policies;

router.post('/', AuthPolice.apikey, ClientController.create);
router.get('/', AuthPolice.apikey, ClientController.get);
router.get('/:id', AuthPolice.apikey, ClientController.getById);
router.put('/:id', AuthPolice.apikey, ClientController.updateById);
router.delete('/:id', AuthPolice.apikey,  ClientController.deleteById);

module.exports = router
