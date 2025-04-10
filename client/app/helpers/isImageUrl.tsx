export const isImageURL = (value: string): boolean => {
  return /^https?:\/\//i.test(value);
};
