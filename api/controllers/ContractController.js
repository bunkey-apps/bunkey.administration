class ContractController {
  async create({ request, response }) {
    const { Contract } = cano.app.models;
    response.body = await Contract.create(request.body);
    response.status = 201;
  }

  async get({ request, response }) {
    const { Contract } = cano.app.models;
    const { collection, pagination } = await Contract.get(request.query);
    response.set('X-Pagination-Total-Count', pagination['X-Pagination-Total-Count']);
    response.set('X-Pagination-Limit', pagination['X-Pagination-Limit']);
    response.status = 200;
    response.body = collection;
  }

  async getById({ request, params, response }) {
    const { Contract } = cano.app.models;
    const user = await Contract.getById(params.id, request.query);
    response.status = 200;
    response.body = user;
  }

  async updateById({ params, request, response }) {
    const { Contract } = cano.app.models;
    await Contract.updateById(params.id, request.body);
    response.status = 204;
  }

  async deleteById({ params, response }) {
    const { Contract } = cano.app.models;
    await Contract.deleteById(params.id);
    response.status = 204;
  }
}

module.exports = ContractController;
