const express = require('express');
const crypto = require('crypto');
const config = require('../config');
const util = require('util');
const Step = require('step');

const i18n_cn = require('./utils/i18n').zh_cn;

var router = express.Router();

function c_cb(e_res) {
  return function(err, res) {
    e_res.status(200).json({});
  };
}

router.post('/', function(req, res, next) {
  var keys = [config.teambition.client_secret, req.query.timestamp, req.query.nonce];
  keys.sort();
  var __hash = crypto.createHash('sha1').update(keys.join('')).digest('hex');

  if (__hash == req.query.sign) {
    i18n_cn.format(req.body.event, req.body.data, function(err, result) {
      if (err) throw err;
      res.status(200).json({});
    });

  }
});

module.exports = router;
