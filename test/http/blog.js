/**
 * @file
 * @author tommyzqfeng
 * @date 2016/12/3
 */
var app = require('../../app');
var assert = require('assert');
var request = require('supertest');

describe('http.blog', function () {
  var post = {
    title: 'title',
    text: 'content',
    tags: ['tag1']
  };

  describe('GET /blogs/', function () {
    it('should just return the empty object', function (next) {
      request(app).get('/api/blogs/').expect(200, onresponse);
      function onresponse(err, res) {
        next(err);
        assert.deepEqual(res.body, {});
      }
    });
  });

  describe('POST /blogs/', function () {
    it('should post a blog', function (next) {
      request(app).post('/api/blogs')
        .send(post)
        .expect(201, function (err, res) {
          next(err);
          post.id = res.body.id;
          assert.deepEqual(post, res.body);
        })
    });
  });

  describe('PATCH /blogs/:id', function () {
    it('should update the title', function (next) {
      request(app).patch('/api/blogs/' + post.id)
        .send({title: 'new title',
          text: 'content',
          tags: ['tag1'],
          id: post.id})
        .expect(200, function (err, res) {
          next(err);
          assert.equal('new title', res.body.title);
          post.title = res.body.title;
        })
    });
  });

  describe('GET /blogs/:id', function () {
    it('should get the updated blog', function (next) {
      request(app).get('/api/blogs/' + post.id)
        .expect(200, function (err, res) {
          next(err);
          assert.deepEqual(post, res.body);
        })
    })
  });

  describe('DELETE /blogs/:id', function () {
    it('should delete the blog by id', function (next) {
      request(app).delete('/api/blogs/' + post.id)
        .expect(200, next);
    });
    it('should respond null because the id has been erased', function (next) {
      request(app).get('/api/blogs/' + post.id)
        .expect(204, next);
    })
  })
});