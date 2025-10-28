import {getTranslations} from "next-intl/server";

import {Card} from "@/components/Card";
import {getAllDocuments} from "@/lib/content/documents";
import {resolveLocaleParam} from "@/lib/i18n";

type PageProps = {
  params?: Promise<{locale?: string}>;
};

export default async function GeotechPage({params}: PageProps) {
  const locale = await resolveLocaleParam(params);
  const [tPage, tCommon, tFilters] = await Promise.all([
    getTranslations({locale, namespace: 'pages'}),
    getTranslations({locale, namespace: 'common'}),
    getTranslations({locale, namespace: 'filters'}),
  ]);

  const documents = (await getAllDocuments({includeSamples: true})).filter(
    (doc) => doc.domain === 'geotech',
  );

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
    <main className="mx-auto max-w-6xl space-y-10 px-6 pb-16 pt-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold text-[var(--foreground)]">
          {tPage('geotech.title')}
        </h1>
        <p className="max-w-3xl text-lg text-slate-600 dark:text-slate-300">
          {tPage('geotech.intro')}
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {documents.map((doc) => (
          <Card
            key={doc.id}
            document={doc}
            href={{pathname: `/${locale}/standards/${doc.id}`}}
            labels={{
              domain: tFilters('domain.geotech'),
              jurisdiction: jurisdictionLabels[doc.jurisdiction] ?? doc.jurisdiction,
              rights: rightsLabels[doc.rights_status] ?? doc.rights_status,
              status: statusLabels[doc.status] ?? doc.status,
              action: tCommon('viewDetails'),
            }}
          />
        ))}
      </div>
    </main>
  );
}


