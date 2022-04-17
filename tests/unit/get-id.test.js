// tests/unit/get.test.js

const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');
describe('GET /v1/fragments/{id}', () => {
  let fragmentTest;
  const data = 'Have a nice day';
  const setupFragment = async (type = 'text/plain', testData = data) => {
    //make post request
    const resPost = await request(app)
      .post('/v1/fragments')
      .set('Content-type', type)
      .send(testData)
      .auth('user2@email.com', 'password2');
    fragmentTest = resPost.body.fragment;
  };
  afterEach(async () => {
    await Fragment.delete(fragmentTest.ownerId, fragmentTest.id);
  });

  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', async () => {
    await setupFragment();
    await request(app).get('/v1/fragments/id').expect(401);
  });

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', async () => {
    await setupFragment();
    await request(app)
      .get(`/v1/fragments/${fragmentTest.id}`)
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401);
  });

  test('get /:id request return 404 when no data for fragment', async () => {
    await setupFragment();
    const res = await request(app)
      .get(`/v1/fragments/wrongId`)
      .auth('user2@email.com', 'password2');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });

  test('get/:id request return correct data we put into the database', async () => {
    await setupFragment();
    const res = await request(app)
      .get(`/v1/fragments/${fragmentTest.id}`)
      .auth('user2@email.com', 'password2');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe(data);
  });
  test('get/:id.html request returns an markdown fragment data converted to Html.', async () => {
    await setupFragment('text/markdown');
    const res = await request(app)
      .get(`/v1/fragments/${fragmentTest.id}.html`)
      .auth('user2@email.com', 'password2');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe(`<p>${data}</p>\n`);
  });
  test('get/:id.html request returns the same fragment data for fragment text/html type', async () => {
    const testData = `<h1>${data}</h1>`;
    await setupFragment('text/html', testData);
    const res = await request(app)
      .get(`/v1/fragments/${fragmentTest.id}.html`)
      .auth('user2@email.com', 'password2');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe(testData);
  });
  test('get/:id.txt request returns the fragment data converted to text type', async () => {
    const testData = `<h1>${data}</h1>`;
    await setupFragment('text/html', testData);
    const res = await request(app)
      .get(`/v1/fragments/${fragmentTest.id}.html`)
      .auth('user2@email.com', 'password2');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe(testData);
  });
  test('get/:id.txt request returns fragment data markdown converted to text/plain type', async () => {
    const testData = `# ${data}`;
    await setupFragment('text/markdown', testData);
    const res = await request(app)
      .get(`/v1/fragments/${fragmentTest.id}.txt`)
      .auth('user2@email.com', 'password2');
    expect(res.statusCode).toBe(200);
    expect(res.header['content-type']).toBe('text/plain');
    expect(res.text).toBe(testData);
  });
  test('get/:id.jpg request for text fragment returns 415.', async () => {
    await setupFragment('text/plain');
    const res = await request(app)
      .get(`/v1/fragments/${fragmentTest.id}.jpg`)
      .auth('user2@email.com', 'password2');
    expect(res.statusCode).toBe(415);
  });
  test('get/:id.txt request returns fragment data converted to text/plain type', async () => {
    const testData = {
      id: 1,
      name: 'Mike',
    };
    await setupFragment('application/json', testData);
    const res = await request(app)
      .get(`/v1/fragments/${fragmentTest.id}.txt`)
      .auth('user2@email.com', 'password2');
    expect(res.statusCode).toBe(200);
    expect(res.header['content-type']).toBe('text/plain');
    expect(res.text).toBe('{"id":1,"name":"Mike"}');
  });
});
