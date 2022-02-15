// tests/unit/get.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // incorrect content type should return 415
  test('incorrect content type should return 415', async () => {
    const data = 'Have a nice day';
    //make post request
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-type', 'application/json')
      .send(data)
      .auth('user2@email.com', 'password2');

    expect(res.statusCode).toBe(415);
    expect(res.body.status).toBe('error');
  });
  // Using a valid username/password pair should give a success result
  test('authenticated users with content-type text/plain can post a fragment', async () => {
    const data = 'Have a nice day';
    //make post request
    const resPost = await request(app)
      .post('/v1/fragments')
      .set('Content-type', 'text/plain')
      .send(data)
      .auth('user2@email.com', 'password2');
    const fragmentTest = resPost.body.fragment;
    const res = await request(app).get('/v1/fragments').auth('user2@email.com', 'password2');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
    expect(res.body.fragments.length).toBe(1);
    expect(res.body.fragments[0]).toBe(fragmentTest.id);
  });
});
