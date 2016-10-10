import request from 'request-promise';
import config from '../config';
import { assign } from 'lodash';

var env = process.env;

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

class ClashApi {
  constructor({uri, token} = {}) {
    this.token = token || env.COC_API_TOKEN;
    this.uri = uri || config.uri;

    if (!this.token) {
      throw new Error('Must define a token option or COC_API_TOKEN env variable');
    }
  }

  requestOptions(opts) {
    return assign(opts, {
      headers: {
        Accept: 'application/json',
        authorization: `Bearer ${this.token}`
      },
      json: true
    })
  }

  clanByTag(tag) {
    return request(this.requestOptions({
      uri: `${this.uri}/clans/${encodeURIComponent(tag)}`,
    }))
  }

  clanMembersByTag(tag) {
    return request(this.requestOptions({
      uri: `${this.uri}/clans/${encodeURIComponent(tag)}/members`,
    }))
  }

  clanWarlogByTag(tag) {
    return request(this.requestOptions({
      uri: `${this.uri}/clans/${encodeURIComponent(tag)}/warlog`,
    }))
  }

  clans() {
    var qs = {};

    var dsl = [
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
      fetch: function() {
        return request(this.requestOptions({
          qs: qs,
          uri: `${this.uri}/clans`,
        }));
      }.bind(this)
    });

    return dsl;
  }

  locations() {
    var dsl = {
      fetch: function() {
        return request(this.requestOptions({
          uri: `${this.uri}/locations`,
        }));
      }.bind(this),
      withId: function (locId) {
        var rankId;

        var rankingDslMembers = {
          byClan: function () {
            rankId = 'clans';
            return rankingDsl;
          },
          byPlayer: function () {
            rankId = 'players';
            return rankingDsl;
          }
        };

        var rankingDsl = assign({
          fetch: function () {
            return request(this.requestOptions({
              uri: `${this.uri}/locations/${encodeURIComponent(locId)}/rankings/${rankId}`,
            }));
          }.bind(this)
        }, rankingDslMembers);

        var locDsl = assign({
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

  leagues() {
    return request(this.requestOptions({
      uri: `${this.uri}/leagues`,
    }));
  }
}

var factory = function (config) {
  return new ClashApi(config);
}

factory.ClashApi = ClashApi;

module.exports = factory;