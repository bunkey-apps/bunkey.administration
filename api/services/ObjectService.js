const baseUrl = process.env.OBJECT_SERVICE_URL;
const headers = {
  apikey: process.env.OBJECT_APIKEY,
};

class ObjectService {
  async createClient(body) {
    const request = RequestService.create(baseUrl);
    const response = await request.post('/clients', body, { headers });
    return response;
  }
}

module.exports = ObjectService;
