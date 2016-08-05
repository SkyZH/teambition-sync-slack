const util = require('util');
const Step = require('step');
const _ = require('lodash');

const config = require('../../config');
const slack = require('../services/slack');
const moment = require('../services/moment');
const teambition = require('../services/teambition');

function post_data(text, channel, cb) {
  slack.webhook({
    channel: channel,
    username: config.slack.username,
    text: text,
    mrkdwn: true
  }, cb);
}

function get_priority(priority) {
  switch (priority) {
    case "normal":
      return "普通";
    case "high":
      return "紧急";
    case "urgent":
      return "非常紧急";
  }
}

function get_task(event, body, cb) {
  switch (event) {
    case "task.create":
      cb(null, util.format('添加了任务 *%s*', body.task.content));
      break;
    case "task.remove":
      cb(null, util.format('删除了 *%s*', body.task.content));
      break;
    case "task.rename":
      cb(null, util.format('把 %s 重命名为 *%s*', body.old.content, body.task.content));
      break;
    case "task.move":
      cb(null, til.format('把 *%s* 移动到了 %s', body.task.content, body.stage.name));
      break;
    case "task.done":
      if (body.task.isDone) {
        cb(null, util.format('完成了 *%s*', body.task.content));
      } else {
        cb(null, util.format('重做了 *%s*', body.task.content));
      }
      break;
    case "task.update.executor":
      cb(null, util.format('指派任务 *%s* 给 %s', body.task.content, body.task.executor.name));
      break;
    case "task.update.dueDate":
      cb(null, util.format('设定任务 *%s* 的截止时间为 %s (%s)', body.task.content, moment(body.task.dueDate).format('LLLL'), moment().to(body.task.dueDate)));
      break;
    case "task.update.priority":
      cb(null, util.format('设定任务 *%s* 的优先级为 %s', body.task.content, get_priority(body.task.priority)));
      break;
    default:
      return "";
  }
}

module.exports = {
  "zh_cn": {
    "format": function(event, body, cb) {
      if (event.startsWith('task.')) {
        var __task = null;
        get_task(event, body, function(err, result) {
          Step(
            function() {
              teambition.get_task(body.task._id, this);
            },
            function(err, task) {
              if (err) throw err;
              __task = task;
              teambition.get_stages(task._tasklistId, this);
            },
            function(err, stages) {
              if (err) throw err;
              var group = this.group(), __stagename = "", __taskurl = "";
              stage = _.find(stages, function(o) { return o._id == __task._stageId; });
              if (stage) __stagename = util.format("在 %s 中 ", stage.name);
              if (body.task.url) __taskurl = util.format("<%s|查看任务>", body.task.url);
              var text = util.format('_%s_ %s%s %s', body.user.name, __stagename, result, __taskurl);
              var __channel_id = util.format("%s:%s", __task._tasklistId, __task._stageId);
              if (__channel_id in config.sync) {
                post_data(text, config.sync[__channel_id], group());
              } else {
                post_data(text, config.slack.channel, group());
              }
            },
            function(err, results) {
              cb(err, results);
            }
          );
        });
      } else {
        cb(null, "");
      }
    }
  }
};
