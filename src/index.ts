import { definePlugin, toaster, replacePatch, callOriginal } from 'millennium';
import { installInterception, makeBatcher } from './collector.js';
import { titleFor } from './locales.js';

export default definePlugin(() => {
  let stopped = false;
  let language = 'english';
  let retry: ReturnType<typeof setTimeout> | undefined;
  let unpatch: (() => void) | undefined;
  const batch = makeBatcher((ids: (number | string)[]) => {
    const names = ids.slice(0, 5).map(id => {
      if (typeof id !== 'number') return 'App ID ?';
      try {
        return (globalThis as any).appStore?.GetAppOverviewByAppID(id)?.display_name || `App ID ${id}`;
      } catch {
        return `App ID ${id}`;
      }
    });
    const rest = ids.length > 5 ? ` +${ids.length - 5}` : '';
    toaster.toast({ title: titleFor(language, ids.length), body: names.join(', ') + rest, duration: 10000 });
  });

  void (globalThis as any).SteamClient?.Settings?.GetCurrentLanguage?.()
    ?.then((value: string) => { language = value; })
    .catch((error: unknown) => console.warn('[Cloud Error Collector] Language lookup failed:', error));

  function install(attempt = 0) {
    if (stopped) return;
    const store = (globalThis as any).NotificationStore;
    if (store && typeof store.ChooseSound === 'function' && typeof store.BShowToast === 'function' && toaster?.toast) {
      try {
        unpatch = installInterception(store, replacePatch, callOriginal, (id: number | null, notificationId: string | number) => batch.add(id, notificationId));
        console.info('[Cloud Error Collector] Intercepting Steam Cloud errors before display');
      } catch (error) {
        console.error('[Cloud Error Collector] Could not intercept notifications:', error);
      }
    } else if (attempt < 60) {
      retry = setTimeout(() => install(attempt + 1), 500);
    } else console.warn('[Cloud Error Collector] Steam notification store unavailable');
  }
  install();
  return {
    title: 'Cloud Error Collector',
    onDismount() {
      stopped = true;
      if (retry) clearTimeout(retry);
      unpatch?.();
      batch.stop();
    },
  };
});
