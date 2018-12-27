class ClientController {
  async create({ request, response }) {
    const client = await Client.create(request.body);
    const { body: { root } } = await ObjectService.createClient(client);
    await Client.updateById(client.id, { root });
    response.body = { ...client.toJSON(), root };
    response.status = 201;
  }

  async get({ request, response }) {
    const { collection, pagination } = await Client.get(request.query);
    response.set('X-Pagination-Total-Count', pagination['X-Pagination-Total-Count']);
    response.set('X-Pagination-Limit', pagination['X-Pagination-Limit']);
    response.status = 200;
    response.body = collection;
  }

  async getById({ request, params, response }) {
    const client = await Client.getById(params.id, request.query);
    response.status = 200;
    response.body = client;
  }

  async getContracts({ request, params, response }) {
    const client = await Client.getById(params.id, request.query);
    const contracts = await client.getContracts();
    response.status = 200;
    response.body = contracts;
  }

  async updateById({ params, request, response }) {
    await Client.updateById(params.id, request.body);
    await ObjectService.updateClient(params.id, request.body);
    response.status = 204;
  }

  async deleteById({ params, response }) {
    await Client.deleteById(params.id);
    response.status = 204;
  }
}

module.exports = ClientController;
