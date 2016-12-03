/**
 * @file
 * @author tommyzqfeng
 * @date 2016/12/3
 */

exports.digits = function (len) {
  if (typeof len !== 'number') {
    throw new Error('invalid arguments');
  }

  var bufs =[];
  var collection = '0123456789';

  for(var i=0; i<len; i++) {
    bufs.push(collection.charAt(Number(Math.random()*collection.length)));
  }

  return bufs.join('');
}