import { test } from 'node:test';
import assert from 'node:assert/strict';
import { appIdOf, installInterception, makeBatcher } from '../src/collector.js';
import { titleFor, titles } from '../src/locales.js';

const original = Symbol('original');
function replacePatch(object, key, handler) {
  const patch = { original: object[key], unpatch() { object[key] = patch.original; } };
  object[key] = function(...args) {
    const result = handler.call(this, args);
    return result === original ? patch.original.apply(this, args) : result;
  };
  return patch;
}
function fixture() {
  const seen = [], events = [];
  const store = {
    BShowToast(info) { return info.showToast; },
    ChooseSound(info) { return info.sound || null; },
    ProcessNotification(info, notification) {
      events.push(['tray', notification.eType]);
      const show = this.BShowToast(info, notification);
      const sound = this.ChooseSound(info, notification);
      if (show) events.push(['toast', notification.eType]);
      else if (sound) events.push(['sound', notification.eType]);
    },
  };
  const initial = { sound: store.ChooseSound, show: store.BShowToast };
  const unpatch = installInterception(store, replacePatch, original, (id, notificationId) => seen.push([id, notificationId]));
  return { store, seen, events, initial, unpatch };
}
const notification = (type, appid = 123) => ({ eType: type, eSource: 1, notificationID: 77, data: { appid: () => appid } });

test('cloud failures enter the tray but neither toast nor sound; unrelated notifications are unchanged', () => {
  const f = fixture();
  const info = { showToast: true, sound: 6 };
  f.store.ProcessNotification(info, notification(15));
  assert.deepEqual(f.seen, [[123, 77]]);
  assert.deepEqual(f.events, [['tray', 15]]);
  assert.deepEqual(info, { showToast: true, sound: 6 });
  f.store.ProcessNotification(info, notification(16));
  f.store.ProcessNotification(info, { ...notification(15), eSource: 2 });
  f.store.ProcessNotification(info, { ...notification(15), millennium: true });
  assert.deepEqual(f.events.slice(1), [['tray', 16], ['toast', 16], ['tray', 15], ['toast', 15], ['tray', 15], ['toast', 15]]);
  assert.equal(f.seen.length, 1);
  f.unpatch();
  assert.equal(f.store.ChooseSound, f.initial.sound);
  assert.equal(f.store.BShowToast, f.initial.show);
});

test('overlay path is suppressed and other sounds remain unchanged', () => {
  const f = fixture();
  const info = { showToast: true, sound: 6 };
  assert.equal(f.store.BShowToast(info, notification(15, 321)), false);
  assert.equal(f.store.ChooseSound(info, notification(15)), null);
  assert.equal(f.store.ChooseSound(info, notification(16)), 6);
  assert.deepEqual(f.seen, [[321, 77]]);
  f.unpatch();
});

test('app IDs are validated and batches deduplicate games', () => {
  assert.equal(appIdOf({ appid: () => 123 }), 123);
  assert.equal(appIdOf({ appid: () => 0 }), null);
  assert.equal(appIdOf({ appid: () => { throw Error(); } }), null);
  const results = [];
  const batch = makeBatcher(ids => results.push(ids), 10000);
  batch.add(123, 1); batch.add(321, 2); batch.add(123, 3); batch.add(null, 4);
  batch.stop(); batch.stop();
  assert.deepEqual(results, [[123, 321, 'unknown:4']]);
});

test('all bundled locales format counts and unknown languages fall back to English', () => {
  assert.equal(Object.keys(titles).length, 32);
  for (const lang of Object.keys(titles)) assert.match(titleFor(lang, 42), /42/);
  assert.equal(titleFor('unknown', 2), 'Steam Cloud errors: 2');
});
