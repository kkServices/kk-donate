import { sha256 } from 'js-sha256';

export function getEmailSha256(email: string): string {
  const address = email.trim().toLowerCase();
  return sha256(address);
}
// 邮箱脱敏
export function emailMask(email: string | null): string | null {
  if (!email) {
    return null;
  }
  const [prefix, suffix] = email.split('@');
  const domainSuffix = suffix.split('.');
  const last = domainSuffix.pop();
  const domain = domainSuffix.join('.');

  return `${maskString(prefix)}@${maskString(domain)}.${last}`;
}

// 脱敏字符串
function maskString(str: string) {
  if (str.length === 1) {
    return '*';
  }
  if (str.length === 2) {
    return `${str[0]}*`;
  }
  return `${str[0]}${'*'.repeat(str.length - 2)}${str[str.length - 1]}`;
}
