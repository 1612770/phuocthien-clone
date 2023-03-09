class ImageUtils {
  static IMAGE_HOST = process.env.HOST_IMAGE?.includes('http')
    ? process.env.HOST_IMAGE
    : `https://${process.env.HOST_IMAGE}`;

  static MENU_MOCKS = ['/image-placeholder.png'];

  static PRODUCT_MOCKS = ['/image-placeholder.png'];

  static CAPAIGN_MOCKS = ['/image-placeholder.png'];

  static CHECKOUT_MOCKS = ['/image-placeholder.png'];

  static DRUGSTORE_MOCKS = ['/logo.png'];

  static FOCUS_MOCKS = ['/image-placeholder.png'];

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

  static getRandomMockProductImageUrl() {
    return ImageUtils.PRODUCT_MOCKS[
      Math.floor(Math.random() * ImageUtils.PRODUCT_MOCKS.length)
    ];
  }

  static getRandomMockCampaignImageUrl() {
    return ImageUtils.CAPAIGN_MOCKS[
      Math.floor(Math.random() * ImageUtils.CAPAIGN_MOCKS.length)
    ];
  }

  static getRandomMockCheckoutUrl() {
    return ImageUtils.CHECKOUT_MOCKS[
      Math.floor(Math.random() * ImageUtils.CHECKOUT_MOCKS.length)
    ];
  }

  static getRandomMockDrugstoreUrl() {
    return ImageUtils.DRUGSTORE_MOCKS[
      Math.floor(Math.random() * ImageUtils.DRUGSTORE_MOCKS.length)
    ];
  }

  static getFocusMockUrl() {
    return ImageUtils.FOCUS_MOCKS[
      Math.floor(Math.random() * ImageUtils.FOCUS_MOCKS.length)
    ];
  }
}

export default ImageUtils;
