/* First-visit IP language detection; explicit choices always win. */
(function () {
  'use strict';
  var CACHE_KEY = 'site-language-country';
  var TTL = 24 * 60 * 60 * 1000;
  var CHINESE_REGIONS = ['CN', 'HK', 'MO', 'TW'];
  function valid(value) { return value === 'zh' || value === 'en' ? value : ''; }
  function read(storage, key) {
    try { return storage.getItem(key); } catch (_) { return null; }
  }
  function countryLanguage(country) {
    return CHINESE_REGIONS.indexOf(country) >= 0 ? 'zh' : 'en';
  }
  function create(options) {
    var storage = options.storage, now = options.now || Date.now;
    function initial() {
      var urlLang = valid(new URLSearchParams(options.search || '').get('lang'));
      if (urlLang) return { lang: urlLang, source: 'url' };
      var saved = valid(read(storage, 'lang'));
      if (saved) return { lang: saved, source: 'manual' };
      try {
        var cache = JSON.parse(read(storage, CACHE_KEY));
        if (cache && /^[A-Z]{2}$/.test(cache.country) && cache.expires > now()) {
          return { lang: countryLanguage(cache.country), source: 'ip-cache' };
        }
      } catch (_) {}
      var language = (options.languages || [])[0] || 'en';
      return { lang: /^zh(?:-|$)/i.test(language) ? 'zh' : 'en', source: 'browser' };
    }
    async function detect() {
      var fallback = initial();
      if (fallback.source !== 'browser') return fallback;
      var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var timer;
      try {
        var timeout = new Promise(function (_, reject) {
          timer = setTimeout(function () {
            if (controller) controller.abort();
            reject(new Error('Country lookup timed out'));
          }, options.timeout || 1800);
        });
        var lookup = options.fetch('https://api.country.is/', {
          credentials: 'omit', referrerPolicy: 'no-referrer',
          signal: controller ? controller.signal : undefined
        }).then(function (response) {
          if (!response.ok) throw new Error('Country lookup failed');
          return response.json();
        });
        var data = await Promise.race([lookup, timeout]);
        if (!data || typeof data.country !== 'string' || !/^[A-Z]{2}$/.test(data.country)) {
          return fallback;
        }
        try {
          storage.setItem(CACHE_KEY, JSON.stringify({ country: data.country, expires: now() + TTL }));
        } catch (_) {}
        // A visitor may switch language while the network request is pending.
        var choice = valid(read(storage, 'lang'));
        if (choice) return { lang: choice, source: 'manual' };
        return { lang: countryLanguage(data.country), source: 'ip' };
      } catch (_) {
        return initial();
      } finally {
        clearTimeout(timer);
      }
    }
    return { initial: initial, detect: detect };
  }
  var storage;
  try { storage = window.localStorage; } catch (_) {}
  window.SiteLanguage = create({
    storage: storage, search: window.location.search,
    languages: navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language],
    fetch: window.fetch.bind(window)
  });
  window.SiteLanguage.create = create;
})();
