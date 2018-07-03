class TagController {
    async create({ request, response }) {
      const tag = await Tag.create(request.body);
      response.body = tag;
      response.status = 201;
    }
  
    async get({ request, response }) {
      const { collection, pagination } = await Tag.get(request.query);
      response.set('X-Pagination-Total-Count', pagination['X-Pagination-Total-Count']);
      response.set('X-Pagination-Limit', pagination['X-Pagination-Limit']);
      response.status = 200;
      response.body = collection;
    }
  
    async updateById({ params, request, response }) {
      await Tag.updateById(params.id, request.body);
      response.status = 204;
    }
  
    async deleteById({ params, response }) {
      await Tag.deleteById(params.id);
      response.status = 204;
    }
  }
  
  module.exports = TagController;
