// tests/unit/get.test.js

const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');
describe('GET /v1/fragments', () => {
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

  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', async () => {
    await setupFragment();
    await request(app).get('/v1/fragments').expect(401);
  });

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', async () => {
    await setupFragment();
    await request(app)
      .get('/v1/fragments')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401);
  });

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    await setupFragment();
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  test('get request return correct data we put into the database', async () => {
    await setupFragment();
    const res = await request(app).get('/v1/fragments').auth('user2@email.com', 'password2');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
    expect(res.body.fragments.length).toBe(1);
    expect(res.body.fragments[0]).toBe(fragmentTest.id);
  });
  test('get /fragments?expand=1 return expanded fragment data we put into the database', async () => {
    await setupFragment();
    const res = await request(app)
      .get('/v1/fragments?expand=1')
      .auth('user2@email.com', 'password2');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
    expect(res.body.fragments.length).toBe(1);
    expect(res.body.fragments[0]).toMatchObject(fragmentTest);
  });
});
