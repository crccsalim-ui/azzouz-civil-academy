import {ReactNode} from 'react';

import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';

import {Footer} from '@/components/Footer';
import {Navbar} from '@/components/Navbar';
import {fontVariables} from '@/lib/fonts';
import {buildSiteMetadata} from '@/lib/metadata';
import {locales} from '@/lib/i18n';
import type {Locale} from '@/lib/i18n';
import {getDirection} from '@/lib/rtl';

type LayoutParams = Promise<{locale: Locale}>;

type LayoutProps = {
  children: ReactNode;
  params: LayoutParams;
};

type MetadataProps = {
  params: LayoutParams;
};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: MetadataProps) {
  const {locale} = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  return buildSiteMetadata(locale);
}

export default async function LocaleLayout({children, params}: LayoutProps) {
  const {locale} = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = getDirection(locale);
  const isRtl = dir === 'rtl';

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${fontVariables} ${isRtl ? 'rtl' : 'ltr'}`}
      suppressHydrationWarning
    >
      <body
        className={`min-h-screen bg-[var(--background)] text-[var(--foreground)] ${
          isRtl ? 'rtl font-arabic' : 'ltr font-latin'
        }`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="flex min-h-screen flex-col">
            <Navbar locale={locale} />
            <main className="flex-1 bg-[var(--background)]">{children}</main>
            <Footer locale={locale} />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
