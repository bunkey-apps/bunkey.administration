
class PaymentController {

  async create({ request, params, response }) {
    const { Contract } = cano.app.models;
    const contr = await Contract.getById(params.contract);
    response.body = await contr.createPayment(request.body);
    response.status = 201;
  }

  async get({ request, response }) {
    const { Contract } = cano.app.models;
    const { collection, pagination } = await Contract.getPayments(request.query);
    response.set('X-Pagination-Total-Count', pagination['X-Pagination-Total-Count']);
    response.set('X-Pagination-Limit', pagination['X-Pagination-Limit']);
    response.status = 200;
    response.body = collection;
  }

  async updateById({ params, request, response }) {
    const { Contract } = cano.app.models;
    const contr = await Contract.getById(params.contract);
    await contr.updatePaymentById(params.id, request.body);
    response.status = 204;
  }

  async deleteById({ params, response }) {
    const { Contract } = cano.app.models;
    const contr = await Contract.getById(params.contract);
    await contr.deletePaymentById(params.id);
    response.status = 204;
  }

}

module.exports = PaymentController;
