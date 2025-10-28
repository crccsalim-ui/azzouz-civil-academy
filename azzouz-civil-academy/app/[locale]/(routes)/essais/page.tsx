import {getTranslations} from "next-intl/server";

import {MDXRenderer} from "@/components/MDXRenderer";
import {getAllEssais} from "@/lib/content/essais";
import {resolveLocaleParam} from "@/lib/i18n";

type PageProps = {
  params?: Promise<{locale?: string}>;
};

export default async function EssaisPage({params}: PageProps) {
  const locale = await resolveLocaleParam(params);
  const tPage = await getTranslations({locale, namespace: 'pages'});

  const essais = await getAllEssais();

  return (
    <main className="mx-auto max-w-5xl space-y-10 px-6 pb-16 pt-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold text-[var(--foreground)]">
          {tPage('essais.title')}
        </h1>
        <p className="max-w-3xl text-lg text-slate-600 dark:text-slate-300">
          {tPage('essais.intro')}
        </p>
      </header>

      <div className="space-y-6">
        {essais.map((essai) => (
          <article key={essai.id} className="space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-[var(--foreground)]">
                  {essai.title}
                </h2>
                <p className="text-sm uppercase tracking-wide text-slate-500">
                  {essai.category} · {new Date(essai.updated_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                {essai.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {essai.summary}
            </p>
            <MDXRenderer source={essai.body} />
          </article>
        ))}
      </div>
    </main>
  );
}


