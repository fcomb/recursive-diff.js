/*
 * recursive-diff
 *
 * Copyright (C) 2015 Anant Shukla <anant.shukla.rkgit@gmail.com>
 *
 * Licensed under The MIT License (MIT)
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var ADD = 'add';
var UPDATE = 'update';
var DELETE = 'delete';

function getType(elem) {
  if (typeof elem === 'object' && Array.isArray(elem)) {
    return 'array';
  } else {
    return typeof elem;
  }
}

function diff(object1, object2, path, result) {
  var type1 = getType(object1);
  var type2 = getType(object2);

  if (path === null || typeof path !== 'string') {
    path = '/'; // set root
  }

  if (result === null || typeof result === 'object') {
    result = {};
  }

  if (object1 === null || object2 === null) {
    if (object1 !== object2) {
      if (type1 === 'undefined') {
        result[path] = { operation: ADD, right: object2 };
      } else if (type2 === 'undefined') {
        result[path] = { operation: DELETE, left: type1 };
      } else {
        result[path] = { operation: UPDATE, left: type1, right: object2 };
      }
    }
  } else if (type1 !== type2 || type1 !== 'object' && type1 !== 'array' || type2 !== 'object' && type2 !== 'array') {
    if (object1 !== object2) {
      result[path] = { operation: UPDATE, value: object2 };
    }
  } else {
    for (var key in object1) {
      var newpath = path === '/' ? path + key : path + '/' + key;
      var value1 = object1[key];
      var value2 = object2[key];

      if (value1 === null || value2 === null) {
        if (value1 !== value2) {
          if (typeof value1 === 'undefined') {
            result[newpath] = { operation: ADD, right: value2 };
          } else if (typeof value2 === 'undefined') {
            result[newpath] = { operation: DELETE, left: value1 };
          } else {
            result[newpath] = { operation: UPDATE, left: value1, right: value2 };
          }
        }
      } else {
        if (getType(value1) !== getType(value2)) {
          result[newpath] = { operation: UPDATE, left: value1, right: value2 };
        } else {
          if (typeof value1 === 'object') {
            diff(value1, value2, newpath, result);
          } else {
            if (value1 !== value2) {
              result[newpath] = { operation: UPDATE, left: value1, right: value2 };
            }
          }
        }
      }
    }

    for (var key in object2) {
      var newpath = path === '/' ? path + key : path + '/' + key;
      var value1 = object1[key];
      var value2 = object2[key];

      if (value1 !== value2) {
        if (typeof value1 === 'object') {
          diff(value1, value2, newpath, result);
        } else if (typeof value1 === 'undefined') {
          result[newpath] = { operation: ADD, right: value2 };
        }
      }
    }
  }

  return result;
}

exports['default'] = diff;
module.exports = exports['default'];