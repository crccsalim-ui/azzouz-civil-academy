import siteConfig from "@/config/site.config.json";
import {getTranslations} from "next-intl/server";

import {resolveLocaleParam} from "@/lib/i18n";

type PageProps = {
  params?: Promise<{locale?: string}>;
};

export default async function ContactPage({params}: PageProps) {
  const locale = await resolveLocaleParam(params);
  const tPage = await getTranslations({locale, namespace: 'pages'});

  return (
    <main className="mx-auto max-w-3xl space-y-8 px-6 pb-16 pt-12">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold text-[var(--foreground)]">
          {tPage('contact.title')}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          {tPage('contact.intro')}
        </p>
      </header>

      <section className="space-y-6">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Contact direct</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Adresse e-mail principale :{' '}
            <a className="text-accent" href={siteConfig.social.email}>
              {siteConfig.author.email}
            </a>
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            LinkedIn :{' '}
            <a className="text-accent" href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer">
              {siteConfig.social.linkedin}
            </a>
          </p>
        </div>

        <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Demande de publication</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Pour proposer un document (norme, retour d’expérience, fiche chantier) :
          </p>
          <ol className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>1. Indiquez le titre du document et l’organisme éditeur.</li>
            <li>2. Précisez le statut des droits (propriété, licence, domaine public).</li>
            <li>3. Ajoutez une courte synthèse (5 lignes) et vos mots-clés.</li>
          </ol>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Envoyez votre demande à {siteConfig.author.email} avec l’objet « Publication AZ-CIVIL-ACADEMY ».
          </p>
        </div>
      </section>
    </main>
  );
}


