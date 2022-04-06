const request = require('supertest');
const app = require('../../src/app');

describe('PUT /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).put('/v1/fragments/id').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .put('/v1/fragments/id')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('update data on invalid fragment id should return 404', async () => {
    const data = 'Have a nice day';
    const res = await request(app)
      .put('/v1/fragments/id')
      .set('Content-type', 'text/plain')
      .send(data)
      .auth('user2@email.com', 'password2');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });
  // put invalid type fragment should give 400
  test('authenticated users cannot change fragment type', async () => {
    const data = 'Have a nice day';
    //make post request
    const resPost = await request(app)
      .post('/v1/fragments')
      .set('Content-type', 'text/plain')
      .send(data)
      .auth('user2@email.com', 'password2');
    const fragmentTest = resPost.body.fragment;
    //make put request
    const newData = 'Good night';
    const resPut = await request(app)
      .put(`/v1/fragments/${fragmentTest.id}`)
      .set('Content-type', 'application/json')
      .send(newData)
      .auth('user2@email.com', 'password2');
    expect(resPut.statusCode).toBe(400);
  });
  // put valid fragment should give a success result
  test('authenticated users can update valid fragment', async () => {
    const data = 'Have a nice day';
    //make post request
    const resPost = await request(app)
      .post('/v1/fragments')
      .set('Content-type', 'text/plain')
      .send(data)
      .auth('user2@email.com', 'password2');
    const fragmentTest = resPost.body.fragment;
    //make put request
    const newData = 'Good night';
    const resPut = await request(app)
      .put(`/v1/fragments/${fragmentTest.id}`)
      .set('Content-type', 'text/plain')
      .send(newData)
      .auth('user2@email.com', 'password2');
    expect(resPut.statusCode).toBe(201);
    //expect(resPut.body.fragment.updated).notEqual(fragmentTest.updated);
    //get the updated fragment should match newData
    let resGet = await request(app)
      .get(`/v1/fragments/${fragmentTest.id}`)
      .auth('user2@email.com', 'password2');
    expect(resGet.text).toBe(newData);
  });
});
