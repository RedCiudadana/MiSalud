import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit | Route | embedCompras', function() {
  setupTest();

  it('exists', function() {
    let route = this.owner.lookup('route:embed-compras');
    expect(route).to.be.ok;
  });
});
