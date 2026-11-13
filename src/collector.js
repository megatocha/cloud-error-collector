export function isCloudFailure(n) {
  return n?.eSource === 1 && n?.eType === 15 && n?.millennium !== true;
}

export function appIdOf(data) {
  try {
    const value = typeof data?.appid === 'function' ? data.appid() : data?.appid;
    const id = Number(value);
    return Number.isSafeInteger(id) && id > 0 && id <= 0xffffffff ? id : null;
  } catch {
    return null;
  }
}

export function makeBatcher(send, delay = 20000) {
  let ids = new Set();
  let timer;
  function flush() {
    timer = undefined;
    if (!ids.size) return;
    const batch = [...ids];
    ids = new Set();
    send(batch);
  }
  return {
    add(id, notificationId) {
      ids.add(id ?? `unknown:${notificationId}`);
      if (!timer) timer = setTimeout(flush, delay);
    },
    stop() {
      if (timer) clearTimeout(timer);
      flush();
    },
  };
}

export function installInterception(store, replacePatch, callOriginal, add) {
  let soundPatch;
  let showPatch;
  try {
    soundPatch = replacePatch(store, 'ChooseSound', function(args) {
      return isCloudFailure(args[1]) ? null : callOriginal;
    });
    showPatch = replacePatch(store, 'BShowToast', function(args) {
      const [, notification] = args;
      if (!isCloudFailure(notification)) return callOriginal;
      add(appIdOf(notification.data), notification.notificationID);
      return false;
    });
    return () => { showPatch.unpatch(); soundPatch.unpatch(); };
  } catch (error) {
    if (showPatch) showPatch.unpatch();
    if (soundPatch) soundPatch.unpatch();
    throw error;
  }
}
