"use strict";

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main = void 0;

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.array.join.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.array.slice.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.date.now.js");

require("core-js/modules/es.date.to-string.js");

require("core-js/modules/es.array.includes.js");

require("core-js/modules/es.string.includes.js");

var _axios = _interopRequireDefault(require("axios"));

var _path = _interopRequireDefault(require("path"));

var _libphonenumberJs = _interopRequireDefault(require("libphonenumber-js"));

var _fs = require("fs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var readFile = _fs.promises.readFile;

var CONFIG_DIR = _path["default"].join(__dirname, 'config');

var INFO = {
  api: undefined,
  cookies: [],
  accounts: []
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
            api = content.replace(/[\s]/g, '');
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


var getCookies = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(dir, info) {
    var url, accounts, cookies, _error$response;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (info.api) {
              _context3.next = 4;
              break;
            }

            _context3.next = 3;
            return getLocalApi(dir);

          case 3:
            info.api = _context3.sent;

          case 4:
            url = "".concat(info.api, "/login/cellphone");
            _context3.prev = 5;
            _context3.next = 8;
            return getAccountInfo(dir);

          case 8:
            accounts = _context3.sent;
            info.accounts = accounts;
            _context3.next = 12;
            return Promise.all(accounts.map( /*#__PURE__*/function () {
              var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(current) {
                var _yield$axios, data;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return (0, _axios["default"])({
                          method: 'POST',
                          url: url,
                          data: {
                            phone: current.phone,
                            password: current.password,
                            countrycode: current.countrycode
                          }
                        });

                      case 2:
                        _yield$axios = _context2.sent;
                        data = _yield$axios.data;
                        console.log(current.phone.slice(-4) + '登陆成功');
                        return _context2.abrupt("return", data === null || data === void 0 ? void 0 : data.cookie);

                      case 6:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x4) {
                return _ref3.apply(this, arguments);
              };
            }()));

          case 12:
            cookies = _context3.sent;
            return _context3.abrupt("return", cookies);

          case 16:
            _context3.prev = 16;
            _context3.t0 = _context3["catch"](5);
            console.log('获取Cookie失败');
            console.log(_context3.t0 === null || _context3.t0 === void 0 ? void 0 : (_error$response = _context3.t0.response) === null || _error$response === void 0 ? void 0 : _error$response.data);
            return _context3.abrupt("return", []);

          case 21:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[5, 16]]);
  }));

  return function getCookies(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @description: 从文件读取账户信息
 */


var getAccountInfo = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(dir) {
    var res, fileContent, contentArr;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            res = [];
            _context4.prev = 1;
            _context4.next = 4;
            return readFile("".concat(dir, "/account"), 'utf-8');

          case 4:
            fileContent = _context4.sent;
            contentArr = fileContent.replace(/[\t\r ]/g, '').split('\n');
            contentArr.forEach(function (current, index, array) {
              if (index % 2 === 0) {
                if (current === '') return;
                var parsedNumber = (0, _libphonenumberJs["default"])(current, 'CN');
                res.push({
                  phone: parsedNumber === null || parsedNumber === void 0 ? void 0 : parsedNumber.formatNational().replace(/[()\s-]/g, ''),
                  countrycode: parsedNumber === null || parsedNumber === void 0 ? void 0 : parsedNumber.countryCallingCode,
                  password: array[index + 1]
                });
              }
            });
            return _context4.abrupt("return", res);

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](1);
            console.log('读取用户账户密码失败');
            return _context4.abrupt("return", []);

          case 14:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 10]]);
  }));

  return function getAccountInfo(_x5) {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * @description: 拦截请求,添加cookie等信息
 */


_axios["default"].interceptors.request.use( /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(config) {
    var _config$params, _config$data;

    var method, url;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
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
              _context5.next = 8;
              break;
            }

            return _context5.abrupt("return", config);

          case 8:
            config.data.cookie = INFO.cookies[0];
            return _context5.abrupt("return", config);

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x6) {
    return _ref5.apply(this, arguments);
  };
}(), /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(error) {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            return _context6.abrupt("return", Promise.reject(error));

          case 1:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x7) {
    return _ref6.apply(this, arguments);
  };
}());
/**
 * @description: 打卡签到
 */


var checkIn = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(api) {
    var url, res, _error$response2, _error$response3;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            url = "".concat(api, "/daily_signin");
            res = [];
            _context7.prev = 2;
            _context7.next = 5;
            return (0, _axios["default"])({
              method: 'POST',
              url: url
            });

          case 5:
            console.log('Android端签到完成');
            res.push('Android端签到完成');
            _context7.next = 14;
            break;

          case 9:
            _context7.prev = 9;
            _context7.t0 = _context7["catch"](2);
            console.log("Android\u7AEF\u7B7E\u5230\u5931\u8D25");
            console.log(_context7.t0 === null || _context7.t0 === void 0 ? void 0 : (_error$response2 = _context7.t0.response) === null || _error$response2 === void 0 ? void 0 : _error$response2.data);
            res.push('Android端签到失败');

          case 14:
            _context7.prev = 14;
            _context7.next = 17;
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
            _context7.next = 26;
            break;

          case 21:
            _context7.prev = 21;
            _context7.t1 = _context7["catch"](14);
            console.log("Web/PC\u7AEF\u7B7E\u5230\u5931\u8D25");
            console.log(_context7.t1 === null || _context7.t1 === void 0 ? void 0 : (_error$response3 = _context7.t1.response) === null || _error$response3 === void 0 ? void 0 : _error$response3.data);
            res.push('Web/PC端签到失败');

          case 26:
            console.log('两个平台前端都会有云贝奖励,Android端默认也会进行云贝签到');
            console.log('请登陆网易云查看云贝奖励是否正常');
            return _context7.abrupt("return", res);

          case 29:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[2, 9], [14, 21]]);
  }));

  return function checkIn(_x8) {
    return _ref7.apply(this, arguments);
  };
}();
/**
 * @description: 获取每日推荐歌单
 */


var getDailyPlaylist = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(api) {
    var url, _yield$axios2, data, _error$response4;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            url = "".concat(api, "/recommend/resource");
            _context8.prev = 1;
            _context8.next = 4;
            return (0, _axios["default"])({
              method: 'POST',
              url: url
            });

          case 4:
            _yield$axios2 = _context8.sent;
            data = _yield$axios2.data;
            return _context8.abrupt("return", data);

          case 9:
            _context8.prev = 9;
            _context8.t0 = _context8["catch"](1);
            console.log("\u83B7\u53D6\u6BCF\u65E5\u63A8\u8350\u6B4C\u5355\u5931\u8D25");
            console.log(_context8.t0 === null || _context8.t0 === void 0 ? void 0 : (_error$response4 = _context8.t0.response) === null || _error$response4 === void 0 ? void 0 : _error$response4.data);
            return _context8.abrupt("return", {});

          case 14:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[1, 9]]);
  }));

  return function getDailyPlaylist(_x9) {
    return _ref8.apply(this, arguments);
  };
}();
/**
 * @description: 获取歌单详情
 */


var getPlaylistContent = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(id, api) {
    var url, _yield$axios3, data, _error$response5;

    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            url = "".concat(api, "/playlist/detail");
            _context9.prev = 1;
            _context9.next = 4;
            return (0, _axios["default"])({
              method: 'POST',
              url: url,
              params: {
                id: id
              }
            });

          case 4:
            _yield$axios3 = _context9.sent;
            data = _yield$axios3.data;
            return _context9.abrupt("return", data);

          case 9:
            _context9.prev = 9;
            _context9.t0 = _context9["catch"](1);
            console.log("\u83B7\u53D6\u6B4C\u5355\u8BE6\u60C5\u5931\u8D25");
            console.log(_context9.t0 === null || _context9.t0 === void 0 ? void 0 : (_error$response5 = _context9.t0.response) === null || _error$response5 === void 0 ? void 0 : _error$response5.data);
            return _context9.abrupt("return", {});

          case 14:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[1, 9]]);
  }));

  return function getPlaylistContent(_x10, _x11) {
    return _ref9.apply(this, arguments);
  };
}();
/**
 * @description: 根据每日歌单推荐刷播放量
 */


var playDailyLists = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(api) {
    var url, _yield$getDailyPlayli, recommend, _error$response6;

    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            url = "".concat(api, "/scrobble");
            _context12.next = 3;
            return getDailyPlaylist(api);

          case 3:
            _yield$getDailyPlayli = _context12.sent;
            recommend = _yield$getDailyPlayli.recommend;

            if (recommend) {
              _context12.next = 7;
              break;
            }

            return _context12.abrupt("return", '每日推荐歌单刷取失败');

          case 7:
            _context12.prev = 7;
            recommend.forEach( /*#__PURE__*/function () {
              var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(item) {
                var _yield$getPlaylistCon, privileges;

                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        _context11.next = 2;
                        return getPlaylistContent(item.id, api);

                      case 2:
                        _yield$getPlaylistCon = _context11.sent;
                        privileges = _yield$getPlaylistCon.privileges;
                        privileges.forEach( /*#__PURE__*/function () {
                          var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(song) {
                            return regeneratorRuntime.wrap(function _callee10$(_context10) {
                              while (1) {
                                switch (_context10.prev = _context10.next) {
                                  case 0:
                                    _context10.next = 2;
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
                                    return _context10.stop();
                                }
                              }
                            }, _callee10);
                          }));

                          return function (_x14) {
                            return _ref12.apply(this, arguments);
                          };
                        }());

                      case 5:
                      case "end":
                        return _context11.stop();
                    }
                  }
                }, _callee11);
              }));

              return function (_x13) {
                return _ref11.apply(this, arguments);
              };
            }());
            console.log('每日推荐歌单刷取完成');
            return _context12.abrupt("return", '每日推荐歌单刷取完成');

          case 13:
            _context12.prev = 13;
            _context12.t0 = _context12["catch"](7);
            console.log("\u6BCF\u65E5\u63A8\u8350\u6B4C\u5355\u5237\u53D6\u5931\u8D25");
            console.log(_context12.t0 === null || _context12.t0 === void 0 ? void 0 : (_error$response6 = _context12.t0.response) === null || _error$response6 === void 0 ? void 0 : _error$response6.data);
            return _context12.abrupt("return", '每日推荐歌单刷取失败');

          case 18:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[7, 13]]);
  }));

  return function playDailyLists(_x12) {
    return _ref10.apply(this, arguments);
  };
}();
/**
 * @description: 获取每日推荐歌曲
 */


var getDailySongs = /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(api) {
    var url, _yield$axios4, data, _error$response7;

    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            url = "".concat(api, "/recommend/songs");
            _context13.prev = 1;
            _context13.next = 4;
            return (0, _axios["default"])({
              method: 'POST',
              url: url
            });

          case 4:
            _yield$axios4 = _context13.sent;
            data = _yield$axios4.data;
            return _context13.abrupt("return", data.data);

          case 9:
            _context13.prev = 9;
            _context13.t0 = _context13["catch"](1);
            console.log("\u83B7\u53D6\u6BCF\u65E5\u63A8\u8350\u6B4C\u66F2\u5931\u8D25");
            console.log(_context13.t0 === null || _context13.t0 === void 0 ? void 0 : (_error$response7 = _context13.t0.response) === null || _error$response7 === void 0 ? void 0 : _error$response7.data);
            return _context13.abrupt("return", {});

          case 14:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[1, 9]]);
  }));

  return function getDailySongs(_x15) {
    return _ref13.apply(this, arguments);
  };
}();
/**
 * @description: 听歌打卡, 根据每日推荐刷听歌量
 */


var playDailySongs = /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(api) {
    var url, _yield$getDailySongs, dailySongs, _error$response8;

    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            url = "".concat(api, "/scrobble");
            _context15.next = 3;
            return getDailySongs(api);

          case 3:
            _yield$getDailySongs = _context15.sent;
            dailySongs = _yield$getDailySongs.dailySongs;

            if (dailySongs) {
              _context15.next = 7;
              break;
            }

            return _context15.abrupt("return", '每日推荐歌曲刷取失败');

          case 7:
            _context15.prev = 7;
            dailySongs.forEach( /*#__PURE__*/function () {
              var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(song) {
                return regeneratorRuntime.wrap(function _callee14$(_context14) {
                  while (1) {
                    switch (_context14.prev = _context14.next) {
                      case 0:
                        _context14.next = 2;
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
                        return _context14.stop();
                    }
                  }
                }, _callee14);
              }));

              return function (_x17) {
                return _ref15.apply(this, arguments);
              };
            }());
            console.log('每日推荐歌曲刷取完成');
            return _context15.abrupt("return", '每日推荐歌曲刷取完成');

          case 13:
            _context15.prev = 13;
            _context15.t0 = _context15["catch"](7);
            console.log("\u6BCF\u65E5\u63A8\u8350\u6B4C\u66F2\u5237\u53D6\u5931\u8D25,error: ".concat(_context15.t0 === null || _context15.t0 === void 0 ? void 0 : (_error$response8 = _context15.t0.response) === null || _error$response8 === void 0 ? void 0 : _error$response8.data));
            return _context15.abrupt("return", '每日推荐歌曲刷取失败');

          case 17:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, null, [[7, 13]]);
  }));

  return function playDailySongs(_x16) {
    return _ref14.apply(this, arguments);
  };
}();

var main = /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(event, context, callback) {
    var res, _INFO$accounts$shift, phone;

    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            context.callbackWaitsForEmptyEventLoop = false;
            res = {};
            _context16.prev = 2;
            _context16.next = 5;
            return getLocalApi(CONFIG_DIR);

          case 5:
            INFO.api = _context16.sent;
            _context16.next = 8;
            return getCookies(CONFIG_DIR, INFO);

          case 8:
            INFO.cookies = _context16.sent;

          case 9:
            if (!INFO.cookies.length) {
              _context16.next = 31;
              break;
            }

            _INFO$accounts$shift = INFO.accounts.shift(), phone = _INFO$accounts$shift.phone;
            res[phone] = [];
            console.log('开始处理' + phone);
            _context16.t0 = res[phone];
            _context16.next = 16;
            return playDailySongs(INFO.api);

          case 16:
            _context16.t1 = _context16.sent;

            _context16.t0.push.call(_context16.t0, _context16.t1);

            _context16.t2 = res[phone];
            _context16.next = 21;
            return playDailyLists(INFO.api);

          case 21:
            _context16.t3 = _context16.sent;

            _context16.t2.push.call(_context16.t2, _context16.t3);

            _context16.t4 = res[phone];
            _context16.next = 26;
            return checkIn(INFO.api);

          case 26:
            _context16.t5 = _context16.sent;

            _context16.t4.push.call(_context16.t4, _context16.t5);

            INFO.cookies.shift();
            _context16.next = 9;
            break;

          case 31:
            _context16.next = 36;
            break;

          case 33:
            _context16.prev = 33;
            _context16.t6 = _context16["catch"](2);
            res[_context16.t6] = _context16.t6;

          case 36:
            callback(null, res);

          case 37:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, null, [[2, 33]]);
  }));

  return function main(_x18, _x19, _x20) {
    return _ref16.apply(this, arguments);
  };
}();

exports.main = main;
