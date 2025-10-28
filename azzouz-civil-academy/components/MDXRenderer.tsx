import type {ComponentProps} from "react";

import {MDXRemote} from "next-mdx-remote/rsc";

const components = {
  h2: (props: ComponentProps<'h2'>) => (
    <h2
      className="mt-10 scroll-m-20 text-2xl font-semibold tracking-tight text-[var(--foreground)]"
      {...props}
    />
  ),
  h3: (props: ComponentProps<'h3'>) => (
    <h3
      className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight text-[var(--foreground)]"
      {...props}
    />
  ),
  p: (props: ComponentProps<'p'>) => (
    <p className="leading-7 text-slate-600 dark:text-slate-300" {...props} />
  ),
  ul: (props: ComponentProps<'ul'>) => (
    <ul className="my-4 space-y-2 pl-6 text-slate-600 dark:text-slate-300" {...props} />
  ),
  li: (props: ComponentProps<'li'>) => (
    <li className="list-disc" {...props} />
  ),
  a: (props: ComponentProps<'a'>) => (
    <a
      className="text-accent underline decoration-accent/40 underline-offset-4"
      target={props.target ?? '_blank'}
      rel="noreferrer"
      {...props}
    />
  ),
};

type MDXRendererProps = {
  source: string;
};

export function MDXRenderer({source}: MDXRendererProps) {
  return (
    <div className="prose prose-slate max-w-none dark:prose-invert">
      <MDXRemote source={source} components={components} />
    </div>
  );
}

