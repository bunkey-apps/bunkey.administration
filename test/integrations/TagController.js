import supertest from 'supertest';
import app from '../../server.js';
import tagsData from '../fixtures/Tag';

let apikey = process.env.API_GATEWAY_APIKEY;
let server = {};
let request = {};
let tag = {};

describe('Tag Controller tests', () => {
  it('Should create a new tag', async () => {
    const { body } = await request
      .post('/tags')
      .set('apikey', apikey)
      .send({ "name": "Tag 6" })
      .expect(201);
    tag = body;
  });

  it('Should get tags', async () => {
    const { body } = await request
      .get('/tags')
      .set('apikey', apikey)
      .expect(200);
  });

  it('Should update tag by id', async () => {
    await request
      .put(`/tags/${tag._id}`)
      .set('apikey', apikey)
      .send({ name: 'TAG 6' })
      .expect(204);
  });

  it('Should delete tag by id', async () => {
    await request
      .delete(`/tags/${tag._id}`)
      .set('apikey', apikey)
      .expect(204);
  });

  before(async () => {
    try {
      server = await app;
      request = supertest(server);
      const promises = tagsData.map(tag => Tag.create(tag));
      await Promise.all(promises);
    } catch (e) {
      cano.log.error(e);
    }
  });

  after(async () => {
    try {
      await Tag.remove({});
    } catch (e) {
      cano.log.error(e);
    }
  });
});
