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

/**
 * ClashApi - Provides an easy way to get started with the Clash of Clans API.
 *
 * All fetches return a promise using
 *
 * @example
 * let client = clashApi({
 *    token: yourApiToken // Optional, can also use COC_API_TOKEN env variable
 * });
 */

var ClashApi = function () {
  function ClashApi() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        uri = _ref.uri,
        token = _ref.token,
        request = _ref.request;

    _classCallCheck(this, ClashApi);

    /**
     * Personal Clash of Clans API token.
     */
    this.token = token || env.COC_API_TOKEN;
    this.uri = uri || _config2.default.uri;
    this._requestDefaults = request || {};
    if (!this.token) {
      throw new Error('Must define a token option or COC_API_TOKEN env variable');
    }
  }

  _createClass(ClashApi, [{
    key: 'requestOptions',
    value: function requestOptions(opts) {
      return (0, _lodash.merge)({
        headers: {
          Accept: 'application/json',
          authorization: 'Bearer ' + this.token
        },
        json: true
      }, opts, this._requestDefaults);
    }

    /**
     * Get information about a single clan by clan tag. Clan tags can be found using clan search operation.
     *
     * @example
     * client
     *    .clanByTag('#UPC2UQ')
     *    .then(response => console.log(response))
     *    .catch(err => console.log(err));
     *
     * @param {string} tag - Tag of the clan to retrieve.
     */

  }, {
    key: 'clanByTag',
    value: function clanByTag(tag) {
      return (0, _requestPromise2.default)(this.requestOptions({
        uri: this.uri + '/clans/' + encodeURIComponent(tag)
      }));
    }

    /**
     * List clan members.
     *
     * @example
     * client
     *    .clanMembersByTag('#UPC2UQ')
     *    .then(response => console.log(response))
     *    .catch(err => console.log(err));
     *
     * @param {string} tag - Tag of the clan whose members to retrieve.
     */

  }, {
    key: 'clanMembersByTag',
    value: function clanMembersByTag(tag) {
      return (0, _requestPromise2.default)(this.requestOptions({
        uri: this.uri + '/clans/' + encodeURIComponent(tag) + '/members'
      }));
    }

    /**
     * Retrieve clan's clan war log.
     *
     * @example
     * client
     *    .clanWarlogByTag('#UPC2UQ')
     *    .then(response => console.log(response))
     *    .catch(err => console.log(err));
     *
     * @param {string} tag - Tag of the clan whose war log to retrieve.
     */

  }, {
    key: 'clanWarlogByTag',
    value: function clanWarlogByTag(tag) {
      return (0, _requestPromise2.default)(this.requestOptions({
        uri: this.uri + '/clans/' + encodeURIComponent(tag) + '/warlog'
      }));
    }

    /**
     * Retrieve information about clan's current clan war.
     *
     * @example
     * client
     *    .clanCurrentWarByTag(`#UPC2UQ`)
     *    .then(response => console.log(response))
     *    .catch(err => console.log(err));
     *
     * @param {string} tag - Tag of the clan whose current clan war information to retrieve.
     */

  }, {
    key: 'clanCurrentWarByTag',
    value: function clanCurrentWarByTag(tag) {
      return (0, _requestPromise2.default)(this.requestOptions({
        uri: this.uri + '/clans/' + encodeURIComponent(tag) + '/currentwar'
      }));
    }

    /**
     * Retrieve information about clan's current clan war league group.
     *
     * @param {string} tag - Tag of the clan whose current clan war league group to retrieve.
     */

  }, {
    key: 'clanLeague',
    value: function clanLeague(tag) {
      return (0, _requestPromise2.default)(this.requestOptions({
        uri: this.uri + '/clans/' + encodeURIComponent(tag) + '/currentwar/leaguegroup'
      }));
    }
  }, {
    key: 'clanLeagueWars',
    value: function clanLeagueWars(tag) {
      return (0, _requestPromise2.default)(this.requestOptions({
        uri: this.url + '/clanwarleagues/wars/' + encodeURIComponent(tag)
      }));
    }

    /**
     * Search all clans by name and/or filtering the results using various criteria.
     * At least one filtering criteria must be defined and if name is used as part of search,
     * it is required to be at least three characters long.
     *
     * It is not possible to specify ordering for results so clients should not rely on any
     * specific ordering as that may change in the future releases of the API.
     *
     * @example
     * client
     *    .clans()
     *    .withWarFrequency('always')
     *    .withMinMembers(25)
     *    .fetch()
     *    .then(response => console.log(response))
     *    .catch(err => console.log(err))
     *
     * @see https://developer.clashofclans.com/api-docs/index.html#!/clans/searchClans
     */

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

    /**
     * List all available locations.
     *
     * @example
     * client
     *    .locations()
     *    .withId(locationId)
     *    .byPlayer()
     *    .fetch()
     *    .then(response => console.log(response))
     *    .catch(err => console.log(err));
     */

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
          var rankId = void 0;

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

          var rankingDsl = assign({
            fetch: function () {
              return (0, _requestPromise2.default)(this.requestOptions({
                uri: this.uri + '/locations/' + encodeURIComponent(locId) + '/rankings/' + rankId
              }));
            }.bind(this)
          }, rankingDslMembers);

          var locDsl = assign({
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

    /**
     * Get list of leagues.
     */

  }, {
    key: 'leagues',
    value: function leagues() {
      return (0, _requestPromise2.default)(this.requestOptions({
        uri: this.uri + '/leagues'
      }));
    }

    /**
     * Get information about a single player by player tag. Player tags can be found either in game or by from clan member lists.
     */

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