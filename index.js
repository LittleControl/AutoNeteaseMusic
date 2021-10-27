"use strict";

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main = void 0;

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.array.join.js");

require("core-js/modules/es.date.now.js");

require("core-js/modules/es.date.to-string.js");

require("core-js/modules/es.array.includes.js");

require("core-js/modules/es.string.includes.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/web.dom-collections.for-each.js");

var _axios = _interopRequireDefault(require("axios"));

var _path = _interopRequireDefault(require("path"));

var _libphonenumberJs = _interopRequireDefault(require("libphonenumber-js"));

var _fs = require("fs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var readFile = _fs.promises.readFile,
    writeFile = _fs.promises.writeFile;

var CONFIG_DIR = _path["default"].join(__dirname, 'config');
/**
 * @description: 获取api
 */


var getLocalApi = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", 'https://api.littlecontrol.me');

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getLocalApi() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @description: 拦截请求,添加cookie等信息
 */


_axios["default"].interceptors.request.use( /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(config) {
    var _config$params, _config$data;

    var method, url, params, data, COOKIE;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            config.withCredentials = true;
            /**
             * @description: 防止网易对IP的限制
             */

            config.headers['X-Real-IP'] = '123.138.78.143';
            method = config.method, url = config.url, params = config.params, data = config.data;
            (_config$params = config.params) !== null && _config$params !== void 0 ? _config$params : config.params = {};

            if ((method === null || method === void 0 ? void 0 : method.toUpperCase()) === 'POST') {
              config.params.timestamp = Date.now();
              config.params.realIP = '123.138.78.143';
            }

            if (!(url !== null && url !== void 0 && url.includes('/login'))) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt("return", config);

          case 7:
            _context2.next = 9;
            return getCookie();

          case 9:
            COOKIE = _context2.sent;
            (_config$data = config.data) !== null && _config$data !== void 0 ? _config$data : config.data = {};
            config.data.cookie = COOKIE;
            return _context2.abrupt("return", config);

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}(), /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(error) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", Promise.reject(error));

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x2) {
    return _ref3.apply(this, arguments);
  };
}());
/**
 * @description: 从文件读取账户信息
 */


var getAccountInfo = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var res, resArr, parsedNumber, phone, countrycode;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return readFile("".concat(CONFIG_DIR, "/account"), 'utf-8');

          case 2:
            res = _context4.sent;
            resArr = res.split('\r\n');
            parsedNumber = (0, _libphonenumberJs["default"])(resArr[0], 'CN');
            phone = parsedNumber === null || parsedNumber === void 0 ? void 0 : parsedNumber.formatNational().replace(/[()\s-]/g, '');
            countrycode = parsedNumber === null || parsedNumber === void 0 ? void 0 : parsedNumber.countryCallingCode;
            return _context4.abrupt("return", {
              phone: phone,
              countrycode: countrycode,
              password: resArr[1]
            });

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function getAccountInfo() {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * @description: 通过手机号登陆,以获取Cookie
 */


var loginByPhone = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var _data$cookie;

    var res, api, url, accountInfo, _yield$axios, data;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return getLocalApi();

          case 2:
            api = _context5.sent;
            url = "".concat(api, "/login/cellphone");
            _context5.next = 6;
            return getAccountInfo();

          case 6:
            accountInfo = _context5.sent;
            _context5.next = 9;
            return (0, _axios["default"])({
              method: 'POST',
              url: url,
              data: accountInfo
            });

          case 9:
            _yield$axios = _context5.sent;
            data = _yield$axios.data;
            res = (_data$cookie = data === null || data === void 0 ? void 0 : data.cookie) !== null && _data$cookie !== void 0 ? _data$cookie : '';
            return _context5.abrupt("return", res);

          case 13:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function loginByPhone() {
    return _ref5.apply(this, arguments);
  };
}();
/**
 * @description: 获取Cookie
 */


var getCookie = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var localCookie, _yield$getLoginStatus, data, COOKIE;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return readFile("".concat(CONFIG_DIR, "/cookie"), 'utf8');

          case 2:
            localCookie = _context6.sent;
            _context6.next = 5;
            return getLoginStatus(localCookie);

          case 5:
            _yield$getLoginStatus = _context6.sent;
            data = _yield$getLoginStatus.data;

            if (!(data.account && data.profile)) {
              _context6.next = 11;
              break;
            }

            return _context6.abrupt("return", localCookie);

          case 11:
            _context6.next = 13;
            return loginByPhone();

          case 13:
            COOKIE = _context6.sent;
            _context6.next = 16;
            return writeFile("".concat(CONFIG_DIR, "/cookie"), COOKIE);

          case 16:
            return _context6.abrupt("return", COOKIE);

          case 17:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function getCookie() {
    return _ref6.apply(this, arguments);
  };
}();
/**
 * @description: 获取用户登陆状态
 */


var getLoginStatus = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(cookie) {
    var api, url, res;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return getLocalApi();

          case 2:
            api = _context7.sent;
            url = "".concat(api, "/login/status");
            _context7.next = 6;
            return (0, _axios["default"])({
              method: 'POST',
              url: url,
              data: {
                cookie: cookie
              }
            });

          case 6:
            res = _context7.sent;
            return _context7.abrupt("return", res.data);

          case 8:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function getLoginStatus(_x3) {
    return _ref7.apply(this, arguments);
  };
}();
/**
 * @description: 获取用户等级相关信息
 */


var getUserLevelInfo = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(api) {
    var url, _yield$axios2, data;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            url = "".concat(api, "/user/level");
            _context8.next = 3;
            return (0, _axios["default"])({
              method: 'POST',
              url: url
            });

          case 3:
            _yield$axios2 = _context8.sent;
            data = _yield$axios2.data;
            return _context8.abrupt("return", data);

          case 6:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function getUserLevelInfo(_x4) {
    return _ref8.apply(this, arguments);
  };
}();
/**
 * @description: 打卡签到
 */


var checkIn = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(api) {
    var _res$data;

    var url, res;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            console.log('checkin in');
            url = "".concat(api, "/daily_signin");
            _context9.next = 4;
            return (0, _axios["default"])({
              method: 'POST',
              url: url
            });

          case 4:
            res = _context9.sent;
            console.log('Web/PC checkin fininshed');
            _context9.next = 8;
            return (0, _axios["default"])({
              method: 'POST',
              url: url,
              params: {
                type: 1
              }
            });

          case 8:
            res = _context9.sent;
            console.log('Android check finished');
            return _context9.abrupt("return", (_res$data = res.data) !== null && _res$data !== void 0 ? _res$data : res);

          case 11:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function checkIn(_x5) {
    return _ref9.apply(this, arguments);
  };
}();
/**
 * @description: 获取每日推荐歌单
 */


var getDailyPlaylist = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(api) {
    var url, _yield$axios3, data;

    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            url = "".concat(api, "/recommend/resource");
            _context10.next = 3;
            return (0, _axios["default"])({
              method: 'POST',
              url: url
            });

          case 3:
            _yield$axios3 = _context10.sent;
            data = _yield$axios3.data;
            return _context10.abrupt("return", data);

          case 6:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function getDailyPlaylist(_x6) {
    return _ref10.apply(this, arguments);
  };
}();
/**
 * @description: 获取歌单详情
 */


var getPlaylistContent = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(id, api) {
    var url, _yield$axios4, data;

    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            url = "".concat(api, "/playlist/detail");
            _context11.next = 3;
            return (0, _axios["default"])({
              method: 'POST',
              url: url,
              params: {
                id: id
              }
            });

          case 3:
            _yield$axios4 = _context11.sent;
            data = _yield$axios4.data;
            return _context11.abrupt("return", data);

          case 6:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function getPlaylistContent(_x7, _x8) {
    return _ref11.apply(this, arguments);
  };
}();
/**
 * @description: 根据每日歌单推荐刷播放量
 */


var playDailyLists = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(api) {
    var url, _yield$getDailyPlayli, recommend, res;

    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            url = "".concat(api, "/scrobble");
            _context14.next = 3;
            return getDailyPlaylist(api);

          case 3:
            _yield$getDailyPlayli = _context14.sent;
            recommend = _yield$getDailyPlayli.recommend;
            recommend.forEach( /*#__PURE__*/function () {
              var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(item) {
                var _yield$getPlaylistCon, privileges;

                return regeneratorRuntime.wrap(function _callee13$(_context13) {
                  while (1) {
                    switch (_context13.prev = _context13.next) {
                      case 0:
                        _context13.next = 2;
                        return getPlaylistContent(item.id, api);

                      case 2:
                        _yield$getPlaylistCon = _context13.sent;
                        privileges = _yield$getPlaylistCon.privileges;
                        privileges.forEach( /*#__PURE__*/function () {
                          var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(song) {
                            return regeneratorRuntime.wrap(function _callee12$(_context12) {
                              while (1) {
                                switch (_context12.prev = _context12.next) {
                                  case 0:
                                    _context12.next = 2;
                                    return (0, _axios["default"])({
                                      method: 'POST',
                                      url: url,
                                      params: {
                                        id: song.id,
                                        sourceid: item.id,
                                        time: 500
                                      }
                                    });

                                  case 2:
                                    res = _context12.sent;

                                  case 3:
                                  case "end":
                                    return _context12.stop();
                                }
                              }
                            }, _callee12);
                          }));

                          return function (_x11) {
                            return _ref14.apply(this, arguments);
                          };
                        }());

                      case 5:
                      case "end":
                        return _context13.stop();
                    }
                  }
                }, _callee13);
              }));

              return function (_x10) {
                return _ref13.apply(this, arguments);
              };
            }());
            return _context14.abrupt("return", res);

          case 7:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));

  return function playDailyLists(_x9) {
    return _ref12.apply(this, arguments);
  };
}();
/**
 * @description: 获取每日推荐歌曲
 */


var getDailySongs = /*#__PURE__*/function () {
  var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(api) {
    var url, _yield$axios5, data;

    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            url = "".concat(api, "/recommend/songs");
            _context15.next = 3;
            return (0, _axios["default"])({
              method: 'POST',
              url: url
            });

          case 3:
            _yield$axios5 = _context15.sent;
            data = _yield$axios5.data;
            return _context15.abrupt("return", data.data);

          case 6:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));

  return function getDailySongs(_x12) {
    return _ref15.apply(this, arguments);
  };
}();
/**
 * @description: 听歌打卡, 根据每日推荐刷听歌量
 */


var playDailySongs = /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(api) {
    var url, _yield$getDailySongs, dailySongs, res;

    return regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            url = "".concat(api, "/scrobble");
            _context17.next = 3;
            return getDailySongs(api);

          case 3:
            _yield$getDailySongs = _context17.sent;
            dailySongs = _yield$getDailySongs.dailySongs;
            dailySongs.forEach( /*#__PURE__*/function () {
              var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(song) {
                return regeneratorRuntime.wrap(function _callee16$(_context16) {
                  while (1) {
                    switch (_context16.prev = _context16.next) {
                      case 0:
                        _context16.next = 2;
                        return (0, _axios["default"])({
                          method: 'POST',
                          url: url,
                          params: {
                            id: song.id,
                            sourceid: song.al.id,
                            time: 500
                          }
                        });

                      case 2:
                        res = _context16.sent;

                      case 3:
                      case "end":
                        return _context16.stop();
                    }
                  }
                }, _callee16);
              }));

              return function (_x14) {
                return _ref17.apply(this, arguments);
              };
            }());
            return _context17.abrupt("return", res);

          case 7:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17);
  }));

  return function playDailySongs(_x13) {
    return _ref16.apply(this, arguments);
  };
}();
/**
 * @description: 云贝签到
 */


var checkInYunbei = /*#__PURE__*/function () {
  var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(api) {
    var url, res;
    return regeneratorRuntime.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            url = "".concat(api, "/yunbei/sign");
            _context18.next = 3;
            return (0, _axios["default"])({
              method: 'POST',
              url: url
            });

          case 3:
            res = _context18.sent;
            return _context18.abrupt("return", res);

          case 5:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18);
  }));

  return function checkInYunbei(_x15) {
    return _ref18.apply(this, arguments);
  };
}();

var dailyTask = /*#__PURE__*/function () {
  var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19() {
    var res, api, _error$response;

    return regeneratorRuntime.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            res = [];
            _context19.prev = 1;
            _context19.next = 4;
            return getLocalApi();

          case 4:
            api = _context19.sent;
            _context19.t0 = res;
            _context19.next = 8;
            return playDailySongs(api);

          case 8:
            _context19.t1 = _context19.sent;

            _context19.t0.push.call(_context19.t0, _context19.t1);

            _context19.t2 = res;
            _context19.next = 13;
            return playDailyLists(api);

          case 13:
            _context19.t3 = _context19.sent;

            _context19.t2.push.call(_context19.t2, _context19.t3);

            _context19.t4 = res;
            _context19.next = 18;
            return checkIn(api);

          case 18:
            _context19.t5 = _context19.sent;

            _context19.t4.push.call(_context19.t4, _context19.t5);

            _context19.t6 = res;
            _context19.next = 23;
            return checkInYunbei(api);

          case 23:
            _context19.t7 = _context19.sent;

            _context19.t6.push.call(_context19.t6, _context19.t7);

            _context19.next = 30;
            break;

          case 27:
            _context19.prev = 27;
            _context19.t8 = _context19["catch"](1);
            res.push(_context19.t8 === null || _context19.t8 === void 0 ? void 0 : (_error$response = _context19.t8.response) === null || _error$response === void 0 ? void 0 : _error$response.data);

          case 30:
            return _context19.abrupt("return", res);

          case 31:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19, null, [[1, 27]]);
  }));

  return function dailyTask() {
    return _ref19.apply(this, arguments);
  };
}();

var main = /*#__PURE__*/function () {
  var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(event, context) {
    var res, api, _error$response2;

    return regeneratorRuntime.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            context.callbackWaitsForEmptyEventLoop = false; // context.callbackWaitsForEmptyEventLoop = false

            res = [];
            _context20.prev = 2;
            _context20.next = 5;
            return getLocalApi();

          case 5:
            api = _context20.sent;
            _context20.t0 = res;
            _context20.next = 9;
            return playDailySongs(api);

          case 9:
            _context20.t1 = _context20.sent;

            _context20.t0.push.call(_context20.t0, _context20.t1);

            _context20.t2 = res;
            _context20.next = 14;
            return playDailyLists(api);

          case 14:
            _context20.t3 = _context20.sent;

            _context20.t2.push.call(_context20.t2, _context20.t3);

            _context20.t4 = res;
            _context20.next = 19;
            return checkIn(api);

          case 19:
            _context20.t5 = _context20.sent;

            _context20.t4.push.call(_context20.t4, _context20.t5);

            _context20.t6 = res;
            _context20.next = 24;
            return checkInYunbei(api);

          case 24:
            _context20.t7 = _context20.sent;

            _context20.t6.push.call(_context20.t6, _context20.t7);

            _context20.next = 31;
            break;

          case 28:
            _context20.prev = 28;
            _context20.t8 = _context20["catch"](2);
            res.push(_context20.t8 === null || _context20.t8 === void 0 ? void 0 : (_error$response2 = _context20.t8.response) === null || _error$response2 === void 0 ? void 0 : _error$response2.data);

          case 31:
            return _context20.abrupt("return", res);

          case 32:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20, null, [[2, 28]]);
  }));

  return function main(_x16, _x17) {
    return _ref20.apply(this, arguments);
  };
}();

exports.main = main;
main();
