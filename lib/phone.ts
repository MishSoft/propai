export const PHONE_MAX_LENGTH = 30;

const PHONE_CHARS_PATTERN = /^\+?[\d\s().-]*$/;

export function isValidPhoneNumber(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > PHONE_MAX_LENGTH) return false;
  if (!PHONE_CHARS_PATTERN.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, "").length;
  return digits >= 7 && digits <= 15;
}
