import {getTranslations} from "next-intl/server";

import siteConfig from "@/config/site.config.json";
import {resolveLocaleParam} from "@/lib/i18n";

type PageProps = {
  params?: Promise<{locale?: string}>;
};

export default async function LegalPage({params}: PageProps) {
  const locale = await resolveLocaleParam(params);
  const tPage = await getTranslations({locale, namespace: 'pages'});

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-6 pb-16 pt-12">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold text-[var(--foreground)]">
          {tPage('legal.title')}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          {tPage('legal.intro')}
        </p>
      </header>

      <section className="space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
        <p>
          AZ-CIVIL-ACADEMY est un site édité par {siteConfig.author.name}. Les contenus originaux (synthèses, fiches, scripts) sont mis à disposition pour un usage pédagogique et professionnel.
        </p>
        <p>
          Les documents normatifs référencés restent la propriété de leurs éditeurs respectifs. Lorsque les droits ne permettent pas l’hébergement direct, un lien officiel est proposé.
        </p>
        <p>
          Pour toute demande de retrait ou de modification, merci de contacter {siteConfig.author.email} en précisant l’identifiant du document concerné.
        </p>
        <p>
          Hébergement : Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
        </p>
        <p>
          Données personnelles : aucune donnée sensible n’est stockée. Les journaux de consultation sont limités aux métriques techniques fournies par l’hébergeur.
        </p>
      </section>
    </main>
  );
}





