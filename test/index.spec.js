import { expect } from 'chai';
import sinon from 'sinon';
import clash from '../src/index';

describe('Clash of Clans API suite', function() {
  it('sanity', () => {
    expect(clash.bind(null, {})).to.throw('COC_API_TOKEN');
  });

  it('Request defaults are added to request options', function() {
    const c = clash({
      token: 'token',
      request: {
        proxy: 'foo',
      },
    });
    const opts = c.requestOptions();
    expect(opts).to.include.key('proxy');
    expect(opts.proxy).to.equal('foo');
  });
});
