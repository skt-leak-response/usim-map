import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isMobile() {
  if (typeof navigator === 'undefined') return false;
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export const isValidEmail = (email: string): boolean => {
  // Remove any content in parentheses
  const cleanEmail = email.replace(/\s*\([^)]*\)/g, '');
  // Split by slash and take the first part
  const emailPart = cleanEmail.split('/')[0].trim();
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(emailPart);
};

export const processEmailAddress = (email: string): string[] => {
  // Remove any content in parentheses
  const cleanEmail = email.replace(/\s*\([^)]*\)/g, '');
  // Split by slash and filter out empty strings
  return cleanEmail
    .split('/')
    .map((e) => e.trim())
    .filter((e) => e && isValidEmail(e));
};
