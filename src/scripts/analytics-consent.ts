const panel = document.querySelector<HTMLElement>('#analytics-consent');
if (panel) {
  const measurementId = panel.dataset.measurementId!;
  const storageKey = 'maletafeliz-analytics-consent';
  const disableKey: `ga-disable-${string}` = `ga-disable-${measurementId}`;
  const browser = window as typeof window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean;
  };
  let initialized = false;
  const readChoice = () => {
    try { return localStorage.getItem(storageKey); } catch { return null; }
  };
  const enableAnalytics = () => {
    if (initialized) return;
    initialized = true;
    browser[disableKey] = false;
    browser.dataLayer = browser.dataLayer || [];
    browser.gtag = browser.gtag || function (..._args: unknown[]) { browser.dataLayer!.push(arguments); };
    browser.gtag('consent', 'default', { analytics_storage: 'granted' });
    browser.gtag('js', new Date());
    browser.gtag('config', measurementId);
    const script = document.createElement('script');
    script.id = 'google-analytics-tag';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.append(script);
  };
  const clearAnalyticsCookies = () => {
    const domains = location.hostname.split('.').map((_, index, parts) => parts.slice(index).join('.'));
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.split('=')[0].trim();
      if (name !== '_ga' && !name.startsWith('_ga_')) continue;
      document.cookie = `${name}=; Max-Age=0; path=/`;
      for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domain}`;
    }
  };
  const applyChoice = (choice: string | null) => {
    panel.hidden = choice === 'granted' || choice === 'denied';
    if (choice === 'granted') {
      enableAnalytics();
    } else {
      browser[disableKey] = true;
      if (choice === 'denied') clearAnalyticsCookies();
      if (initialized) {
        document.querySelector('#google-analytics-tag')?.remove();
        // A fresh document removes already-installed Google listeners as well.
        location.reload();
      }
    }
  };
  for (const button of panel.querySelectorAll<HTMLButtonElement>('[data-analytics-choice]')) {
    button.addEventListener('click', () => {
      const choice = button.dataset.analyticsChoice!;
      try { localStorage.setItem(storageKey, choice); } catch { /* Ask again next visit if storage is unavailable. */ }
      applyChoice(choice);
    });
  }
  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-analytics-settings]')) {
    button.addEventListener('click', () => {
      panel.hidden = false;
      panel.querySelector<HTMLButtonElement>('button')?.focus();
    });
  }
  window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) applyChoice(readChoice());
  });
  applyChoice(readChoice());
}
