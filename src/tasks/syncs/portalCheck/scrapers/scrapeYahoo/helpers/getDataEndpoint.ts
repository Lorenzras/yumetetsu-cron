
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

  const baseUrl = url.split('search/')[0];

  return `${baseUrl}search/partials/?${params}&page=0`;
};
