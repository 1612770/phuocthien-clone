class ImageUtils {
  static IMAGE_HOST = 'https://phuocthien.net';
  static MENU_MOCKS = [
    '/mock/menu-mock-1.png',
    '/mock/menu-mock-2.png',
    '/mock/menu-mock-3.png',
    '/mock/menu-mock-4.png',
    '/mock/menu-mock-5.png',
    '/mock/menu-mock-6.png',
    '/mock/menu-mock-7.png',
  ];
  static PRODUCT_MOCKS = [
    '/mock/product-mock-1.jpg',
    '/mock/product-mock-2.jpg',
    '/mock/product-mock-3.jpg',
    '/mock/product-mock-4.jpg',
    '/mock/product-mock-5.jpg',
    '/mock/product-mock-6.jpg',
    '/mock/product-mock-7.jpg',
    '/mock/product-mock-8.jpg',
    '/mock/product-mock-9.jpg',
    '/mock/product-mock-10.jpg',
  ];

  static CAPAIGN_MOCKs = [
    '/mock/campaign-mock-1.png',
    '/mock/campaign-mock-2.jpeg',
    '/mock/campaign-mock-3.jpeg',
    '/mock/campaign-mock-4.png',
  ];

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
    return ImageUtils.CAPAIGN_MOCKs[
      Math.floor(Math.random() * ImageUtils.CAPAIGN_MOCKs.length)
    ];
  }
}

export default ImageUtils;
