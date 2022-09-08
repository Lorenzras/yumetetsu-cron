const dummy = 'https://manage.do-network.com/estate?';

export const setParams = (
  source: string,
  vals: {
    field: string,
    val: string,
  }[]) => {
  const dSource = new URL(dummy + source);

  vals.forEach((i) => dSource.searchParams.set(i.field, i.val));

  return dSource.toString().replace(dummy, '');
};
