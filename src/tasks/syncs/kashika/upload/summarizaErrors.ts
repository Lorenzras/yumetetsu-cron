export const summarizeErrors = (rows: Record<string, string>[]) => {
  return rows.reduce((accu, prev)=>{
    const errorInfo = prev['エラー内容'].replaceAll(/\d:\s/g, '');
    if (!accu[errorInfo]) accu[errorInfo] = 0;
    accu[errorInfo] += 1;

    return accu;
  }, {} as Record<string, number>);
};
