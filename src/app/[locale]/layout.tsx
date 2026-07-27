import { notFound } from "next/navigation";
import { LOCALES, type Locale } from "@/i18n/locales";
import LocaleLangSetter from "@/components/LocaleLangSetter";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();

  return (
    <>
      <LocaleLangSetter locale={locale} />
      {children}
    </>
  );
}
