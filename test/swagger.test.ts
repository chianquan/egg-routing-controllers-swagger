import assert = require('assert');
import mm from 'egg-mock';
import request = require('supertest');

describe('test/swagger.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'swagger-demo',
    });
    return app.ready();
  });

  after(() => app.close());

  it('should return json', () => {
    return request(app.callback())
      .get('/swagger/swagger.json')
      .expect((res) => {
        assert(res.body && res.body.info);
        console.log(JSON.stringify(res.body, null, 2));
      })
      .expect(200);
  });
  it('should reachable', () => {
    return request(app.callback())
      .get('/test/info/11')
      .expect({
        hello: 'world',
        id: '11',
      });
  });
  it('should throw error', () => {
    return request(app.callback())
      .post('/test/data')
      .send({aa: 11})
      .expect((res) => {
        assert(res.status === 500);
      });
  });
  it('should return origin body', () => {
    return request(app.callback())
      .post('/test/data')
      .send({aa: '111', map: {}})
      .expect({aa: '111'});
  });
});
