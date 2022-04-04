const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');

describe('DELETE /v1/fragments/id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).delete('/v1/fragments/id').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .delete('/v1/fragments/id')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('delete invalid fragments id should return 404', async () => {
    const res = await request(app).delete('/v1/fragments/id').auth('user2@email.com', 'password2');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });

  // delete valid fragment should give a success result
  test('authenticated users can delete valid fragment', async () => {
    const data = 'Have a nice day';
    //make post request
    const resPost = await request(app)
      .post('/v1/fragments')
      .set('Content-type', 'text/plain')
      .send(data)
      .auth('user2@email.com', 'password2');
    const fragmentTest = resPost.body.fragment;
    //make delete request
    const resDelete = await request(app)
      .delete(`/v1/fragments/${fragmentTest.id}`)
      .auth('user2@email.com', 'password2');
    expect(resDelete.statusCode).toBe(200);

    //get the deleted fragment should throw rejects
    await expect( Fragment.byId(fragmentTest.ownerId, fragmentTest.id) ).rejects.toThrow();
  });
});
