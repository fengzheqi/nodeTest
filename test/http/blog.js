/**
 * @file
 * @author tommyzqfeng
 * @date 2016/12/3
 */
var app = require('../../app');
var assert = require('assert');
var request = require('supertest');

var sinon = require('sinon');
var mail = require('../../lib/mail');
var cache = require('../../lib/cache');

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
      // 创建mail.sendMail的stub对象
      var send = sinon.stub(mail, 'sendMail');
      send.onFirstCall().callsArg(1);

      var clock = sinon.useFakeTimers();
      var clear = sinon.stub(cache, 'clear');

      // 原有的http测试
      request(app).post('/api/blogs')
        .send(post)
        .expect(201, function (err, res) {
          clock.tick(30*60*1000);
          assert.ok(clear.calledOnce);
          next(err);

          post.id = res.body.id;
          assert.deepEqual(post, res.body);

          // 进行参数的确认
          assert.deepEqual({
            from: 'someone <someone@gmail.com',
            to: 'Blog Admin <admin@blog.com>',
            subject: 'someone is posting a blog',
            text: 'some is posting a blog'
          }, send.args[0][0]);
          // 销毁stub
          send.restore();
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