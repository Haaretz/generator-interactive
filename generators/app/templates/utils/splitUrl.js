export default function splitUrl(url) {
  const urlRegex = /^((?:(ws|https?)(?::\/\/))?(([^\s?#/]+?)\.([^\s?#/]+?))?(?::(\d{2,5}))?)?(\/[^\s?#]*?)?(?:\/?\?([^\s#]+?))?(?:#(.+))?$/gim;
  /*
      [0] - fullMatch. Ex. "http://www.haaretz.co.il:3000/graphql?query#bang"
      [1] - Base URL (scheme + FQDN + port). Ex. "http://www.haaretz.co.il:3000"
      [2] - scheme. Ex. "http" , "https" , "ws" , "www" , "promotions"
      [3] - Fully Qualified domain name (FQDN). Ex. "www.haaretz.co.il"
      [4] - hostname (subdomain). Ex. "login" , "www" , "promotions"
      [5] - domain (root). Ex. "haaretz.co.il" , "themarker.com"
      [6] - port (optional) - Ex: 3000, 2004
      [7] - path (optional) - Ex: /graphql, /papi/.premium-1204 (forward slash sign is included in result)
      [8] - query (optional) - Ex: ?key1=value1&key2=value3&key3 (questionmark sign is ommited in result)
      [9] - fragment (optional) - Ex: #article-comments (hash sign is ommited in result)
    */
  const [
    fullMatch,
    baseUrl,
    scheme,
    fqdn,
    hostname,
    domain,
    port,
    path,
    query,
    fragment,
  ] = urlRegex.exec(url) || [];
  return {
    fullMatch,
    baseUrl,
    scheme,
    fqdn,
    hostname,
    domain,
    port,
    path,
    query,
    fragment,
  };
}
