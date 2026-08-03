import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatZAR(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function daysUntil(dateString: string): number {
  const diff = new Date(dateString).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function whatsappLink(message: string, number = '27648132233'): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function sectorAccentClass(sector: string): string {
  return `sector-accent-${sector.replace(/\s+/g, '-')}`
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
