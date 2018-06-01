import supertest from 'supertest';
import app from '../../server.js';
import clientData from '../fixtures/Client';
const apikey = process.env.API_GATEWAY_KEY || '1234567890';
let server = {};
let request = {};
let client = {};

describe('Client Controller tests', () => {

  it('Should create a new client', async () => {
    const { body } = await request
      .post('/clients')
      .set('apikey', apikey)
      .send(clientData)
      .expect(201);
    client = body;
  });

  it('Should get clients', async () => {
    const { body } = await request
      .get('/clients')
      .set('apikey', apikey)
      .expect(200);
  });

  it('Should get client by id', async () => {
    const { body } = await request
      .get(`/clients/${client._id}`)
      .set('apikey', apikey)
      .expect(200);
  });

  it('Should update client by id', async () => {
    const { body } = await request
      .put(`/clients/${client._id}`)
      .set('apikey', apikey)
      .send({ dni: '12345678900' })
      .expect(204);
  });

  it('Should delete client by id', async () => {
    const { body } = await request
      .delete(`/clients/${client._id}`)
      .set('apikey', apikey)
      .expect(204);
  });

  before(async () => {
    try {
      server = await app;
      request = supertest(server);
    } catch (e) {
      cano.log.error(e);
    }
  });

});
