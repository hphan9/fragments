// tests/unit/get.test.js

const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');
describe('GET /v1/fragments', () => {
  let fragmentTest;
  const data = 'Have a nice day';
  beforeEach(async () => {
    //make post request
    const resPost = await request(app)
      .post('/v1/fragments')
      .set('Content-type', 'text/plain')
      .send(data)
      .auth('user2@email.com', 'password2');
    fragmentTest = resPost.body.fragment;
  });
  afterEach(async () => {
    await Fragment.delete(fragmentTest.ownerId, fragmentTest.id);
  });

  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  test('get request return correct data we put into the database', async () => {
    const res = await request(app).get('/v1/fragments').auth('user2@email.com', 'password2');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
    expect(res.body.fragments.length).toBe(1);
    expect(res.body.fragments[0]).toBe(fragmentTest.id);
  });
  test('get /fragments?expand=1 return expanded fragment data we put into the database', async () => {
    const res = await request(app)
      .get('/v1/fragments?expand=1')
      .auth('user2@email.com', 'password2');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
    expect(res.body.fragments.length).toBe(1);
    expect(res.body.fragments[0]).toMatchObject(fragmentTest);
  });

  test('get /:id request return 404 when no data for fragment', async () => {
    //make post request
    const res = await request(app)
      .get(`/v1/fragments/wrongId`)
      .auth('user2@email.com', 'password2');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });

  test('get/:id request return correct data we put into the database', async () => {
    const res = await request(app)
      .get(`/v1/fragments/${fragmentTest.id}`)
      .auth('user2@email.com', 'password2');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe(data);
  });

  test('get/:id/info request return correct data we put into the database', async () => {
    const res = await request(app)
      .get(`/v1/fragments/${fragmentTest.id}/info`)
      .auth('user2@email.com', 'password2');
    expect(res.statusCode).toBe(200);
    expect(res.body.fragments).toMatchObject(fragmentTest);
  });
});
