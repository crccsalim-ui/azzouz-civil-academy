import Link from "next/link";
import {getTranslations} from "next-intl/server";

import {Card} from "@/components/Card";
import {HeroSearch} from "@/components/HeroSearch";
import {getAllDocuments} from "@/lib/content/documents";
import {resolveLocaleParam} from "@/lib/i18n";
import type {DocumentMetadata} from "@/lib/types";

type PageProps = {
  params?: Promise<{locale?: string}>;
};

function selectFeatured(documents: DocumentMetadata[]) {
  return [...documents]
    .sort((a, b) => b.year - a.year)
    .slice(0, 3);
}

export default async function HomePage({params}: PageProps) {
  const locale = await resolveLocaleParam(params);

  const [tHome, tCommon, tFilters] = await Promise.all([
    getTranslations({locale, namespace: 'home'}),
    getTranslations({locale, namespace: 'common'}),
    getTranslations({locale, namespace: 'filters'}),
  ]);

  const documents = await getAllDocuments({includeSamples: true});
  const featured = selectFeatured(documents);

  const domainLabels: Record<string, string> = {
    ba: tFilters('domain.ba'),
    acier: tFilters('domain.acier'),
    sismique: tFilters('domain.sismique'),
    geotech: tFilters('domain.geotech'),
    essais: tFilters('domain.essais'),
  };

  const jurisdictionLabels: Record<string, string> = {
    FR: tFilters('jurisdiction.fr'),
    DZ: tFilters('jurisdiction.dz'),
    INT: tFilters('jurisdiction.int'),
  };

  const rightsLabels: Record<string, string> = {
    own: tFilters('rightsStatus.own'),
    licensed: tFilters('rightsStatus.licensed'),
    public_domain: tFilters('rightsStatus.public_domain'),
    unclear: tFilters('rightsStatus.unclear'),
  };

  const statusLabels: Record<string, string> = {
    active: tFilters('status.active'),
    withdrawn: tFilters('status.withdrawn'),
    draft: tFilters('status.draft'),
    unknown: tFilters('status.unknown'),
  };

  return (
    <main className="flex flex-col gap-16 pb-16">
      <section className="relative overflow-hidden bg-[var(--surface)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[3fr,2fr] md:items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-600">
              {tHome('tagline')}
            </p>
            <h1 className="text-5xl font-bold tracking-tight text-[var(--foreground)] md:text-6xl">
              {tHome('title')}
            </h1>
            <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              {tHome('description')}
            </p>
            <div className="flex gap-3">
              <Link
                href="/standards"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:scale-[1.01]"
              >
                {tHome('ctaStandards')}
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-accent hover:text-accent"
              >
                {tHome('ctaCourses')}
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-[var(--border)] bg-white/70 p-6 shadow-soft dark:bg-slate-800/80">
            <HeroSearch locale={locale} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--foreground)]">
              {tHome('featuredTitle')}
            </h2>
            <p className="text-sm text-slate-500">{tHome('featuredSubtitle')}</p>
          </div>
          <Link
            href="/standards"
            className="text-sm font-semibold text-accent hover:underline"
          >
            {tHome('viewAll')}
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center text-sm text-slate-500">
            {tHome('emptyLibrary')}
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((doc) => (
              <Card
                key={doc.id}
                document={doc}
                href={{pathname: `/${locale}/standards/${doc.id}`}}
                labels={{
                  domain: domainLabels[doc.domain] ?? doc.domain.toUpperCase(),
                  jurisdiction:
                    jurisdictionLabels[doc.jurisdiction] ?? doc.jurisdiction,
                  rights: rightsLabels[doc.rights_status] ?? doc.rights_status,
                  status: statusLabels[doc.status] ?? doc.status,
                  action: tCommon('viewDetails'),
                }}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              {tHome('featureIngestTitle')}
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {tHome('featureIngestDescription')}
            </p>
          </div>
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              {tHome('featureSearchTitle')}
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {tHome('featureSearchDescription')}
            </p>
          </div>
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              {tHome('featureLocalizationTitle')}
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {tHome('featureLocalizationDescription')}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}


