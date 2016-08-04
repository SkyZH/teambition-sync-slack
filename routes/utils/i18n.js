const util = require('util');
const moment = require('moment');

moment.locale("zh-CN");

function get_priority(priority) {
  switch (priority) {
    case "0":
      return "普通";
    case "1":
      return "紧急";
    case "2":
      return "非常紧急";
  }
}

function get_task(event, body) {
  switch (event) {
    case "task.create":
      return util.format('添加了任务 *%s*', body.task.content);
    case "task.remove":
      return util.format('删除了 *%s*', body.task.content);
    case "task.rename":
      return util.format('把 %s 重命名为 *%s*', body.old.content, body.task.content);
    case "task.move":
      return util.format('把 *%s* 移动到了 %s', body.task.content, body.tasklist.title);
    case "task.done":
      if (body.task.isDone) {
        return util.format('完成了 *%s*', body.task.content);
      } else {
        return util.format('重做了 *%s*', body.task.content);
      }
      break;
    case "task.update.executor":
      return util.format('指派任务 *%s* 给 %s', body.task.content, body.task.executor.name);
    case "task.update.dueDate":
      return util.format('设定任务 *%s* 的截止时间为 %s (%s)', body.task.content, moment(body.task.dueDate).format('YYYY MM DD'), moment().to(body.task.dueDate));
    case "task.update.priority":
      return util.format('设定任务 *%s* 的优先级为 %s', body.task.content, get_priority(body.task.priority));
    default:
      return "";
  }
}

module.exports = {
  "zh_cn": {
    "format": function(event, body) {
      if (event.startsWith('task.')) {
        var __tmp =  get_task(event, body);
        return util.format('%s %s %s', body.user.name, __tmp, body.task.url);
      }
    }
  }
};
