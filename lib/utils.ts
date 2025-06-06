import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const utcToLocal = (date:Date|string)=>{
  const utcDate = new Date(date);
  const localDate = new Date(utcDate.getTime()-utcDate.getTimezoneOffset()*60000)
  
  const localTime = format(localDate,'dd-MM-yyyy hh:mm a')

  return {localDate,localTime}
}
