"use client";

import { useParams } from "next/navigation";
import { DEFAULT_LOCALE } from "./locales";
import type { Locale } from "./locales";

export { LOCALES, DEFAULT_LOCALE } from "./locales";
export type { Locale } from "./locales";

import zhMessages from "./messages/zh.json";
import enMessages from "./messages/en.json";
import msMessages from "./messages/ms.json";

type Messages = typeof zhMessages;

const DICTIONARIES: Record<string, Messages> = {
  zh: zhMessages,
  en: enMessages,
  ms: msMessages,
};

export function useTranslation() {
  const params = useParams();
  const locale = (params?.locale as string) || DEFAULT_LOCALE;
  const t = DICTIONARIES[locale] || DICTIONARIES[DEFAULT_LOCALE];
  return { t, locale };
}

export function getDictionary(locale: string): Messages {
  return DICTIONARIES[locale] || DICTIONARIES[DEFAULT_LOCALE];
}
