import {getTranslations} from "next-intl/server";

import {resolveLocaleParam} from "@/lib/i18n";

type PageProps = {
  params?: Promise<{locale?: string}>;
};

export default async function CoursesPage({params}: PageProps) {
  const locale = await resolveLocaleParam(params);
  const tPage = await getTranslations({locale, namespace: 'pages'});

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-6 pb-16 pt-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold text-[var(--foreground)]">
          {tPage('courses.title')}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          {tPage('courses.intro')}
        </p>
      </header>

      <section className="grid gap-4">
        <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Modules à venir</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
            <li>Calcul et ferraillage des dalles selon l’Eurocode 2.</li>
            <li>Fondations superficielles et profondes : méthodes Ménard.</li>
            <li>Structures métalliques : stabilité globale et contreventement.</li>
          </ul>
        </article>
        <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Format pédagogique</h2>
          <ol className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li><strong>Vidéo courte</strong> (15 min) pour le rappel théorique.</li>
            <li><strong>Fiche PDF</strong> avec formules prêtes à l’emploi.</li>
            <li><strong>Cas pratique</strong> téléchargeable (tableur ou script Python).</li>
          </ol>
        </article>
        <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Comment contribuer ?</h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Proposez vos supports de cours ou retours d’expérience via l’adresse e-mail de l’académie. Après validation, ils seront intégrés à la plateforme et indexés dans la recherche.
          </p>
        </article>
      </section>
    </main>
  );
}


