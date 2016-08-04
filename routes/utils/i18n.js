module.exports = {
  "zh_cn": {
    "format": function(event, body) {
      switch (event) {
        case "task.create":
          return util.format('%s 创建了 *%s*', body.user.name, body.task.content);
        case "task.remove":
          return util.format('%s 删除了 *%s*', body.user.name, body.task.content);
        case "task.rename":
          return util.format('%s 把 %s 重命名为 *%s*', body.user.name, body.old.content, body.task.content);
        case "task.move":
          return util.format('%s 把 *%s* 移动到 %s', body.user.name, body.task.content, body.tasklist.title);
        case "task.done":
          return util.format('%s 完成了 *%s*', body.user.name, body.task.content);
        default:
          return "";
      }
    }
  }
};
