import {readFile} from "node:fs/promises";

import {put} from "@vercel/blob";

async function main() {
  const [, , filePath, targetName, contentType] = process.argv;

  if (!filePath || !targetName || !contentType) {
    console.error('Usage: node scripts/upload-file.mjs <filePath> <targetName> <contentType>');
    process.exit(1);
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error("BLOB_READ_WRITE_TOKEN n'est pas défini.");
    process.exit(1);
  }

  const data = await readFile(filePath);
  const result = await put(targetName, data, {
    access: 'public',
    contentType,
    token,
    addRandomSuffix: true,
  });

  console.log(JSON.stringify(result));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
