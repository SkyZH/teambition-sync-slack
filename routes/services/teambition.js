const request = require('request');
const util = require('util');
const qs = require('querystring');
const _ = require('lodash');
const config = require('../../config');

const api_url = "https://api.teambition.com";

var data = [], __arrIdN = 0;

function get(api_path, options) {
  var arrId = __arrIdN++;
  data[arrId] = {};
  var get_this = function(id, cb) {
    var __query_para = {};
    if (id in data[arrId]) cb (null, data[arrId][id]);
    if (options.isQuery) {
      __query_para[options.queryPara] = id;
      id = "";
    }
    request.get({
      url: util.format("%s/%s/%s", api_url, api_path, id),
      qs: _.merge(
        { access_token: config.teambition.access_token },
        __query_para
      ),
      json: true
    }, function(e, r, body) {
      if (e) {
        cb(e, null);
      } else {
        data[arrId][id] = body;
        get_this(id, cb);
      }
    });
  };
  return get_this;
}

module.exports = {
  "get_task": get("api/tasks"),
  "get_stages": get("api/stages", {
    isQuery: true,
    queryPara: "_tasklistId"
  })
};
