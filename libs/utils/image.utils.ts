class ImageUtils {
  static IMAGE_HOST = process.env.HOST_IMAGE?.includes('http')
    ? process.env.HOST_IMAGE
    : `https://${process.env.HOST_IMAGE}`;

  static MENU_MOCKS = ['/image-placeholder.png'];

  static getFullImageUrl(path?: string) {
    if (!path) return '';
    if (path.startsWith('http')) return path;

    return `${ImageUtils.IMAGE_HOST}${path}`;
  }

  static getFullMenuImageUrl(path?: string) {
    return ImageUtils.getFullImageUrl(path);
  }

  static getProductChildGroupImageUrl(path?: string) {
    return ImageUtils.getFullImageUrl(path);
  }

  static getRandomMockMenuUrl() {
    return ImageUtils.MENU_MOCKS[
      Math.floor(Math.random() * ImageUtils.MENU_MOCKS.length)
    ];
  }
}

export default ImageUtils;
