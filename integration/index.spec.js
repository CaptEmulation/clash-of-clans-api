import { expect } from 'chai';
import sinon from 'sinon';
import clash from '../src/index';

describe('Clash of Clans API suite', () => {
  it('clanByTag', () => {
    return clash().clanByTag('#UPC2UQ').then((response) => {
      console.log(JSON.stringify(response, null, 2));
    });
  });

  it('playerByTag', () => {
    return clash().playerByTag('#YCJLQL9V').then((response) => {
      console.log(JSON.stringify(response, null, 2));
    });
  });
});
