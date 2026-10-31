// Tag mein sirf ye characters valid hote hain: 0289PYLQGRJCUV
const VALID = /^[0289PYLQGRJCUV]{3,}$/;

export function normalizeTag(raw: string): string {
  return raw.trim().toUpperCase().replace(/^#/, "").replace(/O/g, "0");
}

export function isValidTag(tag: string): boolean {
  return VALID.test(tag);
}

// API URL mein "#" ko %23 banana padta hai
export function encodeTag(tag: string): string {
  return encodeURIComponent("#" + tag);
}
