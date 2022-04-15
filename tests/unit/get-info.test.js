// tests/unit/get-info.test.js

const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');
describe('GET /v1/fragments/{id}/info', () => {
  let fragmentTest;
  const data = 'Have a nice day';
  const setupFragment = async (type = 'text/plain') => {
    //make post request
    const resPost = await request(app)
      .post('/v1/fragments')
      .set('Content-type', type)
      .send(data)
      .auth('user2@email.com', 'password2');
    fragmentTest = resPost.body.fragment;
  };
  afterEach(async () => {
    await Fragment.delete(fragmentTest.ownerId, fragmentTest.id);
  });
  test('get/:id/info request return correct metadata we put into the database', async () => {
    await setupFragment();
    const res = await request(app)
      .get(`/v1/fragments/${fragmentTest.id}/info`)
      .auth('user2@email.com', 'password2');
    expect(res.statusCode).toBe(200);
    expect(res.body.fragment).toMatchObject(fragmentTest);
  });
  test('get/:id/info request return 404 when passing incorrect id', async () => {
    await setupFragment();
    const res = await request(app)
      .get(`/v1/fragments/wrongId/info`)
      .auth('user2@email.com', 'password2');
    expect(res.statusCode).toBe(404);
  });
});
