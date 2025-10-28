import Link from 'next/link';
import {getTranslations} from 'next-intl/server';

import {resolveLocaleParam} from '@/lib/i18n';

type NotFoundProps = {
  params?: Promise<{locale?: string}>;
};

export default async function NotFound({params}: NotFoundProps) {
  const locale = await resolveLocaleParam(params);
  const t = await getTranslations({locale, namespace: 'errors'});

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-4">
        <h1 className="text-5xl font-semibold text-[var(--foreground)]">
          {t('notFoundTitle')}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          {t('notFoundDescription')}
        </p>
      </div>
      <Link
        href={{pathname: `/${locale}`}}
        className="rounded-full bg-accent px-6 py-3 text-white shadow-soft transition hover:scale-[1.02]"
      >
        {t('backHome')}
      </Link>
    </main>
  );
}


