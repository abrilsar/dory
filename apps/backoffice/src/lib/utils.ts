import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { env } from 'process';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


