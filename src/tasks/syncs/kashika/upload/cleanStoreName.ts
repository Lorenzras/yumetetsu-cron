export const cleanStoreName = (name: string) => {
  return name.replaceAll(/(ハウスドゥ[!！]?(\s+)?)|店/g, '');
};
