import test from 'ava';
import { api } from './cxh-api-client';

test('API created', (t) => {
  t.is(typeof api, 'object');
});
