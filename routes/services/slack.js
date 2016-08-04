const Slack = require('slack-node');
const config = require('../../config');

var slack = new Slack();

slack.setWebhook(config.webhookUri);

module.exports = slack;
