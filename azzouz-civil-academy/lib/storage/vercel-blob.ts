import {Buffer} from 'node:buffer';

import {head, put} from '@vercel/blob';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!BLOB_TOKEN) {
  console.warn('BLOB_READ_WRITE_TOKEN is not set. Upload and download features will be disabled.');
}

type UploadFileInput = {
  fileName: string;
  data: Buffer | ArrayBuffer;
  contentType: string;
};

type UploadFileResult = {
  key: string;
  url: string;
  downloadUrl: string;
};

export async function uploadFile({fileName, data, contentType}: UploadFileInput): Promise<UploadFileResult> {
  if (!BLOB_TOKEN) {
    throw new Error('Missing BLOB_READ_WRITE_TOKEN environment variable.');
  }

  const targetPath = `documents/${fileName}`;
  const body = data instanceof Buffer ? data : Buffer.from(new Uint8Array(data));
  const result = await put(targetPath, body, {
    access: 'public',
    contentType,
    token: BLOB_TOKEN,
    addRandomSuffix: true,
  });

  return {
    key: result.pathname,
    url: result.url,
    downloadUrl: result.downloadUrl,
  };
}

export async function getSignedDownloadUrl(pathname: string): Promise<string> {
  if (!BLOB_TOKEN) {
    throw new Error('Missing BLOB_READ_WRITE_TOKEN environment variable.');
  }

  const metadata = await head(pathname, {token: BLOB_TOKEN});
  return metadata.downloadUrl;
}

