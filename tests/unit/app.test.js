const request = require('supertest');

const app = require('../../src/app');

describe('GET /404handler', () => {
  // If the request is for resources that can't be found return 404
  test('invalid request returns 404', async () => {
    var res = await request(app).get('/404handler');
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('error');
  });
});
