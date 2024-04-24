export const PRODUCT_TOKEN_KEY: string = process.env.PRODUCT_TOKEN_KEY || '';

export function saveProductContext(key: string, product: string) {
  localStorage.setItem(key, product);
}

export function getProductContext(key: string) {
  return localStorage.getItem(key);
}
