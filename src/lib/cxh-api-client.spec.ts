import test from 'ava';
import { CxhApiClient } from './cxh-api-client';

test('API Constructor is defined', (t) => {
  t.is(typeof CxhApiClient, 'function');
});
