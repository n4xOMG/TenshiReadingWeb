export function getWebPUrl(pngUrl) {
  return pngUrl.replace("/upload/", "/upload/f_auto,q_auto/");
}
