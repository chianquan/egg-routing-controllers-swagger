'use strict';

// import assert = require('assert');
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
        console.log(res);
      })
      .expect(200);
  });
});
