'use client';

import {useState} from 'react';

import {useTranslations} from 'next-intl';

type DownloadButtonProps = {
  documentId: string;
  variant?: 'primary' | 'secondary';
};

export function DownloadButton({documentId, variant = 'primary'}: DownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('common');

  async function handleClick() {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/download/${documentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch signed URL');
      }
      const data = await response.json();
      if (data?.url) {
        window.location.href = data.url as string;
      }
    } catch (error) {
      console.error(error);
      alert(t('downloadError'));
    } finally {
      setIsLoading(false);
    }
  }

  const baseClass = 'inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';
  const styles =
    variant === 'primary'
      ? 'bg-accent text-white shadow-soft hover:scale-[1.01]'
      : 'border border-[var(--border)] text-[var(--foreground)] hover:border-accent hover:text-accent';

  return (
    <button type="button" onClick={handleClick} disabled={isLoading} className={`${baseClass} ${styles}`}>
      {isLoading ? t('loading') : t('download')}
    </button>
  );
}

