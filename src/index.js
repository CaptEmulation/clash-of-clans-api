import request from 'request-promise';
import config from '../config';
import { merge } from 'lodash';

const env = process.env;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.substr(1);
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
class ClashApi {


  constructor({uri, token, request} = {}) {
    /**
     * Personal Clash of Clans API token.
     */
    this.token = token || env.COC_API_TOKEN;
    this.uri = uri || config.uri;
    this._requestDefaults = request || {};
    if (!this.token) {
      throw new Error('Must define a token option or COC_API_TOKEN env variable');
    }
  }

  requestOptions(opts) {
    return merge({
      headers: {
        Accept: 'application/json',
        authorization: `Bearer ${this.token}`
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
  clanByTag(tag) {
    return request(this.requestOptions({
      uri: `${this.uri}/clans/${encodeURIComponent(tag)}`,
    }))
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
  clanMembersByTag(tag) {
    return request(this.requestOptions({
      uri: `${this.uri}/clans/${encodeURIComponent(tag)}/members`,
    }))
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
  clanWarlogByTag(tag) {
    return request(this.requestOptions({
      uri: `${this.uri}/clans/${encodeURIComponent(tag)}/warlog`,
    }))
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
  clanCurrentWarByTag(tag) {
    return request(this.requestOptions({
      uri: `${this.uri}/clans/${encodeURIComponent(tag)}/currentwar`,
    }))
  }

  /**
   * Retrieve information about clan's current clan war league group.
   *
   * @param {string} tag - Tag of the clan whose current clan war league group to retrieve.
   */
  clanLeague(tag) {
    return request(this.requestOptions({
      uri: `${this.uri}/clans/${encodeURIComponent(tag)}/currentwar/leaguegroup`,
    }))
  }

  clanLeagueWars(tag) {
        return request(this.requestOptions({
            uri: `${this.uri}/clanwarleagues/wars/${encodeURIComponent(tag)}`,
        }))
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
  clans() {
    var qs = {};

    const dsl = [
      'name',
      'warFrequency',
      'locationId',
      'minMembers',
      'maxMembers',
      'minClanPoints',
      'minClanLevel',
      'limit',
      'after',
      'before'
    ].reduce((builder, field) => {
      builder[`with${capitalizeFirstLetter(field) }`] = (input) => {
        qs[field] = input;
        return builder;
      };
      return builder;
    }, {
      fetch: function () {
        return request(this.requestOptions({
          qs: qs,
          uri: `${this.uri}/clans`,
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
  locations() {
    const dsl = {
      fetch: function () {
        return request(this.requestOptions({
          uri: `${this.uri}/locations`,
        }));
      }.bind(this),
      withId: function (locId) {
        let rankId;

        const rankingDslMembers = {
          byClan: function () {
            rankId = 'clans';
            return rankingDsl;
          },
          byPlayer: function () {
            rankId = 'players';
            return rankingDsl;
          }
        };

        const rankingDsl = assign({
          fetch: function () {
            return request(this.requestOptions({
              uri: `${this.uri}/locations/${encodeURIComponent(locId)}/rankings/${rankId}`,
            }));
          }.bind(this)
        }, rankingDslMembers);

        const locDsl = assign({
          fetch: function () {
            return request(this.requestOptions({
              uri: `${this.uri}/locations/${encodeURIComponent(locId)}`,
            }));
          }
        }, rankingDslMembers);

        return locDsl;
      }.bind(this)
    }
    return dsl;
  }

  /**
   * Get list of leagues.
   */
  leagues() {
    return request(this.requestOptions({
      uri: `${this.uri}/leagues`,
    }));
  }

  /**
   * Get information about a single player by player tag. Player tags can be found either in game or by from clan member lists.
   */
  playerByTag(tag) {
    return request(this.requestOptions({
      uri: `${this.uri}/players/${encodeURIComponent(tag)}`,
    }))
  }
}

const factory = function (config) {
  return new ClashApi(config);
}

factory.ClashApi = ClashApi;

module.exports = factory;
