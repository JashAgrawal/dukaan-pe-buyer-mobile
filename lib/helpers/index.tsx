export const getImageUrl = (relativePath: string): string =>
  `${process.env.EXPO_PUBLIC_API_URL}${relativePath}`;
