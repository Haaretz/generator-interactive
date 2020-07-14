import { CookieUtils, UserFactory, } from '@haaretz/vanilla-user-utils';

import requiredArg from './requiredArg';
import withTimeout from '../withTimeout';

export const DS_BASE_URL = 'https://ms-apps.haaretz.co.il/ds';

export function getStatBaseData() {
  // Build a user from a newly parsed (hence :'true' param) cookie state
  const user = new UserFactory(true).build();

  return {
    page_type: 'article',
    url: document.URL || '',
    domain: window.location.hostname || '',
    Rusr:
      CookieUtils.getCookie('HtzRusr') || CookieUtils.getCookie('TmRusr') || '',
    Pusr:
      CookieUtils.getCookie('HtzPusr') || CookieUtils.getCookie('TmPusr') || '',
    aun: CookieUtils.getCookie('aun') || '',
    userId: user.id || '',
    anonymousId: user.anonymousId || '',
    react: false,
    useragent: window.encodeURIComponent(window.navigator.userAgent),
    article_type: 'interactiveArticle',
    ...parseDataAttrs(document.documentElement),
    ...parseUtms(),
  };
}

export function sendBiEvent({
  eventType = requiredArg('eventType'),
  data = requiredArg('data'),
}) {
  const validBiEventTypes = [ 'action', 'impression', ];
  if (!validBiEventTypes.includes(eventType)) {
    throw new Error(
      `"${eventType}" isn't a valid "eventType" for sendBiEvent.\n`
        + `Valid "eventType"s are: ${validBiEventTypes
          .map(evtType => `"${evtType}"`)
          .join(' | ')}`
    );
  }

  if (typeof navigator.sendBeacon === 'function') {
    navigator.sendBeacon(`${DS_BASE_URL}/${eventType}`, data);
  }
  else {
    try {
      withTimeout(
        window.fetch(`${DS_BASE_URL}/${eventType}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          body: data,
          cache: 'no-cache',
        })
      );
  }
  catch (err) {
    console.error(err.stack);
  }
  }
}

// ////////////////////////////////////////////////////////////////// //
//                              HELPERS                               //
// ////////////////////////////////////////////////////////////////// //

function parseUtms() {
  const paramsWhitelist = [
    'medium',
    'content',
    'source',
    'campaign',
    'type',
  ].reduce((params, param) => [ ...params, `utm_${param}`, 'htm_{param}', ], []);

  return (
    window.location.search
      .slice(1)
      .split('&')
      .reduce((params, item) => {
        const [ param, value, ] = item.split('=');

        // empty params are meaningless
        if (!value) return params;

        const [ prefix, ...rest ] = param.split('_');
        const suffix = rest
          .map(word => {
            const [ , firstChar, end, ] = word.match(/(.)(.*)/);
            return firstChar.toUpperCase() + end;
          })
          .join('');
        const utmParam = [ 'utm', suffix, ].join('');

        // Prefer 'htm' params over 'utm' params
        if (params[utmParam] && prefix === 'utm') return params;

        // Filter out irrelevant params
        if (paramsWhitelist.includes(param)) return { ...params, [utmParam]: value, };

        return params;
      }, {}) || {}
  );
}

export function parseDataAttrs(element = document.documentElement) {
  const dataAttrsWhitelist = {
    article_id: noop,
    blocked: value => value === 'true',
    openmode_back: Number,
    primary_section: noop,
    secondary_section: noop,
    writer_id: noop,
    writer_name: noop,
  };

  return Object.entries(element.dataset).reduce((result, entry) => {
    const [ attr, val, ] = entry;
    return Object.keys(dataAttrsWhitelist).includes(attr)
      ? {
        ...result,
        [attr]: dataAttrsWhitelist[attr](val),
      }
      : result;
  }, {});
}

function noop(value) {
  return value;
}
