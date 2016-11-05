import { expect } from 'chai';
import sinon from 'sinon';
import clash from '../src/index';

describe('Clash of Clans API suite', () => {
  it('sanity', () => {
    expect(clash.bind(null, {})).to.throw('COC_API_TOKEN');
  });
});
