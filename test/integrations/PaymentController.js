import supertest from 'supertest';
import app from '../../server.js';
import clientData from '../fixtures/Client';
import contractData from '../fixtures/Contract';

let apikey = '';
let server = {};
let request = {};
let client = {};
let contract = {};
let payment = {};

describe('Payment Controller tests', () => {

  it('Should get payments by contract id', async () => {
    await request
      .get(`/contracts/${contract.id}/payments`)
      .set('apikey', apikey)
      .expect(200);
  });

  it('Should get payments', async () => {
    await request
      .get('/payments')
      .set('apikey', apikey)
      .expect(200);
  });

  it('Should update payment by id', async () => {
    await request
      .put(`/contracts/${contract.id}/payments/${payment._id}`)
      .set('apikey', apikey)
      .send({ status: true, observation: 'Jhon and Daenerys for ever <3' })
      .expect(204);
  });

  it('Should delete payment by id', async () => {
    await request
      .delete(`/contracts/${contract.id}/payments/${payment._id}`)
      .set('apikey', apikey)
      .expect(204);
  });

  before(async () => {
    try {
      const { Client, Contract } = cano.app.models;
      server = await app;
      request = supertest(server);
      apikey = process.env.API_GATEWAY_APIKEY;
      client = await Client.create(clientData);
      Object.assign(contractData, { client: client.id });
      contract = await Contract.create(contractData);
      payment = contract.payments[0];
    } catch (e) {
      cano.log.error(e);
    }
  });

  after(async () => {
    try {
      const { Client, Contract } = cano.app.models;
      await Contract.deleteById(contract.id);
      await Client.deleteById(client.id);
    } catch (e) {
      cano.log.error(e);
    }
  });

});
