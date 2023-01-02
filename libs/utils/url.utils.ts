class UrlUtils {
  constructor() {}

  static removeAccent(text: string) {
    return (text || '')
      .toLocaleLowerCase()
      .replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a')
      .replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e')
      .replace(/(ì|í|ị|ỉ|ĩ)/g, 'i')
      .replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o')
      .replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u')
      .replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y')
      .replace(/(đ)/g, 'd');
  }

  static generateSlug(text?: string, id?: string) {
    if (!text) text = '';
    if (!id) id = '';

    // lower case text
    text = text.toLowerCase();

    // remove accents, swap ñ for n, etc
    text = UrlUtils.removeAccent(text);

    // remove invalid chars
    text = text.replace(/[^a-z0-9 -]/g, '');

    // collapse whitespace and replace by -
    text = text.replace(/\s+/g, '-');

    // collapse dashes
    text = text.replace(/-+/g, '-');

    return `${text}-${id}`;
  }

  static getKeyFromParam(url?: string) {
    if (!url) return '';

    // get last /
    const urlSplit = url.split('/');
    const lastUrl = urlSplit[urlSplit.length - 1];

    // get last 764EC9DE-8283-40BD-B6A7-5F66F11BAE51.length charaters
    return lastUrl.substring(lastUrl.length - 36);
  }
}

export default UrlUtils;
