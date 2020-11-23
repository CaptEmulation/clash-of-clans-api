# Introduction

Provides an easy way to get started with the [Clash of Clans API](https://developer.clashofclans.com)

# Installation

`npm install --save clash-of-clans-api`

# Usage

All fetches return a promise using [request-promise](https://www.npmjs.com/package/request-promise)

## Instantiation

In order to get started with Clash of Clans API, you need to create an account at [developer.clashofclans.com](https://developer.clashofclans.com) and create a key.  You will need the IP of the host using to connect to the services.

Once you get your token, you have two choices.
 - Set the *COC_API_TOKEN* env variable
 - Pass in a token option when creating the ClashApi object

Example:

```
import clashApi from 'clash-of-clans-api';
let client = clashApi({
  token: yourApiToken // Optional, can also use COC_API_TOKEN env variable
});
```

In addition, if you need to pass in any additional options to `request` (for example to set a proxy) then you can use the `request` option to do so:

```
import clashApi from 'clash-of-clans-api';
let client = clashApi({
  request: {
    proxy: process.env.MY_PROXY,
  },
});
```

See [request options](https://github.com/request/request#requestoptions-callback) for the full list of supported request options

## Clan Search

There is a DSL for performing clan searches.  At least one filtering criteria must be defined and if name is used as part of search, it is required to be at least three characters long.

See https://developer.clashofclans.com/api-docs/index.html#!/clans/searchClans

Example:
```
client
  .clans()
  .withWarFrequency('always')
  .withMinMembers(25)
  .fetch()
  .then(response => console.log(response))
  .catch(err => console.log(err))
```

All query parameters are supported, simply prepend `with` and capitalize the first letter of the query param.  Complete the request with a call to `fetch()`.

## Clan by Tag

Request clan details by clan tag.  Be sure to include the hashtag `#`.

Example:
```
client
  .clanByTag('#UPC2UQ')
  .then(response => console.log(response))
  .catch(err => console.log(err));
```

## Clan Members by Tag

Request clan member details by clan tag.  Be sure to include the hashtag `#`.

Example:
```
client
  .clanMembersByTag('#UPC2UQ')
  .then(response => console.log(response))
  .catch(err => console.log(err));
```

## Clan Warlog by Tag

Request clan warlog by clan tag.  Be sure to include the hashtag `#`.

Example:
```
client
  .clanWarlogByTag('#UPC2UQ')
  .then(response => console.log(response))
  .catch(err => console.log(err));
```

## Current War by Tag

Request current war information by clan tag.  Be sure to include the hashtag `#`.

Example:
```
client
  .clanCurrentWarByTag(`#UPC2UQ`)
  .then(response => console.log(response))
  .catch(err => console.log(err));
```

## Clan War Leagues support

Request the current clan war leagues the clan is participating in.

Example:
```
client
  .clanLeague(`#UPC2UQ`)
  .then(response => console.log(response))
  .catch(err => console.log(err));
  
// Response contains response.rounds[].warTags[]. Each of the warTags 
// can be used to retrieve further information about the league war.
client
  .clanLeagueWars(response.rounds[0].warTags[0])
  .then(response => console.log(response))
  .catch(err => console.log(err));
``` 

## Location

Location has a DSL for requesting location details

Examples:

```
// Request all location details
client
  .locations()
  .fetch()
  .then(response => console.log(response))
  .catch(err => console.log(err));

// Request details for a single location
client
  .locations()
  .withId(locationId)
  .fetch()
  .then(response => console.log(response))
  .catch(err => console.log(err));

// Request clan details for a single location
client
  .locations()
  .withId(locationId)
  .byClan()
  .fetch()
  .then(response => console.log(response))
  .catch(err => console.log(err));

// Request player details for a single location
client
  .locations()
  .withId(locationId)
  .byPlayer()
  .fetch()
  .then(response => console.log(response))
  .catch(err => console.log(err));
```

## Tutorial for complete beginners
https://medium.com/@alexionutale/how-to-use-clash-of-clans-api-cd4fe7406576?source=friends_link&sk=c12a0c2a736658681878f20cc98af08f
