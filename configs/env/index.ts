export const REGEX_PHONE =
  process.env.NEXT_PUBLIC_REGEX_PHONE ||
  '([+84|84|0]+[3|5|7|8|9])+([0-9]{8})\b';

export const IMPORTANT_MENU_KEYS = process.env.NEXT_PUBLIC_IMPORTANT_MENU_KEYS
  ? process.env.NEXT_PUBLIC_IMPORTANT_MENU_KEYS.split(',').map((key) =>
      key.trim().toUpperCase()
    )
  : [];

export const QR_URL =
  process.env.NEXT_PUBLIC_QR_URL || '';
