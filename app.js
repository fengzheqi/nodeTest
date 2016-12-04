/**
 * @file
 * @author tommyzqfeng
 * @date 2016/12/3
 */
var express = require('express');
var bodyParser = require('body-parser');

var random = require('./lib/random');

var mail = require('./lib/mail');
var cache = require('./lib/cache');

var app = express();
var prefix = '/api';
var tables ={};

app.use(bodyParser.json());
createModel('blog');

var port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port);
  console.log('start from http://localhost:' + port);
} else {
  module.exports = app;
}

function createModel(name) {
  var model = require('./models/' + name + '.js');
  var createValid = function (inputs, output) {
    return function valid(key) {
      if(!(inputs[key] instanceof model[key] || typeof inputs[key] === model[key].name.toLowerCase())) {
        return new Error('invalid type on: ' + key);
      } else if (inputs[key]) {
        output[key] = inputs[key];
      }
    }
  };
  var createRespondor = function (errs, input) {
    if (errs.length>0) {
      return function badRequest(res) {
        res.status(422).end(errs.join(', '));
      }
    } else {
      return function ok(res, code) {
        if(!input.id) {
          input.id = random.digits(10);
        }
        tables[name][input.id] = input;
        res.status(code || 200).json(input);
      }
    }
  };

  tables[name] = {};
  app.get(
    prefix + '/' + name + 's',
    function (req, res) {
      res.send(tables[name]);
    }
  );

  app.post('/api/blogs', function (req, res, next) {
    setTimeout(cache.clear, 30*60*1000);
    next();
  });
  app.post('/api/blogs', function (req, res, next) {
    mail.sendMail({
      from: req.query.from || 'someone <someone@gmail.com>',
      to: 'Blog Admin <admin@blog.com>',
      subject: 'someone is posting a blog',
      text: 'some is posting a blog'
    }, next);
  });
  app.post(
    prefix + '/' + name + 's',
    function (req, res) {
      var data = {};
      var errs = Object.keys(model)
        .map(createValid(req.body, data))
        .filter(function (item) {
          return !!item;
        });
      createRespondor(errs, data)(res, 201);
    }
  );
  app.get(
    prefix + '/' + name + 's/:id',
    function (req, res) {
      var record = tables[name][req.params.id];
      if(record) {
        res.status(200).json(record);
      } else {
        res.status(204).end();
      }
    }
  );

  app.patch(
    prefix + '/' + name + 's/:id',
    function (req, res) {
      var record = tables[name][req.params.id];
      if(record) {
        var errs = Object.keys(model)
          .filter(createValid(req.body, record));
        createRespondor(errs, record)(res, 200);
      } else {
        res.status(404).end();
      }
    }
  );

  app.delete(
    prefix + '/' + name + 's/:id',
    function (req, res) {
      delete tables[name][req.params.id];
      res.status(200).end();
    }
  )

}

