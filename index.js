"use strict";

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main = void 0;

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.array.join.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/es.date.now.js");

require("core-js/modules/es.date.to-string.js");

require("core-js/modules/es.array.includes.js");

require("core-js/modules/es.string.includes.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/web.dom-collections.for-each.js");

var _axios = _interopRequireDefault(require("axios"));

var _path = _interopRequireDefault(require("path"));

var _libphonenumberJs = _interopRequireDefault(require("libphonenumber-js"));

var _fs = require("fs");

var _isForced = require("core-js/internals/is-forced");

var _console = require("console");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var readFile = _fs.promises.readFile;

var CONFIG_DIR = _path["default"].join(__dirname, 'config');

var INFO = {
  api: undefined,
  phone: undefined,
  password: undefined,
  cookie: undefined
};
/**
 * @description: 获取api
 */

var getLocalApi = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dir) {
    var api, content;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return readFile("".concat(dir, "/api"), 'utf-8');

          case 3:
            content = _context.sent;
            api = content.split('\n')[0];
            _context.next = 11;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            console.log('读取本地API配置失败,使用默认的API配置');
            api = 'https://api.littlecontrol.me';

          case 11:
            return _context.abrupt("return", api);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 7]]);
  }));

  return function getLocalApi(_x) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @description: 通过手机号登陆,获取Cookie
 */


var getCookie = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(dir, info) {
    var url, _yield$getAccountInfo, password, phone, countrycode, _yield$axios, _data, _error$response;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (info.api) {
              _context2.next = 4;
              break;
            }

            _context2.next = 3;
            return getLocalApi(dir);

          case 3:
            info.api = _context2.sent;

          case 4:
            url = "".concat(info.api, "/login/cellphone");
            _context2.prev = 5;

            if (!(!info.phone && !info.password && !info.countrycode)) {
              _context2.next = 16;
              break;
            }

            _context2.next = 9;
            return getAccountInfo(dir);

          case 9:
            _yield$getAccountInfo = _context2.sent;
            password = _yield$getAccountInfo.password;
            phone = _yield$getAccountInfo.phone;
            countrycode = _yield$getAccountInfo.countrycode;
            info.password = password;
            info.phone = phone;
            info.countrycode = countrycode;

          case 16:
            _context2.next = 18;
            return (0, _axios["default"])({
              method: 'POST',
              url: url,
              data: {
                phone: info.phone,
                password: info.password,
                countrycode: info.countrycode
              }
            });

          case 18:
            _yield$axios = _context2.sent;
            _data = _yield$axios.data;
            console.log('登陆成功');
            return _context2.abrupt("return", _data === null || _data === void 0 ? void 0 : _data.cookie);

          case 24:
            _context2.prev = 24;
            _context2.t0 = _context2["catch"](5);
            console.log('获取Cookie失败');
            console.log(_context2.t0 === null || _context2.t0 === void 0 ? void 0 : (_error$response = _context2.t0.response) === null || _error$response === void 0 ? void 0 : _error$response.data);
            return _context2.abrupt("return", null);

          case 29:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[5, 24]]);
  }));

  return function getCookie(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @description: 从文件读取账户信息
 */


var getAccountInfo = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(dir) {
    var res, resArr, parsedNumber, phone, countrycode;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return readFile("".concat(dir, "/account"), 'utf-8');

          case 3:
            res = _context3.sent;
            resArr = res.split('\n');
            parsedNumber = (0, _libphonenumberJs["default"])(resArr[0], 'CN');
            phone = parsedNumber === null || parsedNumber === void 0 ? void 0 : parsedNumber.formatNational().replace(/[()\s-]/g, '');
            countrycode = parsedNumber === null || parsedNumber === void 0 ? void 0 : parsedNumber.countryCallingCode;
            return _context3.abrupt("return", {
              phone: phone,
              countrycode: countrycode,
              password: resArr[1]
            });

          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3["catch"](0);
            console.log('读取用户账户密码失败');
            return _context3.abrupt("return", {});

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 11]]);
  }));

  return function getAccountInfo(_x4) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * @description: 拦截请求,添加cookie等信息
 */


_axios["default"].interceptors.request.use( /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(config) {
    var _config$params, _config$data;

    var method, url;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            config.withCredentials = true; //防止网易对IP的限制

            config.headers['X-Real-IP'] = '123.138.78.143';
            method = config.method, url = config.url;
            (_config$params = config.params) !== null && _config$params !== void 0 ? _config$params : config.params = {};

            if ((method === null || method === void 0 ? void 0 : method.toUpperCase()) === 'POST') {
              config.params.timestamp = Date.now();
              config.params.realIP = '123.138.78.143';
            }

            (_config$data = config.data) !== null && _config$data !== void 0 ? _config$data : config.data = {};

            if (!(url !== null && url !== void 0 && url.includes('login'))) {
              _context4.next = 8;
              break;
            }

            return _context4.abrupt("return", config);

          case 8:
            if (INFO.cookie) {
              _context4.next = 12;
              break;
            }

            _context4.next = 11;
            return getCookie(CONFIG_DIR, INFO);

          case 11:
            INFO.cookie = _context4.sent;

          case 12:
            config.data.cookie = INFO.cookie;
            return _context4.abrupt("return", config);

          case 14:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x5) {
    return _ref4.apply(this, arguments);
  };
}(), /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(error) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt("return", Promise.reject(error));

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x6) {
    return _ref5.apply(this, arguments);
  };
}());
/**
 * @description: 打卡签到
 */


var checkIn = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(api) {
    var url, res, _error$response2, _error$response3;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            url = "".concat(api, "/daily_signin");
            res = [];
            _context6.prev = 2;
            _context6.next = 5;
            return (0, _axios["default"])({
              method: 'POST',
              url: url
            });

          case 5:
            console.log('Android端签到完成');
            res.push('Android端签到完成');
            _context6.next = 14;
            break;

          case 9:
            _context6.prev = 9;
            _context6.t0 = _context6["catch"](2);
            console.log("Android\u7AEF\u7B7E\u5230\u5931\u8D25");
            console.log(_context6.t0 === null || _context6.t0 === void 0 ? void 0 : (_error$response2 = _context6.t0.response) === null || _error$response2 === void 0 ? void 0 : _error$response2.data);
            res.push('Android端签到失败');

          case 14:
            _context6.prev = 14;
            _context6.next = 17;
            return (0, _axios["default"])({
              method: 'POST',
              url: url,
              params: {
                type: 1
              }
            });

          case 17:
            console.log('Web/PC端签到完成');
            res.push('Web/PC端签到完成');
            _context6.next = 26;
            break;

          case 21:
            _context6.prev = 21;
            _context6.t1 = _context6["catch"](14);
            console.log("Web/PC\u7AEF\u7B7E\u5230\u5931\u8D25");
            console.log(_context6.t1 === null || _context6.t1 === void 0 ? void 0 : (_error$response3 = _context6.t1.response) === null || _error$response3 === void 0 ? void 0 : _error$response3.data);
            res.push('Web/PC端签到失败');

          case 26:
            return _context6.abrupt("return", res);

          case 27:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[2, 9], [14, 21]]);
  }));

  return function checkIn(_x7) {
    return _ref6.apply(this, arguments);
  };
}();
/**
 * @description: 获取每日推荐歌单
 */


var getDailyPlaylist = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(api) {
    var url, _yield$axios2, _data2, _error$response4;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            url = "".concat(api, "/recommend/resource");
            _context7.prev = 1;
            _context7.next = 4;
            return (0, _axios["default"])({
              method: 'POST',
              url: url
            });

          case 4:
            _yield$axios2 = _context7.sent;
            _data2 = _yield$axios2.data;
            return _context7.abrupt("return", _data2);

          case 9:
            _context7.prev = 9;
            _context7.t0 = _context7["catch"](1);
            console.log("\u83B7\u53D6\u6BCF\u65E5\u63A8\u8350\u6B4C\u5355\u5931\u8D25");
            console.log(_context7.t0 === null || _context7.t0 === void 0 ? void 0 : (_error$response4 = _context7.t0.response) === null || _error$response4 === void 0 ? void 0 : _error$response4.data);
            return _context7.abrupt("return", {});

          case 14:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[1, 9]]);
  }));

  return function getDailyPlaylist(_x8) {
    return _ref7.apply(this, arguments);
  };
}();
/**
 * @description: 获取歌单详情
 */


var getPlaylistContent = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(id, api) {
    var url, _yield$axios3, _data3, _error$response5;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            url = "".concat(api, "/playlist/detail");
            _context8.prev = 1;
            _context8.next = 4;
            return (0, _axios["default"])({
              method: 'POST',
              url: url,
              params: {
                id: id
              }
            });

          case 4:
            _yield$axios3 = _context8.sent;
            _data3 = _yield$axios3.data;
            return _context8.abrupt("return", _data3);

          case 9:
            _context8.prev = 9;
            _context8.t0 = _context8["catch"](1);
            console.log("\u83B7\u53D6\u6B4C\u5355\u8BE6\u60C5\u5931\u8D25");
            console.log(_context8.t0 === null || _context8.t0 === void 0 ? void 0 : (_error$response5 = _context8.t0.response) === null || _error$response5 === void 0 ? void 0 : _error$response5.data);
            return _context8.abrupt("return", {});

          case 14:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[1, 9]]);
  }));

  return function getPlaylistContent(_x9, _x10) {
    return _ref8.apply(this, arguments);
  };
}();
/**
 * @description: 根据每日歌单推荐刷播放量
 */


var playDailyLists = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(api) {
    var url, _yield$getDailyPlayli, recommend, _error$response6;

    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            url = "".concat(api, "/scrobble");
            _context11.next = 3;
            return getDailyPlaylist(api);

          case 3:
            _yield$getDailyPlayli = _context11.sent;
            recommend = _yield$getDailyPlayli.recommend;

            if (recommend) {
              _context11.next = 7;
              break;
            }

            return _context11.abrupt("return", '每日推荐歌单刷取失败');

          case 7:
            _context11.prev = 7;
            recommend.forEach( /*#__PURE__*/function () {
              var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(item) {
                var _yield$getPlaylistCon, privileges;

                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                  while (1) {
                    switch (_context10.prev = _context10.next) {
                      case 0:
                        _context10.next = 2;
                        return getPlaylistContent(item.id, api);

                      case 2:
                        _yield$getPlaylistCon = _context10.sent;
                        privileges = _yield$getPlaylistCon.privileges;
                        privileges.forEach( /*#__PURE__*/function () {
                          var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(song) {
                            return regeneratorRuntime.wrap(function _callee9$(_context9) {
                              while (1) {
                                switch (_context9.prev = _context9.next) {
                                  case 0:
                                    _context9.next = 2;
                                    return (0, _axios["default"])({
                                      method: 'POST',
                                      url: url,
                                      params: {
                                        id: song.id,
                                        sourceid: item.id,
                                        time: 1000
                                      }
                                    });

                                  case 2:
                                  case "end":
                                    return _context9.stop();
                                }
                              }
                            }, _callee9);
                          }));

                          return function (_x13) {
                            return _ref11.apply(this, arguments);
                          };
                        }());

                      case 5:
                      case "end":
                        return _context10.stop();
                    }
                  }
                }, _callee10);
              }));

              return function (_x12) {
                return _ref10.apply(this, arguments);
              };
            }());
            console.log('每日推荐歌单刷取完成');
            return _context11.abrupt("return", '每日推荐歌单刷取完成');

          case 13:
            _context11.prev = 13;
            _context11.t0 = _context11["catch"](7);
            console.log("\u6BCF\u65E5\u63A8\u8350\u6B4C\u5355\u5237\u53D6\u5931\u8D25");
            console.log(_context11.t0 === null || _context11.t0 === void 0 ? void 0 : (_error$response6 = _context11.t0.response) === null || _error$response6 === void 0 ? void 0 : _error$response6.data);
            return _context11.abrupt("return", '每日推荐歌单刷取失败');

          case 18:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[7, 13]]);
  }));

  return function playDailyLists(_x11) {
    return _ref9.apply(this, arguments);
  };
}();
/**
 * @description: 获取每日推荐歌曲
 */


var getDailySongs = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(api) {
    var url, _yield$axios4, _data4, _error$response7;

    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            url = "".concat(api, "/recommend/songs");
            _context12.prev = 1;
            _context12.next = 4;
            return (0, _axios["default"])({
              method: 'POST',
              url: url
            });

          case 4:
            _yield$axios4 = _context12.sent;
            _data4 = _yield$axios4.data;
            return _context12.abrupt("return", _data4.data);

          case 9:
            _context12.prev = 9;
            _context12.t0 = _context12["catch"](1);
            console.log("\u83B7\u53D6\u6BCF\u65E5\u63A8\u8350\u6B4C\u66F2\u5931\u8D25");
            console.log(_context12.t0 === null || _context12.t0 === void 0 ? void 0 : (_error$response7 = _context12.t0.response) === null || _error$response7 === void 0 ? void 0 : _error$response7.data);
            return _context12.abrupt("return", {});

          case 14:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[1, 9]]);
  }));

  return function getDailySongs(_x14) {
    return _ref12.apply(this, arguments);
  };
}();
/**
 * @description: 听歌打卡, 根据每日推荐刷听歌量
 */


var playDailySongs = /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(api) {
    var url, _yield$getDailySongs, dailySongs, _error$response8;

    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            url = "".concat(api, "/scrobble");
            _context14.next = 3;
            return getDailySongs(api);

          case 3:
            _yield$getDailySongs = _context14.sent;
            dailySongs = _yield$getDailySongs.dailySongs;

            if (dailySongs) {
              _context14.next = 7;
              break;
            }

            return _context14.abrupt("return", '每日推荐歌曲刷取失败');

          case 7:
            _context14.prev = 7;
            dailySongs.forEach( /*#__PURE__*/function () {
              var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(song) {
                return regeneratorRuntime.wrap(function _callee13$(_context13) {
                  while (1) {
                    switch (_context13.prev = _context13.next) {
                      case 0:
                        _context13.next = 2;
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
                      case "end":
                        return _context13.stop();
                    }
                  }
                }, _callee13);
              }));

              return function (_x16) {
                return _ref14.apply(this, arguments);
              };
            }());
            console.log('每日推荐歌曲刷取完成');
            return _context14.abrupt("return", '每日推荐歌曲刷取完成');

          case 13:
            _context14.prev = 13;
            _context14.t0 = _context14["catch"](7);
            console.log("\u6BCF\u65E5\u63A8\u8350\u6B4C\u66F2\u5237\u53D6\u5931\u8D25,error: ".concat(_context14.t0 === null || _context14.t0 === void 0 ? void 0 : (_error$response8 = _context14.t0.response) === null || _error$response8 === void 0 ? void 0 : _error$response8.data));
            return _context14.abrupt("return", '每日推荐歌曲刷取失败');

          case 17:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[7, 13]]);
  }));

  return function playDailySongs(_x15) {
    return _ref13.apply(this, arguments);
  };
}();
/**
 * @description: 云贝签到
 */


var checkInYunbei = /*#__PURE__*/function () {
  var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(api) {
    var url, res, _error$response9;

    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            url = "".concat(api, "/yunbei/sign");
            _context15.prev = 1;
            _context15.next = 4;
            return (0, _axios["default"])({
              method: 'POST',
              url: url
            });

          case 4:
            res = _context15.sent;
            console.log('云贝签到完成');
            return _context15.abrupt("return", '云贝签到完成');

          case 9:
            _context15.prev = 9;
            _context15.t0 = _context15["catch"](1);
            console.log("\u4E91\u8D1D\u7B7E\u5230\u5931\u8D25");
            console.log(_context15.t0 === null || _context15.t0 === void 0 ? void 0 : (_error$response9 = _context15.t0.response) === null || _error$response9 === void 0 ? void 0 : _error$response9.data);
            return _context15.abrupt("return", '云贝签到失败');

          case 14:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, null, [[1, 9]]);
  }));

  return function checkInYunbei(_x17) {
    return _ref15.apply(this, arguments);
  };
}();

var main = /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(event, context, callback) {
    var res, API;
    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            context.callbackWaitsForEmptyEventLoop = false;
            res = [];
            _context16.prev = 2;
            _context16.next = 5;
            return getLocalApi(CONFIG_DIR);

          case 5:
            API = _context16.sent;
            _console.info.api = API;
            _context16.t0 = res;
            _context16.next = 10;
            return playDailySongs(API);

          case 10:
            _context16.t1 = _context16.sent;

            _context16.t0.push.call(_context16.t0, _context16.t1);

            _context16.t2 = res;
            _context16.next = 15;
            return playDailyLists(API);

          case 15:
            _context16.t3 = _context16.sent;

            _context16.t2.push.call(_context16.t2, _context16.t3);

            _context16.t4 = res;
            _context16.next = 20;
            return checkIn(API);

          case 20:
            _context16.t5 = _context16.sent;

            _context16.t4.push.call(_context16.t4, _context16.t5);

            _context16.t6 = res;
            _context16.next = 25;
            return checkInYunbei(API);

          case 25:
            _context16.t7 = _context16.sent;

            _context16.t6.push.call(_context16.t6, _context16.t7);

            _context16.next = 32;
            break;

          case 29:
            _context16.prev = 29;
            _context16.t8 = _context16["catch"](2);
            res.push(_context16.t8);

          case 32:
            callback(null, res);

          case 33:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, null, [[2, 29]]);
  }));

  return function main(_x18, _x19, _x20) {
    return _ref16.apply(this, arguments);
  };
}();

exports.main = main;
