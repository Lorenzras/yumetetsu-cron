
/**
 * Transform Yahoo search result's url to
 * the endpoint of dynamic content.
 *
 * @param url Yahoo search result's URL
 * @return {string}  First page of the dynamic url
 */
export const getDataEndpoint = (url: string) => {
  const params = url.split('/?', 2)[1];

  if (!params) throw new Error('Failed to get parameters');

  return `https://realestate.yahoo.co.jp/land/search/partials/?bk=3&bk=6&${params}&page=0`;
};
