import {getTranslations} from "next-intl/server";

import siteConfig from "@/config/site.config.json";
import {resolveLocaleParam} from "@/lib/i18n";

type PageProps = {
  params?: Promise<{locale?: string}>;
};

export default async function AboutPage({params}: PageProps) {
  const locale = await resolveLocaleParam(params);
  const tPage = await getTranslations({locale, namespace: 'pages'});
  const photoSrc = '/images/portrait-salim.jpg';

  return (
    <main className="mx-auto max-w-5xl space-y-10 px-6 pb-16 pt-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold text-[var(--foreground)]">
          {tPage('about.title')}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          {tPage('about.intro')}
        </p>
      </header>

      <section className="grid gap-8 md:grid-cols-[2fr,1fr] md:items-start">
        <article className="space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
          <p>
            Salim AZZOUZ est ingénieur en génie civil, spécialisé dans les structures béton et métal, avec plus de 15 ans d’expérience sur des projets en Algérie et à l’international.
          </p>
          <p>
            Il a piloté des missions de diagnostic parasismique, d’expertise chantier et de formation continue auprès de bureaux d’études et d’entreprises publiques.
          </p>
          <p>
            L’académie AZ-CIVIL-ACADEMY rassemble ses ressources : normes commentées, fiches pratiques d’essais, retours d’expérience et supports pédagogiques pour étudiants, ingénieurs et stagiaires.
          </p>
          <p>
            Objectifs : faciliter l’accès aux références réglementaires (RPA, Eurocodes), accélérer les études d’exécution, et promouvoir une ingénierie responsable en Algérie.
          </p>
        </article>
        <aside className="flex flex-col items-center gap-4">
          <div
            className="h-48 w-48 overflow-hidden rounded-full border border-[var(--border)] bg-slate-100 shadow-soft"
            style={{
              backgroundImage: `url(${photoSrc})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            aria-label="Portrait de Salim AZZOUZ"
          />
          <div className="text-center text-sm text-slate-600 dark:text-slate-300">
            <p className="font-semibold">{siteConfig.author.name}</p>
            <p>{siteConfig.author.title}</p>
            <a className="text-accent" href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </aside>
      </section>
    </main>
  );
}




