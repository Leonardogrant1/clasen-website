import 'server-only'

export type Locale = 'de' | 'en' | 'ru' | 'zh'

export type Dictionary = typeof import('@/dictionaries/de.json');

const dictionaries = {
  de: () => import('@/dictionaries/de.json').then((m) => m.default as Dictionary),
  en: () => import('@/dictionaries/en.json').then((m) => m.default as Dictionary),
  ru: () => import('@/dictionaries/ru.json').then((m) => m.default as Dictionary),
  zh: () => import('@/dictionaries/zh.json').then((m) => m.default as Dictionary),
} satisfies Record<Locale, () => Promise<Dictionary>>

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]()
