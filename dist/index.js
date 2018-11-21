'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var env = process.env;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

var ClashApi = function () {
  function ClashApi() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        uri = _ref.uri,
        token = _ref.token;

    _classCallCheck(this, ClashApi);

    this.token = token || env.COC_API_TOKEN;
    this.uri = uri || _config2.default.uri;

    if (!this.token) {
      throw new Error('Must define a token option or COC_API_TOKEN env variable');
    }
  }

  _createClass(ClashApi, [{
    key: 'requestOptions',
    value: function requestOptions(opts) {
      return (0, _lodash.assign)(opts, {
        headers: {
          Accept: 'application/json',
          authorization: 'Bearer ' + this.token
        },
        json: true
      });
    }
  }, {
    key: 'clanByTag',
    value: function clanByTag(tag) {
      return (0, _requestPromise2.default)(this.requestOptions({
        uri: this.uri + '/clans/' + encodeURIComponent(tag)
      }));
    }
  }, {
    key: 'clanMembersByTag',
    value: function clanMembersByTag(tag) {
      return (0, _requestPromise2.default)(this.requestOptions({
        uri: this.uri + '/clans/' + encodeURIComponent(tag) + '/members'
      }));
    }
  }, {
    key: 'clanWarlogByTag',
    value: function clanWarlogByTag(tag) {
      return (0, _requestPromise2.default)(this.requestOptions({
        uri: this.uri + '/clans/' + encodeURIComponent(tag) + '/warlog'
      }));
    }
  }, {
    key: 'clanCurrentWarByTag',
    value: function clanCurrentWarByTag(tag) {
      return (0, _requestPromise2.default)(this.requestOptions({
        uri: this.uri + '/clans/' + encodeURIComponent(tag) + '/currentwar'
      }));
    }
  }, {
    key: 'clanLeague',
    value: function clanLeague(tag) {
      return (0, _requestPromise2.default)(this.requestOptions({
        uri: this.uri + '/clans/' + encodeURIComponent(tag) + '/currentwar/leaguegroup'
      }));
    }
  }, {
    key: 'clans',
    value: function clans() {
      var qs = {};

      var dsl = ['name', 'warFrequency', 'locationId', 'minMembers', 'maxMembers', 'minClanPoints', 'minClanLevel', 'limit', 'after', 'before'].reduce(function (builder, field) {
        builder['with' + capitalizeFirstLetter(field)] = function (input) {
          qs[field] = input;
          return builder;
        };
        return builder;
      }, {
        fetch: function () {
          return (0, _requestPromise2.default)(this.requestOptions({
            qs: qs,
            uri: this.uri + '/clans'
          }));
        }.bind(this)
      });

      return dsl;
    }
  }, {
    key: 'locations',
    value: function locations() {
      var dsl = {
        fetch: function () {
          return (0, _requestPromise2.default)(this.requestOptions({
            uri: this.uri + '/locations'
          }));
        }.bind(this),
        withId: function (locId) {
          var rankId;

          var rankingDslMembers = {
            byClan: function byClan() {
              rankId = 'clans';
              return rankingDsl;
            },
            byPlayer: function byPlayer() {
              rankId = 'players';
              return rankingDsl;
            }
          };

          var rankingDsl = (0, _lodash.assign)({
            fetch: function () {
              return (0, _requestPromise2.default)(this.requestOptions({
                uri: this.uri + '/locations/' + encodeURIComponent(locId) + '/rankings/' + rankId
              }));
            }.bind(this)
          }, rankingDslMembers);

          var locDsl = (0, _lodash.assign)({
            fetch: function fetch() {
              return (0, _requestPromise2.default)(this.requestOptions({
                uri: this.uri + '/locations/' + encodeURIComponent(locId)
              }));
            }
          }, rankingDslMembers);

          return locDsl;
        }.bind(this)
      };
      return dsl;
    }
  }, {
    key: 'leagues',
    value: function leagues() {
      return (0, _requestPromise2.default)(this.requestOptions({
        uri: this.uri + '/leagues'
      }));
    }
  }, {
    key: 'playerByTag',
    value: function playerByTag(tag) {
      return (0, _requestPromise2.default)(this.requestOptions({
        uri: this.uri + '/players/' + encodeURIComponent(tag)
      }));
    }
  }]);

  return ClashApi;
}();

var factory = function factory(config) {
  return new ClashApi(config);
};

factory.ClashApi = ClashApi;

module.exports = factory;
