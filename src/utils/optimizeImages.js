export const getResponsiveImageUrl = (imageUrl, width) => {
  return `${imageUrl.replace("/upload/", `/upload/w_${width}/`)}`;
};
export const getOptimizedImageUrl = (imageUrl) => {
  return `${imageUrl.replace("/upload/", "/upload/f_auto,q_auto/")}`;
};
