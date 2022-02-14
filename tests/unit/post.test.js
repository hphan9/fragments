// tests/unit/get.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users can post a fragments array', async () => {
    const data =Buffer.from('Hello') ;
    const res = await request(app).post('/v1/fragments').set('Content-type', 'text/plain; charset=utf-8').expect(({ headers }) => {
      console.log(headers)
  }).send(data).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(201);
    expect(res.body).toBe(Object);
  
  });

  // TODO: we'll need to add tests to check the contents of the fragments array later
});
