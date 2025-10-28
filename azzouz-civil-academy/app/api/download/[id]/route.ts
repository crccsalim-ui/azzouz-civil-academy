import {NextResponse} from 'next/server';

import {getDocumentById} from '@/lib/content/documents';
import {getSignedDownloadUrl} from '@/lib/storage/vercel-blob';

type RouteContext = {
  params: Promise<{id: string}>;
};

export async function GET(_: Request, {params}: RouteContext) {
  const {id} = await params;
  const document = await getDocumentById(id);

  if (!document) {
    return NextResponse.json({error: 'Document not found'}, {status: 404});
  }

  if (document.distribution_mode !== 'host_file' || !document.file?.storage_key) {
    return NextResponse.json({error: 'Document does not have a hosted file'}, {status: 400});
  }

  try {
    const url = await getSignedDownloadUrl(document.file.storage_key);
    return NextResponse.json({url});
  } catch (error) {
    console.error(error);
    return NextResponse.json({error: 'Failed to generate signed URL'}, {status: 500});
  }
}
