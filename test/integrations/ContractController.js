import supertest from 'supertest';
import app from '../../server.js';
import clientData from '../fixtures/Client';
import contractData from '../fixtures/Contract';

let apikey = '';
let server = {};
let request = {};
let client = {};
let contract = {};

describe('Contract Controller tests', () => {

  it('Should create a new contract', async () => {
    const { body } = await request
      .post('/contracts')
      .set('apikey', apikey)
      .send(contractData)
      .expect(201);
    contract = body;
  });

  it('Should get contracts', async () => {
    const { body } = await request
      .get('/contracts')
      .set('apikey', apikey)
      .expect(200);
  });

  it('Should get contract by id', async () => {
    const { body } = await request
      .get(`/contracts/${contract._id}`)
      .set('apikey', apikey)
      .expect(200);
  });

  it('Should update contract by id', async () => {
    const { body } = await request
      .put(`/contracts/${contract._id}`)
      .set('apikey', apikey)
      .send({ dni: '12345678900' })
      .expect(204);
  });

  it('Should delete contract by id', async () => {
    const { body } = await request
      .delete(`/contracts/${contract._id}`)
      .set('apikey', apikey)
      .expect(204);
  });

  before(async () => {
    try {
      const { Client } = cano.app.models;
      server = await app;
      request = supertest(server);
      apikey = process.env.API_GATEWAY_APIKEY;
      client = await Client.create(clientData);
      Object.assign(contractData, { client: client.id });
    } catch (e) {
      cano.log.error(e);
    }
  });

  after(async () => {
    try {
      const { Client } = cano.app.models;
      await Client.deleteById(client._id);
    } catch (e) {
      cano.log.error(e);
    }
  });

});
