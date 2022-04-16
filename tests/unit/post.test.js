// tests/unit/get.test.js

const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');
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
      .set('Content-type', 'application/x-freearc')
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
    const newFragment = await await Fragment.byId(fragmentTest.ownerId, fragmentTest.id);
    expect(newFragment.id).toBe(fragmentTest.id);
    expect(newFragment.type).toBe('text/plain');
    expect(newFragment.size).toBe(15);
  });
  test('authenticated users with content-type application/json can post a fragment', async () => {
    const data = 'Have a nice day';
    //make post request
    const resPost = await request(app)
      .post('/v1/fragments')
      .set('Content-type', 'application/json')
      .send(JSON.stringify(data))
      .auth('user2@email.com', 'password2');
    const fragmentTest = resPost.body.fragment;
    const newFragment = await Fragment.byId(fragmentTest.ownerId, fragmentTest.id);
    expect(newFragment.id).toBe(fragmentTest.id);
    expect(newFragment.type).toBe('application/json');
  });
  test('authenticated users with content-type text/html can post a fragment', async () => {
    const data = 'Have a nice day';
    //make post request
    const resPost = await request(app)
      .post('/v1/fragments')
      .set('Content-type', 'text/html')
      .send(data)
      .auth('user2@email.com', 'password2');
    const fragmentTest = resPost.body.fragment;
    const newFragment = await Fragment.byId(fragmentTest.ownerId, fragmentTest.id);
    expect(newFragment.id).toBe(fragmentTest.id);
    expect(newFragment.type).toBe('text/html');
    expect(newFragment.size).toBe(15);
  });

 
  test('authenticated users with content-type image/png can post a fragment', async () => {
    const data = 'Have a nice day';
    //make post request
    const resPost = await request(app)
      .post('/v1/fragments')
      .set('Content-type', 'text/markdown')
      .send(data)
      .auth('user2@email.com', 'password2');
    const fragmentTest = resPost.body.fragment;
    const newFragment = await Fragment.byId(fragmentTest.ownerId, fragmentTest.id);
    expect(newFragment.id).toBe(fragmentTest.id);
    expect(newFragment.type).toBe('text/markdown');
    expect(newFragment.size).toBe(15);
  });
  test('authenticated users with content-type image/webp can post a fragment', async () => {
    const data = 'Have a nice day';
    //make post request
    const resPost = await request(app)
      .post('/v1/fragments')
      .set('Content-type', 'text/markdown')
      .send(data)
      .auth('user2@email.com', 'password2');
    const fragmentTest = resPost.body.fragment;
    const newFragment = await Fragment.byId(fragmentTest.ownerId, fragmentTest.id);
    expect(newFragment.id).toBe(fragmentTest.id);
    expect(newFragment.type).toBe('text/markdown');
    expect(newFragment.size).toBe(15);
  });
  test('authenticated users with content-type image/gif can post a fragment', async () => {
    const data = 'Have a nice day';
    //make post request
    const resPost = await request(app)
      .post('/v1/fragments')
      .set('Content-type', 'text/markdown')
      .send(data)
      .auth('user2@email.com', 'password2');
    const fragmentTest = resPost.body.fragment;
    const newFragment = await Fragment.byId(fragmentTest.ownerId, fragmentTest.id);
    expect(newFragment.id).toBe(fragmentTest.id);
    expect(newFragment.type).toBe('text/markdown');
    expect(newFragment.size).toBe(15);
  });
});
