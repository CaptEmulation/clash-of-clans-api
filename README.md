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
  .then(response => console.log(resonse))
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
