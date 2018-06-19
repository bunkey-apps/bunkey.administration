class ClientController {
  async create({ request, response }) {
    const { Client } = cano.app.models;
    const client = await Client.create(request.body);
    response.body = client;
    response.status = 201;
  }

  async get({ request, response }) {
    const { Client } = cano.app.models;
    const { collection, pagination } = await Client.get(request.query);
    response.set('X-Pagination-Total-Count', pagination['X-Pagination-Total-Count']);
    response.set('X-Pagination-Limit', pagination['X-Pagination-Limit']);
    response.status = 200;
    response.body = collection;
  }

  async getById({ request, params, response }) {
    const { Client } = cano.app.models;
    const user = await Client.getById(params.id, request.query);
    response.status = 200;
    response.body = user;
  }

  async updateById({ params, request, response }) {
    const { Client } = cano.app.models;
    await Client.updateById(params.id, request.body);
    response.status = 204;
  }

  async deleteById({ params, response }) {
    const { Client } = cano.app.models;
    await Client.deleteById(params.id);
    response.status = 204;
  }
}

module.exports = ClientController;
