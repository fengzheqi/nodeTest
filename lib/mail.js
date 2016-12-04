/**
 * @file
 * @author tommyzqfeng
 * @date 2016/12/4
 */
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: '地址',
    password: '密码'
  }
});

module.exports = transporter;

