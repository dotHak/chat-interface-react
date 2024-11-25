import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getWebSocketUrl() {
    const envUrl = import.meta.env.VITE_BACKEND_WS_URI
    if(envUrl){
        return envUrl
    }

   return `${window.location.origin.replace(/^http/, 'ws')}/ws`;

}
