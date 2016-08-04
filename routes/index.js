const express = require('express');
const crypto = require('crypto');
const Slack = require('slack-node');
const config = require('../config');
const util = require('util');
const i18n_cn = require('./utils/i18n').zh_cn;

var router = express.Router();
var slack = new Slack();

slack.setWebhook(config.webhookUri);

function post_data(text, cb) {
  slack.webhook({
    channel: config.slack.channel,
    username: config.slack.username,
    text: text,
    mrkdwn: true
  }, cb);
}

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
    var __ret = i18n_cn.format(req.body.event, req.body.data);
    if (__ret !== "") {
      post_data(__ret, c_cb(res));
    } else {
      res.status(200).json({});
    }
  }
});

module.exports = router;
