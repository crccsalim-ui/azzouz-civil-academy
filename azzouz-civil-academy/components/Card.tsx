import Link from "next/link";

import type {DocumentMetadata} from "@/lib/types";

type LinkHref = Parameters<typeof Link>[0]['href'];

type DocumentCardProps = {
  document: DocumentMetadata;
  href: LinkHref;
  labels: {
    domain: string;
    jurisdiction: string;
    rights: string;
    status: string;
    action: string;
  };
};

export function Card({document, href, labels}: DocumentCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
          <span>{labels.domain}</span>
          <span>�</span>
          <span>
            {labels.jurisdiction} � {document.year}
          </span>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            document.distribution_mode === 'host_file'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {labels.rights}
        </span>
      </div>
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-[var(--foreground)]">
          {document.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {document.summary}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-200">
          {labels.status}
        </span>
        {document.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-500 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700"
          >
            #{tag}
          </span>
        ))}
      </div>
      <div className="mt-auto">
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:gap-3"
        >
          {labels.action}
          <svg className="h-4 w-4" viewBox="0 0 16 16" aria-hidden>
            <path
              d="M5 4h6v6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 11 11 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
}
